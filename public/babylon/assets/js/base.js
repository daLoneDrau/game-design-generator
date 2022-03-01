/**
 * @class Conditional class.
 */
class Condition {
  constructor(parameterObject) {
    if (typeof (parameterObject) === "undefined") {
      console.trace();
      throw "Condition constructor requires a parameter object";
    }
    if (!parameterObject.hasOwnProperty("type")) {
      console.trace();
      throw "Condition must have a defined type";
    }
    this._type = parameterObject.type;
    this._pass = parameterObject.pass;
    if (typeof (this._pass) !== "undefined"
      && this._pass.hasOwnProperty("type")
      && (this._pass.hasOwnProperty("pass") || this._pass.hasOwnProperty("fail") || this._pass.hasOwnProperty("conditionals"))) {
      this._pass = new Condition(this._pass);
    }
    this._fail = parameterObject.fail;
    if (typeof (this._fail) !== "undefined"
      && this._fail.hasOwnProperty("type")
      && this._fail.hasOwnProperty("pass")
      && this._fail.hasOwnProperty("fail")) {
      this._fail = new Condition(this._fail);
    }
    switch (parameterObject.type) {
      case "multipleAnd":
      case "multipleOr":
      case "multipleSwitch":
      case "randomUntilPass":
        this._conditionals = [];
        for (var i = parameterObject.conditionals.length - 1; i >= 0; i--) {
          this._conditionals.push(new Condition(parameterObject.conditionals[i]));
        }
        break;
      case "propertyComparisonEquals":
      case "propertyComparisonLessThanEquals":
        this._property = parameterObject.property;
        if (parameterObject.hasOwnProperty("comparisonField")) {
          this._comparisonField = parameterObject.comparisonField;
        } else if (parameterObject.hasOwnProperty("comparisonFunction")) {
          this._comparisonFunction = parameterObject.comparisonFunction;
          this._comparisonArgs = parameterObject.comparisonArgs;
        }
        this._comparison = parameterObject.comparison;
        break;
    }
  }
  test(testArgs) {
    var ret = this._pass;
    switch (this._type) {
      case "returnPass":
        break;
      case "multipleAnd":
        var pass = true;
        for (var i = this._conditionals.length - 1; i >= 0; i--) {
          // if any one conditional fails, the parent fails
          if (!this._conditionals[i].test(testArgs)) {
            pass = false;
            break;
          }
        }
        if (!pass) {
          ret = this._fail;
        }
        break;
      case "multipleOr":
        var pass = false;
        for (var i = this._conditionals.length - 1; i >= 0; i--) {
          // if any one conditional passes, the parent passes
          if (this._conditionals[i].test(testArgs)) {
            pass = true;
            break;
          }
        }
        if (!pass) {
          ret = this._fail;
        }
        break;
      case "multipleSwitch":
        for (var i = this._conditionals.length - 1; i >= 0; i--) {
          // the first passing condition is the result
          if (this._conditionals[i].test(testArgs)) {
            ret = this._conditionals[i]._pass;
            break;
          }
        }
        break;
      case "randomUntilPass":
        ret = false, tries = 0;
        while (!ret) {
          tries++;
          ret = this.Dice.getRandomMember(this._conditionals).test(testArgs);
          if (tries > 100) {
            console.trace(this._conditionals, testArgs);
            throw { "message": "FAILED CONDITIONAL MORE THAN 100 ATTEMPTS", "testArgs": testArgs, "conditionals": this._conditionals };
          }
        }
        break;
      case "propertyComparisonEquals":
        var compareValue = testArgs[this._property];
        if (this.hasOwnProperty("_comparisonField")) {
          compareValue = compareValue[this._comparisonField];
        }
        if (this.hasOwnProperty("_comparisonFunction")) {
          compareValue = compareValue[this._comparisonFunction](this._comparisonArgs);
        }
        if (compareValue !== this._comparison) {
          ret = this._fail;
        }
        if (ret instanceof (Condition)) {
          ret = ret.test(testArgs);
        }
        break;
      case "propertyComparisonLessThanEquals":
        var compareValue = testArgs[this._property];
        if (this.hasOwnProperty("_comparisonField")) {
          compareValue = compareValue[this._comparisonField];
        }
        if (this.hasOwnProperty("_comparisonFunction")) {
          compareValue = compareValue[this._comparisonFunction](this._comparisonArgs);
        }
        if (compareValue > this._comparison) {
          ret = this._fail;
        }
        if (ret instanceof (Condition)) {
          ret = ret.test(testArgs);
        }
        break;
    }
    return ret;
  }
}
/**
 * @class Die class.
 * @param {Number} rolls the number of rolls to make
 * @param {Number} faces the number of faces on the die
 */
