const { map, compose, first, filter } = require("lodash/fp");

const {
  memoize,
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
} = require("./helpers");
const { validateBuilder } = require("./validation");
const { DEFAULT_LIST_LENGTH } = require("./constants");

/**
 * The function that needs to be used when defining a resolver in
 * mock provider.
 *
 * @public
 *
 * @param {Function} resolverFactoryFn A function that returns a resolver and receives a getter as its argument
 * @param {scenario} scenario Optional. The scenario for this field
 * @returns {Object} Returns the merged mock providers scenario.
 */
const useResolver = (resolverFactoryFn, scenario) => {
  return new ResolverScenario(resolverFactoryFn, scenario);
};

/** The Resolver Scenario constructor. */
function ResolverScenario(resolverFactoryFn, scenario) {
  this.resolverFactory = resolverFactoryFn;
  this.scenario = scenario;
}

/** Is the current node a Resolver Scenario? */
const isResolverScenario = (node) => {
  return node instanceof ResolverScenario;
};

/**
 * Deeply merges two scenarios into one.
 *
 * Objects are merged deeply, always selecting for the leftmost value when conflict exists.
 * All nodes that aren't objects are selected from the leftmost argument when conflicts exist.
 *
 * @param {Object} assignedScenario The scenario that will merged over over second scenario. The higher priority scenario.
 * @param {Object} scenario The scenario that will be deeply overwritten by the assignedScenario.
 * @returns {Object} Returns a scenario object.
 */
const mergeScenarios = memoize(
  (assignedScenario, scenario) => {
    const firstDefinedScenario = compose([first, filter(negate(isUndefined))])([
      assignedScenario,
      scenario,
    ]);

    if (!isObjectLike(firstDefinedScenario)) {
      return firstDefinedScenario;
    }

    if (
      assignedScenario &&
      scenario &&
      !isObjectLike(scenario) &&
      isObjectLike(assignedScenario)
    ) {
      console.warn(
        `A scenario "${JSON.stringify(
          assignedScenario
        )}" is "${typeof assignedScenario}" attempted to be merged with a "${scenario}" of type "${typeof scenario}". This is most likely a mistake.`
      );
    }

    return mergeWith(assignedScenario, scenario, (defaultOption, newOption) => {
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
  },
  (...scenarios) => {
    return [
      "__MERGED_SCENARIOS__",
      JSON.stringify(scenarios, (key, value) =>
        isFunction(value) ? "__RESOLVER__" : value
      ),
    ];
  }
);

/** Merges two sets of builders. */
const mergeBuilders = memoize(
  (customBuilders = {}, defaultBuilders = {}) => ({
    ...defaultBuilders,
    ...customBuilders,
  }),
  (customBuilders = {}) => {
    return ["__MERGED_BUILDERS__", ...Object.keys(customBuilders)];
  }
);

/**
 * Merges custom scenarios and builders with defaults using different
 * strategies.
 *
 * @see mergeScenarios for the scenarios merging strategy
 * @see mergeBuilders  for the builders merging strategy
 *
 * @param {Object} defaults An object with default mock providers
 * @param {Object} custom An object with the custom mock providers that are
 * meant to overwrite the defaults.
 * @returns {Object} An object with the merged
 */
const mergeMockProviders = memoize(
  (defaults = {}, custom = {}) => ({
    scenario: mergeScenarios(custom.scenario, defaults.scenario),
    builders: mergeBuilders(custom.builders, defaults.builders),
  }),
  (defaults, custom) => ["__MERGED_MOCKED_PROVIDERS__", defaults, custom]
);

/** Executes a Builder for a specific type, and returns the resulting scenario. */
const getBuilderScenario = memoize(
  (builders, type) => {
    const builder = get(builders, type);
    return validateBuilder(builder, type) && builder && builder();
  },
  (builders, type) => {
    return ["__BUILDER_SCENARIO__", type, builders];
  }
);

/**
 * Reduces user defined mock providers to a single scenario object.
 *
 * @param {Object} mockProviders An object with the user-defined Scenario and
 * the Builders.
 * @param {Object} meta An object containing meta information about the mocked
 * type. For the complete list of meta keys @see mockType in ./engine.js.
 */
const reduceToScenario = ({ scenario, builders }, meta) => {
  if (isNull(scenario)) {
    return null;
  }

  if (isFunction(scenario)) {
    throw new TypeError(
      `Field "${meta.path}" was attempted to be mocked with a function. If you meant to define a resolver, you need to do so using "useResolver".`
    );
  }

  // Convert the field builder to a scenario by executing it
  const builderScenario = getBuilderScenario(builders, meta.type);

  // Validate the Builder
  if (isFunction(builderScenario) || isResolverScenario(builderScenario)) {
    const illegalEntity = isFunction(builderScenario)
      ? "function"
      : "ResolverScenario";

    throw new TypeError(
      `Builder for type "${meta.type}" returns a ${illegalEntity}. Builder functions cannot return ${illegalEntity}s.`
    );
  }

  if (meta.isArray) {
    if (Array.isArray(scenario)) {
      // If we have a user defined array scenario,
      // merge each array element with the builderScenario
      return map(partialRight(mergeScenarios, builderScenario))(scenario);
    } else if (!isUndefined(scenario)) {
      // If scenario is defined as something other than an array
      // return it so we can throw a TypeError at validation.
      return scenario;
    }

    // Otherwise create a scenario out of the builderScenario
    return !isUndefined(builderScenario)
      ? times(DEFAULT_LIST_LENGTH, () => builderScenario)
      : undefined;
  }

  return mergeScenarios(scenario, builderScenario);
};

module.exports = {
  mergeScenarios,
  mergeBuilders,
  mergeMockProviders,
  useResolver,
  isResolverScenario,
  reduceToScenario,
};
