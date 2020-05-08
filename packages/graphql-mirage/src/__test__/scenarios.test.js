const fs = require("fs");
const path = require("path");
const schemaParser = require("easygraphql-parser");

const { useResolver, reduceToScenario } = require("../scenarios");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "example.schema.graphql"),
  "utf8"
);
const schema = schemaParser(typeDefs);

const testReduceToScenario = (...args) => {
  return reduceToScenario(...args, schema).reducedScenario;
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
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
            trips: [{ isBooked: false }],
            allergies: ["Aspirin"],
            address: {
              city: "New York City",
            },
            profileImage: "http://example.com/profile.png",
          }),
          String: () => "Mocked String",
        },
      }
    )
  ).toEqual({
    name: "Jim",
    emailAddress: "type@example.com",
    profileImage: "http://example.com/profile.png",
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
        builders: {
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
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
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
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
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
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
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
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
          String: () => "Mocked String",
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
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
        },
      }
    )
  ).toEqual(undefined);

  expect(
    testReduceToScenario(
      {
        name: "allergies",
        type: "String",
        isArray: true,
      },
      {
        scenario: [{}],
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
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
        builders: {
          User: () => ({
            emailAddress: "type@example.com",
          }),
        },
      }
    )
  ).toEqual(undefined);

  expect(
    testReduceToScenario(
      {
        name: "me",
        type: "User",
        isArray: false,
      },
      {
        scenario: {
          emailAddress: { test: "email@example.com" },
        },
        builders: {
          User: () => ({
            emailAddress: useResolver(() => () => "resolver@example.com"),
            trips: [{ isBooked: false }],
          }),
          String: () => "Mocked String",
        },
      }
    )
  ).toEqual({
    emailAddress: { test: "email@example.com" },
    trips: [{ isBooked: false }],
  });
});
