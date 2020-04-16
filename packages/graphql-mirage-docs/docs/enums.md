---
id: enums
title: Enums
sidebar_label: 5. Enums
---

A Scenario has the highest priority you can provide to Mirage and it represents a frugal description of the `Query` type response tree. Assuming a part of our schema looks like this:

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

```js
{
  countries: [
    { name: 'China', isDemocratic: false },
    ...times(4, () => ({ isDemocratic: true }),
  ];
}
```

With the help of [lodash's times](https://lodash.com/docs/4.17.11#times) we tell Mirage that we want to generate 5 countries. The first country will be the `undemocratic` `China`, and the remaining `4` countries will be `democratic`.

Notice how we didn't need to specify all the fields of `Country` type in order to have a valid scenario. The rest of the fields will be generated using other sources. First, Mirage look for the fields in our next source, the builder for the Object Type `Country`.
