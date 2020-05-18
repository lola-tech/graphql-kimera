---
id: tutorial-mutations
title: Mutations
sidebar_label: 7. Mutations
---

Managing changes to data in Mutation resolvers

Lets modify the schema to add support for a `addCity` mutation that accepts the name of the city, and returns the complete list of cities, including the new one.

```graphql
# ...

type AddCityResult {
  cities: [City]
}}

type Mutation {
   addCity(name: String): AddCityResultt
}

schema {
  query: Query
  mutation: Mutation
}

# ...
```

In order to pass a resolver for that mutation to Mirage, we need to pass a [getMutationResolvers function](/graphql-kimera/docs/api-get-executable-schema#getmutationresolverscache-buildmocks-context) as an argument to `getExecutableSchema`. The `getMutationResolvers` function needs to return an object with [resolvers](/graphql-kimera/docs/glossary#resolver) for all mutation we want to handle:

```javascript
// ...

function getMutationResolvers(cache, buildMocks) {
  return {
    addCity: (_, { name }) => {
      const newCity = buildMocks('City', { name });

      cache.cities = cache.cities ? [...cache.cities, newCity] : [newCity];

      return {
        cities: cache.cities,
      };
    },
  };
}

// ...

const executableSchema = getExecutableSchema(
  typeDefs,
  getDefaultDataSources,
  {},
  getMutationResolvers
);

// ...
```

The `getMutationResolvers` function receives:

- a reference to the data `Query` tree as the [`cache` argument](/graphql-kimera/docs/api-get-executable-schema#cache)
- the [`buildMocks`](/graphql-kimera/docs/api-build-mocks) function that allows us to build a new object with generated data from a specific Object Type. It accepts the `type` name, and a [Scenario](/graphql-kimera/docs/scenario) which specifies what fields need to be set.

The resolver:

- creates a new `City` object using the `City` object type a template,
- updates the `cities` query result by adding the newly created city, and
- returns the result of the mutation in the expected `AddCityResult` format.

### Modifying fields with arguments

The previous example was pretty straight forward, but lets complicate things a bit by adding an `addPersona` mutation.

```graphql
type AddPersonaResult {
  personas: [Persona]
}

type Mutation {
  # ...
  addPersona(cityName: String, name: String): AddPersonaResult
}
```

This looks very similar to the `addCity` mutation, so lets implement its resolver in the same way.

```javascript
// ...

function getMutationResolvers(cache, buildMocks) {
  return {
    addPersona: (_, { name, cityName }) => {
      const newPersona = buildMocks('Persona', {
        name,
        city: { name: cityName },
      });

      cache.personas = cache.personas
        ? [...cache.personas, newPersona]
        : [newPersona];

      return {
        personas: cache.personas,
      };
    },
  };
}

// ...
```

Running this code and executing an `addPersona` mutation will result in a `cache.personas is not iterable` error. Can you figure out why? A clue can be found by comparing [the `cities` builder](/graphql-kimera/docs/tutorial-fields-with-args#faking-dependencies) to [the `personas` builder](/graphql-kimera/docs/tutorial-fields-with-args).

```javascript
const typeBuilders = {
  ['Query']: () => ({
    cities: times(5, () => ({ name: casual.city }));,
    personas: getPersonas => {
      return function personasResolver(_, { city }) {
        return city
          ? getPersonas().filter(persona => persona.city.name === city)
          : getPersonas();
      };
    },
  }),
};
```

```graphql
type Query {
  cities: [City]
  personas(city: String): [Persona]
}
```

As you may now remember, `personas` is a field that accepts arguments, which prompted us to implement a resolver factory (ie. a function that returns a resolver function) for it. The builder for the `cities` field is just an Array.

This means that when building the `Query` type data tree (the one that gets passed down as the `cache` argument in our `buildMocks` function), Mirage sets static values only for fields without any arguments.

However, when a field meets the following two conditions...

- the field has arguments,
- and Mirage can find a resolver factory in an Object Type builder for it,
  ...the value set in the `cache` for the field is the resolver function.

In our case, our `personas` field from the `Query` type is a field with arguments, and Miage can find a resolver factory function for it in the `Query` Object Type Builder, so it sets its value to the `personasResolver` function.

That explains our `cache.personas is not iterable` error, since the spread operator works on [iterables](https://javascript.info/iterable), and the `personasResolver` function is not an iterable. For these cases, Mirage adds a handy `getData` function on the resolver function that allows us to get the data.

```javascript
// ...

function getMutationResolvers(cache, buildMocks) {
  return {
    addPersona: (_, { cityName, name }) => {
      const newPersona = buildMocks('Persona', {
        name,
        city: { name: cityName },
      });

      const personaList = cache.personas.getData();
      cache.personas = personaList
        ? [...personaList, newPersona]
        : [newPersona];

      return {
        personas: cache.personas,
      };
    },
  };
}

// ...
```

Running the mutation again will return the expected result.

This concludes our tutorial. You should now be able to conquer the world. If you can't, open an issue in the [graphql-kimera repo](https://github.com/lola-tech/graphql-kimera).
