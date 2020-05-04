const { isUndefined } = require("lodash");
const MultiKeyMap = require("multikeymap");

const { ID } = require("./constants");

const cacheStore = new MultiKeyMap();

const _computeCacheKey = (field, arrayIndex, dataSources) => {
  const fieldKeyPart = field.isArray
    ? `[${field.type}]`
    : // Make ids of items part of a List unique
    Number.isInteger(arrayIndex) && field.type === ID
    ? `${field.type}[${arrayIndex}]`
    : field.type;

  return [fieldKeyPart, ...Object.values(dataSources)];
};

const executeAndCache = (func, field, arrayIndex, dataSources) => {
  const cacheKey = _computeCacheKey(field, arrayIndex, dataSources);
  let result = cacheStore.get(cacheKey);

  if (!isUndefined(result)) {
    return result;
  } else {
    result = func();
    cacheStore.set(cacheKey, result);
  }

  return result;
};

module.exports = { executeAndCache };