class Die {
  constructor(rolls, faces) {
    this._rolls = rolls;
    this._faces = faces;
  }
  /**
   * Gets the number of faces on the Die.
   * @returns {Number} the number of faces
   */
  get faces() {
    return this._faces;
  }
  /**
   * Gets the number of times the Die is rolled.
   * @returns {Number} the number of rolls
   */
  get rolls() {
    return this._rolls;
  }
  /**
   * Rolls the Die.
   * @returns {Number} the result
   */
  roll() {
    let sum = 0;
    for (let i = this._rolls; i > 0; i--) {
      sum += Math.floor(Math.random() * Math.floor(this._faces)) + 1;
    }
    return sum;
  }  
}
/**
 * @class The Dice static class.
 */
 const Dice = {
  ONE_D2:    new Die(1,  2),
  TWO_D2:    new Die(2,  2),
  ONE_D3:    new Die(1,  3),
  TWO_D3:    new Die(2,  3),
  ONE_D4:    new Die(1,  4),
  TWO_D4:    new Die(2,  4),
  ONE_D6:    new Die(1,  6),
  TWO_D6:    new Die(2,  6),
  THREE_D6:  new Die(3,  6),
  FOUR_D6:   new Die(4,  6),
  ONE_D8:    new Die(1,  8),
  ONE_D10:   new Die(1, 10),
  TWO_D10:   new Die(2, 10),
  FIVE_D10:  new Die(5, 10),
  ONE_D11:   new Die(1, 11),
  ONE_D12:   new Die(1, 12),
  ONE_D20:   new Die(1, 20),
  ONE_D100:  new Die(1, 100),
  getRandomIndex: function(o) {
    if (typeof(o) === "undefined") {
      console.trace(o);
      throw "Dice.getRandomIndex requires an Object or Array";
    }
    if (o === null) {
    console.trace(o);
      throw "Dice.getRandomIndex requires an Object or Array";
    }
    var ret;
    if (Array.isArray(o)) {
      if (o.length === 0) {
        console.trace(o);
        throw "Dice.getRandomIndex cannot get a random index from an empty Array";
      }
      ret = Math.floor(Math.random() * Math.floor(o.length));
    } else if (typeof(o) === "object") {
      var keys = Object.keys(o);
      if (keys.length === 0) {
        console.trace(o);
        throw "Dice.getRandomIndex cannot get a random index from an empty Object";
      }
      ret = keys[Math.floor(Math.random() * Math.floor(keys.length))];
    } else {
      console.trace(o);
      throw "Dice.getRandomIndex requires an Object or Array";
    }
    return ret;
  },
  getRandomMember: function(o) {
    if (typeof(o) === "undefined") {
      console.trace(o);
      throw "Dice.getRandomMember requires an Object or Array";
    }
    if (o === null) {
      console.trace(o);
      throw "Dice.getRandomMember requires an Object or Array";
    }
    var ret;
    if (Array.isArray(o)) {
      if (o.length === 0) {
        console.trace(o);
        throw "Dice.getRandomMember cannot get a random index from an empty Array";
      }
      ret = o[Math.floor(Math.random() * Math.floor(o.length))]
    } else if (typeof(o) === "object") {
      var keys = Object.keys(o);
      if (keys.length === 0) {
        console.trace(o);
        throw "Dice.getRandomMember cannot get a random index from an empty Object";
      }
      ret = o[keys[Math.floor(Math.random() * Math.floor(keys.length))]];
    } else {
      console.trace(o);
      throw "Dice.getRandomMember requires an Object or Array";
    }
    return ret;
  },
  /**
   * Rolls an n-sided dice once, returning a result between 1 and n.
   * @param {Number} n the number of sides on the dice.
   * @returns {Number} a number between 1 and n
   */
  rollDie: function(n) { return Math.floor(Math.random() * Math.floor(n)) + 1; },
  /**
   * Rolls a D66 roll. This is a roll with values between 11 and 66, only featuring numbers found on the face of a 6-sided die (no digit greater than 6).
   * @returns a number between 11 and 66
   */
  rollD66: function() {
    var d66Roll = [this.rollDie(6), this.rollDie(6)];
    // sort the numbers so that least is in tens place. '12' is a valid roll, while '21' is not
    d66Roll.sort();
    return d66Roll[0] * 10 + d66Roll[1];
  }
}
// Object.freeze(Die);
// Object.freeze(Dice);

