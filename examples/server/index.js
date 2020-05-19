const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const { ApolloServer } = require("apollo-server");
const {
  getExecutableSchema,
  useResolver,
} = require("@lola-tech/graphql-kimera");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvidersFn: () => ({
    scenario: {
      rockets: useResolver(
        // Define a resolver factory
        (mocks) => (_, { type }) => {
          // `mocks` is a store that contains the mocks for the `rockets` query
          const rockets = mocks.get();
          return type
            ? rockets.filter((rocket) => rocket.type === type)
            : rockets;
        },
        // Optionally define a node scenario
        [{}, { type: "Starship" }, { type: "Starship" }]
      ),
    },
    builders: {
      Rocket: () => ({
        type: "Shuttle",
      }),
    },
  }),
  mutationResolversFn: (store, buildMocks) => ({
    // Example of how you would use buildMocks to build a node of a specific
    // type. If the Rocket `type` is omitted from the `input`, the `Shuttle`
    // value defined in the `Rocket` builder is used.
    createRocket: (_, { input }) => {
      let newRocket = null;
      // Example of mocking the unhappy path
      if (input.name !== "Fail") {
        newRocket = buildMocks("Rocket", { ...input }, true);
        store.update({ rockets: [...store.get("rockets"), newRocket] });
      }

      return {
        successful: input.name !== "Fail",
        rockets: store.get("rockets"),
      };
    },
  }),
});

const apollo = new ApolloServer({
  schema: executableSchema,
  introspection: true,
});

apollo.listen({ port: 3337 }).then(({ url }) => {
  console.log(chalk.green.bold(`🚀 Server ready at ${url}`));
});
