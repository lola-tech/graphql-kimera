const fs = require('fs');
const path = require('path');
const { times } = require('lodash');
const schemaParser = require('easygraphql-parser');

const { mockType } = require('../engine');
const { DEFAULT_LIST_LENGTH } = require('../constants');
const { mockResolver } = require('../mockProviders');

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'testing.schema.graphql'),
  'utf8'
);
const schema = schemaParser(typeDefs);
const mockQuery = ({ scenario, builders } = {}) => {
  return mockType('Query', schema, {
    scenario,
    builders,
  });
};

test('Can mock non Object Types directly', () => {
  const actual = mockType('Markdown', schema, {
    scenario: 'Test',
    builders: {
      Markdown: () => 'Test',
    },
  });

  expect(actual).toBe('Test');
});

describe('Scenarios', () => {
  it('SCENARIO: sets built-in scalar', () => {
    const EMAIL = 'me@example.com';
    const actual = mockQuery({
      scenario: {
        me: {
          email: EMAIL,
          profileImage: null,
        },
      },
    });
    expect(actual.me.email).toEqual(EMAIL);
    expect(actual.me.profileImage).toBe(null);
  });

  it('SCENARIO: sets array of built-in scalars', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          allergies: ['Aspirin', 'Peanuts'],
        },
      },
    });
    expect(actual.me.allergies).toHaveLength(2);
    expect(actual.me.allergies[0]).toBe('Aspirin');
    expect(actual.me.allergies[1]).toBe('Peanuts');
  });

  it('SCENARIO: sets deep Array of Object Types', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [
            { site: 'Kennedy Space Center' },
            ...times(3, () => ({})),
            { site: 'Vandenberg Air Force Base' },
          ],
        },
      },
    });
    expect(actual.me.trips).toHaveLength(5);
    expect(actual.me.trips[0].site).toEqual('Kennedy Space Center');
    expect(actual.me.trips[4].site).toEqual('Vandenberg Air Force Base');
  });

  it('SCENARIO: sets deep Array of Object Types recursively', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [{ rockets: [{ name: 'Falcon 9' }, {}] }, {}],
        },
      },
    });
    expect(actual.me.trips[0].rockets).toHaveLength(2);
    expect(actual.me.trips[0].rockets[0].name).toEqual('Falcon 9');
    expect(actual.me.trips[1].rockets).toHaveLength(DEFAULT_LIST_LENGTH);
  });
});

describe('Builders', () => {
  it('BUILDER: can set built-in scalar field value from a Builder', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [
            { site: 'Kennedy Space Center' },
            { mission: { name: 'Alpha' } },
          ],
        },
      },
      builders: { Mission: () => ({ name: 'Beta' }) },
    });

    expect(actual.me.trips[0].mission.name).toEqual('Beta');
  });

  it('BUILDER: can set null values for *any* field from a Builder', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [{ site: 'Kennedy Space Center' }, {}],
        },
      },
      builders: {
        User: () => ({ profileImage: null }),
        Launch: () => ({ rockets: null }),
      },
    });

    expect(actual.me.profileImage).toBe(null);
    expect(actual.me.trips[0].rockets).toBe(null);
  });

  it('BUILDER: Can define Scenarios for fields in Builders', () => {
    const actual = mockQuery({
      builders: {
        User: () => ({
          trips: times(5, () => ({
            rockets: [{ name: 'Falcon Heavy' }, { type: 'Small' }],
          })),
        }),
      },
    });

    expect(actual.me.trips).toHaveLength(5);
    expect(actual.me.trips[0].rockets).toHaveLength(2);
    expect(actual.me.trips[0].rockets[0].name).toBe('Falcon Heavy');
    expect(actual.me.trips[0].rockets[1].type).toBe('Small');
  });

  it('BUILDER: can set a Builder for Built-in Scalar Types', () => {
    const actual = mockQuery({
      builders: {
        ID: () => 'GENERATED_ID',
      },
    });

    expect(actual.me.id).toBe('GENERATED_ID');
    expect(actual.me.trips[0].id).toBe('GENERATED_ID');
  });

  it('BUILDER: Builder does not overwrite Scenario', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          profileImage: null,
          email: 'jim@example.com',
          trips: [{ site: 'Vandenberg Air Force Base' }, {}],
        },
      },
      builders: {
        User: () => ({
          profileImage: 'http://example.com/profile.png',
          email: 'test@example.com',
        }),
        Launch: () => ({ site: 'Kennedy Space Center', rockets: null }),
      },
    });

    // Does not overwrite null
    expect(actual.me.profileImage).toBe(null);
    // Does not overwrite with null
    expect(actual.me.email).toBe('jim@example.com');
    // Does not overwrite with null deep
    expect(actual.me.trips[0].site).toEqual('Vandenberg Air Force Base');
    // Redunant. Checking if merging works for fields that are not in scenario
    expect(actual.me.trips[0].rockets).toEqual(null);
  });
});