/**
 * @class The DirectionEntity class.
 * @param {Number} val the value
 * @param {String} title the title
 */
class DirectionEntity {
  constructor(val, title, dx, dy) {
    this._val = val;
    this._title = title;
    this._dx = dx;
    this._dy = dy;
  }
  /**
   * Gets the delta change in coordinates for this direction.
   * @returns {object} the change in x, y
   */
  get delta() {
    return { "x": this._dx, "y": this._dy };
  }
  /**
   * Gets the direction's title.
   * @returns {string} the title
   */
  get title() {
    return this._title;
  }
  /**
   * Gets the constant value the directon represents.
   * @returns {Number} the constant
   */
  get value() {
    return this._val;
  }
  /**
   * Determines whether or not two directions are equal.
   * @param {Object} otherLoc the other direction
   * @return {Boolean} true if the directions are equal; false otherwise
   */
  equals(otherLoc) {
    var b = false;
    if (otherLoc instanceof DirectionEntity) {
      b = this._val === otherLoc._val && this._title === otherLoc._title;
    }
    return b;
  }
}

/**
 * @class The Direction static class.
 */
const Direction = {
  NORTH: new DirectionEntity(1, "NORTH", 0, -1),
  SOUTH: new DirectionEntity(4, "SOUTH", 0, 1),
  EAST: new DirectionEntity(2, "EAST", 1, 0),
  WEST: new DirectionEntity(8, "WEST", -1, 0),
}

/**
 * @class The EquipmentItemModifier class.
 * @param {EquipmentItemModifier} copy the EquipmentItemModifier to copy
 */
class EquipmentItemModifier {
  constructor(copy) {
    /** @private the flag indicating whether the EquipmentItemModifier is a percentage modifier. */
    this._percent = false;
    /** @private the flag indicating whether the EquipmentItemModifier represents a specal effect (PARALYSIS, DRAIN LIFE, etc...). */
    this._special = 0;
    /** @private the EquipmentItemModifier value. */
    this._value = 0;
    if (typeof (copy) !== "undefined") {
      if (copy === null) {
        throw "EquipmentItemModifier() - copy parameter is null";
      }
      if (!(copy instanceof EquipmentItemModifier)) {
        throw "EquipmentItemModifier() - copy parameter must be an EquipmentItemModifier";
      }
      this.set(copy);
    }
  }
  /**
   * Gets the flag indicating whether the EquipmentItemModifier is a percentage modifier.
   * @returns {boolean} the flag
   */
  get percent() {
    return this._percent;
  }
  /**
   * Sets the flag indicating whether the EquipmentItemModifier is a percentage modifier.
   * @param {Boolean} value the new flag
   */
  set percent(value) {
    if (typeof(value) !== "boolean") {
      throw "EquipmentItemModifier.percent requires a boolean"
    }
    this._percent = value;
  }
  /**
   * Gets the flag indicating whether the EquipmentItemModifier represents a specal effect (PARALYSIS, DRAIN LIFE, etc...).
   * @returns {Number} the flag
   */
  get special() {
    return this._special;
  }
  /**
   * Sets the flag indicating whether the EquipmentItemModifier represents a specal effect (PARALYSIS, DRAIN LIFE, etc...).
   * @param {Number} value the new flag
   */
  set special(value) {
    if (isNaN(parseInt(value))) {
      throw "EquipmentItemModifier.special requires a valid number";
    }
    this._special = value;
  }
  /**
   * Gets the EquipmentItemModifier value.
   * @returns {Number} the value
   */
  get value() {
    return this._value;
  }
  /**
   * Sets the EquipmentItemModifier value.
   * @param {Number} value the new value
   */
  set value(value) {
    if (isNaN(parseInt(value))) {
      throw "EquipmentItemModifier.value requires a valid number";
    }
    this._value = value;
  }
  /**
   * Sets the modifier values.
   * @param {EquipmentItemModifier} clone the values being cloned
   */
  set(clone) {
    if (typeof (clone) === "undefined") {
      throw "EquipmentItemModifier.set() requires an EquipmentItemModifier to clone";
    }
    if (clone === null) {
      throw "EquipmentItemModifier.set() requires an EquipmentItemModifier to clone";
    }
    if (!(clone instanceof EquipmentItemModifier)) {
      throw "EquipmentItemModifier.set() - clone parameter must be an EquipmentItemModifier";
    }
    this.percent = clone.percent;
    this.special = clone.special;
    this.value = clone.value;
  }
}

