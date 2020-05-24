---
id: glossary
title: Glossary
sidebar_label: Glossary
---

> _Definitions of terms you find in the documentation._

The terms addressed on this page are:

- [Builder](/graphql-kimera/docs/glossary#builder)
- [Context](/graphql-kimera/docs/glossary#context)
- [Executable Schema](/graphql-kimera/docs/glossary#executable-schema)
- [Mock providers](/graphql-kimera/docs/glossary#mock-providers)
- [Resolver](/graphql-kimera/docs/glossary#resolver)
- [SDL / Schema Definition Language](/graphql-kimera/docs/glossary#schema-definition-language-sdl)
- [Scenario](/graphql-kimera/docs/glossary#scenario)

## Scenario

Scenarios are objects that mirror the structure of the specific type they are mocking.

You can find the mental model for scenarios in the ["What is a Scenario" section of "Mocking queries"](/graphql-kimera/docs/mocking-queries-scenario#what-is-a-scenario).

## Builder

A builder is a function that's used to build mocks for a specific type.
You can have one builder per type. Whenever builder mocks collide with scenario mocks, the scenario mock wins.

Read more about how builders work in the [Mocking types section of the docs](/graphql-kimera/docs/mocking-types-builders#mocking-types-using-builders).

## Mock providers

"Mock providers" is just another way of saying "the scenario and all of the builders that were defined" or "collection builders and the scenario defined to customize the mocking in Kimera".

## Context

`Context` refers to a value meant to act as a global that gets passed to [resolvers](/graphql-kimera/docs/glossary#resolver).

Read more:

- Context in [Apollo Server](https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-arguments)

## Executable Schema

A schema that has a schema definition as well as resolver functions, is an executable schema.

Read more:

- [How an executable schema is created in Apollo](https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema).

## Resolver

Resolvers provide the instructions for turning a GraphQL operation (a query, mutation, or subscription) into data.

Read [more about resolvers in the Apollo docs](https://www.apollographql.com/docs/apollo-server/data/resolvers/).

## Schema Definition Language (SDL)

> To make it easy to understand the capabilities of a server, GraphQL implements a human-readable schema syntax known as its Schema Definition Language, or “SDL”. The SDL is used to express the types available within a schema and how those types relate to each other.
>
> -- Apollo Server Docs

Read more:

- [Schema basics - Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/essentials/schema.html#sdl)
- [What is GraphQL SDL - Prisma Blog](https://www.prisma.io/blog/graphql-sdl-schema-definition-language-6755bcb9ce51)
