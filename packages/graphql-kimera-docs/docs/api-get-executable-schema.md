---
id: api-get-executable-schema
title: getExecutableSchema
sidebar_label: getExecutableSchema
---

Returns an executable schema with data that's mocked according to the [mock providers](/graphql-kimera/docs/glossary#mock-providers) that are supplied.

```js
const { getExecutableSchema } = require("@lola-tech/graphql-kimera");

const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvidersFn: () => ({}), // optional
  mutationResolversFn: () => ({}), // optional
  mockProviders: {}, // optional
});
```

## API

### getExecutableSchema(options)

`makeExecutableSchema` takes a single argument: an object of options. Only the `typeDefs` option is required.

| options                                                                                                             | Code                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [`typeDefs`\*](/graphql-kimera/docs/api-get-executable-schema#typedefs)                                             | `type Query { ...`                                                                                                             |
| [`mockProvidersFn`](/graphql-kimera/docs/api-get-executable-schema#mockprovidersfn)                                 | `(context) => ({ scenario: ..., builders: ... })`                                                                              |
| [`mutationResolversFn`](/graphql-kimera/docs/api-get-executable-schema#mutationresolversfnstore-buildmocks-context) | `(store, buildMocks, context) =>`<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`({ [mutationName]: (info, args, ...) => { ... } })` |
| [`mockProviders`](/graphql-kimera/docs/api-get-executable-schema#mockproviders)                                     | `{ scenario: ..., builders: ... }`                                                                                             |

We're now going to go over each option in detail.

#### `typeDefs`\*

_Required_. A [GraphQL schema language string](/graphql-kimera/docs/glossary#schema-definition-language) that contains the schema definition. Putting it another way, it's what usally resides in your `schema.graphql` file.

---

#### `mockProvidersFn`

_`(context) => ({ scenario: ..., builders: ... })`_

_Optional_. A function that receives the [resolver context](/graphql-kimera/docs/glossary#context) as an argument and needs to return an object containing [mock providers](/graphql-kimera/docs/glossary#mock-providers) that Kimera will be using to generate mocks.

```javascript
function mockProvidersFn(context) {
  const mockProviders = {
    // 'scenario' has the same structure as the `Query` type
    scenario: {
      ...
    },
    // `builders` maps GraphQL types to functions which build mocks
    // for their fields.
    builders: {
      Rocket: () => ({ rocketExampleField: ... }),
      User: () => { ... },
      ...
    },
  };

  return mockProviders;
}
```

- `scenario` is an object containing the mocks for the `Query` type. You can read an in depth explanation of what the scenario is in the ["What is a scenario?" section of the "Mocking queries" page of the docs](/graphql-kimera/docs/mocking-queries-scenario#what-is-a-scenario).
- `builders` is an object that maps GraphQL types to functions. You can read more about what how they work in the ["Mocking types"](/graphql-kimera/docs/mocking-types-builders#mocking-types-using-builders) section of the docs.

:::note
"Mock providers" is just another way of saying "the scenario and all of the builders that were defined".
:::

---

#### `mutationResolversFn(store, buildMocks, context)`

_Optional_. A function that returns an object that maps Mutation names to [resolvers](https://www.apollographql.com/docs/tutorial/resolvers.html#mutation).

- `store` is an object which holds all of the mocks for our schema. It defined two methods:
  - `store.get(path = '')`: The `get` method will accept an optional `path` string, and return the mocked value stored at that specific path.
  - `store.update(path, updateValue)`: The `update` method will update the value at the supplied path with the new value. If the updated value is an object, the new value will be deeply merged over the existing value.
- `buildMocks('TypeName', scenario)` is a function that mocks a specific type using existing mock providers, and optionally, a custom scenario that we can provide at execution.

You can see [examples of `store` and `buildMocks` in action on the "Mocking Mutations" page](/graphql-kimera/docs/mocking-mutations#mutationresolversfn-api).

---

#### `mockProviders`

_Optional_. An object that needs to have the same structure as the result of `mockProvidersFn`. These mock providers will overwrite the ones returned by `mockProvidersFn` by performing a deep object merge.

:::note
The purpose of this argument is to provide a mechanism to overwrite the default mock providers from outside of our server if need be, e.g. from a React app.
:::

:::tip
**It's useful to think of these as custom mock provider defintions**, and the ones defined in `mockProvidersFn` as default defintions.
:::

```js
const defaultScenario = {
  me: {
    userName: 'c10b10',
    fullName: 'John Doe'
    subscribed: true,
    watchList: [{}, { name: 'Barry Lyndon' }],
    address: {
      city: 'Bucharest',
      country: 'Romania'
    }
  },
};

const customScenario = {
  me: {
    fullName: 'Alex Ciobica',
    watchList: [],
    address: {
      city: 'Cluj-Napoca'
    }
  },
};
  typeDefs,
  mockProvidersFn: () => ({}), // optional
  mutationResolversFn: () => ({}), // optional
  mockProviders: {}, // optional
getExecutableSchema({
  typeDefs,
  mockProvidersFn: () => ({ scenario: defaultScenario }),
  mockProviders: { scenario: customScenario },
});
```

The code above will result in having the `me` query have the following shape:

```javascript
const defaultScenario = {
  me: {
    userName: "c10b10", // Default
    fullName: "Alex Ciobica", // Custom
    subscribed: true, // Default
    watchList: [], // Custom
    address: {
      city: "Cluj-Napoca", // Custom
      country: "Romania", // Default
    },
  },
};
```

:::note
When merging scenarios the array fields are overwritten, while objects are deeply merged

Builders that collide are replaced with the custom definitition.
:::