/**
 * @class The FlagSet class.
 */
class FlagSet {
  constructor() {
    /** @private the flags that were set. */
    this._flags = 0;
  }
  /**
   * Adds a flag to the set.
   * @param {Number} flag the flag
   */
  add(flag) {
    if (isNaN(parseInt(flag))) {
      throw "FlagSet.addFlag() requires a valid number";
    }
    if ((Math.log(flag) / Math.log(2)) % 1 !== 0) {
      throw "FlagSet.addFlag() requires a power of 2";
    }
    this._flags |= flag;
  }
  /**
   * Adds a flag to the set.
   * @param {Number} flag the flag
   */
  addFlag(flag) {
    if (isNaN(parseInt(flag))) {
      throw "FlagSet.addFlag() requires a valid number";
    }
    if ((Math.log(flag) / Math.log(2)) % 1 !== 0) {
      throw "FlagSet.addFlag() requires a power of 2";
    }
    this._flags |= flag;
  }
  /** Clears all flags. */
  clear() { this._flags = 0; }
  /** Clears all flags. */
  clearFlags() { this._flags = 0; }
  /**
   * Determines if a specific flag was added to the set.
   * @param {Number} flag the flag
   * @return {Boolean} true if the flag was set; false otherwise
   */
  has(flag) {
    if (isNaN(parseInt(flag))) {
      throw "FlagSet.hasFlag() requires a valid number";
    }
    if ((Math.log(flag) / Math.log(2)) % 1 !== 0) {
      throw "FlagSet.hasFlag() requires a power of 2";
    }
    return (this._flags & flag) == flag;
  }
  /**
   * Determines if a specific flag was added to the set.
   * @param {Number} flag the flag
   * @return {Boolean} true if the flag was set; false otherwise
   */
  hasFlag(flag) {
    if (isNaN(parseInt(flag))) {
      throw "FlagSet.hasFlag() requires a valid number";
    }
    if ((Math.log(flag) / Math.log(2)) % 1 !== 0) {
      throw "FlagSet.hasFlag() requires a power of 2";
    }
    return (this._flags & flag) == flag;
  }
  /**
   * Removes a flag from the set.
   * @param {Number} flag the flag
   */
  remove(flag) {
    if (isNaN(parseInt(flag))) {
      throw "FlagSet.removeFlag() requires a valid number";
    }
    if ((Math.log(flag) / Math.log(2)) % 1 !== 0) {
      throw "FlagSet.removeFlag() requires a power of 2";
    }
    this._flags &= ~flag;
  }
  /**
   * Removes a flag from the set.
   * @param {Number} flag the flag
   */
  removeFlag(flag) {
    if (isNaN(parseInt(flag))) {
      throw "FlagSet.removeFlag() requires a valid number";
    }
    if ((Math.log(flag) / Math.log(2)) % 1 !== 0) {
      throw "FlagSet.removeFlag() requires a power of 2";
    }
    this._flags &= ~flag;
  }
}

/**
 * @class The InteractiveObject class.
 * @param {Number} id the object's id
 */
