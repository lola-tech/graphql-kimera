import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styled from '@emotion/styled';
import Feature from './index/Feature';
import Hero from './index/Hero';

const features = [
  {
    title: <>Start a mock GraphQL server with zero configuration</>,
    description: (
      <p>
        All you need to get a mock server up and running is your schema, Kimera
        and a GraphQL Server.
      </p>
    ),
    code: `const { ApolloServer, gql } = require("apollo-server");
const { getExecutableSchema } = require("@lola-tech/graphql-kimera");

const schema = gql\`
  type Query {
    ...
\`;

const executableSchema = getExecutableSchema({ typeDefs: schema });

const apollo = new ApolloServer({
  schema: executableSchema,
});

apollo.listen().then(({ url }) => {
  console.log(\`🚀 Server ready at \${url}\`);
});
    `,
  },
  {
    title: <>Customize mocks with scenarios and builders</>,
    description: (
      <>
        <p>
          Kimera allows you to mock the response to any number of queries with a
          single <code>scenario</code> object.
        </p>
        <p>
          Mock GraphQL types with <code>builders</code>.
        </p>
      </>
    ),
    code: `const executableSchema = getExecutableSchema({
  typeDefs,
  mockProvidersFn: (context) => ({
    scenario: {
      // Mock the \`rockets\` query to
      // return three rockets, the first named "Saturn V":
      rockets: [{ name: "Saturn V" }, {}, {}],
      me: { name: "Homer" }
    },
    builders: {
      // "Rocket" fields that aren't addressed in the scenario
      // are mocked using the "Rocket" builder:
      Rocket: () => ({
        type: ["Orion", "Apollo"][_.random(0, 1)],
        name: "Rocket name",
      }),
    },
  }),
});`,
  },
  {
    title: <>Write resolvers only when you need to</>,
    description: (
      <>
        <p>You can write resolvers, but you don&apos;t need to.</p>
        <p>
          When you do, you&apos;ll get easy access to the mocks through the{' '}
          <code>store</code>.
        </p>
      </>
    ),
    code: ` const executableSchema = getExecutableSchema({
  typeDefs: schema,
  mockProvidersFn: (context) => ({
    scenario: {
      rockets: mockResolver(
        (store) => (_, { type }) => {
          const rockets = store.get();
          return rockets.filter((r) => r.type === type);
        },
        // You'll even be able to specify how the mocks are built.
        [{ type: "Shuttle" }, {}, { type: "Shuttle" }]
      ),
    },
  }),
});`,
  },
];

const Hr = styled.hr`
  width: 100%;
  border-color: var(--ifm-color-gray-200);
`;

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`GraphQL ${siteConfig.title}`}
      description="Kimera is a library for mocking GraphQL servers with precision."
    >
      <Hero />
      <main className="home--container container">
        {features && features.length && (
          <section>
            {features.map((props, idx) => (
              <>
                <Feature key={idx} {...props} />
                {idx !== features.length - 1 ? <Hr /> : null}
              </>
            ))}
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
