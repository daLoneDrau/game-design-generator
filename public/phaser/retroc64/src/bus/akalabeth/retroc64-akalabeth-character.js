if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { RetroC64AkalabethEquipmentItem } = require("./retroc64-akalabeth-equipment-item");
}
/**
 * @class A class to represent the game character will be added using the 'prototype' template.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethCharacter(parameterObject) {
  /** @private The player's hit points */
  this._hitPoints = 0;
  /** @private The player's strength. */
  this._strength = 0;
  /** @private The player's dexterity. */
  this._dexterity = 0;
  /** @private The player's stamina. */
  this._stamina = 0;
  /** @private The player's wisdom. */
  this._wisdom = 0;
  /** @private The player's gold. */
  this._gold = 0;
  /** @private The player's class (Fighter or Mage). */
  this._class = "";
  /** @private The player's inventory. */
  this._inventory = {};
  Watchable.apply(this);
};
RetroC64AkalabethCharacter.prototype = Object.create(Watchable.prototype);
RetroC64AkalabethCharacter.prototype.constructor = Watchable;
{ // RetroC64AkalabethCharacter Getters/Setters
  Object.defineProperty(RetroC64AkalabethCharacter.prototype, 'hitPoints', {
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
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethCharacter.prototype, 'strength', {
    /**
     * Getter for field _strength.
     * @returns {Number}
     */
    get() {
      return this._strength;
    },
    /**
     * Setter for field _strength.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._strength = value;
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethCharacter.prototype, 'dexterity', {
    /**
     * Getter for field _dexterity.
     * @returns {Number}
     */
    get() {
      return this._dexterity;
    },
    /**
     * Setter for field _dexterity.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._dexterity = value;
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethCharacter.prototype, 'stamina', {
    /**
     * Getter for field int.
     * @returns {Object}
     */
    get() {
      return this._stamina;
    },
    /**
     * Setter for field int.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._stamina = value;
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethCharacter.prototype, 'wisdom', {
    /**
     * Getter for field _wisdom.
     * @returns {Number}
     */
    get() {
      return this._wisdom;
    },
    /**
     * Setter for field _wisdom.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._wisdom = value;
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethCharacter.prototype, 'gold', {
    /**
     * Getter for field _gold.
     * @returns {Number}
     */
    get() {
      return this._gold;
    },
    /**
     * Setter for field _gold.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._gold = value;
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethCharacter.prototype, 'class', {
    /**
     * Getter for field _class.
     * @returns {String}
     */
    get() {
      return this._class;
    },
    /**
     * Setter for field _class.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (typeof(value) !== "string" && !(value instanceof String)) {
        throw ["Invalid value", value];
      }
      this._class = value;
      this.notifyWatchers(this);
    }
  });
}
/**
 * Resets the character's attributes.
 */
RetroC64AkalabethCharacter.prototype.newCharacter = function() {
  this._hitPoints = Math.ceil(Math.sqrt(Math.random()) * 21 + 4);
  this._strength = Math.ceil(Math.sqrt(Math.random()) * 21 + 4);
  this._dexterity = Math.ceil(Math.sqrt(Math.random()) * 21 + 4);
  this._stamina = Math.ceil(Math.sqrt(Math.random()) * 21 + 4);
  this._wisdom = Math.ceil(Math.sqrt(Math.random()) * 21 + 4);
  this._gold = Math.ceil(Math.sqrt(Math.random()) * 21 + 4);
  this._class = "";
  this._inventory = {};
  this.notifyWatchers(this);
}
/**
 * Gets the number of an item the character has in their inventory.
 * @param {string} name the item's name
 * @returns {Number}
 */
RetroC64AkalabethCharacter.prototype.getNumberInInventory = function(name) {
  let num = 0;
  if (this._inventory.hasOwnProperty(name)) {
    num = this._inventory[name].count;
  }
  return num;
}
/**
 * Adds an item to inventory.
 * @param {object} item the item being added
 */
RetroC64AkalabethCharacter.prototype.addToInventory = function(item) {
  if (typeof(item.name) === "undefined"
      || typeof(item.count) === "undefined") {
    throw ["Invalid item", item];
  }
  if (!this._inventory.hasOwnProperty(item.name)) {
    this._inventory[item.name] = new RetroC64AkalabethEquipmentItem();
    this._inventory[item.name].name = item.name;
  }
  this._inventory[item.name].count += item.count;
  this.notifyWatchers(this);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethCharacter };
}
