---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
---

> _This page explains what Kimera is, and the problems it's designed to solve._

**Kimera** is a JavaScript library for mocking GraphQL APIs. Learn how to use Kimera in the ["Using Kimera"](/graphql-kimera/docs/setup) section of the docs. See it's API in the ["API"](/graphql-kimera/docs/api-get-executable-schema) section of the docs.

## What does Kimera do

Kimera creates a [GraphQL executable schema](/graphql-kimera/docs/glossary#executable-schema) with mocked data, and it allows you to be very precise about how data should be mocked.

For example, take this schema:

```graphql title="typeDefs.graphql"
type Query {
  rockets: [Rocket]
}

type Rocket {
  name
  type
}
```

Let's say we want to customize the `rockets` query so that:

- it returns `5` rockets
- the first and the last rockets be of type `Shuttle`

To do that you can write a scenario:

```js
{
  rockets: [
    { type: "Shuttle" },
    {}, {}, {},
    { type: "Shuttle" }
  ],
}
```

For more about all the ways you can customize mocks, see the ["Using Kimera"](/graphql-kimera/docs/setup) section of the docs.

## Why Kimera?

### Speed up the prototyping process

Kimera allows you to get a mocked server up and running by just providing the schema definition. You can then customize the mocks using [mock providers](/graphql-kimera/docs/glossary#mock-providers).

### Allow large teams to better coordinate

In larger teams, frontend developers can negotiate schema changes with the backend developers and then quickly add mocks for the changes in a Kimera version of the server while the backend team gets to implementing the changes.

### Improve testing in frontend applications that use GraphQL

Using Kimera allows you to customize query responses by defining a single scenario as opposed to exhaustively mocking each query response, which is extremely useful for large component trees where queries are used at different levels of the component hierarchy.
