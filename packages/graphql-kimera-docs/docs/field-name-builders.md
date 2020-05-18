---
id: field-name-builders
title: Field Name Builders
sidebar_label: Field Name Builders
---

Allow us to set values for fields that repeat across types.

When a field can't be found in neither a Scenario, nor a Object Type Builder, Kimera looks for it in the collection of Field Name Builders. These are meant to help us avoid repetition in cases where a field name refers the same type of data even when defined in multiple types.

```graphql
type Address {
  id: ID!
  name: String
  line1: String
  line2: String
  city: String
}
```

Here, the `city` field is defined on both types, and it always refers to the same data: a city name. This isn't the case for the `name` field which while present on both types, refers to different things: names of addresses (Home, Work, etc.).

A collection of Field Name Builders is an object of the following form:

```javascript
{
  city: () => casual.city
  line1: () => casual.adress1,
  line2: () => casual.adress1,
}
```

Adding `line1` and `line2` to the Field Name Builders makes sure that we can safely add those fields to other types if we so wished, and Kimera would generate relevant values for them.

> **Note**
>
> If we wanted relevant values for the `name` fields we would need to add them to the containing Object Type Builder (`Address`). If we don't care about the value that's generated for this field (ie. we haven't defined it in neither a Scenario nor a Object Type Builder, and since we don't have a Field Name Builder for it), Kimera will use a Scalar Type Builder to generate a value for it.
