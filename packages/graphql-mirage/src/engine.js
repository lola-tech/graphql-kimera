const {
  memoize,
  isFunction,
  isUndefined,
  isNull,
  times,
  get,
} = require("lodash");
const MultiKeyMap = require("multikeymap");

const { validateFieldScenario } = require("./validation");
const {
  getEnumVal,
  getConcreteType,
  isEnumType,
  isCustomScalarType,
  isObjectType,
  isAbstractType,
  isBuiltInScalarType,
  getAppendedPath,
} = require("./helpers");
const {
  mergeScenarios,
  reduceToScenario,
  useResolver,
  isResolverScenario,
} = require("./scenarios");
const constants = require("./constants");

const DEFAULT_ARRAY_LENGTH = 3;
const RECURSIVITY_DEPTH_LIMIT = 200;
// Used to track the potentially recursive branch so we
// can warn the user.
let recursiveBranch = "";

const defaultMockProviders = {
  [constants.ID]: "Mocked ID Scalar",
  [constants.string]: "Mocked String Scalar",
  [constants.int]: 42,
  [constants.float]: 4.2,
  [constants.boolean]: true,
  [constants.customScalar]: "Mocked Custom Scalar",
};

/**
 * This returns a function that accepts a mocks factory function as an argument.
 * The argument function is used to mock data taking into consideration the
 * possibility that the field may be a List.
 *
 * @see mockField
 *
 * @param {Object} field The parsed schema field object.
 * @param {Object} scenario The field user defined scenario object.
 * @returns {Function} The function that can be used to mock data for the field.
 */

/**
 * Mocks a specific field taking into consideration the various mock providers
 * that were passed. Does this recursively for Object Type fields.
 *
 * @param {Object} field The parsed schema field object.
 * @param {Object} schema The parsed schema.
 * @param {Object} mockProviders An object with the Scenario and the Builders.
 * @param {Object} depth The Query depth of the mocked field.
 * @param {Object} path Field path through the mocked type. E.g: Query:me.name
 * @returns {*} Returns the mocked value for the field.
 */

const mockObjectType = (
  type,
  schema,
  mockProviders,
  { depth = 0, arrayIndex = false, path = "" } = {}
) => {
  // Initialize the object that will hold the mocked data.
  const mockedObjectType = {
    __typename: type,
  };

  // Mock every Object Type field
  schema[type].fields.forEach((field) => {
    // Compute a new string path for this field to be used in validation errors.
    // e.g. Query:me.address.city
    const fieldPath = getAppendedPath(path, field, type);

    if (
      depth > RECURSIVITY_DEPTH_LIMIT &&
      (!recursiveBranch || !path.includes(recursiveBranch))
    ) {
      console.warn(
        `Risk of "Maximum call stack size exceeded" error. Mocking depth exceeded "${RECURSIVITY_DEPTH_LIMIT}". This might be caused by a recursive field. You need to explicitly mock this in order to limit depth.\nWarning triggered by mocking: "${path}...".`
      );
      recursiveBranch = path;
    }

    let fieldScenario = get(mockProviders.scenario, field.name);
    const fieldMockProviders = {
      ...mockProviders,
      scenario: fieldScenario,
    };

    // Custom resolvers are only allowed in Object Type fields
    let resolverFactoryFn = undefined;
    if (isResolverScenario(fieldScenario)) {
      resolverFactoryFn = fieldScenario.resolverFactory;
      fieldMockProviders.scenario = fieldScenario.scenario;
    }

    const mockedField = mockType(field.type, schema, fieldMockProviders, {
      isListType: field.isArray,
      arrayIndex,
      depth: depth + 1,
      path: fieldPath,
      field,
    });

    if (resolverFactoryFn) {
      const store = {
        mockedField,
        get: function () {
          return store.mockedField;
        },
      };

      const fieldResolver = resolverFactoryFn(
        store.get,
        (type, customScenario = {}) =>
          mockType(type, schema, {
            ...fieldMockProviders,
            scenario: mergeScenarios(
              customScenario,
              fieldMockProviders.scenario
            ),
          })
      );

      if (!isFunction(fieldResolver)) {
        throw new TypeError(
          `The argument passed to "useResolver" for field "${path}" is a simple function "() => {}", and needs to be a resolver factory function "() => () => {}"`
        );
      }

      fieldResolver.getData = store.get;

      Object.defineProperty(mockedObjectType, field.name, {
        get() {
          return fieldResolver;
        },
        set(value) {
          store.mockedField = value;
        },
        enumerable: true,
      });
    } else {
      mockedObjectType[field.name] = mockedField;
    }
  });

  return mockedObjectType;
};

/**
 * Decides on a GraphQL Type "__typename" value by having a strategy for
 * abstract fields: If a value is set in a mock provider, select that, otherise,
 * select the first concrete type defined in the schema.
 *
 * @see mockType
 *
 * @param {String} type The GraphQL Type name for which we need the __typename
 * @param {Object} schema The parsed schema.
 * @param {Object} scenario The scenario for field attempted to be mocked.
 * @returns {string} Returns the __typename value.
 */
