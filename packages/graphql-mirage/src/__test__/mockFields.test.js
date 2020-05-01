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
const mockQueryType = ({ scenario, typeBuilders, nameBuilders } = {}) => {
  return mockObjectType("Query", schema, {
    scenario,
    typeBuilders,
    nameBuilders,
  });
};

describe("Scenario", () => {
  it("SCENARIO: sets built-in scalar", () => {
    const EMAIL = "me@example.com";

    const actual = mockQueryType({
      scenario: {
        me: { email: EMAIL, profileImage: null },
      },
    });

    expect(actual.me.email).toEqual(EMAIL);
    expect(actual.me.profileImage).toBe(null);
  });

  it("SCENARIO: sets array of built-in scalars", () => {
    const actual = mockQueryType({
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
    const actual = mockQueryType({
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
    const actual = mockQueryType({
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
    const actual = mockQueryType({
      scenario: {
        me: {
          trips: [
            { site: "Kennedy Space Center" },
            { mission: { name: "Alpha" } },
          ],
        },
      },
      typeBuilders: { Mission: () => ({ name: "Beta" }) },
    });

    expect(actual.me.trips[0].mission.name).toEqual("Beta");
  });

  it("TYPE: can set null values for *any* field from Object Type Builder", () => {
    const actual = mockQueryType({
      scenario: {
        me: {
          trips: [{ site: "Kennedy Space Center" }, {}],
        },
      },
      typeBuilders: {
        User: () => ({ profileImage: null }),
        Launch: () => ({ rockets: null }),
      },
    });

    expect(actual.me.profileImage).toBe(null);
    expect(actual.me.trips[0].rockets).toBe(null);
  });

  it("TYPE: Object Type builders can set the shape of Array Object Type fields", () => {
    const actual = mockQueryType({
      typeBuilders: {
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
    const actual = mockQueryType({
      typeBuilders: {
        ID: () => "GENERATED_ID",
      },
    });

    expect(actual.me.id).toBe("GENERATED_ID");
    expect(actual.me.trips[0].id).toBe("GENERATED_ID");
  });

  it("TYPE: Object Type builder does not ovewrite Scenario", () => {
    const actual = mockQueryType({
      scenario: {
        me: {
          profileImage: null,
          email: "jim@example.com",
          trips: [{ site: "Vandenberg Air Force Base" }, {}],
        },
      },
      typeBuilders: {
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
    const actual = mockQueryType({
      scenario: {
        launches: {
          list: times(5, (i) => ({
            site: i % 2 ? "Odd Space Center" : "Even Space Center",
          })),
        },
      },
      typeBuilders: {
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

describe("Name Builders", () => {
  it("NAME: works when no Scenario or Object Type builder present", () => {
    const actual = mockQueryType({
      nameBuilders: {
        id: () => "NAME_BUILDER_ID",
      },
    });

    expect(actual.me.id).toEqual("NAME_BUILDER_ID");
    expect(actual.me.trips[0].id).toEqual("NAME_BUILDER_ID");
    expect(actual.me.trips[0].rockets[0].id).toEqual("NAME_BUILDER_ID");
  });

  it("NAME: does not overwrite Scenario", () => {
    const actual = mockQueryType({
      scenario: { me: { id: "SCENARIO_ID" } },
      nameBuilders: {
        id: () => "NAME_BUILDER_ID",
      },
    });

    expect(actual.me.id).toEqual("SCENARIO_ID");
  });

  it("NAME: does not overwrite Object Type builder", () => {
    const actual = mockQueryType({
      typeBuilders: {
        User: () => ({
          id: "OBJECT_BUILDER_ID",
        }),
      },
      nameBuilders: {
        id: () => "NAME_BUILDER_ID",
      },
    });

    expect(actual.me.id).toEqual("OBJECT_BUILDER_ID");
  });
});

describe("Enums", () => {
  it("ENUM: selects the first value of the enum", () => {
    const actual = mockQueryType();
    const enumValues = ["FEMALE", "MALE", "NON_BINARY"];

    expect(actual.me.gender).toBe(enumValues[0]);
  });
});

describe("Scalars", () => {
  it("SCALAR: uses Type builder to generate scalar value", () => {
    const DATE = "1989-12-16";
    const actual = mockQueryType({
      typeBuilders: {
        Date: () => DATE,
      },
    });

    expect(actual.me.dateOfBirth).toBe(DATE);
  });
});

describe("Interfaces", () => {
  it("INTERFACE: automatically selects the first concrete type when __typename is missing", () => {
    const actual = mockQueryType();
    const concreteTypes = ["Planet", "Star"];

    expect(actual.me.trips[0].destination.__typename).toBe(concreteTypes[0]);
  });

  it("INTERFACE: can set custom concrete type from scenario using __typename", () => {
    const actual = mockQueryType({
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
    const actual = mockQueryType({
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
    const actual = mockQueryType({
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
