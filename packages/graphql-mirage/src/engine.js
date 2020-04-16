const { merge, times, random } = require('lodash');
const MultiKeyMap = require('multikeymap');

const {
  hasProp,
  isUndefined,
  getDebugger,
  getEnumVal,
  getConcreteType,
  isEnumType,
  isScalarType,
  isBuiltInScalarType,
  isInterfaceType,
  isUnionType,
  getUnionVal,
  // debugCacheDuplicates,
} = require('./helpers');
const constants = require('./constants');

const DEFAULT_ARRAY_LENGTH = 3;
const DEBUGGING = false;
const debug = getDebugger(DEBUGGING);

const defaultBuiltInScalarBuilders = {
  [constants.ID]: () => Math.random().toString(36).substr(2, 9),
  [constants.string]: () => 'GENERATED_STRING',
  [constants.int]: () => random(0, 1000),
  [constants.float]: () => random(0.1, 1000.1),
  [constants.boolean]: () => [true, false][random(0, 1)],
};

function createData(field, schema, dataSources) {
  const { scenario, nameBuilders, typeBuilders } = dataSources;

  let arrayLength =
    field.isArray && Array.isArray(scenario)
      ? scenario.length
      : DEFAULT_ARRAY_LENGTH;

  // Hold the function used to generate array fields in `arrayBuilderFn`, and
  // the value in `singleValue` for non-array fields.
  let arrayBuilderFn, singleValue;
  // Generating data only at the leafs of the tree, ie. when the field
  // is a built-in scalar (ID, String, Int, Float, Boolean), a custom scalar , or an enum.
  if (
    isBuiltInScalarType(field.type) ||
    isEnumType(field.type, schema) ||
    isScalarType(field.type, schema)
  ) {
    if (!isUndefined(scenario)) {
      arrayBuilderFn = function customArrayBuilder(index) {
        if (!Array.isArray(scenario)) {
          throw new Error(
            `Scenario value for "${field.name}" expected to be array.`
          );
        }
        return scenario[index];
      };
      singleValue = () => scenario;
    } else if (nameBuilders && nameBuilders[field.name]) {
      arrayBuilderFn = function fieldNameArrayBuilder() {
        const builder = nameBuilders[field.name];
        return typeof builder === 'function' ? builder() : builder;
      };
      singleValue = arrayBuilderFn;
    } else if (isEnumType(field.type, schema)) {
      arrayBuilderFn = function enumArrayBuilder() {
        return getEnumVal(field.type, schema);
      };
      singleValue = arrayBuilderFn;
    } else if (typeBuilders[field.type]) {
      // TODO: Merge with nameBuilders if branch after tests pass,
      // but don't forget that we can always expect typeBuilders,
      // but nameBuilders may not exist (useful for the if condition)
      arrayBuilderFn = function fieldTypeArrayBuilder() {
        const builder = typeBuilders[field.type];
        return typeof builder === 'function' ? builder() : builder;
      };
      singleValue = arrayBuilderFn;
      // arrayBuilderFn = typeBuilders[field.type];
      // singleValue = arrayBuilderFn();
    } else if (isScalarType(field.type, schema)) {
      arrayBuilderFn = function defaultScalarArrayBuilder() {
        return 'Random Scalar Value';
      };
      singleValue = arrayBuilderFn;
    }
  } else if (schema[field.type]) {
    // If it's a Object Type, ie. defined by us in our schema, mock it.
    // The mocking function will run this function for each of the type fields.
    arrayBuilderFn = function objectTypeArrayBuilder(index) {
      const itemScenario = scenario ? scenario[index] : scenario;
      return mockType(
        field.type,
        schema,
        {
          ...dataSources,
          scenario: itemScenario,
        },
        index
      );
    };
    singleValue = () => mockType(field.type, schema, dataSources);
  }

  return field.isArray ? times(arrayLength, arrayBuilderFn) : singleValue();
}

const cacheStore = new MultiKeyMap();
cacheStore.getCacheKeyFromField = (field, arrayIndex) => {
  // TODO: In the future, add noNullArray and noNull if these
  // will matter for data generation.
  if (field.isArray) {
    return `[${field.type}]`;
  }

  // Make ids of items part of a list unique
  return Number.isInteger(arrayIndex) && field.type === 'ID'
    ? `${field.type}[${arrayIndex}]`
    : field.type;
};

