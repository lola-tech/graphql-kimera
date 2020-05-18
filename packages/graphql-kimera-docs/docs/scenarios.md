---
id: scenarios
title: Scenario
sidebar_label: Scenario
---

Allows setting the shape and value of any field from the `Query` response tree.

A Scenario is the highest priority data source you can provide to Mirage and it represents a frugal description of the `Query` type response tree.

> **Note**
>
> Scenarios are meant to help to set static values for specific fields. Anything that's dynamic should be set from a [builder](/graphql-kimera/docs/glossary#builder).

```graphql
type Query {
  countries: [Country]
}

type Country {
  id: ID!
  name: String
  population: Int
  isDemocratic: Boolean
}
```

... by using the following scenario:

```javascript
{
  countries: [
    { name: 'China', isDemocratic: false },
    ...times(4, () => ({ isDemocratic: true }),
  ];
}
```

With the help of [lodash's times](https://lodash.com/docs/4.17.11#times) we tell Mirage that we want to generate five countries. The first country will be the undemocratic `China`, and the remaining `4` countries will be democratic.

Notice how we didn't need to specify all the fields of the `Country` type in order to have a valid scenario. The rest of the fields will be generated using other data sources. The first on the list is the Object Type Builder for the type `Country`.

> **Note**
>
> Scenarios can also be used to describe fields in Object Type Builders