describe('Abstract fields', () => {
  it('INTERFACE: automatically selects the first concrete type when __typename is missing', () => {
    const actual = mockQuery();
    const concreteTypes = ['Planet', 'Star'];

    expect(actual.me.trips[0].destination.__typename).toBe(concreteTypes[0]);
  });

  it('INTERFACE: can set custom concrete type from scenario using __typename', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [
            {
              destination: { __typename: 'Star' },
            },
          ],
        },
      },
    });

    expect(actual.me.trips[0].destination.__typename).toBe('Star');
  });

  it('UNION: automatically selects the first concrete type when __typename is missing', () => {
    const actual = mockQuery({
      scenario: {
        me: { hobbies: [{}] },
      },
    });
    const concreteTypes = ['ReadingHobby', 'KarateHobby'];

    actual.me.hobbies.map((hobby) =>
      expect(hobby.__typename).toBe(concreteTypes[0])
    );
  });

  it('UNION: uses Concrete Type instead of Interface Type when __typename is specified', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          hobbies: [
            { __typename: 'ReadingHobby' },
            { __typename: 'KarateHobby' },
          ],
        },
      },
    });

    expect(actual.me.hobbies[0].__typename).toBe('ReadingHobby');
    expect(actual.me.hobbies[1].__typename).toBe('KarateHobby');
  });

  it('Concrete types builders are actually used', () => {
    const actual = mockQuery({
      scenario: {
        me: {
          hobbies: [{ __typename: 'KarateHobby' }],
        },
      },
      builders: {
        KarateHobby: () => ({
          belt: 'Brown',
        }),
      },
    });

    expect(actual.me.hobbies[0].belt).toBe('Brown');
  });
});

describe('Enums', () => {
  it('ENUM: selects the first value of the enum', () => {
    const actual = mockQuery();
    const enumValues = ['FEMALE', 'MALE', 'NON_BINARY'];

    expect(actual.me.gender).toBe(enumValues[0]);
  });
});

describe('Scalars', () => {
  it('SCALAR: uses Type builder to generate scalar value', () => {
    const DATE = '1989-12-16';
    const actual = mockQuery({
      builders: {
        Date: () => DATE,
      },
    });

    expect(actual.me.dateOfBirth).toBe(DATE);
  });
});

describe('Custom Resolvers', () => {
  it('Can set a resolver in a Scenario', () => {
    const makeListScenario = (listLength) =>
      times(listLength, (i) => ({
        site: i % 2 ? 'Odd Space Center' : 'Even Space Center',
      }));

    const actual = mockQuery({
      scenario: {
        launches: {
          list: mockResolver(
            (launchesStore) => (_, { siteFilter }) => {
              return launchesStore.get().filter((launch) => {
                return launch.site.includes(siteFilter);
              });
            },
            makeListScenario(5)
          ),
        },
      },
      builders: {
        LaunchConnection: () => ({
          list: makeListScenario(1),
        }),
      },
    });

    expect(typeof actual.launches.list).toBe('function');
    expect(actual.launches.list(null, { siteFilter: 'Odd' })).toHaveLength(2);
    // Checks if the mocked value can be updated with a setter (Useful for mutations).
    actual.launches.list.__mocks.update(times(5, () => ({ site: 'Odd' })));
    expect(actual.launches.list(null, { siteFilter: 'Odd' })).toHaveLength(5);
  });

  it('Mock function passed to resolver works', () => {
    const actual = mockQuery({
      scenario: {
        launches: {
          list: mockResolver((_, mockType) => () => {
            return [mockType('Launch', { site: 'Mocked Site' })];
          }),
        },
      },
    });

    expect(actual.launches.list()).toHaveLength(1);
    expect(actual.launches.list()[0].site).toBe('Mocked Site');
  });

  it('Can set a resolver in a Builder', () => {
    const mockedResolver = () => jest.fn();

    const actual = mockQuery({
      builders: {
        LaunchConnection: () => ({
          list: mockResolver(() => mockedResolver),
        }),
      },
    });

    expect(actual.launches.list).toBe(mockedResolver);
  });
});