// Takes a schema type, and mocks data for each of its fields by using
// the `createData` function.
function mockType(type, schema, dataSources, arrayIndex = false) {
  let { scenario, nameBuilders, typeBuilders } = dataSources;

  // Allow setting more concrete implementation of interface types in scenarios
  type = (scenario && scenario.__typename) || type;

  if (isInterfaceType(type, schema)) {
    // https://github.com/EasyGraphQL/easygraphql-parser/issues/9
    const concreteType = getConcreteType(type, schema);
    if (!concreteType) {
      throw new Error(
        `Your schema doesn't have any type that implements the Interface "${type}".\n` +
          `Either remove the unused interface "${type}", or add a concrete implementation of it to the schema.`
      );
    }
    type = concreteType;
  } else if (isUnionType(type, schema)) {
    type = getUnionVal(type, schema);
  }

  debug(`${type}`);

  const mockedField = { __typename: type };

  let typeFieldsBuilders =
    typeBuilders && typeBuilders[type] && typeBuilders[type]();

  if (schema[type].fields.length) {
    schema[type].fields.forEach((field) => {
      if (
        hasProp(typeFieldsBuilders, field.name) &&
        !hasProp(scenario, field.name) &&
        // If function, this is meant to be a resolver
        typeof typeFieldsBuilders[field.name] !== 'function'
      ) {
        scenario = isUndefined(scenario) ? {} : scenario;
        scenario[field.name] = typeFieldsBuilders[field.name];
      }
      let data = null;
      let fieldScenario;

      if (
        field.noNull ||
        !hasProp(scenario, field.name) ||
        scenario[field.name] !== null
      ) {
        if (field.isArray) {
          debug(undefined, `${field.name}: [${field.type}]`);
        } else {
          debug(undefined, `${field.name}: ${field.type}`);
        }

        const getCache = (fieldKey, nameBuilders, typeBuilders, scenario) => {
          if (
            cacheStore.get([fieldKey, nameBuilders, typeBuilders, scenario])
          ) {
            return cacheStore.get([
              fieldKey,
              nameBuilders,
              typeBuilders,
              scenario,
            ]);
          }

          // Performance debugging
          // debugCacheDuplicates(cacheStore, {
          //   type,
          //   scenario,
          //   showDifferenceForType: 'ExpendableMenuItem',
          // });
          return undefined;
        };

        fieldScenario = hasProp(scenario, field.name)
          ? scenario[field.name]
          : undefined;

        const cache = getCache(
          cacheStore.getCacheKeyFromField(field, arrayIndex),
          nameBuilders,
          typeBuilders,
          fieldScenario
        );

        if (typeof cache !== 'undefined') {
          data = cache;
        } else {
          data = createData(field, schema, {
            scenario: hasProp(scenario, field.name)
              ? scenario[field.name]
              : undefined,
            nameBuilders,
            typeBuilders,
          });

          cacheStore.set(
            [
              cacheStore.getCacheKeyFromField(field, arrayIndex),
              nameBuilders,
              typeBuilders,
              fieldScenario,
            ],
            data
          );
        }
      }

      if (isUndefined(data)) {
        throw new Error(`Type "${field.type}" not found in document.`);
      } else if (
        hasProp(typeFieldsBuilders, field.name) &&
        typeof typeFieldsBuilders[field.name] === 'function'
      ) {
        const store = {
          data,
          get: function () {
            return store.data;
          },
        };

        const fieldResolver = typeFieldsBuilders[field.name](
          store.get,
          function buildMocks(type, customScenario = {}) {
            return mockType(type, schema, {
              scenario: merge(fieldScenario, customScenario),
              typeBuilders,
              nameBuilders,
            });
          }
        );

        fieldResolver.getData = store.get;

        Object.defineProperty(mockedField, field.name, {
          get() {
            return fieldResolver;
          },
          set(value) {
            store.data = value;
          },
          enumerable: true,
        });
      } else {
        mockedField[field.name] = data;
      }
    });
  }
  return mockedField;
}

module.exports = {
  createData,
  mockType,
  defaultBuiltInScalarBuilders,
};
