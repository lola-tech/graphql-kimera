---
id: todo
title: Plans for the future
sidebar_label: TODO
---

A list of known issues, and ideas for future development

## Union Types

We currently don't support Union Types. As soon as we add them to the schema, support will be added.

## Relationships

GraphQL supports relationships, but due to the recursive nature of the Mirage, we currently don't support schemas with relationships. An intermediary model that holds the relationship may be a solution if you want to use Mirage.

## Performance

Tree traversal is fast, as it happens in Linear Time. The only concern we have is repeated generation of data in tests. Each execution will rebuild the data tree from scratch. Some memoization is applied.

Using Mirage in tests would require regeneration of Query tree for each test, which might prove itself slower than we wanted.

Some ideas:

- Profile, and optimize more aggressively
  - What causes the largest slowdown? Creating the data nodes? More memoization might be key here.
- Use one Mirage instance / test file / test suit:
  - Implement an `updateWithScenario` mutation that updates the cache for the test setup.
  - Execute the mutation in the setup phase of the test. Not yet sure if and how this would be done.

Any other ideas? Please open a [github issue](https://github.com/lola-tech/graphql-kimera/issues).
