---
id: tutorial-array-fields
title: Array Fields
sidebar_label: 3. Array Fields
---

Define the shape of Array Fields

Lets image our user is an astronaut and amend the schema to add an `Launch` type.

```graphql
type User {
  id: ID!
  name: String
  trips: [Launch]
}

type Launch {
  id: ID!
  site: String
}

# ...
```

Lets say we want our mock server to return two trips for our `me` query, and the first trips be launched from a site called `Kennedy Space Center`. To do that, we can use a [Scenario](/graphql-mirage/docs/scenarios) for our field.

```javascript
// ...

const typeBuilders = {
  ["User"]: () => ({
    name: casual.full_name,
    trips: [{ name: "Kennedy Space Center" }, {}],
  }),
};

// ..
```

Running a `me` `query` will predictably return two launches:

```json
{
  "data": {
    "me": {
      "id": "m43g3ealt",
      "name": "Cloog",
      "trips": [
        {
          "site": "Kennedy Space Center"
        },
        {
          "site": "Mocked String Scalar"
        }
      ]
    }
  }
}
```

Links:

- Read more on [how Object Type Builders work](/graphql-mirage/docs/object-type-builders).
- Read more on [how Scenarios work](/graphql-mirage/docs/scenarios).
