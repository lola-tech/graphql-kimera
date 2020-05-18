---
id: tutorial-fields-repeating
title: Fields that repeat across Object Types
sidebar_label: 5. Fields that repeat
---

How we can avoid repeating when we have fields that repeat across types

Our schema now contains `Persona`s and `Airport`s. Lets add an `address` field to each of them.

```graphql
# ...

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

# ...
```

In order to generate something that looks like an address for those fields, we'd need to add them each both to their respective Object Type Builders like we did with `name` for `City` in the [second part of the tutorial](/graphql-kimera/docs/tutorial-first-builder), but that introduces what seems like needles repetition.

Moreover, what if we grow our schema with more types that require and address field? This could be address with some indirection, ie. adding an `Address` type, but lets assume we want the field to be a built-in scalar.

For these cases Mirage allows you to define [Field Name Builders](/graphql-kimera/docs/field-name-builders).

```javascript
// ...

const nameBuilders = {
  address: () => casual.address,
};

function getDefaultDataSources() {
  return {
    typeBuilders,
    nameBuilders,
  };
}

// ..
```

Notice how now we're adding a new data source: `nameBuilders`. The query now reveals all address fields have fake addresses.

```graphql
query {
  cities {
    airports {
      address
    }
  }
  personas(city: "") {
    address
  }
}
```

Links:

- Read more on [how Field Name Builders work](/graphql-kimera/docs/field-name-builders)
