if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../../../../../lib/RPGBase-NodeJS/src/bus/watchable");
}
/**
 * @class A new class will define monster data.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethMonsterData(parameterObject) {
  /** @private A field to track the monster type. */
  this._type = -1;
  /** @private A field to track the monster's hit points. */
  this._hitPoints = 0;
  /** @private A field to track the monster's X-coordinate. */
  this._x = -1;
  /** @private A field to track the monster's y-coordinate */
  this._y = -1;
  Watchable.apply(this);
};
RetroC64AkalabethMonsterData.prototype = Object.create(Watchable.prototype);
RetroC64AkalabethMonsterData.prototype.constructor = Watchable;
{ // RetroC64AkalabethMonsterData Getters/Setters
  Object.defineProperty(RetroC64AkalabethMonsterData.prototype, 'type', {
    /**
     * Getter for field _type.
     * @returns {Number}
     */
    get() {
      return this._type;
    },
    /**
     * Setter for field _type.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._type = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethMonsterData.prototype, 'hitPoints', {
    /**
     * Getter for field _hitPoints.
     * @returns {Number}
     */
    get() {
      return this._hitPoints;
    },
    /**
     * Setter for field _hitPoints.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._hitPoints = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethMonsterData.prototype, 'x', {
    /**
     * Getter for field _x.
     * @returns {Number}
     */
    get() {
      return this._x;
    },
    /**
     * Setter for field _x.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._x = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethMonsterData.prototype, 'y', {
    /**
     * Getter for field _y.
     * @returns {Number}
     */
    get() {
      return this._y;
    },
    /**
     * Setter for field _y.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._y = value;
    }
  });
}
/**
 * Determines if a monster is dead.
 * @returns {boolean] true if the monster is dead; false otherwise.
 */
RetroC64AkalabethMonsterData.prototype.isDead = function() {
  return this._hitPoints <= 0;
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethMonsterData };
}