describe('Validation', () => {
  it('Throws when when mocking inexisting types.', () => {
    expect(() => mockType('InexistentType', schema)).toThrowError();
  });

  it("Should throw when the root scenario isn't an object", () => {
    expect(() =>
      mockType('Query', schema, {
        scenario: () => {},
      })
    ).toThrowError();
  });

  it("Throws when when a Builder isn't a function.", () => {
    expect(() =>
      mockQuery({
        builders: {
          User: { email: null },
        },
      })
    ).toThrow(TypeError);
  });

  it('Throws when attempting to mock a non-nullable field as null in a Scenario.', () => {
    expect(() =>
      mockQuery({
        scenario: {
          me: { email: null },
        },
      })
    ).toThrow(TypeError);
  });

  it('Throws when attempting to mock with a non-list field in with an array Scenario.', () => {
    expect(() =>
      mockQuery({
        scenario: {
          metadata: [],
        },
      })
    ).toThrowError();
  });

  it('Throws when attempting to mock a list with a primitive in Scenario.', () => {
    expect(() =>
      mockQuery({
        scenario: {
          me: { allergies: 'test' },
        },
      })
    ).toThrowError();
  });

  it('Throws when attempting to mock a non-nullable field as null in a Builder.', () => {
    expect(() =>
      mockQuery({
        builders: {
          User: () => ({ email: null }),
        },
      })
    ).toThrowError();
  });

  it('Throws when when a function is used in a Scenario.', () => {
    expect(() =>
      mockQuery({
        scenario: {
          launches: {
            list: jest.fn(),
          },
        },
      })
    ).toThrow(TypeError);
  });

  it('Throws when when the root Scenario is a ResolverScenario.', () => {
    expect(() =>
      mockQuery({
        scenario: mockResolver(() => {}),
      })
    ).toThrow(TypeError);
  });

  it('Throws when when the root Scenario is a function.', () => {
    expect(() =>
      mockQuery({
        scenario: jest.fn(),
      })
    ).toThrow(TypeError);
  });

  it('Throws when when a function is used to mock a field in a Builder.', () => {
    expect(() =>
      mockQuery({
        builders: {
          LaunchConnection: () => ({
            list: [
              {
                site: jest.fn(),
              },
            ],
          }),
        },
      })
    ).toThrowError();
  });

  it('Should throw a TypeError error when a mockResolver callback is a simple function in a Builder scenario.', () => {
    expect(() =>
      mockQuery({
        builders: {
          LaunchConnection: () => ({
            list: [
              {
                site: mockResolver(jest.fn()),
              },
            ],
          }),
        },
      })
    ).toThrow(TypeError);
  });

  it('Should throw a TypeError when setting a Builder function returns a function', () => {
    expect(() =>
      mockQuery({
        builders: {
          Markdown: () => () => {},
        },
      })
    ).toThrow(TypeError);
  });

  it('Should throw a TypeError when setting a Builder function returns a ResolverScenario', () => {
    const mockedResolver = () => jest.fn();

    expect(() =>
      mockQuery({
        builders: {
          Markdown: () => mockResolver(() => mockedResolver),
        },
      })
    ).toThrow(TypeError);
  });
});