class InteractiveObject {
  constructor(id) {
    if (isNaN(parseInt(id))) {
      throw "InteractiveObject() requires a valid reference id";
    }
    if (typeof (this.BaseConstants) === "undefined") {
      throw "InteractiveObject() an instance of BaseConstants must be set on the InteractiveObject.prototype before instantiation";
    }
    if (typeof (this.FlagSetClass) === "undefined") {
      throw "InteractiveObject() a FlagSetClass must be set on the InteractiveObject.prototype before instantiation";
    }
    if (typeof (this.InventoryClass) === "undefined") {
      throw "InteractiveObject() a InventoryClass must be set on the InteractiveObject.prototype before instantiation";
    }
    if (typeof (this.ItemDataClass) === "undefined") {
      throw "InteractiveObject() an ItemDataClass must be set on the InteractiveObject.prototype before instantiation";
    }
    if (typeof (this.NpcDataClass) === "undefined") {
      throw "InteractiveObject() a NpcDataClass must be set on the InteractiveObject.prototype before instantiation";
    }
    if (typeof (this.PcDataClass) === "undefined") {
      throw "InteractiveObject() a PcDataClass must be set on the InteractiveObject.prototype before instantiation";
    }
    if (typeof (this.ScriptClass) === "undefined") {
      throw "InteractiveObject() a ScriptClass must be set on the InteractiveObject.prototype before instantiation";
    }
    /** @private the IO's data. */
    this._data;
    /** @private the IO's groups. */
    this._groups = {};
    /** @private the IO's inventory. */
    this._inventory;
    /** @private the IO's flags. */
    this._ioFlags = new this.FlagSetClass();
    /** @private the IO's localized name. */
    this._localizedName;
    this._mainevent;
    /** @private the IO's reference id. */
    this._refId = id;
    /** @private the IO's base script. */
    this._script = null;
    /** @private the IO's extended script. This script executes first, then the base. */
    this._overScript = null;
    /** @private the ids of all spells currently on the IO> */
    this._spellsOn = [];
  }
  /**
   * Gets the IO's data instance.
   * @returns {Object} the data instance
   */
  get data() {
    return this._data;
  }
  /**
   * Sets the IO's data instance.
   * @param {Object} value the data instance
   */
  set data(value) {
    if (typeof(value) === "undefined"
        || value === null) {
      throw "InteractiveObject.data - no data was provided";
    }
    if (value instanceof this.ItemDataClass
        && !this._ioFlags.has(this.BaseConstants.IO_ITEM)) {
      throw "InteractiveObject.data - cannot set Item data without setting ITEM flag first";
    }
    if (value instanceof this.NpcDataClass
        && !this._ioFlags.has(this.BaseConstants.IO_NPC)) {
      throw "InteractiveObject.data - cannot set NPC data without setting NPC flag first";
    }
    if (value instanceof this.PcDataClass
        && !this._ioFlags.has(this.BaseConstants.IO_PC)) {
      throw "InteractiveObject.data - cannot set PC data without setting PC flag first";
    }
    if (!(value instanceof this.ItemDataClass)
        && !(value instanceof this.NpcDataClass)
        && !(value instanceof this.PcDataClass)) {
      throw "InteractiveObject.data must be either an instance of IoItemData, IoNpcData, or IoPcData";
    }
    this._data = value;
    if (typeof(this._data.io) === "undefined"
        || this._data.io === null) {
      this._data.io = this;
    }
  }
  /**
   * Gets the IO's inventory instance.
   * @returns {Object} the inventory instance
   */
  get inventory() { return this._inventory; }
  /**
   * Sets the IO's inventory instance.
   * @param {Object} value the inventory instance
   */
  set inventory(value) {
    if (!(value instanceof this.InventoryClass)) {
      throw "InteractiveObject.inventory must be an instance of InventoryData";
    }
    this._inventory = value;
    if (typeof(this._inventory.io) === "undefined"
        || this._inventory.io === null) {
      this._inventory.io = this;
    }
  }
  /**
   * Gets the IO's io flags instance.
   * @returns {Object} the io flags instance
   */
  get ioFlags() { return this._ioFlags; }
  /**
   * Gets the IO's localized name.
   * @returns {String} the localized name
   */
  get localizedName() {  return this._localizedName; }
  /**
   * Sets the IO's localized name.
   * @param {String} value the new localized name
   */
  set localizedName(value) {
    if (typeof(value) !== "string"
        || value.length === 0) {
      console.trace(value)
      throw "InteractiveObject.localizedName must be a string of 1 or more characters";
    }
    this._localizedName = value;
  }
  /**
   * Gets the IO's main event.
   * @returns {String} the main event
   */
  get mainevent() { return this._mainevent; }
  /**
   * Sets the IO's main event.
   * @param {String} value the new main event
   */
  set mainevent(value) {
    if (value.toLowerCase() === "main") {
      this._mainevent= null;
    } else {
      this._mainevent = value;
    }
  }
  /**
   * Gets the IO's reference id number.
   * @returns {Number} the reference id number
   */
  get refId() { return this._refId; }
  /**
   * Gets the IO's  script instance.
   * @returns {Object} the script instance
   */
  get script() {  return this._script; }
  /**
   * Sets the IO's script instance.
   * @param {Object} value the script instance
   */
  set script(value) {
    if (typeof(value) === "undefined") {
      throw "No script was provided";
    }
    if (value === null) {
      throw "script parameter is null";
    }
    if (!(value instanceof this.ScriptClass)) {
      throw "script parameter must be an instance of IoScript";
    }
    this._script = value;
    if (this._script.io === null) {
      this._script.io = this;
    }
  }
  /**
   * Gets the IO's  overscript instance.
   * @returns {Object} the overscript instance
   */
  get overscript() {  return this._overScript; }
  /**
   * Sets the IO's overscript instance.
   * @param {Object} value the overscript instance
   */
  set overscript(value) {
    if (typeof(value) === "undefined"
        || value === null
        || !(value instanceof this.ScriptClass)) {
      throw "overscript parameter must be an instance of IoScript";
    }
    this._overScript = value;
    if (this._overScript.io === null) {
      this._overScript.io = this;
    }
  }
  /**
   * Adds an IO to a group.
   * @param {string} group the group
   */
  addToGroup(group) {
    if (typeof (group) !== "string"
      || group.length === 0) {
      throw "InteractiveObject.removeFromGroup() must be a string of 1 or more characters";
    }
    this._groups[group.toLowerCase()] = 0;
  }
  /**
   * Determines whether or not two IOs are equal.
   * @param {Object} otherIo the other IO
   * @return {Boolean} true if the IOs are equal; false otherwise
   */
  equals(otherIo) {
    var b = false;
    if (otherIo instanceof InteractiveObject) {
      b = this.refId === otherIo.refId;
      if (b) {
        b = this._ioFlags === otherIo._ioFlags;
      }
      if (b) {
        b = this.data === otherIo.data;
      }
    }
    return b;
  }
  /**
   * Determines if the IO has an overscript.
   * @return {Boolean} true if the IO has an overscript; false otherwise
   */
  hasOverscript() { return this._overScript instanceof this.ScriptClass; }
  /**
   * Determines whether or not two IOs are equal.
   * @param {Object} otherIo the other IO
   * @return {Boolean} true if the IOs are equal; false otherwise
   */
  isInGroup(group) {
    if (typeof (group) !== "string"
      || group.length === 0) {
      throw "InteractiveObject.isInGroup() must be a string of 1 or more characters";
    }
    return this._groups.hasOwnProperty(group.toLowerCase());
  }
  /** Removes an IO from all groups. */
  removeFromAllGroups() {
    for (var key in this._groups) {
      delete this._groups[key];
    }
  }
  /**
   * Removes all spells on the IO.
   */
  removeAllSpellsOn() { this._spellsOn.length = 0; }
  /**
   * Removes an IO from a group.
   * @param {string} group the group
   */
  removeFromGroup(group) {
    if (typeof (group) !== "string"
      || group.length === 0) {
      throw "InteractiveObject.removeFromGroup() must be a string of 1 or more characters";
    }
    delete this._groups[group.toLowerCase()];
  }
}

