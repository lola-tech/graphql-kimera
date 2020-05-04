const fs = require("fs");
const path = require("path");
const { times } = require("lodash");
const schemaParser = require("easygraphql-parser");

const { defaultBuiltInScalarBuilders } = require("../engine");
const { mergeDataSources } = require("../helpers");
const { buildMocks, mergeScenario } = require("../index");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "example.schema.graphql"),
  "utf8"
);
const schema = schemaParser(typeDefs);
const testBuildMocks = (type, schema, defaults = {}, custom) =>
  buildMocks(
    type,
    schema,
    mergeDataSources(
      {
        typeBuilders: defaultBuiltInScalarBuilders,
      },
      defaults
    ),
    custom
  );

describe("Scenario", () => {
  it("SCENARIO: selectors allows to select subscenario for Object Type", () => {
    const defaultScenario = {
      me: {
        trips: times(5, () => ({
          site: "Kennedy Space Center",
          mission: { name: "Test Mission" },
        })),
      },
    };

    const actual = testBuildMocks(
      "Launch",
      schema,
      {
        scenario: defaultScenario,
      },
      {
        scenario: mergeScenario(defaultScenario.me.trips[0], {
          site: "Vandenberg Air Force Base",
        }),
      }
    );

    expect(actual.site).toEqual("Vandenberg Air Force Base");
    expect(actual.mission.name).toEqual("Test Mission");
  });

  it("SCENARIO: works when selector cannot find subscenario", () => {
    const actual = testBuildMocks(
      "Launch",
      schema,
      {},
      {
        scenario: mergeScenario(undefined, {
          site: "Kennedy Space Center",
        }),
      }
    );

    expect(actual.site).toEqual("Kennedy Space Center");
  });
});
