if (typeof(module) !== "undefined") {
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
  let _world = null;
  /** @private The game dungeon instance. */
  let _dungeon = null;
  /** @private A flag to verify if the PAUSE is on is available. */
  let _pauseOn = false;
  /** @private The hardcoded list of monsters. */
  let _monsters = [
  {
    name: "SKELETON"
  },
  {
    name: "THIEF"
  },
  {
    name: "GIANT RAT"
  },
  {
    name: "ORC"
  },
  {
    name: "VIPER"
  },
  {
    name: "CARRION CRAWLER"
  },
  {
    name: "GREMLIN"
  },
  {
    name: "MIMIC"
  },
  {
    name: "DAEMON"
  },
  {
    name: "BALROG"
  },
];
  /** @private The current number of Levels Underground the character is. */
  let _levelsUnderground = 0;
  return {
    /**
     * Getter for field _pauseOn.
     * @returns {Object}
     */
    get pauseOn() {
      return _pauseOn;
    },
    /**
     * Setter for field _pauseOn.
     * @param {PropertyKey} value the value
     */
    set pauseOn(value) {
      if (typeof(value) !== "boolean") {
        throw ["Invalid value", value];
      }
      _pauseOn = value;
    },
    /**
     * Getter for field _levelsUnderground.
     * @returns {Number}
     */
    get levelsUnderground() {
      return _levelsUnderground;
    },
    /**
     * Setter for field _levelsUnderground.
     * @param {PropertyKey} value the value
     */
    set levelsUnderground(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _levelsUnderground = value;
    },
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
      if (_world === null) {
        _world = new this.WorldClass();
      }
      return _world;
    },
    /**
     * Getter for field _dungeon.
     * @returns {Object}
     */
    get dungeon() {
      if (_dungeon === null) {
        _dungeon = new this.DungeonClass();
      }
      return _dungeon;
    },
    /**
     * Getter for field _monsters.
     * @returns {Object}
     */
    get monsters() {
      return _monsters;
    },
    /**
     * Setter for field _luckyNumber.
     * @param {PropertyKey} value the value
     */
    set luckyNumber(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _luckyNumber = parseInt(value);
    },
    /**
     * Setter for field _levelOfPlay.
     * @param {PropertyKey} value the value
     */
    set levelOfPlay(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _levelOfPlay = parseInt(value);
    },
  };
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethController };
}
