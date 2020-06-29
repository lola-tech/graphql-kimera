---
id: setup
title: Setup
sidebar_label: Setup
---

> _Install Kimera and a GraphQL server to get started._

:::note
This page walks you through the steps you need to take in order to get a Kimera server working. You can see an [example of a working Kimera server in the GitHub repository](https://github.com/lola-tech/graphql-kimera/tree/master/examples/server).
:::

### Installing Kimera

To install Kimera you can install it via npm or yarn, it's totally up to you. We're guessing that you'll most likely want Kimera to be a dev dependency.

```sh
npm install --save-dev @lola-tech/graphql-kimera graphql@14
```

or if you want to use yarn

```sh
yarn add --dev @lola-tech/graphql-kimera graphql@14
```

### Using Kimera

To use Kimera, you'll need a GraphQL server, and the schema definitions.

We'll use Apollo Server for the server, but any GraphQL server would work. See [how to install Apollo Server in the Apollo docs](https://www.apollographql.com/docs/apollo-server/getting-started/#step-2-install-dependencies).

```javascript title="server.js" {2,26,29}
const { ApolloServer, gql } = require('apollo-server');
const { getExecutableSchema } = require('@lola-tech/graphql-kimera');

const schema = gql`
  type User {
    id: ID!
    name: String
    gender: Gender
  }

  enum Gender {
    FEMALE
    MALE
    NON_BINARY
  }

  type Query {
    me: User
  }

  schema {
    query: Query
  }
`;

const executableSchema = getExecutableSchema({ typeDefs: schema });

const apollo = new ApolloServer({
  schema: executableSchema,
  introspection: true,
});

apollo.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

Running this code with `node` will start a server on `localhost:4000`. Visiting the URL will predictably take us to the GraphQL Playground.

Running the `me` query...

```graphql
query {
  me {
    id
    name
    gender
  }
}
```

...will return mocked data:

```json
{
  "data": {
    "me": {
      "id": "Mocked ID Scalar",
      "name": "Mocked String Scalar",
      "gender": "FEMALE"
    }
  }
}
```

[ Next ](/graphql-kimera/docs/mocking-queries-scenario), let's see how we can customize those mocks.
