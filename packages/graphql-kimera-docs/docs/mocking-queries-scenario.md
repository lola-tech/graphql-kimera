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

```js title="server.js"
const { ApolloServer, gql } = require("apollo-server");
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

apollo.listen({ port: 3337 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

## Customize mocks by defining the Query scenario

In order to customize the mocks, we'll need to define our first mock provider: the Query scenario.

Pass this scenario to the `getExecutableSchema` function in order to customize the `query` response.

```js
const executableSchema = getExecutableSchema({
  typeDefs,
  scenario: {
    launch: {
      site: "Kennedy Space Station",
      rockets: [{}, { type: "Exploration Vessel", fuel: "DILITHIUM" }],
      isBooked: true,
    },
  },
});
```

This will make it so the `launch` query is mocked with its:

- `site` field set to `Kennedy Space Station`;
- `rockets` field containing two rockets, and the second rocket being of type "Exploration Vessel":

```json
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

All other fields that haven't been explicitly mocked will be mocked with default values.

## What is the Query scenario?

In order to build the correct intuition about what the Query scenario is, let's think about how the `Query` type would look in its object form.

For example, take the following slightly modified schema:

```graphql
type Query {
  launch: Launch
  rockets(type: String!): [Rockets]!
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

The `Query` _object form_ (or in short the **`Query` object**) would be:

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

- contains mocks for `Query` type;
- has the same structure as the `Query` object.

:::note
Kimera allows you to define scenarios for other types than `Query` in the context of builders (another type of mock provider) or in resolvers, but we'll talk more about that in other sections of the docs.
:::

### A scenario can mock fewer fields than what's in the schema

A scenario doesn't need to contain all of the fields of the type it mocks. In fact, **it can contain as few or as many fields we want to mock**, as long as it matches the structure of - in this case - the `Query` object.

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

### The scenario can go as deep as possible

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
