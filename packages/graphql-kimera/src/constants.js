// Built-in scalar types
const ID = 'ID';
const string = 'String';
const int = 'Int';
const float = 'Float';
const boolean = 'Boolean';

const scalarTypeDefinition = 'ScalarTypeDefinition';
const interfaceTypeDefinition = 'InterfaceTypeDefinition';

// How many items will be mocked in List Types
const DEFAULT_LIST_LENGTH = 3;

// Used to track a potentially recursive branch so we can warn the user.
const RECURSIVITY_DEPTH_LIMIT =
  Number(process.env.KIMERA_RECURSIVITY_DEPTH_LIMIT) || 20;

module.exports = {
  ID,
  string,
  int,
  float,
  boolean,
  scalarTypeDefinition,
  interfaceTypeDefinition,
  DEFAULT_LIST_LENGTH,
  RECURSIVITY_DEPTH_LIMIT,
};
