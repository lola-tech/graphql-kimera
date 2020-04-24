const update = require('immutability-helper');

const {
  getScenarioFn,
  getTypeBuildersFn,
  getNameBuildersFn,
} = require('../helpers');

describe('getScenario', () => {
  const defaults = {
    viewer: {
      userName: 'lola23',
      firstName: 'Lola',
    },
  };

  const customData = {
    viewer: {
      userName: 'john69',
    },
  };

  it('merges defaults correctly', () => {
    const actual = getScenarioFn(defaults)(customData);
    expect(actual.viewer.userName).toEqual(customData.viewer.userName);
    expect(actual.viewer.firstName).toEqual(defaults.viewer.firstName);
  });

  it('gets memoized by using the customData object shape', () => {
    const getScenario = getScenarioFn(defaults);

    const expected = getScenario(
      update(customData, {
        viewer: { userName: { $set: customData.viewer.userName } },
      })
    );
    const actual = getScenario(customData);

    expect(actual === expected).toBe(true);
  });

  it('handle nulls', () => {
    const actual = getScenarioFn(null)({ viewer: { userName: 'lena' } });

    expect(actual.viewer.userName).toBe('lena');
  });
});

describe('getNameBuilders', () => {
  // TODO: investigate why the lib is not merging correctly more than 1 level deep
  const defaults = {
    city: {
      name: 'Cluj-Napoca',
    },
    address: {
      line1: 'Eroilor Boulevard, no 15',
      description: 'Hip part of the city',
    },
    loremIpsum: 'sid dolor',
  };
  const customData = {
    address: {
      line1: 'George Baritiu, no 29',
      description: 'The best coffee in the city',
    },
    testKey: true,
  };

  it('getNameBuilders: merges the custom data correctly', () => {
    const actual = getNameBuildersFn(defaults)(customData);

    expect(actual.city.name).toEqual(defaults.city.name);
    expect(actual.address.line1).toEqual(customData.address.line1);
    expect(actual.address.description).toEqual(customData.address.description);
    expect(actual.loremIpsum).toEqual(defaults.loremIpsum);
    expect(actual.testKey).toBe(true);
  });

  it('gets memoized by using the customData object shape', () => {
    const getNameBuilders = getNameBuildersFn(defaults);

    const expected = getNameBuilders({
      ...customData,
    });
    const actual = getNameBuilders(customData);

    expect(actual === expected).toBe(true);
  });
});

describe('getTypeBuilders', () => {
  const defaults = {
    city: {
      name: 'Cluj-Napoca',
    },
    address: {
      line1: 'Eroilor Boulevard, no 15',
      description: 'Hip part of the city',
    },
    loremIpsum: 'sid dolor',
  };
  const customData = {
    address: {
      line1: 'George Baritiu, no 29',
      description: 'The best coffee in the city',
    },
    testKey: true,
  };

  it('getTypeBuilders: merges the custom data correctly', () => {
    const actual = getNameBuildersFn(defaults)(customData);

    expect(actual.city.name).toEqual(defaults.city.name);
    expect(actual.address.line1).toEqual(customData.address.line1);
    expect(actual.address.description).toEqual(customData.address.description);
    expect(actual.loremIpsum).toEqual(defaults.loremIpsum);
    expect(actual.testKey).toBe(true);
  });

  it('gets memoized by using the customData object shape', () => {
    const getTypeBuilders = getTypeBuildersFn(defaults);

    const expected = getTypeBuilders({ ...customData });
    const actual = getTypeBuilders(customData);

    expect(actual === expected).toBe(true);
  });
});
