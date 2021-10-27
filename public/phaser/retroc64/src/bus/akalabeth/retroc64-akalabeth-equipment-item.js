if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
}
/**
 * @class A class to represent equipment items will be added using the 'prototype' template.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethEquipmentItem(parameterObject) {
  /** @private The item's name. */
  this._name = "";
  /** @private The # of items in a stack */
  this._count = 0;
  Watchable.apply(this);
};
RetroC64AkalabethEquipmentItem.prototype = Object.create(Watchable.prototype);
RetroC64AkalabethEquipmentItem.prototype.constructor = Watchable;
{ // RetroC64AkalabethEquipmentItem Getters/Setters
  Object.defineProperty(RetroC64AkalabethEquipmentItem.prototype, 'name', {
    /**
     * Getter for field _name.
     * @returns {Object}
     */
    get() {
      return this._name;
    },
    /**
     * Setter for field _name.
     * @param {PropertyKey} value the value
     */
    set(value) {
      this._name = value;
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethEquipmentItem.prototype, 'count', {
    /**
     * Getter for field _count.
     * @returns {Number}
     */
    get() {
      return this._count;
    },
    /**
     * Setter for field _count.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._count = value;
      if (this._count < 0) {
        this._count = 0;
      }
      this.notifyWatchers(this);
    }
  });
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethEquipmentItem };
}
