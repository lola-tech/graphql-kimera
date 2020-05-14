const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require("graphql-tools");
const schemaParser = require("easygraphql-parser");

const { memoize, mapValues } = require("./helpers");
const { buildMocks } = require("./engine");
const { useResolver, mergeMockProviders } = require("./mockProviders");

/**
 * Uses buildMocks to generate data and serve it in an Executable Schema context
 *
 * @see ResolverScenario
 * @public
 *
 * @param {string} typeDefs The Schema SDL string.
 * @param {Function} getDefaultMockProviders A function that gets the context as
 * an argument, and returns an object with the mock providers
 * @param {Object} customMockProviders An object with mock providers that will overwrite the default definitions returned by the previous argument.
 * @param {Function} getMutationResolvers A function that returns an object with resolvers for mutations.
 * @param {Function} getCustomResolvers A function that returns a list of custom resolver.
 * @returns {Object} An Executable Schema object.
 */
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
    (context) => ["__DEFAULT_MOCK_PROVIDERS__", JSON.stringify(context)]
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
  const _getBuildMocksFn = (context) => (type, scenario = {}) =>
    buildMocks(
      type,
      schema,
      // When generating data for a Type in a mutation, see as default the
      // merged version of default mock providers, and custom mock providers.
      // The custom mock providers is what comes from a frontend app in a test.
      mergeMockProviders(
        getMemoizedDefaultMockProviders(context),
        customMockProviders
      ),
      // This scenario is provided in the mutation to overwrite the above
      // defaults.
      { scenario }
    );

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
  useResolver,
  getExecutableSchema,
};
