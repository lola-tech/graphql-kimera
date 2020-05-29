const fs = require('fs');
const path = require('path');
const { ApolloServer, gql } = require('apollo-server');
const { createTestClient } = require('apollo-server-testing');
const { getExecutableSchema, mockResolver } = require('../index.js');

const typeDefs = gql(
  fs.readFileSync(path.join(__dirname, 'testing.schema.graphql'), 'utf-8')
);

const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvidersFn: () => ({
    scenario: {
      rockets: mockResolver(
        // Define a resolver factory
        (fieldStore) => (_, { type }) => {
          const rockets = fieldStore.get();
          return type
            ? rockets.filter((rocket) => rocket.type === type)
            : rockets;
        },
        [
          { id: 1 },
          { id: 2, model: 'Starship' },
          { id: 3, model: 'Peacekeeper' },
        ]
      ),
      rocket: mockResolver((fieldStore) => (_, { id }) =>
        fieldStore
          .getFromGlobalStore('rockets')
          .find((rocket) => rocket.id === parseInt(id)) || null
      ),
    },
    builders: {
      Rocket: () => ({
        model: 'Shuttle',
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
      if (input.name !== 'Fail') {
        newRocket = buildMocks('Rocket', { id: 4, ...input });
        store.update({ rockets: [...store.get('rockets'), newRocket] });
      }

      return {
        successful: input.name !== 'Fail',
        rockets: store.get('rockets'),
      };
    },
  }),
});

let client;
beforeAll(async () => {
  const server = new ApolloServer({
    schema: executableSchema,
    // context: () => ({}),
  });
  client = createTestClient(server);
});

test('Creating a rocket and querying by id works', async () => {
  const m = await client.mutate({
    mutation: gql`
      mutation newRocket($name: String!, $model: String!) {
        createRocket(input: { name: $name, model: $model }) {
          successful
          rockets {
            id
            name
            model
          }
        }
      }
    `,
    variables: {
      name: 'Enterprise',
      model: 'D Class',
    },
  });

  expect(m.data.createRocket.successful).toBe(true);
  expect(m.data.createRocket.rockets.length).toBe(4);

  let newRocketId = m.data.createRocket.rockets[3].id;

  const q = await client.query({
    query: gql`
      query findRocketById($id: ID!) {
        rocket(id: $id) {
          name
        }
      }
    `,
    variables: {
      id: newRocketId,
    },
  });
  expect(q.data.rocket.name).toBe('Enterprise');
});
