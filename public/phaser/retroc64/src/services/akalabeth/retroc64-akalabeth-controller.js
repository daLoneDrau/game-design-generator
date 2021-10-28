if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethWorld } = require("../../bus/akalabeth/retroc64-akalabeth-world");
  var { RetroC64AkalabethCharacter } = require("../../bus/akalabeth/retroc64-akalabeth-character");
}
/**
 * @class A singleton Controller class will be created to track global variables and instances.
 */
var RetroC64AkalabethController = (function() {
  /** @private The player's lucky number. */
  let _luckyNumber = 0;
  /** @private The chosen level of play. */
  let _levelOfPlay = 0;
  /** @private The player character instance. */
  let _character = new RetroC64AkalabethCharacter();
  /** @private The game world instance. */
  let _world = new RetroC64AkalabethWorld();
  return {
    /**
     * Getter for field _luckyNumber.
     * @returns {Number}
     */
    get luckyNumber() {
      return _luckyNumber;
    },
    /**
     * Getter for field _levelOfPlay.
     * @returns {Number}
     */
    get levelOfPlay() {
      return _levelOfPlay;
    },
    /**
     * Getter for field _character.
     * @returns {Object}
     */
    get character() {
      return _character;
    },
    /**
     * Getter for field _world.
     * @returns {Object}
     */
    get world() {
      return _world;
    },
    /**
     * Setter for field _luckyNumber.
     * @param {PropertyKey} value the value
     */
    set luckyNumber(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _luckyNumber = value;
    },
    /**
     * Setter for field _levelOfPlay.
     * @param {PropertyKey} value the value
     */
    set levelOfPlay(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _levelOfPlay = value;
    },
  };
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethController };
}
