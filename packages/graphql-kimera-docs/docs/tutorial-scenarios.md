---
id: tutorial-scenarios
title: Scenarios
sidebar_label: 6. Scenarios
---

Alternate between different shapes of data with [Scenarios](/graphql-kimera/docs/scenarios)

Lets take a look at our current schema.

```graphql
type City {
  id: ID!
  name: String
  population: Int
  airports: [Airport]
}

type Airport {
  id: ID!
  name: String
  address: String
}

type Persona {
  id: ID!
  city: City
  address: String
}

type Query {
  cities: [City]
  personas(city: String): [Persona]
}

schema {
  query: Query
}
```

Now lets say we to be able to switch between different versions of our server with different data for our testing. Say we want:

- A version with `5` `cities` with no `airports` and no personas
- A version with `5` personas, all from `Cluj-Napoca`, and no cities

Enter Scenarios:

```javascript
// ...
const scenarioCities = {
  cities: times(5, () => ({ airports: null })),
  personas: null,
};

const scenarioPersonas = {
  cities: null,
  personas: times(5, () => ({ city: { name: 'Cluj-Napoca' } })),
};

function getDefaultDataSources() {
  return {
    scenario:
      process.argv[2] === 'personas' ? scenarioPersonas : scenarioCities,
    typeBuilders,
    nameBuilders,
  };
}
// ...
```

Now running `node index.js personas` will run scenario 2, and omitting the argument will run the 1st scenario.

Links:

- Read more on [how Scenarios work](/graphql-kimera/docs/scenarios)
