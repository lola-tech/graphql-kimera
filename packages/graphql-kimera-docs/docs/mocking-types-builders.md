---
id: mocking-types-builders
title: Mocking types with builders
sidebar_label: Mocking types
---

_Customize mocks for types by defining a builders._

:::note
This page assumes familiarity with the concept of _scenario_. If you want to learn about scenarios, read the ["Mocking queries"](/graphql-kimera/docs/mocking-queries-scenario) section of the docs.
:::

Let's start with the following schema:

```graphql
type Query {
  launch: Launch
  rockets: [Rockets]!
}

type Launch {
  id: ID!
  site: String
  rockets: Rocket
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

Defining the following scenario...

```js
const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvidersFn: (context) => ({
    scenario: {
      launch: {
        rockets: [{ name: "Saturn V" }, { fuel: "DILITHIUM" }, {}],
      },
      rockets: [{}],
    },
  }),
});
```

...will yield the following mocks:

```json {7,14}
{
  "data": {
    "launch": {
      // ...
      "rockets": [
        {
          "name": "Saturn V",
          "type": "Mocked String Scalar",
          "fuel": "PLASMA"
        },
        {
          "name": "Mocked String Scalar",
          "type": "Mocked String Scalar",
          "fuel": "DILITHIUM"
        },
        {
          "name": "Mocked String Scalar",
          "type": "Mocked String Scalar",
          "fuel": "PLASMA"
        },
      ],
    },
    "rockets": [{
        {
          "name": "Mocked String Scalar",
          "type": "Mocked String Scalar",
          "fuel": "PLASMA"
        },
    }]
  }
}
```

What if we wanted to have a way of defining mocks for the `Rocket` type once, and have Kimera use those mocks everywhere it encounters the `Rocket` type?

To do that we'll need to make use of another type of mock provider: the builder.

## Mocking types using builders

To add a builder, we'll need to make it part of a `builders` object returned from our `mockProvidersFn` function.

```js title="Scenario + Builder" {3,10-16}
const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvidersFn: (context) => ({
    scenario: {
      launch: {
        rockets: [{ name: "Saturn V" }, { fuel: "DILITHIUM" }],
      },
      rockets: [{}],
    },
    builders: {
      Rocket: () => ({
        type: ["Orion", "Apollo"][_.random(0, 1)],
        name: "Rocket name",
      }),
    },
  }),
});
```

Using the above mock providers will result in:

```json title="The scenario takes precedence"
{
  "data": {
    "launch": {
      // ...
      "rockets": [
        {
          "name": "Saturn V", // From scenario
          "type": "Orion", // From builder
          "fuel": "PLASMA" // Default. No mock providers definition.
        },
        {
          "name": "Rocket name", // From builder
          "type": "Orion", // From builder
          "fuel": "DILITHIUM" // From scenario
        },
        {
          "name": "Rocket name", // From builder
          "type": "Apollo", // From builder
          "fuel": "PLASMA" // Default
        },
      ],
    },
    "rockets": [{
        {
          "name": "Rocket Name", // From builder
          "type": "Apollo", // From builder
          "fuel": "PLASMA" // Default
        },
    }]
  }
}
```

We will now explain what builders are, and other subtleties of their use.

## Scenario mocks take precedence over builder mocks

You may notice in the example above that where fields are mocked in both a builder and in the scenario, **the scenario mock will take precedence**.

## Builders are functions

A **builder is a function** that's used to build mocks for a specific type.

You can have multiple builders defined, each for a separate type.

You define builders on the root of the `builders` object just as you would resolvers for types in a resolver map, or the definitions of types in your schema.

```js title="Multiple builders" {4,5,9,13}
const executableSchema = getExecutableSchema({
  // ...
  mockProvidersFn: (context) => ({
    builders: {
      Rocket: () => ({
        type: ["Orion", "Apollo"][_.random(0, 1)],
        name: "Rocket name",
      }),
      Launch: () => ({
        site: "Kennedy Space Center"
        rockets: [{}]
      }),
    },
  })
});
```

## Builders don't need to mock all fields of a type

[As with the Query scenario](/graphql-kimera/docs/mocking-queries-scenario#a-scenario-can-mock-fewer-fields-than-whats-in-the-schema), the builder can mock as many or as few fields you need it to.

These are all valid builders for the `Rocket` type.

```js
() => ({
  type: "Exploration Vessel",
  name: "Enterprise",
});
```

```js
() => ({
  type: "Exploration Vessel",
});
```

```js
() => ({
  name: "Enterprise",
});
```

## Builder field mocks are scenarios

:::tip
**You can think of a builder as a function that returns a collection of mocks for each of a type's fields**. For example, the `Rocket` builder can contain mocks for the `type` and / or `name` field(s).
:::

The mocks for each of fields in a builder are scenarios. Building on [the `Query` scenario definition from the "Mocking queries"](/graphql-kimera/docs/mocking-queries-scenario#what-is-the-query-scenario) section of the docs, a type `scenario` is an object that:

- contains mocks for that specific type;
- has the same structure as the type's object form.

For example, these are all valid builders for the `Launch` type:

```js
() => ({
  site: "Kennedy Space Center"
  rockets: [{}]
})
```

```js
() => ({
  site: "Kennedy Space Center"
  rockets: [{ name: "Enterprise" }, {}]
})
```

```js
() => ({
  rockets: [{}, {}],
});
```

[Next](/graphql-kimera/docs/query-resolvers), we'll learn how to mock query resolvers.
