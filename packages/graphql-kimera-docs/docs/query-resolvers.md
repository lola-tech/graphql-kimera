---
id: query-resolvers
title: Query Resolvers
sidebar_label: Query Resolvers
---

> _Custom query resolvers are useful for fields with arguments._

:::note
This page assumes familiarity with the concept of a scenario. If you want to learn about scenarios, read the ["Mocking queries"](/graphql-kimera/docs/mocking-queries-scenario) section of the docs.
:::

Suppose we have a schema with a `rocket` query that can be filtered by passing the a rocket `type` argument.

```graphql
type Query {
  rockets(type: String!): [Rocket]
}

type Rocket {
  id: ID!
  name: String
  type: String
  fuel: Fuel
}
```

To implement the filtering, Kimera allows us to define resolvers in our scenarios.

```js
const {
  getExecutableSchema,
  useResolver,
} = require("@lola-tech/graphql-kimera");

const schema = `
  type Query {
  ...
`;

const executableSchema = getExecutableSchema({
  typeDefs: schema,
  mockProvidersFn: (context) => ({
    scenario: {
      rockets: useResolver(
        // First `useResolver` arg: the resolver factory
        (store) => (_, { type }) => {
          // `mocks` is the store containing the mocks for the `rockets` field.
          const mockedRockets = store.get();

          return type
            ? mockedRockets.filter((rocket) => rocket.type === type)
            : mockedRockets;
        },
        // Second `useResolver` arg (optional):  the scenario
        [{ type: "Shuttle" }, {}, { type: "Shuttle" }]
      ),
    },
  }),
});
```

To define a resolver, we use the `useResolver` function imported from the `@lola-tech/graphql-kimera` package.

## `useResolver` API

`useResolver` accepts two arguments:

1. The resolver factory function

- _Function_: `(store) => (info, args, ...) => {...}`
- The argument to factory function is the field `store`: an object that contains the mocked data for the field we are defining the resolver for. The store defines a `get` method that returns the mocked data.
- The `store` `get` method accepts an optional `string` argument, that represents the path
- You need to always use the `get` `store` method to retrieve data
- The resolver factory function needs to return a [valid graphql resolver](/graphql-kimera/docs/glossary#resolver)

2. (Optional) The field scenario

- If omitted, the field will be mocked as it would if no scenario was defined for this field.
- The mocked data will be set in the field store, which is supplied to the resolver factory function as its argument.

## `useResolver` examples

Let's use the following schema:

```graphql
type Query {
  launches(site: String!): [Launch]
}

type Launch {
  id: ID!
  site: String
  rockets: [Rocket]
  isBooked: Boolean!
}

type Rocket {
  id: ID!
  name: String
  type: String
  fuel: Fuel
}

enum Fuel {
  PLASMA
  ION
  DILITHIUM
}
```

```js
const executableSchema = getExecutableSchema({
  typeDefs: schema,
  mockProvidersFn: (context) => ({
    scenario: {
      launches: useResolver(
        (store) => (_, { site }) => {
          // Get all launches mocked
          const launches = store.get();

          // Get rockets from the first launch
          const firstLaunchRockets = store.get("launches.0.rockets");

          // ...
        },
        [{ site: "Vandenberg Base Space" }, {}, {}, {}, {}]
      ),
    },
    builders: {
      Launch: () => ({
        site: "Kennedy Space Center",
      }),
    },
  }),
});
```

[Next](/graphql-kimera/docs/mocking-mutations), we'll talk about mocking Interfaces and Union types.
