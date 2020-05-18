---
id: introduction
title: Introducing GraphQL Mirage
sidebar_label: Introduction
---

GraphQL Mirage is a tool for auto-generating mocks from custom data sources.

Its name is inspired from a [testing solution for Ember.js](http://www.ember-cli-mirage.com/).

Mirage is a tool that allows us to create an [executable schema](/graphql-kimera/docs/glossary#executable-schema) with mock data, while allowing us to be very precise about how data should be generated.

## The problem

Our previous implementation of the mocking server had several issues:

- It required replicating the schema resolver tree, which made it cumbersome to update and difficult to follow the code.
- The data builders couldn't be changed from outside the server, and whatever control we had (shape of array fields), needed to built into the server with each new array field added to the schema.
- It required us to be exhaustive in the definitions of the builders for types, ie. we needed to add every (required) field in the builder, even if we didn't necessarily cared about its value.
- There was no way to set data in the mocks from outside of the actual builder functions which made it impossible to use in tests

## The solution

GraphQL Mirage solves each of the problems above by:

- Walking the [schema SDL](/graphql-kimera/docs/glossary#schema-definition-language) directly and constructing the resolver tree as it does so. This means there's no need for manually replicating the schema structure.
- By default it can generate data for any kind of field, which allows us to only focus on the fields we care about.
- Uses a [priority-based data sources mechanism](/graphql-kimera/docs/data-sources) to allow us to be precise about exactly what field we want to set a value for.
- The same mechanism can be overwritten from outside of the implementation of our mocks, by using the same api.
