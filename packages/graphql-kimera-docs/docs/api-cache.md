---
id: api-cache
title: getMutationResolvers/cache ❌
sidebar_label: ↳getMutationResolvers/cache ❌
---

A reference to the generated `Query` tree.

This is the persistence layer of our mocks, so this where changes need to be made as a result of a mutation. In a real server, this would be replaced with access to a database.

## `getData`

Data for node that refer to fields with arguments, and which have a resolver factory in their respective Object Type Builders, can be accessed with `getData()`.

## Example

Take the following schema, and Query Object Type Builder:

```graphql
# ...

type Query {
  personas(city: String): [Personas]
}

# ...
```

```javascript
// ...
const typeBuilders = {
  ["Query"]: () => ({
    personas: (getPersonas) => {
      return function personasResolver(_, { name }) {
        return city
          ? getPersonas().filter((persona) => persona.name === name)
          : getPersonas();
      };
    },
  }),
};

// ...
```

We can write a resolver for an `addPersona` mutation like this:

```javascript
// ...

function getMutationResolvers(cache, buildMocks) {
  return {
    addPersona: (_, { cityName, name }) => {
      const newPersona = buildMocks("Persona", {
        name,
        city: { name: cityName },
      });

      // cache.personas returns the resolver function.
      const personasList = cache.personas.getData();
      cache.personas = personasList
        ? [...personasList, newPersona]
        : [newPersona];

      return {
        personas: cache.personas,
      };
    },
  };
}

// ...
```
