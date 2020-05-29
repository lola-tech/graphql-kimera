const { validateFieldScenario } = require('./validation');
const {
  getConcreteMeta,
  getConcreteTypename,
  getEnumVal,
  isEnumType,
  isCustomScalarType,
  isObjectType,
  isBuiltInScalarType,
  getAppendedPath,
  memoize,
  isFunction,
  isUndefined,
  isNull,
  times,
  get,
} = require('./helpers');
const {
  mergeScenarios,
  reduceToScenario,
  mockResolver,
  isResolverScenario,
  mergeMockProviders,
} = require('./mockProviders');
const { initializeStore } = require('./store');
const {
  RECURSIVITY_DEPTH_LIMIT,
  DEFAULT_LIST_LENGTH,
  ...constants
} = require('./constants');

const defaultMockProviders = {
  [constants.ID]: 'Mocked ID Scalar',
  [constants.string]: 'Mocked String Scalar',
  [constants.int]: 42,
  [constants.float]: 4.2,
  [constants.boolean]: true,
  [constants.customScalar]: 'Mocked Custom Scalar',
};

/**
 * Mocks an Object Type by recursively mocking each of its fields.
 *
 * @see mockType
 *
 * @param {String} type The type that needs to be mocked
 * @param {Object} schema The parsed schema.
 * @param {Object} mockProviders An object with the user-defined Scenario and
 * the Builders.
 * @param {Object} meta An object containing meta information about the mocked
 * type. For the complete list of meta keys @see mockType.
 * @returns {Object} Returns the mocked Object Type.
 */
const mockObjectType = (type, schema, mockProviders, meta) => {
  // Initialize the object that will hold the mocked data.
  const mockedObjectType = {
    __typename: type,
  };

  // Mock every Object Type field
  schema[type].fields.forEach((field) => {
    // Compute a new string path for this field to be used in validation errors.
    // e.g. Query:me.address.city
    const fieldPath = getAppendedPath(meta.path, field, type);

    if (meta.depth + 1 > RECURSIVITY_DEPTH_LIMIT) {
      const message = `Mocking depth exceeded '${RECURSIVITY_DEPTH_LIMIT}'. If you want increase depth limit, you need to set the 'KIMERA_RECURSIVITY_DEPTH_LIMIT' environment variable. Mocking stopped at: '${meta.path}'.`;
      mockedObjectType[field.name] = () => {
        throw new Error(message);
      };
      mockedObjectType[field.name]['__mocks'] = initializeStore(message);
      return;
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
      ...field,
      arrayIndex: meta.arrayIndex,
      depth: meta.depth + 1,
      path: fieldPath,
    });

    // If a resolver factory has been defined in scenario,
    // make use of the resolver.
    if (resolverFactoryFn) {
      const resolverStore = initializeStore(mockedField);

      const fieldResolver = resolverFactoryFn(
        resolverStore,
        (type, customScenario = {}) =>
          mockType(type, schema, {
            ...fieldMockProviders,
            scenario: mergeScenarios(
              fieldMockProviders.scenario,
              customScenario
            ),
          })
      );

      if (!isFunction(fieldResolver)) {
        throw new TypeError(
          `The argument passed to "mockResolver" for field "${meta.path}" is a simple function "() => {}", and needs to be a resolver factory function "() => () => {}"`
        );
      }

      fieldResolver.__mocks = resolverStore;

      mockedObjectType[field.name] = fieldResolver;
    } else {
      mockedObjectType[field.name] = mockedField;
    }
  });

  return mockedObjectType;
};

/**
 * Takes any GraphQL type, and mocks data for it.
 *
 * @see mockObjectType
 *
 * @param {String} type The GraphQL Type that needs to be mocked.
 * @param {Object} schema The parsed schema.
 * @param {Object} mockProviders An object with the user-defined Scenario and
 * the Builders.
 * @param {Object} meta An object containing meta information about the field
 * that's being mocked. The important options that it contains:
 *  - {string} name: The name of the field for which this type is mocked.
 *  - {string} type: The GraphQL type.
 *  - {boolean} noNull: Wether the field for which this type is mocked is
 *    nullable.
 *  - {boolean} isArray: Wether this is a List type.
 *  - {number} arrayIndex: If the current type is mocked as part of a list, its
 *    index.
 *  - {Object} depth: The Query depth of the mocked field whose type we are
 *    mocking.
 *  - {Object} path: The field path through the Query object. E.g:
 *    me.address.city. Used for validation errors and debugging.
 * @returns {Object} Returns the mocked Object Type.
 */
const mockType = memoize(
  (type, schema, mockProviders = {}, meta = {}) => {
    meta = {
      type,
      depth: 1,
      path: '',
      ...meta,
    };

    if (!schema[type] && !isBuiltInScalarType(type)) {
      throw new Error(`Type "${type}" not found in schema.`);
    }

    if (
      meta.depth === 1 &&
      (isFunction(mockProviders.scenario) ||
        isResolverScenario(mockProviders.scenario))
    ) {
      throw new TypeError(
        `mockProviders.Root scenario for "${type}" cannot be a function or a ResolverScenario. Supplied a "${
          isFunction(mockProviders.scenario) ? 'function' : 'ResolverScenario'
        }".`
      );
    }

    // Reduce the Scenario and the Builders to a single scenario which represents
    // the single source of truth for how the user wants to mock this field.
    const reducedScenario = reduceToScenario(
      mockProviders,
      // Reducing the scenario requires using the builder for the correct type,
      // which means we need to make use of the current scenario, to determine
      // which is the concrete type, if this type is abstract.
      getConcreteMeta(meta, mockProviders.scenario, schema)
    );

    // Validate the reduced scenario
    validateFieldScenario(reducedScenario, meta);

    if (isNull(reducedScenario)) {
      return null;
    }

    if (meta.isArray) {
      return times(
        Array.isArray(reducedScenario)
          ? reducedScenario.length
          : DEFAULT_LIST_LENGTH,
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
            { ...meta, arrayIndex: index, isArray: false }
          );
        }
      );
    }

    // If an abstract field, select a concrete typename based on the reducedScenario
    const typename = getConcreteTypename(meta, reducedScenario, schema);

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
      meta
    );
  },
  function resolveMemoCacheKey(type, _, mockProviders = {}, meta = {}) {
    const fieldKeyPart = meta.isArray
      ? `[${type}]`
      : // Make ids of items part of a List unique
      Number.isInteger(meta.arrayIndex) && type === constants.ID
      ? `${type}[${meta.arrayIndex}]`
      : type;

    return [
      '__NODE__',
      fieldKeyPart + (meta.noNull ? '!' : ''),
      mockProviders.builders,
      mockProviders.scenario,
    ];
  }
);

/**
 * Mocks a specific type, and allows definition for default and custom mock
 * providers.
 *
 * @see mockType
 *
 * @param {String} type The GraphQL Type that needs to be mocked.
 * @param {Object} schema The parsed schema.
 * @param {Object} defaults The default mock providers that will be overwritten.
 * @param {Object} custom The overwriting mock providers.
 * @returns {Object} Returns the mocked Object Type.
 */
const buildMocks = (type, schema, defaults = {}, custom) =>
  mockType(type, schema, mergeMockProviders(defaults, custom));

module.exports = {
  mockType,
  buildMocks,
  defaultMockProviders,
  reduceToScenario,
  mockResolver,
};
