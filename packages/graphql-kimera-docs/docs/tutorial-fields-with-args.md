---
id: tutorial-fields-with-args
title: Fields with arguments
sidebar_label: 4. Fields with arguments
---

Write resolvers for [fields with arguments](https://graphql.org/learn/schema/#arguments)

Say we decide to want support for Personas in our app. Lets amend the schema to add a `Persona` type, and the ability to query for a list of Personas from a specific city.

```graphql
# ...

type Persona {
  id: ID!
  city: City
}

type Query {
  cities: [City]
  personas(city: String): [Persona]
}

# ...
```

To deal with the newly added `personas` field with arguments, Mirage allows us to write field resolvers in our Object Type Builders.

```javascript
// ...

const typeBuilders = {
  // ...
  ['Query']: () => ({
    personas: getPersonas =>
      function personasResolver(_, { city }) {
        return city
          ? getPersonas().filter(persona => persona.city.name === city)
          : getPersonas();
      },
  }),
};

// ..
```

The `personasResolver` function needs access to the list of available `personas` in order to do filtering, so Mirage conveniently passes a `getPersonas` function which returns the total list of available personas to our resolver.

> **Note**
>
> You can read more about the fields resolvers syntax on the [Object Type Builders concepts page](/graphql-kimera/docs/object-type-builders#fields-with-arguments).

We have our resolver in place, but there seems to be a problem. Inspecting the result of the query that returns all cities and all personas...

```graphql
query {
  cities {
    name
  }
  personas(city: "") {
    city {
      name
    }
  }
}
```

...reveals that we're getting personas from cities that aren't in our cities list. That may be what we want, but lets assume we want to link personas to the list of available cities.

### Faking dependencies

To make sure that personas are only from cities from our `cities` list, we need to:

1. Create a Scenario that describes the cities the `cities` query.
2. Create a `Persona` Object Type Builder that sets the city to one of those values.

```javascript
const cities = times(5, () => ({ id: casual.uuid, name: casual.city }));
const typeBuilders = {
  // ...
  ['Persona']: () => ({
    city: casual.random_element(cities),
  }),
  ['Query']: () => ({
    cities: cities,
    // ...
  }),
};
```

> **Important Note**
>
> Mirage doesn't actually link the `city` field to an object in the `cities` list. All it does is that when it generates a persona, it will generate another city with a shape that respects the one set in the Scenario. Internally, the object that you see as part of the `cities` list result, and the ones set as `city` fields on `Persona`s, have different references.
>
> Understanding this is important when working with mutations, because as a consequence, in some situations we might need to update separate objects in the `Query` tree even though they might seem the same from an UI point of view.
>
> This is different from when implementing a real server where mutating data would touch the db which would propagate changes.

Links:

- Read more on [how field resolvers work in Object Type Builders](/graphql-kimera/docs/object-type-builders#fields-with-arguments)
