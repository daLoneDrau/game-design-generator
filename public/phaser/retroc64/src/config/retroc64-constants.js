/**
 * @class Retro C64 constants.
 */
var RetroC64Constants = {
  /*********************
   * EQUIPMENT ELEMENTS - generated dynamically
   ********************/
  EQUIPMENT_ELEMENTS: {},
  /*********************
   * AKALABETH_CASTLE_STATES
   ********************/
  /** The initial state. */
  AKALABETH_CASTLE_NAME_ENTRY: 1,
  /** The state rendered when the characteris asked their goals in the game. */
  AKALABETH_CASTLE_GOAL_ENTRY: 2,
  /** The state rendered when the character's quest is incomplete. */
  AKALABETH_CASTLE_QUEST_INCOMPLETE: 3,
  /** The state rendered when the character's quest is complete. */
  AKALABETH_CASTLE_QUEST_COMPLETE: 4,
  /** The state rendered when all quests are complete. */
  AKALABETH_CASTLE_GAME_COMPLETE: 5,
  /*********************
   * AKALABETH_CHARACTER_CREATION_STATES
   ********************/
  /** the first character creation state is for the player's lucky number entry */
  AKALABETH_CHARACTER_CREATION_LUCKY_NUMBER: 1,
  /** the second character creation state is for the player's desired level of play */
  AKALABETH_CHARACTER_CREATION_LEVEL_OF_PLAY: 2,
  /** the third character creation state is to review the character */
  AKALABETH_CHARACTER_CREATION_REVIEW_CHARACTER: 3,
  /** the fourth character creation state is to select the character's class */
  AKALABETH_CHARACTER_CREATION_SELECT_CLASS: 4,
  /*********************
   * AKALABETH_CHARACTER_STATS_STATES
   ********************/
  /** The main state for the Character Stats scene */
  AKALABETH_CHARACTER_STATS_MAIN: 0,
  /*********************
   * AKALABETH_DUNGEON_STATES
   ********************/
  /** The initial state. */
  AKALABETH_DUNGEON_MAIN: 1,
  /*********************
   * AKALABETH_EQUIPMENT_SHOP_STATES
   ********************/
  /** The initial state, where the player can purchase equipment. */
  AKALABETH_EQUIPMENT_SHOP_PURCHASE: 1,
  /*********************
   * AKALABETH_GAME_OVER_STATES
   ********************/
  /** The main state for the Game Over scene */
  AKALABETH_GAME_OVER_MAIN: 0,
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
  /** The Character Stats state, where the character stats screen is displayed. */
  AKALABETH_CHARACTER_STATS: 4,
  /** The Dungeon state, where the dungeon exploration screen is displayed. */
  AKALABETH_DUNGEON: 5,
  /** The Castle state, where the castle screen is displayed. */
  AKALABETH_CASTLE: 6,
  /** The Game Over state, where the game over screen is displayed. */
  AKALABETH_GAME_OVER: 7,
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
