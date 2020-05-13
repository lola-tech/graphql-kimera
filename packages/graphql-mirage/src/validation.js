const { isUndefined, isNull, isFunction } = require("lodash");

/**
 * Makes sure a Builder is a function.
 * Throws a TypeError if the builder isn't a function.
 *
 * @param {Object} field
 * @param {any} builder
 */
const validateBuilder = (builder, type) => {
  if (!isUndefined(builder) && !isFunction(builder)) {
    throw new TypeError(
      `All builders need to be functions. The "${type}" builder isn't a function.`
    );
  }

  return true;
};

/**
 * Validates a Scenario for a specifc field.
 * Check for non-nullable and array issues.
 *
 * @param {Object} scenario
 * @param {Object} meta
 * @param {string} path
 */
const validateFieldScenario = (scenario, meta) => {
  if (isUndefined(scenario)) {
    return true;
  }

  if (isNull(scenario) && meta.noNull) {
    throw new TypeError(
      `You are attempting to mock the non-nullable "${meta.path}" field with "null".`
    );
  }

  if (!isNull(scenario) && !Array.isArray(scenario) && meta.isArray) {
    throw new TypeError(
      `You are attempting to mock the list "${meta.path}" field with non-array value "${scenario}". List fields must be mocked with arrays.`
    );
  }

  if (Array.isArray(scenario) && !meta.isArray) {
    throw new TypeError(
      `You are attempting to mock "${
        meta.path
      }" field with the array ${JSON.stringify(scenario)}. "${
        meta.path
      }" is not a List field.`
    );
  }

  return true;
};

module.exports = {
  validateFieldScenario,
  validateBuilder,
};
