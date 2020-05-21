const {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require("graphql-tools");
const schemaParser = require("easygraphql-parser");

const { memoize, zipObject } = require("./helpers");
const { buildMocks } = require("./engine");
const { useResolver, mergeBuilders } = require("./mockProviders");
const { initializeStore } = require("./store");

/**
 * Generates an executable schema with resolvers which return mocks accourding to the mock providers definitions.
 *
 * @see ResolverScenario
 * @public
 *
 * @param {Object|string} typeDefs The Schema SDL string.
 * @param {Function} mockProvidersFn A function that gets the context as
 * an argument, and returns an object with the mock providers
 * @param {Object} mockProviders An object with mock providers that will overwrite the default definitions returned by the previous argument.
 * @param {Function} mutationResolversFn A function that returns an object with resolvers for mutations.
 * @param {Function} customResolversFn A function that returns a list of custom resolvers.
 * @returns {Object} An Executable Schema object.
 */
function getExecutableSchema({
  // Schema SDL string
  typeDefs,
  // fn (context) => ({ scenario: ..., builders: ... })
  mockProvidersFn = () => ({}),
  // { scenario: ..., builders: ... }
  mockProviders = {},
  // fn (store, buildMocks, apolloContext) => {[MUTATION_NAME]: (root, args) => {...}}
  mutationResolversFn = () => ({}),
  // fn () => ({ URI: () => {...}, ... })
  customResolversFn = () => ({}),
}) {
  // Parse the schema string into a custom data structure
  const schema = schemaParser(typeDefs);

  const getMemoizedDefaultMockProviders = memoize(
    mockProvidersFn,
    (context) => ["__DEFAULT_MOCK_PROVIDERS__", JSON.stringify(context)]
  );

  // Start building the apollo executable schema
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
  });

  // Creates a unique global store that's used in queries, and that's passed to
  // resolvers.
  const getGlobalStore = memoize(
    (context) => {
      const mockedQuery = buildMocks(
        "Query",
        schema,
        getMemoizedDefaultMockProviders(context),
        mockProviders
      );
      return {
        store: initializeStore(mockedQuery),
        queries: Object.keys(mockedQuery),
      };
    },
    () => ["__GLOBAL_STORE__"]
  );

  // Add the mocks to the exectuable schema
  addMockFunctionsToSchema({
    schema: executableSchema,
    mocks: {
      Query: (root, args, context) => {
        const { queries, store } = getGlobalStore(context);
        return zipObject(
          queries,
          queries.map((queryName) => {
            const mockedQueryField = store.get(queryName);
            return typeof mockedQueryField === "function"
              ? mockedQueryField
              : // Getting anew in order to make sure
                // changes from mutations will propagate.
                () => store.get(queryName);
          })
        );
      },
      Mutation: (root, args, context) => {
        return mutationResolversFn(
          // The store which will be used to retrieve and mutate data.
          getGlobalStore(context).store,
          // The `buildMocks` function used to mock types in mutations.
          (type, scenario = {}) =>
            buildMocks(type, schema, {
              // Use the mutation resolver scenario.
              scenario,
              // Use the predefined builders.
              builders: mergeBuilders(
                getMemoizedDefaultMockProviders(context).builders,
                mockProviders.builders
              ),
            }),
          // The GraphQL context.
          context
        );
      },
      ...customResolversFn(),
    },
    preserveResolvers: false,
  });

  return executableSchema;
}

module.exports = {
  useResolver,
  getExecutableSchema,
};
