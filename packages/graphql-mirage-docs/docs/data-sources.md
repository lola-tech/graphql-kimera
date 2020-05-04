---
id: data-sources
title: Data Sources
sidebar_label: Data Sources
---

As explained in the ["Under The Hood" section](/graphql-mirage/docs/under-the-hood), to automock data for the whole schema, Mirage walks the `Query` type fields, mocks data for each query, and constructs the resolver structure needed for the server to work.

In order to be able to do this without any configuration, it recursively looks for fields of [built-in scalar types](https://graphql.org/graphql-js/basic-types/) like `ID`, `String`, `Int`, `Float` or `Boolean`. Once it reaches a field with a built-in scalar type it mocks data for it using a collection of functions for each type. We call this collection the **Builders**. The ones that Mirage uses by default are:

```javascript
const builtIn = {
  ["ID"]: () => "Mocked ID Scalar",
  ["String"]: () => "Mocked String Scalar",
  ["Int"]: () => 42,
  ["Float"]: () => 4.2,
  ["Boolean"]: () => true,
};
```

We can of course overwrite these **Scalar Type Builders** with our own. Besides these, we can supply other collections of functions

If you want to customize the way Mirage mocks data, you
accepts multiple data sources which are used to generate data for a specific field.

The data sources have different priorities: a field found in a **higher priority** data source will never be overwritten by a conflicting field found in a **lower priority** source.

1. [Scalar Type Builders](/graphql-mirage/docs/scalar-type-builders) (Lowest priority): A value that needs to be used when generating data **for a Scalar Type Field**, be it built into GraphQL (`ID`, `String`, `Int`, `Float`, `Boolean`), or customly defined in our schema.
1. [Field Name Builders](/graphql-mirage/docs/field-name-builders): A value that needs to be used when generating data **for a field with a specific name**, no matter what type it will be found in. Think of wanting the field `city` to be generated using `casual.city` wether it is part of an `Address` type.
1. [Object Type Builders](/graphql-mirage/docs/object-type-builders): A function that returns an object with values that need to be used when generating data **for a [GraphQL Object Type](https://graphql.org/learn/schema/#object-types-and-fields) field**. Think of having a `Persona` type, and wanting the `name` field of it to be always generated using `casual.full_name`.
1. [Scenario](/graphql-mirage/docs/scenarios) (Hightest Priority): An object that frugally mirrors the `Query` response structure. This is used to target fields from query responses and set them to specific values or, when the field type is an `array`, it allows us to also set the `length` of the response `array`.
