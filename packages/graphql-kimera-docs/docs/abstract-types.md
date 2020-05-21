---
id: abstract-types
title: Abstract Types
sidebar_label: Abstract Types
---

> _Use \_\_typename to specify a concrete type for an abstract field._

:::note
This page assumes familiarity with the concept of a scenario. If you want to learn about scenarios, read the ["Mocking queries"](/graphql-kimera/docs/mocking-queries-scenario) section of the docs.
:::

By default, when Kimera needs to generate mocks for fields which are interfaces or unions, it will do so as if the field were of a concrete type. It will do so by automatically selecting the first concrete type defined in the schema.

Let's use the following schema as an example:

```graphql
type Query {
  ships(type: String!): [Ship]!
  assets: [Asset]!
}

interface Ship {
  id: ID!
  type: String!
}

union Asset = Powerplant | Starship | Rocket

type Rocket implements Ship {
  id: ID!
  type: String!
}

type Starship implements Ship {
  id: ID!
  type: String!
  class: String!
}

type Powerplant {
  address: String!
}
```

With no configuration, Kimera will return:

- a list of `Powerplants` for the `assets` query because the first concrete type defined for in the schema for the `Asset` union is `Powerplant`;
- a list of `Rocket`s for the `ships` query because the first concrete type defined for the `Ship` interface is `Rocket`.

### Customize mocks using `__typename`

Using `__typename` in your scenario will allow you to select the concrete type you want Kimera to mock.

```js
const executableSchema = getExecutableSchema({
  typeDefs: schema,
  mockProvidersFn: (context) => ({
    scenario: {
      ships: [{ __typename: "Starship" }, { __typename: "Rocket" }],
      assets: [{ __typename: "Starship" }, { __typename: "Rocket" }, {}],
    },
  }),
});
```
