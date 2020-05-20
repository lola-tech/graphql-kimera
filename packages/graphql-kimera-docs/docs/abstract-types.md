---
id: abstract-types
title: Interfaces
sidebar_label: Abstract Types
---

Use \_\_typename to specify a concrete type for an abstract field

When Kimera walks the `Query` tree to generate data, and it encounters a field that's an Object Type, it automatically sets the `__typename` field to its type name.

When the type of the field is an interface, absent any instruction, it selects the first type in the schema that implements that interface, and generates data for that field as if it were that selected type.

```graphql
interface MenuItem {
  id: ID!
  url: String
}

type ExpandableMenuItem implements MenuItem {
  id: ID!
  url: String
  expanded: Boolean
}

type NavigationMenuItem implements MenuItem {
  id: ID!
  url: String
  label: String
}

type Query {
  menu: [MenuItem]
}
```

For the example above, if not instructed otherwise, the menu query will return an array composed of `ExpandableMenuItem`s.

We can tell Kimera what concrete types to build for our interface fields by setting the `__typename` in the field scenario.

```javascript
{
  menu: [times(5, () => ({ __typename: "NavigationMenuItem" }))];
}
```

The scenario above will force Kimera to generate a menu with exactly five `NavigationMenuItem`s and no `ExpandableMenuItem`s.
