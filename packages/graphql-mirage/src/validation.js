const { isUndefined, isNull, isFunction } = require("lodash");

// INSTANTIANTE VALIDATOR WITH GLOBALS?

/**
 * Validates a Type or Name builder.
 * Throws a TypeError if the builder isn't a function.
 *
 * @param {Object} field
 * @param {any} builder
 * @param {"type" | "name"} kind
 */
const validateBuilder = (builder, field, kind) => {
  if (!isUndefined(builder) && !isFunction(builder)) {
    throw new TypeError(
      `All builders need to be functions. The "${field[kind]}" ${kind} builder sn't a function.`
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
    return;
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
};

module.exports = {
  validateScenario,
  validateBuilder,
};
