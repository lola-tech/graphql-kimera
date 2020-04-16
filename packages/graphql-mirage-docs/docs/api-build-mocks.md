---
id: api-build-mocks
title: buildMocks
sidebar_label: ↳getMutationResolvers/buildMocks
---

A function that allows us to generate data for a specific Object Type

```javascript
buildMocks(type, scenario);
```

Useful when we need to create a new node in a mutation. Accepts two arguments:

## `type` (Required)

_String_ The type of the node we want to generate data for.

## `scenario` (Optional)

A specific scenario relevant to the current generation of the node. Read more about what they are in the [Scenario section](/docs/scenario).
