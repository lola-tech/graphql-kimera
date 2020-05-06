const { isUndefined, isNull, isFunction } = require("lodash");

// INSTANTIANTE VALIDATOR WITH GLOBALS?

/**
 * Makes sure a Builder is a function.
 * Throws a TypeError if the builder isn't a function.
 *
 * @param {Object} field
 * @param {any} builder
 */
const validateBuilder = (builder, field) => {
  if (!isUndefined(builder) && !isFunction(builder)) {
    throw new TypeError(
      `All builders need to be functions. The "${field["type"]}" builder isn't a function.`
    );
  }

  return true;
};

/**
 * Validates a Scenario for a specifc field.
 * Check for non-nullable and array issues.
 *
 * @param {Object} field
 * @param {any} builder
 * @param {"type" | "name"} kind
 */
const validateScenario = (scenario, field, path) => {
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

  // TODO: Check if scenario is array and field is not array

  return true;
};

module.exports = {
  validateScenario,
  validateBuilder,
};
