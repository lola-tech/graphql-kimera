---
id: api-merge-scenarios
title: mergeScenarios
sidebar_label: mergeScenarios
---

Merges two scenarios into one.

```javascript
mergeScenarios(defaultScenario, customScenario);
```

Both `defaultScenario` and `customScenario` are [scenarios](/graphql-kimera/docs/scenario). Objects are merged deeply, while Arrays are replaced. Useful in mutations, when we need to make sure we're using some defaults from a scenario when building data for an Object Type.

## Example

```javascript
const defaultScenario = {
  viewer: {
    userName: 'fancypants2019',
    fullName: 'Tarzan'
    subscribed: true,
    watchList: [{}, { name: 'Some fancy movie title' }],
    address: {
      city: 'Cluj-Napoca',
      country: 'Romania'
    }
  },
};

const customScenario = {
  viewer: {
    userName: 'Jane',
    watchList: [],
    address: {
      city: 'Iasi'
    }
  },
};

const scenario = mergeScenarios(defaultScenario, customScenario);
```

The code will return:

```
const defaultScenario = {
  viewer: {
    userName: 'fancypants2019', // Default
    fullName: 'Jane', // Custom
    subscribed: true, // Default
    watchList: [], // Custom
    address: {
      city: 'Iasi', // Custom
      country: 'Romania', // Default
    },
  },
};
```
