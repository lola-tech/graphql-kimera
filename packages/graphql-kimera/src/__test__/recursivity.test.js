const KIMERA_RECURSIVITY_DEPTH_LIMIT = 5;
process.env['KIMERA_RECURSIVITY_DEPTH_LIMIT'] = KIMERA_RECURSIVITY_DEPTH_LIMIT;

const fs = require('fs');
const path = require('path');
const { reduce, get } = require('lodash');
const schemaParser = require('easygraphql-parser');

const { mockType } = require('../engine');

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'recursive.schema.graphql'),
  'utf8'
);
const schema = schemaParser(typeDefs);

test('Limits recursive fields', () => {
  const actual = mockType('Query', schema);
  const { path } = reduce(
    Array(KIMERA_RECURSIVITY_DEPTH_LIMIT - 1),
    (pathInfo) => ({
      path: pathInfo.path + '.' + pathInfo.next,
      next: pathInfo.next === 'trip' ? 'pilot' : 'trip',
    }),
    { path: 'me', next: 'trip' }
  );
  expect(() => get(actual, path)()).toThrowError('Mocking depth exceeded');
});
