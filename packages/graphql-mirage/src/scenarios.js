const {
  isFunction,
  isUndefined,
  mergeWith,
  isObjectLike,
  isPlainObject,
  negate,
  times,
  isNull,
  partialRight,
  get,
} = require("lodash");
const { map, compose, first, filter } = require("lodash/fp");

const { validateBuilder } = require("./validation");

// TODO:
const DEFAULT_ARRAY_LENGTH = 3;

/**
 * TOBEWRITTERN
 *
 * @see useResolver
 *
 * @param {Object} dataSources An object with the Scenario and the Builders.
 * @returns {Object} Returns the merged data sources scenario.
 */
function ResolverScenario(resolverFactoryFn, scenario) {
  this.resolverFactory = resolverFactoryFn;
  this.scenario = scenario;
}

const isResolverScenario = (node) => {
  return node instanceof ResolverScenario;
};

/**
 * TOBEWRITTERN
 *
 * @see ResolverScenario
 *
 * @param {Object} dataSources An object with the Scenario and the Builders.
 * @returns {Object} Returns the merged data sources scenario.
 */
const useResolver = (resolverFactoryFn, scenario) => {
  return new ResolverScenario(resolverFactoryFn, scenario);
};

// All options that aren't objects are selected from the leftmost argument when conflicts exist
// Objects are merged deeply, always selecting for the leftmost value when conflict exists
function mergeScenarios(...options) {
  const firstDefinedArgument = compose([first, filter(negate(isUndefined))])(
    options
  );

  if (!isObjectLike(firstDefinedArgument)) {
    return firstDefinedArgument;
  }

  return mergeWith(...options, (defaultOption, newOption) => {
    if (
      // When the merged options are primitives return the default option
      !isPlainObject(defaultOption) ||
      // Treat ResolverScenarios as primitives
      isResolverScenario(defaultOption) ||
      (!isUndefined(defaultOption) && isResolverScenario(newOption))
    ) {
      return defaultOption;
    }

    return mergeScenarios(defaultOption, newOption);
  });
}

/**
 * Reduces user defined data sources to a single scenario object.
 *
 * @see mockField
 *
 * @param {Object} field The parsed schema field object.
 * @param {Object} dataSources An object with the Scenario and the Builders.
 * @returns {Object} Returns the merged data sources scenario.
 */
const reduceToScenarioAndResolver = (field, { scenario, builders }, path) => {
  if (isFunction(scenario)) {
    throw new TypeError(
      `Field "${path}" was attempted to be mocked with a function. If you meant to define a resolver, you need to do so using "useResolver".`
    );
  }

  // Convert the field builder to a scenario by executing it
  const getBuilderScenario = () => {
    const builder = get(builders, field.type);
    return validateBuilder(builder, field) && builder && builder();
  };
  const builderScenario = getBuilderScenario();

  if (isFunction(builderScenario) || isResolverScenario(builderScenario)) {
    const illegalEntity = isFunction(builderScenario)
      ? "function"
      : "ResolverScenario";

    throw new TypeError(
      `Builder for type "${field.type}" returns a ${illegalEntity}. Builder functions cannot return ${illegalEntity}s.`
    );
  }

  // Extract the resolver factory if defined.
  let resolverFactoryFn = undefined;
  if (isResolverScenario(scenario)) {
    resolverFactoryFn = scenario.resolverFactory;
    scenario = scenario.scenario;
  }
  // Add the resolver factory function to the result
  const withResolverFactory = (reducedScenario) => ({
    reducedScenario,
    resolverFactoryFn,
  });

  if (isNull(scenario)) {
    return withResolverFactory(null);
  }

  if (field.isArray) {
    if (Array.isArray(scenario)) {
      // If we have a user defined array scenario,
      // merge each array element with the builderScenario
      return withResolverFactory(
        map(partialRight(mergeScenarios, builderScenario))(scenario)
      );
    } else if (!isUndefined(scenario)) {
      // If scenario is defined as something other than an array
      // return it so we can throw a TypeError at validation.
      return withResolverFactory(scenario);
    }

    // Otherwise create a scenario out of the builderScenario
    return withResolverFactory(
      !isUndefined(builderScenario)
        ? times(DEFAULT_ARRAY_LENGTH, () => builderScenario)
        : undefined
    );
  }

  return withResolverFactory(mergeScenarios(scenario, builderScenario));
};

module.exports = {
  mergeScenarios,
  useResolver,
  isResolverScenario,
  reduceToScenarioAndResolver,
};
