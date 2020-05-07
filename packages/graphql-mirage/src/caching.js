const { isUndefined } = require("lodash");
const MultiKeyMap = require("multikeymap");

const { ID } = require("./constants");

const cacheStore = new MultiKeyMap();

// TODO: Maybe replace with reducedScenario
const computeFieldCacheKey = (field, arrayIndex, mockProviders) => {
  const fieldKeyPart = field.isArray
    ? `[${field.type}]`
    : // Make ids of items part of a List unique
    Number.isInteger(arrayIndex) && field.type === ID
    ? `${field.type}[${arrayIndex}]`
    : field.type;

  const key = [
    fieldKeyPart + (field.noNull ? "!" : ""),
    ...Object.values(mockProviders),
  ];
  return key;
};

/**
 * Memoizes the result of executing a function.
 * It does so using a MultiKeyMap.
 *
 * @param {Object} scenario
 * @param {Object} field
 * @param {string} path
 */
const executeAndCache = (func, cacheKey) => {
  let result = cacheStore.get(cacheKey);

  if (!isUndefined(result)) {
    return result;
  }

  result = func();

  cacheStore.set(cacheKey, result);

  return result;
};

module.exports = { computeFieldCacheKey, executeAndCache };
