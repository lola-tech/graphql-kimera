# Contributing to graphql-kimera

> Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

Kimera is one of [Lola Tech's](https://www.lola.tech) first open source project that is both under very active development and is also being used to ship code to our enterprise customers.

## Found an Issue?

Thank you for reporting any issues you find. We do our best to test and make graphql-kimera as solid as possible, but any reported issue is a real help.

> When raising an issue please use the template provided as a guideline, provided to you.

## Want a new feature?

> For raising a feature request please use the template provided as a guideline, provided to you.

## Branch Organization

Submit all changes directly to the `master` branch. We don’t use separate branches for development or for upcoming releases. We do our best to keep master in good shape, with all tests passing.

Code that lands in master must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of master at any time.

## Code structure

Currently the project is managed with lerna and it contains 2 packages:

- [graphql-kimera](https://github.com/lola-tech/graphql-kimera/tree/master/packages/graphql-kimera): containing the source code and tests for the module published on npm.
- [graphql-kimera-docs](https://github.com/lola-tech/graphql-kimera/tree/master/packages/graphql-kimera-docs): a [docusaurus](https://v2.docusaurus.io/) containing the docusaurus app for managing and changing the documentation.

> Most of the development work will happen on [graphql-kimera](https://github.com/lola-tech/graphql-kimera/tree/master/packages/graphql-kimera) package.

## Your first pull request

> **Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github).

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment.

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch `git checkout -b MY_BRANCH_NAME`
3. Install yarn: `npm install -g yarn` -- if don't have it already installed.
4. Install the dependencies: `yarn` and you should be good to go.
5. Navigate to the module folder from the project root `cd packages/graphql-kimera/`.

## Sending a Pull Request

We will review your pull request and either merge it, request changes to it, or close it with an explanation. We’ll do our best to provide updates and feedback throughout the process.

Before submitting a pull request, if you’ve fixed a bug or added code that should be tested, add tests! Ensure the test suite passes (`yarn test`).

> Tip: `yarn test --watch TestName` is helpful in development -- if ran from `packages/graphql-kimera`.
