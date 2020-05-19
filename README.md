# GraphQL Kimera

Kimera is an automocking library for GraphQL that allows you to be very precise about how mocks should be generated.

[![mit](https://img.shields.io/badge/license-MIT-blue)](https://img.shields.io/badge/license-MIT-blue) ![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg) ![Node.js CI](https://github.com/lola-tech/graphql-kimera/workflows/Node.js%20CI/badge.svg) ![github pages](https://github.com/lola-tech/graphql-kimera/workflows/github%20pages/badge.svg)

## Why?

Kimera is useful to:

- **Speed up the prototyping process**. It's very easy to get a mocked server up and running by just updating the schema definition and optionally customizing the mocks providers.
- **Allow large teams to better coordinate**. Frontend developers can negotiate changes to the schema with the backend developers and then quickly add mocks for the changes in a Kimera mocked version of the server while the backend team gets to implmenting the changes.
- **Improve testing in front end applications that use GraphQL**. Using Kimera allows one to customize query responses by defining _a single scenario_ as opposed to exhaustively mocking each query response, which is extremely useful for large component trees where queries are used at different levels of the component hierarchy.

## Getting Started

To install Kimera you can install it via `npm` or `yarn`, it's totally up to you. We're guessing that you'll most likely want Kimera to be a dev dependency.

```
npm install --save-dev @lola-tech/graphql-kimera
```

or if you want to use yarn

```
yarn add --dev @lola-tech/graphql-kimera
```

### Examples

These examples assume the use of the [example schema we are using for testing](https://github.com/lola-tech/graphql-kimera/blob/master/packages/graphql-kimera/src/__test__/example.schema.graphql).

#### Basic Example

Running the `rockets` query will return four rockets, all of type `Shuttle`, with the first being called `Apollo`.

```js
const { getExecutableSchema } = require("@lola-tech/graphql-kimera")

// Importing the typeDefs from the `schema.graphql` file...

const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvividersFn: () => ({
    scenario: {
      rockets: [{ name: "Apollo" }, {}, {}, {}],
    },
    builders: {
      Rocket: () => ({
        type: "Shuttle",
      }),
    },
  },
});

const apollo = new ApolloServer({
  schema: executableSchema,
  introspection: true,
  port: 4000,
});

apollo.listen().then(({ url }) => {
  console.log(chalk.green.bold(`🚀 Server ready at ${url}`));
});
```

#### Custom query resolvers examples

If you want to implement filtering in the mocked `rockets` query, you can define
a resolver uing the `useResolver` function.

```js
const {
  getExecutableSchema,
  useResolver
} = require("@lola-tech/graphql-kimera")

// Importing the typeDefs from the `schema.graphql` file...

const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvividersFn: () => ({
    scenario: {
      rockets: useResolver(
        // Define a resolver factory
        mocks => (_, { type }) => {
          // mocks is a store that contains the mocks for the `rockets` query
          const rockets = mocks.get();
          return type ? rockets.filter(rocket => rocket.type === type) : rockets;
        },
        // Optionally define a node scenario
        [{}, { type: "Starship" }, { type: "Starship" }, {}],
      ),
    },
    builders: {
      Rocket: () => ({
        type: "Shuttle",
      }),
    },
  },
});

// Starting your server using the above defined executable schema ....
```

#### Mutations resolvers example

```js
const {
  getExecutableSchema,
} = require("@lola-tech/graphql-kimera")

// Importing the typeDefs from the `schema.graphql` file...

const executableSchema = getExecutableSchema({
  typeDefs,
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
  },
});

// Starting your server using the above defined executable schema ....
```

## Contributing

The main purpose of this repository is to continue to evolve Kimera. Development of Kimera happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Kimera.

### Contributing Guide

Please read [CONTRIBUTING.md](https://github.com/lola-tech/graphql-kimera/blob/master/CONTRIBUTING.md) for the process for submitting pull requests to us.

### Code of conduct

[lola.tech](https://www.lola.tech/) has adopted a Code of Conduct that we expect project participants to adhere to. Please read [CODE_OF_CONDUCT.md](https://github.com/lola-tech/graphql-kimera/blob/master/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Versioning

We use [lerna](https://lerna.js.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/lola-tech/graphql-kimera/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Kimera library name has been inspired from greek mythology - [Chimera](<https://en.wikipedia.org/wiki/Chimera_(mythology)>)
