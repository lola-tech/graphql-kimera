---
id: tutorial-first-builder
title: First Builder
sidebar_label: 2. First Builder
---

Creating the first Object Type Builder

As you remember from the previous section, running a `me` query will return randomly generated data:

```json
{
  "data": {
    "me": {
      "id": "irg5btv90",
      "name": "Mocked String Scalar",
      "gender": "FEMALE"
    }
  }
}
```

At this point we may realize that we'd prefer having an actual name instead of an unappealing `Mocked String Scalar` for name field. That means it's time to use our first builder.

Since `name` is a pretty common field name, there's no point in writing a [Field Name Builder](/graphql-mirage/docs/field-name-builder). What we want is to set the field in the context of the `User` type. For that, we'll use an [Object Type Builder](/graphql-mirage/docs/object-type-builder).

First, lets install a fake data generator library. For this tutorial, we'll use [casual](https://github.com/boo1ean/casual): `yarn add casual`.

```javascript
// ...
const typeBuilders = {
  ["User"]: () => ({
    name: casual.full_name,
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

Re-runing the query will return an actual fake name for the `name` field.

Links:

- Read more on [how `getDefaultDataSources` works](/graphql-mirage/docs/get-executable-schema#getdefaultdatasourcescontext).
- Read more on [how Object Type Builders work](/graphql-mirage/docs/object-type-builders).
