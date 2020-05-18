---
id: under-the-hood
title: Under the hood
sidebar_label: Under the hood
---

This section explains how Mirage works under the hood. This will help you understand the API better.

## 1. Converting the schema

For Mirage to work, we need to supply it with [Schema Definition Language (SDL) string](https://www.apollographql.com/docs/apollo-server/essentials/schema.html#sdl), which it converts to a custom data structure with the help of [easygraphql-parser](https://github.com/EasyGraphQL/easygraphql-parser). Taking the following SDL string as an example:

```
type Query {
  cars(fuel: Fuel): [MotorizedVehicle]
}

enum Fuel {
  PETROL
  DIESEL
  HYBRID
  ELECTRIC
}

interface MotorizedVehicle {
  id: ID!
  fuel: Fuel
}

type Car implements MotorizedVehicle {
  id: ID!
  fuel: Fuel
}
```

The [SDL](https://www.prisma.io/blog/graphql-sdl-schema-definition-language-6755bcb9ce51) string from above gets parsed into:

```javascript
{
  Query: {
    // Object|Union|Scalar|Enum|InterfaceTypeDefinition
    type: 'ObjectTypeDefinition',
    // Holds values for Enums
    values: [],
    // Holds types for Unions
    types: [],
    // Holds references links between types and interfaces
    implementedTypes: []
    fields: [
      {
        // Name of field
        name: 'cars',
        // Name of the type of the field
        type: 'MotorizedVehicle',
        isArray: true,
        noNull: false,
        // Describes arguments, similar format to `fields`
        arguments: [
          {
            name: 'fuel', type: 'Fuel', // ...
          },
        ],
      },
    ],
  },
  Fuel: {
    type: 'EnumTypeDefinition',
    values: ['PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC'],
    // Same prop structure as Query ...
  },
  MotorizedVehicle: {
    type: 'ObjectTypeDefinition',
    implementedTypes: ['Car']
    // ...
  },
  Car: {
    type: 'InterfaceTypeDefinition',
    implementedTypes: ['MotorizedVehicle']
    // ...
  },
};
```

## 2. Walking the `Query` type tree

In order to generate data, Mirage takes the `Query` node from the parsed schema, and [starts processing its fields array recursively](https://github.com/lola-tech/graphql-mirage/src/engine.js#L142-L194) looking for [scalars and enums](https://www.apollographql.com/docs/graphql-tools/scalars.html) for which it can [generate data](https://github.com/lola-tech/graphql-mirage/src/engine.js#L46-L91).

Generating data while walking the `Query` tree, allows us to get the correct resolver structure for free, and helps us focus on the important part when mocking: having the data we want for the fields we want.

## 3.1 Generating data - Defaults

Without any configuration, when deciding how generate data for a field, Mirage will:

- for enum fields, it will [select the first value from the schema definition of the enum](https://github.com/lola-tech/graphql-mirage/src/engine.js#L69-L73), or
- for the default `Int`, `Float`, `String`, `Boolean` and `ID` scalars, [it will supply random values](https://github.com/lola-tech/graphql-mirage/src/engine.js#L21-L29), or
- for abstract fields, [it will select the first concrete implementation](https://github.com/lola-tech/graphql-mirage/src/engine.js#L119-L131), or
- for fields of custom scalar types, [it will supply a random string](https://github.com/lola-tech/graphql-mirage/src/engine.js#L86-L90),

## 3.2 Generating data - Custom

In order to customize the data Mirage generates, you need to supply it with [data sources](/graphql-mirage/docs/data-sources). Mirage will prioritize the supplied data sources, and figue out what is the best data source for a specific field. If no data source could be found, it will default to the behavior described above.

- Read more how [data sources work](/graphql-mirage/docs/data-sources) to undersand how Mirage prioritizes them
- See [how you get started with Mirage](/graphql-mirage/docs/tutorial-getting-started) in order to see how the concepts above are applied
