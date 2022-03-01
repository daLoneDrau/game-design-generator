/**
 * @class Wizardry constants.
 */
var WizardryConstants = {
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
}
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
 var WizardryObjectType = function () {
  console.trace();
  throw "Class WizardryObjectType is an enum; no instances of it can be created.";
};
/**
 * @class Square enum using singleton pattern
 * @todo documentation
 */
 var WizardrySquare = function () {
  console.trace();
  throw "Class WizardrySquare is an enum; no instances of it can be created.";
};
/**
 * @class Wall enum using singleton pattern
 * @todo documentation
 */
 var WizardryWall = function () {
  console.trace();
  throw "Class WizardryWall is an enum; no instances of it can be created.";
};
/**
 * @class Xgoto enum using singleton pattern
 * @todo documentation
 */
 var WizardryXgoto = function () {
  console.trace();
  throw "Class WizardryXgoto is an enum; no instances of it can be created.";
};
/**
 * @class Alignment enum using singleton pattern
 * @todo documentation
 */
 var WizardryAlignment = function () {
  console.trace();
  throw "Class WizardryAlignment is an enum; no instances of it can be created.";
};
/**
 * @class Attribute enum using singleton pattern
 * @todo documentation
 */
 var WizardryAttribute = function () {
  console.trace();
  throw "Class WizardryAttribute is an enum; no instances of it can be created.";
};
/**
 * @class Character Class enum using singleton pattern
 * @todo documentation
 */
 var WizardryCharacterClass = function () {
  console.trace();
  throw "Class WizardryCharacterClass is an enum; no instances of it can be created.";
};
/**
 * @class Character Status enum using singleton pattern
 * @todo documentation
 */
 var WizardryCharacterStatus = function () {
  console.trace();
  throw "Class WizardryCharacterStatus is an enum; no instances of it can be created.";
};
/**
 * @class Race enum using singleton pattern
 * @todo documentation
 */
 var WizardryRace = function () {
  console.trace();
  throw "Class WizardryRace is an enum; no instances of it can be created.";
};
/**
 * @class Spel012 enum using singleton pattern
 * @todo documentation
 */
 var WizardrySpel012 = function () {
  console.trace();
  throw "Class WizardrySpel012 is an enum; no instances of it can be created.";
};
/**
 * @class Zscn enum using singleton pattern
 * @todo documentation
 */
 var WizardryZscn = function () {
  console.trace();
  throw "Class WizardryZscn is an enum; no instances of it can be created.";
};

if (typeof(module) !== "undefined") {
  module.exports = {
    WizardryConstants: Object.freeze(WizardryConstants),
    WizardryAttributeDescriptors,
    WizardryObjectType,
    WizardrySquare,
    WizardryWall,
    WizardryXgoto,
    WizardryAlignment,
    WizardryAttribute,
    WizardryCharacterClass,
    WizardryCharacterStatus,
    WizardryRace,
    WizardrySpel012,
    WizardryZscn,
  };
}
