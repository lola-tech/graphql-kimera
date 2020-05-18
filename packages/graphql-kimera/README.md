# graphql-kimera 

[![mit](https://img.shields.io/badge/license-MIT-blue)](https://img.shields.io/badge/license-MIT-blue) ![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg) ![Node.js CI](https://github.com/lola-tech/graphql-kimera/workflows/Node.js%20CI/badge.svg) ![github pages](https://github.com/lola-tech/graphql-kimera/workflows/github%20pages/badge.svg)


GraphQL Kimera is an automocking library that allows you to be very precise about how mocks should be generated.

## Getting Started

To install Kimera you can install it via `npm` or `yarn`, it's totally up to you.

```
npm install --save-dev kimera
```

or if you want to use yarn

```
yarn add kimera --dev
```

### Example

```js
const {
  getExecutableSchema,
  useResolver,
} = require("@lola-tech/graphql-mirage")

// ...

const executableSchema = getExecutableSchema(
  typeDefs,
  () => ({
  scenario: {
    rockets: [{name: "Apollo", }, {}, {}, {}],
  },
  builders: {
    Rocket: () => ({
      type: "Shuttle",
    }),
  },
},
);

const apollo = new ApolloServer({
  schema: executableSchema,
  introspection: true,
  port: 4000,
});

apollo.listen().then(({ url }) => {
  console.log(chalk.green.bold(`🚀 Server ready at ${url}`));
});
```

Running the `rockets` query will return four rockets, all of `Shuttle` type, with the first being called `Apollo`.

## Documentation

You can find the Kimera documentation [on the website](https://lola-tech.github.io/graphql-mirage/).

The documentation is divided into several sections:

- [Fundamentals](https://lola-tech.github.io/graphql-mirage/docs/introduction)
- [Main Concepts](https://lola-tech.github.io/graphql-mirage/docs/data-sources)
- [Tutorial](https://lola-tech.github.io/graphql-mirage/docs/tutorial-getting-started)
- [API Reference](https://lola-tech.github.io/graphql-mirage/docs/api-build-mocks)

You can improve kimera docs by sending pull requests to [this repository](https://github.com/lola-tech/graphql-mirage/) for the kimera-docs package.

## Contributing

The main purpose of this repository is to continue to evolve Kimera. Development of Kimera happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving Kimera.

### Contributing Guide

Please read [CONTRIBUTING.md](https://github.com/lola-tech/graphql-mirage/CONTRIBUTING.md) for the process for submitting pull requests to us.

### Code of conduct

[lola.tech](https://www.lola.tech/) has adopted a Code of Conduct that we expect project participants to adhere to. Please read [CODE_OF_CONDUCT.md](https://github.com/lola-tech/graphql-mirage/CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

## Versioning

We use [lerna](https://lerna.js.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/lola-tech/graphql-mirage/tags).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Kimera library name has been inspired from greek mythology - [Chimera](<https://en.wikipedia.org/wiki/Chimera_(mythology)>)
