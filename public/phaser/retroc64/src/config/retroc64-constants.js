/**
 * @class Retro C64 constants.
 */
var RetroC64Constants = {
  /*********************
   * EQUIPMENT ELEMENTS - generated dynamically
   ********************/
  EQUIPMENT_ELEMENTS: {},
  /*********************
   * AKALABETH_EQUIPMENT_SHOP_STATES
   ********************/
  /** The initial state, where the player can purchase equipment. */
  AKALABETH_EQUIPMENT_SHOP_PURCHASE: 1,
  /*********************
   * AKALABETH_GAME_STATES
   ********************/
  /** The Character Creation state, where the player's character is created. */
  AKALABETH_CHARACTER_CREATION: 0,
  /** The Equipment Shop state, where the Shop view is displayed after character creation. */
  AKALABETH_EQUIPMENT_SHOP: 1,
  /** The Setup state, where the world is populated. */
  AKALABETH_SETUP: 2,
  /** The World Map state, where the world map is displayed. */
  AKALABETH_WORLD_MAP: 3,
  /*********************
   * AKALABETH_INTRO_STATES
   ********************/
  /** the very first state in the Intro View. Get the user's lucky number. */
  AKALABETH_INTRO_LUCKY_NUMBER: 0,
  /** the second state in the Intro View. Presents a freshly-rolled character. */
  AKALABETH_INTRO_REVIEW_CHARACTER: 1,
  /** the third state in the Intro View. Allows the player to shop for supplies. */
  AKALABETH_INTRO_SHOP: 2,
  /*********************
   * AKALABETH_WORLD_MAP_STATES
   ********************/
  /** The initial state. */
  AKALABETH_WORLD_MAP_DISPLAY: 1,
}
/**
 * @class Class enum using singleton pattern
 * @todo documentation
 */
const RetroC64AttributeDescriptors = function () {
  console.trace();
  throw "Class RetroC64AttributeDescriptors is an enum; no instances of it can be created.";
};

if (typeof(module) !== "undefined") {
  module.exports = {
    RetroC64Constants: Object.freeze(RetroC64Constants),
    RetroC64AttributeDescriptors,
  };
}
