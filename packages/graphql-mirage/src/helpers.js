const MultiKeyMap = require("multikeymap");
const {
  get,
  isFunction,
  isUndefined,
  isNull,
  isNil,
  times,
  mergeWith,
  isPlainObject,
  negate,
  partialRight,
  partial,
  mapValues,
  cloneDeep,
  isObjectLike,
} = require("lodash");
const memoize = require("lodash/memoize");

const constants = require("./constants");

// Useful to cache mocking of fields by multiple keys like the Mock Providers
// and other meta data
memoize.Cache = MultiKeyMap;

/** Is this type a built-in Scalar? */
const isBuiltInScalarType = (type) =>
  [
    constants.int,
    constants.float,
    constants.string,
    constants.boolean,
    constants.ID,
  ].includes(type);

/** Is this type a custom Scalar type? */
const isCustomScalarType = (type, schema) =>
  schema[type] && schema[type].type === constants.scalarTypeDefinition;

/** Is this type a built-in or a custom Scalar type? */
const isScalarType = (type, schema) =>
  isCustomScalarType(type, schema) || isBuiltInScalarType(type);

/** Is this type an Enumeration type? */
const isEnumType = (type, schema) =>
  schema[type] && schema[type].values.length > 0;

/** Is this type an Object type? */
const isObjectType = (type, schema) =>
  !isScalarType(type, schema) && !isEnumType(type, schema);

/** Is this type an Interface? */
const isInterfaceType = (type, schema) =>
  schema[type] && schema[type].type === constants.interfaceTypeDefinition;

/** Is this type an Union type? */
const isUnionType = (type, schema) =>
  schema[type] && schema[type].types.length > 0;

/** Is this type an Interface or a Union type? */
const isAbstractType = (type, schema) =>
  isUnionType(type, schema) || isInterfaceType(type, schema);

/** Returns the first Enumeration type value from the schema. */
const getEnumVal = (type, schema) => schema[type].values[0];

/** Returns the first concrete type for Interfaces and Union types. */
const getConcreteType = (type, schema) => {
  if (isInterfaceType(type, schema)) {
    // https://github.com/EasyGraphQL/easygraphql-parser/issues/9
    return schema[type].implementedTypes[0];
  } else if (isUnionType(type, schema)) {
    return schema[type].types[0];
  }
};

/** Appends the path with the currently mocked field name. */
const getAppendedPath = (path, field, parentType) => {
  const typePrefix = (!path && `${parentType}:`) || "";
  return typePrefix + path + (path ? "." : "") + field.name;
};

// Checks if two values have the same type. Considers null the same type as
// objects and arrays.
const haveDifferentTypes = (one, two) => {
  return (
    typeof one !== typeof two ||
    (Array.isArray(one) && !Array.isArray(two)) ||
    (isPlainObject(one) && !isPlainObject(two))
  );
};

module.exports = {
  getEnumVal,
  getConcreteType,
  isEnumType,
  isBuiltInScalarType,
  isCustomScalarType,
  isScalarType,
  isUnionType,
  isInterfaceType,
  isAbstractType,
  isObjectType,
  getAppendedPath,
  haveDifferentTypes,
  // lodash
  get,
  memoize,
  isFunction,
  isUndefined,
  isNull,
  isNil,
  times,
  mergeWith,
  isPlainObject,
  negate,
  partialRight,
  partial,
  mapValues,
  cloneDeep,
  isObjectLike,
};
