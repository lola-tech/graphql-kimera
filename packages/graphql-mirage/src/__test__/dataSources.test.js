const { times } = require("lodash");
const update = require("immutability-helper");

const { getScenarioFn, getBuildersFn } = require("../helpers");

describe("getScenario", () => {
  const defaults = {
    me: {
      userName: "ciobi", // String
      children: [{}, { name: "Andreea" }, {}], // [Child]
      trips: times(10, () => ({
        rockets: [{ name: "Falcon 9" }, { name: "Falcon Heavy" }],
      })), // [Launches -> { ..., rockets: [Rocket] }]
    },
    countries: times(10, () => ({})),
  };

  const customData = {
    me: {
      userName: "c10b10",
      children: [{}],
    },
    countries: times(5, () => ({
      states: times(2, () => ({
        name: "Arizona",
      })),
    })),
  };

  it("merges defaults correctly", () => {
    const actual = getScenarioFn(defaults)(customData);
    expect(actual.me.userName).toEqual(customData.me.userName);
    expect(actual.me.children).toHaveLength(customData.me.children.length);
    expect(actual.me.trips).toHaveLength(defaults.me.trips.length);
    expect(actual.countries).toHaveLength(5);
    expect(actual.countries[0].states).toHaveLength(2);
    expect(actual.countries[0].states[0].name).toBe("Arizona");
  });

  it("gets memoized by using the customData object shape", () => {
    const getScenario = getScenarioFn(defaults);

    const expected = getScenario(
      update(customData, {
        me: { userName: { $set: customData.me.userName } },
      })
    );
    const actual = getScenario(customData);

    expect(actual === expected).toBe(true);
  });

  it("handle nulls", () => {
    const actual = getScenarioFn(null)({ me: { userName: "c10b10" } });

    expect(actual.me.userName).toBe("c10b10");
  });
});

describe("getBuilders", () => {
  const defaults = {
    city: "Cluj-Napoca",
    address: "Eroilor Street",
    description: "Lorem ipsum",
  };

  const customData = {
    address: "Unirii Square",
    test: true,
  };

  it("getBuilders: merges the custom data correctly", () => {
    const actual = getBuildersFn(defaults)(customData);

    expect(actual.city).toEqual(defaults.city);
    expect(actual.address).toEqual(customData.address);
    expect(actual.description).toEqual(defaults.description);
    expect(actual.test).toBe(true);
  });

  it("gets memoized by using the customData object shape", () => {
    const getBuilders = getBuildersFn(defaults);

    const expected = getBuilders({ ...customData });
    const actual = getBuilders(customData);

    expect(actual === expected).toBe(true);
  });
});
