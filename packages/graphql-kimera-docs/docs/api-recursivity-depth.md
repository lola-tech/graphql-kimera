---
id: api-recursivity-depth
title: KIMERA_RECURSIVITY_DEPTH_LIMIT
sidebar_label: process.env configuration
---

This is a env variable that controls the depth to which Kimera will recursively mock types that reference each other recursively.

```bash
# default value set to 20
export KIMERA_RECURSIVITY_DEPTH_LIMIT=20;
```

Take the following cyclical schema:

```graphql {8,13}
type Query {
  me: User
}

type User {
  id: ID!
  username: String!
  trip: Launch
}

type Launch {
  site: String!
  pilot: User
}
```

When automocking the `me` query, Kimera will attempt to:

1. mock the `me` field on the `Query` type which will lead it to
2. mock the `trip` field on the `User` type which will lead it to
3. mock the `pilot` field on the `Launch` type which will lead it to
4. mock the `trip` field on the `User` type which will lead it to
5. mock the `pilot` field on the `Launch` type ...

... and so it keeps going. With no mocking depth limit the process would run out of memory.

By default Kimera limits the mocking depth to 20. When the depth has been exceeded, Kimera mocks that field at the depth edge with a resolver which throws a `Mocking depth exceeded` error.

If you need to change the depth to which Kimera allows mocking you can do so using the `KIMERA_RECURSIVITY_DEPTH_LIMIT` enviornment variable.
