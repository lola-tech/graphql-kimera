const fs = require("fs");
const path = require("path");
const schemaParser = require("easygraphql-parser");

const { reduceDataSourcesToScenario } = require("../engine");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "example.schema.graphql"),
  "utf8"
);
const schema = schemaParser(typeDefs);

const testReduceToScenario = (...args) => {
  return reduceDataSourcesToScenario(...args, schema);
};

test("it works", () => {
  expect(
    testReduceToScenario(
      {
        name: "me",
        type: "User",
        isArray: false,
      },
      {
        scenario: {
          name: "Jim",
          trips: [{ rockets: [{}, {}] }, { mission: "Unobtainium" }, {}],
        },
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
            trips: [{ isBooked: false }],
          }),
          String: () => "Mocked String",
        },
        nameBuilders: {
          profileImage: () => "http://example.com/profile.png",
          me: () => ({
            allergies: ["Aspirin"],
            address: {
              city: "New York City",
            },
          }),
        },
      }
    )
  ).toEqual({
    name: "Jim",
    emailAddress: "type@example.com",
    trips: [{ rockets: [{}, {}] }, { mission: "Unobtainium" }, {}],
    allergies: ["Aspirin"],
    address: {
      city: "New York City",
    },
  });
  // ^ For Object Type Builders, we expect the scenario to be composed
  // by aggregating fields mockers from other builders

  expect(
    testReduceToScenario(
      {
        name: "trips",
        type: "Launch",
        isArray: true,
      },
      {
        scenario: [{ rockets: [{}, {}] }, { mission: "Unobtainium" }, {}],
        typeBuilders: {
          User: () => ({
            trips: [{ isBooked: false }],
          }),
          Launch: () => ({
            site: "Kennedy Space Station",
            mission: "Stargazing",
            rockets: [{}],
          }),
          LaunchDestination: () => ({ name: "Mars" }),
          String: () => "Mocked String",
        },
        nameBuilders: {
          mission: () => "Tracking beetroot",
        },
      }
    )
  ).toEqual([
    {
      mission: "Stargazing",
      rockets: [{}, {}],
      site: "Kennedy Space Station",
    },
    { mission: "Unobtainium", rockets: [{}], site: "Kennedy Space Station" },
    { mission: "Stargazing", rockets: [{}], site: "Kennedy Space Station" },
  ]);
  // ^ For arrays of Object Type builders we epect

  expect(
    testReduceToScenario(
      {
        name: "me",
        type: "User",
        isArray: false,
      },
      {
        scenario: { name: "Jim" },
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
        },
        nameBuilders: {
          emailAddress: () => "hello@example.com",
        },
      }
    )
  ).toEqual({ name: "Jim", emailAddress: "type@example.com" });

  expect(
    testReduceToScenario(
      {
        name: "emailAddress",
        type: "String",
        isArray: false,
      },
      {
        scenario: "example@test.com",
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
        },
        nameBuilders: {
          emailAddress: () => "hello@example.com",
        },
      }
    )
  ).toEqual("example@test.com");

  expect(
    testReduceToScenario(
      {
        name: "emailAddress",
        type: "String",
        isArray: false,
      },
      {
        scenario: null,
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
        },
        nameBuilders: {
          emailAddress: () => "hello@example.com",
        },
      }
    )
  ).toEqual(null);

  expect(
    testReduceToScenario(
      {
        name: "emailAddress",
        type: "String",
        isArray: false,
      },
      {
        scenario: undefined,
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
        },
        nameBuilders: {
          emailAddress: () => "name@example.com",
        },
      }
    )
  ).toEqual("Mocked String");

  expect(
    testReduceToScenario(
      {
        name: "emailAddress",
        type: "String",
        isArray: false,
      },
      {
        scenario: undefined,
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
        },
        nameBuilders: {
          emailAddress: () => "name@example.com",
        },
      }
    )
  ).toEqual("name@example.com");

  expect(
    testReduceToScenario(
      {
        name: "allergies",
        type: "String",
        isArray: true,
      },
      {
        scenario: [{}],
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
        },
        nameBuilders: {
          emailAddress: () => "name@example.com",
        },
      }
    )
  ).toEqual([{}]);

  expect(
    testReduceToScenario(
      {
        name: "allergies",
        type: "String",
        isArray: true,
      },
      {
        scenario: undefined,
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
        },
        nameBuilders: {
          emailAddress: () => "name@example.com",
        },
      }
    )
  ).toEqual(undefined);

  expect(
    typeof testReduceToScenario(
      {
        name: "launches",
        type: "LaunchConnection",
        isArray: false,
      },
      {
        scenario: () => () => {
          // something
        },
        typeBuilders: {
          User: () => ({
            emailAddress: "type@example.com",
            trips: [{ isBooked: false }],
          }),
          String: () => "Mocked String",
        },
        nameBuilders: {
          profileImage: () => "http://example.com/profile.png",
          me: () => ({
            allergies: ["Aspirin"],
            address: {
              city: "New York City",
            },
          }),
        },
      }
    )
  ).toBe("function");
});
