const {
  merge,
  isUndefined,
  isFunction,
  isNull,
  times,
  get,
  partialRight,
} = require("lodash");
const { map } = require("lodash/fp");

const { validateBuilder, validateScenario } = require("./validation");
const { executeAndCache } = require("./caching");
const {
  // getDebugger,
  getEnumVal,
  getConcreteType,
  isEnumType,
  isCustomScalarType,
  isObjectType,
  isAbstractType,
  isBuiltInScalarType,
  mergeScenarios,
  // debugCacheDuplicates,
} = require("./helpers");
const constants = require("./constants");

const DEFAULT_ARRAY_LENGTH = 3;
// const DEBUGGING = false;
// const debug = getDebugger(DEBUGGING);

const defaultBuilders = {
  [constants.ID]: () => "Mocked ID Scalar",
  [constants.string]: () => "Mocked String Scalar",
  [constants.int]: () => 42,
  [constants.float]: () => 4.2,
  [constants.boolean]: () => true,
  [constants.customScalar]: () => "Mocked Custom Scalar",
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
const getFieldMockBuilderFactoryFn = (field, scenario) => (
  fieldMockFactoryFn
) =>
  field.isArray
    ? times(
        Array.isArray(scenario) ? scenario.length : DEFAULT_ARRAY_LENGTH,
        fieldMockFactoryFn
      )
    : fieldMockFactoryFn();

/**
 * Reduces user defined data sources to a single scenario object.
 *
 * @see mockField
 *
 * @param {Object} field The parsed schema field object.
 * @param {Object} dataSources An object with the Scenario and the Builders.
 * @returns {Object} Returns the merged data sources scenario.
 */
const reduceDataSourcesToScenario = (field, { scenario, builders }) => {
  if (isNull(scenario)) {
    return null;
  }

  const getBuilderScenario = (builders, field) => {
    const builder = get(builders, field.type);
    return validateBuilder(builder, field) && builder && builder();
  };

  const builderScenario = getBuilderScenario(builders, field);

  if (field.isArray) {
    if (Array.isArray(scenario)) {
      // If we have a user defined array scenario,
      // merge each array element with the builderScenario
      return map(partialRight(mergeScenarios, builderScenario))(scenario);
    } else if (!isUndefined(scenario)) {
      // If scenario is defined as something other than an array
      // return it so we can throw a TypeError at validation.
      return scenario;
    }

    // Otherwise create a scenario out of the builderScenario
    return !isUndefined(builderScenario)
      ? times(DEFAULT_ARRAY_LENGTH, () => builderScenario)
      : undefined;
  }

  return mergeScenarios(scenario, builderScenario);
};

/**
 * Mocks data for a specific field that into consideration the various
 * data sources that were passed. Does this recursively for Object Type fields.
 *
 * @param {Object} field The parsed schema field object.
 * @param {Object} schema The parsed schema.
 * @param {Object} dataSources An object with the Scenario and the Builders.
 * @param {Object} depth The Query depth of the mocked field.
 * @param {Object} path The field path through the Query object. E.g: me.address.city
 * @returns {*} Returns the mocked value for the field.
 */
function mockField(field, schema, dataSources, depth, path) {
  // Reduce custom data sources to a single scenario which represents
  // the single source of truth for how the user wants to customize the mocks.
  const reducedScenario = reduceDataSourcesToScenario(field, dataSources);
  const buildFieldMock = getFieldMockBuilderFactoryFn(field, reducedScenario);
  validateScenario(reducedScenario, field, path);

  // If the user wants this field to be null, let it be.
  if (isNull(reducedScenario)) {
    return null;
  }

  // For types without sub-fields like Scalar and Enumeration types,
  // return the value directly.
  if (!isObjectType(field.type, schema)) {
    // If a user defined value is defined, return that.
    if (!isUndefined(reducedScenario)) {
      return buildFieldMock((index) =>
        isUndefined(index) ? reducedScenario : reducedScenario[index]
      );
    }

    // If code got here, then no user defined data sources could be found,
    // so depending on the field type, use a different strategy to mock data.

    if (isEnumType(field.type, schema)) {
      // For Enumeration types select the first possible value defined in the
      // schema.
      return buildFieldMock(() => getEnumVal(field.type, schema));
    } else if (isCustomScalarType(field.type, schema)) {
      // For custom scalars use the "Mocked Custom Scalar" string.
      return buildFieldMock(defaultBuilders[constants.customScalar]);
    } else if (isBuiltInScalarType(field.type)) {
      // For built-in scalars use the respective Scalar value
      // defined in `defaultBuilders`.
      return buildFieldMock(defaultBuilders[field.type]);
    }
  }

  // For Object Types, mock each of their fields.
  return buildFieldMock((index) =>
    mockObjectType(
      field.type,
      schema,
      {
        ...dataSources,
        scenario:
          !isUndefined(index) && Array.isArray(reducedScenario)
            ? reducedScenario[index]
            : reducedScenario,
      },
      index,
      depth,
      path
    )
  );
}

/**
 * Decides on a GraphQL Type "__typename" value by having a strategy
 * for abstract fields: If a value is set in a data source, select that,
 * otherise, select the first concrete type defined in the schema.
 *
 * @see mockObjectType
 *
 * @param {String} type The GraphQL Type name for which we need the __typename
 * @param {Object} schema The parsed schema.
 * @param {Object} scenario The scenario for field attempted to be mocked.
 * @returns {string} Returns the __typename value.
 */
const getTypename = (type, schema, scenario) => {
  // Allow selecting concrete types for abstract types
  type = get(scenario, "__typename") || type;

  if (isAbstractType(type, schema)) {
    const concreteType = getConcreteType(type, schema);
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
 * Takes an Object Type, and mocks data for each of its fields by using
 * the `mockField` function.
 *
 * @see mockField
 *
 * @param {String} type The GraphQL Type name for which we need the __typename
 * @param {Object} schema The parsed schema.
 * @param {Object} dataSources An object with the Scenario and the Builders.
 * @param {number} arrayIndex If the current type is mocked as part of a list, its index.
 * @param {Object} depth The Query depth of the mocked field whose type we are mocking.
 * @param {Object} path The field path through the Query object. E.g: me.address.city
 * @returns {Object} Returns the mocked Object Type.
 */
function mockObjectType(
  type,
  schema,
  dataSources,
  arrayIndex = false,
  depth = 0,
  path = ""
) {
  if (!schema[type]) {
    throw new Error(`Type "${type}" not found in schema.`);
  }

  let { scenario, builders } = dataSources;

  const mockedObjectType = { __typename: getTypename(type, schema, scenario) };

  const builder = get(builders, type);
  const builderScenario = builder && builder();

  schema[type].fields.forEach((field) => {
    const newPath = path + field.name + `.`;
    const fieldDataSources = {
      ...dataSources,
      scenario: get(scenario, field.name),
    };

    const mockedField = executeAndCache(
      () => mockField(field, schema, fieldDataSources, depth + 1, newPath),
      // Used to compute the cache key
      field,
      arrayIndex,
      fieldDataSources
    );

    if (builderScenario && isFunction(builderScenario[field.name])) {
      const store = {
        mockedField,
        get: function () {
          return store.mockedField;
        },
      };

      const fieldResolver = builderScenario[field.name](
        store.get,
        function buildMocks(type, customScenario = {}) {
          return mockObjectType(type, schema, {
            ...fieldDataSources,
            scenario: merge(fieldDataSources.scenario, customScenario),
          });
        }
      );

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
}

module.exports = {
  mockField,
  mockObjectType,
  defaultBuilders,
  reduceDataSourcesToScenario,
};
