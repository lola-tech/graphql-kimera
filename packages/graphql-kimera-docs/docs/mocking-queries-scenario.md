---
id: mocking-queries-scenario
title: Mocking queries
sidebar_label: Mocking queries
---

> _Customize mocks for queries by defining a Query scenario._

Let's start with the following schema:

```graphql
type Query {
  launch: Launch
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

We have a single query: `launch` which will return information about the ongoing rocket launch.

## Default mocks using no configuration

To start mocking with Kimera, pass the schema definition to the `getExecutableSchema` function from Kimera as the `typeDefs` option. This will generate mocks for all queries in the schema, with zero configuration.

```js title="server.js" {2,9,12}
const { ApolloServer } = require("apollo-server");
const { getExecutableSchema } = require("@lola-tech/graphql-kimera");

const schema = `
  type Query {
  ...
`;

const executableSchema = getExecutableSchema({ typeDefs: schema });

const apollo = new ApolloServer({
  schema: executableSchema,
  introspection: true,
});

apollo.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

## Customize mocks by defining the Query scenario

In order to customize the mocks, we'll need to define our first mock provider: the Query scenario.

In order to use our scenario we need to define a function that we will pass as the `mockProvidersFn` option to `getExecutableSchema`.

This `mockProvidersFn` function needs to return an object with our scenario.

```js {4-10}
const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvidersFn: (context) => ({
    scenario: {
      launch: {
        site: "Kennedy Space Station",
        rockets: [{}, { type: "Exploration Vessel", fuel: "DILITHIUM" }],
        isBooked: true,
      },
    },
  }),
});
```

This will make it so the `launch` query is mocked with its:

- `site` field set to `Kennedy Space Station`;
- `rockets` field containing two rockets, and the second rocket being of type "Exploration Vessel":

All other fields that haven't been explicitly mocked will be mocked with default values.

Running:

```
query {
  launch {
    id
    site
    rockets {
      name
      type
      fuel
    }
    isBooked
  }
}
```

will yield (custom mocks highlighted):

```json {5,14,15,18}
{
  "data": {
    "launch": {
      "id": "Mocked Id Scalar",
      "site": "Kennedy Space Station",
      "rockets": [
        {
          "name": "Mocked String Scalar",
          "type": "Mocked String Scalar",
          "fuel": "PLASMA"
        },
        {
          "name": "Mocked String Scalar",
          "type": "Exploration Vessel",
          "fuel": "DILITHIUM"
        }
      ],
      "isBooked": true
    }
  }
}
```

## What is a scenario?

:::note
When we refer to "the scenario" we refer to the `Query` scenario (ie. the scenario for the `Query` type).
:::

To understand what a scenario is, we'll focus on understanding the `Query` scenario. To build the correct mental model, think about how the `Query` type would look in an object form.

For example, take the following slightly modified schema:

```graphql
type Query {
  launch: Launch
  rockets: [Rockets]!
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
}
```

The _`Query` type object form_ (or in short the **`Query` object**) would be:

```js
{
  launch: {
    id: "...",
    site: "...",
    rockets: [
      { id: "...", name: "...", type: "..."},
      ...
    ],
    isBooked: "..."
  },
  rockets: [
    { id: "...", name: "...", type: "..."},
    ...
  ],
}
```

Keeping all of this in mind, the `Query scenario` (or simply "the scenario") is an object that:

- contains mocks for the `Query` type;
- has the same structure as the `Query` object.

:::note
Kimera allows you to define scenarios for other types than `Query` in the context of builders (another type of mock provider) or in resolvers, but we'll talk more about that in other sections of the docs.
:::

Next, we'll talk about some of the characteristics of a scenario.

### A scenario can mock fewer fields than what's in the schema

A scenario doesn't need to contain all of the fields of the type it mocks. In fact, **it can contain as few or as many fields we want to mock**, as long as it matches the structure of - in the case of the `Query` scenario - the `Query` object.

These are all valid scenarios:

```js
{
  launch: {
    site: "Kennedy Space Station",
    rockets: [{}, { type: "Exploration Vessel" }],
    isBooked: true,
  },
}
```

```js
{
  launch: {
    site: "Kennedy Space Station",
  },
  rockets: [{}, {}],
}
```

```js
{
  rockets: [{ type: "Starship", name: "Enterprise" }],
}
```

### A scenario can go as deep as possible

A scenario can be as deep or as shallow we want, type permitting. Take the following schema:

```graphql
type Query {
  me: User
}

type User {
  address: Address!
  name: String!
}

type Address {
  city: String
  country: Country!
}

type Country {
  language: String!
}
```

These are all valid scenarios:

```js
{
  me: {
    address: {
      country: {
        language: "Latin",
      }
    }
  }
}
```

```js
{
  me: {
    address: {
      city: "Berlin",
    }
  }
}
```

```js
{
  me: {
    name: "Dumitru Prunariu",
  }
}
```

[Next](/graphql-kimera/docs/mocking-types-builders), we'll learn how to mock individual types using another mock provider: builders.
