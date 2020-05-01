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
  schema[type] && schema[type].type === constants.scalar;
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

const isUndefined = (value) => typeof value === "undefined";
const hasProp = (object, prop) =>
  !isUndefined(object) && !isUndefined(object[prop]);

const getScenarioFn = (defaultScenario = {}) =>
  memoize(function getScenario(customScenario = {}) {
    return mergeWith(
      {},
      defaultScenario,
      customScenario,
      (defaultVal, newVal) => (Array.isArray(defaultVal) ? newVal : undefined)
    );
  }, JSON.stringify);

const getNameBuildersFn = (defaults = {}) =>
  memoize(function getNameBuilders(nameBuilders = {}) {
    return {
      ...defaults,
      ...nameBuilders,
    };
  }, JSON.stringify);

const getTypeBuildersFn = (defaults = {}) =>
  memoize(function getTypeBuilders(typeBuilders = {}) {
    return {
      ...defaults,
      ...typeBuilders,
    };
  }, JSON.stringify);

const mergeDataSources = (defaults = {}, custom = {}) => {
  return {
    scenario: getScenarioFn(defaults.scenario)(custom.scenario),
    nameBuilders: getNameBuildersFn(defaults.nameBuilders)(custom.nameBuilders),
    typeBuilders: getTypeBuildersFn(defaults.typeBuilders)(custom.typeBuilders),
  };
};

const getDebugger = (DEBUGGING) => {
  let debuggerState = {
    types: new Set(),
    fields: new Set(),
  };
  return function debug(type, field) {
    if (!DEBUGGING) return;
    console.log("DOES NOT WORK PROPERLY");
    const { types, fields } = debuggerState;
    const getSpaces = (size, char = "-") => {
      return size ? `${char.repeat(size)}` : "";
    };
    if (type) {
      types.add(type);
      console.log(
        `L${types.size - 1} ${getSpaces(types.size, "- ")} TYPE: ${type}`
      );
    } else if (field) {
      fields.add(field);

      console.log(
        `L${types.size - 1} ${getSpaces(types.size, " ")} FIELD: ${field}`
      );
    }
  };
};

// Displays duplicates in the cache, and what part of the key is different.
// Usually this happens for the scenario.
// Helpful to debug performance.
const debugCacheDuplicates = (cache, meta = {}) => {
  const keys = cache._keys.map((key) => key[0]);

  // Lists the keys for inspection of duplication
  // console.log(keys);

  if (keys.length !== Array.from(new Set(keys)).length) {
    const duplicates = cache._keys.filter(
      // From those keys, select one type, and pass it as
      // showDifferenceForType to show what's different for
      // the duplicate types.
      (key) => key[0] === meta.showDifferenceForType
    );
    if (duplicates.length > 2) {
      const keyParts = ["type", "names", "types", "scenario"];
      duplicates.slice(0, -1).forEach((duplicate, index) => {
        duplicates.slice(index + 1).forEach((nextDup, jindex) => {
          duplicate.map((testedKeyPart, i) => {
            if (testedKeyPart !== nextDup[i]) {
              console.log(`${duplicates.length} DIFFERENT ${keyParts[i]}:`, {
                [index]: testedKeyPart,
                [jindex + 1 + index]: duplicates[jindex + index + 1][i],
              });
            }
          });
        });
      });
    } else if (duplicates.length) {
      console.log(
        "Are equal",
        duplicates[0].reduce((res, keyPart, i) => {
          if (keyPart !== duplicates[1][i]) {
            console.log("DIFFERENT:", { zero: keyPart, one: duplicates[1][i] });
          }
          return res && keyPart === duplicates[1][i];
        }, true)
      );
    }
  }
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
  getNameBuildersFn,
  getTypeBuildersFn,
  isUndefined,
  hasProp,
  mergeDataSources,
  getDebugger,
  debugCacheDuplicates,
  isObjectType,
};