const getTypename = (type, schema, scenario, isListType, arrayIndex) => {
  // Allow selecting concrete types for abstract types
  type =
    get(scenario, isListType ? `[${arrayIndex}].__typename` : "__typename") ||
    type;

  if (isAbstractType(type, schema)) {
    const concreteType = getConcreteType(type, schema);
    // if (type === "Node") {
    //   console.log(path, concreteType);
    // }
    if (!concreteType) {
      throw new Error(
        `Your schema doesn't have any type that implements the Interface "${type}".\n` +
          `Either remove the unused interface "${type}", or add a concrete implementation of it to the schema.`
      );
    }
    return concreteType;
  }

  return type;
};

/**
 * Takes an Object Type, and mocks data for each of its fields by using the
 * `mockField` function.
 *
 * @see mockField
 *
 * @param {String} type The GraphQL Type name for which we need the __typename
 * @param {Object} schema The parsed schema.
 * @param {Object} mockProviders An object with the user-defined Scenario and
 * the Builders.
 * @param {number} arrayIndex If the current type is mocked as part of a list,
 * its index.
 * @param {Object} depth The Query depth of the mocked field whose type we are
 * mocking.
 * @param {Object} path The field path through the Query object. E.g:
 * me.address.city
 * @returns {Object} Returns the mocked Object Type.
 */
function _mockType(type, schema, mockProviders = {}, meta = {}) {
  // console.log("---------");
  const {
    depth = 0,
    arrayIndex = false,
    path = "",
    noNull = false,
    isListType = false,
    field = {},
  } = meta;

  if (!schema[type] && !isBuiltInScalarType(type)) {
    throw new Error(`Type "${type}" not found in schema.`);
  }

  if (
    !depth &&
    (isFunction(mockProviders.scenario) ||
      isResolverScenario(mockProviders.scenario))
  ) {
    throw new TypeError(
      `mockProviders.Root scenario for "${type}" cannot be a function or a ResolverScenario. Supplied a "${
        isFunction(mockProviders.scenario) ? "function" : "ResolverScenario"
      }".`
    );
  }

  // Reduce the Scenario and the Builders to a single scenario which represents
  // the single source of truth for how the user wants to mock this field.
  const reducedScenario = reduceToScenario(
    { name: field.name, type, isArray: isListType },
    mockProviders,
    path
  );

  // Validate the redcuces scenario
  validateFieldScenario(
    reducedScenario,
    { ...field, isArray: isListType },
    path
  );

  if (isNull(reducedScenario)) {
    return null;
  }

  if (isListType) {
    return times(
      Array.isArray(reducedScenario)
        ? reducedScenario.length
        : DEFAULT_ARRAY_LENGTH,
      (index) => {
        return mockType(
          type,
          schema,
          {
            ...mockProviders,
            scenario: Array.isArray(reducedScenario)
              ? reducedScenario[index]
              : reducedScenario,
          },
          { ...meta, arrayIndex: index, isListType: false }
        );
      }
    );
  }

  // If an abstract field, select a concrete typename
  const typename = getTypename(
    type,
    schema,
    reducedScenario,
    isListType,
    arrayIndex
  );

  // For types without sub-fields like Scalar and Enumeration types, return the
  // value directly.
  if (!isObjectType(typename, schema)) {
    // If a user defined value is defined, return that.
    if (!isUndefined(reducedScenario)) {
      return reducedScenario;
    }

    // If code got here, then no user defined mock providers could be found, so
    // depending on the field type, use a different strategy to mock data.

    if (isEnumType(typename, schema)) {
      // For Enumeration types select the first possible value defined in the
      // schema.
      return getEnumVal(typename, schema);
    } else if (isCustomScalarType(typename, schema)) {
      // For custom scalars use the "Mocked Custom Scalar" string.
      return defaultMockProviders[constants.customScalar];
    } else if (isBuiltInScalarType(typename)) {
      // For built-in scalars use the respective Scalar value defined in
      // `defaultMockProviders`.
      return defaultMockProviders[typename];
    }
  }

  return mockObjectType(
    typename,
    schema,
    { ...mockProviders, scenario: reducedScenario },
    { depth, path }
  );
}

memoize.Cache = MultiKeyMap;
const mockType = memoize(
  (...args) => {
    // console.log("Generating for", args[0]);
    return _mockType(...args);
  },
  (_, __, mockProviders = {}, { field = {}, arrayIndex } = {}) => {
    const fieldKeyPart = field.isArray
      ? `[${field.type}]`
      : // Make ids of items part of a List unique
      Number.isInteger(arrayIndex) && field.type === constants.ID
      ? `${field.type}[${arrayIndex}]`
      : field.type;

    const key = [
      fieldKeyPart + (field.noNull ? "!" : ""),
      ...Object.values(mockProviders),
    ];

    // console.log(_, key);
    return key;
  }
);

module.exports = {
  mockType,
  defaultMockProviders,
  reduceToScenario,
  useResolver,
};
