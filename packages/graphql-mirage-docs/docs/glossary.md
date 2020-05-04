---
id: glossary
title: Glossary
sidebar_label: Glossary
---

Definitions of terms you'll be encountering across the documentation.

## Builder

Builders are functions that used to generate data for specific fields in Object Types. When Mirage walks the `Query` Object Type tree to generate data, it will use these functions to generate data for fields.

Read more about the various builders in the [Data Sources section](/graphql-mirage/docs/data-sources).

## Data Source

Refer to [scenarios](/graphql-mirage/docs/scenarios), [Object Type Builders](/graphql-mirage/docs/object-type-builders), [Field Name Builders](field-name-builders) or [Scalar Type Builders](/graphql-mirage/docs/scalar-type-builders), which are all used to determine how to generate data.

Read more about them in the [Data Sources section](/graphql-mirage/docs/data-sources).

## Scenario

Scenarios are objects that mirror the structure of the query response tree, and are used to specify values for specific fields.

Read more about them in the [Scenario section](/graphql-mirage/docs/scenarios).

## Context

Context refers to a value meant to act as a global that get passed to resolvers.

Read more:

- Context in [Apollo Server](https://www.apollographql.com/docs/apollo-server/essentials/data.html#context)

## Executable Schema

The executable schema refers to the schema definitions bound to the resolvers that fetch the data.

Read more about [how an executable schema is created in Apollo](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema).

## Resolver

> Resolvers provide the instructions for turning a GraphQL operation (a query, mutation, or subscription) into data.
>
> -- [Apollo Docs](https://www.apollographql.com/docs/tutorial/resolvers.html#resolver-api)

Read more about resolvers in the [Apollo Docs](https://www.apollographql.com/docs/tutorial/resolvers.html#resolver-api)

## Schema Definition Language (SDL)

> To make it easy to understand the capabilities of a server, GraphQL implements a human-readable schema syntax known as its Schema Definition Language, or “SDL”. The SDL is used to express the types available within a schema and how those types relate to each other.
>
> -- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/essentials/schema.html#sdl)

:::note Read more
* [What is GraphQL SDL - Prisma Blog](https://www.prisma.io/blog/graphql-sdl-schema-definition-language-6755bcb9ce51)
* [Understanding schema concepts - Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/essentials/schema.html#sdl)
:::
