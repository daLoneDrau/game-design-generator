/**
 * Wizardry constants.
 */
const WizardryConstants = {
  /*********************
   * EQUIPMENT ELEMENTS - generated dynamically
   ********************/
  EQUIPMENT_ELEMENTS: {},
  /*********************
   * APP_STATES
   ********************/
  /** the Specials scene */
  SPECIALS: 1,
  /** the Castle scene */
  CASTLE: 2,
  /** the Shops scene */
  SHOPS: 3,
  /** the Castle scene */
  CASTLE: 4,
  /** the Utilities scene */
  UTILITIES: 5,
  /** the Roller scene */
  ROLLER: 6,
  /** the Runner scene */
  RUNNER: 7,
  /** the Rewards scene */
  REWARDS: 8,
  /** the Combat scene */
  COMBAT: 9,
  /** the Camp scene */
  CAMP: 10,
  /** the delay in ms after keyboard entry. */
  KEYBOARD_ENTRY_DELAY: 500,
  /** The Wait for action to resolve state for all scenes. */
  SCENE_WAIT: 9999,
  /*********************
   * SPECIALS_STATES
   ********************/
  /** The main state for the Specials scene. */
  SPECIALS_MAIN: 1,
  /** The 'inspect' state for the Specials scene. */
  SPECIALS_INSPECT: 2,
  /** The 'init game' state for the Specials scene. */
  SPECIALS_INITGAME: 3,
  /** The 'misc' state for the Specials scene. */
  SPECIALS_MISC: 4,
  /*********************
   * BOLTAC_STATES
   ********************/
  /** The main menu state for the Boltac's Trading Post scene. */
  BOLTAC_MAIN: 1,
  /** The player menu state for the Boltac's Trading Post scene. */
  BOLTAC_PLAYER_MENU: 2,
  /** The buy menu state for the Boltac's Trading Post scene. */
  BOLTAC_BUY_MENU: 3,
  /** The sell menu state for the Boltac's Trading Post scene. */
  BOLTAC_SELL_MENU: 4,
  /** The uncurse menu state for the Boltac's Trading Post scene. */
  BOLTAC_UNCURSE_MENU: 5,
  /** The identify menu state for the Boltac's Trading Post scene. */
  BOLTAC_IDENTIFY_MENU: 6,
  /*********************
   * CAMP_STATES
   ********************/
  /** The main menu state for the Camp scene in the Maze. */
  CAMP_MAZE_MAIN: 1,
  /** The reorder menu state for the Camp scene. */
  CAMP_MAZE_REORDER: 2,
  /*********************
   * CANT_STATES
   ********************/
  /** The main menu state for the Temple of Cant scene. */
  CANT_MAIN: 1,
  /** The payment menu state for the Temple of Cant scene. */
  CANT_PAY: 2,
  /*********************
   * CASTLE_STATES
   ********************/
  /** The main menu state for the Castle Market scene. */
  CASTLE_MAIN: 1,
  /*********************
   * EDGE_TOWN_STATES
   ********************/
  /** The main menu state for the Edge of Town scene. */
  EDGE_TOWN_MAIN: 1,
  /** The maze state for the Edge of Town scene. */
  EDGE_TOWN_MAZE: 2,
  /*********************
   * GILGAMESH_STATES
   ********************/
  /** The main menu state for the Gilgamesh Tavern scene. */
  GILGAMESH_MAIN: 1,
  /** The add to party state for the Gilgamesh Tavern scene. */
  GILGAMESH_ADD_PARTY: 2,
  /** The remove from party state for the Gilgamesh Tavern scene. */
  GILGAMESH_REMOVE_PARTY: 3,
  /*********************
   * INN_STATES
   ********************/
  /** The main menu state for the Adventurer's Inn scene. */
  INN_MAIN: 1,
  /** The player menu state for the Adventurer's Inn scene. */
  INN_PLAYER_MENU: 2,
  /** The nap menu state for the Adventurer's Inn scene. */
  INN_NAP_MENU: 3,
  /*********************
   * INN_ROOMS
   ********************/
  /** The no room selected for the Adventurer's Inn scene. */
  INN_ROOM_NONE: 0,
  /** The stables selected for the Adventurer's Inn scene. */
  INN_ROOM_STABLES: 1,
  /** The cots selected for the Adventurer's Inn scene. */
  INN_ROOM_COTS: 2,
  /** The economy rooms selected for the Adventurer's Inn scene. */
  INN_ROOM_ECONOMY: 3,
  /** The merchant suites selected for the Adventurer's Inn scene. */
  INN_ROOM_MERCHANT: 4,
  /** The roayl suites selected for the Adventurer's Inn scene. */
  INN_ROOM_ROYAL: 5,
  /*********************
   * INSPECT_CHARACTER_STATES
   ********************/
  /** The main menu state for the Inspect Character scene. */
  INSPECT_CHARACTER_MAIN: 1,
  /** The Read Spells UI state for the Inspect Character scene. */
  INSPECT_READ_SPELLS_MAIN: 2,
  /** The Read Mage Spells UI state for the Inspect Character scene. */
  INSPECT_READ_MAGE_SPELLS_MAIN: 3,
  /** The Read Priest Spells UI state for the Inspect Character scene. */
  INSPECT_READ_PRIEST_SPELLS_MAIN: 4,
  /** The Equip Item state for the Inspect Character scene. */
  INSPECT_EQUIP_MAIN: 5,
  /** The Drop Item state for the Inspect Character scene. */
  INSPECT_DROP_MAIN: 6,
  /** The Trade state for the Inspect Character scene. */
  INSPECT_TRADE_MAIN: 7,
  /** The Cast state for the Inspect Character scene. */
  INSPECT_CAST_MAIN: 8,
  /** The Use Item state for the Inspect Character scene. */
  INSPECT_USE_MAIN: 9,
  /** The Identify Item state for the Inspect Character scene. */
  INSPECT_IDENTIFY_MAIN: 10,
  /*********************
   * MAKE_CHARACTER_STATES
   ********************/
  /** The state for name entry in the Make Character scene. */
  MAKE_CHARACTER_NAME: 1,
  /** The state for race entry in the Make Character scene. */
  MAKE_CHARACTER_RACE: 2,
  /** The state for alignment entry in the Make Character scene. */
  MAKE_CHARACTER_ALIGNMENT: 3,
  /** The state for points assignment in the Make Character scene. */
  MAKE_CHARACTER_POINTS: 4,
  /** The state for class entry in the Make Character scene. */
  MAKE_CHARACTER_CLASS: 5,
  /** The state for save entry in the Make Character scene. */
  MAKE_CHARACTER_SAVE: 6,
  /** The state for action waiting in the Make Character scene. */
  MAKE_CHARACTER_WAIT: 9999,
  /*********************
   * MARKET_STATES
   ********************/
  /** The main menu state for the Market scene. */
  MARKET_MAIN: 1,
  /*********************
   * TRAINING_GROUNDS_STATES
   ********************/
  /** The main menu state for the Training Grounds scene. */
  TRAINING_GROUNDS_MAIN: 1,
  /*********************
   * TRAIN_CHARACTER_STATES
   ********************/
  /** The main menu state for the Train Character scene. */
  TRAIN_CHARACTER_MAIN: 1,
  /** The change class state for the Train Character scene. */
  TRAIN_CHARACTER_CHANGE_CLASS: 2,
  /** The waiting ui state for the Train Character scene. */
  TRAIN_CHARACTER_WAIT: 9999,

  
  /** the letters A-Z */
  ALPHABET: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
}

