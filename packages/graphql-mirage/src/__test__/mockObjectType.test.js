const fs = require("fs");
const path = require("path");
const { times } = require("lodash");
const schemaParser = require("easygraphql-parser");

const { mockObjectType } = require("../engine");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "example.schema.graphql"),
  "utf8"
);

const DEFAULT_ARRAY_LENGTH = 3;

const schema = schemaParser(typeDefs);
const mockQuery = ({ scenario, builders } = {}) => {
  return mockObjectType("Query", schema, {
    scenario,
    builders,
  });
};

describe("Validation", () => {
  it("Should throw an error when the type builder isn't a function", () => {
    expect(() =>
      mockQuery({
        builders: {
          User: { email: null },
        },
      })
    ).toThrow(TypeError);
  });

  it("SCENARIO: Should throw an error when we attempt to set a non-nullable field as null.", () => {
    expect(() =>
      mockQuery({
        scenario: {
          me: { email: null },
        },
      })
    ).toThrowError();
  });

  it("SCENARIO: Should throw an error when we attempt to set a list with a primitive.", () => {
    expect(() =>
      mockQuery({
        scenario: {
          me: { allergies: "test" },
        },
      })
    ).toThrowError();
  });

  it("TYPE: Should throw an error when we attempt to set a non-nullable field as null.", () => {
    expect(() =>
      mockQuery({
        builders: {
          User: () => ({ email: null }),
        },
      })
    ).toThrowError();
  });
});

describe("Scenario", () => {
  it("SCENARIO: sets built-in scalar", () => {
    const EMAIL = "me@example.com";

    const actual = mockQuery({
      scenario: {
        me: { email: EMAIL, profileImage: null },
      },
    });

    expect(actual.me.email).toEqual(EMAIL);
    expect(actual.me.profileImage).toBe(null);
  });

  it("SCENARIO: sets array of built-in scalars", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          allergies: ["Aspirin", "Peanuts"],
        },
      },
    });

    expect(actual.me.allergies).toHaveLength(2);
    expect(actual.me.allergies[0]).toBe("Aspirin");
    expect(actual.me.allergies[1]).toBe("Peanuts");
  });

  it("SCENARIO: sets deep Array of Object Types", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [
            { site: "Kennedy Space Center" },
            ...times(3, () => ({})),
            { site: "Vandenberg Air Force Base" },
          ],
        },
      },
    });

    expect(actual.me.trips).toHaveLength(5);
    expect(actual.me.trips[0].site).toEqual("Kennedy Space Center");
    expect(actual.me.trips[4].site).toEqual("Vandenberg Air Force Base");
  });

  it("SCENARIO: sets deep Array of Object Types recursively", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [{ rockets: [{ name: "Falcon 9" }, {}] }, {}],
        },
      },
    });

    expect(actual.me.trips[0].rockets).toHaveLength(2);
    expect(actual.me.trips[0].rockets[0].name).toEqual("Falcon 9");
    expect(actual.me.trips[1].rockets).toHaveLength(DEFAULT_ARRAY_LENGTH);
  });
});

