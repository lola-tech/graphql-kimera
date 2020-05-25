---
id: mocking-mutations
title: Mocking Mutations
sidebar_label: Mocking Mutations
---

> _Manage change by updating the store in mutation resolvers._

:::note
This page assumes you know how to setup your app to use the Kimera executable schema. If you don't, check out the [Setup section of the docs](/graphql-kimera/docs/setup).
:::

Let's start with a schema that has `createRocket` mutation.

```graphql
# ...

type Mutation {
  createRocket(input: CreateRocketInput!): CreateRocketPayload!
}

input CreateRocketInput {
  name: String!
  type: String!
}

type CreateRocketPayload {
  rockets: [Rocket]
  successful: Boolean!
}

type Rocket {
  id: ID!
  name: String
  type: String
}
```

The `createRocket` mutation takes a `name` and a `type` for the new rocket, and returns the complete list of rockets, including the new one if it's successful.

## `mutationResolversFn` example

In order to pass this new mutation, we'll have to do it as part of the return object of a new `getExecutableSchema` option: **`mutationResolversFn`**.

To define a resolver for a mutation with Kimera, we need use a new `getExecutableSchema` option: the `mutationResolversFn` function.

`mutationResolversFn` needs to return an object with all mutation resolvers we want to define.

```js {3,7,12,14,19}
const executableSchema = getExecutableSchema({
  // typeDefs & mockProviders
  mutationResolversFn: (store, buildMocks) => ({
    // Example of how you would use buildMocks to build a node of a specific
    // type. If the Rocket `type` is omitted from the `input`, the `Shuttle`
    // value defined in the `Rocket` builder is used.
    createRocket: (_, { input }) => {
      let newRocket = null;
      // Example of mocking the unhappy path
      if (input.name !== "Fail") {
        // Mock a new `Rocket` using the `input` arg as a scenario
        newRocket = buildMocks("Rocket", { ...input });
        // Update the store by appending the new rocket
        store.update({ rockets: [...store.get("rockets"), newRocket] });
      }

      return {
        successful: input.name !== "Fail",
        rockets: store.get("rockets"),
      };
    },
  }),
});
```

## `mutationResolversFn` API

Kimera passes two arguments to `mutationResolversFn`:

- `store`: This is an object which holds all of the mocks for our schema. It defines two methods:
  - `store.get(path = '')`: The `get` method will accept an optional `path` string, and return the mocked value stored at that specific path.
  - `store.update(path, updateValue)`: The `update` method will update the value at the supplied `path` with the new value. If the updated value is an object, the new value will be deeply merged over the existing value.
- `buildMocks('TypeName', scenario)`: This is a function mocks a specific type using existing mock providers, and optionally, a custom scenario that we can provide at execution.

Next we'll look at several examples of using these arguments.

## `store` and `buildMocks` examples

Starting with some form of the following schema:

```graphql
type Query {
  launch: Launch
}

type Launch {
  rockets: [Rocket]
  address: Address
}

type Address {
  line1: String
  country: String
}

type Rocket {
  ...
}
```

Here are a few ways to affect the mocked data in a mutation:

```js
getExecutableSchema({
  typeDefs,
  mockProvidersFn: (context) => ({
    builders: {
      Address: () => ({
        line1: "Example Street",
        country: "Examplestan"
      })
    }
  }),
  mutationResolversFn: (store, buildMocks) => ({
    [mututationName]: function resolver(_, args, ...) {
      // Returns the 'Query' type mocks.
      store.get();

      // Returns the mocks for a value deeper in the graph.
      // This can go as deep as needed. e.g.: 'launch.rockets.0.name'.
      store.get('launch.rockets.0');

      // Partially update the value of an Object Type field.
      store.update('launch.address', {
        country: 'Cuba'
      });

      // Completely replace an Object Type.
      store.update(
        'launch.address',
        // When the supplied scenario omits fields, like we do with `line1`
        // here, Kimera will use a builder to figure out how mock it.
        // In this case, `buildMocks` will use `Example Street` mock for the `line1` field.
        buildMocks('Address', { country: 'Cuba' }),
      );

      // Replace a list field with an empty list.
      store.update('launch.rockets', [])

      // Append a list field.
      store.update('launch.rockets', [
        ...store.get('launch.listField'),
        // The `buildMocks` scenario can be omitted, and Kimera will use the
        // 'Rocket' builder, if existing to figure out how to mock this type.
        buildMocks('Rocket')
      ]);
      // ...
    }
  })
})
```

:::note
For an example of using mutations, check out the [server example in the Kimera Github repository](https://github.com/lola-tech/graphql-kimera/tree/master/examples/server).
:::