const DIV2  = 0.5;
const DIV3  = 0.3333333333333333333333;
const DIV4  = 0.25;
const DIV5  = 0.2;
const DIV6  = 0.1666666666666666666666;
const DIV7  = 0.1428571428571428571428;
const DIV8  = 0.125;
const DIV9  = 0.1111111111111111111111;
const DIV24 = 0.0416666666666666666666;
const DIV38 = 0.0263157894736842105263;
const DIV40 = 0.025;

/**
 * @class Class enum using singleton pattern
 * @todo documentation
 */
const WizardryAttributeDescriptors = function () {
  console.trace();
  throw "Class WizardryAttributeDescriptors is an enum; no instances of it can be created.";
};
/**
 * @class Object Type enum using singleton pattern
 * @todo documentation
 */
const WizardryObjectType = function () {
  console.trace();
  throw "Class WizardryObjectType is an enum; no instances of it can be created.";
};
/**
 * @class Square enum using singleton pattern
 * @todo documentation
 */
const WizardrySquare = function () {
  console.trace();
  throw "Class WizardrySquare is an enum; no instances of it can be created.";
};
/**
 * @class Wall enum using singleton pattern
 * @todo documentation
 */
const WizardryWall = function () {
  console.trace();
  throw "Class WizardryWall is an enum; no instances of it can be created.";
};
/**
 * @class Xgoto enum using singleton pattern
 * @todo documentation
 */
const WizardryXgoto = function () {
  console.trace();
  throw "Class WizardryXgoto is an enum; no instances of it can be created.";
};
/**
 * @class Alignment enum using singleton pattern
 * @todo documentation
 */
const WizardryAlignment = function () {
  console.trace();
  throw "Class WizardryAlignment is an enum; no instances of it can be created.";
};
/**
 * @class Attribute enum using singleton pattern
 * @todo documentation
 */
const WizardryAttribute = function () {
  console.trace();
  throw "Class WizardryAttribute is an enum; no instances of it can be created.";
};
/**
 * @class Character Class enum using singleton pattern
 * @todo documentation
 */
const WizardryCharacterClass = function () {
  console.trace();
  throw "Class WizardryCharacterClass is an enum; no instances of it can be created.";
};
/**
 * @class Character Status enum using singleton pattern
 * @todo documentation
 */
const WizardryCharacterStatus = function () {
  console.trace();
  throw "Class WizardryCharacterStatus is an enum; no instances of it can be created.";
};
/**
 * @class Race enum using singleton pattern
 * @todo documentation
 */
const WizardryRace = function () {
  console.trace();
  throw "Class WizardryRace is an enum; no instances of it can be created.";
};
/**
 * @class Spel012 enum using singleton pattern
 * @todo documentation
 */
const WizardrySpel012 = function () {
  console.trace();
  throw "Class WizardrySpel012 is an enum; no instances of it can be created.";
};
/**
 * @class Zscn enum using singleton pattern
 * @todo documentation
 */
const WizardryZscn = function () {
  console.trace();
  throw "Class WizardryZscn is an enum; no instances of it can be created.";
};
/**
 * @class Spell enum using singleton pattern
 * @todo documentation
 */
const WizardrySpell = function () {
  console.trace();
  throw "Class WizardrySpell is an enum; no instances of it can be created.";
};

export { DIV2, DIV3, DIV4, DIV5, DIV6, DIV7, DIV8, DIV9, DIV24, DIV38, DIV40, WizardryConstants, WizardryAlignment, WizardryAttribute, WizardryAttributeDescriptors, WizardryCharacterClass, WizardryCharacterStatus, WizardryObjectType, WizardryRace, WizardrySpel012, WizardrySpell, WizardrySquare, WizardryWall, WizardryXgoto, WizardryZscn };
