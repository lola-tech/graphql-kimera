---
id: api-mock-resolver
title: mockResolver
sidebar_label: mockResolver
---

This is a function with which you can create resolvers for `Query` fields and subfields.

```js {3,15-28}
const {
  getExecutableSchema,
  mockResolver,
} = require("@lola-tech/graphql-kimera");

const schema = `
  type Query {
  ...
`;

const executableSchema = getExecutableSchema({
  typeDefs: schema,
  mockProvidersFn: (context) => ({
    scenario: {
      rockets: mockResolver(
        // 1st argument: `resolverFactoryFn`
        (store) => (_, { type }) => {
          // `mocks` is the store containing the mocks for the `rockets` field.
          const mockedRockets = store.get();

          return type
            ? mockedRockets.filter((rocket) => rocket.type === type)
            : mockedRockets;
        },
        // 2nd argument: `scenario`
        [{ type: "Shuttle" }, {}, { type: "Shuttle" }] // Optional
      ),
    },
  }),
});
```

## API

### mockResolver(resolverFactoryFn, scenario)

`mockResolver` accepts two arguments:

1. `resolverFactoryFn`\* is a `required` function that gets the field mocks store as its argument, and needs to return a [resolver](/graphql-kimera/docs/glossary#resolver).
2. The field `scenario`, which is _Optional_.

Here's each argument in greater detail:

#### `resolverFactoryFn`

`(store) => (info, args, ...) => {...}`

- The argument to factory function is the field `store`: an object that contains the mocked data for the field we are defining the resolver for. The store defines a `get` method that returns the mocked data.
- The `store` `get` method accepts an optional `string` argument, that represents the path.
- You need to always use the `get` `store` method to retrieve data.
- The factory function needs to return a valid [resolver](/graphql-kimera/docs/glossary#resolver).

You can see an example of this in action on the [Query Resolvers page](/graphql-kimera/docs/query-resolvers#mockresolver-examples).

---

#### `scenario`

An object that represents the scenario for the specific field we are mocking the resolver for.

If omitted, the field will be mocked as it would if no scenario was defined for this field.

## Example

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

Here's an example of mocking a resolver for the `launches` field of the `Query` type.

```js
const executableSchema = getExecutableSchema({
  typeDefs: schema,
  mockProvidersFn: (context) => ({
    scenario: {
      launches: mockResolver(
        (store) => (_, { site }) => {
          // Get all launches mocked
          const launches = store.get();

          // Get rockets from the first launch
          const firstLaunchRockets = store.get("launches.0.rockets");

          // ...
        },
        // `store.get()` will retrieve mocks that
        // are build according to this scenario.
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
