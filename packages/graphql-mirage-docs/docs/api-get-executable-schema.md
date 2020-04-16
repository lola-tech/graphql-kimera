---
id: api-get-executable-schema
title: getExecutableSchema
sidebar_label: getExecutableSchema
---

Returns an executable schema with custom `Mutation` resolvers, and with `Query` resolvers that return data based on custom data sources

```javascript
getExecutableSchema(
  typeDefs,
  getDefaultDataSources, // Optional
  customDataSources, // Optional
  getMutationResolvers
);
```

## `typeDefs`\*

_Required_. A [GraphQL schema language string](/docs/glossary#schema-definition-language) that contains the schema definition. Putting it another way, it's what usally resides in your `schema.graphql` file.

---

## `getDefaultDataSources(context)`

_Optional_. A function that receives the [resolver context](/docs/glossary#resolver) as an argument and needs to return an object containing the available data sources that will be used to generate data for the type fields in the schema.

```javascript
function getDefaultDataSources(context) {
  return {
    scenario: getDefaultScenario(context),
    nameBuilders: getDefaultNameBuilders(context),
    typeBuilders: getDefaultTypeBuilders(context),
  };
}
```

> **Note**
>
> Read more about how data sources work in the [Data Sources](/docs/data-sources) part of the docs.

---

## `customDataSources`

_Optional_. An object that needs to have the same structure as the result of `getDefaultDataSources`. These data sources will overwrite the returned by `getDefaultDataSources` by performing a deep object merge. Its purpose is to provide a mechanism to overwrite the default data sources from outside of our server, e.g. from a React app.

```javascript
const defaultScenario = {
  viewer: {
    userName: 'fancypants2019',
    fullName: 'Tarzan'
    subscribed: true,
    watchList: [{}, { name: 'Some fancy movie title' }],
    address: {
      city: 'Cluj-Napoca',
      country: 'Romania'
    }
  },
};

const customScenario = {
  viewer: {
    userName: 'Jane',
    watchList: [],
    address: {
      city: 'Iasi'
    }
  },
};

getExecutableSchema(
  typeDefs,
  () => ({ scenario: defaultScenario }),
  { scenario: customScenario },
  getMutationResolvers
);
```

The code above will result in having the `viewer` query have the following shape:

```javascript
const defaultScenario = {
  viewer: {
    userName: 'fancypants2019', // Default
    fullName: 'Jane', // Custom
    subscribed: true, // Default
    watchList: [], // Custom
    address: {
      city: 'Iasi', // Custom
      country: 'Romania', // Default
    },
  },
};
```

> **Note**
>
> The array fields are overwritten, while objects are deeply merged.

---

## `getMutationResolvers(cache, buildMocks, context)`

_Optional_. A function that returns an object with the [Mutation resolvers](https://www.apollographql.com/docs/tutorial/resolvers.html#mutation) for our schema.

```graphql
type Order {
  id: ID!
  total: Int
  currency: String
  products: [Product]
}
```

```javascript
function getMutationResolvers(cache, buildMocks, context) {
  return {
    addOrder: (_, { total, currency, products }) => {
      const newOrder = buildMocks(
        'Order',
        { total, currency, products }
      )

      cache.persona.orders = [...cache.persona.orders, newOrder]

      return {
        order: newOrder
        errors: [],
      };
    },
  };
}
```

### `cache`

A reference to the generated `Query` tree. This is the persistence layer of our mocks, so this where changes need to be made as a result of the mutation. In a real server, this would be replace with access to a database.

Read more on [the `cache` documentation page](/docs/api-cache).

### `buildMocks(type, scenario)`

A function that allows us to generate data for a specific Object Type. Useful when we need to create a new node in a mutation. Accepts the following arguments:

- `type` (Required): The type of the node we want to generate data for.
- `scenario` (Optional): A specific scenario relevant to the current generation of the node.

Read more on [the `buildMocks` documentation page](/docs/build-mocks).

### `context`

The resolver [context](/docs/glossary#context).
