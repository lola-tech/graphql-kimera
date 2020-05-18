---
id: object-type-builders
title: Object Type Builders
sidebar_label: Object Type Builders
---

Allow us to define how [Object Type fields](https://graphql.org/learn/schema/#object-types-and-fields) need to be generated

## How they work

Lets assume part of our schema looks like this:

```
type Persona {
  id: ID!
  name: String
  heightInCM: Int
  heightInIN: Int
}
```

We could use the following `Persona` type builder to specify the data source for the `name` field:

```javascript
{
  Persona: () => ({
    name: casual.full_name,
  });
}
```

> **Note**
>
> The omitted fields (`heightInCM` and `heightInIN`) will be auto-generated using lower priority data sources.

### Fields with arguments

Looking at the example above, you've probably noticed that the value for the `name` field resolves to a static value. That's great

What if [we need the field to accept arguments](https://graphql.org/learn/queries/#arguments)? Mirage's got us covered by allowing us to return field resolvers from Object Type builders fields:

```graphql
type Citizen {
  id: ID!
  name: String
  friends(lastName: String): [Persona]
}
```

```javascript
{
  Citizen: () => ({
    name: casual.full_name,
    friends: getPersonas => (_, { lastName }) => {
      return getPersonas().filter(persona =>
        persona.name.includes(filters.lastName)
      );
    };
  }),
}
```

[The resolver](https://www.apollographql.com/docs/graphql-tools/resolvers.html#Resolver-map) needs to be returned by a a resolver factory function. A generic description of that function looks like this:

```
getFieldData =>
  function fieldResolver(obj, args, context, info) {
    // use getFieldData() and args to return the result
  };
```

- `getFieldData` returns the generated data for the field. For the example above, `getPersonas` returns the list of generated `Persona`s (look at the `friends` field type in the `Citizen` Object Type definition).
- `fieldResolver` is the function that gets executed to get the response to query for that field. In the example above, querying for a `Citizen`'s `friends` will execute this function with the `lastName` [query variable](https://graphql.org/learn/queries/#variables) passed as a prop in the `args` parameter of the resolver.
- the `fieldResolver` function needs to return a result compatible with the type of the field. In the example above, the result must be an an array of objects constructed from the type `Persona`.

The argument for the first function (the resolver factory) is the generated result of the field we're writing the resolver for. In our case, the argument for the resolver contains an array of persons (`[Persona]`).

> **Note**
>
> See it in action in the ["Mutations" section of the Tutorial](/graphql-kimera/docs/tutorial-mutations#modifying-fields-with-arguments).

### Fields with Object Types

> **Note**
>
> Object Type fields should generally be omitted, and managed in their own Object Type builders.

An exception to the rule above is when we want the field to depend on data generated in the current node. In that case, we have to option of describing with a field scenario.

```graphql
type Order {
  id: ID!
  courses: [Course]
}
```

```javascript
{
  Order: () => {
    const coursesCount = random(1, 2);
    return {
      courses: times(coursesCount, () => ({})),
    };
  };
}
```

> Note

When a field couldn't be found in neither the Scenario nor a Object Type Builder, Mirage looks for it in the next, lower priority data source: the Field Name Builders.
