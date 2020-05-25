const getDebugger = (DEBUGGING) => {
  let debuggerState = {
    types: new Set(),
    fields: new Set(),
  };
  return function debug(type, field) {
    if (!DEBUGGING) return;
    console.log('DOES NOT WORK PROPERLY');
    const { types, fields } = debuggerState;
    const getSpaces = (size, char = '-') => {
      return size ? `${char.repeat(size)}` : '';
    };
    if (type) {
      types.add(type);
      console.log(
        `L${types.size - 1} ${getSpaces(types.size, '- ')} TYPE: ${type}`
      );
    } else if (field) {
      fields.add(field);

      console.log(
        `L${types.size - 1} ${getSpaces(types.size, ' ')} FIELD: ${field}`
      );
    }
  };
};

// Displays duplicates in the cache, and what part of the key is different.
// Usually this happens for the scenario.
// Helpful to debug performance.
const debugCacheDuplicates = (cache, meta = {}) => {
  const keys = cache._keys.map((key) => key[0]);

  // Lists the keys for inspection of duplication
  // console.log(keys);

  if (keys.length !== Array.from(new Set(keys)).length) {
    const duplicates = cache._keys.filter(
      // From those keys, select one type, and pass it as
      // showDifferenceForType to show what's different for
      // the duplicate types.
      (key) => key[0] === meta.showDifferenceForType
    );
    if (duplicates.length > 2) {
      const keyParts = ['type', 'names', 'types', 'scenario'];
      duplicates.slice(0, -1).forEach((duplicate, index) => {
        duplicates.slice(index + 1).forEach((nextDup, jindex) => {
          duplicate.map((testedKeyPart, i) => {
            if (testedKeyPart !== nextDup[i]) {
              console.log(`${duplicates.length} DIFFERENT ${keyParts[i]}:`, {
                [index]: testedKeyPart,
                [jindex + 1 + index]: duplicates[jindex + index + 1][i],
              });
            }
          });
        });
      });
    } else if (duplicates.length) {
      console.log(
        'Are equal',
        duplicates[0].reduce((res, keyPart, i) => {
          if (keyPart !== duplicates[1][i]) {
            console.log('DIFFERENT:', { zero: keyPart, one: duplicates[1][i] });
          }
          return res && keyPart === duplicates[1][i];
        }, true)
      );
    }
  }
};

module.exports = {
  getDebugger,
  debugCacheDuplicates,
};
