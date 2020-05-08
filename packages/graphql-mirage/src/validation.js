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
 * @param {Object} field
 * @param {string} path
 */
const validateFieldScenario = (scenario, field, path) => {
  if (isUndefined(scenario)) {
    return true;
  }

  if (isNull(scenario) && field.noNull) {
    throw new TypeError(
      `You are attempting to mock the non-nullable "${path}" field with "null".`
    );
  }

  if (!isNull(scenario) && !Array.isArray(scenario) && field.isArray) {
    throw new TypeError(
      `You are attempting to mock the list "${path}" field with non-array value "${scenario}". List fields must be mocked with arrays.`
    );
  }

  if (Array.isArray(scenario) && !field.isArray) {
    throw new TypeError(
      `You are attempting to mock "${path}" field with the array ${JSON.stringify(
        scenario
      )}. "${path}" is not a List field.`
    );
  }

  return true;
};

module.exports = {
  validateFieldScenario,
  validateBuilder,
};