/**
 * @class Watchable
 */
class Watchable {
  constructor() {
    this._watchers = [];
  }
  /**
   * Adds a watcher.
   * @param {Watcher} watcher the watcher
   */
  addWatcher(watcher) {
    if (watcher !== null
        && typeof (watcher) !== "undefined") {
      let found = false;
      for (let i = this._watchers.length - 1; i >= 0; i--) {
        if (this._watchers[i] === watcher) {
          found = true;
          break;
        }
      }
      if (!found) {
        this._watchers.push(watcher);
      }
    }
  }
  /**
   * Notifies all watchers of a change to the Watchable.
   */
  notifyWatchers() {
    for (let i = this._watchers.length - 1; i >= 0; i--) {
      this._watchers[i].watchUpdated(this);
    }
  }
  /**
   * Removes a watcher from this Watchable.
   * @param {Watcher} watcher the watcher being removed
   */
  removeWatcher(watcher) {
    let index = -1;
    let watcherId = watcher;
    if (typeof (watcherId) !== "string" && !watcherId instanceof String) {
      watcherId = watcher.watcherId;
    }
    for (let i = this._watchers.length - 1; i >= 0; i--) {
      if (this._watchers[i].watcherId === watcherId) {
        index = i;
        break;
      }
    }
    if (index > -1) {
      this._watchers.splice(index, 1);
    }
  }
}

/**
 * @class The Watcher class.
 */
class Watcher {
  constructor() {
    /** @private the watcher's unique id. */
    this._watcherId = [Date.now().toString(36), Math.random().toString(36).substring(2)].join("");
  }
  /**
   * Gets the watcher's id.
   */
  get watcherId() { return this._watcherId; }
  /**
   * Reacts to a Watchable being updated.
   * @param {Watchable} data the Watchable data that was updated
   */
  watchUpdated(data) { }
}

export { Condition, Dice, Die, Direction, DirectionEntity, EquipmentItemModifier, FlagSet, InteractiveObject, Watchable, Watcher }