---
id: glossary
title: Glossary
sidebar_label: Glossary
---

Definitions of terms you'll be encountering across the documentation

# Builder

Builders are functions that used to generate data for specific fields in Object Types. When Kimera walks the `Query` Object Type tree to generate data, it will use these functions to generate data for fields.

Read more about the various builders in the [Data Sources section](/graphql-kimera/docs/data-sources).

# Data Source

Refer to [scenarios](/graphql-kimera/docs/scenarios), [Object Type Builders](/graphql-kimera/docs/object-type-builders), [Field Name Builders](field-name-builders) or [Scalar Type Builders](/graphql-kimera/docs/scalar-type-builders), which are all used to determine how to generate data.

Read more about them in the [Data Sources section](/graphql-kimera/docs/data-sources).

# Scenario

Scenarios are objects that mirror the structure of the query response tree, and are used to specify values for specific fields.

Read more about them in the [Scenario section](/graphql-kimera/docs/scenarios).

# Context

Context refers to a value meant to act as a global that get passed to resolvers.

Read more:

- Context in [Apollo Server](https://www.apollographql.com/docs/apollo-server/essentials/data.html#context)

# Executable Schema

A schema that has a schema definition as well as resolver functions, is an executable schema.

Read more about [how an executable schema is created in Apollo](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema).

# Resolver

> Resolvers provide the instructions for turning a GraphQL operation (a query, mutation, or subscription) into data.
>
> -- [Apollo Docs](https://www.apollographql.com/docs/tutorial/resolvers.html#resolver-api)

Read more about resolvers in the [Apollo Docs](https://www.apollographql.com/docs/tutorial/resolvers.html#resolver-api)

# Schema Definition Language (SDL)

> To make it easy to understand the capabilities of a server, GraphQL implements a human-readable schema syntax known as its Schema Definition Language, or “SDL”. The SDL is used to express the types available within a schema and how those types relate to each other.
>
> -- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/essentials/schema.html#sdl)

# "Kimera"

Kimera's name is inspired from greek mythology: [Chimera (mythology)](<https://en.wikipedia.org/wiki/Chimera_(mythology)>).

Read more:

- [What is GraphQL SDL - Prisma Blog](https://www.prisma.io/blog/graphql-sdl-schema-definition-language-6755bcb9ce51)
- [Understanding schema concepts - Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/essentials/schema.html#sdl)
