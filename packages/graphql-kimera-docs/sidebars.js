module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'getting-started',
    },
    {
      type: 'category',
      label: 'Using Kimera',
      items: [
        'setup',
        'mocking-queries-scenario',
        'mocking-types-builders',
        'query-resolvers',
        'mocking-mutations',
        'abstract-types',
        // "data-sources",
        // "scenarios",
        // "object-type-builders",
        // "field-name-builders",
        // "scalar-type-builders",
        // "enums",
        // "interfaces",
        // "mutations",
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [],
    },
    {
      type: 'doc',
      id: 'glossary',
    },
    {
      type: 'category',
      label: 'API',
      items: [
        // "api-build-mocks",
        // "api-cache",
        'api-get-executable-schema',
        'api-mock-resolver',
        // "api-merge-scenarios",
      ],
    },
  ],
};
