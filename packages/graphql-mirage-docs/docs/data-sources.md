---
id: data-sources
title: Data Sources
sidebar_label: Data Sources
---

When constructing the `Query` resolver tree, Mirage accepts multiple data sources which are used to generate data for a specific field.

The data sources have different priorities: a field found in a **higher priority** data source will never be overwritten by a conflicting field found in a **lower priority** source.

1. [Scenario](/docs/scenarios) (Hightest Priority): An object that frugally mirrors the `Query` response structure. This is used to target fields from query responses and set them to specific values or, when the field type is an `array`, it allows us to also set the `length` of the response `array`.
1. [Object Type Builders](/docs/object-type-builders): A function that returns an object with values that need to be used when generating data **for a [GraphQL Object Type](https://graphql.org/learn/schema/#object-types-and-fields) field**. Think of having a `Persona` type, and wanting the `name` field of it to be always generated using `casual.full_name`.
1. [Field Name Builders](/docs/field-name-builders): A value that needs to be used when generating data **for a field with a specific name**, no matter what type it will be found in. Think of wanting the field `city` to be generated using `casual.city` wether it is part of an `Address` type.
1. [Scalar Type Builders](/docs/scalar-type-builders) (Lowest priority): A value that needs to be used when generating data **for a Scalar Type Field**, be it built into GraphQL (`ID`, `String`, `Int`, `Float`, `Boolean`), or customly defined in our schema.
