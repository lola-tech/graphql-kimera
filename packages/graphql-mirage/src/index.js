const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require("graphql-tools");
const schemaParser = require("easygraphql-parser");
const { mapValues, memoize } = require("lodash");

const { mockObjectType } = require("./engine");
const { getScenarioFn, mergeDataSources } = require("./helpers");

// Returns the same cached result if the `type`, `defaults`, `custom`,
// and `selector` arguments do not change.
const buildMocks = memoize(
  function buildMocks(type, schema, defaults = {}, custom = {}) {
    // if (type !== 'Query' && selector) {
    //   // When we use `buildMocks` to generate Object Types (in the context of mutations)
    //   // we want to sub-select a part of the scenario in order to have `mockObjectType`
    //   // walk the correct tree of scenario data.
    //   defaults = {
    //     ...defaults,
    //     scenario: jmespath.search(defaults.scenario, selector),
    //   };
    // }

    return mockObjectType(type, schema, mergeDataSources(defaults, custom));
  },
  (type, _, defaults, custom, selector) =>
    JSON.stringify({
      type,
      defaults,
      custom,
      selector,
    })
);

// Uses buldMocks to generate data and serve it in an Executable Schema context
function getExecutableSchema(
  // Schema SDL string
  typeDefs,
  // fn (context) => ({ scenario: ..., builders: ... })
  getDefaultDataSources = () => ({}),
  // { scenario: ..., builders: ... }
  customDataSources = {},
  // fn (mockedQueryType, buildMocks, apolloContext) => {[MUTATION_NAME]: (root, args) => {...}}
  getMutationResolvers = () => ({}),
  // fn () => ({ URI: () => {...}, ... })
  getCustomResolvers = () => ({})
) {
  // Parse the schema string into a custom data structure
  const schema = schemaParser(typeDefs);

  const getMemoizedDefaultDataSources = memoize(
    getDefaultDataSources,
    (context) => JSON.stringify(context)
  );

  // Start building the apollo executable schema
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
  });

  const _getBuildMocksFn = (context) =>
    // Partial application of buildMocks to be passed down to the Mutation resolvers
    // This function will be called to generate data for a certain type in the Mutation
    // resolver
    function buildMocksForType(type, selector = "", scenario = {}) {
      return buildMocks(
        type,
        schema,
        // When generating data for a Type in a mutation, see as default the merged version of
        // default data sources, and custom data sources. The custom data sources is what comes
        // from a frontend app in a test, or in Mockery.
        mergeDataSources(
          getMemoizedDefaultDataSources(context),
          customDataSources
        ),
        // This scenario is provided in the mutation to overwrite the above defaults.
        { scenario },
        selector
      );
    };

  // Generates mocks for the Query node. Essentially our initial data store.
  const _getMockedQuery = (context) => {
    return buildMocks(
      "Query",
      schema,
      getMemoizedDefaultDataSources(context),
      customDataSources
    );
  };

  // Add the mocks to the exectuable schema
  addMockFunctionsToSchema({
    schema: executableSchema,
    mocks: {
      Query: (root, args, context) =>
        mapValues(_getMockedQuery(context), (val) =>
          typeof val === "function" ? val : () => val
        ),

      Mutation: (root, args, context) =>
        getMutationResolvers(
          _getMockedQuery(context), // The cache to be modified in the mutation
          _getBuildMocksFn(context), // The `buildMocks` function used to generate data in the mutation
          context // The apollo context
        ),
      ...getCustomResolvers(),
    },
    preserveResolvers: false,
  });

  return executableSchema;
}

module.exports = {
  mergeScenario: (defaultScenario, customScenario) =>
    getScenarioFn(defaultScenario)(customScenario),
  buildMocks,
  getExecutableSchema,
};
