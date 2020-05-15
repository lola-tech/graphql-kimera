const fs = require("fs");
const path = require("path");
const schemaParser = require("easygraphql-parser");

const { buildMocks } = require("../engine");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "example.schema.graphql"),
  "utf8"
);
const schema = schemaParser(typeDefs);

describe("Scenario", () => {
  it("SCENARIO: overwrites default scenario", () => {
    const actual = buildMocks(
      "Launch",
      schema,
      {
        scenario: {
          site: "Kennedy Space Center",
          mission: { name: "Test Mission" },
        },
      },
      {
        scenario: {
          site: "Vandenberg Air Force Base",
        },
      }
    );

    expect(actual.site).toEqual("Vandenberg Air Force Base");
    expect(actual.mission.name).toEqual("Test Mission");
  });

  it("SCENARIO: works only with main scenario", () => {
    const actual = buildMocks(
      "Launch",
      schema,
      {},
      {
        scenario: {
          site: "Kennedy Space Center",
        },
      }
    );

    expect(actual.site).toEqual("Kennedy Space Center");
  });
});