describe("Type Builders", () => {
  it("TYPE: can set built-in scalar field value from Object Type Builder", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [
            { site: "Kennedy Space Center" },
            { mission: { name: "Alpha" } },
          ],
        },
      },
      builders: { Mission: () => ({ name: "Beta" }) },
    });

    expect(actual.me.trips[0].mission.name).toEqual("Beta");
  });

  it("TYPE: can set null values for *any* field from Object Type Builder", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [{ site: "Kennedy Space Center" }, {}],
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

  it("TYPE: Object Type builders can set the shape of Array Object Type fields", () => {
    const actual = mockQuery({
      builders: {
        User: () => ({
          trips: times(5, () => ({
            rockets: [{ name: "Falcon Heavy" }, { type: "Small" }],
          })),
        }),
      },
    });

    expect(actual.me.trips).toHaveLength(5);
    expect(actual.me.trips[0].rockets).toHaveLength(2);
    expect(actual.me.trips[0].rockets[0].name).toBe("Falcon Heavy");
    expect(actual.me.trips[0].rockets[1].type).toBe("Small");
  });

  it("TYPE: can set Type Builder for Built-in Scalar Types", () => {
    const actual = mockQuery({
      builders: {
        ID: () => "GENERATED_ID",
      },
    });

    expect(actual.me.id).toBe("GENERATED_ID");
    expect(actual.me.trips[0].id).toBe("GENERATED_ID");
  });

  it("TYPE: Object Type builder does not ovewrite Scenario", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          profileImage: null,
          email: "jim@example.com",
          trips: [{ site: "Vandenberg Air Force Base" }, {}],
        },
      },
      builders: {
        User: () => ({
          profileImage: "http://example.com/profile.png",
          email: "test@example.com",
        }),
        Launch: () => ({ site: "Kennedy Space Center", rockets: null }),
      },
    });

    // Does not overwrite null
    expect(actual.me.profileImage).toBe(null);
    // Does not overwrite with null
    expect(actual.me.email).toBe("jim@example.com");
    // Does not overwrite with null deep
    expect(actual.me.trips[0].site).toEqual("Vandenberg Air Force Base");
    // Redunant. Checking if merging works for fields that are not in scenario
    expect(actual.me.trips[0].rockets).toEqual(null);
  });

  it("TYPE: Object Type has arguments", () => {
    const actual = mockQuery({
      scenario: {
        launches: {
          list: times(5, (i) => ({
            site: i % 2 ? "Odd Space Center" : "Even Space Center",
          })),
        },
      },
      builders: {
        LaunchConnection: () => ({
          list: (getLaunches) => {
            return (_, { siteFilter }) => {
              return getLaunches().filter((launch) => {
                return launch.site.includes(siteFilter);
              });
            };
          },
        }),
      },
    });

    expect(typeof actual.launches.list).toBe("function");
    expect(actual.launches.list(null, { siteFilter: "Odd" })).toHaveLength(2);
    expect(actual.launches.list(null, { siteFilter: "Even" })).toHaveLength(3);
    // Checks if the closed value can be updated with a setter
    // Useful for mutations
    actual.launches.list = times(5, () => ({ site: "Odd" }));
    expect(actual.launches.list(null, { siteFilter: "Odd" })).toHaveLength(5);
  });
});

describe("Enums", () => {
  it("ENUM: selects the first value of the enum", () => {
    const actual = mockQuery();
    const enumValues = ["FEMALE", "MALE", "NON_BINARY"];

    expect(actual.me.gender).toBe(enumValues[0]);
  });
});

describe("Scalars", () => {
  it("SCALAR: uses Type builder to generate scalar value", () => {
    const DATE = "1989-12-16";
    const actual = mockQuery({
      builders: {
        Date: () => DATE,
      },
    });

    expect(actual.me.dateOfBirth).toBe(DATE);
  });
});

describe("Interfaces", () => {
  it("INTERFACE: automatically selects the first concrete type when __typename is missing", () => {
    const actual = mockQuery();
    const concreteTypes = ["Planet", "Star"];

    expect(actual.me.trips[0].destination.__typename).toBe(concreteTypes[0]);
  });

  it("INTERFACE: can set custom concrete type from scenario using __typename", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          trips: [
            {
              destination: { __typename: "Star" },
            },
          ],
        },
      },
    });

    expect(actual.me.trips[0].destination.__typename).toBe("Star");
  });
});

describe("Unions", () => {
  it("UNION: automatically selects the first concrete type when __typename is missing", () => {
    const actual = mockQuery({
      scenario: {
        me: { hobbies: [{}] },
      },
    });
    const concreteTypes = ["ReadingHobby", "KarateHobby"];

    actual.me.hobbies.map((hobby) =>
      expect(hobby.__typename).toBe(concreteTypes[0])
    );
  });

  it("UNION: uses Concrete Type instead of Interface Type when __typename is specified", () => {
    const actual = mockQuery({
      scenario: {
        me: {
          hobbies: [
            { __typename: "ReadingHobby" },
            { __typename: "KarateHobby" },
          ],
        },
      },
    });

    expect(actual.me.hobbies[0].__typename).toBe("ReadingHobby");
    expect(actual.me.hobbies[1].__typename).toBe("KarateHobby");
  });
});
