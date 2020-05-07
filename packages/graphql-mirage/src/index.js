const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require("graphql-tools");
const schemaParser = require("easygraphql-parser");
const { mapValues, memoize } = require("lodash");

const { mockObjectType } = require("./engine");
const { getScenarioFn, mergeMockProviders } = require("./helpers");

const buildMocks = memoize(
  (type, schema, defaults = {}, custom = {}) =>
    mockObjectType(type, schema, mergeMockProviders(defaults, custom)),
  (type, _, defaults, custom) =>
    JSON.stringify({
      type,
      defaults,
      custom,
    })
);

// Uses buldMocks to generate data and serve it in an Executable Schema context
function getExecutableSchema(
  // Schema SDL string
  typeDefs,
  // fn (context) => ({ scenario: ..., builders: ... })
  getDefaultMockProviders = () => ({}),
  // { scenario: ..., builders: ... }
  customMockProviders = {},
  // fn (mockedQueryType, buildMocks, apolloContext) => {[MUTATION_NAME]: (root, args) => {...}}
  getMutationResolvers = () => ({}),
  // fn () => ({ URI: () => {...}, ... })
  getCustomResolvers = () => ({})
) {
  // Parse the schema string into a custom data structure
  const schema = schemaParser(typeDefs);

  const getMemoizedDefaultMockProviders = memoize(
    getDefaultMockProviders,
    (context) => JSON.stringify(context)
  );

  // Start building the apollo executable schema
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
  });

  // Partial application of buildMocks to be passed down to the Mutation
  // resolvers. This function will be called to generate data for a specific
  // type in the Mutation resolver.
  const _getBuildMocksFn = (context) =>
    function buildMocksForType(type, scenario = {}) {
      return buildMocks(
        type,
        schema,
        // When generating data for a Type in a mutation, see as default the
        // merged version of default mock providers, and custom mock providers.
        // The custom mock providers is what comes from a frontend app in a
        // test.
        mergeMockProviders(
          getMemoizedDefaultMockProviders(context),
          customMockProviders
        ),
        // This scenario is provided in the mutation to overwrite the above defaults.
        { scenario }
      );
    };

  // Generates mocks for the Query node. Essentially our initial data store.
  const _getMockedQuery = (context) => {
    return buildMocks(
      "Query",
      schema,
      getMemoizedDefaultMockProviders(context),
      customMockProviders
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
