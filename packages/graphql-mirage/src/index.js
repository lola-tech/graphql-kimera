const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require("graphql-tools");
const schemaParser = require("easygraphql-parser");

const { memoize, mapValues } = require("./helpers");
const { buildMocks } = require("./engine");
const { useResolver, mergeBuilders } = require("./mockProviders");
const { initializeStore } = require("./store");

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

  // Generates mocks for the Query node. Essentially our initial data store.
  const _mockQueryType = (context) => {
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
        mapValues(_mockQueryType(context), (val) =>
          typeof val === "function" ? val : () => val
        ),
      Mutation: (root, args, context) =>
        getMutationResolvers(
          // The store which will be used to retrieve and mutate data.
          initializeStore(_mockQueryType(context)),
          // The `buildMocks` function used to mock types in mutations.
          (type, scenario = {}) =>
            buildMocks(type, schema, {
              // Use the mutation resolver scenario.
              scenario,
              // Use the predefined builders.
              builders: mergeBuilders(
                getMemoizedDefaultMockProviders(context).builders,
                customMockProviders.builders
              ),
            }),
          // The GraphQL context.
          context
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
