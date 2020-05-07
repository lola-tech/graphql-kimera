const { mergeWith, memoize } = require("lodash");

const constants = require("./constants");

// Scalar Helpers
const isBuiltInScalarType = (type) =>
  [
    constants.int,
    constants.float,
    constants.string,
    constants.boolean,
    constants.ID,
  ].includes(type);
const isCustomScalarType = (type, schema) =>
  schema[type] && schema[type].type === constants.customScalar;
const isScalarType = (type, schema) =>
  isCustomScalarType(type, schema) || isBuiltInScalarType(type);
// Enums
const getEnumVal = (type, schema) => schema[type].values[0];
const isEnumType = (type, schema) =>
  schema[type] && schema[type].values.length > 0;
// Object Types
const isObjectType = (type, schema) =>
  !isScalarType(type, schema) && !isEnumType(type, schema);
// Abstract Types
const isInterfaceType = (type, schema) =>
  schema[type] && schema[type].type === constants.interface;
const isUnionType = (type, schema) =>
  schema[type] && schema[type].types.length > 0;
const isAbstractType = (type, schema) =>
  isUnionType(type, schema) || isInterfaceType(type, schema);
const getUnionVal = (type, schema) => schema[type].types[0];
const getUnionVals = (type, schema) => schema[type].types;
const getConcreteType = (type, schema) => {
  if (isInterfaceType(type, schema)) {
    // https://github.com/EasyGraphQL/easygraphql-parser/issues/9
    return schema[type].implementedTypes[0];
  } else if (isUnionType(type, schema)) {
    return getUnionVal(type, schema);
  }
};

const getAppendedPath = (path, field, type) => {
  const typePrefix = (!path && `${type}:`) || "";
  return typePrefix + path + (path ? "." : "") + field.name;
};

const getScenarioFn = (defaultScenario = {}) =>
  memoize(function getScenario(customScenario = {}) {
    return mergeWith(
      {},
      defaultScenario,
      customScenario,
      (defaultVal, newVal) => (Array.isArray(defaultVal) ? newVal : undefined)
    );
  }, JSON.stringify);

const getBuildersFn = (defaults = {}) =>
  memoize(function getBuilders(builders = {}) {
    return {
      ...defaults,
      ...builders,
    };
  }, JSON.stringify);

const mergeMockProviders = (defaults = {}, custom = {}) => {
  return {
    scenario: getScenarioFn(defaults.scenario)(custom.scenario),
    builders: getBuildersFn(defaults.builders)(custom.builders),
  };
};

module.exports = {
  getUnionVal,
  getUnionVals,
  getEnumVal,
  getConcreteType,
  isEnumType,
  isBuiltInScalarType,
  isCustomScalarType,
  isScalarType,
  isUnionType,
  isInterfaceType,
  isAbstractType,
  getScenarioFn,
  getBuildersFn,
  mergeMockProviders,
  isObjectType,
  getAppendedPath,
};
