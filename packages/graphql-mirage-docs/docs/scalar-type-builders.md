---
id: scalar-type-builders
title: Scalar Type Builders
sidebar_label: Scalar Type Builders
---

How generate data for the Built-in or our Custom Scalar Types

## Built-in Scalar Types

GraphQL ships with five built-in scalar types: `ID`, `String`, `Int`, `Float`, and `Boolean`.

Builders for these are considered to be the lowest priority data sources. When Mirage can't find instructions for a field in neither a Scenario, an Object Type Builder, nor a Field Name Builder, it uses the field type to decide how to generate data for it.

If we don't specify our own collection of Built-in Scalar Types Builders, Mirage will use its defaults:

```javascript
const builtInScalarTypesBuilders = {
  ['ID']: () => 'Mocked ID Scalar',
  ['String']: () => 'Mocked String Scalar',
  ['Int']: () => 42,
  ['Float']: () => 4.2,
  ['Boolean']: () => true,
}
```

## Custom Scalar Types

Builders for our Custom Scalar Types follow the same format as the ones for the Built-In Scalar Types.

```graphql
scalar Currency
scalar DateTime
```

```javascript
{
  ['Currency']: () => casual.currency,
  ['DateTime']: () => casual.date
}
```
