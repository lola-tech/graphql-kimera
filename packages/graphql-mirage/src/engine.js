const { get, merge, times } = require("lodash");
const MultiKeyMap = require("multikeymap");

const {
  hasProp,
  isUndefined,
  getDebugger,
  getEnumVal,
  getConcreteType,
  isEnumType,
  isCustomScalarType,
  isObjectType,
  isAbstractType,
  isBuiltInScalarType,
  // getScenarioFn,
  // debugCacheDuplicates,
} = require("./helpers");
const constants = require("./constants");

const DEFAULT_ARRAY_LENGTH = 3;
const DEBUGGING = false;
const debug = getDebugger(DEBUGGING);

const defaultBuilders = {
  [constants.ID]: () => "Mocked ID Scalar",
  [constants.string]: () => "Mocked String Scalar",
  [constants.int]: () => 42,
  [constants.float]: () => 4.2,
  [constants.boolean]: () => true,
  [constants.scalar]: () => "Mocked Custom Scalar",
};

// This returns a function that mocks data for a specific field using
// a factory function. That factory function passed as an argument
// is used to mock data taking into consideration the possibility
// that the field may be a list field.
const getFieldMockBuilderFactoryFn = (isFieldArray, scenario) => (
  fieldMockFactoryFn
) =>
  isFieldArray
    ? times(
        Array.isArray(scenario) ? scenario.length : DEFAULT_ARRAY_LENGTH,
        fieldMockFactoryFn
      )
    : fieldMockFactoryFn();

// The function that mocks data for a specific field taking into
// consideration the various data sources that were passed.
function mockField(field, schema, dataSources) {
  const { scenario, nameBuilders, typeBuilders } = dataSources;
  const buildFieldMock = getFieldMockBuilderFactoryFn(field.isArray, scenario);

  // If it is a leaf field (if it is a scalar or an enum) then
  // we will generate data for the field directly, by using its
  // highest priority found data source.
  if (!isObjectType(field.type, schema)) {
    if (!isUndefined(scenario)) {
      // Highest Priority data source: Scenario
      return buildFieldMock((index) => {
        if (!isUndefined(index) && !Array.isArray(scenario)) {
          throw new Error(
            `Scenario value for "${field.name}" expected to be array.`
          );
        }
        return isUndefined(index) ? scenario : scenario[index];
      });
    } else if (get(nameBuilders, field.name)) {
      // If Scenario doesn't exist look for a Name Builder.
      return buildFieldMock(nameBuilders[field.name]);
    } else if (get(typeBuilders, field.type)) {
      // If no Scenario or Name Builder exists,
      // look for a for a customly defined Type Builder.
      return buildFieldMock(typeBuilders[field.type]);
    } else if (isEnumType(field.type, schema)) {
      // If code got here, then no custom data sources could be found,
      // so for enums select the first value found in the schema values.
      return buildFieldMock(() => getEnumVal(field.type, schema));
    } else if (isCustomScalarType(field.type, schema)) {
      // If code got here, then no custom data sources could be found,
      // so for custom scalars use "Mocked Custom Scalar" string.
      return buildFieldMock(defaultBuilders[schema[field.type].type]);
    } else if (isBuiltInScalarType(field.type)) {
      // If code got here, then no custom data sources could be found,
      // so for built-in scalars use a value defined in `defaultBuilders`.
      return buildFieldMock(defaultBuilders[field.type]);
    }
  }

  // If it's an Object Type, mock each of its fields.
  return buildFieldMock((index) =>
    mockObjectType(
      field.type,
      schema,
      scenario && !isUndefined(index)
        ? {
            ...dataSources,
            scenario: scenario[index],
          }
        : dataSources,
      index
    )
  );
}

const cacheStore = new MultiKeyMap();
cacheStore.getCacheKeyFromField = (field, arrayIndex) => {
  // TODO: In the future, add noNullArray and noNull if these
  // will matter for data generation.
  if (field.isArray) {
    return `[${field.type}]`;
  }

  // Make ids of items part of a list unique
  return Number.isInteger(arrayIndex) && field.type === "ID"
    ? `${field.type}[${arrayIndex}]`
    : field.type;
};

const getCache = (fieldKey, dataSources) => {
  if (cacheStore.get([fieldKey, ...Object.values(dataSources)])) {
    return cacheStore.get([fieldKey, ...Object.values(dataSources)]);
  }

  // Performance debugging
  // debugCacheDuplicates(cacheStore, {
  //   type,
  //   scenario,
  //   showDifferenceForType: 'ExpendableMenuItem',
  // });
  return undefined;
};

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

// Takes a schema type, and mocks data for each of its fields by using
// the `mockField` function.
function mockObjectType(type, schema, dataSources, arrayIndex = false) {
  let { scenario, nameBuilders, typeBuilders } = dataSources;

  const mockedObjectType = { __typename: getTypename(type, schema, scenario) };

  debug(`${type}`);

  const typeFieldsBuilders =
    typeBuilders && typeBuilders[type] && typeBuilders[type]();

  schema[type].fields.forEach((field) => {
    // Dacă nu este scenario, dar este type builder,
    // si nu-i resolver factory, muta valoarea in scenario
    // ALTERNATIVA: compute scenario early on, do it using
    // getScenarioFn
    if (
      hasProp(typeFieldsBuilders, field.name) &&
      !hasProp(scenario, field.name) &&
      // If function, this is meant to be a resolver
      typeof typeFieldsBuilders[field.name] !== "function"
    ) {
      scenario = isUndefined(scenario) ? {} : scenario;
      scenario[field.name] = typeFieldsBuilders[field.name];
    }

    let data = null;
    let fieldScenario;

    // We should validate the scenario, which we compute above
    // This validation should happen before merging the typeBuilder over it
    // Validation should check wether the field is nullable and wether the scenario
    // sets the field as null
    // This validation should probably happen at the level of mockField
    if (
      field.noNull ||
      // if no scenario, or scenario isn't null
      !hasProp(scenario, field.name) ||
      scenario[field.name] !== null
    ) {
      // if (field.isArray) {
      //   debug(undefined, `${field.name}: [${field.type}]`);
      // } else {
      //   debug(undefined, `${field.name}: ${field.type}`);
      // }

      fieldScenario = get(scenario, field.name);

      const cache = getCache(
        cacheStore.getCacheKeyFromField(field, arrayIndex),
        { ...dataSources, scenario: fieldScenario }
      );

      if (typeof cache !== "undefined") {
        data = cache;
      } else {
        data = mockField(field, schema, {
          scenario: fieldScenario,
          nameBuilders,
          typeBuilders,
        });

        cacheStore.set(
          [
            cacheStore.getCacheKeyFromField(field, arrayIndex),
            {
              ...dataSources,
              scenario: fieldScenario,
            },
          ],
          data
        );
      }
    }

    if (isUndefined(data)) {
      throw new Error(`Type "${field.type}" not found in document.`);
    } else if (
      hasProp(typeFieldsBuilders, field.name) &&
      typeof typeFieldsBuilders[field.name] === "function"
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
          return mockObjectType(type, schema, {
            scenario: merge(fieldScenario, customScenario),
            typeBuilders,
            nameBuilders,
          });
        }
      );

      fieldResolver.getData = store.get;

      Object.defineProperty(mockedObjectType, field.name, {
        get() {
          return fieldResolver;
        },
        set(value) {
          store.data = value;
        },
        enumerable: true,
      });
    } else {
      mockedObjectType[field.name] = data;
    }
  });
  return mockedObjectType;
}

module.exports = {
  mockField,
  mockObjectType,
  defaultBuilders,
};
