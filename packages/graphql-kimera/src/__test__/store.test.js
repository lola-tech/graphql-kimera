const fs = require("fs");
const path = require("path");
const schemaParser = require("easygraphql-parser");

const { initializeStore } = require("../store");
const { mockType, mockResolver } = require("../engine");

const typeDefs = fs.readFileSync(
  path.join(__dirname, "example.schema.graphql"),
  "utf8"
);
const schema = schemaParser(typeDefs);
const mockQuery = ({ scenario, builders } = {}) => {
  return mockType("Query", schema, {
    scenario,
    builders,
  });
};

describe("store.get", () => {
  it("It retrieves data from behind muliple resolvers", () => {
    const resolver = () => {};
    const deepResolver = () => {};
    resolver.__mocks = initializeStore([{ inResolver: deepResolver }]);
    deepResolver.__mocks = initializeStore({ inDeepResolver: [42] });
    const store = initializeStore({ one: { two: resolver } });
    expect(store.get("one.two.0.inResolver.inDeepResolver.0")).toBe(42);
  });
});

describe("store.update", () => {
  it("Can update resolver store value", () => {
    const store = initializeStore(
      mockQuery({
        scenario: {
          launches: {
            list: mockResolver(() => () => {}, [{ site: "Mocked Site" }]),
          },
        },
      })
    );
    store.update({
      launches: {
        list: [...store.get("launches.list"), { site: "New Site" }],
      },
    });
    const updatedList = store.get("launches.list");

    expect(updatedList.length).toBe(2);
    expect(updatedList[1].site).toBe("New Site");
  });

  it("Can overwrite resolver store value", () => {
    const store = initializeStore(
      mockQuery({
        scenario: {
          launches: {
            list: mockResolver(() => () => {}, [{ site: "Mocked Site" }]),
          },
        },
      })
    );
    store.update({
      launches: {
        list: [],
      },
    });

    expect(store.get("launches.list").length).toBe(0);
  });

  it("Can update deep Objects", () => {
    const store = initializeStore(
      mockQuery({
        scenario: {
          launch: {
            mission: { name: "Mission" },
          },
        },
      })
    );

    store.update({
      launch: {
        mission: { name: "Exploration" },
      },
    });

    expect(store.get("launch.mission.name")).toBe("Exploration");
  });

  it("Deals well with null and undefined", () => {
    const store = initializeStore(
      mockQuery({
        scenario: {
          metadata: null,
          launch: {
            mission: { name: "Mission" },
          },
        },
      })
    );
    store.update({
      metadata: "Test",
      launch: {
        mission: { name: undefined },
      },
    });

    expect(store.get("metadata")).toBe("Test");
    expect(store.get("launch.mission.name")).toBe("Mission");
  });

  it("Throws when there is mismatch between value types", () => {
    const resolver = () => {};
    const deepResolver = () => {};
    resolver.__mocks = initializeStore({ inResolver: deepResolver });
    deepResolver.__mocks = initializeStore({ inDeepResolver: [42] });
    const store = initializeStore({ one: { two: resolver } });

    expect(() =>
      store.update({ one: { two: { inResolver: { inDeepResolver: {} } } } })
    ).toThrowError();
  });

  it("Throws when we are updating with functions", () => {
    const store = initializeStore({});
    expect(() => store.update({ test: () => {} })).toThrowError();
  });

  it("Throws when we are updating with resolvers", () => {
    const store = initializeStore({});
    expect(() =>
      store.update({ test: mockResolver(() => () => {}) })
    ).toThrowError();
  });
});
