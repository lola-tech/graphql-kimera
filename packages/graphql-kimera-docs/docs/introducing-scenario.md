---
id: introducing-scenario
title: The Scenario
sidebar_label: Introducing the Scenario
---

_Customize mocks by defining a scenario._

Let's start with the following Space X themed schema.

```js title="server.js"
const schema = `
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
`;
```

We have a single query `launch` that will return information about the ongoing rocket launch.

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

## Customize mocks using the scenario

In order to customize the mocks, we'll need to defined our first mock provider: the scenario.

Pass the scenario to the `getExecutableSchema` function in order to customize the query response.

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

This will make it so the `launch` query will be mocked with its:

- `site` field set to `Kennedy Space Station`;
- `rockets` field containing two rockets, and the second rocket being of type "Exploration Vessel":

```
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

## What is the Scenario?

In order to build the correct intuition about what is a scenario, let's think about how the `Query` type would look in its object form.

For example, take the following slightly modified schema:

```js
const schema = `
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
`;
```

The `Query` type _object form_ (or in short the **`Query` object form**) is:

```js
{
  launch: {
    id: ...,
    site: ...,
    rockets: [
      { id: ..., name: ..., type: ...},
      ...
    ],
    isBooked: ...
  },
  rockets: [
    { id: ..., name: ..., type: ...},
    ...
  ],
}
```

The scenario is an object with **the same structure as the `Query` object form**.

### The scenario can mock fewer fields than what's in the schema

A scenario doesn't need to contain all of its fields. In fact, **it can contain as few or as many fields we want to mock**, as long as it matches the structure of the `Query` object form.

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

### It can go as deep as possible

A scenario can be as deep or as shallow we want, type permitting. Take the following schema:

```graphql
type Query {
  me: User
}

type User {
  address: Address!
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

[Next](/graphql-kimera/docs/mocking-types), we'll learn how to mock individual types using another mock provider: builders.
