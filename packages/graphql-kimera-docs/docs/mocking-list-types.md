---
id: mocking-list-types
title: Array Fields
sidebar_label: Mocking List Types
---

Define the shape of Array Fields

Lets amend the schema to add an `Airport` type.

```graphql
type City {
  id: ID!
  name: String
  airports: [Airport]
}

type Airport {
  id: ID!
  name: String
}

# ...
```

Lets say we want our mock server to return two airports for our city, and the first airport be called `Avram Iancu`. To do that, we can use a [Scenario](/graphql-kimera/docs/scenarios) for our field.

```javascript
// ...

const typeBuilders = {
  ["City"]: () => ({
    name: casual.city,
    airports: [{ name: "Avram Iancu" }, {}],
  }),
};

// ..
```

Running a `city` `query` will predictably return two airports:

```json
{
  "data": {
    "city": {
      "id": "m43g3ealt",
      "name": "Cloog",
      "population": 476,
      "airports": [
        {
          "name": "Avram Iancu"
        },
        {
          "name": "GENERATED_STRING"
        }
      ]
    }
  }
}
```

Links:

- Read more on [how Object Type Builders work](/graphql-kimera/docs/object-type-builders).
- Read more on [how Scenarios work](/graphql-kimera/docs/scenarios).
