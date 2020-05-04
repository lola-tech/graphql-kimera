---
id: introduction
title: Introducing GraphQL Mirage
sidebar_label: Introduction
---

GraphQL Mirage is a tool for auto-generating mocks from custom data sources.

Mirage has your back by helping you create an [executable schema](/graphql-mirage/docs/glossary#executable-schema) with mock data, while allowing you to be very precise about how data should be generated.

## The problems

Say we have decided on how the schema looks, but we want to start work on the frontend application before implementing the resolvers in the GraphQL server. Mirage allows us to auto-mock our whole API, and will provide us with levers that we can pull in order to customize responses where we feel necessary.

Another problem that we encounter has to do with testing. In React, we often run into the problem of wanting to test complex components which execute multiple GraphQL operations.

In Apollo, the [current practice](https://www.apollographql.com/docs/react/development-testing/testing/) requires us to mock the complete response of each query in the component tree.

That becomes cumbersome, especially since in the context of a specific test, we aren't interested in all of the fields having specific values. Another difficulty of this approach is that one needs to hunt for all queries executed by all subcomponents, which can be difficult to do for complex component hierarchies.

Mirage allows us to only set the query fields we care about to specific values, while auto-mocking the rest of the queries fields. This vastly reduces the code needed to be written in tests, naturally co-locates mocks with test assertions and keeps the code cleaner.

## The solution

GraphQL Mirage solves problems described above by:

- Walking the [schema SDL](/graphql-mirage/docs/glossary#schema-definition-language) directly and constructing the resolver tree as it does so.
- By default it generates data for any kind of field, which allows us to only focus on the fields we care about.
- It uses a [priority-based data sources mechanism](/graphql-mirage/docs/data-sources) to allow us to be precise about exactly what fields we want to customize.
