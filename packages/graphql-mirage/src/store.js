const {
  isNil,
  cloneDeep,
  isPlainObject,
  mergeWith,
  isFunction,
  isUndefined,
  isNull,
  haveDifferentTypes,
} = require("./helpers");
const { isResolverScenario } = require("./mockProviders");

/**
 * Returns a value from store. When it encounters a resolver, it uses the
 * `getMocks` function to retrieve the stored mocked value.
 *
 * @param {Object} store The mocked data store.
 * @param {Array|string} path The path of value to get. Similar to lodash's get path.
 * @returns {any} The resolved value, or undefined if nothing was found.
 */
const getFromStore = (store, path) => {
  if (!path) {
    return store;
  }

  return path.split(".").reduce((innerStore, prop) => {
    if (isNil(innerStore)) {
      return undefined;
    }

    const storedMocks = innerStore[prop];
    if (isFunction(storedMocks)) {
      return storedMocks.__mocks.get();
    }

    return storedMocks;
  }, store);
};

/** Used when when generating error messages. */
const stringifyStore = (value) => {
  return JSON.stringify(value, (key, value) => {
    if (isFunction(value)) {
      return "___RESOLVER_FACTORY__";
    }
    if (key === "__mocks") {
      return "__RESOVLER_MOCKS_STORE__";
    }

    return value;
  });
};

/**
 * Throws if the updating value type is different than the stored value type.
 */
const validateUpdateTypes = (storeValue, updateValue) => {
  if (isNull(storeValue) || isNull(updateValue)) return;

  if (haveDifferentTypes(storeValue, updateValue)) {
    throw new TypeError(
      `You are attempting to replace the "${stringifyStore(
        storeValue
      )}" store value with "${JSON.stringify(
        updateValue
      )}". The update value type should match the store value type.`
    );
  }
};

/**
 * Updates a specific store branch.
 *
 * @param {Object} store The mocked data store.
 * @param {Object} branch The branch object containing what needs updating. This
 * needs to mirror the structure of the store, and cannot contain functions or
 * resolver scenarios.
 * @returns {Object} A new, updated store object.
 */
const updateStore = (store, branch) => {
  const clonedStore = cloneDeep(store);

  // We should only get here through the mergeWith store update from bellow,
  // which means the store or branch will never be undefined.
  if (isNull(branch) || isNull(store)) {
    return branch;
  }

  validateUpdateTypes(store, branch);

  if (!isPlainObject(store)) {
    return branch;
  }

  return mergeWith(clonedStore, branch, (stored, assigned) => {
    if (isResolverScenario(assigned) || isFunction(assigned)) {
      const illegalEntity = isFunction(assigned)
        ? "function"
        : "ResolverScenario";

      throw new Error(`Store update value cannot contain a ${illegalEntity}.`);
    }

    if (isUndefined(assigned) || isUndefined(stored)) {
      return assigned || stored;
    }

    // If the stored value is a resolver, update the resolver mocks store by
    // calling its `update` method.
    if (isFunction(stored)) {
      stored.__mocks.update(assigned);
      return stored;
    }

    validateUpdateTypes(stored, assigned);

    if (isPlainObject(stored)) {
      return updateStore(stored, assigned);
    }

    return assigned;
  });
};

/**
 * Initializes new store object, with a `get` and `update` methods that allow
 * retrieval and updating of store values.
 *
 * @see getFromStore
 * @see updateStore
 *
 * @param {Object} initialValue The initial state of the store.
 * @param {boolean} writable Wether an update method should be supplied with the
 * store.
 * @returns {Object} The store object.
 */
const initializeStore = (initialValue, writable = true) => {
  let storage = initialValue;
  const store = {
    get: (path) => getFromStore(storage, path),
    ...(writable
      ? {
          update: (branch) => {
            storage = updateStore(storage, branch);
            return store;
          },
        }
      : {}),
  };

  return store;
};

module.exports = {
  initializeStore,
};
