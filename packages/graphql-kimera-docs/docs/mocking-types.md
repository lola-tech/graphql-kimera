---
id: mocking-types
title: First Builder
sidebar_label: Mocking Types
---

Creating the first Object Type Builder

As you remember from the previous section, running a `city` query will return randomly generated data:

```json
{
  "data": {
    "city": {
      "id": "irg5btv90",
      "name": "GENERATED_STRING",
      "population": 695
    }
  }
}
```

At this point we may realize that we'd prefer having an actual city instead of an unappealing `GENERATED_STRING` for its name. That means it's time to use our first builder.

Since `name` is a pretty common field name, there's no point in writing a [Field Name Builder](/graphql-kimera/docs/field-name-builder). What we want is to set the field in the context of the `City` type. For that, we'll use an [Object Type Builder](/graphql-kimera/docs/object-type-builder).

First, lets install a fake data generator library. For this tutorial, we'll use [casual](https://github.com/boo1ean/casual): `yarn add casual`.

```javascript
// ...
const typeBuilders = {
  ["City"]: () => ({
    name: casual.city,
  }),
};

function getDefaultDataSources() {
  return {
    typeBuilders,
  };
}

const executableSchema = getExecutableSchema(typeDefs, getDefaultDataSources);
// ...
```

Re-runing the query will return an actual fake city for the `name` field.

Links:

- Read more on [how `getDefaultDataSources` works](/graphql-kimera/docs/get-executable-schema#getdefaultdatasourcescontext).
- Read more on [how Object Type Builders work](/graphql-kimera/docs/object-type-builders).
