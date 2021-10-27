var $;
if (typeof(module) !== "undefined") {
  $ = require('jquery');
}
/**
 * @class Conditional class.
 */
function Condition(parameterObject) {
  if (typeof(parameterObject) === "undefined") {
    console.trace();
    throw "Condition constructor requires a parameter object"
  }
  if (!parameterObject.hasOwnProperty("type")) {
    console.trace();
    throw "Condition must have a defined type";
  }
  this._type = parameterObject.type;
  this._pass = parameterObject.pass;
  if (typeof(this._pass) !== "undefined"
      && this._pass.hasOwnProperty("type")
      && (this._pass.hasOwnProperty("pass") || this._pass.hasOwnProperty("fail") || this._pass.hasOwnProperty("conditionals") )) {
    this._pass = new Condition(this._pass);
  }
  this._fail = parameterObject.fail;
  if (typeof(this._fail) !== "undefined"
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
};
Condition.prototype.test = function(testArgs) {
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
          throw { "message": "FAILED CONDITIONAL MORE THAN 100 ATTEMPTS", "testArgs": testArgs, "conditionals": this._conditionals }
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
        ret = this._fail
      }
      if (ret instanceof(Condition)) {
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
        ret = this._fail
      }
      if (ret instanceof(Condition)) {
        ret = ret.test(testArgs);
      }
      break;
  }
  return ret;
}
/**
 * @class The DirectionEntity class.
 * @param {Number} val the value
 * @param {String} title the title
 */
function DirectionEntity(val, title, dx, dy) {
  this._val = val;
  this._title = title;
  this._dx = dx;
  this._dy = dy;
}
Object.defineProperty(DirectionEntity.prototype, 'delta', {
  /** Gets the Location's x-coordinate. */
  get() {
    return { "x": this._dx, "y": this._dy };
  }
});
/**
 * Determines whether or not two directions are equal.
 * @param {Object} otherLoc the other direction
 * @return {Boolean} true if the directions are equal; false otherwise
 */
DirectionEntity.prototype.equals = function(otherLoc) {
  var b = false;
  if (otherLoc instanceof DirectionEntity) {
    b = this._val === otherLoc._val && this._title === otherLoc._title;
  }
  return b;
}
Object.defineProperty(DirectionEntity.prototype, 'value', {
  /** Gets the Location's x-coordinate. */
  get() {
    return this._val;
  }
});
Object.defineProperty(DirectionEntity.prototype, 'title', {
  /** Gets the Location's x-coordinate. */
  get() {
    return this._title;
  }
});
/**
 * @class The Direction static class.
 */
var Direction = {
  NORTH: new DirectionEntity(1, "NORTH", 0, 1),
  SOUTH: new DirectionEntity(4, "SOUTH", 0, -1),
  EAST: new DirectionEntity(2, "EAST", 1, 0),
  WEST: new DirectionEntity(8, "WEST", -1, 0),
}

/**
 * @class The EquipmentItemModifier class.
 * @param {EquipmentItemModifier} copy the EquipmentItemModifier to copy
 */
function EquipmentItemModifier(copy) {
  /** @private the flag indicating whether the EquipmentItemModifier is a percentage modifier. */
  this._percent = false;
  /** @private the flag indicating whether the EquipmentItemModifier represents a specal effect (PARALYSIS, DRAIN LIFE, etc...). */
  this._special = 0;
  /** @private the EquipmentItemModifier value. */
  this._value = 0;
  if (typeof(copy) !== "undefined") {
    if (copy === null) {
      throw "EquipmentItemModifier() - copy parameter is null";
    }
    if (!(copy instanceof EquipmentItemModifier)) {
      throw "EquipmentItemModifier() - copy parameter must be an EquipmentItemModifier";
    }
    this.set(copy);
  }
}
Object.defineProperty(EquipmentItemModifier.prototype, 'percent', {
  get() {
    return this._percent;
  },
  set(value) {
    if (typeof(value) !== "boolean") {
      throw "EquipmentItemModifier.percent requires a boolean"
    }
    this._percent = value;
  }
});
Object.defineProperty(EquipmentItemModifier.prototype, 'special', {
  get() {
    return this._special;
  },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "EquipmentItemModifier.special requires a valid number";
    }
    this._special = value;
  }
});
Object.defineProperty(EquipmentItemModifier.prototype, 'value', {
  get() {
    return this._value;
  },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "EquipmentItemModifier.value requires a valid number";
    }
    this._value = value;
  }
});
/**
 * Sets the modifier values.
 * @param {EquipmentItemModifier} clone the values being cloned
 */
EquipmentItemModifier.prototype.set = function(clone) {
  if (typeof(clone) === "undefined") {
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

/**
 * @class The FlagSet class.
 */
function FlagSet() {
  /** @private the flags that were set. */
  this._flags = 0;
}
/**
 * Adds a flag to the set.
 * @param {Number} flag the flag
 */
FlagSet.prototype.add = function(flag) {
  if (isNaN(parseInt(flag))) {
    throw "FlagSet.addFlag() requires a valid number";
  }
  if ((Math.log(flag)/Math.log(2)) % 1 !== 0) {
    throw "FlagSet.addFlag() requires a power of 2";
  }
  this._flags |= flag;
}
/**
 * Adds a flag to the set.
 * @param {Number} flag the flag
 */
FlagSet.prototype.addFlag = function(flag) {
  if (isNaN(parseInt(flag))) {
    throw "FlagSet.addFlag() requires a valid number";
  }
  if ((Math.log(flag)/Math.log(2)) % 1 !== 0) {
    throw "FlagSet.addFlag() requires a power of 2";
  }
  this._flags |= flag;
}
/** Clears all flags. */
FlagSet.prototype.clear = function() { this._flags = 0; }
/** Clears all flags. */
FlagSet.prototype.clearFlags = function() { this._flags = 0; }
/**
 * Determines if a specific flag was added to the set.
 * @param {Number} flag the flag
 * @return {Boolean} true if the flag was set; false otherwise
 */
FlagSet.prototype.has = function(flag) {
  if (isNaN(parseInt(flag))) {
    throw "FlagSet.hasFlag() requires a valid number";
  }
  if ((Math.log(flag)/Math.log(2)) % 1 !== 0) {
    throw "FlagSet.hasFlag() requires a power of 2";
  }
  return (this._flags & flag) == flag;
}
/**
 * Determines if a specific flag was added to the set.
 * @param {Number} flag the flag
 * @return {Boolean} true if the flag was set; false otherwise
 */
FlagSet.prototype.hasFlag = function(flag) {
  if (isNaN(parseInt(flag))) {
    throw "FlagSet.hasFlag() requires a valid number";
  }
  if ((Math.log(flag)/Math.log(2)) % 1 !== 0) {
    throw "FlagSet.hasFlag() requires a power of 2";
  }
  return (this._flags & flag) == flag;
}
/**
 * Removes a flag from the set.
 * @param {Number} flag the flag
 */
FlagSet.prototype.remove = function(flag) {
  if (isNaN(parseInt(flag))) {
    throw "FlagSet.removeFlag() requires a valid number";
  }
  if ((Math.log(flag)/Math.log(2)) % 1 !== 0) {
    throw "FlagSet.removeFlag() requires a power of 2";
  }
  this._flags &= ~flag;
}
/**
 * Removes a flag from the set.
 * @param {Number} flag the flag
 */
FlagSet.prototype.removeFlag = function(flag) {
  if (isNaN(parseInt(flag))) {
    throw "FlagSet.removeFlag() requires a valid number";
  }
  if ((Math.log(flag)/Math.log(2)) % 1 !== 0) {
    throw "FlagSet.removeFlag() requires a power of 2";
  }
  this._flags &= ~flag;
}


/**
 * @class The InteractiveObject class.
 * @param {Number} id the object's id
 */
function InteractiveObject(id) {
  if (isNaN(parseInt(id))) {
    throw "InteractiveObject() requires a valid reference id"
  }
  if (typeof(this.BaseConstants) === "undefined") {
    throw "InteractiveObject() an instance of BaseConstants must be set on the InteractiveObject.prototype before instantiation"
  }
  if (typeof(this.FlagSetClass) === "undefined") {
    throw "InteractiveObject() a FlagSetClass must be set on the InteractiveObject.prototype before instantiation"
  }
  if (typeof(this.InventoryClass) === "undefined") {
    throw "InteractiveObject() a InventoryClass must be set on the InteractiveObject.prototype before instantiation"
  }
  if (typeof(this.ItemDataClass) === "undefined") {
    throw "InteractiveObject() an ItemDataClass must be set on the InteractiveObject.prototype before instantiation"
  }
  if (typeof(this.NpcDataClass) === "undefined") {
    throw "InteractiveObject() a NpcDataClass must be set on the InteractiveObject.prototype before instantiation"
  }
  if (typeof(this.PcDataClass) === "undefined") {
    throw "InteractiveObject() a PcDataClass must be set on the InteractiveObject.prototype before instantiation"
  }
  if (typeof(this.ScriptClass) === "undefined") {
    throw "InteractiveObject() a ScriptClass must be set on the InteractiveObject.prototype before instantiation"
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
/** Getter/setter for the IO's data instance. */
Object.defineProperty(InteractiveObject.prototype, 'data', {
  get() { return this._data; },
  set(value) {
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
});
/** Getter/setter for the IO's inventory instance. */
Object.defineProperty(InteractiveObject.prototype, 'inventory', {
  get() { return this._inventory; },
  set(value) {
    if (!(value instanceof this.InventoryClass)) {
      throw "InteractiveObject.inventory must be an instance of InventoryData";
    }
    this._inventory = value;
    if (typeof(this._inventory.io) === "undefined"
        || this._inventory.io === null) {
      this._inventory.io = this;
    }
  }
});
/** Gets the IO's IO flags. */
Object.defineProperty(InteractiveObject.prototype, 'ioFlags', { get() { return this._ioFlags; } });
/** Getter/setter for the IO's localized name. */
Object.defineProperty(InteractiveObject.prototype, 'localizedName', {
  get() {  return this._localizedName; },
  set(value) {
    if (typeof(value) !== "string"
        || value.length === 0) {
      console.trace(value)
      throw "InteractiveObject.localizedName must be a string of 1 or more characters";
    }
    this._localizedName = value;
  }
});
/** Gets the IO's mainevent property. */
Object.defineProperty(InteractiveObject.prototype, 'mainevent', {
  get() { return this._mainevent; },
  set(value) {
    if (value.toLowerCase() === "main") {
      this._mainevent= null;
    } else {
      this._mainevent = value;
    }
  }
});
/** Gets the IO's reference id property. */
Object.defineProperty(InteractiveObject.prototype, 'refId', { get() { return this._refId; } });
Object.defineProperty(InteractiveObject.prototype, 'script', {
  /** Gets the IO's script property. */
  get() {  return this._script; },
  set(value) {
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
});
Object.defineProperty(InteractiveObject.prototype, 'overscript', {
  /** Gets the IO's script property. */
  get() {  return this._overScript; },
  set(value) {
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
});
/**
 * Adds an IO to a group.
 * @param {string} group the group
 */
InteractiveObject.prototype.addToGroup = function(group) {
  if (typeof(group) !== "string"
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
InteractiveObject.prototype.equals = function(otherIo) {
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
InteractiveObject.prototype.hasOverscript = function() { return this._overScript instanceof this.ScriptClass; }
/**
 * Determines whether or not two IOs are equal.
 * @param {Object} otherIo the other IO
 * @return {Boolean} true if the IOs are equal; false otherwise
 */
InteractiveObject.prototype.isInGroup = function(group) {
  if (typeof(group) !== "string"
      || group.length === 0) {
    throw "InteractiveObject.isInGroup() must be a string of 1 or more characters";
  }
  return this._groups.hasOwnProperty(group.toLowerCase());
}
/** Removes an IO from all groups. */
InteractiveObject.prototype.removeFromAllGroups = function() {
  for (var key in this._groups) {
    delete this._groups[key];
  }
}
/**
 * Removes all spells on the IO.
 */
InteractiveObject.prototype.removeAllSpellsOn = function() { this._spellsOn.length = 0; }
/**
 * Removes an IO from a group.
 * @param {string} group the group
 */
InteractiveObject.prototype.removeFromGroup = function(group) {
  if (typeof(group) !== "string"
      || group.length === 0) {
    throw "InteractiveObject.removeFromGroup() must be a string of 1 or more characters";
  }
  delete this._groups[group.toLowerCase()];
}

/**
 * @class The InventoryData abstract class.
 */
 function InventoryData() {
  if (typeof(this.BaseConstants) === "undefined") {
    throw "IoNpcData() an instance of BaseConstants must be set on the IoNpcData.prototype before instantiation"
  }
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "InventoryData() an InteractiveInstance must be set on the InventoryData.prototype before instantiation"
  }
  if (typeof(this.IoClass) === "undefined") {
    throw "InventoryData() an IoClass must be set on the InventoryData.prototype before instantiation"
  }
  if (typeof(this.ScriptInstance) === "undefined") {
    throw "InventoryData() a ScriptInstance must be set on the InventoryData.prototype before instantiation"
  }
  /** @private the parent IO. */
  this._io;
  /** @private the inventory slots. */
  this._slots = [];
  // make this an abstract class
  if (this.constructor === InventoryData) {
    throw "You cannot create an instance of InventoryData Class - you must extend the prototype";
  }
  this.init();
}
/** Getter/Setter for the InventoryData's IO property. */
Object.defineProperty(InventoryData.prototype, 'io', {
  get() { return this._io; },
  set(value) {
    if (typeof(value) === "undefined"
        || value === null
        || !(value instanceof this.IoClass)) {
      throw "InventoryData.io - parameter must be an instance of InteractiveObject";
    }
    this._io = value;
    if (typeof(this._io.inventory) === "undefined"
        || this._io.inventory === null) {
      this._io.inventory = this;
    }
  }
});
/**
 * Tries to put an object in an IO's inventory
 * @param {InteractiveObject} io the object
 * @param {ScriptAction} scriptAction the script action object
 */
InventoryData.prototype.canBePutInInventory = function(io) {
  if (!this.InteractiveInstance.isValidIo(io)) {
    throw "InventoryData.canBePutInInventory() requires a valid IO";
  }
  var can = false;
  // try to stack
  var stacked = false;
  for (var i = this._slots.length - 1; i >= 0; i--) {
    var ioInSlot = this._slots[i].io;
    if (typeof(ioInSlot) !== "undefined"
        && ioInSlot !== null
        && ioInSlot.data.stackSize > 1
        && this.InteractiveInstance.isSameObject(io, ioInSlot)) {
      if (ioInSlot.data.count < ioInSlot.data.stackSize) {
        can = true;
        ioInSlot.data.count += io.data.count;
        if (ioInSlot.data.count > ioInSlot.data.stackSize) {
          io.data.count = ioInSlot.data.count - ioInSlot.data.stackSize;
          ioInSlot.data.count = ioInSlot.data.stackSize;
        } else {
          io.data.count = 0;
          stacked = true;
        }
        if (io.data.count === 0) {
          this.InteractiveInstance.releaseIo(io);
        }
      }
    }
  }
  if (!stacked) {
    for (var i = this._slots.length - 1; i >= 0; i--) {
      var ioInSlot = this._slots[i].io;
      if (typeof(ioInSlot) === "undefined"
          || ioInSlot === null) {
        this._slots[i].io = io;
        this._slots[i].io.show = true;
        this.declareInInventory(io);
        can = true;
        break;
      }
    }
  }
  return can;
}
/** Cleans the inventory. */
InventoryData.prototype.cleanInventory = function() {
  for (var i = this._slots.length - 1; i >= 0; i--) {
    this._slots[i].io = null;
    this._slots[i].show = true;
  }
}
/**
 * Declares that an object is in an IO's inventory, sending scripted messages
 * to the possessor and the item.
 * @param {InteractiveObject} io the object
 */
InventoryData.prototype.declareInInventory = function(io) {
  if (!this.InteractiveInstance.isValidIo(io)) {
    throw "InventoryData.declareInInventory() requires a valid IO";
  }
  // send message to Inventory Holder that they are recieving the item
  this.ScriptInstance.eventSender = io;
  this.ScriptInstance.sendIOScriptEvent({
    "io": this._io,
    "eventId": this.BaseConstants.SM_INVENTORYIN
  });
  // send message to the item they are now in Inventory Holder's possession
  this.ScriptInstance.eventSender = this._io;
  this.ScriptInstance.sendIOScriptEvent({
    "io": io,
    "eventId": this.BaseConstants.SM_INVENTORYIN
  });
  this.ScriptInstance.eventSender = null;
}
/**
 * Initializes the inventory, allocating space for enough slots.
 */
InventoryData.prototype.init = function() {
  throw "InventoryData is abstract - you must create a definition for init() on the extending class's prototype";
}
/**
 * Determines if an object is in inventory.
 * @param {InteractiveObject} io the object
 * @return {boolean} true if the item is in the inventory; false otherwise
 */
InventoryData.prototype.isInInventory = function(io) {
  if (!this.InteractiveInstance.isValidIo(io)) {
    throw "InventoryData.isInInventory() requires a valid IO";
  }
  var is = false;
  for (var i = this._slots.length - 1; i >= 0; i--) {
    var ioInSlot = this._slots[i].io;
    if (typeof(ioInSlot) !== "undefined"
        && ioInSlot !== null
        && io.equals(ioInSlot)) {
      is = true;
      break;
    }
  }
  return is;
}
/**
 * Tries to remove an object from an IO's inventory, ignoring any count size.
 * @param {InteractiveObject} io the object
 */
InventoryData.prototype.removeFromInventory = function(io) {
  if (!this.InteractiveInstance.isValidIo(io)) {
    throw "InventoryData.removeFromInventory() requires a valid IO";
  }
  var removed = false;
  // try to stack
  var stacked = false;
  for (var i = this._slots.length - 1; i >= 0; i--) {
    var ioInSlot = this._slots[i].io;
    if (typeof(ioInSlot) !== "undefined"
        && ioInSlot !== null
        && io.equals(ioInSlot)) {
      this._slots[i].io = null;
      this._slots[i].show = true;
      removed = true;
      break;
    }
  }
  return removed;
}
/**
 * Tries to replace an object from an IO's inventory, ignoring any count size.
 * @param {InteractiveObject} io the object
 */
InventoryData.prototype.replaceInInventory = function(io, replacedWith) {
  if (!this.InteractiveInstance.isValidIo(io)) {
    throw "InventoryData.replaceInInventory() requires a valid IO to be replaced";
  }
  if (!this.InteractiveInstance.isValidIo(replacedWith)) {
    throw "InventoryData.replaceInInventory() requires an IO to replace with";
  }
  for (var i = this._slots.length - 1; i >= 0; i--) {
    var ioInSlot = this._slots[i].io;
    if (typeof(ioInSlot) !== "undefined"
        && ioInSlot !== null
        && this.InteractiveInstance.isSameObject(io, ioInSlot)) {
      this._slots[i].io = replacedWith;
      this._slots[i].show = true;
      break;
    }
  }
}

/**
 * @class The InventorySlot class.
 */
 function InventorySlot() {
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "InventorySlot() a InteractiveInstance must be set on the IoPcData.prototype before instantiation"
  }
  /** @private the IO in the slot. */
  this._io;
  /** @private flag indicating whether the slot is shown. */
  this._show = true;
}
/** Getter/Setter for the IO property. */
Object.defineProperty(InventorySlot.prototype, 'io', {
  get() {  return this._io; },
  set(value) {
    if (value !== null
        && !this.InteractiveInstance.isValidIo(value)) {
      throw "InventorySlot.io must be either null or a valid IO";
    }
    this._io = value;
  }
});
/** Getter/Setter for the show property. */
Object.defineProperty(InventorySlot.prototype, 'show', {
  get() {  return this._show; },
  set(value) {
    if (typeof(value) !== "boolean") {
      throw "InventorySlot.show requires a boolean"
    }
    this._show = value;
  }
});

/**
 * @class The IoBehaviourData class.
 */
function IoBehaviourData() {
  if (typeof(this.BaseConstants) === "undefined") {
    throw "IoBehaviourData() an instance of BaseConstants must be set on the IoBehaviourData.prototype before instantiation"
  }
  if (typeof(this.FlagSetClass) === "undefined") {
    throw "IoBehaviourData() a FlagSetClass must be set on the IoBehaviourData.prototype before instantiation"
  }
  /** @private the parameter applied to a behavior. */
  this._behaviourParam = 0;
  /** the parameter applied to a behavior. */
  this._behaviour = new this.FlagSetClass();
  /** flag indicating whether the behavior exists. */
  this._exists = false;
  /** the movement mode. */
  this._moveMode = this.BaseConstants.WALKMODE;
  /** tactics for the behavior; e.g., 0=none, 1=side, 2=side + back, etc... */
  this._tactics = 0;
  /** the behavior target. */
  this._target = -1;
}
Object.defineProperty(IoBehaviourData.prototype, 'behaviourParam', {
  /** Gets the Location's x-coordinate. */
  get() { return this._behaviourParam; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseFloat(value))) {
      throw "IoBehaviourData.behaviourParam requires a floating-point value";
    }
    this._behaviourParam = value;
  }
});
Object.defineProperty(IoBehaviourData.prototype, 'behaviour', {
  get() { return this._behaviour; }
});
Object.defineProperty(IoBehaviourData.prototype, 'exists', {
  /** Gets the Location's x-coordinate. */
  get() {
    return this._exists;
  },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (typeof(value) !== "boolean") {
      throw "IoBehaviourData.exists requires a boolean"
    }
    this._exists = value;
  }
});
Object.defineProperty(IoBehaviourData.prototype, 'moveMode', {
  /** Gets the Location's x-coordinate. */
  get() { return this._moveMode; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoBehaviourData.moveMode requires an integer value"
    }
    if (value < this.BaseConstants.WALKMODE || value > this.BaseConstants.SNEAKMODE) {
      throw "IoBehaviourData.moveMode - '" + value + "' is not recognized"
    }
    this._moveMode = value;
  }
});
Object.defineProperty(IoBehaviourData.prototype, 'tactics', {
  /** Gets the Location's x-coordinate. */
  get() { return this._tactics; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoBehaviourData.tactics requires an integer value"
    }
    this._tactics = value;
  }
});
Object.defineProperty(IoBehaviourData.prototype, 'target', {
  /** Gets the Location's x-coordinate. */
  get() { return this._target; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoBehaviourData.target requires an integer value"
    }
    if (value < 0) {
      throw "IoBehaviourData.target - '" + value + "' is not a valid IO target"
    }
    this._target = value;
  }
});
/**
 * Determines whether the behaviour matches a specific behaviour flag.
 * @param {Number} behaviour the behaviour flag
 * @return {Boolean} true if the behaviour matches the flag; false otherwise
 */
IoBehaviourData.prototype.is = function(behaviour) { return this.behaviour.hasFlag(behaviour); }


/**
 * @class The IOEquipItem class.
 */
function IoEquipItem() {
  if (typeof(this.EquipModifierClass) === "undefined") {
    throw "IoBehaviourData() an EquipModifierClass must be set on the IoBehaviourData.prototype before instantiation"
  }
  /** @private the list of equipment modifiers. */
  this._elements = [];
}
/** Frees all resources. */
IoEquipItem.prototype.free = function() {
  for (var i = this._elements.length - 1; i >= 0; i--) {
    this._elements[i] = null;
  }
}
/**
 * Gets the eqipment modifier for a specific element..
 * @param {Number} element the element
 * @return {EquipmentItemModifier} the element modifier object
 */
IoEquipItem.prototype.getElementModifier = function(element) {
  if (isNaN(parseInt(element))) {
    throw "IOEquipItem.getElementModifier() requires a valid element";
  }
  if (element >= this._elements.length) {
    for (var i = this._elements.length, li = element; i <= li; i++) {
      this._elements.push(new this.EquipModifierClass());
    }
  }
  return this._elements[element];
}

/**
 * @class The IoItemData abstract class.
 */
 function IoItemData() {
  if (this.constructor === IoItemData) {
    throw "You cannot create an instance of IoItemData Class - you must extend the prototype.  Check ../tests/samples for an example";
  }
  if (typeof(this.EquipModifierClass) === "undefined") {
    throw "IoItemData() an EquipModifierClass must be set on the IoItemData.prototype before instantiation"
  }
  if (typeof(this.FlagSetClass) === "undefined") {
    throw "IoItemData() a FlagSetClass must be set on the IoItemData.prototype before instantiation"
  }
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "IoNpcData() a InteractiveInstance must be set on the IoPcData.prototype before instantiation"
  }
  /** @private the current number. */
  this._count = 1;
  /** @private the list of equipment modifiers. */
  this._elements = [];
  /** @private the parent IO. */
  this._io = null;
  this._food_value = 0;
  this._lightValue = -1;
  /** @private the max number cumulable. */
  this._maxcount = 1;
  /** @private the item's price. */
  this._price = 1;
  /** @private the most of the item that can be stacked in one slot */
  this._stacksize = 1;
  this._stealvalue = -1;
  /** @private the item's type flags. */
  this._typeFlags = new this.FlagSetClass();

  this.init();
}
/** Getter/Setter for the item's count. */
Object.defineProperty(IoItemData.prototype, 'count', {
  get() { return this._count; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoItemData.count requires an integer value"
    }
    if (value < 0) {
      throw "IoItemData.count cannot be less than 0"
    }
    this._count = value;
  }
});
/** Getter/Setter for the item's foodValue. */
Object.defineProperty(IoItemData.prototype, 'foodValue', {
  get() { return this._food_value; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoItemData.foodValue requires an integer value"
    }
    if (value < 0) {
      throw "IoItemData.foodValue cannot be less than 0"
    }
    this._food_value = value;
  }
});
/** Getter/Setter for the IoNpcData's IO property. */
Object.defineProperty(IoItemData.prototype, 'io', {
  get() { return this._io; },
  set(value) {
    if (!this.InteractiveInstance.isValidIo(value)) {
      throw "IoItemData.io parameter must be an instance of InteractiveObject";
    }
    this._io = value;
    if (typeof(this._io.data) == "undefined"
        || this._io.data === null) {
      this._io.data = this;
    }
  }
});
/** Getter/Setter for the item's lightValue. */
Object.defineProperty(IoItemData.prototype, 'lightValue', {
  get() { return this._lightValue; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoItemData.lightValue requires an integer value"
    }
    this._lightValue = value;
  }
});
/** Getter/Setter for the item's maxcount. */
Object.defineProperty(IoItemData.prototype, 'maxcount', {
  get() { return this._maxcount; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoItemData.maxcount requires an integer value"
    }
    if (value < 0) {
      throw "IoItemData.maxcount cannot be less than 0"
    }
    this._maxcount = value;
  }
});
/** Getter/Setter for the item's price. */
Object.defineProperty(IoItemData.prototype, 'price', {
  get() { return this._price; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoItemData.price requires an integer value"
    }
    if (value < 0) {
      throw "IoItemData.price cannot be less than 0"
    }
    this._price = value;
  }
});
/** Getter/Setter for the item's stackSize. */
Object.defineProperty(IoItemData.prototype, 'stackSize', {
  get() { return this._stacksize; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoItemData.stackSize requires an integer value"
    }
    if (value < 0) {
      throw "IoItemData.stackSize cannot be less than 0"
    }
    this._stacksize = value;
  }
});
/** Getter/Setter for the item's stealValue. */
Object.defineProperty(IoItemData.prototype, 'stealValue', {
  get() { return this._stealvalue; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoItemData.stealValue requires an integer value"
    }
    this._stealvalue = value;
  }
});
/** Gets the item's type flags. */
Object.defineProperty(IoItemData.prototype, 'typeFlags', { get() { return this._typeFlags; } });
/** Frees all element modifier resources. */
IoItemData.prototype.free = function() {
  for (var i = this._elements.length - 1; i >= 0; i--) {
    this._elements[i] = null;
  }
}
/**
 * Gets the element modifier for a specific element..
 * @param {Number} element the element
 * @return {EquipmentItemModifier} the element modifier object
 */
IoItemData.prototype.getElementModifier = function(element) {
  if (isNaN(parseInt(element))) {
    throw "IOEquipItem.getElementModifier() requires a valid element";
  }
  if (element >= this._elements.length) {
    for (var i = this._elements.length, li = element; i <= li; i++) {
      this._elements.push(new this.EquipModifierClass());
    }
  }
  return this._elements[element];
}
/** Initializes all elements. */
IoItemData.prototype.init = function() {
  throw "IoItemData.init() must be implemented in an extended class. Check ../tests/samples for an example";
}

/**
 * @class The IoNpcData abstract class.
 */
function IoNpcData() {
  if (typeof(this.BaseConstants) === "undefined") {
    throw "IoNpcData() an instance of BaseConstants must be set on the IoNpcData.prototype before instantiation"
  }
  if (typeof(this.BehaviourClass) === "undefined") {
    throw "IoNpcData() a BehaviourClass must be set on the IoNpcData.prototype before instantiation"
  }
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "IoNpcData() a InteractiveInstance must be set on the IoPcData.prototype before instantiation"
  }
  if (typeof(this.ScriptInstance) === "undefined") {
    throw "IoNpcData() a ScriptInstance must be set on the IoNpcData.prototype before instantiation"
  }
  /** @private the current behaviour. */
  this._behaviour = new this.BehaviourClass();
  /** @private the parent IO. */
  this._io = null;
  /** @private the movement mode. */
  this._moveMode = this.BaseConstants.WALKMODE;
  /** @private the NPC's stack of behaviours. */
  this._behaviours = [new this.BehaviourClass(), new this.BehaviourClass(), new this.BehaviourClass(), new this.BehaviourClass(), new this.BehaviourClass()];

  if (this.constructor === IoNpcData) {
    throw "You cannot create an instance of IoNpcData Class - you must extend the prototype";
  }
}
/** Getter/Setter for the IoNpcData's IO property. */
Object.defineProperty(IoNpcData.prototype, 'io', {
  get() { return this._io; },
  set(value) {
    if (!this.InteractiveInstance.isValidIo(value)) {
      throw "IoNpcData.io parameter must be an instance of InteractiveObject";
    }
    this._io = value;
    if (typeof(this._io.data) == "undefined"
        || this._io.data === null) {
      this._io.data = this;
    }
  }
});
/** Getter/Setter for the IoNpcData's IO property. */
Object.defineProperty(IoNpcData.prototype, 'life', {
  get() { throw "IoNpcData.life.get() called from abstract class. check ../tests/samples for an example"; },
  set(value) { throw "IoNpcData.life.set() called from abstract class. check ../tests/samples for an example"; }
});
Object.defineProperty(IoNpcData.prototype, 'maxlife', {
  get() { throw "IoNpcData.maxlife.get() called from abstract class. check ../tests/samples for an example"; },
  set(value) { throw "IoNpcData.maxlife.set() called from abstract class. check ../tests/samples for an example"; }
});
Object.defineProperty(IoNpcData.prototype, 'moveMode', {
  /** Gets the Location's x-coordinate. */
  get() { return this._moveMode; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoNpcData.moveMode requires an integer value"
    }
    if (value < this.BaseConstants.WALKMODE || value > this.BaseConstants.SNEAKMODE) {
      throw "IoNpcData.moveMode - '" + value + "' is not recognized"
    }
    this._moveMode = value;
  }
});
/**
* Changes an NPC behaviour.
* @param {IoBehaviourData} behaviour the behaviour
*/
IoNpcData.prototype.changeBehaviour = function(behaviour) {
  if (!(behaviour instanceof this.BehaviourClass)) {
    throw "IoNpcData.changeBehaviour() requires a valid behaviour";
  }
  // check to see if current behaviour is fighting
  if (this._behaviour.is(this.BaseConstants.BEHAVIOUR_FIGHT)
      && !behaviour.is(this.BaseConstants.BEHAVIOUR_FIGHT))
  {
    // changing from fighting to somethine else. STOP ALL FIGHT ANIMATIONS
    /*
    ANIM_USE * ause1 = &io->animlayer[1];
    AcquireLastAnim(io);
    FinishAnim(io, ause1->cur_anim);
    ause1->cur_anim = NULL;
    */
  }

  if (this._behaviour.is(this.BaseConstants.BEHAVIOUR_NONE)
      && !behaviour.is(this.BaseConstants.BEHAVIOUR_NONE)) {
    // stop all ANIMATIONS
    /*
    ANIM_USE * ause0 = &io->animlayer[0];
    AcquireLastAnim(io);
    FinishAnim(io, ause0->cur_anim);
    ause0->cur_anim = NULL;
    ANIM_Set(ause0, io->anims[ANIM_DEFAULT]);
    ause0->flags &= ~EA_LOOP;

    ANIM_USE * ause1 = &io->animlayer[1];
    AcquireLastAnim(io);
    FinishAnim(io, ause1->cur_anim);
    ause1->cur_anim = NULL;
    ause1->flags &= ~EA_LOOP;

    ANIM_USE * ause2 = &io->animlayer[2];
    AcquireLastAnim(io);
    FinishAnim(io, ause2->cur_anim);
    ause2->cur_anim = NULL;
    ause2->flags &= ~EA_LOOP;
    */
  }

  if (behaviour.is(this.BaseConstants.BEHAVIOUR_FRIENDLY)) {
    /*
    ANIM_USE * ause0 = &io->animlayer[0];
    AcquireLastAnim(io);
    FinishAnim(io, ause0->cur_anim);
    ANIM_Set(ause0, io->anims[ANIM_DEFAULT]);
    ause0->altidx_cur = 0;
    */
  }
  this._behaviour = behaviour;
}
IoNpcData.prototype.isDead = function() {
  var dead = false;
  if (this.life <= 0) {
    dead = true;
  }
  if (!dead) {
    if (this.io.mainevent === "DEAD") {
      dead = true;
    }
  }
  return dead;
}
IoNpcData.prototype.resetBehaviour = function() {
  this._behaviour.behaviour.clear();
  this._behaviour.behaviour.add(this.BaseConstants.BEHAVIOUR_NONE);

  for (var i = this._behaviours.length - 1; i >= 0; i--) {
    this._behaviours[i].exist = false;
  }
}
IoNpcData.prototype.revive = function(params) {
  this._io.script.mainevent = "MAIN";
  this.life = this.maxlife;
  this.ScriptInstance.resetObject(this._io);

  // TODO - clean the texture, removing all gore and cuts
}
/** Stacks an existing NPC behaviour. */
IoNpcData.prototype.stackBehaviour = function() {
  for (var i = this._behaviours.length - 1; i >= 0; i--) {
    if (!this._behaviours[i].exist) {
      var behaviour = this._behaviours[i];
      behaviour = this._behaviour;
      behaviour.moveMode = this._moveMode;
      behaviour.exist = true;
    }
  }
}
/** Unstacks an existing NPC behaviour. */
IoNpcData.prototype.unstackBehaviour = function() {
  for (var i = this._behaviours.length - 1; i >= 0; i--) {
    if (this._behaviours[i].exist) {
      this._behaviour = this._behaviours[i];
    }
  }
}

/**
 * @class The IoPcData abstract class.
 */
 function IoPcData() {
  if (this.constructor === IoPcData) {
    throw "You cannot create an instance of IoPcData Class - you must extend the prototype";
  }
  if (typeof(this.AttributeClass) === "undefined") {
    throw "IoPcData() an AttributeClass must be set on the IoPcData.prototype before instantiation"
  }
  if (typeof(this.BaseConstants) === "undefined") {
    throw "IoPcData() an instance of BaseConstants must be set on the IoPcData.prototype before instantiation"
  }
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "IoNpcData() a InteractiveInstance must be set on the IoPcData.prototype before instantiation"
  }
  if (typeof(this.ScriptInstance) === "undefined") {
    throw "IoPcData() a ScriptInstance must be set on the IoPcData.prototype before instantiation"
  }
  /** @private the list of attributes the player has assigned. */
  this._attributes = {};
  /** @private the list of items the player has equipped. */
  this._equipped = [];
  /** @private the player's gender. */
  this._gender = 0;
  /** @private the player's gold. */
  this._gold = 0;
  /** @private the parent IO. */
  this._io = null;
  /** @private the player's level. */
  this._level = 0;
  /** @private the player's xp. */
  this._xp = 0;

  this._init();
}
/** Getter/Setter for the IoPcData's gold property. */
Object.defineProperty(IoPcData.prototype, 'gold', {
  get() { return this._gold; },
  set(value) {
    if (isNaN(parseFloat(value))) {
      throw "IoPcData.gold parameter must be a float";
    }
    this._gold = value;
    if (this._gold < 0) {
      this._gold = 0;
    }
    // TODO - check for level up
  }
});
/** Getter/Setter for the IoPcData's IO property. */
Object.defineProperty(IoPcData.prototype, 'io', {
  get() { return this._io; },
  set(value) {
    if (!this.InteractiveInstance.isValidIo(value)) {
      throw "IoPcData.io parameter must be an instance of InteractiveObject";
    }
    this._io = value;
    if (typeof(this._io.data) == "undefined"
        || this._io.data === null) {
      this._io.data = this;
    }
  }
});
Object.defineProperty(IoPcData.prototype, 'mana', {
  get() { throw "IoPcData.mana.get() called from abstract class"; },
  set(value) { throw "IoPcData.mana.set() called from abstract class"; }
});
Object.defineProperty(IoPcData.prototype, 'maxmana', {
  get() { throw "IoPcData.maxmana.get() called from abstract class"; },
  set(value) { throw "IoPcData.maxmana.set() called from abstract class"; }
});
Object.defineProperty(IoPcData.prototype, 'life', {
  get() { throw "IoPcData.life.get() called from abstract class"; },
  set(value) { throw "IoPcData.life.set() called from abstract class"; }
});
Object.defineProperty(IoPcData.prototype, 'maxlife', {
  get() { throw "IoPcData.maxlife.get() called from abstract class"; },
  set(value) { throw "IoPcData.maxlife.set() called from abstract class"; }
});
/** Getter for the IoPcData's attributes property. */
Object.defineProperty(IoPcData.prototype, 'attributes', {
  get() { return this._attributes; }
});
/** Getter/Setter for the IoPcData's level property. */
Object.defineProperty(IoPcData.prototype, 'level', {
  get() { return this._level; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoPcData.level parameter must be an integer";
    }
    this._level = value;
    if (this._level < 0) {
      this._level = 0;
    }
    // TODO - check for level up
  }
});
/** Getter/Setter for the IoPcData's xp property. */
Object.defineProperty(IoPcData.prototype, 'xp', {
  get() { return this._xp; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoPcData.xp parameter must be an integer";
    }
    this._xp = value;
    if (this._xp < 0) {
      this._xp = 0;
    }
    // TODO - check for level up
  }
});
/**
 * Applies modifiers to the character's attributes and skills based on the game rules.
 */
IoPcData.prototype._applyRulesModifiers = function() {
  throw "IoPcData._applyRulesModifiers() called from base prototype. Must override!"
}
/**
 * Applies percent modifiers to the character's attributes and skills based on the game rules.
 */
IoPcData.prototype._applyRulesPercentModifiers = function() {
  throw "IoPcData._applyRulesPercentModifiers() called from base prototype. Must override!"
}
/**
 * Clears all element modifiers.
 */
IoPcData.prototype._clearElementModifiers = function() {
  for (var attr in this._attributes) {
    this._attributes[attr].clearModifiers();
  }
}
IoPcData.prototype._computeStats = function() {
  // TODO - set maxlife based on rules (level * class, previous maxlife + CON bonus, etc...)
  // TODO - set maxmana based on rules (level * class, previous maxmana + INT bonus, etc...)
  // TODO - set armour class based on player defensive abilities.
  // TODO - set player's base damage without weapons
}
/**
 * Defines a player's attribute.
 * @param {PlayerAttribute} attribute the attribute
 */
IoPcData.prototype._defineAttribute = function(attribute) {
  if (!(attribute instanceof this.AttributeClass)) {
    throw "IoPcData.defineAttribute() requires an instance of PlayerAttribute";
  }
  this._attributes[attribute.abbr] = attribute;
}
/**
 * Gets the total modifier for a specific element type from the equipment the player is wielding.
 * @param {Number} element the elemnt modifier id
 * @return {Number} the element modifier total
 */
IoPcData.prototype._getEquipmentModifiers = function(element) {
    var toadd = 0;
    for (var i = this._equipped.length - 1; i >= 0; i--) {
      if (this._equipped[i] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[i])) {
        var itemIo = this.InteractiveInstance.getIo(this._equipped[i]);
        if (itemIo.ioFlags.has(this.BaseConstants.IO_ITEM)) {
          var modifier = itemIo.data.getElementModifier(element);
          if (!modifier.percent) {
            toadd += modifier.value;
          }
        }
      }
    }
    return toadd;
}
/**
 * Gets the total percent modifier for a specific element type from the equipment the player is wielding.
 * @param {Number} element the element modifier id
 * @param {Number} trueval the true value being modified
 * @return {Number} the element modifier total
 */
IoPcData.prototype._getEquipmentPercentModifiers = function(element, trueval) {
  var toadd = 0;
  for (var i = this._equipped.length - 1; i >= 0; i--) {
    if (this._equipped[i] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[i])) {
      var itemIo = this.InteractiveInstance.getIo(this._equipped[i]);
      if (itemIo.ioFlags.has(this.BaseConstants.IO_ITEM)) {
        var modifier = itemIo.data.getElementModifier(element);
        if (modifier.percent) {
          toadd += modifier.value;
        }
      }
    }
  }
  return toadd * trueval * this.BaseConstants.DIV100;
}
IoPcData.prototype._init = function() {
  throw "IoPcData._defineAttributes() must be overwritten in the extended class";
}
/**
 * Adjusts the character's life by a specific amount.
 * @param {Number} dmg the amount by which the life score is being adjusted
 */
IoPcData.prototype.adjustLife = function(dmg) {
  this.life += dmg;
  this.computeFullStats();
    if (this.life > this.maxlife) {
      // if Hit Points now > max
      this.life = this.maxlife;
    }
    if (this.life < 0) {
        // if life now < 0
        this.life = 0;
    }
    this.notifyWatchers();
}
IoPcData.prototype.becomesDead = function() {
  // TODO - kill all spells the player cast
}
IoPcData.prototype.computeFullStats = function() {
  this._computeStats();
  this._clearElementModifiers();
  // TODO - identify any equipment if needed

  // apply modifiers
  for (var attr in this._attributes) {
    var attribute = this._attributes[attr];
    attribute.adjust(this._getEquipmentModifiers(attribute.elementModifier));
  }
  this._applyRulesModifiers();
  
  // apply percentage modifiers
  for (var attr in this._attributes) {
    var attribute = this._attributes[attr];
    attribute.adjust(this._getEquipmentPercentModifiers(attribute.elementModifier, attribute.fullValue));
  }
  this._applyRulesPercentModifiers();

  // TODO - check for spell modifiers

  // TODO - set life, maxlife, mana, maxmana
}
/**
 * Equips an item.
 * @param {InteractiveObject} itemIo the item being equipped
 */
IoPcData.prototype.equip = function(itemIo) {
  if (!this.InteractiveInstance.isValidIo(itemIo)) {
    throw "IoPcData.equip() requires a valid IO";
  }
  this.InteractiveInstance.removeFromAllInventories(itemIo);
  var slot = this.BaseConstants.EQUIP_SLOT_WEAPON;
  if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_DAGGER)
      || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_1H)
      || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_2H)
      || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_BOW)) {
    if (this._equipped[slot] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[slot])) {
      // unequip the old weapon
      this.unequip(this.InteractiveInstance.getIo(this._equipped[slot]));
    }
    // equip the new weapon
    this._equipped[slot] = itemIo.refId;
    // check to see if equipping a 2-handed weapon while holding a shield
    if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_2H)
        || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_BOW)) {
      slot = this.BaseConstants.EQUIP_SLOT_SHIELD;
      if (this._equipped[slot] >= 0
          && this.InteractiveInstance.validIONum(this._equipped[slot])) {
        // unequip shield
        this.unequip(this.InteractiveInstance.getIo(this._equipped[slot]));
      }
    }
  } else if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_SHIELD)) {
    slot = this.BaseConstants.EQUIP_SLOT_SHIELD;
    if (this._equipped[slot] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[slot])) {
      // unequip the old shield
      this.unequip(this.InteractiveInstance.getIo(this._equipped[slot]));
    }
    // equip the new shield
    this._equipped[slot] = itemIo.refId;
    // check to see if equipping a shield while holding a 2-handed weapon
    slot = this.BaseConstants.EQUIP_SLOT_WEAPON;
    if (this._equipped[slot] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[slot])) {
      var wpnIo = this.InteractiveInstance.getIo(this._equipped[slot]);
      if (wpnIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_2H)
          || wpnIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_BOW)) {
        // unequip weapon
        this.unequip(wpnIo);
      }
    }
  } else if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_RING)) {
    // TODO - check to see if player already has that type of ring equipped

    // check to see whic finger is available. left ring is selected first
    slot = this.BaseConstants.EQUIP_SLOT_RING_LEFT;
    if (this._equipped[slot] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[slot])) {
      slot = this.BaseConstants.EQUIP_SLOT_RING_RIGHT;
    }
    if (this._equipped[slot] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[slot])) {
      slot = this.BaseConstants.EQUIP_SLOT_RING_LEFT;
    }
    if (this._equipped[slot] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[slot])) {
      // unequip the old ring
      this.unequip(this.InteractiveInstance.getIo(this._equipped[slot]));
    }
    // equip the new ring
    this._equipped[slot] = itemIo.refId;
  } else if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_ARMOR)
      || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_LEGGINGS)
      || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_HELMET)) {
    if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_ARMOR)) {
      slot = this.BaseConstants.EQUIP_SLOT_ARMOR;
    }
    if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_LEGGINGS)) {
      slot = this.BaseConstants.EQUIP_SLOT_LEGGINGS;
    }
    if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_HELMET)) {
      slot = this.BaseConstants.EQUIP_SLOT_HELMET;
    }
    if (this._equipped[slot] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[slot])) {
      // unequip the old armour
      this.unequip(this.InteractiveInstance.getIo(this._equipped[slot]));
    }
    // equip the new armour
    this._equipped[slot] = itemIo.refId;
    this.recreateMesh();
  } else {
    throw "IoPcData.equip() cannot equip unrecognized object type";
  }
  this.computeFullStats();
}
IoPcData.prototype.getWeaponType = function() {
  var type = this.BaseConstants.WEAPON_BARE;
  if (this._equipped[this.BaseConstants.EQUIP_SLOT_WEAPON] >= 0
      && this.InteractiveInstance.validIONum(this._equipped[this.BaseConstants.EQUIP_SLOT_WEAPON])) {
    var wpnIo = this.InteractiveInstance.getIo(this._equipped[this.BaseConstants.EQUIP_SLOT_WEAPON]);
    if (wpnIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_DAGGER)) {
      type = this.BaseConstants.WEAPON_DAGGER;
    }
    if (wpnIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_1H)) {
      type = this.BaseConstants.WEAPON_1H;
    }
    if (wpnIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_2H)) {
      type = this.BaseConstants.WEAPON_2H;
    }
    if (wpnIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_BOW)) {
      type = this.BaseConstants.WEAPON_BOW;
    }
  }
  return type;
}
IoPcData.prototype.hasEquipped = function(itemIo) {
  if (!this.InteractiveInstance.isValidIo(itemIo)) {
    throw "IoPcData.hasEquipped() requires a valid IO";
  }
  var equipped = false;
  for (var i = this._equipped.length - 1; i >= 0; i--) {
    if (this._equipped[i] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[i])
        && this.InteractiveInstance.getIo(this._equipped[i]).equals(itemIo)) {
      equipped = true;
    }
  }
  return equipped;
}
IoPcData.prototype.levelUp = function() {
  this._level++;
  // TODO - set stats
  this._computeStats();
  // TODO - set life an mana to full
  this.ScriptInstance.sendIOScriptEvent({
    "io": this._io,
    "eventName": "LEVEL_UP"
  });
}
IoPcData.prototype.putInFrontOfPlayer = function(itemIo, flag) {
  throw "IoPcData.putInFrontOfPlayer() must be overriden in th extending class";
}
IoPcData.prototype.quickGeneration = function() {
  // TODO - set stats
  this._computeStats();
}
IoPcData.prototype.recreateMesh = function() {
  throw "IoPcData.recreateMesh() must be overriden in th extending class";
}
/** PURPOSE UNKNOWN. */
IoPcData.prototype.releaseEquippedIo = function(ioid) {
  for (var i = this._equipped.length - 1; i >= 0; i--) {
    if (this._equipped[i] === ioid) {
      this._equipped[i] = -1;
    }
  }
}
/**
 * Unequips an item.
 * @param {InteractiveObject} itemIo the item being unequipped
 * @param {boolean} itemDestroyed if false or undefined, the item is moved to inventory or put in front of the player; otherwise it is destroyed.
 */
IoPcData.prototype.unequip = function(itemIo, itemDestroyed) {
  if (typeof(itemDestroyed) === "undefined") {
    itemDestroyed = false;
  }
  if (!this.InteractiveInstance.isValidIo(itemIo)) {
    throw "IoPcData.unequip() requires a valid IO";
  }
  if (!this.hasEquipped(itemIo)) {
    throw "IoPcData.unequip() item was not equipped";
  }
  for (var i = this._equipped.length - 1; i >= 0; i--) {
    if (this._equipped[i] === itemIo.refId) {
      this._equipped[i] = -1;
      if (!itemDestroyed) {
        if (!this._io.inventory.canBePutInInventory(itemIo)) {
          this.putInFrontOfPlayer(itemIo, 1)
        }
      }
      // send message to player that they are unequipping an item
      this.ScriptInstance.eventSender = itemIo;
      this.ScriptInstance.sendIOScriptEvent({
        "io": this._io,
        "eventId": this.BaseConstants.SM_EQUIPOUT
      });

      // send message to IO that it is being unequipped
      this.ScriptInstance.eventSender = this._io;
      this.ScriptInstance.sendIOScriptEvent({
        "io": itemIo,
        "eventId": this.BaseConstants.SM_EQUIPOUT
      });
    }
  }
  if (itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_HELMET)
      || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_ARMOR)
      || itemIo.data.typeFlags.has(this.BaseConstants.OBJECT_TYPE_LEGGINGS)) {
    this.recreateMesh();
  }
  this.computeFullStats();
}
/** Unequips all items. */
IoPcData.prototype.unequipAll = function() {
  for (var i = this._equipped.length - 1; i >= 0; i--) {
    if (this._equipped[i] >= 0
        && this.InteractiveInstance.validIONum(this._equipped[i])) {
      this.unequip(this.InteractiveInstance.getIo(this._equipped[i]));
    }
  }
  this.computeFullStats();
}

/**
 * @class The IoScript class.
 */
 function IoScript() {
  if (typeof(this.ActionClass) === "undefined") {
    throw "IoScript() an ActionClass must be set on the IoScript.prototype before instantiation"
  }
  if (typeof(this.BaseConstants) === "undefined") {
    throw "IoBehaviourData() an instance of BaseConstants must be set on the IoBehaviourData.prototype before instantiation"
  }
  if (typeof(this.FlagSetClass) === "undefined") {
    throw "IoScript() a FlagSetClass must be set on the IoScript.prototype before instantiation"
  }
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "IoNpcData() a InteractiveInstance must be set on the IoPcData.prototype before instantiation"
  }
  /** @private private reference. */
  var that = this;
  /** @private the IO's scripted actions. */
  this._actions = {
    "DEATH": new this.ActionClass(function(params) {
      return that.BaseConstants.ACCEPT;
    }),
    "INIT": new this.ActionClass(function(params) {
      return that.BaseConstants.ACCEPT;
    })
  };
  /** @private the script's allowed events. */
  this._allowedEvents = new this.FlagSetClass();
  /** @private the parent IO. */
  this._io = null;
  /** @private the master script. */
  this._master = null;
  /** @private the list of times set on the IoScript. used for tracking timers. */
  this._timers = [];
  /** @private the IoScript's variables. */
  this._variables = {};
}
Object.defineProperty(IoScript.prototype, 'allowedEvents', {
  get() { return this._allowedEvents; }
});
Object.defineProperty(IoScript.prototype, 'io', {
  /** Gets the IoScript's IO property. */
  get() {
    return this._io;
  },

  /** Sets the IoScript's IO property. */
  set(value) {
    if (!this.InteractiveInstance.isValidIo(value)) {
      throw "IO parameter must be an instance of InteractiveObject";
    }
    this._io = value;
    if (this._io.script === null) {
      this._io.script = this;
    }
  }
});
Object.defineProperty(IoScript.prototype, 'master', {
  /** Gets the IoScript's IO property. */
  get() {
    return this._master;
  },

  /** Sets the IoScript's IO property. */
  set(value) {
    if (typeof(value) === "undefined"
        || value === null
        || !(value instanceof IoScript)) {
      throw "master parameter must be an instance of IoScript";
    }
    this._master = value;
    this._master.io = this._io;
  }
});
/**
 * Adds a scripted action.
 * @param {String} actionName the action's name
 * @param {ScriptAction} scriptAction the script action object
 */
IoScript.prototype.addAction = function(actionName, scriptAction) {
  if (typeof(actionName) === "undefined" || typeof(scriptAction) === "undefined") {
    throw "need key-value pair when setting script actions"
  }
  if (typeof(actionName) !== "string") {
    throw "action name must be a string";
  }
  if (actionName.length === 0) {
    throw "action name cannot be an empty string";
  }
  if (scriptAction instanceof this.ActionClass) {
    this._actions[actionName] = scriptAction;
  } else {
    throw "action must be an instance of ScriptAction";
  }
}
/**
 * Clears all variables.
 */
IoScript.prototype.clearVariables = function() {
  for (var key in this._variables) {
    delete this._variables[key];
  }
}
/**
 * Executes a scripted action.
 * @param {String} actionName the action's name
 * @param {Object} params any parameters applied
 */
IoScript.prototype.execute = function(actionName, params) {
  if (!this._actions.hasOwnProperty(actionName)) {
    throw ["IoScript.execute() - Missing action '", actionName, "'"].join("");
  }
  return this._actions[actionName].execute(params);
}
/**
 * Gets a IoScript variable.
 * @param {String} name the variable's name
 * @return {Object} value any variable's value
 */
IoScript.prototype.getVariable = function(name, params) {
  if (!this._variables.hasOwnProperty(name)) {
    throw ["Missing variable '", name, "'"].join("");
  }
  return this._variables[name];
}
/**
 * Determines if a IoScript has a variable.
 * @param {String} name the variable's name
 * @return {Boolean} true if the variable was set; false otherwise
 */
IoScript.prototype.hasVariable = function(name) { return this._variables.hasOwnProperty(name); }
/**
 * Sets a IoScript variable.
 * @param {String} key the variable's key
 * @param {Object} value any variable's value
 */
IoScript.prototype.setVariable = function(key, value) {
  if (typeof(key) === "undefined" || typeof(value) === "undefined") {
    throw "need key-value pair when setting script variables"
  }
  if (typeof(key) !== "string") {
    throw "key must be a string";
  }
  if (key.length === 0) {
    throw "key cannot be an empty string";
  }
  this._variables[key] = value;
}

/**
 * @class The IoSpellData class.
 */
function IoSpellData() {
  if (typeof(this.FlagSetClass) === "undefined") {
    throw "IoSpellData() a FlagSetClass must be set on the IoSpellData.prototype before instantiation"
  }
  /** @private the reference id of the spell being cast. */
  this._spellId = -1;
  /** @private the spell's duration. */
  this._duration = 0;
  /** @private flags applied to the spell. */
  this._flags = new this.FlagSetClass();
  /** @private the spell's level. */
  this._level = 0;
  /** @private the spell target's reference id */
  this._target = -1;
}
Object.defineProperty(IoSpellData.prototype, 'id', {
  /** Gets the Location's x-coordinate. */
  get() { return this._spellId; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoSpellData.id requires an integer value"
    }
    if (value < 0) {
      throw "IoSpellData.id - '" + value + "' is not a valid IO target"
    }
    this._spellId = value;
  }
});
Object.defineProperty(IoSpellData.prototype, 'duration', {
  /** Gets the Location's x-coordinate. */
  get() { return this._duration; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoSpellData.duration requires an integer value"
    }
    if (value < 0) {
      throw "IoSpellData.duration requires a positive integer value"
    }
    this._duration = value;
  }
});
Object.defineProperty(IoSpellData.prototype, 'flags', {
  /** Gets the Location's x-coordinate. */
  get() { return this._flags; }
});
Object.defineProperty(IoSpellData.prototype, 'level', {
  /** Gets the Location's x-coordinate. */
  get() { return this._level; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoSpellData.level requires an integer value"
    }
    if (value < 0) {
      throw "IoSpellData.level requires a positive integer value"
    }
    this._level = value;
  }
});
Object.defineProperty(IoSpellData.prototype, 'target', {
  /** Gets the Location's x-coordinate. */
  get() { return this._target; },
  /** Gets the Location's x-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "IoSpellData.target requires an integer value"
    }
    if (value < 0) {
      throw "IoSpellData.target - '" + value + "' is not a valid IO target"
    }
    this._target = value;
  }
});

/**
 * @class The Location class.
 * @param {Object} parameterObject the parameters supplied to instantiate a new Location. if null or undefined, then the initial coordinates are 0, 0.
 */
function Location(parameterObject) {
  /** @private the x-coordinate. */
  this._x;
  /** @private the y-coordinate. */
  this._y;
  // call to set point variables
  this.set(parameterObject);
}
/**
 * Determines whether or not two points are equal.
 * @param {Object} otherLoc the other point
 * @return {Boolean} true if the points are equal; false otherwise
 */
Location.prototype.equals = function(otherLoc) {
  var b = false;
  if (otherLoc instanceof Location) {
    b = this._x === otherLoc._x && this._y === otherLoc._y;
  }
  return b;
}

Object.defineProperty(Location.prototype, 'x', {
  /** Gets the Location's x-coordinate. */
  get() {
    return this._x;
  },

  set(value) {
    if (isNaN(parseInt(value))) {
      throw "Location.x requires a valid number";
    }
    this._x = value;
  }
});
Object.defineProperty(Location.prototype, 'y', {
  /** Gets the Location's y-coordinate. */
  get() {
    return this._y;
  },
  /** Sets the Location's y-coordinate. */
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "Location.y requires a valid number";
    }
    this._y = value;
  }
});
/**
 * Sets the location of this point to the specified coordinates.
 * @param {Object} parameterObject the parameters supplied to instantiate a new Location. if null or undefined, then the initial coordinates are 0, 0.
 */
Location.prototype.set = function(parameterObject) {
  parameterObject = typeof(parameterObject) !== "undefined" ? parameterObject !== null ? parameterObject : [0, 0] : [0, 0];
  if (parameterObject instanceof Location) {
    this._x = parameterObject._x;
    this._y = parameterObject._y;
  } else if (Array.isArray(parameterObject)) {
    this._x = parameterObject[0];
    this._y = parameterObject[1];
  } else if (typeof(parameterObject) === "string" && parameterObject.indexOf(",") > 0) {
    var split = parameterObject.split(",");
    this._x = parseInt(split[0]);
    this._y = parseInt(split[1]);
  } else {
    throw "Location.set() requires a Location or two numbers"
  }
}
/**
 * Returns a string representation of this point and its location in the (x,y) coordinate space.
 * @return {String} a string representation of this point
 */
Location.prototype.toString = function() {
  var str = [];
  str.push(this._x);
  str.push(", ");
  str.push(this._y);
  return str.join("");
}
/**
 * Translates this point, at location (x,y), by dx along the x axis and  dy along the y axis so that it now represents the point (x+dx,y+dy).
 * @param {Number} dx the distance to move this point along the X axis
 * @param {Number} dy the distance to move this point along the y axis
 */
Location.prototype.translate = function(dx, dy) {
  if (typeof(dx) === "undefined" || typeof(dy) === "undefined") {
    throw "Location.translate() requires two numbers";
  }
  if (isNaN(parseInt(dx)) || isNaN(parseInt(dy))) {
    throw "Location.translate() requires two numbers";
  }
  this._x += dx;
  this._y += dy;
}


/**
 * @class Attribute Lookup Table.
 */
 var AttributeLookupTable = function(tableData) {
  this._attribute = tableData.attribute;
  this._entries = tableData.entries;
};
/**
 * Finds a vlaue from the lookup table.
 * @param {IoPcData} pcData the pc data instance
 * @returns {Object}
 */
AttributeLookupTable.prototype.findValue = function(pcData) {
  var score = pcData.attributes[this._attribute].fullValue;
  var found = false, value;
  for (var i = this._entries.length - 1; i >= 0; i--) {
    if (this._entries[i].isInRange(score)) {
      value = this._entries[i]._value;
      found = true;
      break;
    }
  }
  if (!found) {
    throw ["Unable to find value in Attribute lookup table for ", this._attribute, " value ", score].join("");
  }
  if (typeof value === "function") {
    value = value(pcData);
  }
  return value;
}

/**
 * @class Entry field for a variable key table.
 */
 var VariableKeyTableEntry = function(parameterObject) {
  this._key = parameterObject.key;
  if (!parameterObject.hasOwnProperty("valueType")) {
    parameterObject.valueType = "int";
    if (parameterObject.value.hasOwnProperty("args")
        && parameterObject.value.hasOwnProperty("body")) {
      parameterObject.valueType = "function";
    }
    if (Array.isArray(parameterObject.value)) {
      parameterObject.valueType = "array";
    }
  }
  this._valueType = parameterObject.valueType;
  switch (parameterObject.valueType) {
    case "array":
    case "dictionary":
    case "int":
    case "float":
    case "Number":
    case "string":
    case "object":
      this._value = parameterObject.value;
      break;
    case "table":
    case "lookup_table":
      this._value = [];
      for (var i = 0, li = parameterObject.value.length; i < li; i++) {
        this._value.push(new VariableKeyTableEntry(parameterObject.value[i]));
      }
      break;    
    case "function":
      this._value = new Function(parameterObject.value.args, parameterObject.value.body);
      break;
    default:
      throw ["unrecognized value type ", parameterObject.valueType].join("");
  }
};
/**
 * Getter for the entry's value.
 */
Object.defineProperty(VariableKeyTableEntry.prototype, 'value', {
  get() { return this._value; }
});
/**
 * Determines if a value is in the key's range
 * @param {Number} value the value
 * @returns {Boolean} true if the number is in range; false otherwise
 */
VariableKeyTableEntry.prototype.isInRange = function(value) {
  if (typeof(value) === "undefined") {
    throw "VariableKeyTableEntry.isInRange() requires an integer argument";
  }
  var found = false;
  if (Array.isArray(this._key)) {
    found = this._key[0] <= value  && value <= this._key[1];
  } else {            
    found = this._key === value;
  }
  return found;
}


/**
 * @class The PlayerAttribute class.
 * @param {PlayerAttributeDescriptors} descriptors the attribute descriptors
 */
function PlayerAttribute(descriptors) {
  if (!(descriptors instanceof PlayerAttributeDescriptors)) {
    console.trace(descriptors);
    throw "PlayerAttribute() requires a parameter object"
  }
  this._descriptors = descriptors;
  this._base = 0;
  this._mod = 0;
}
/** Getter for the attribute's abbreviation. */
Object.defineProperty(PlayerAttribute.prototype, 'abbr', {
  get() { return this._descriptors.abbr; }
});
/** Getter for the attribute's description. */
Object.defineProperty(PlayerAttribute.prototype, 'description', {
  get() { return this._descriptors.description; }
});
/** Getter for the attribute's element modifier id. */
Object.defineProperty(PlayerAttribute.prototype, 'elementModifier', {
  get() { return this._descriptors.elementModifier; }
});
/** Getter for the attribute's title. */
Object.defineProperty(PlayerAttribute.prototype, 'title', {
  get() { return this._descriptors.title; }
});
/** Getter/Setter for the attribute's abbreviation. */
Object.defineProperty(PlayerAttribute.prototype, 'baseValue', {
  get() { return this._base; },
  set(value) {
    if (isNaN(parseFloat(value))) {
      console.trace(value);
      throw "PlayerAttribute.baseValue must be a floating-point value";
    }
    this._base = value;
  }
});
/** Getter for the attribute's abbreviation. */
Object.defineProperty(PlayerAttribute.prototype, 'fullValue', {
  get() { return this._base + this._mod; }
});
/**
 * Adjusts the attributes value.
 * @param {Number} amount the amount by which the value is adjusted
 */
PlayerAttribute.prototype.adjust = function(amount) {
  if (isNaN(parseFloat(amount))) {
    console.trace(amount);
    throw "PlayerAttribute.adjust() requires a floating-point value";
  }
  this._mod += amount;
}
/**
 * Clears all attribute modifiers.
 */
PlayerAttribute.prototype.clearModifiers = function() { this._mod = 0; }

/**
 * @class The PlayerAttributeDescriptors class.
 * @param {object} parameterObject the descriptor parameters
 */
function PlayerAttributeDescriptors(parameterObject) {
  if (typeof(parameterObject) === "undefined") {
    throw "PlayerAttributeDescriptors() requires a parameter object"
  }
  if (typeof(parameterObject.abbr) !== "string"
      || parameterObject.abbr.length === 0) {
    throw "PlayerAttributeDescriptors() requires an abbreviation"
  }
  if (typeof(parameterObject.description) !== "string"
      || parameterObject.description.length === 0) {
    console.trace(parameterObject);
    throw "PlayerAttributeDescriptors() requires a description"
  }
  if (typeof(parameterObject.title) !== "string"
      || parameterObject.title.length === 0) {
    throw "PlayerAttributeDescriptors() requires a title"
  }
  if (isNaN(parseInt(parameterObject.elementModifier))) {
    throw "PlayerAttributeDescriptors() requires an integer element modifier id"
  }
  this._abbr = parameterObject.abbr;
  this._description = parameterObject.description;
  this._elementModifier = parameterObject.elementModifier;
  this._title = parameterObject.title;
}
/** Getter for the attribute's abbreviation. */
Object.defineProperty(PlayerAttributeDescriptors.prototype, 'abbr', {
  get() { return this._abbr; }
});
/** Getter for the attribute's description. */
Object.defineProperty(PlayerAttributeDescriptors.prototype, 'description', {
  get() { return this._description; }
});
/** Getter for the attribute's element modifier id. */
Object.defineProperty(PlayerAttributeDescriptors.prototype, 'elementModifier', {
  get() { return this._elementModifier; }
});
/** Getter for the attribute's title. */
Object.defineProperty(PlayerAttributeDescriptors.prototype, 'title', {
  get() { return this._title; }
});

/**
 * @class The ScriptAction class.
 * @param {function} callback the action's callback
 */
 function ScriptAction(callback) {
  this._callback = null;
  if (typeof(callback) !== "undefined") {
    if (callback === null) {
      throw "ScriptAction() - callback parameter is null";
    }
    if (typeof(callback) !== "function") {
      throw "ScriptAction() - callback parameter must be a function";
    }
    this._callback = callback;
  }
}
{ // ScriptAction prototype closure
  Object.defineProperty(ScriptAction.prototype, 'callback', {
    /** Sets the script's IO property. */
    set(value) {
      if (typeof(value) === "undefined") {
        throw "No callback was provided";
      }
      if (value === null) {
        throw "callback parameter is null";
      }
      if (typeof(value) !== "function") {
        throw "Callback must be a function";
      }
      this._callback = value;
    }
  });
  ScriptAction.prototype.execute = function(params) {
    return this._callback(params);
  }
}

/**
 * @class The ScriptTimer class.
 */
 function ScriptTimer(params) {
  if (typeof(this.FlagSetClass) === "undefined") {
    throw "IoBehaviourData() a FlagSetClass must be set on the IoBehaviourData.prototype before instantiation"
  }
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "IoNpcData() a InteractiveInstance must be set on the IoPcData.prototype before instantiation"
  }
  if (typeof(this.ScriptClass) === "undefined") {
    throw "ScriptTimer() a ScriptClass must be set on the ScriptTimer.prototype before instantiation"
  }
  this._eventId;
  this._eventName;
  /** @private flag indicating whether the timer exists. */
  this._exists = false;
  /** @private any flags set on the timer. */
  this._flags = new this.FlagSetClass();
  /** @private the timer interval (msecs). */
  this._interval;
  /** @private the parent IO. */
  this._io;
  /** @private the Script Timer's name. */
  this._name = "";
  /** @private the script associated with the timer (es). */
  this._script = null;
  /** @private the # of times the timer should run. */
  this._times = 1;
  /** @private the last time the timer was executed. */
  this._tim;
  if (typeof(params) !== "undefined") {
    this.set(params);
  }
}
/**
 * Clears a timer.
 */
ScriptTimer.prototype.clear = function() {
  this._name = "";
  this._exists = false;
}
/**
 * Determines whether or not two ScriptTimers are equal.
 * @param {Object} otherTimer the other
 * @return {Boolean} true if the timers are equal; false otherwise
 */
ScriptTimer.prototype.equals = function(otherIo) {
  var b = false;
  if (otherIo instanceof ScriptTimer) {
    b = this._name.toLowerCase() === otherIo._name.toLowerCase();
  }
  return b;
}
/**
 * Sets a script timer.
 * @param {Object} set the timer parameters
 */
ScriptTimer.prototype.set = function(parameterObject) {
  if (typeof(parameterObject) === "undefined") {
    throw "ScriptTimer.set() requires a parameter object";
  }
  this.exists = true;
  if (parameterObject.hasOwnProperty("flags")) {
    this._flags = flags;
  }
  this.interval = parameterObject.interval;
  this.io = parameterObject.io;
  this.script = parameterObject.script;
  if (parameterObject.hasOwnProperty("times")) {
    this.times = parameterObject.times;
  }
}
Object.defineProperty(ScriptTimer.prototype, 'exists', {
  get() { return this._exists; },
  set(value) {
    if (typeof(value) !== "boolean") {
      throw "ScriptTimer.exists requires a boolean";
    }
    this._exists = value;
  }
});
Object.defineProperty(ScriptTimer.prototype, 'flags', {
  get() { return this._flags; }
});
Object.defineProperty(ScriptTimer.prototype, 'interval', {
  get() { return this._interval; },
  set(value) {
    if (isNaN(parseInt(value))
        || parseInt(value) < 0) {
      throw "ScriptTimer.interval requires a positive integer";
    }
    this._interval = value;
  }
});
  Object.defineProperty(ScriptTimer.prototype, 'io', {
    get() { return this._io; },
    set(value) {
      if (!this.InteractiveInstance.isValidIo(value)) {
        throw "ScriptTimer.io parameter must be an instance of InteractiveObject";
      }
      this._io = value;
    }
  });
Object.defineProperty(ScriptTimer.prototype, 'eventId', {
  get() { return this._eventId; },
  set(value) {
    if (isNaN(parseInt(value))
        || parseInt(value) < 0) {
      throw "ScriptTimer.eventId requires a positive integer";
    }
    this._eventId = value;
  }
});
Object.defineProperty(ScriptTimer.prototype, 'eventName', {
  get() { return this._eventName; },
  set(value) {
    if (typeof(value) !== "string"
        || value.length === 0) {
      throw "ScriptTimer.eventName requires a name of one or more characters";
    }
    this._eventName = value;
  }
});
Object.defineProperty(ScriptTimer.prototype, 'name', {
  get() { return this._name; },
  set(value) {
    if (typeof(value) !== "string"
        || value.length === 0) {
      throw "ScriptTimer.name requires a name of one or more characters";
    }
    this._name = value;
  }
});
Object.defineProperty(ScriptTimer.prototype, 'script', {
  get() { return this._script; },
  set(value) {
    if (typeof(value) === "undefined"
        || value === null
        || !(value instanceof this.ScriptClass)) {
      throw "ScriptTimer.script - script parameter must be an instance of IoScript";
    }
    this._script = value;
  }
});
Object.defineProperty(ScriptTimer.prototype, 'tim', {
  get() { return this._tim; },
  set(value) {
    if (isNaN(parseInt(value))
        || parseInt(value) < 0) {
      throw "ScriptTimer.tim requires a positive integer";
    }
    this._tim = value;
  }
});
Object.defineProperty(ScriptTimer.prototype, 'times', {
  get() { return this._times; },
  set(value) {
    if (isNaN(parseInt(value))
        || parseInt(value) < 0) {
      throw "ScriptTimer.times requires a positive integer";
    }
    this._times = value;
  }
});


/**
 * @class The StackedEvent class.
 * @param {object} parameterObject the initialization parameters
 */
 function StackedEvent(parameterObject) {
  if (typeof(this.InteractiveInstance) === "undefined") {
    throw "StackedEvent() a InteractiveInstance must be set on the StackedEvent.prototype before instantiation"
  }
  if (typeof(parameterObject) !== "undefined"
      && parameterObject !== null) {
    this.set(parameterObject);
  }
  /** @private the event id. */
  this._eventId;
  /** @private the event name. */
  this._eventName;
  /** @private the flag indicating whether the event exists. */
  this._exists = false;
  /** @private the event's IO. */
  this._io;
  /** @private the event parameters. */
  this._params;
  /** @private the event sender. */
  this._sender;
}
/** Clears the stacked event's parameters. */
StackedEvent.prototype.clear = function() {
  this._eventId = 0;
  this._eventName = null;
  this._exists = false;
  this._io = null;
  this._params = null;
  this._sender = null;
}
/**
 * Sets the stacked event's parameters.
 * @param {Object} parameterObject the parameters
 */
StackedEvent.prototype.set = function(parameterObject) {
  if (!parameterObject.hasOwnProperty("eventId")
      && !parameterObject.hasOwnProperty("eventName")) {
    throw "StackedEvent.set() needs either an event id or name";
  }
  if (parameterObject.hasOwnProperty("eventId")) {
    this.eventId = parameterObject.eventId;
  }
  if (parameterObject.hasOwnProperty("eventName")) {
    this.eventName = parameterObject.eventName;
  }
  this.exists = parameterObject.exists;
  this.io = parameterObject.io;
  this.params = parameterObject.params;
  this.sender = parameterObject.sender;
}
Object.defineProperty(StackedEvent.prototype, 'eventId', {
  get() { return this._eventId; },
  set(value) {
    if (isNaN(parseInt(value))) {
      throw "StackedEvent.eventId requires an integer";
    }
    this._eventId = value;
  }
});
Object.defineProperty(StackedEvent.prototype, 'eventName', {
  get() { return this._eventName; },
  set(value) {
    if (typeof(value) === "string") {
      throw "StackedEvent.eventName requires a string";
    }
    this._eventName = value;
  }
});
Object.defineProperty(StackedEvent.prototype, 'exists', {
  get() { return this._exists; },
  set(value) {
    if (typeof(value) === "boolean") {
      throw "StackedEvent.exists requires a boolean";
    }
    this._exists = value;
  }
});
Object.defineProperty(StackedEvent.prototype, 'io', {
  get() { return this._io; },
  set(value) {
    if (!this.InteractiveInstance.isValidIo(value)) {
      throw "StackedEvent.io parameter must be an instance of InteractiveObject";
    }
    this._io = value;
  }
});
Object.defineProperty(StackedEvent.prototype, 'params', {
  get() { return this._params; },
  set(value) { this._params = value; }
});
Object.defineProperty(StackedEvent.prototype, 'sender', {
  get() { return this._sender; },
  set(value) {
    if (!this.InteractiveInstance.isValidIo(value)) {
      throw "StackedEvent.sender parameter must be an instance of InteractiveObject";
    }
    this._sender = value;
  }
});


function Watchable() {
   this._watchers = []
}
Watchable.prototype.addWatcher = function(watcher) {
  if (watcher !== null
      && typeof(watcher) !== "undefined") {
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
};
Watchable.prototype.notifyWatchers = function() {
  for (let i = this._watchers.length - 1; i >= 0; i--) {
    this._watchers[i].watchUpdated(this);
  }
};
Watchable.prototype.removeWatcher = function(watcher) {
  let index = -1;
  let watcherId = watcher;
  if (typeof(watcherId) !== "string" && !watcherId instanceof String) {
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
function Watcher() {
  /** @private the watcher's unique id. */
  this._watcherId = [Date.now().toString(36), Math.random().toString(36).substr(2)].join("");
}
Watcher.prototype.watchUpdated = function(data) { };
/**
 * Gets the watcher's id.
 * @returns {string} the unique id
 */
Object.defineProperty(Watcher.prototype, 'watcherId', {
  get() { return this._watcherId; }
});
/**
 * @class Priority queue for .
 * @param {Number} nmax the maximum number of elements.
 */
function DijkstraUndirectedSearch(graph, source) {
  /** @private distTo[v] = distance of shortest s->v path. */
  this._distTo;
  /** @private edgeTo[v] = last edge on shortest s->v path. */
  this._edgeTo;
  /** @private priority queue of vertices. */
  this._pq;

  for (var i = graph.numberOfEdges - 1; i >= 0; i--) {
    if (graph.getEdge(i).cost < 0) {
      throw ["DijkstraUndirectedSearch.constructor() - edge has negative weight", graph.getEdge(i)];
    }
  }
  this._distTo = graph.numberOfVertices;
  this._edgeTo = [];
  for (var i = 0, li = graph.numberOfVertices; i < li; i++) {
    this._edgeTo.push(null);
  }
  for (var v = 0; v < graph.numberOfVertices; v++) {
    this._distTo[v] = Number.POSITIVE_INFINITY;
  }
  this._distTo[source] = 0.0;

  // relax vertices in order of distance from s
  this._pq = new IndexMinPQ(graph.numberOfVertices);
  this._pq.insert(source, this._distTo[source]);
  while (!this._pq.isEmpty) {
    var v = this._pq.delMin();
    var adj = graph.getVertexAdjacencies(v);
    for (var i = adj.Length - 1; i >= 0; i--) {
      this.relax(adj[i], v);
    }
  }

  // check optimality conditions
  this.check(graph, source);
}
{ // DijkstraUndirectedSearch Getters
}
{ // DijkstraUndirectedSearch closure
  DijkstraUndirectedSearch.prototype.check = function(graph, s) {
    // check that edge weights are nonnegative
    for (var i = graph.numberOfEdges - 1; i >= 0; i--) {
      var e = graph.getEdge(i);
      if (e.cost < 0) {
        console.log("DijkstraUndirectedSearch.check() - negative edge weight detected");
        return false;
      }
    }
    // check that distTo[v] and edgeTo[v] are consistent
    if (this._distTo[s] !== 0.0 || this._edgeTo[s] !== null) {
        console.log("DijkstraUndirectedSearch.check() - distTo[s] and edgeTo[s] inconsistent");
        return false;
    }
    for (var v = graph.numberOfVertices - 1; v >= 0; v--) {
      if (v === s) {
        continue;
      }
      if (this._edgeTo[v] === null && this._distTo[v] !== Number.POSITIVE_INFINITY) {
        console.log("DijkstraUndirectedSearch.check() - distTo[] and edgeTo[] inconsistent");
        return false;
      }
    }

    // check that all edges e = v->w satisfy distTo[w] <= distTo[v] +
    // e.weight()
    for (var v = graph.numberOfVertices - 1; v >= 0; v--) {
      var adj = graph.getVertexAdjacencies(v);
      for (var i = adj.Length - 1; i >= 0; i--) {
        var e = adj[i];
        var w;
        if (v === e.to) {
          w = e.from;
        } else {
          w = e.to;
        }
        if (this._distTo[v] + e.cost < this._distTo[w]) {
          console.log("DijkstraUndirectedSearch.check() - edge " + e + " not relaxed");
          return false;
        }
      }
    }

    // check that all edges e = v->w on SPT satisfy distTo[w] == distTo[v] +
    // e.weight()
    for (var w = 0; w < graph.numberOfVertices; w++) {
      if (this._edgeTo[w] == null) {
        continue;
      }
      var e = this._edgeTo[w];
      var v = e.from;
      if (w !== e.to) {
        return false;
      }
      if (this._distTo[v] + e.cost !== this._distTo[w]) {
        console.log("DijkstraUndirectedSearch.check() - edge " + e + " on shortest path not tight");
        return false;
      }
    }
    return true;
  }
  DijkstraUndirectedSearch.prototype.distanceTo = function(v) {
    return this._distTo[v];
  }
  DijkstraUndirectedSearch.prototype.hasPathTo = function(v) {
    return this._distTo[v] < Number.POSITIVE_INFINITY;
  }
  DijkstraUndirectedSearch.prototype.pathTo = function(v) {
    var path = null;
    if (this.hasPathTo(v)) {
      path = [];
      var e = this._edgeTo[v];
      var lastVertex = v;
      for (; e !== null;) {
        path.push(e);
        if (e.from === lastVertex) {
          lastVertex = e.to;
          e = this._edgeTo[e.to];
        } else {
          lastVertex = e.from;
          e = this._edgeTo[e.from];
        }
      }
    }
    return path;
  }
  DijkstraUndirectedSearch.prototype.relax = function(edge, source) {
    var v, w;
    if (source === edge.from) {
      v = edge.From;
      w = edge.to;
    } else {
      v = edge.to;
      w = edge.from;
    }
    // UnityEngine.Debug.Log("find distance from " + w+" to "+v);
    if (this._distTo[w] > this._distTo[v] + edge.Cost) {
      this._distTo[w] = this._distTo[v] + edge.Cost;
      this._edgeTo[w] = edge;
      if (this._pq.contains(w)) {
        this._pq.decreaseKey(w, this._distTo[w]);
      } else {
        this._pq.insert(w, this._distTo[w]);
      }
    }
  }
}
 
/**
 * @class Priority queue for .
 * @param {Number} nmax the maximum number of elements.
 */
function EdgeWeightedUndirectedGraph(parameterObject) {
  /** @private the graph's set of edges. */
  this._edges;
  /** @private the graph's set of vertices. */
  this._vertices;

  if (!isNaN(parseInt(parameterObject))) {
    this._vertices = [];
    for (let i = parameterObject - 1; i >= 0; i--) {
      this._vertices.push(new GraphNode(i));
    }
    this._edges = [];
  } else {
    this._vertices = [], this._edges = [];
    for (let i = 0, li = parameterObject._vertices.length; i < li; i++) {
      this._vertices.push(new GraphNode(parameterObject._vertices[i]));
    }
    for (let i = 0, li = parameterObject._edges.length; i < li; i++) {
      this._edges.push(new WeightedGraphEdge(parameterObject._edges[i].index));
    }
  }
}
{ // EdgeWeightedUndirectedGraph Getters
  /** Getter for the graph's number of edges. */
  Object.defineProperty(EdgeWeightedUndirectedGraph.prototype, 'numberOfEdges', { get() { return this._edges.length; } });
  /** Getter for the graph's number of vertices. */
  Object.defineProperty(EdgeWeightedUndirectedGraph.prototype, 'numberOfVertices', {
    get() {
      let numVertices = 0;
      for (let i = this._vertices.length - 1; i >= 0; i--) {
        if (this._vertices[i].index > -1) {
            numVertices++;
        }
      }
      return numVertices;
    }
  });
}
{ // EdgeWeightedUndirectedGraph closure
  EdgeWeightedUndirectedGraph.prototype.addEdge = function(arg0, arg1, arg2) {
    let v, w, c = 1;
    if (Array.isArray(arg0)) {
      // only 1 argument, and it's an array of values
      v = arg0[0];
      w = arg0[1];
      c = arg0[2];
    } else if (!isNaN(parseInt(arg0.from))) {
      // only 1 argument, and it's an edge object
      v = arg0.from;
      w = arg0.to;
      c = arg0.cost;
    } else {
      // 2 or 3 arguments
      v = parseInt(arg0);
      w = parseInt(arg1);
      if (!isNaN(parseFloat(arg2))) {
        c = parseFloat(arg2);
      }
    }
    if (!this.hasEdge(v, w)) {
      if (!this.hasVertex(v)) {
          this.addVertex(v);
      }
      if (!this.hasVertex(w)) {
          this.addVertex(w);
      }
      edges.push(new WeightedGraphEdge(v, w, c));
    }
  }
  EdgeWeightedUndirectedGraph.prototype.addVertex = function(arg0) {
    let i = this.getEmptyVertexSlot();
    if (i === -1) {
      i = this._vertices.Length;
      this.extendVerticesArray();
    }
    this._vertices[i] = new GraphNode(arg0);
  }
  EdgeWeightedUndirectedGraph.prototype.extendVerticesArray = function(length) {
    if (isNaN(parseInt(length))) {
      length = 1;
    }
    for (let i = parseInt(length); i > 0; i--) {
      this._vertices.push(null);
    }
  }
  EdgeWeightedUndirectedGraph.prototype.getAdjacencies = function(v) {
    let adjacencies = [];
    for (let i = this._edges.length - 1; i >= 0; i--) {
      if (this._edges[i].from === v) {
        adjacencies.push(this._edges[i].to);
      } else if (this._edges[i].to === v) {
        adjacencies.push(this._edges[i].from);
      }
    }
    return adjacencies;
  }
  EdgeWeightedUndirectedGraph.prototype.getEdge = function(arg0, arg1) {
    let e = null;
    if (Array.isArray(arg0)) {
      // only 1 argument, and it's an array of values
      let v = arg0[0];
      let w = arg0[1];
      for (let i = this._edges.Length - 1; i >= 0; i--) {
        if ((this._edges[i].from == v && this._edges[i].to == w)
            || (this._edges[i].from == w && this._edges[i].to == v)) {
          e = this._edges[i];
          break;
        }
      }
    } else if (!isNaN(parseInt(arg0)) && !isNaN(parseInt(arg1))) {
      // 2 arguments
      let v = parseInt(arg0);
      let w = parseInt(arg1);
      for (let i = this._edges.Length - 1; i >= 0; i--) {
        if ((this._edges[i].from == v && this._edges[i].to == w)
            || (this._edges[i].from == w && this._edges[i].to == v)) {
          e = this._edges[i];
          break;
        }
      }
    } else {
      e = this._edges[parseInt(arg0)];
    }
    return e;
  }
  EdgeWeightedUndirectedGraph.prototype.getEmptyVertexSlot = function() {
    let index = -1;
    for (let i = 0, len = this._vertices.Length; i < len; i++) {
      if (this._vertices[i] == null) {
        index = i;
        break;
      } else if (this._vertices[i].index === -1) {
        index = i;
        break;
      }
    }
    return index;
  }
  EdgeWeightedUndirectedGraph.prototype.getVertex = function(id) {
    let v = null;
    for (let i = this._vertices.Length - 1; i >= 0; i--) {
      if (this._vertices[i].index == id)
      {
        v = this._vertices[i];
        break;
      }
    }
    return v;
  }
  EdgeWeightedUndirectedGraph.prototype.getVertexAdjacencies = function(id) {
    let adj = [];
    for (let i = this._edges.length - 1; i >= 0; i--) {
      if (this._edges[i].from == v
          || this._edges[i].to == v) {
        adj.push(this._edges[i]);
      }
    }
    return adj;
  }
  EdgeWeightedUndirectedGraph.prototype.hasEdge = function(arg0, arg1) {
    let exists = false;
    if (Array.isArray(arg0)) {
      // only 1 argument, and it's an array of values
      let v = arg0[0];
      let w = arg0[1];
      for (let i = this._edges.length - 1; i >= 0; i--) {
        if (this._edges[i].from == v && edges[i].to == w) {
            exists = true;
            break;
        }
        if (this._edges[i].from == w && edges[i].to == v) {
            exists = true;
            break;
        }
      }
    } else if (!isNaN(parseInt(arg0)) && !isNaN(parseInt(arg1))) {
      // 2 arguments
      let v = parseInt(arg0);
      let w = parseInt(arg1);
      for (let i = this._edges.length - 1; i >= 0; i--) {
        if (this._edges[i].from == v && edges[i].to == w) {
            exists = true;
            break;
        }
        if (this._edges[i].from == w && edges[i].to == v) {
            exists = true;
            break;
        }
      }
    } else {
      for (let i = this._edges.length - 1; i >= 0; i--) {
        if (this._edges[i].equalsUndirected(arg0)) {
          exists = true;
          break;
        }
      }
    }
    return exists;
  }
  EdgeWeightedUndirectedGraph.prototype.hasVertex = function(vertexId) {
    let exists = false;
    for (let i = this._vertices.length - 1; i >= 0; i--) {
      if (this._vertices[i].index === vertexId) {
        exists = true;
        break;
      }
    }
    return exists;
  }
  EdgeWeightedUndirectedGraph.prototype.removeEdge = function(v, w) {
    let removed = false;
    if (this.hasEdge(v, w)) {
      let i;
      for (i = this._edges.length - 1; i >= 0; i--) {
        if (this._edges[i].equalsUndirected(v, w)) {
          break;
        }
      }
      removed = true;
      this.edges.splice(index, 1);
    }
    return removed;
  }
}
 
/**
 * @class An edge is a pair of vertices, ordered or unordered.
 * @param {object} arg0 the first argument. can be either a Number, and Array of two Numbers, another GraphEdge, or an object containing defined values for 'from' and 'to'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 */
function GraphEdge(arg0, arg1) {
  /** @private the index of the 1st of the @see {@link GraphNode} this edge connects. */
  this._from;
  /** @private the index of the 1st of the @see {@link GraphNode} this edge connects. */
  this._to;
  this._debug = false;
  if (typeof(arg0) === "undefined") {
    if (this._debug) {
      console.trace();
    }
    throw "GraphEdge constructor requires at least one parameter object";
  }
  if (Array.isArray(arg0)) {
    if (arg0.length !== 2) {
      if (this._debug) {
        console.trace(arg0);
      }
      throw "GraphEdge constructor was supplied an array that did not have two integer values";
    }
    if (isNaN(parseInt(arg0[0])) || isNaN(parseInt(arg0[1]))) {
      if (this._debug) {
        console.trace(arg0);
      }
      throw "GraphEdge constructor requires two integer values";
    }
    this._from = arg0[0];
    this._to = arg0[1];
  } else {     
    if (!isNaN(parseInt(arg0))) {
      if (isNaN(parseInt(arg1))) {
        if (this._debug) {
          console.trace(arg0, arg1);
        }
        throw "GraphEdge constructor requires two integer values";
      }
      this._from = arg0;
      this._to = arg1;
    } else {
      if (isNaN(parseInt(arg0.from)) || isNaN(parseInt(arg0.to))) {
        if (this._debug) {
          console.trace(arg0);
        }
        throw "GraphEdge constructor requires two integer values";
      }
      this._from = arg0.from;
      this._to = arg0.to;
    }
  }
}
/** Getter for the node the edge leads from. */
Object.defineProperty(GraphEdge.prototype, 'from', {
  get() { return this._from; }
});
/** Getter for the node the edge leads to. */
Object.defineProperty(GraphEdge.prototype, 'to', {
  get() { return this._to; }
});
/**
 * Determines if this GraphEdge connects two nodes exactly in the direction provided.
 * @param {object} arg0 the first argument. can be either a Number, and Array of two Numbers, another GraphEdge, or an object containing defined values for 'from' and 'to'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 * @returns true if the edges connect the same nodes in the same direction; false otherwise
 */
GraphEdge.prototype.equalsDirected = function(arg0, arg1) {
  var equals = false;
  equals.toString();
  if (typeof(arg0) === "undefined") {
    if (this._debug) {
      console.trace();
    }
    throw "GraphEdge.equalsDirected() requires at least one parameter object";
  }
  if (Array.isArray(arg0)) {
    if (arg0.length !== 2) {
      if (this._debug) {
        console.trace(arg0);
      }
      throw "GraphEdge.equalsDirected() was supplied an array that did not have two integer values";
    }
    if (isNaN(parseInt(arg0[0])) || isNaN(parseInt(arg0[1]))) {
      if (this._debug) {
        console.trace(arg0);
      }
      throw "GraphEdge.equalsDirected() requires two integer values";
    }
    equals = this._from === arg0[0] && this._to === arg0[1];
  } else {
    if (!isNaN(parseInt(arg0))) {
      if (isNaN(parseInt(arg1))) {
        if (this._debug) {
          console.trace(arg0, arg1);
        }
        throw "GraphEdge.equalsDirected() requires two integer values";
      }
      equals = this._from === arg0 && this._to === arg1;
    } else {
      if (isNaN(parseInt(arg0.from)) || isNaN(parseInt(arg0.to))) {
        if (this._debug) {
          console.trace(arg0);
        }
        throw "GraphEdge.equalsDirected() requires two integer values";
      }
      equals = this._from === arg0.from && this._to === arg0.to;
    }
  }
  return equals;
}
/**
 * Determines if this GraphEdge connects the exact same two nodes.
 * @param {object} arg0 the first argument. can be either a Number, and Array of two Numbers, another GraphEdge, or an object containing defined values for 'from' and 'to'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 * @returns true if the edges connect the same nodes in the same direction; false otherwise
 */
GraphEdge.prototype.equalsUndirected = function(arg0, arg1) {
  var equals = false;
  if (typeof(arg0) === "undefined") {
    if (this._debug) {
      console.trace();
    }
    throw "GraphEdge.equalsUndirected() requires at least one parameter object";
  }
  if (Array.isArray(arg0)) {
    if (arg0.length !== 2) {
      if (this._debug) {
        console.trace(arg0);
      }
      throw "GraphEdge.equalsUndirected() was supplied an array that did not have two integer values";
    }
    if (isNaN(parseInt(arg0[0])) || isNaN(parseInt(arg0[1]))) {
      if (this._debug) {
        console.trace(arg0);
      }
      throw "GraphEdge.equalsUndirected() requires two integer values";
    }
    equals = (this._from === arg0[0] && this._to === arg0[1]) || (this._to === arg0[0] && this._from === arg0[1]);
  } else {
    if (!isNaN(parseInt(arg0))) {
      if (isNaN(parseInt(arg1))) {
        if (this._debug) {
          console.trace(arg0, arg1);
        }
        throw "GraphEdge.equalsUndirected() requires two integer values";
      }
      equals = (this._from === arg0 && this._to === arg1) || (this._to === arg0 && this._from === arg1);
    } else {
      if (isNaN(parseInt(arg0.from)) || isNaN(parseInt(arg0.to))) {
        if (this._debug) {
          console.trace(arg0);
        }
        throw "GraphEdge.equalsUndirected() requires two integer values";
      }
      equals = (this._from === arg0.from && this._to === arg0.to) || (this._to === arg0.from && this._from === arg0.to);
    }
  }
  return equals;
}
/**
 * Returns a string representation of an object.
 * @returns 
 */
GraphEdge.prototype.toString = function() {
  return ["[from=", this._from, ",to=", this._to, "]"].join("");
}
/**
 * @class An edge is a pair of vertices, ordered or unordered.
 * @param {object} arg0 the first argument. can be either a Number, and Array of two Numbers, another GraphEdge, or an object containing defined values for 'from' and 'to'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 */
function WeightedGraphEdge(parameterObject) {
  if (typeof(parameterObject) === "undefined") {
    console.trace();
    throw "WeightedGraphEdge constructor requires at least a parameter object";
  }
  GraphEdge.apply(this, [parameterObject]);
  this._cost = isNaN(parseFloat(parameterObject.cost)) ? 1 : parseFloat(parameterObject.cost);
}
WeightedGraphEdge.prototype = Object.create(GraphEdge.prototype);
WeightedGraphEdge.prototype.constructor = WeightedGraphEdge;
/** Getter for the edge cost. */
Object.defineProperty(WeightedGraphEdge.prototype, 'cost', {
  get() { return this._cost; }
});
/**
 * @class A vertex (plural vertices) or node is the fundamental unit of which graphs are formed.
 * @param {object} arg0 the first argument. can be either a Number, and Array of two Numbers, another GraphNode, or an object containing defined values for 'index' and possibly 'name'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 */
function GraphNode(arg0, arg1) {
  /** @private the GraphNode's Index. must be >= 0. */
  this._index = -1;
  /** @private the GraphNode's Name. can be null or undefined. */
  this._name;
  if (typeof(arg0) === "undefined") {
    console.trace();
    throw "GraphNode constructor requires at least one parameter object";
  }
  if (Array.isArray(arg0)) {
    if (arg0.length !== 1 && arg0.length !== 2) {
      console.trace(arg0);
      throw "GraphNode constructor was supplied an array that did not have one or two values";
    }
    if (isNaN(parseInt(arg0[0]))) {
      console.trace(arg0);
      throw "GraphNode constructor requires an integer value";
    }
    if (typeof(arg0[1]) !== "undefined") {
      if (typeof(arg0[1]) !== "string" && !(arg0[1] instanceof String)) {
        console.trace(arg0);
        throw "GraphNode constructor requires a string for the name";
      }
      this._name = arg0[1];
    }
    this._index = parseInt(arg0[0]);
  } else {
    if (!isNaN(parseInt(arg0))) {
      if (typeof(arg1) !== "undefined") {
        if (typeof(arg1) !== "string" && !(arg1 instanceof String)) {
          console.trace(arg1);
          throw "GraphNode constructor requires a string for the name";
        }
        this._name = arg1;
      }
      this._index = parseInt(arg0);
    } else {
      if (isNaN(parseInt(arg0.index))) {
        console.trace(arg0);
        throw "GraphNode constructor requires an integer value";
      }
      this._index = parseInt(arg0.index);
      if (typeof(arg0.name) !== "undefined") {
        if (typeof(arg0.name) !== "string" && !(arg0.name instanceof String)) {
          console.trace(arg0);
          throw "GraphNode constructor requires a string for the name";
        }
        this._name = arg0.name;
      }
    }
  }
}
/** Getter for the node's index'. */
Object.defineProperty(GraphNode.prototype, 'index', {
  get() { return this._index; }
});
/** Getter for the node's name'. */
Object.defineProperty(GraphNode.prototype, 'name', {
  get() { return this._name; }
});
/**
 * Determines if this GraphNode connects two nodes exactly in the direction provided.
 * @param {object} arg0 the first argument. can be either a Number, another GraphNode, or an object containing defined values for 'index'
 * @returns true if the node indices are the same
 */
GraphNode.prototype.equals = function(arg0) {
  if (typeof(arg0) === "undefined") {
    console.trace();
    throw "GraphNode.equals() requires at least a parameter object";
  }
  var equals = false;
  if (!isNaN(parseInt(arg0))) {
    equals = this._index === parseInt(arg0);
  } else {
    if (isNaN(parseInt(arg0.index))) {
      console.trace(arg0);
      throw "GraphNode constructor requires an integer value";
    }
    equals = this._index === parseInt(arg0.index);
  }
  return equals;
}
 

/**
 * @class A vertex (plural vertices) or node is the fundamental unit of which graphs are formed.
 * @param {object} arg0 the first argument. can be either a Number, and Array of two Numbers, another GraphNode, or an object containing defined values for 'index' and possibly 'name'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 */
function HexCoordinateSystem(config) {
  if (isNaN(parseInt(config))) {
    throw ["HexCoordinateSystem constructor requires an integer", config];
  }
  if (parseInt(config) < ODD_R || parseInt(config) > EVEN_Q) {
    throw ["HexCoordinateSystem constructor requires an integer between 0 and 3", config];
  }
  /** @private the list of Hexagons in the coordinate system. */
  this._hexes = [];
  /** @private the next available reference id. */
  this._nextId = 0;
  /** @private the system's offset configuration. */
  this._offsetConfiguration = parseInt(config);
}
{ // HexCoordinateSystem Getters/Setters
  /** Getter for the list of Hexagons in the coordinate system. */
  Object.defineProperty(HexCoordinateSystem.prototype, 'hexes', {
    get() { return this._hexes; }
  });
  /** Getter for the largest assigned Id. */
  Object.defineProperty(HexCoordinateSystem.prototype, 'maxHexId', {
    get() {
      var maxId = 0;
      for (var i = this._h.Length - 1; i >= 0; i--) {
        maxId = Math.max(maxId, _hexes[i].Id);
      }
      return maxId;
    }
  });
}
{ // HexCoordinateSystem closure
  HexCoordinateSystem.prototype.addHexagon = function(parameterObject) {
    if (typeof(parameterObject) === "undefined") {
      console.trace();
      throw "HexCoordinateSystem.addHexagon requires at least one argument";
    }
    if (parameterObject.hasOwnProperty("q") && parameterObject.hasOwnProperty("r")) {
      let hex = this.getHexagon(parameterObject.q, parameterObject.r);
      if (hex === null) {
        console.log(this)
        hex = new this.HexagonClass({ "id": this._nextId++, "isFlat": parameterObject.isFlat });
        hex.setCoordinates(this.getCubeCoordinates({ "q": parameterObject.q, "r": parameterObject.r }));
        this._hexes.push(hex);
      }
    } else if (parameterObject.hasOwnProperty("hex")) {
      switch (this._offsetConfiguration) {
        case ODD_R:
        case EVEN_R:
          if (parameterObject.hex.isFlat) {
            throw "Cannot have-flat topped hexagons with horizontal layout";
          }
          break;
        case ODD_Q:
        case EVEN_Q:
            if (!parameterObjecthex.isFlat()) {
              throw "Cannot have pointy topped hexagons with vertical layout";
            }
            break;
        default:
          throw ["Invalid offset coordinates ", this._offsetConfiguration];
      }
      let index = this._hexes.length - 1;
      for (; index >= 0; index--) {
        if (this._hexes[index] !== null && this._hexes[index].equals(hex)) {
            break;
        }
      }
      if (index >= 0) {
        this._hexes[index] = hex;
      } else {
        this._hexes.push(hex);
      }
      if (nextId <= hex.id) {
        nextId = hex.id + 1;
      }
    } else {
      throw "FIX THIS!!"
    }
  }
  /**
   * Gets the distance between two hexes.
   * @param {Hexagon} hex0 the first hexagon
   * @param {Hexagon} hex1 the second hexagon
   */
  HexCoordinateSystem.prototype.distance = function(hex0, hex1) {
    return (Math.abs(hex0.x - hex1.x) + Math.abs(hex0.y - hex1.y) + Math.abs(hex0.z - hex1.z)) / 2;
  }
  HexCoordinateSystem.prototype.getAxialCoordinates = function(v3) {
    let q, r;
    switch (this._offsetConfiguration) {
      case EVEN_Q:
        q = v3.x;
        r = v3.z + (v3.x + (v3.x & 1)) / 2;
        break;
      case ODD_Q:
        q = v3.x;
        r = v3.z + (v3.x - (v3.x & 1)) / 2;
        break;
      case EVEN_R:
        q = v3.x + (v3.z + (v3.z & 1)) / 2;
        r = v3.z;
        break;
      case ODD_R:
        q = v3.x + (v3.z - (v3.z & 1)) / 2;
        r = v3.z;
        break;
      default:
        console.trace();
        throw ["HexCoordinateSystem.getAxialCoordinates() Invalid offset configuration ", this._offsetConfiguration];
    }
    return new SimpleVector2(q, r);
  }
  HexCoordinateSystem.prototype.getCubeCoordinates = function(parameterObject) {
    let v3;
    if (parameterObject.hasOwnProperty("x")
        && parameterObject.hasOwnProperty("y")
        && parameterObject.hasOwnProperty("z")) {
      v3 = new SimpleVector3(parameterObject.x, parameterObject.y, parameterObject.z);
    } else if (parameterObject.hasOwnProperty("q")
        && parameterObject.hasOwnProperty("r")) {
      let q = parameterObject.q, r = parameterObject.r;
      v3 = new SimpleVector3(0, 0, 0);
      let x1, y1, z1;
      switch (this._offsetConfiguration) {
        case EVEN_Q:
          x1 = q;
          z1 = r - (q + (q & 1)) / 2;
          y1 = -x1 - z1;
          break;
        case ODD_Q:
          x1 = q;
          z1 = r - (q - (q & 1)) / 2;
          y1 = -x1 - z1;
          break;
        case EVEN_R:
          x1 = q - (r + (r & 1)) / 2;
          z1 = r;
          y1 = -x1 - z1;
          break;
        case ODD_R:
          x1 = q - (r - (r & 1)) / 2;
          z1 = r;
          y1 = -x1 - z1;
          break;
        default:
          console.trace();
          throw ["HexCoordinateSystem.getCubeCoordinates() - Invalid offset configuration ", this._offsetConfiguration];
      }
      v3.set(x1, y1, z1);
    } 
    return v3;
  }
  /**
   * Gets a hexagon at a specific set of coordinates.
   * @param {Number} x the x-coordinate
   * @param {Number} z the z-coordinate
   * @returns 
   */
  HexCoordinateSystem.prototype.getHexagon = function(q, r) {
    var hex = null;
    var v = this.getCubeCoordinates({ "q": q, "r": r });
    for (var i = this._hexes.length - 1; i >= 0; i--) {
      if (this._hexes[i].equals(v)) {
        hex = this._hexes[i];
        break;
      }
    }
    return hex;
  }
}
/** @private pre-calculated changes to find a hex's neighbor coordinates. */
const COMPOUND_NEIGHBORS = [
  new SimpleVector3(4, 5, -9),  // side 0
  new SimpleVector3(9, -4, -5), // side 1
  new SimpleVector3(5, -9, 4),  // side 2
  new SimpleVector3(-4, -5, 9), // side 3
  new SimpleVector3(-9, 4, 5),  // side 4
  new SimpleVector3(-5, 9, -4) // side 5
];
/** @private direction N. */
const DIRECTION_N = 0;
/** @private direction NNE. */
const DIRECTION_NNE = 1;
/** @private direction E. */
const DIRECTION_E = 2;
/** @private direction SSE. */
const DIRECTION_SSE = 3;
/** @private direction S. */
const  DIRECTION_S = 4;
/** @private direction SSW. */
const DIRECTION_SSW = 5;
/** @private direction W. */
const DIRECTION_W = 6;
/** @private direction NNW. */
const DIRECTION_NNW = 7;
/** @private layout for flat-topped hexagons where hex columns are aligned with even-numbered columns sticking out at the bottom.
 * <para>- -1,0- -3,0- -</para>
 * <para>0,0- -2,0- -4,0</para>
 * <para>- -1,1- -3,1- -</para>
 * <para>0,1- -2,1- -4,1</para>
 */
const EVEN_Q = 3;
/**
 * @private layout for pointy-topped hexagons where hex rows are aligned with even-numbered rows sticking out to the right.
 * <para>- -0,0- -1,0- -2,0</para>
 * <para>0,1- -1,1- -2,1- -</para>
 * <para>- -0,2- -1,2- -2,2</para>
 * <para>0,3- -1,3- -2,3- -</para>
 */
const EVEN_R = 1;
/** @private pre-calculated changes to find a hex's neighbor coordinates. */
const NEIGHBORS = [
  [ // ODD-R. 
    new SimpleVector3(1, 0, -1), // North. 
    new SimpleVector3(1, -1, 0), // NorthNorthEast. 
    new SimpleVector3(0, -1, 1), // SouthSouthEast. 
    new SimpleVector3(-1, 0, 1), // South. 
    new SimpleVector3(-1, 1, 0), // SouthSouthWest. 
    new SimpleVector3(0, 1, -1), // NorthNorthWest. 
  ],
  [ // EVEN_R. 
    new SimpleVector3(1, 0, -1), // North. 
    new SimpleVector3(1, -1, 0), // NorthNorthEast. 
    new SimpleVector3(0, -1, 1), // SouthSouthEast. 
    new SimpleVector3(-1, 0, 1), // South. 
    new SimpleVector3(-1, 1, 0), // SouthSouthWest. 
    new SimpleVector3(0, 1, -1), // NorthNorthWest. 
  ],
  [ // ODD_Q. 
    new SimpleVector3(0, 1, -1), // North. 
    new SimpleVector3(1, 0, -1), // NorthNorthEast. 
    new SimpleVector3(1, -1, 0), // SouthSouthEast. 
    new SimpleVector3(0, -1, 1), // South. 
    new SimpleVector3(-1, 0, 1), // SouthSouthWest. 
    new SimpleVector3(-1, 1, 0), // NorthNorthWest. 
  ],
  [ // EVEN_Q. 
    new SimpleVector3(0, 1, -1), // North. 
    new SimpleVector3(1, 0, -1), // NorthNorthEast. 
    new SimpleVector3(1, -1, 0), // SouthSouthEast. 
    new SimpleVector3(0, -1, 1), // South. 
    new SimpleVector3(-1, 0, 1), // SouthSouthWest. 
    new SimpleVector3(-1, 1, 0) // NorthNorthWest. 
  ]
];
/**
 * @private layout for flat-topped hexagons where hex columns are aligned with odd-numbered columns sticking out at the bottom.
 * <para>0,0- -2,0- -4,0</para>
 * <para>- -1,0- -3,0- -</para>
 * <para>0,1- -2,1- -4,1</para>
 * <para>- -1,1- -3,1- -</para>
 */
const ODD_Q = 2;
/**
 * @private layout for pointy-topped hexagons where hex rows are aligned with odd-numbered rows sticking out to the right
 * <para>0,0- -1,0- -2,0</para>
 * <para>- -0,1- -1,1- -2,1</para>
 * <para>0,2- -1,2- -2,2</para>
 * <para>- -0,3- -1,3- -2,3</para>
 */
const ODD_R = 0;

/**
 * @class The base member of a hexagonal grid coordinate system.
 * @param {object} parameterObject the defined parameters
 */
function Hexagon(parameterObject) {
  if (typeof(parameterObject) === "undefined") {
    console.trace();
    throw "Hexagon constructor requires a set of parameters";
  }
  /** @private hexagons have 6 corners; each corner is shared by two other hexagons. */
  this._corners = [
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1],
    [-1, -1]
  ];
  /** @private hexagons have 6 edges; each edge is shared by another hexagon. */
  this._edges = [-1, -1, -1, -1, -1, -1];
  /** @private the hexagon's orientation; flat or pointed on top. */
  this._flat = true;
  /** @private the hexagon's height. */
  this._height;
  /** @private the horizontal distance between adjacent hexes. */
  this._horizontalDistance;
  /** @private each hexagon has a unique id. */
  this._id
  /** @private the distance between a hexagon's center point and a corner. */
  this._size;
  /** @private the vertical distance between adjacent hexes. */
  this._verticalDistance;
  /** @private the hexagon's width. */
  this._width;
  this._x;
  this._y;
  this._size;
  
  if (!parameterObject.hasOwnProperty("id") || isNaN(parseInt(parameterObject.id))) {
    console.trace(parameterObject)
    throw "Hexagon constructor requires a setting for id";
  }
  this._id = parameterObject.id;

  if (typeof(parameterObject.isFlat) === "boolean") {
    this._flat = parameterObject.isFlat;
  }
  
  if (!isNaN(parseFloat(parameterObject.size)) && parseFloat(parameterObject.size) > 0) {
    this.setSize(parameterObject.size);
  }
}
{ // Hexagon Getters/Setters  
  /** Getter for the hexagon's coordinates'. */
  Object.defineProperty(Hexagon.prototype, 'coordinates', {
    get() { return new this.VectorClass(this._x, this._y, this._z); }
  });
  /** Getter for the hexagon's height. */
  Object.defineProperty(Hexagon.prototype, 'height', {
    get() { return this._height; }
  });
  /** Getter for the hexagon's id. */
  Object.defineProperty(Hexagon.prototype, 'id', {
    get() { return this._id; }
  });
  /** Getter for the hexagon's top, flat or pointy. */
  Object.defineProperty(Hexagon.prototype, 'isFlat', {
    get() { return this._flat; }
  });
  /** Getter for the hexagon's size. */
  Object.defineProperty(Hexagon.prototype, 'size', {
    get() { return this._size; }
  });
  /** Getter for the hexagon's x-coordinate. */
  Object.defineProperty(Hexagon.prototype, 'x', {
    get() { return this._x; }
  });
  /** Getter for the hexagon's y-coordinate. */
  Object.defineProperty(Hexagon.prototype, 'y', {
    get() { return this._y; }
  });
  /** Getter for the hexagon's z-coordinate. */
  Object.defineProperty(Hexagon.prototype, 'z', {
    get() { return this._z; }
  });
}
{ // Hexagon closure
  /**
   * Makes this <see cref="Hexagon"/> a copy of a specific <see cref="Hexagon"/>.
   * @param other the <see cref="Hexagon"/> being copied
   */
  Hexagon.prototype.copy = function(other) {
    this._size = other.size;
    this._x = other.x;
    this._y = other.y;
    this._z = other.z;
  }
  /**
   * Determines if this Hexagon equals another.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns true if the hexagons have the same coordinates
  */
  Hexagon.prototype.equals = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "GraphNode.equals() requires at least a parameter object";
    }
    let equals = false;
    if (Array.isArray(arg0)) {
      if (arg0.length !== 3) {
        console.trace(arg0);
        throw "Hexagon.equals() was supplied an array that did not have three values";
      }
      if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
        console.trace(arg0, arg1, arg2);
        throw "Hexagon.equals() requires three floating-point values";
      }
      equals = this.coordinates.equals(arg0[0], arg0[1], arg0[2]);
    } else {
      if (!isNaN(parseFloat(arg0))) {
        if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
          console.trace(arg0, arg1, arg2);
          throw "Hexagon.equals() requires three floating-point values";
        }
        equals = this.coordinates.equals(arg0, arg1, arg2);
      } else {
        if (arg0.hasOwnProperty("coordinates")) {
          equals = this.coordinates.equals(arg0.coordinates);
        } else {
          equals = this.coordinates.equals(arg0);
        }
      }
    }
    return equals;
  }
  /**
   * Rotates a hexagon 60 degrees to the right.
   */
  Hexagon.prototype.rotate = function() { this.coordinates.set(-this.coordinates.z, -this.coordinates.x, -this.coordinates.y); }
  /**
   * Sets the Hexagon's cube coordinates.
   * @param {object} parameterObject the method arguments
   */
  Hexagon.prototype.setCoordinates = function(parameterObject) {
    if (!isNaN(parseFloat(parameterObject.x)) && !isNaN(parseFloat(parameterObject.y)) && !isNaN(parseFloat(parameterObject.z))) {
      this._x = parameterObject.x;
      this._y = parameterObject.y;
      this._z = parameterObject.z;
    } else {
      throw "Hexagon.setCoordinates requires a variable with 3 floating-point values"
    }
  }
  /**
   * Sets the Hexagon's axial coordinates.
   * @param {Number} q the column
   * @param {Number} r the row
   */
  Hexagon.prototype.setCoordinatesOddQ = function(q, r) {
    this._x = q;
    this._z = r - (q - (q & 1)) / 2;
    this._y = -this._x - this._z;
  }
  /**
   * Sets the Hexagon's axial coordinates.
   * @param {Number} q the column
   * @param {Number} r the row
   */
  Hexagon.prototype.setCoordinatesOddR = function(q, r) {
    this._x = q - (r - (r & 1)) / 2;
    this._z = r;
    this._y = -this._x - this._z;
  }
  /**
   * Sets the Hexagon's axial coordinates.
   * @param {Number} q the column
   * @param {Number} r the row
   */
  Hexagon.prototype.setCoordinatesEvenQ = function(q, r) {
    this._x = q;
    this._z = r - (q + (q & 1)) / 2;
    this._y = -this._x - this._z;
  }
  /**
   * Sets the Hexagon's axial coordinates.
   * @param {Number} q the column
   * @param {Number} r the row
   */
  Hexagon.prototype.setCoordinatesEvenR = function(q, r) {
    this._x = q- (r + (r & 1)) / 2;
    this._z = r;
    this._y = -this._x - this._z;
  }
  /**
   * Sets the distance between a hexagon's center point and a corner.
   * @param {Number} the hexagon's new size
   */
  Hexagon.prototype.setSize = function(newSize) {
    if (isNaN(parseFloat(newSize))) {
      console.trace(newSize)
      throw "Hexagon.setSize requires a floating-point value";
    }
    this._size = newSize;
    if (this._flat) {
      this._width = this._size * 2;
      this._horizontalDistance = this._width * 0.75;
      this._height = (float)(Math.sqrt(3) / 2 * this._width);
      this._verticalDistance = this._height;
    } else {
      this._height = this._size * 2;
      this._verticalDistance = this._height * 0.75;
      this._width = (float)(Math.sqrt(3) / 2 * this._height);
      this._horizontalDistance = this._width;
    }
  }
}

/**
 * @class A hexagon tile structure that is constructed of @see Hexagon tiles.
 * @param {object} parameterObject the defined parameters
 */
 function CompoundHexagon(parameterObject) {
  if (typeof(parameterObject) === "undefined") {
    console.trace();
    throw "CompoundHexagon constructor requires a set of parameters";
  }
  /** @private the list of tiles that make up the hex. */
  this._hexes = [];
  /** @private the number of rotations applied to the @see CompoundHexagon. */
  this._rotations = 0;
  
  if (!parameterObject.hasOwnProperty("id") || isNaN(parseInt(parameterObject.id))) {
    console.trace(parameterObject)
    throw "CompoundHexagon constructor requires a setting for id";
  }
  Hexagon.call(this, parameterObject);
}
CompoundHexagon.prototype = Object.create(Hexagon.prototype);
CompoundHexagon.prototype.constructor = Hexagon;
{ // CompoundHexagon Getters/Setters
  /** Getter for the hexagon's rotations'. */
  Object.defineProperty(CompoundHexagon.prototype, 'rotations', {
    get() { return this._rotations; }
  });
  /** Getter for the hexagon's maximum x-coordinate'. */
  Object.defineProperty(CompoundHexagon.prototype, 'minX', {
    get() {     
      let minx = 999999; 
      for (let i = this._hexes.length - 1; i >= 0; i--) {
        minx = Math.min(minx, this._hexes[i].x);
      }
      return minx;
    }
  });
  /** Getter for the hexagon's maximum x-coordinate'. */
  Object.defineProperty(CompoundHexagon.prototype, 'maxX', {
    get() {     
      let maxx = -999999; 
      for (let i = this._hexes.length - 1; i >= 0; i--) {
        maxx = Math.max(maxx, this._hexes[i].x);
      }
      return maxx;
    }
  });
  /** Getter for the hexagon's maximum y-coordinate'. */
  Object.defineProperty(CompoundHexagon.prototype, 'minY', {
    get() {     
      let miny = 999999; 
      for (let i = this._hexes.length - 1; i >= 0; i--) {
        miny = Math.min(miny, this._hexes[i].y);
      }
      return miny;
    }
  });
  /** Getter for the hexagon's maximum y-coordinate'. */
  Object.defineProperty(CompoundHexagon.prototype, 'maxY', {
    get() {     
      let maxy = -999999; 
      for (let i = this._hexes.length - 1; i >= 0; i--) {
        maxy = Math.max(maxy, this._hexes[i].y);
      }
      return maxy;
    }
  });
}
{ // CompoundHexagon closure
  /**
   * Adds a hexagon to the instance.
   * @param hex the <see cref="Hexagon"/> being copied
   */
  CompoundHexagon.prototype.addHex = function(hex) {
    if (hex !== null) {
      this._hexes.push(hex);
    }
  }
  /**
   * Makes this <see cref="CompoundHexagon"/> a copy of a specific <see cref="CompoundHexagon"/>.
   * @param other the <see cref="CompoundHexagon"/> being copied
   */
  CompoundHexagon.prototype.copy = function(other) {
    if (typeof(hex) !== "CompoundHexagon" || !(hex instanceof CompoundHexagon)) {
      throw ["CompoundHexagon.copy requires an instance of CompoundHexagon"];
    }
    Hexagon.prototype.copy.call(this, hex);
    this._rotations = hex.rotations;
    this._hexes.length = 0;
    for (let i = 0, len = hex._hexes.length; i < len; i++) {
      let h = new Hexagon({
        "isFlat": hex._hexes[i].isFlat,
        "id": hex._hexes[i].id,
        "size": hex._hexes[i].size,
      });
      h.copy(hex._hexes[i]);
      this._hexes.push(h);
      h = null;
    }
  }
  /**
   * Determines if this Hexagon equals another.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns true if the hexagons have the same coordinates
   */
  CompoundHexagon.prototype.getCenterHexagon = function() {
    let maxx = -999999, minx = 999999, maxy = -999999, miny = 999999, maxz = -999999, minz = 999999;
    for (let i = this._hexes.length - 1; i >= 0; i--) {
      maxx = Math.max(maxx, this._hexes[i].x);
      minx = Math.min(minx, this._hexes[i].x);
      maxy = Math.max(maxy, this._hexes[i].y);
      miny = Math.min(miny, this._hexes[i].y);
      maxz = Math.max(maxz, this._hexes[i].z);
      minz = Math.min(minz, this._hexes[i].z);
    }
    return this.getHexagon({ "x": (maxx + minx) / 2, "y": (maxy + miny) / 2, "z": (maxz + minz) / 2 });
  }
  /**
   * Gets the Hexagon matching the supplied paramaters.
   * @param {object} parameterObject 
   */
  CompoundHexagon.prototype.getHexagon = function(parameterObject) {
    if (parameterObject.hasOwnProperty("index")) {
      return this._hexes[parameterObject.index];
    } else {
      let hex = null;
      for (let i = this._hexes.length - 1; i >= 0; i--) {
        if (this._hexes[i].equals(parameterObject.x, parameterObject.y, parameterObject.z)) {
            hex = this._hexes[i];
        }
      }
      return hex;
    }
  }
  CompoundHexagon.prototype.getNumberOfHexes = function() {
    return this._hexes.length;
  }
  CompoundHexagon.prototype.rotate = function() {
    for (let i = this._hexes.length - 1; i >= 0; i--) {
      this._hexes[i].rotate();
    }
    this._rotations++;
    if (this._rotations > 5) {
      this._rotations = 0;
    }
  }
}

/**
 * @class Priority queue for .
 * @param {Number} nmax the maximum number of elements.
 */
function IndexMinPQ(nmax) {
  /** @private maximum number of elements on PQ. */
  this._nmax;
  /** @private number of elements on PQ. */
  this._n;
  /** @private binary heap using 1-based indexing. */
  this._pq = [];
  /** @private inverse of pq - qp[pq[i]] = pq[qp[i]] = i. */
  this._qp = [];
  /** @private keys[i] = priority of i. */
  this._keys = [];

  if (isNaN(parseInt(nmax))) {
    throw ["IndexMinPQ.constructor requires an integer value", nmax];
  }
  if (parseInt(nmax) < 0) {
    throw ["IndexMinPQ.constructor requires a positive integer value", nmax];
  }

  this._nmax = nmax;
  // keys = new Key[NMAX + 1];    // make this of length NMAX??
  // pq = new int[NMAX + 1];
  // qp = new int[NMAX + 1];                   // make this of length NMAX??
  for (var i = 0; i <= nmax; i++) {
    this._qp.push(-1);
    this._pq.push(0);
    this._keys.push({});
  }
}
{ // IndexMinPQ Getters
  /** Getter for the number of elements. */
  Object.defineProperty(IndexMinPQ.prototype, 'count', {
    get() { return this._n; }
  });
  /** Determine if the priority queue is empty. */
  Object.defineProperty(IndexMinPQ.prototype, 'isEmpty', {
    get() { return this._n === 0; }
  });
  /** Getter for the minimum index. */
  Object.defineProperty(IndexMinPQ.prototype, 'minIndex', {
    get() {
      if (this.isEmpty) {
        throw "Priority queue underflow";
      }
      return this._pq[1];
    }
  });
  /** Getter for the minimum value. */
  Object.defineProperty(IndexMinPQ.prototype, 'minKey', {
    get() {
      if (this._n === 0) {
        throw "Priority queue underflow";
      }
      return this._keys[this._pq[1]];
    }
  });
}
{ // IndexMinPQ closure
  IndexMinPQ.prototype.change = function(i, key) {
    this.changeKey(i, key);
  }
  IndexMinPQ.prototype.changeKey = function(i, key) {
    if (isNaN(parseInt(nmax))) {
      throw ["IndexMinPQ.changeKey requires an integer value", i];
    }
    i = parseInt(i);
    if (i < 0 || i >= this._nmax) {
      throw ["IndexMinPQ.changeKey() - invalid index", i];
    }
    if (!this.contains(i)) {
        throw "IndexMinPQ.changeKey() - index is not in the priority queue";
    }
    this._keys[i] = key;
    this.swim(this._qp[i]);
    this.sink(this._qp[i]);
  }
  /**
   * Determines if the priority queue has a value set for a specific index.
   * @param {Number} i the index
   * @returns true if queue contains a value
   */
  IndexMinPQ.prototype.contains = function(i) {
    if (isNaN(parseInt(nmax))) {
      throw ["IndexMinPQ.contains requires an integer value", i];
    }
    i = parseInt(i);
    if (i < 0 || i >= this._nmax) {
      throw ["IndexMinPQ.contains() - invalid index", i];
    }
    return qp[i] != -1;
  }
  IndexMinPQ.prototype.delMin = function() {
    if (this._n == 0) {
      throw "Priority queue underflow";
    }
    var min = this._pq[1];
    this.exch(1, this._n--);
    this.sink(1);
    this._qp[min] = -1;            // delete
    this._keys[this._pq[this._n + 1]] = {};    // to help with garbage collection
    this._pq[this._n + 1] = -1;            // not needed
    return min;
  }
  IndexMinPQ.prototype.decreaseKey = function(i, key) {
    if (isNaN(parseInt(nmax))) {
      throw ["IndexMinPQ.decreaseKey requires an integer value", i];
    }
    i = parseInt(i);
    if (i < 0 || i >= this._nmax) {
      throw ["IndexMinPQ.decreaseKey() - invalid index", i];
    }
    if (!this.contains(i)) {
        throw "IndexMinPQ.decreaseKey() - index is not in the priority queue";
    }
    if (this._keys[i] <= key) {
      throw "IndexMinPQ.decreaseKey() - Calling DecreaseKey() with given argument would not strictly decrease the key";
    }
    this._keys[i] = key;
    this.swim(this._qp[i]);
  }
  IndexMinPQ.prototype.delete = function(i) {
    if (isNaN(parseInt(nmax))) {
      throw ["IndexMinPQ.delete requires an integer value", i];
    }
    i = parseInt(i);
    if (i < 0 || i >= this._nmax) {
      throw ["IndexMinPQ.delete() - invalid index", i];
    }
    if (!this.contains(i)) {
        throw "IndexMinPQ.delete() - index is not in the priority queue";
    }
    var index = this._qp[i];
    this.exch(index, this._n--);
    this.swim(index);
    this.sink(index);
    this._keys[i] = {};
    this._qp[i] = -1;
  }
  IndexMinPQ.prototype.exch = function(i, j) {
    var swap = this._pq[i];
    this._pq[i] = this._pq[j];
    this._pq[j] = swap;
    this._qp[this._pq[i]] = i;
    this._qp[this._pq[j]] = j;
  }
  IndexMinPQ.prototype.greater = function(i, j) {
    return this._keys[this._pq[i]] > this._keys[this._pq[j]];
  }
  IndexMinPQ.prototype.increaseKey = function(i, key) {
    if (isNaN(parseInt(nmax))) {
      throw ["IndexMinPQ.decreaseKey requires an integer value", i];
    }
    i = parseInt(i);
    if (i < 0 || i >= this._nmax) {
      throw ["IndexMinPQ.decreaseKey() - invalid index", i];
    }
    if (!this.contains(i)) {
        throw "IndexMinPQ.decreaseKey() - index is not in the priority queue";
    }
    if (this._keys[i] >= key) {
      throw "IndexMinPQ.decreaseKey() - Calling DecreaseKey() with given argument would not strictly decrease the key";
    }
    this._keys[i] = key;
    this.sink(this._qp[i]);
  }
  /**
   * Inserts a value into the priority queue at a specific index.
   * @param {Number} i the index
   * @param {object} key the value
   * @returns true if queue contains a value
   */
  IndexMinPQ.prototype.insert = function(i, key) {
    if (isNaN(parseInt(nmax))) {
      throw ["IndexMinPQ.insert requires an integer value", i];
    }
    i = parseInt(i);
    if (i < 0 || i >= this._nmax) {
      throw ["IndexMinPQ.insert() - invalid index", i];
    }
    if (this.contains(i)) {
      throw ["IndexMinPQ.insert() - index is already in the priority queue", i];
    }
    this._n++;
    this._qp[i] = this._n;
    this._pq[this._n] = i;
    this._keys[i] = key;
    this.swim(this._n);
  }
  IndexMinPQ.prototype.keyOf = function(i) {
    if (isNaN(parseInt(nmax))) {
      throw ["IndexMinPQ.keyOf requires an integer value", i];
    }
    i = parseInt(i);
    if (i < 0 || i >= this._nmax) {
      throw ["IndexMinPQ.keyOf() - invalid index", i];
    }
    if (!this.contains(i)) {
        throw "IndexMinPQ.keyOf() - index is not in the priority queue";
    }
    return this._keys[i];
  }  
  IndexMinPQ.prototype.sink = function(k) {
    while (2 * k <= this._n) {
      var j = 2 * k;
      if (j < this._n && this.greater(j, j + 1)) {
        j++;
      }
      if (!this.greater(k, j)) {
        break
      };
      this.exch(k, j);
      k = j;
    }
  }  
  IndexMinPQ.prototype.swim = function(k) {
    while (k > 1 && this.greater(k / 2, k)) {
      this.exch(k, k / 2);
      k = k / 2;
    }
  }
}
 
/**
 * @class A simple vector class with 3 coordinates.
 * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector2, or an object containing defined values for 'x', 'y', and 'z'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 * @param {Number} arg2 the third argument. should be either a Number or undefined
 */
 function SimpleVector2(arg0, arg1) {
  /** @private the SimpleVector2's x-coordinate. */
  this._x;
  /** @private the SimpleVector2's y-coordinate. */
  this._y;
  if (typeof(arg0) === "undefined") {
    console.trace();
    throw "SimpleVector2 constructor requires at least one parameter object";
  }
  if (Array.isArray(arg0)) {
    if (arg0.length !== 2) {
      console.trace(arg0);
      throw "SimpleVector2 constructor was supplied an array that did not have three values";
    }
    if (isNaN(parseFloat(arg0)) || isNaN(parseFloat(arg0[1]))) {
      console.trace(arg0);
      throw "SimpleVector2 constructor requires three integer values";
    }
    this._x = parseFloat(arg0[0]);
    this._y = parseFloat(arg0[1]);
  } else {
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1))) {
        console.trace(arg0, arg1);
        throw "SimpleVector2 constructor requires two flaoting-point values";
      }
      this._x = parseFloat(arg0);
      this._y = parseFloat(arg1);
    } else {
    
      if (isNaN(parseFloat(arg0.x))
          || isNaN(parseFloat(arg0.y))) {
        console.trace(arg0);
        throw "SimpleVector2 constructor requires two integer values";
      }
      this._x = parseFloat(arg0.x);
      this._y = parseFloat(arg0.y);
    }
  }
}
{ // SimpleVector2 Getters/Setters
  /** Getter for the vector's x-coordinate'. */
  Object.defineProperty(SimpleVector2.prototype, 'x', {
    get() { return this._x; },
    set(val) {
      if (isNaN(parseFloat(val))) {
        console.trace(val);
        throw ("SimpleVector2.x requires a Number value");
      }
      this._x = parseFloat(val);
    }
  });
  /** Getter for the vector's y-coordinate'. */
  Object.defineProperty(SimpleVector2.prototype, 'y', {
    get() { return this._y; },
    set(val) {
      if (isNaN(parseFloat(val))) {
        console.trace(val);
        throw ("SimpleVector2.y requires a Number value");
      }
      this._y = parseFloat(val);
    }
  });
  /** Getter for the vector's length'. */
  Object.defineProperty(SimpleVector2.prototype, 'length', {
    get() { return Math.Sqrt(this._x * this._x + this._y * this._y); }
  });
}
{ // SimpleVector2 closure
  /**
   * Calculates the distance between two <code>SimpleVector2</code>s.
   * @param {object} arg0 the first argument. can be either a Number, and Array of two Numbers, another SimpleVector2, or an object containing defined values for 'x' and 'y'.
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @returns {link} SimpleVector2
   */
   SimpleVector2.prototype.distance = function(arg0, arg1, arg2) {
   if (typeof(arg0) === "undefined") {
     console.trace();
     throw "SimpleVector2.distance() requires at least one parameter object";
   }
   let distance;
   if (!isNaN(parseFloat(arg0))) {
     if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
       console.trace(arg0, arg1, arg2);
       throw "SimpleVector2.distance() requires three integer values";
     }
     distance = Math.sqrt((arg0 - this._x) * (arg0 - this._x) + (arg1 - this._y) * (arg1 - this._y));
   } else {
     if (Array.isArray(arg0)) {
       if (arg0.length !== 2) {
         console.trace(arg0);
         throw "SimpleVector2.distance() was supplied an array that did not have two values";
       }
       if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1]))) {
         console.trace(arg0, arg1);
         throw "SimpleVector2.distance() requires two integer values";
       }
       distance = Math.sqrt((arg0[0] - this._x) * (arg0[0] - this._x) + (arg0[1] - this._y) * (arg0[1] - this._y));
     } else {
       if (isNaN(parseFloat(arg0.x))
           || isNaN(parseFloat(arg0.y))) {
         console.trace(arg0);
         throw "SimpleVector2.distance() requires two integer values";
       }
       distance = Math.sqrt((arg0.x - this._x) * (arg0.x - this._x) + (arg0.y - this._y) * (arg0.y - this._y));
     }
   }
   return distance;
 }
  /**
   * Determines if this SimpleVector2 equals another.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @returns true if the vectors are the same
   */
   SimpleVector2.prototype.equals = function(arg0, arg1) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "GraphNode.equals() requires at least a parameter object";
    }
    let equals = false;
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1))) {
        console.trace(arg0, arg1);
        throw "SimpleVector3.equals() requires two Number values";
      }
      equals = this._x === arg0 && this._y === arg1;
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 2) {
          console.trace(arg0);
          throw "SimpleVector2.equals() was supplied an array that did not have two values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1]))) {
          console.trace(arg0, arg1);
          throw "SimpleVector2.equals() requires two Number values";
        }
        equals = this._x === arg0[0] && this._y === arg0[1];
      } else {
        if (isNaN(parseFloat(arg0.x))
            || isNaN(parseFloat(arg0.y))) {
          console.trace(arg0);
          throw "SimpleVector2.equals() requires two Number values";
        }
        equals = this._x === arg0.x && this._y === arg0.y;
      }
    }
    return equals;
  }
  /**
   * Sets the vector values.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
   SimpleVector2.prototype.set = function(arg0, arg1) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector2.set() requires at least one parameter object";
    }
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1))) {
        console.trace(arg0, arg1);
        throw "SimpleVector2.set() requires two integer values";
      }
      this._x = arg0;
      this._y = arg1;
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 2) {
          console.trace(arg0);
          throw "SimpleVector2.set() was supplied an array that did not have two values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1]))) {
          console.trace(arg0, arg1);
          throw "SimpleVector2.set() requires two integer values";
        }
        this._x = arg0[0];
        this._y = arg1[1];
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))) {
          console.trace(arg0);
          throw "SimpleVector2.set() requires two integer values";
        }
        this._x = arg0.x;
        this._y = arg0.y;
      }
    }
  }
  /**
   * Returns a string representation of an object.
   * @returns 
   */
  SimpleVector2.prototype.toString = function() {
    return ["[x=", this._x, ",y=", this._y, "]"].join("");
  }
}

/**
 * @class A simple vector class with 3 coordinates.
 * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
 * @param {Number} arg1 the second argument. should be either a Number or undefined
 * @param {Number} arg2 the third argument. should be either a Number or undefined
 */
 function SimpleVector3(arg0, arg1, arg2) {
  /** @private the SimpleVector3's x-coordinate. */
  this._x;
  /** @private the SimpleVector3's x-coordinate. */
  this._y;
  /** @private the SimpleVector3's x-coordinate. */
  this._z;
  if (typeof(arg0) === "undefined") {
    console.trace();
    throw "SimpleVector3 constructor requires at least one parameter object";
  }
  if (Array.isArray(arg0)) {
    if (arg0.length !== 3) {
      console.trace(arg0);
      throw "SimpleVector3 constructor was supplied an array that did not have three values";
    }
    if (isNaN(parseFloat(arg0)) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
      console.trace(arg0);
      throw "SimpleVector3 constructor requires three integer values";
    }
    this._x = parseFloat(arg0[0]);
    this._y = parseFloat(arg0[1]);
    this._z = parseFloat(arg0[2]);
  } else {
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3 constructor requires three integer values";
      }
      this._x = parseFloat(arg0);
      this._y = parseFloat(arg1);
      this._z = parseFloat(arg2);
    } else {
    
      if (isNaN(parseFloat(arg0.x))
          || isNaN(parseFloat(arg0.y))
          || isNaN(parseFloat(arg0.z))) {
        console.trace(arg0);
        throw "SimpleVector3 constructor requires three integer values";
      }
      this._x = parseFloat(arg0.x);
      this._y = parseFloat(arg0.y);
      this._z = parseFloat(arg0.z);
    }
  }
}
{ // SimpleVector3 Getters/Setters
  /** Getter for the vector's x-coordinate'. */
  Object.defineProperty(SimpleVector3.prototype, 'x', {
    get() { return this._x; }
  });
  /** Getter for the vector's y-coordinate'. */
  Object.defineProperty(SimpleVector3.prototype, 'y', {
    get() { return this._y; }
  });
  /** Getter for the vector's z-coordinate'. */
  Object.defineProperty(SimpleVector3.prototype, 'z', {
    get() { return this._z; }
  });
  /** Getter for the vector's length'. */
  Object.defineProperty(SimpleVector3.prototype, 'length', {
    get() { return Math.Sqrt(this._x * this._x + this._y * this._y + this._z * this._z); }
  });
  /** Getter for the normal angle'. */
  Object.defineProperty(SimpleVector3.prototype, 'normal', {
    get() {
      let length;
      if (this.length === 0) {
        length = 0;
      } else {
        length = 1 / this.length;
      }
      return new SimpleVector3(this._x * length, this._y * length, this._z * length);
    }
  });
}
{ // SimpleVector3 closure
  /**
   * Subtracts the values of another SimpleVector3 and returns a new SimpleVector3.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.minus = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.minus() requires at least one parameter object";
    }
    let newVector;
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.minus() requires three integer values";
      }
      newVector = new SimpleVector3(
        this._x - parseFloat(arg0),
        this._y - parseFloat(arg1),
        this._z - parseFloat(arg2)
      );
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.minus() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.minus() requires three integer values";
        }
        newVector = new SimpleVector3(
          this._x - parseFloat(arg0[0]),
          this._y - parseFloat(arg0[1]),
          this._z - parseFloat(arg0[2])
        );
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.plminusus() requires three integer values";
        }
        newVector = new SimpleVector3(
          this._x - parseFloat(arg0.x),
          this._y - parseFloat(arg0.y),
          this._z - parseFloat(arg0.z)
        );
      }
    }
    return newVector;
  }
  /**
   * Adds the values of another SimpleVector3 and returns a new SimpleVector3.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.plus = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.plus() requires at least one parameter object";
    }
    let newVector;
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.plus() requires three integer values";
      }
      newVector = new SimpleVector3(
        this._x + parseFloat(arg0),
        this._y + parseFloat(arg1),
        this._z + parseFloat(arg2)
      );
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.plus() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.plus() requires three integer values";
        }
        newVector = new SimpleVector3(
          this._x + parseFloat(arg0[0]),
          this._y + parseFloat(arg0[1]),
          this._z + parseFloat(arg0[2])
        );
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.plus() requires three integer values";
        }
        newVector = new SimpleVector3(
          this._x + parseFloat(arg0.x),
          this._y + parseFloat(arg0.y),
          this._z + parseFloat(arg0.z)
        );
      }
    }
    return newVector;
  }
  /**
   * Cross product - used to calculate the normal.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.crossProduct = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.crossProduct() requires at least one parameter object";
    }
    let newVector;
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.crossProduct() requires three integer values";
      }
      newVector = new SimpleVector3(
        this._y * parseFloat(arg2) - this._z * parseFloat(arg1),
        this._z * parseFloat(arg0) - this._x * parseFloat(arg2),
        this._x + parseFloat(arg1) - this._y * parseFloat(arg0)
      );
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.crossProduct() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.crossProduct() requires three integer values";
        }
        newVector = new SimpleVector3(
          this._y * parseFloat(arg0[2]) - this._z * parseFloat(arg0[1]),
          this._z * parseFloat(arg0[0]) - this._x * parseFloat(arg0[2]),
          this._x + parseFloat(arg0[1]) - this._y * parseFloat(arg0[0])
        );
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.crossProduct() requires three integer values";
        }
        newVector = new SimpleVector3(
          this._y * parseFloat(arg0.z) - this._z * parseFloat(arg0.y),
          this._z * parseFloat(arg0.x) - this._x * parseFloat(arg0.z),
          this._x + parseFloat(arg0.y) - this._y * parseFloat(arg0.x)
        );
      }
    }
    return newVector;
  }
  /**
   * Decrements the SimpleVector3.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.decrement = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.decrement() requires at least one parameter object";
    }
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.decrement() requires three integer values";
      }
      this._x -= parseFloat(arg0);
      this._y -= parseFloat(arg1);
      this._z -= parseFloat(arg2);
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.decrement() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.decrement() requires three integer values";
        }
        this._x -= parseFloat(arg0[0]);
        this._y -= parseFloat(arg0[1]);
        this._z -= parseFloat(arg0[2]);
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.decrement() requires three integer values";
        }
        this._x -= parseFloat(arg0.x);
        this._y -= parseFloat(arg0.y);
        this._z -= parseFloat(arg0.z);
      }
    }
  }
  /**
   * Increments the SimpleVector3.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.increment = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.increment() requires at least one parameter object";
    }
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.increment() requires three integer values";
      }
      this._x += parseFloat(arg0);
      this._y += parseFloat(arg1);
      this._z += parseFloat(arg2);
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.increment() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.increment() requires three integer values";
        }
        this._x += parseFloat(arg0[0]);
        this._y += parseFloat(arg0[1]);
        this._z += parseFloat(arg0[2]);
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.increment() requires three integer values";
        }
        this._x += parseFloat(arg0.x);
        this._y += parseFloat(arg0.y);
        this._z += parseFloat(arg0.z);
      }
    }
  }
  /**
   * Calculates the distance between two <code>Vector3</code>s.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.distance = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.distance() requires at least one parameter object";
    }
    let distance;
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.distance() requires three integer values";
      }
      distance = Math.sqrt((arg0 - this._x) * (arg0 - this._x) + (arg1 - this._y) * (arg1 - this._y));
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.distance() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.distance() requires three integer values";
        }
        distance = Math.sqrt((arg0[0] - this._x) * (arg0[0] - this._x) + (arg0[1] - this._y) * (arg0[1] - this._y));
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.distance() requires three integer values";
        }
        distance = Math.sqrt((arg0.x - this._x) * (arg0.x - this._x) + (arg0.y - this._y) * (arg0.y - this._y));
      }
    }
    return distance;
  }
  /**
   * Divides one vector by another.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.divide = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.divide() requires at least one parameter object";
    }
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.divide() requires three integer values";
      }
      this._x /= parseFloat(arg0);
      this._y /= parseFloat(arg1);
      this._z /= parseFloat(arg2);
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.divide() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.divide() requires three integer values";
        }
        this._x /= parseFloat(arg0[0]);
        this._y /= parseFloat(arg0[1]);
        this._z /= parseFloat(arg0[2]);
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.divide() requires three integer values";
        }
        this._x /= parseFloat(arg0.x);
        this._y /= parseFloat(arg0.y);
        this._z /= parseFloat(arg0.z);
      }
    }
  }
  /**
   * Multiplies one vector by another.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.multiply = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.multiply() requires at least one parameter object";
    }
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.multiply() requires three integer values";
      }
      this._x *= parseFloat(arg0);
      this._y *= parseFloat(arg1);
      this._z *= parseFloat(arg2);
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.multiply() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.multiply() requires three integer values";
        }
        this._x *= parseFloat(arg0[0]);
        this._y *= parseFloat(arg0[1]);
        this._z *= parseFloat(arg0[2]);
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.multiply() requires three integer values";
        }
        this._x *= parseFloat(arg0.x);
        this._y *= parseFloat(arg0.y);
        this._z *= parseFloat(arg0.z);
      }
    }
  }
  /**
   * Gets the dot/scalar product: the difference between two directions.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.dotProduct = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.dotProduct() requires at least one parameter object";
    }
    let dotProduct;
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.dotProduct() requires three integer values";
      }
      dotProduct = this._x * arg0 + this._y * arg1 + this._z * arg2;
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.dotProduct() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.dotProduct() requires three integer values";
        }
        dotProduct = this._x * arg0[0] + this._y * arg0[1] + this._z * arg0[2];
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.dotProduct() requires three integer values";
        }
        dotProduct = this._x * arg0.x + this._y * arg0.y + this._z * arg0.z;
      }
    }
    return dotProduct;
  }
  /**
   * Determines if this SimpleVector3 equals another.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns true if the node indices are the same
   */
  SimpleVector3.prototype.equals = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "GraphNode.equals() requires at least a parameter object";
    }
    let equals = false;
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.dotProduct() requires three integer values";
      }
      equals = this._x === arg0 && this._y === arg1 && this._z === arg2;
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.dotProduct() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.dotProduct() requires three integer values";
        }
        equals = this._x === arg0[0] && this._y === arg0[1] && this._z === arg0[2];
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.dotProduct() requires three integer values";
        }
        equals = this._x === arg0.x && this._y === arg0.y && this._z === arg0.z;
      }
    }
    return equals;
  }
  /**
   * Sets the vector values.
   * @param {object} arg0 the first argument. can be either a Number, and Array of three Numbers, another SimpleVector3, or an object containing defined values for 'x', 'y', and 'z'
   * @param {Number} arg1 the second argument. should be either a Number or undefined
   * @param {Number} arg2 the third argument. should be either a Number or undefined
   * @returns {link} SimpleVector3
   */
  SimpleVector3.prototype.set = function(arg0, arg1, arg2) {
    if (typeof(arg0) === "undefined") {
      console.trace();
      throw "SimpleVector3.set() requires at least one parameter object";
    }
    if (!isNaN(parseFloat(arg0))) {
      if (isNaN(parseFloat(arg1)) || isNaN(parseFloat(arg2))) {
        console.trace(arg0, arg1, arg2);
        throw "SimpleVector3.set() requires three integer values";
      }
      this._x = arg0;
      this._y = arg1;
      this._z = arg2;
    } else {
      if (Array.isArray(arg0)) {
        if (arg0.length !== 3) {
          console.trace(arg0);
          throw "SimpleVector3.set() was supplied an array that did not have three values";
        }
        if (isNaN(parseFloat(arg0[0])) || isNaN(parseFloat(arg0[1])) || isNaN(parseFloat(arg0[2]))) {
          console.trace(arg0, arg1, arg2);
          throw "SimpleVector3.set() requires three integer values";
        }
        this._x = arg0[0];
        this._y = arg1[1];
        this._z = arg2[2];
      } else {
        if (!arg0.hasOwnProperty("x")
            || isNaN(parseFloat(arg0.x))
            || !arg0.hasOwnProperty("y")
            || isNaN(parseFloat(arg0.y))
            || !arg0.hasOwnProperty("z")
            || isNaN(parseFloat(arg0.z))) {
          console.trace(arg0);
          throw "SimpleVector3.set() requires three integer values";
        }
        this._x = arg0.x;
        this._y = arg0.y;
        this._z = arg0.z;
      }
    }
  }
  /**
   * Returns a string representation of an object.
   * @returns 
   */
  SimpleVector3.prototype.toString = function() {
    return ["[x=", this._x, ",y=", this._y, ",z=", this._z, "]"].join("");
  }
}

/**
 * @class Utility class used to break a scene's viewport into a grid of cells. Useful for positioning text and buttons.
 * @param {object} parameterObject optional initialization parameters
 */
function AlignmentGrid(parameterObject) {
  /** @private The parent object used to determine the screen dimensions. If a Phaser.Scene instance is not supplied it defaults to the Phaser.Game instance. */
  this._parent = null;
  /** @private The # of cells wide the grid should be. */
  this._cellWidth = 0;
  /** @private The # of cells high the grid should be. */
  this._cellHeight = 0;
  
  this._parent = parameterObject.parent;
  this._cellWidth = this._parent.scale.width / parameterObject.columns;
  this._cellHeight = this._parent.scale.height / parameterObject.rows;
};
AlignmentGrid.prototype = Object.create(Phaser.GameObjects.Group.prototype);
AlignmentGrid.prototype.constructor = Phaser.GameObjects.Group;
{ // AlignmentGrid Getters/Setters
}
/**
 * Places an object in relation to the grid.
 * @param {Number} x the x-coordinate of the cell where the object should be placed
 * @param {Number} y the y-coordinate of the cell where the object should be placed
 * @param {Phaser.GameObjects.GameObject} obj game object being placed
 */
AlignmentGrid.prototype.placeAt = function(x, y, obj) {
  //calculate the center of the cell
  //by adding half of the height and width
  //to the x and y of the coordinates
  let x2 = this._cellWidth * x + this._cellWidth / 2;
  let y2 = this._cellHeight * y + this._cellHeight / 2;
  obj.x = x2;
  obj.y = y2;
}
/**
 * Draws a red border demarcating the grid cells.
 */
AlignmentGrid.prototype.show = function() {
  if (typeof(this.graphics) === "undefined") {
    this.graphics = this._parent.add.graphics({ lineStyle: { width: 4, color: 0xff0000, alpha: 1 } });
  }
  for (let i = 0; i <= this._parent.scale.width; i += this._cellWidth) {
    let line = new Phaser.Geom.Line(i, 0, i, this._parent.scale.height);
    this.graphics.strokeLineShape(line);
  }
  for (let i = 0; i <= this._parent.scale.height; i += this._cellHeight) {
    let line = new Phaser.Geom.Line(0, i, this._parent.scale.width, i);
    this.graphics.strokeLineShape(line);
  }
}

/**
 * @class The base class for a card game.
 */
function CardGame() {
  /** @private the current hand being played. */
  this._currentCards = [];
  /** @private the discard pile. */
  this._discard = [];
  /** @private the deck of cards. */
  this._deck = [
     { "suit": "CLUBS", "rank": 2, "rankName": "2", "name": "TWO OF CLUBS" },
     { "suit": "CLUBS", "rank": 3, "rankName": "3", "name": "THREE OF CLUBS" },
     { "suit": "CLUBS", "rank": 4, "rankName": "4", "name": "FOUR OF CLUBS" },
     { "suit": "CLUBS", "rank": 5, "rankName": "5", "name": "FIVE OF CLUBS" },
     { "suit": "CLUBS", "rank": 6, "rankName": "6", "name": "SIX OF CLUBS" },
     { "suit": "CLUBS", "rank": 7, "rankName": "7", "name": "SEVEN OF CLUBS" },
     { "suit": "CLUBS", "rank": 8, "rankName": "8", "name": "EIGHT OF CLUBS" },
     { "suit": "CLUBS", "rank": 9, "rankName": "9", "name": "NINE OF CLUBS" },
     { "suit": "CLUBS", "rank": 10, "rankName": "10", "name": "TEN OF CLUBS" },
     { "suit": "CLUBS", "rank": 11, "rankName": "J", "name": "JACK OF CLUBS" },
     { "suit": "CLUBS", "rank": 12, "rankName": "Q", "name": "QUEEN OF CLUBS" },
     { "suit": "CLUBS", "rank": 13, "rankName": "K", "name": "KING OF CLUBS" },
     { "suit": "CLUBS", "rank": 14, "rankName": "A", "name": "ACE OF CLUBS" },
     { "suit": "DIAMONDS", "rank": 2, "rankName": "2", "name": "TWO OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 3, "rankName": "3", "name": "THREE OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 4, "rankName": "4", "name": "FOUR OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 5, "rankName": "5", "name": "FIVE OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 6, "rankName": "6", "name": "SIX OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 7, "rankName": "7", "name": "SEVEN OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 8, "rankName": "8", "name": "EIGHT OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 9, "rankName": "9", "name": "NINE OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 10, "rankName": "10", "name": "TEN OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 11, "rankName": "J", "name": "JACK OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 12, "rankName": "Q", "name": "QUEEN OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 13, "rankName": "K", "name": "KING OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 14, "rankName": "A", "name": "ACE OF DIAMONDS" },
     { "suit": "HEARTS", "rank": 2, "rankName": "2", "name": "TWO OF HEARTS" },
     { "suit": "HEARTS", "rank": 3, "rankName": "3", "name": "THREE OF HEARTS" },
     { "suit": "HEARTS", "rank": 4, "rankName": "4", "name": "FOUR OF HEARTS" },
     { "suit": "HEARTS", "rank": 5, "rankName": "5", "name": "FIVE OF HEARTS" },
     { "suit": "HEARTS", "rank": 6, "rankName": "6", "name": "SIX OF HEARTS" },
     { "suit": "HEARTS", "rank": 7, "rankName": "7", "name": "SEVEN OF HEARTS" },
     { "suit": "HEARTS", "rank": 8, "rankName": "8", "name": "EIGHT OF HEARTS" },
     { "suit": "HEARTS", "rank": 9, "rankName": "9", "name": "NINE OF HEARTS" },
     { "suit": "HEARTS", "rank": 10, "rankName": "10", "name": "TEN OF HEARTS" },
     { "suit": "HEARTS", "rank": 11, "rankName": "J", "name": "JACK OF HEARTS" },
     { "suit": "HEARTS", "rank": 12, "rankName": "Q", "name": "QUEEN OF HEARTS" },
     { "suit": "HEARTS", "rank": 13, "rankName": "K", "name": "KING OF HEARTS" },
     { "suit": "HEARTS", "rank": 14, "rankName": "A", "name": "ACE OF HEARTS" },
     { "suit": "SPADES", "rank": 2, "rankName": "2", "name": "TWO OF SPADES" },
     { "suit": "SPADES", "rank": 3, "rankName": "3", "name": "THREE OF SPADES" },
     { "suit": "SPADES", "rank": 4, "rankName": "4", "name": "FOUR OF SPADES" },
     { "suit": "SPADES", "rank": 5, "rankName": "5", "name": "FIVE OF SPADES" },
     { "suit": "SPADES", "rank": 6, "rankName": "6", "name": "SIX OF SPADES" },
     { "suit": "SPADES", "rank": 7, "rankName": "7", "name": "SEVEN OF SPADES" },
     { "suit": "SPADES", "rank": 8, "rankName": "8", "name": "EIGHT OF SPADES" },
     { "suit": "SPADES", "rank": 9, "rankName": "9", "name": "NINE OF SPADES" },
     { "suit": "SPADES", "rank": 10, "rankName": "10", "name": "TEN OF SPADES" },
     { "suit": "SPADES", "rank": 11, "rankName": "J", "name": "JACK OF SPADES" },
     { "suit": "SPADES", "rank": 12, "rankName": "Q", "name": "QUEEN OF SPADES" },
     { "suit": "SPADES", "rank": 13, "rankName": "K", "name": "KING OF SPADES" },
     { "suit": "SPADES", "rank": 14, "rankName": "A", "name": "ACE OF SPADES" }
  ];
}
/**
 * Draws a random card from the deck.
 */
CardGame.prototype.drawCard = function() {
  return this._deck.splice(Dice.getRandomIndex(this._deck), 1)[0];
}
/**
 * Shuffles all discarded cards back into the deck.
 */
CardGame.prototype.shuffleDeck = function() {
  for (let i = this._discard.length - 1; i >= 0; i--) {
    this._deck.push(this._discard.splice(i, 1)[0]);
  }
}
/**
 * @class Base class for a Phaser.Scene that will be used for the UI.
 * @param {object} parameterObject optional initialization parameters
 */
function UiScene(parameterObject) {
  /** @private the game state. */
  this._state;
  /** @private the UI placement grid. */
  this._gridLayout = {
    columns: parameterObject.columns,
    rows: parameterObject.rows,
    show: parameterObject.show
  }
  /** @private the alignment grid instance. */
  this._grid;
  /** @private flag indicating whether setup has been completed. */
  this._setupComplete = false;
  /** @private the parent's Phaser.Scene instance */
  this._scene = parameterObject;
  if (parameterObject.hasOwnProperty("scene")) {
    this._scene = parameterObject.scene;
  }
  /** @private flag used to track changes to the game state. Initial state is false in order to trigger display of the Intro View after setup. */
  this._stateChangeResolved = false;
  /** @private the dictionary of dynamic fields to track */
  this._dynamicFields = (function() {
    /** @private the object dictionary */
    let _dictionary = {};
    return {
      /**
       * If this Game Object has previously been enabled for input, this will disable it.
       * @param {string} key the entry key
       */
      disableInteractive(key) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].disableInteractive();
        }
      },
      /**
       * Places a key-value pair into storage.
       * @param {string} key the entry key
       * @param {Phaser.GameObjects.GameObject} value the entry value
       */
      put: function(key, value) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          console.log(typeof(key), key instanceof String)
          throw ["Invalid key", key];
        }
        if (typeof(value) === "undefined") {
          throw ["Invalid value", value];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          _dictionary[key] = [];
        }
        _dictionary[key].push(value);
      },
      /**
       * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders. Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
       * @param {string} key the entry key
       * @param {number} topLeft The alpha value used for the top-left of the Game Object. If this is the only value given it's applied across the whole Game Object.
       * @param {number} topRight The alpha value used for the top-right of the Game Object. WebGL only.
       * @param {number} bottomLeft The alpha value used for the bottom-left of the Game Object. WebGL only.
       * @param {number} bottomRight The alpha value used for the bottom-right of the Game Object. WebGL only.
       */
      setAlpha: function(key, topLeft, topRight, bottomLeft, bottomRight) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setAlpha(topLeft, topRight, bottomLeft, bottomRight);
        }
      },
      /**
       * Pass this Game Object to the Input Manager to enable it for Input.
       * @param {string} key the entry key
       * @param {Phaser.Types.Input.InputConfiguration|*} hitArea Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not given it will try to create a Rectangle based on the texture frame.
       * @param {Phaser.Types.Input.HitAreaCallback} callback The callback that determines if the pointer is within the Hit Area shape or not. If you provide a shape you must also provide a callback.
       * @param {boolean} dropZone Should this Game Object be treated as a drop zone target?
       */
      setInteractive: function(key, hitArea, callback, dropZone) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setInteractive(hitArea, callback, dropZone);
        }
      },
      /**
       * Set the textual content of the stored GameObject.
       * @param {string} key the entry key
       * @param {string|Array.<string>} text The string, or array of strings, to be set as the content of the text item.
       */
      setText: function(key, text) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setText(text);
        }
      },
      /**
       * Sets an additive tint on this Game Object.
       * @param {string} key the entry key
       * @param {number} topLeft The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
       * @param {number} topRight The tint being applied to the top-right of the Game Object.
       * @param {number} bottomLeft The tint being applied to the bottom-left of the Game Object.
       * @param {number} bottomRight The tint being applied to the bottom-right of the Game Object.
       */
      setTint: function(key, topLeft, topRight, bottomLeft, bottomRight) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setTint(topLeft, topRight, bottomLeft, bottomRight);
        }
      },
      getObject: function(key) { return _dictionary[key]; }
    }
  }());
  /** @private the dictionary of game views. */
  this._VIEWS = {};
  /** @private The dictionary of 'key up' event handlers. Keys are the menu states. */
  this._KEY_UP_EVENT_HANDLERS = {};
  
  Watcher.apply(this);
}
UiScene.prototype = Object.create(Phaser.Scene.prototype);
UiScene.prototype.constructor = Phaser.Scene;
Object.assign(UiScene.prototype, Watcher.prototype);
/**
 * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
 * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
UiScene.prototype.create = function(data) {
  // create a grid for laying out elements
  this._grid = new AlignmentGrid({
    parent: this._scene,
    columns: this._gridLayout.columns,
    rows: this._gridLayout.rows
  });
  //turn on the lines for testing
  //and layout
  if (this._gridLayout.show) {
    this._grid.show();
  }
  /** @private the width of a column. */
  this._COLUMN_WIDTH = this._scene.scale.width / this._gridLayout.columns;
  /** @private the height of a column. */
  this._ROW_HEIGHT = this._scene.scale.height / this._gridLayout.rows;
  
  // create groups for each state. when the state is switched, objects will be hidden/shown by group
  let keys = Object.keys(this._VIEWS);
  keys.sort();
  for (let i = keys.length - 1; i >= 0; i--) {
    let entry = this._VIEWS[keys[i]];
    let group = this._scene.add.group();
    entry.group = group;
    // sort children to push any textures to the top. these need to be created before we can use them
    entry.children.sort(function(a, b) {
      let c = 0;
      if (a.type === "graphics-texture" && b.type !== "graphics-texture") {
        c = -1;
      } else if (a.type !== "graphics-texture" && b.type === "graphics-texture") {
        c = 1
      }
      return c;
    });
    // iterate through children creating them
    for (let j = 0, lj = entry.children.length; j < lj; j++) {
      let child = entry.children[j];
      if (child.hasOwnProperty("scale controlled args")) {
        let arr = child["scale controlled args"];
        for (let k = arr.length - 1; k >= 0; k--) {
          let controlledArgument = arr[k];
          child.args[controlledArgument.index] *= this._scene.scale[controlledArgument.dimension];
        }
      }
      switch (child.type) {
        case "graphics-texture":
          // created graphics textures are created but no objects are created for them. these will be in other UI entries
          let graphics = this._scene.make.graphics();
          let commands = child.commands;
          commands.sort(function(a, b) {
            let c = 0;
            if (a.order < b.order) {
              c = -1;
            } else if (a.order > b.order) {
              c = 1;
            }
            return c;
          });
          for (let k = 0, lk = commands.length; k < lk; k++) {
            let graphicsCommand = commands[k];
            if (graphicsCommand.hasOwnProperty("scale controlled args")) {
              let arr = graphicsCommand["scale controlled args"];
              for (let l = arr.length - 1; l >= 0; l--) {
                let controlledArgument = arr[l];
                graphicsCommand.args[controlledArgument.index] *= this._scene.scale[controlledArgument.dimension];
              }
            }
            graphics[graphicsCommand.command](...graphicsCommand.args);
          }
          continue;
          break;
      }
      // create the object
      let object = this._scene.add[child.type](...child.args);
      
      // set the origin
      if (child.hasOwnProperty("origin")) {
        object.setOrigin(...child.origin); // set the origin property
      } else {
        object.setOrigin(0.5); // set the origin to the middle
      }
      // set the depth
      if (child.hasOwnProperty("depth")) {
        object.setDepth(child.depth); // set the depth property. the higher the number, the higher up it appears. default is 0
      }
      switch (child.type) {
        case "bitmapText":
          if (child.hasOwnProperty("scale")) {
            object.setScale(child.scale);
          }
          if (child.hasOwnProperty("tint")) {
            object.setTint(child.tint);
          }
          if (child.hasOwnProperty("alpha")) {
            object.setAlpha(child.alpha);
          }
          if (child.hasOwnProperty("dropShadow")) {
            object.setDropShadow(...child.dropShadow); // set the origin property
          }
          if (child.hasOwnProperty("maxWidth")) {
            if (Array.isArray()) {
              // maxwidth setting is an array of width and word wrap code
              if (child.maxWidth[0] < 1) {
                child.maxWidth[0] *= this._scene.scale.width;
              }
              object.setMaxWidth(...child.maxWidth);
            } else {
              if (isNaN(parseFloat(child.maxWidth))) {
                throw ["Invalid setting for maxWidth", child];
              }
              // maxwidth setting is just the width value
              if (child.maxWidth < 1) {
                object.setMaxWidth(child.maxWidth * this._scene.scale.width);
              } else {
                object.setMaxWidth(child.maxWidth);
              }
            }
          }
          break;
      }
      // add listeners
      if (child.hasOwnProperty("listeners")) {
        let listeners = Object.keys(child.listeners);
        for (let i = listeners.length - 1; i >= 0; i--) {
          switch (child.type) {
            case "dom":
              object.addListener(listeners[i]);
              object.on(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body));
              break;
            default:
              if (child.listeners[listeners[i]].hasOwnProperty("context")) {
                object.addListener(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body), child.listeners[listeners[i]].context);
              } else {
                object.addListener(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body));
              }
              break;
          }
        }
      }
      // add interactive
      if (child.hasOwnProperty("interactive")) {
        object.setInteractive(...child.interactive); // set the origin property
      }
      // map dynamic fields
      if (child.hasOwnProperty("dynamicField")) {
        this._dynamicFields.put(child.dynamicField, object);
      }
      // add the element to the group
      group.add(object, true);
  
      // place the element where needed
      let childX, childY;
      if (Array.isArray(child.position)) {
        childX = child.position[0];
        childY = child.position[1];
      } else {
        childX = child.position.x;
        if (isNaN(parseFloat(childX))) {
          let offset = childX.offset;
          childX = childX.fixed;
          if (isNaN(parseFloat(offset))) {
            let pixelOffset = 0;
            if (offset.hasOwnProperty("pixel")) {
              pixelOffset = offset.pixel / this._COLUMN_WIDTH;
            }
            if (offset.hasOwnProperty("field")) {
              offset = this._dynamicFields.getObject(offset.field)[0].width;
              offset /= this._COLUMN_WIDTH;
              if (offset.hasOwnProperty("sign")
                  && offset.sign === "negative") {
                offset = -offset;
              }
            }
            offset += pixelOffset;
          } else {
            offset /= this._COLUMN_WIDTH;
          }
          childX += offset;
        }

        childY = child.position.y;
        if (isNaN(parseFloat(childY))) {
          let offset = childY.offset;
          childY = childY.fixed;
          if (isNaN(parseFloat(offset))) {
            if (offset.hasOwnProperty("field")) {
              offset = this._dynamicFields.getObject(offset.field)[0].width;
              offset /= this._ROW_HEIGHT;
              if (offset.hasOwnProperty("sign")
                  && offset.sign === "negative") {
                offset = -offset;
              }
            }
          } else {
            offset /= this._ROW_HEIGHT;
          }
          childY += offset;
        }
      }

      this._grid.placeAt(childX,childY, object);
    }
    // hide the group
    group.setVisible(false);
  }
}
/**
 * This method is called once per game step while the scene is running.
 * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
UiScene.prototype.update = function(time, delta) {
  if (!this._stateChangeResolved) {
    // hide all templates
    let keys = Object.keys(this._VIEWS);
    for (let i = keys.length - 1; i >= 0; i--) {
      this._VIEWS[keys[i]].group.setVisible(false);
    }
  
    // show the current template
    this._VIEWS[this._state].group.setVisible(true);
  
    // reset the flag
    this._stateChangeResolved = true;
  }
}
/**
 * @class The Dice static class.
 */
var Dice = {
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
  rollDie: function(faces) { return Math.floor(Math.random() * Math.floor(faces)) + 1; },
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
function Die(r, f) {
  this._rolls = r;
  this._faces = f;
  this.roll = function() {
    var sum = 0;
    for (var i = this._rolls; i > 0; i--) {
      sum += Math.floor(Math.random() * Math.floor(this._faces)) + 1;
    }
    return sum;
  }
}
Object.defineProperty(Die.prototype, 'faces', {
  get() {
    return this._faces;
  }
});
Object.defineProperty(Die.prototype, 'rolls', {
  get() {
    return this._rolls;
  }
});
Object.freeze(Die);
Object.freeze(Dice);

/**
 * @class Factory class for producing Interactive Objects.
 */
 const Interactive = (function() {
  /** @private the list of IOs. */
  var _ios = [];
  /** @private the id the last IO. */
  var _lastId = 0;
  return {
    get lastId() { return _lastId; },
    /**
     * Adds an IO.
     * @param {InteractiveObject} io the IO
     */
    addIo: function(io) {
      if (typeof(io) === "undefined"
          || io === null
          || !(io instanceof this.IoClass)) {
        throw "Interactive.addIo() requires an instance of InteractiveObject";
      }
      // look for an emoty spot
      var index = -1;
      for (var i = _ios.length - 1; i >= 0; i--) {
        var io = _ios[i];
        if (typeof(io) === "undefined"
            || io === null) {
          index = i;
          break;
        }
      }
      if (index >= 0) {
        _ios[index] = io;
      } else {
        _ios.push(io);
      }
    },
    addItem: function() {
      throw "Interactive.addItem() - Do not call this from base instance, extend this. check ../tests/samples/sample_interactive.js for an example";
    },
    addNpc: function() {
      throw "Interactive.addNpc() - Do not call this from base instance, extend this. check ../tests/samples/sample_interactive.js for an example";
    },
    addPc: function() {
      throw "Interactive.addPc() - Do not call this from base instance, extend this. check ../tests/samples/sample_interactive.js for an example";
    },
    /**
     * Creates an IO and stores it in the master list.
     * @return {InteractiveObject} the IO
     */
    createFreeIo: function() {
      // look for an empty spot
      var i = 0;
      for (var li = _ios.length; i < li; i++) {
        var io = _ios[i];
        if (typeof(io) === "undefined"
            || io === null) {
          break;
        }
      }
      var io = new this.IoClass(_lastId++);
      if (i === _ios.length) {
        _ios.push(io);
      } else {
        _ios[i] = io;
      }
      return io;
    },
    resetAllNpcBehaviours: function() {
      for (var i = _ios.length - 1; i >= 0; i--) {
        var io = _ios[i];
        if (typeof(io) !== "undefined"
            && io !== null
            && io.ioFlags.has(this.BaseConstants.IO_NPC)) {
          io.data.resetBehaviour();
        }
      }
    },
    /***************************************************************************
     _____ _   ___      ________ _   _ _______ ____  _______     __
    |_   _| \ | \ \    / /  ____| \ | |__   __/ __ \|  __ \ \   / /
      | | |  \| |\ \  / /| |__  |  \| |  | | | |  | | |__) \ \_/ /
      | | | . ` | \ \/ / |  __| | . ` |  | | | |  | |  _  / \   /
     _| |_| |\  |  \  /  | |____| |\  |  | | | |__| | | \ \  | |
    |_____|_| \_|   \/   |______|_| \_|  |_|  \____/|_|  \_\ |_|

    ***************************************************************************/
    /**
     * Seeks an IO in all Inventories to remove it.
     * @param {InteractiveObject} io the IO
     */
    removeFromAllInventories: function(io) {
      if (!this.isValidIo(io)) {
        throw "Interactive.removeFromAllInventories() needs an IO to remove";
      }
      for (var i = _ios.length - 1; i >= 0; i--) {
        if (!this.isValidIo(_ios[i])) {
          continue;
        }
        var inventory = _ios[i].inventory;
        if (typeof(inventory) !== "undefined"
            && inventory !== null) {
          inventory.removeFromInventory(io);
        }
      }
    },
    /**
     * Seeks an IO in all Inventories to replace it.
     * @param {InteractiveObject} io the IO
     * @param {InteractiveObject} replacedWith the IO to replace it with
     */
    replaceInAllInventories: function(io, replacedWith) {
      if (!this.isValidIo(io)) {
        throw "Interactive.replaceInAllInventories() needs an IO to replace";
      }
      if (!this.isValidIo(replacedWith)) {
        throw "Interactive.replaceInAllInventories() needs an IO to replace with";
      }
      for (var i = _ios.length - 1; i >= 0; i--) {
        var inventory = _ios[i].inventory;
        if (typeof(inventory) !== "undefined"
            && inventory !== null) {
          inventory.replaceInInventory(io, replacedWith);
        }
      }
    },

    /***************************************************************************
    __      __     _      _____ _____       _______ _____ ____  _   _
    \ \    / /\   | |    |_   _|  __ \   /\|__   __|_   _/ __ \| \ | |
     \ \  / /  \  | |      | | | |  | | /  \  | |    | || |  | |  \| |
      \ \/ / /\ \ | |      | | | |  | |/ /\ \ | |    | || |  | | . ` |
       \  / ____ \| |____ _| |_| |__| / ____ \| |   _| || |__| | |\  |
        \/_/    \_\______|_____|_____/_/    \_\_|  |_____\____/|_| \_|

    ***************************************************************************/
    /**
     * Gets an IO by its reference id.
     * @param {Number} id the IO's reference id
     * @return {InteractiveObject} the IO
     */
    getIo: function(id) {
      if (isNaN(parseInt(id))) {
        throw "Interactive.getIo() needs a valid reference id"
      }
      var io;
      for (var i = _ios.length - 1; i >= 0; i--) {
        if (this.isValidIo(_ios[i]) && _ios[i].refId === id) {
          io = _ios[i];
          break;
        }
      }
      return io;
    },
    /**
     * Gets an IO's reference id.
     * @param {InteractiveObject} io the IO
     * @return {Number} the IO's reference id
     */
    getInteractiveRefId: function(io) {
      if (typeof(io) === "undefined"
          || io === null
          || !(io instanceof this.IoClass)) {
        throw "Interactive.getInteractiveRefId() needs a valid IO"
      }
      var refId = -1;
      for (var i = _ios.length - 1; i >= 0; i--) {
        if (io.equals(_ios[i])) {
          refId = _ios[i].refId;
          break;
        }
      }
      return refId;
    },
    /**
     * Determines if two IOs are the same item. Used when stacking objects in Inventory.
     * @param {InteractiveObject} io0 the first IO
     * @param {InteractiveObject} io1 the second IO
     * @return {boolean} true if the IOs are the same; false otherwise
     */
    isSameObject: function(io0, io1) {
      if (typeof(io0) === "undefined"
          || io0 === null
          || !(io0 instanceof this.IoClass)) {
        throw "Interactive.isSameObject() needs a valid IO to compare";
      }
      if (typeof(io1) === "undefined"
          || io1 === null
          || !(io1 instanceof this.IoClass)) {
        throw "Interactive.isSameObject() needs a valid IO to compare with";
      }
      var is = false;
      if (!io0.ioFlags.has(this.BaseConstants.IO_UNIQUE)
          && !io1.ioFlags.has(this.BaseConstants.IO_UNIQUE)) {
        // neither item is unique
        if (io0.ioFlags.has(this.BaseConstants.IO_ITEM)
            && io1.ioFlags.has(this.BaseConstants.IO_ITEM)
            && !io0.hasOverscript()
            && !io1.hasOverscript()) {
          // both are items
          if (io0.localizedName.toLowerCase() === io1.localizedName.toLowerCase()) {
            is = true;
          }
        }
      }
      return is;
    },
    /**
     * Validates that an IO exists in the system.
     * @param {this.IoClass} io the IO
     * @return {boolean} true if the IO was found in the system; false otherwise
     */
    isValidIo: function(io) { return typeof(io) !== "undefined" && io !== null && this.getInteractiveRefId(io) >= 0; },
    /**
     * Checks if an IO index number is valid.
     * @param {Number} num the IO
     * @return {Number} the IO's reference id
     */
    validIONum: function(num) {
      if (isNaN(parseInt(num))) {
        throw "Interactive.validIONum() requires an integer";
      }
      var ret = false;
      for (var i = _ios.length - 1; i >= 0; i--) {
        if (this.isValidIo(_ios[i]) && _ios[i].refId === num) {
          ret = true;
          break;
        }
      }
    	return ret;
    },
    /***************************************************************************
    _____  ______  _____ _______ _____  _    _  _____ _______ _____ ____  _   _
   |  __ \|  ____|/ ____|__   __|  __ \| |  | |/ ____|__   __|_   _/ __ \| \ | |
   | |  | | |__  | (___    | |  | |__) | |  | | |       | |    | || |  | |  \| |
   | |  | |  __|  \___ \   | |  |  _  /| |  | | |       | |    | || |  | | . ` |
   | |__| | |____ ____) |  | |  | | \ \| |__| | |____   | |   _| || |__| | |\  |
   |_____/|______|_____/   |_|  |_|  \_\\____/ \_____|  |_|  |_____\____/|_| \_|

    ***************************************************************************/
    destroyDynamicInfo: function(io) {
      if (!this.isValidIo(io)) {
        throw "Interactive.destroyDynamicInfo() needs an IO to release";
      }
      if (io.ioFlags.has(this.BaseConstants.IO_ITEM)) {
        // unequip from any players
        for (var i = _ios.length - 1; i >= 0; i--) {
          var playerIo = _ios[i];
          if (typeof(playerIo) !== "undefined"
              && playerIo !== null
              && this.isValidIo(playerIo)
              && playerIo.ioFlags.has(this.BaseConstants.IO_PC)
              && playerIo.data.hasEquipped(io)) {
            playerIo.data.unequip(io);
          }
        }
      }
      this.ScriptInstance.eventStackClearForIo(io);
      if (this.isValidIo(io)) {
        // TODO - clear spells on IO
      }
    },
    releaseIo: function(io) {
      if (!this.isValidIo(io)) {
        throw "Interactive.releaseIo() needs an IO to release";
      }
      this.destroyDynamicInfo(io);
      this.ScriptInstance.timerClearForIO(io);

      io.removeAllSpellsOn();
      this.removeFromAllInventories(io);

      if (io.script !== null) {
        io.script.clearVariables();
      }
      if (io.overscript !== null) {
        io.overscript.clearVariables();
      }

      // clear animations

      // clear damage data

      io.removeFromAllGroups();

      for (var i = _ios.length - 1; i >= 0; i--) {
        if (_ios[i].equals(io)) {
          _ios[i] = null;
          break;
        }
      }
    	io = null;
    },
  };
} ());

const Script = (function() {
  /** @private the Global event sender. */
  var _eventSender = null;
  /** @private the event stack. */
  var _eventstack;
  /** @private the script timers. */
  var _scriptTimers;
  /** @private the global variables. */
  var _variables = {};
  /** @private dictionary of event ids and their corresponding names. */
  var smMap = {
    "1": "INIT",
    "2": "INVENTORY_IN",
    "3": "INVENTORY_OUT",
    "4": "INVENTORY_USE",
    "6": "EQUIP_IN",
    "7": "EQUIP_OUT",
    "8": "MAIN",
    "9": "RESET",
    "10": "CHAT",
    "11": "ACTION",
    "12": "DEAD",
    "16": "HIT",
    "17": "DIE",
    "22": "DETECT_PLAYER",
    "23": "UNDETECT_PLAYER",
    "28": "INVENTORY2_OPEN",
    "29": "INVENTORY2_CLOSE",
    "33": "INIT_END",
    "46": "HEAR",
    "55": "COLLIDE_NPC",
    "57": "AGGRESSION",

  };
  /** @private dictionary of events that have a flag disallowing them. */
  var _eventsWithDisabledFlags;
  return {
    /** Getter/setter for the event sender property. */
    get eventSender() { return _eventSender; },
    set eventSender(value) {
      if (value !== null
          && !this.InteractiveInstance.isValidIo(value)) {
        throw "Script.eventSender must be either null or a valid IO";
      }
      _eventSender = value;
    },
    /**
     * Checks to see if an event is allowed to run on a script.
     * @private
     * @param {String} event the event's name
     * @param {IoScript} script the script
     * @return {Boolean} true if the event is allowed; false otherwise
     */
    _checkIsEventAllowed: function(event, script) {
      if (typeof(_eventsWithDisabledFlags) === "undefined") {
        _eventsWithDisabledFlags = {
          "COLLIDE_NPC": this.BaseConstants.DISABLE_COLLIDE_NPC,
          "CHAT": this.BaseConstants.DISABLE_CHAT,
          "HIT": this.BaseConstants.DISABLE_HIT,
          "INVENTORY2_OPEN": this.BaseConstants.DISABLE_INVENTORY2_OPEN,
          "HEAR": this.BaseConstants.DISABLE_HEAR,
          "UNDETECT_PLAYER": this.BaseConstants.DISABLE_DETECT,
          "DETECT_PLAYER": this.BaseConstants.DISABLE_DETECT,
          "AGGRESSION": this.BaseConstants.DISABLE_AGGRESSION,
          "MAIN": this.BaseConstants.DISABLE_MAIN,
          "CURSORMODE": this.BaseConstants.DISABLE_CURSORMODE,
          "EXPLORATIONMODE": this.BaseConstants.DISABLE_EXPLORATIONMODE
        };
      }
      var continueProcessing = true;
      if (_eventsWithDisabledFlags.hasOwnProperty(event)
          && script.allowedEvents.has(_eventsWithDisabledFlags[event])) {
        continueProcessing = false;
      }
      return continueProcessing;
    },
    /**
     * Clears all variables.
     */
    clearGlobalVariables: function() {
      for (var key in _variables) {
        delete _variables[key];
      }
    },
    /**
     * Gets a Global script variable.
     * @param {String} name the variable's name
     * @return {Object} value any variable's value
     */
    getGlobalVariable: function(name) {
      if (!_variables.hasOwnProperty(name)) {
        throw ["Script.getGlobalVariable() - Missing variable '", name, "'"].join("");
      }
      return _variables[name];
    },
    /**
     * Determines if there is a Global variable.
     * @param {String} name the variable's name
     * @return {Boolean} true if the variable was set; false otherwise
     */
    hasGlobalVariable: function(name) { return _variables.hasOwnProperty(name); },
    /**
     * Sets a Global variable.
     * @param {String} key the variable's key
     * @param {Object} value any variable's value
     */
    setGlobalVariable: function(key, value) {
      if (typeof(key) === "undefined" || typeof(value) === "undefined") {
        throw "need key-value pair when setting script variables"
      }
      if (typeof(key) !== "string") {
        throw "key must be a string";
      }
      if (key.length === 0) {
        throw "key cannot be an empty string";
      }
      _variables[key] = value;
    },
    /**
     *
     * @param {Object} parameterObject the parameter object containing 5 fields: script, eventId, eventName, params, and io
     */
    sendScriptEvent: function(parameterObject) {
      if (typeof(parameterObject) === undefined
          || parameterObject === null) {
        throw "Script.sendScriptEvent()  requires a parameter object";
      }
      var ret;
      if (!parameterObject.hasOwnProperty("io")
          || !this.InteractiveInstance.isValidIo(parameterObject.io)) {
        throw "Script.sendScriptEvent() requires a valid IO";
      }
      var script = parameterObject.script;
      if (typeof(parameterObject) === undefined
          || !(parameterObject.script instanceof this.ScriptClass)) {
        throw "Script.sendScriptEvent() requires a valid script";
      }
      if (typeof(parameterObject.eventId) === "undefined"
          && typeof(parameterObject.eventName) === "undefined") {
        throw "Script.sendScriptEvent() requires an event id or name to process";
      }
      var message = smMap[parameterObject.eventId];
      if (typeof(message) === "undefined") {
        message = parameterObject.eventName;
      }
      if (typeof(message) === "undefined") {
        throw ["Script.sendScriptEvent() cannot process event '", parameterObject.eventId, "'"].join("");
      }
      if (parameterObject.io.ioFlags.has(this.BaseConstants.IO_NPC)) {
        // if a dead NPC gets a message other than "DEAD" or "DIE", just ACCEPT
        // it and move on
        if (parameterObject.io.data.isDead()
            && message !== "DEAD"
            && message !== "DIE") {
          ret = this.BaseConstants.ACCEPT;
        }
      }
      if (typeof(ret) === "undefined") {
        // if there is a master script, use that one for checking local variables
        var localVarScript = parameterObject.script.master;
        if (typeof(localVarScript) === "undefined"
            || localVarScript === null) {
          localVarScript = parameterObject.script;
        }
        if (!this._checkIsEventAllowed(message, localVarScript)) {
    			ret = this.BaseConstants.REFUSE;
        }
        if (ret !== this.BaseConstants.REFUSE) {
          ret = script.execute(message, { "io": parameterObject.io, "params": parameterObject.params });
        }
      }
      return ret;
    },
    sendInitScriptEvent: function(io) {
      if (!this.InteractiveInstance.isValidIo(io)) {
        throw "Script.sendInitScriptEvent() needs an IO to initialize";
      }
    	var oldEventSender = _eventSender;
    	_eventSender = null;

  		if (io.script !== null) {
  			this.sendScriptEvent({
          "script": io.script,
          "eventId": this.BaseConstants.SM_INIT,
          "io": io
        });
  		}
  		if (io.hasOverscript()) {
  			this.sendScriptEvent({
          "script": io.overscript,
          "eventId": this.BaseConstants.SM_INIT,
          "io": io
        });
  		}
  		if (io.script !== null) {
  			this.sendScriptEvent({
          "script": io.script,
          "eventId": this.BaseConstants.SM_INITEND,
          "io": io
        });
  		}
  		if (io.hasOverscript()) {
  			this.sendScriptEvent({
          "script": io.overscript,
          "eventId": this.BaseConstants.SM_INITEND,
          "io": io
        });
  		}
      _eventSender = oldEventSender;
      return this.BaseConstants.ACCEPT;
   },
    /**
     * Sends an IO script event, processing in the Global script
     * and then in the local if not refused by the Global.
     * @param {Object} parameterObject a parameter dictionary containing 4 possible keys: io, eventId, params, eventName
     * @return {Number} the script's return message
     */
    sendIOScriptEvent: function(parameterObject) {
      var ret = -1;
      if (!this.InteractiveInstance.isValidIo(parameterObject.io)) {
        throw "Script.sendIOScriptEvent() needs an IO to send reverse events";
      }
      var message = parameterObject.eventId;
      if (typeof(message) === "undefined") {
        message = parameterObject.eventName;
      }
      if (typeof(message) === "undefined") {
        throw "Script.sendIOScriptEvent() requires an event id or name to process";
      }
      // store the previous event sender
      var previousEvenSender = _eventSender;
      if (message === "INIT"
          || message === "INITEND"
          || message === this.BaseConstants.SM_INIT
          || message === this.BaseConstants.SM_INITEND) {
        // run INIT scripts in reverse order (the local script first, then the main script)
				this.sendIOScriptEventReverse(parameterObject);
        // revert to previous event sender
				_eventSender = previousEvenSender;
      } else {
        if (!parameterObject.io.hasOverscript()) {
          ret = this.sendScriptEvent({
            "script": parameterObject.io.script,
            "eventId": parameterObject.eventId,
            "params": parameterObject.params,
            "io": parameterObject.io,
            "eventName": parameterObject.eventName
          });
  				_eventSender = previousEvenSender;
        } else {
          // send to Extended(over) script 1st, then to base if not refused
          ret = this.sendScriptEvent({
            "script": parameterObject.io.overscript,
            "eventId": parameterObject.eventId,
            "params": parameterObject.params,
            "io": parameterObject.io,
            "eventName": parameterObject.eventName
          });
  				_eventSender = previousEvenSender;
          if (ret !== this.BaseConstants.REFUSE) {
            // make sure the IO is still valid after running the Extended(over) Script
            if (this.InteractiveInstance.isValidIo(parameterObject.io)) {
              ret = this.sendScriptEvent({
                "script": parameterObject.io.script,
                "eventId": parameterObject.eventId,
                "params": parameterObject.params,
                "io": parameterObject.io,
                "eventName": parameterObject.eventName
              });
      				_eventSender = previousEvenSender;
            }
          }
        }
      }
      return ret;
    },
    /**
     * Sends an IO script event in reverse order, processing in the local script
     * and then in the Global if not refused by the local.
     * @param {Object} parameterObject a parameter dictionary containing 4 possible keys: io, eventId, params, eventName
     * @return {Number} the script's return message
     */
    sendIOScriptEventReverse: function(parameterObject) {
      var ret = -1;
      if (!this.InteractiveInstance.isValidIo(parameterObject.io)) {
        throw "Script.sendIOScriptEventReverse() needs an IO to send reverse events";
      }
      // if this IO only has a Local script, send event to it
      if (!parameterObject.io.hasOverscript()) {
        ret = this.sendScriptEvent({
          "script": parameterObject.io.script,
          "eventId": parameterObject.eventId,
          "params": parameterObject.params,
          "io": parameterObject.io,
          "eventName": parameterObject.eventName
        });
      } else {
        // send to local script 1st, then to Global if not refused
        ret = this.sendScriptEvent({
          "script": parameterObject.io.script,
          "eventId": parameterObject.eventId,
          "params": parameterObject.params,
          "io": parameterObject.io,
          "eventName": parameterObject.eventName
        });
        if (ret !== this.BaseConstants.REFUSE) {
          // make sure the IO is still valid after running the Script
          if (this.InteractiveInstance.isValidIo(parameterObject.io)) {
            ret = this.sendScriptEvent({
              "script": parameterObject.io.overscript,
              "eventId": parameterObject.eventId,
              "params": parameterObject.params,
              "io": parameterObject.io,
              "eventName": parameterObject.eventName
            });
          }
        }
      }
      return ret;
    },
    sendMsgToAllIO: function (msg, dat) {
      if (smMap.hasOwnProperty(msg)) {
        msg = smMap[msg];
      }
    	var ret = this.BaseConstants.ACCEPT;
      for (var i = this.InteractiveInstance.lastId; i >= 0; i--) {
        if (this.InteractiveInstance.validIONum(i)) {
          var io = this.InteractiveInstance.getIo(i);
          var response = this.sendIOScriptEvent({
            "io": io,
            "eventName": msg,
            "params": dat,
          });
          if (response === this.BaseConstants.REFUSE) {
            ret = response;
          }
        }
      }
    	return ret;
    },
    reset: function(io, needsInitialization) {
      if (!this.InteractiveInstance.isValidIo(io)) {
        throw "Script.reset() needs an IO to reset";
      }
      if (typeof(needsInitialization) === "undefined") {
        needsInitialization = false;
      }
      if (typeof(needsInitialization) !== "boolean") {
        throw "Script.reset() requires a boolean for the initialization flag";
      }
      // Release Script Local Variables
      io.script.clearVariables();
      //Release Script Over-Script Local Variables
      if (io.hasOverscript()) {
        io.overscript.clearVariables();
      }
      this.resetObject(io, needsInitialization);
    },
    resetObject: function(io, needsInitialization) {
      if (!this.InteractiveInstance.isValidIo(io)) {
        throw "Script.resetObject() needs an IO to reset";
      }
      if (typeof(needsInitialization) === "undefined") {
        needsInitialization = false;
      }
      if (typeof(needsInitialization) !== "boolean") {
        throw "Script.resetObject() requires a boolean for the initialization flag";
      }
  		if (io.script !== null) {
        io.script.allowedEvents.clear();

  			if (needsInitialization) {
          this.sendScriptEvent({
            "script": io.script,
            "eventId": this.BaseConstants.SM_INIT,
            "io": io
          });
        }
        if (this.InteractiveInstance.isValidIo(io)) {
          io.mainevent = "MAIN";
        }
  		}

  		// Do the same for Local Script
  		if (io.hasOverscript()) {
        io.overscript.allowedEvents.clear();

  			if (needsInitialization) {
          this.sendScriptEvent({
            "script": io.overscript,
            "eventId": this.BaseConstants.SM_INIT,
            "io": io
          });
        }
  		}

  		// Sends InitEnd Event
  		if (needsInitialization) {
		    if (io.script !== null) {
          this.sendScriptEvent({
            "script": io.script,
            "eventId": this.BaseConstants.SM_INITEND,
            "io": io
          });
        }
    		if (io.hasOverscript()) {
          this.sendScriptEvent({
            "script": io.overscript,
            "eventId": this.BaseConstants.SM_INIT,
            "io": io
          });
        }
      }
    },
    resetAll: function(needsInitialization) {
      if (typeof(needsInitialization) === "undefined") {
        needsInitialization = false;
      }
      if (typeof(needsInitialization) !== "boolean") {
        throw "Script.resetAll() requires a boolean for the initialization flag";
      }
      for (var i = this.InteractiveInstance.lastid; i >= 0; i--) {
        if (this.InteractiveInstance.validIONum(i)) {
    			this.reset(this.InteractiveInstance.getIo(i), needsInitialization);
        }
      }
    },
    /***************************************************************************
      ________      ________ _   _ _______    _____ _______       _____ _  __
     |  ____\ \    / /  ____| \ | |__   __|  / ____|__   __|/\   / ____| |/ /
     | |__   \ \  / /| |__  |  \| |  | |    | (___    | |  /  \ | |    | ' /
     |  __|   \ \/ / |  __| | . ` |  | |     \___ \   | | / /\ \| |    |  <
     | |____   \  /  | |____| |\  |  | |     ____) |  | |/ ____ \ |____| . \
     |______|   \/   |______|_| \_|  |_|    |_____/   |_/_/    \_\_____|_|\_\

    ***************************************************************************/
    /**
     * Clears the event stack.
     */
    eventStackClear: function() {
      if (typeof(_eventstack) === "undefined") {
        _eventstack = [];
        for (var i = this.BaseConstants.MAX_EVENT_STACK; i > 0; i--) {
          _eventstack.push(new this.StackedEventClass());
        }
      }
      for (var i = _eventstack.length - 1; i >= 0; i--) {
        if (_eventstack[i].exists) {
          _eventstack[i].clear();
        }
      }
    },
    /**
     * Clears the event stack and resets all stacked events.
     */
    eventStackInit:function () {
      if (typeof(_eventstack) === "undefined") {
        _eventstack = [];
      }
      _eventstack.length = 0; // clear the old stack
      for (var i = this.BaseConstants.MAX_EVENT_STACK; i > 0; i--) {
        _eventstack.push(new this.StackedEventClass());
      }
    },
    /**
     * Clears the event stack for all events related to a specific IO.
     * @param {InteractiveObject} io the IO
     */
    eventStackClearForIo:function (io) {
      if (!this.InteractiveInstance.isValidIo(io)) {
        throw "Script.eventStackClearForIo() needs an IO to clear the event stack for";
      }
      if (typeof(_eventstack) === "undefined") {
        _eventstack = [];
        for (var i = this.BaseConstants.MAX_EVENT_STACK; i > 0; i--) {
          _eventstack.push(new this.StackedEventClass());
        }
      }
  	  for (var i = 0, li = _eventstack.length; i < li; i++) {
        if (_eventstack[i].exists
            && _eventstack[i].io.equals(io)) {
          _eventstack[i].clear();
  			}
  		}
  	},
    eventStackExecute: function(stackFlow) {
      if (isNaN(parseInt(stackFlow))) {
        stackFlow = 20;
      }
      if (typeof(_eventstack) === "undefined") {
        _eventstack = [];
        for (var i = this.BaseConstants.MAX_EVENT_STACK; i > 0; i--) {
          _eventstack.push(new this.StackedEventClass());
        }
      }
      var count = 0;
  	  for (var i = 0, li = _eventstack.length; i < li; i++) {
        if (_eventstack[i].exists) {
          if (this.InteractiveInstance.isValidIo(_eventstack[i].io)) {
            _eventSender = null;
      			if (this.InteractiveInstance.isValidIo(_eventstack[i].sender)) {
      				_eventSender = _eventstack[i].sender;
            }
            this.sendIOScriptEvent({
              "io":        _eventstack[i].io,
              "eventId":   _eventstack[i].eventId,
              "params":    _eventstack[i].params,
              "eventName": _eventstack[i].eventName
          });
          }
        }
        _eventstack[i].clear();
        if (++count >= stackFlow) {
          break;
        }
      }
    },
    eventStackExecuteAll: function() { this.eventStackExecute(9999999); },
    stackSendMsgToAllNpcIo: function(msg, dat) {
      for (var i = this.InteractiveInstance.lastid; i >= 0; i--) {
        if (this.InteractiveInstance.validIONum(i)) {
          var io = this.InteractiveInstance.getIo(i);
          if (io.ioFlags.has(this.BaseConstants.IO_NPC)) {
      			this.stackSendIOScriptEvent({
              "io": io,
              "eventId": msg,
              "params": dat,
            });
          }
        }
      }
    },
    stackSendIOScriptEvent: function(parameterObject) {
      if (typeof(_eventstack) === "undefined") {
        _eventstack = [];
        for (var i = this.BaseConstants.MAX_EVENT_STACK; i > 0; i--) {
          _eventstack.push(new this.StackedEventClass());
        }
      }
      for (var i = 0, li = this.BaseConstants.MAX_EVENT_STACK; i < li; i++) {
      	if (!_eventstack[i].exists) {
          _eventstack[i].params = parameterObject.params;
          _eventstack[i].eventName = parameterObject.eventName;
          _eventstack[i].sender = _eventSender;
          _eventstack[i].io = parameterObject.io;
          _eventstack[i].eventId = parameterObject.eventId;
          _eventstack[i].exists = true;
      		break;
      	}
      }
    },
    /***************************************************************************
     _______ _____ __  __ ______ _____   _____
    |__   __|_   _|  \/  |  ____|  __ \ / ____|
      | |    | | | \  / | |__  | |__) | (___
      | |    | | | |\/| |  __| |  _  / \___ \
      | |   _| |_| |  | | |____| | \ \ ____) |
      |_|  |_____|_|  |_|______|_|  \_\_____/

    ***************************************************************************/
    /**
     * Checks if a named timer exists. If so returns timer index else return -1.
     * @param {string} name the timer name
     * @return {Number} the timer's index or -1
     */
    checkTimerIndex: function (name) {
      if (typeof(name) !== "string"
          || name.length === 0) {
        throw "Script.checkTimerIndex() needs a valid name";
      }
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      var index = -1;
      for (var i = 0, li = _scriptTimers.length; i < li; i++) {
        if (_scriptTimers[i].exists
            && _scriptTimers[i].name.toLowerCase() === name.toLowerCase()) {
          index = i;
          break;
        }
      }
      return index;
    },
    timerCheck: function() {
      throw "Script.timerCheck() - Do not call this from base instance, extend this. The code below this message shows a sample of what to do";
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      for (var i = 0, li = _scriptTimers.length; i < li; i++) {
        var timer = _scriptTimers[i];
        if (timer.exists) {
          if (timer.tim + timer.interval <= CURRENT_TIME) {
  					var script = timer.script;
  					var io = timer.io;

  					if (timer.times == 1) {
  						this.timerClearByNum(i);
  					} else {
  						if (timer.times !== 0) {
                timer.times--;
              }
  						timer.tim += timer.interval;
  					}
            if (script !== null
                && this.InteractiveInstance.isValidIo(io)) {
  						this.sendScriptEvent({
                "script": script,
                "eventId": timer.eventId,
                "eventName": timer.eventName,
                "io": io,
                "params": timer.params
              });
  					}
  				}
        }
      }
    },
    /** Clears all timers. */
    timerClearAll: function() {
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      for (var i = _scriptTimers.length - 1; i >= 0; i--) {
        this.timerClearByNum(i);
      }
    },
    /**
     * Clears all named timers associated with an IO instance where the IO's
     * overscript matches the timer script.
     * @param {InteractiveObject} io the IO
     */
    timerClearAllLocalsForIO: function(io) {
      if (!(this.InteractiveInstance.isValidIo(io))) {
        throw "Script.timerClearByIO() needs an IO to release";
      }
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      for (var i = 0, li = _scriptTimers.length; i < li; i++) {
        if (_scriptTimers[i].exists
            && io.equals(_scriptTimers[i].io)
            && io.hasOverscript()
            && _scriptTimers[i].script === io.overscript) {
          this.timerClearByNum(i);
        }
      }
    },
    /**
     * Clears all timers associated with an IO instance.
     * @param {InteractiveObject} io the IO
     */
    timerClearByIO: function(io)  {
      if (!(this.InteractiveInstance.isValidIo(io))) {
        throw "Script.timerClearByIO() needs an IO to release";
      }
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      for (var i = 0, li = _scriptTimers.length; i < li; i++) {
        if (_scriptTimers[i].exists
            && io.equals(_scriptTimers[i].io)) {
          this.timerClearByNum(i);
        }
      }
    },
    /**
     * Clears all named timers associated with an IO instance.
     * @param {string} name the timer name
     * @param {InteractiveObject} io the IO
     */
    timerClearByNameAndIO: function(name, io) {
      if (typeof(name) !== "string"
          || name.length === 0) {
        throw "Script.timerClearByNameAndIO() needs a valid name";
      }
      if (!(this.InteractiveInstance.isValidIo(io))) {
        throw "Script.timerClearByNameAndIO() needs an IO to release";
      }
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      for (var i = 0, li = _scriptTimers.length; i < li; i++) {
        if (_scriptTimers[i].exists
            && io.equals(_scriptTimers[i].io)
            && _scriptTimers[i].name.toLowerCase() === name.toLowerCase()) {
          this.timerClearByNum(i);
        }
      }
    },
    /**
     * Clears a timer by its Index.
     * @param {Number} index the timer index
     */
    timerClearByNum: function(index) {
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      if (index < 0 || index >= _scriptTimers.length) {
        throw ["Script.timerClearByNum() - invalid index ", index].join("");
      }
      if (_scriptTimers[index].exists) {
        _scriptTimers[index].clear();
      }
    },
    /**
     * Clears all timers associated with an IO instance.
     * @param {InteractiveObject} io the IO
     */
    timerClearForIO: function(io)  {
      if (!(this.InteractiveInstance.isValidIo(io))) {
        throw "Script.timerClearForIO() needs an IO to release";
      }
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      for (var i = 0, li = _scriptTimers.length; i < li; i++) {
        if (_scriptTimers[i].exists
            && io.equals(_scriptTimers[i].io)) {
          this.timerClearByNum(i);
        }
      }
    },
    /**
     * Initializes the timer list.
     * @param {Number} size the size of the timer list. must be at least 100
     */
    timerFirstInit: function(size) {
    	if (size < 100) {
        size = 100;
      }
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
      }
      _scriptTimers.length = 0;
      for (var i = size; i > 0; i--) {
        _scriptTimers.push(new this.ScriptTimerClass());
      }
    },
    /**
     * Generates a random name for an unnamed timer.
     * @return {string} the random name
     */
    timerGetDefaultName: function () {
    	var i = 1;
      var name;

    	while (true) {
        name = ["TIMER_", i].join("");
    		i++;

    		if (this.checkTimerIndex(name) === -1) {
    			break;
    		}
    	}
      return name;
    },
    /**
     * Get a free script timer.
     * @return {ScriptTimer}
     */
    timerGetFree: function() {
      if (typeof(_scriptTimers) === "undefined") {
        _scriptTimers = [];
        for (var i = 100; i > 0; i--) {
          _scriptTimers.push(new this.ScriptTimerClass());
        }
      }
      var timer;
      for (var i = 0, li = _scriptTimers.length; i < li; i++) {
        if (!_scriptTimers[i].exists) {
          timer = _scriptTimers[i];
          break;
        }
      }
      return timer;
    },
  };
} ());


/**
 * @class Factory class for producing Amiga-style UI elements.
 */
const AmigaUiFactoryOld = (function() {
  return {
    
    getSpanElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "AmigaUiFactory.getSpanElement() requires a parameterObject";
      }
      var $el = $("<span>");
      if (parameterObject.hasOwnProperty("classes")) {
        $el.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $el.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $el.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $el.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $el.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $el.addClass("amiga-pointer");
        $el.click(parameterObject.callback);
      }
      return $el;
    },
    getTableElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "AmigaUiFactory.getTableElement() requires a parameterObject";
      }
      var $table = $("<table>", { "class": "amiga-table" });
      if (parameterObject.hasOwnProperty("classes")) {
        $table.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $table.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $table.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $table.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      return $table;
    },
    getTextAreaElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "AmigaUiFactory.getTextAreaElement() requires a parameterObject";
      }
      var $text = $("<textarea>", { "class": "amiga-textarea" });
      if (parameterObject.hasOwnProperty("classes")) {
        $text.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $text.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $text.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $text.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $text.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $text.addClass("nes-pointer");
        $text.click(parameterObject.callback);
      }
      return $text;
    },
    getTextElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "AmigaUiFactory.getTextElement() requires a parameterObject";
      }
      var $text = $("<span>", { "class": "amiga-text" });
      if (parameterObject.hasOwnProperty("classes")) {
        $text.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $text.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $text.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $text.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $text.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $text.addClass("nes-pointer");
        $text.click(parameterObject.callback);
      }
      return $text;
    },
    getColumn: function(parameterObject) {
      if (typeof(parameterObject) === "undefined") {
        parameterObject = {};
      }
      var $col = $("<div>", { "class": "col" });
      if (parameterObject.hasOwnProperty("classes")) {
        $col.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $col.attr("style", parameterObject.style);
      }
      return $col;
    },
    getContainer: function(parameterObject) {
      if (typeof(parameterObject) === "undefined") {
        parameterObject = {};
      }
      var $container = $("<div>", { "class": "container" });
      if (parameterObject.hasOwnProperty("classes")) {
        $container.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $container.attr("style", parameterObject.style);
      }
      return $container;
    },
    getRow: function(parameterObject) {
      if (typeof(parameterObject) === "undefined") {
        parameterObject = {};
      }
      var $row = $("<div>", { "class": "row" });
      if (parameterObject.hasOwnProperty("classes")) {
        $row.addClass(parameterObject.classes);
      }
      return $row;
    },
    getPanel: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "AmigaUiFactory.getPanel() requires a parameterObject";
      }
      var $panel = $("<section>", { "class": "nes-container" });
      if (parameterObject.hasOwnProperty("style")) {
        $panel.attr("style", parameterObject.style);
      }

      if (parameterObject.hasOwnProperty("title")) {
        $panel.addClass("with-title");
        $panel.append($("<h3>", { "class": "title" } ).html(parameterObject.title));
      }
      return $panel;
    },
  };
} ());


/**
 * @class Factory class for producing UI elements.
 */
var ContentBuilder = (function() {
  /** @private the factory instance used to create UI widgets. */
  var _uiFactory;
  return {
    /**
     * Setter for the UI Factory instance.
     */
    set uiFactory(value) {
      _uiFactory = value;
    },
    "anchor": function(contentObject, $parent, watcher) {
      var $c = _uiFactory.getAnchor(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $c);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (var i = 0, li = contentObject.children.length; i < li; i++) {
          this[contentObject.children[i].type](contentObject.children[i], $c, watcher);
        }
      }
      $parent.append($c);
    },
    "app-window": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getAppWindow(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          this[contentObject.children[i].type](contentObject.children[i], $el, watcher);
        }
      }
      $parent.append($el);
    },
    "button": function(contentObject, $parent, watcher) {
      var $btn = _uiFactory.getButton(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $btn);
      }
      $parent.append($btn);
    },
    "container": function(contentObject, $parent, watcher) {
      var $container = _uiFactory.getContainerElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $container);
      }
      for (var i = 0, li = contentObject.children.length; i < li; i++) {
        this[contentObject.children[i].type](contentObject.children[i], $container, watcher);
      }
      $parent.append($container);
    },
    "div": function(contentObject, $parent, watcher) {
      let $container = _uiFactory.getDivElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $container);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          this[contentObject.children[i].type](contentObject.children[i], $container, watcher);
        }
      }
      $parent.append($container);
    },
    "flex-row": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getFlexRow(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          if (contentObject.hasOwnProperty("length")
              && i > 0
              && i % contentObject.length === 0) {
            $parent.append($el);
            $el = _uiFactory.getFlexRow(contentObject);
          }
          try {
            this[contentObject.children[i].type](contentObject.children[i], $el, watcher);
          } catch(e) {
            console.trace(contentObject.children[i]);
            throw e;
          }
        }
      }
      $parent.append($el);
    },
    "flex-col": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getFlexCol(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          if (contentObject.hasOwnProperty("length")
              && i > 0
              && i % contentObject.length === 0) {
            $parent.append($el);
            $el = _uiFactory.getFlexCol(contentObject);
          }
          try {
            this[contentObject.children[i].type](contentObject.children[i], $el, watcher);
          } catch(e) {
            console.trace(contentObject.children[i]);
            throw e;
          }
        }
      }
      $parent.append($el);
    },
    "h1": function(contentObject, $parent, watcher) {
      var $h1 = _uiFactory.getH1Element(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $h1);
      }
      $parent.append($h1);
    },
    "h2": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getH2Element(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $parent.append($el);
    },
    "h3": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getH3Element(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $parent.append($el);
    },
    "h4": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getH4Element(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $parent.append($el);
    },
    "h5": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getH5Element(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $parent.append($el);
    },
    "h6": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getH6Element(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $parent.append($el);
    },
    "hr": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getHrElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $parent.append($el);
    },
    "list": function(contentObject, $parent, watcher) {
      var $c = _uiFactory.getList(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $c);
      }
      for (var i = 0, li = contentObject.children.length; i < li; i++) {
        this[contentObject.children[i].type](contentObject.children[i], $c, watcher);
      }
      $parent.append($c);
    },
    "listItem": function(contentObject, $parent, watcher) {
      var $c = _uiFactory.getListItem(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $c);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (var i = 0, li = contentObject.children.length; i < li; i++) {
          this[contentObject.children[i].type](contentObject.children[i], $c, watcher);
        }
      }
      $parent.append($c);
    },
    "navbar": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getNavbar(contentObject);
      $el.addClass("navbar-expand-sm")
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      if (contentObject.hasOwnProperty("children")) {
        let $u = $("<ul>", { "class": "navbar-nav" });
        $el.append($("<div>", { "class": "container-fluid" }).append($u));
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          this[contentObject.children[i].type](contentObject.children[i], $u, watcher);
        }
      }
      $parent.append($el);
    },
    "navitem": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getNavitem(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $el.addClass("dropdown");
      $el.children().first().addClass("dropdown-toggle").attr("data-bs-toggle", "dropdown");
      if (contentObject.hasOwnProperty("children")) {
        let $u = $("<ul>", { "class": "dropdown-menu" });
        $el.append($u)
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          let $a = $("<a>", { "class": "dropdown-item", "href": "#" }).html(contentObject.children[i].content);
          if (contentObject.children[i].hasOwnProperty("callback")) {
            if (contentObject.children[i].callback.hasOwnProperty("args") && contentObject.children[i].callback.hasOwnProperty("body")) {
              contentObject.children[i].callback = new Function(contentObject.children[i].callback.args, contentObject.children[i].callback.body);
            }
            $a.on("click", contentObject.children[i].callback);
          }          
          if (contentObject.children[i].hasOwnProperty("isWatched")
              && contentObject.children[i].isWatched
              && typeof(watcher) !== "undefined") {
            watcher.addWatchElement(contentObject.children[i].watchParameter, $el);
          }
          $u.append($("<li>").append($a));
        }
      }
      $parent.append($el);
    },
    "radioGroup": function(contentObject, $parent, watcher) {
      var group = _uiFactory.getRadioGroup(contentObject);
      for (var i = 0, li = group.length; i < li; i++) {
        if (contentObject.buttons[i].hasOwnProperty("isWatched")
            && contentObject.buttons[i].isWatched
            && typeof(watcher) !== "undefined") {
          watcher.addWatchElement(contentObject.buttons[i].watchParameter, group[i]);
        }
        $parent.append(group[i]);
      }
    },
    "section": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getSectionElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      $parent.append($el);
    },
    "span": function(contentObject, $parent, watcher) {
      var $container = _uiFactory.getSpanElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $container);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (var i = 0, li = contentObject.children.length; i < li; i++) {
          this[contentObject.children[i].type](contentObject.children[i], $container, watcher);
        }
      }
      $parent.append($container);
    },
    "table": function(contentObject, $parent, watcher) {
      var $table = _uiFactory.getTableElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $table);
      }
      var addElement = null;
      for (var i = 0, li = contentObject.children.length; i < li; i++) {
        if (Array.isArray(contentObject.children[i])) {
          var $row = $("<tr>"), rowArray = contentObject.children[i];
          $table.append($row);
          for (var j = 0, lj = rowArray.length; j < lj; j++) {
            if (j === 0 && addElement !== null && addElement.alignment === "first") {
              $row.append(addElement.element);
              addElement = null;
            }
            var $td = $("<td>"), tdObject = rowArray[j];
            $row.append($td);
            this[tdObject.type](tdObject, $td, watcher);
            if (j + 1 == lj && addElement !== null && addElement.alignment === "last") {
              $td.attr("style", "border-right: 0;");
              $row.append(addElement.element);
              addElement = null;
            }
          }
        } else {
          var addContent = contentObject.children[i];
          if (addContent.type === "col") {
            var $td = $("<td>");
            if (addContent.hasOwnProperty("style")) {
              $td.attr("style", addContent.style);
            }
            if (addContent.hasOwnProperty("classes")) {
              $td.addClass(addContent.classes);
            }
            if (addContent.hasOwnProperty("rowspan")) {
              $td.attr("rowspan", addContent.rowspan);
            }
            for (var j = 0, lj = addContent.children.length; j < lj; j++) {
              this[addContent.children[j].type](addContent.children[j], $td, watcher);
            }
            addElement = {"element": $td, "alignment": addContent.alignment };
          }
        }
      }
      $parent.append($table);
    },
    "textarea": function(contentObject, $parent, watcher) {
      var $text = _uiFactory.getTextAreaElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $text);
      }
      $parent.append($text);
    },
    "text": function(contentObject, $parent, watcher) {
      var $text = _uiFactory.getTextElement(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $text);
      }
      $parent.append($text);
    },
    "top-level-container": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getTopLevelContainer(contentObject);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          try {
            this[contentObject.children[i].type](contentObject.children[i], $el, watcher);
          } catch(e) {
            console.trace(contentObject.children[i]);
            throw e;
          }
        }
      }
      $parent.append($el);
    },
    "window": function(contentObject, $parent, watcher) {
      let $el = _uiFactory.getWindow(contentObject, watcher);
      if (contentObject.hasOwnProperty("isWatched")
          && contentObject.isWatched
          && typeof(watcher) !== "undefined") {
        watcher.addWatchElement(contentObject.watchParameter, $el);
      }
      if (contentObject.hasOwnProperty("children")) {
        for (let i = 0, li = contentObject.children.length; i < li; i++) {
          try {
            this[contentObject.children[i].type](contentObject.children[i], $el, watcher);
          } catch(e) {
            console.trace(contentObject.children[i]);
            throw e;
          }
        }
      }
      $parent.append($el);
    },
  }
} ());


/**
 * @class Factory class for producing NES-style UI elements.
 */
 const NesUiFactoryOld = (function() {
  return {
    getAnchor: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getAnchor() requires a parameterObject";
      }
      var $item = $("<a>");
      if (parameterObject.hasOwnProperty("classes")) {
        $item.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $item.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $item.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $item.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
         $item.html(parameterObject.content);
      }

      return $item;
    },
    getButton: function(parameterObject) {      
      var $btn = $("<button>", { "class": "nes-btn" });
      if (parameterObject.hasOwnProperty("classes")) {
        $btn.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $btn.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("content")) {
        $btn.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("properties")) {
        for (var key in parameterObject.properties) {
          $btn.prop(key, parameterObject.properties[key]);
        }
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $btn.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $btn.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      
      $btn.click(parameterObject.callback);
      return $btn;
    },
    getCard: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getCard() requires a parameterObject";
      }
      var $card = $("<div>", { "class": "card" });
      if (parameterObject.hasOwnProperty("cardClasses")) {
        if (Array.isArray(parameterObject.cardClasses)) {
          for (var i = parameterObject.cardClasses.length - 1; i >= 0; i--) {
            $card.addClass(parameterObject.cardClasses[i]);
          }
        } else {
          $card.addClass(parameterObject.cardClasses);
        }
      }
      if (parameterObject.hasOwnProperty("image")) {
        var $img = $("<img>", { "class": "card-img-top card-svg-img", "src": parameterObject.image.src });
        if (Array.isArray(parameterObject.image.classes)) {
          for (var i = parameterObject.image.classes.length - 1; i >= 0; i--) {
            $img.addClass(parameterObject.image.classes[i]);
          }
        } else {
          $img.addClass(parameterObject.image.classes);
        }
        $card.append($img);
      }
      if (parameterObject.hasOwnProperty("text")) {
        var $div = $("<div>", { "class": "card-body" });
        if (Array.isArray(parameterObject.text.classes)) {
          for (var i = parameterObject.text.classes.length - 1; i >= 0; i--) {
            $div.addClass(parameterObject.text.classes[i]);
          }
        } else {
          $div.addClass(parameterObject.text.classes);
        }
        $div.append($("<p>", { "class": "card-text" }).html(parameterObject.text.text));
        $card.append($div);
      }
      return $card;
    },
    getContainerElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getContainerElement() requires a parameterObject";
      }
      var $container = $("<div>", { "class": "nes-container" });
      if (parameterObject.hasOwnProperty("classes")) {
        $container.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $container.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $container.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("title")) {
        var $h6 = $("<h6>", { "class": "container-title" }).html(parameterObject.title);
        $container.append($h6);
        if (parameterObject.hasOwnProperty("titleId")) {
          $h6.attr("id", parameterObject.titleId);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $container.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }

      return $container;
    },
    getFlexCol: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
            parameterObject = {};
      }
      var $div = $("<div>", { "class": "d-flex flex-column" });
      if (parameterObject.hasOwnProperty("classes")) {
        $div.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $div.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $div.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $div.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      return $div;
    },
    getFlexRow: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
            parameterObject = {};
      }
      var $div = $("<div>", { "class": "d-flex flex-row" });
      if (parameterObject.hasOwnProperty("classes")) {
        $div.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $div.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $div.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $div.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      return $div;
    },
    getH3Element: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getTextElement() requires a parameterObject";
      }
      var $text = $("<h3>");
      if (parameterObject.hasOwnProperty("classes")) {
        $text.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $text.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $text.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $text.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $text.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $text.addClass("nes-pointer");
        $text.click(parameterObject.content);
      }

      return $text;
    },
    getH4Element: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getTextElement() requires a parameterObject";
      }
      var $text = $("<h4>");
      if (parameterObject.hasOwnProperty("classes")) {
        $text.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $text.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $text.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $text.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $text.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $text.addClass("nes-pointer");
        $text.click(parameterObject.content);
      }

      return $text;
    },
    getH6Element: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getTextElement() requires a parameterObject";
      }
      var $text = $("<h6>");
      if (parameterObject.hasOwnProperty("classes")) {
        $text.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $text.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $text.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $text.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $text.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $text.addClass("nes-pointer");
        $text.click(parameterObject.callback);
      }

      return $text;
    },
    getList: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getList() requires a parameterObject";
      }
      var $list = $("<ul>");
      if (parameterObject.hasOwnProperty("classes")) {
        $list.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $list.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $list.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $list.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }

      return $list;
    },
    getListItem: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getListItem() requires a parameterObject";
      }
      var $item = $("<li>");
      if (parameterObject.hasOwnProperty("classes")) {
        $item.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $item.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $item.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $item.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
         $item.html(parameterObject.content);
      }

      return $item;
    },
    getRadioGroup: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getRadioGroup() requires a parameterObject";
      }
      if (!parameterObject.hasOwnProperty("name")) {
        throw "NesUiFactory.getRadioGroup() requires a name field for the group";
      }
      if (!parameterObject.hasOwnProperty("buttons")) {
        throw "NesUiFactory.getRadioGroup() requires a list of buttons to populate with";
      }
      var group = [];
      for (var i = 0, li = parameterObject.buttons.length; i < li; i++) {
        var $lbl = $("<label>");
        var $input =  $("<input>", { "class": "nes-radio", "name": parameterObject.name, "type": "radio" });
        if (parameterObject.buttons[i].hasOwnProperty("classes")) {
          $input.addClass(parameterObject.buttons[i].classes);
        }
        if (parameterObject.buttons[i].hasOwnProperty("style")) {
          $lbl.attr("style", parameterObject.buttons[i].style);
        }
        if (parameterObject.buttons[i].hasOwnProperty("callback")) {
          $input.change(parameterObject.buttons[i].callback);
        }
        if (parameterObject.buttons[i].hasOwnProperty("checked")) {
          $input.attr('checked', parameterObject.buttons[i].checked);
        }
        if (parameterObject.buttons[i].hasOwnProperty("attr")) {
          for (var prop in parameterObject.buttons[i].attr) {
            $input.attr(prop, parameterObject.buttons[i].attr[prop]);
          }
        }
        if (parameterObject.buttons[i].hasOwnProperty("data")) {
          for (var prop in parameterObject.buttons[i].data) {
            $lbl.attr(["data-", prop].join(""), parameterObject.buttons[i].data[prop]);
          }
        }
        var $span = $("<span>").html(parameterObject.buttons[i].content);
        $lbl.append($input);
        $lbl.append($span);
        group.push($lbl);
      }

      return group;
    },
    getTableElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getTableElement() requires a parameterObject";
      }
      var $table = $("<table>", { "class": "nes-table" });
      if (parameterObject.hasOwnProperty("classes")) {
        $table.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $table.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $table.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $table.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      return $table;
    },
    getTextAreaElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getTextAreaElement() requires a parameterObject";
      }
      var $text = $("<textarea>", { "class": "nes-textarea" });
      if (parameterObject.hasOwnProperty("classes")) {
        $text.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $text.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $text.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $text.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $text.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $text.addClass("nes-pointer");
        $text.click(parameterObject.callback);
      }
      return $text;
    },
    getTextElement: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getTextElement() requires a parameterObject";
      }
      var $text = $("<span>", { "class": "nes-text" });
      if (parameterObject.hasOwnProperty("classes")) {
        $text.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $text.attr("style", parameterObject.style);
      }
      if (parameterObject.hasOwnProperty("attr")) {
        for (var prop in parameterObject.attr) {
          $text.attr(prop, parameterObject.attr[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("content")) {
        $text.html(parameterObject.content);
      }
      if (parameterObject.hasOwnProperty("data")) {
        for (var prop in parameterObject.data) {
          $text.attr(["data-", prop].join(""), parameterObject.data[prop]);
        }
      }
      if (parameterObject.hasOwnProperty("callback")) {
        $text.addClass("nes-pointer");
        $text.click(parameterObject.callback);
      }
      return $text;
    },
    getColumn: function(parameterObject) {
      if (typeof(parameterObject) === "undefined") {
        parameterObject = {};
      }
      var $col = $("<div>", { "class": "col" });
      if (parameterObject.hasOwnProperty("classes")) {
        $col.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $col.attr("style", parameterObject.style);
      }
      return $col;
    },
    getContainer: function(parameterObject) {
      if (typeof(parameterObject) === "undefined") {
        parameterObject = {};
      }
      var $container = $("<div>", { "class": "container" });
      if (parameterObject.hasOwnProperty("classes")) {
        $container.addClass(parameterObject.classes);
      }
      if (parameterObject.hasOwnProperty("style")) {
        $container.attr("style", parameterObject.style);
      }
      return $container;
    },
    getRow: function(parameterObject) {
      if (typeof(parameterObject) === "undefined") {
        parameterObject = {};
      }
      var $row = $("<div>", { "class": "row" });
      if (parameterObject.hasOwnProperty("classes")) {
        $row.addClass(parameterObject.classes);
      }
      return $row;
    },
    getPanel: function(parameterObject) {
      if (typeof(parameterObject) === "undefined"
          || parameterObject === null) {
        throw "NesUiFactory.getPanel() requires a parameterObject";
      }
      var $panel = $("<section>", { "class": "nes-container" });
      if (parameterObject.hasOwnProperty("style")) {
        $panel.attr("style", parameterObject.style);
      }

      if (parameterObject.hasOwnProperty("title")) {
        $panel.addClass("with-title");
        $panel.append($("<h3>", { "class": "title" } ).html(parameterObject.title));
      }
      return $panel;
    },
  };
} ());


/**
 * @class UiFactory class.
 */
function UiFactory() {
}
{
  /**
   * Processes an element, applying any required parameters.
   * @param {jQuery} $el the element being processed
   * @param {object} parameterObject a dictionary of paramaters being applied to the element
   */
  UiFactory.prototype.processElement = function($el, parameterObject) {
    if (parameterObject.hasOwnProperty("classes")) {
      $el.addClass(parameterObject.classes);
    }
    if (parameterObject.hasOwnProperty("style")) {
      $el.attr("style", parameterObject.style);
    }
    if (parameterObject.hasOwnProperty("attr")) {
      for (let prop in parameterObject.attr) {
        $el.attr(prop, parameterObject.attr[prop]);
      }
    }
    if (parameterObject.hasOwnProperty("properties")) {
      for (let key in parameterObject.properties) {
        $el.prop(key, parameterObject.properties[key]);
      }
    }    
    if (parameterObject.hasOwnProperty("checked")) {
      $el.attr('checked', parameterObject.checked);
    }
    if (parameterObject.hasOwnProperty("data")) {
      for (let prop in parameterObject.data) {
        $el.attr(["data-", prop].join(""), parameterObject.data[prop]);
      }
    }
    if (parameterObject.hasOwnProperty("content")) {
        $el.html(parameterObject.content);
    }
    if (parameterObject.hasOwnProperty("callback")) {
      if (Object.keys(parameterObject.callback).length > 0) {
        if (parameterObject.callback.hasOwnProperty("args") && parameterObject.callback.hasOwnProperty("body")) {
          parameterObject.callback = new Function(parameterObject.callback.args, parameterObject.callback.body);
          $el.on("click", parameterObject.callback);
        } else {
          for (let prop in parameterObject.callback) {
            let callback = new Function(parameterObject.callback[prop].args, parameterObject.callback[prop].body);
            $el.on(prop, callback);
          }
        }
      } else {
        $el.on("click", parameterObject.callback);
      }
    }
  }
  UiFactory.prototype.getAnchor = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getAnchor() requires a parameterObject";
    }
    let $item = $("<a>");
    this.processElement($item, parameterObject);

    return $item;
  }
  UiFactory.prototype.getAppWindow = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getAppWindow() requires a parameterObject";
    }
    let $el = $("<div>", { "class": "app-window" });
    this.processElement($el, parameterObject);
    return $el;
  }
  UiFactory.prototype.getButton = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getButton() requires a parameterObject";
    }
    let $item = $("<button>");
    this.processElement($item, parameterObject);

    return $item;
  }
  UiFactory.prototype.getCard = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getCard() requires a parameterObject";
    }
    let $card = $("<div>", { "class": "card" });
    if (parameterObject.hasOwnProperty("cardClasses")) {
      if (Array.isArray(parameterObject.cardClasses)) {
        for (let i = parameterObject.cardClasses.length - 1; i >= 0; i--) {
          $card.addClass(parameterObject.cardClasses[i]);
        }
      } else {
        $card.addClass(parameterObject.cardClasses);
      }
    }
    if (parameterObject.hasOwnProperty("image")) {
      let $img = $("<img>", { "class": "card-img-top card-svg-img", "src": parameterObject.image.src });
      if (Array.isArray(parameterObject.image.classes)) {
        for (let i = parameterObject.image.classes.length - 1; i >= 0; i--) {
          $img.addClass(parameterObject.image.classes[i]);
        }
      } else {
        $img.addClass(parameterObject.image.classes);
      }
      $card.append($img);
    }
    if (parameterObject.hasOwnProperty("text")) {
      let $div = $("<div>", { "class": "card-body" });
      if (Array.isArray(parameterObject.text.classes)) {
        for (let i = parameterObject.text.classes.length - 1; i >= 0; i--) {
          $div.addClass(parameterObject.text.classes[i]);
        }
      } else {
        $div.addClass(parameterObject.text.classes);
      }
      $div.append($("<p>", { "class": "card-text" }).html(parameterObject.text.text));
      $card.append($div);
    }
    return $card;
  }
  UiFactory.prototype.getContainerElement = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getContainerElement() requires a parameterObject";
    }
    let $container = $("<div>");
    if (parameterObject.hasOwnProperty("title")) {
      let $h6 = $("<h6>", { "class": "container-title" }).html(parameterObject.title);
      $container.append($h6);
      if (parameterObject.hasOwnProperty("titleId")) {
        $h6.attr("id", parameterObject.titleId);
      }
    }

    return $container;
  },
  UiFactory.prototype.getDivElement = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getDivElement() requires a parameterObject";
    }
    let $el = $("<div>");
    this.processElement($el, parameterObject);
    return $el;
  }
  UiFactory.prototype.getFlexCol = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
          parameterObject = {};
    }
    let $div = $("<div>", { "class": "d-flex flex-column" });
    this.processElement($div, parameterObject);
    return $div;
  }
  UiFactory.prototype.getFlexRow = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
          parameterObject = {};
    }
    let $div = $("<div>", { "class": "d-flex flex-row" });
    this.processElement($div, parameterObject);
    return $div;
  }
  UiFactory.prototype.getH1Element = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getH1Element() requires a parameterObject";
    }
    let $text = $("<h1>");
    this.processElement($text, parameterObject);

    return $text;
  }
  UiFactory.prototype.getH2Element = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getH2Element() requires a parameterObject";
    }
    let $text = $("<h2>");
    this.processElement($text, parameterObject);

    return $text;
  }
  UiFactory.prototype.getH3Element = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getH3Element() requires a parameterObject";
    }
    let $text = $("<h3>");
    this.processElement($text, parameterObject);

    return $text;
  }
  UiFactory.prototype.getH4Element = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getH4Element() requires a parameterObject";
    }
    let $text = $("<h4>");
    this.processElement($text, parameterObject);

    return $text;
  }
  UiFactory.prototype.getH5Element = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getH5Element() requires a parameterObject";
    }
    let $text = $("<h5>");
    this.processElement($text, parameterObject);

    return $text;
  }
  UiFactory.prototype.getH6Element = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getH6Element() requires a parameterObject";
    }
    let $item = $("<h6>");
    this.processElement($item, parameterObject);

    return $item;
  }
  UiFactory.prototype.getHrElement = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getH6Element() requires a parameterObject";
    }
    let $el = $("<hr>");
    this.processElement($el, parameterObject);

    return $el;
  }
  UiFactory.prototype.getList = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getList() requires a parameterObject";
    }
    let $item = $("<ul>");
    this.processElement($item, parameterObject);

    return $item;
  }
  UiFactory.prototype.getListItem = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getListItem() requires a parameterObject";
    }
    let $item = $("<li>");
    this.processElement($item, parameterObject);

    return $item;
  }
  UiFactory.prototype.getNavbar = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getNavbar() requires a parameterObject";
    }
    let $el = $("<nav>", { "class": "navbar" });
    this.processElement($el, parameterObject);

    return $el;
  }
  UiFactory.prototype.getNavitem = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getNavitem() requires a parameterObject";
    }
    let $el = $("<li>", { "class": "nav-item" });
    let $a = $("<a>", { "class": "nav-link", "href": "#" });
    $el.append($a);
    this.processElement($a, parameterObject);

    return $el;
  }
  UiFactory.prototype.getRadioGroup = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getRadioGroup() requires a parameterObject";
    }
    if (!parameterObject.hasOwnProperty("name")) {
      throw "UiFactory.getRadioGroup() requires a name field for the group";
    }
    if (!parameterObject.hasOwnProperty("buttons")) {
      throw "UiFactory.getRadioGroup() requires a list of buttons to populate with";
    }
    let group = [];
    for (let i = 0, li = parameterObject.buttons.length; i < li; i++) {
      let $lbl = $("<label>");
      let $input =  $("<input>", { "class": "nes-radio", "name": parameterObject.name, "type": "radio" });
      this.processElement($input, parameterObject.buttons[i]);
      let $span = $("<span>").html(parameterObject.buttons[i].content);
      $lbl.append($input);
      $lbl.append($span);
      group.push($lbl);
    }

    return group;
  }
  UiFactory.prototype.getSectionElement = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getSectionElement() requires a parameterObject";
    }
    let $text = $("<section>");
    this.processElement($text, parameterObject);

    return $text;
  }
  UiFactory.prototype.getSpanElement = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getSpanElement() requires a parameterObject";
    }
    let $el = $("<span>");
    this.processElement($el, parameterObject);
    return $el;
  }
  UiFactory.prototype.getTextElement = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getTextElement() requires a parameterObject";
    }
    let $el = $("<span>");
    this.processElement($el, parameterObject);
    return $el;
  }
  UiFactory.prototype.getTopLevelContainer = function(parameterObject) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getTextElement() requires a parameterObject";
    }
    let $el = $("<div>");
    this.processElement($el, parameterObject);
    return $el;
  }
  UiFactory.prototype.getWindow = function(parameterObject, watcher) {
    if (typeof(parameterObject) === "undefined"
        || parameterObject === null) {
      throw "UiFactory.getTextElement() requires a parameterObject";
    }
    let $el = $("<div>");
    this.processElement($el, parameterObject);
    return $el;
  }
}
/**
 * @class Factory class for producing Commodore 64-style UI elements.
 */
const AmigaUiFactory = (function() {
  function AmigaUiFactoryClass() { }
  AmigaUiFactoryClass.prototype = new UiFactory();
  AmigaUiFactoryClass.prototype.getButton = function(parameterObject) {
    let $el = UiFactory.prototype.getButton(parameterObject);
    $el.addClass("amiga-btn");
    return $el;
  }
  AmigaUiFactoryClass.prototype.getContainerElement = function(parameterObject) {
    let $el = UiFactory.prototype.getContainerElement(parameterObject);
    $el.addClass("amiga-container");
    return $el;
  }
  AmigaUiFactoryClass.prototype.getTextElement = function(parameterObject) {
    let $el = UiFactory.prototype.getTextElement(parameterObject);
    $el.addClass("amiga-text");
    return $el;
  }
  AmigaUiFactoryClass.prototype.getWindow = function(parameterObject) {
    let $el = UiFactory.prototype.getWindow(parameterObject);
    $el.addClass("window-content");
    if (parameterObject.hasOwnProperty("settings")) {
      if (parameterObject.settings.footer) {
        $el.addClass("window-content-footer");
      }
    }
    return $el;
  }
  return new AmigaUiFactoryClass();
})();
/**
 * @class Factory class for producing Commodore 64-style UI elements.
 */
const C64UiFactory = (function() {
  function C64UiFactoryClass() { }
  C64UiFactoryClass.prototype = new UiFactory();
  C64UiFactoryClass.prototype.getHrElement = function(parameterObject) {
    let $el = UiFactory.prototype.getHrElement(parameterObject);
    $el.addClass("c64-hr");
    return $el;
  }
  C64UiFactoryClass.prototype.getWindow = function(parameterObject) {
    let $el = UiFactory.prototype.getWindow(parameterObject);
    $el.addClass("window-content");
    if (parameterObject.hasOwnProperty("settings")) {
      if (parameterObject.settings.footer) {
        $el.addClass("window-content-footer");
      }
    }
    return $el;
  }
  /**
   * Processes an element, applying any required parameters.
   * @param {jQuery} $el the element being processed
   * @param {object} parameterObject a dictionary of paramaters being applied to the element
   */
   C64UiFactoryClass.prototype.processElement = function($el, parameterObject) {
    UiFactory.prototype.processElement($el, parameterObject);
    if (parameterObject.hasOwnProperty("callback")) {
      $el.addClass("c64-pointer");
    }
  }
  return new C64UiFactoryClass();
})();

/**
 * @class Factory class for producing Commodore 64-style UI elements.
 */
const HypercardUiFactory = (function() {
  function HyperCardUiFactoryClass() { }
  HyperCardUiFactoryClass.prototype = new UiFactory();
  /**
   * Processes an element, applying any required parameters.
   * @param {jQuery} $el the element being processed
   * @param {object} parameterObject a dictionary of paramaters being applied to the element
   */
  HyperCardUiFactoryClass.prototype.processElement = function($el, parameterObject) {
    UiFactory.prototype.processElement($el, parameterObject);
    if (parameterObject.hasOwnProperty("callback")) {
      $el.addClass("c64-pointer");
    }
  }
  /**
   * Gets a windowed element.
   * @param {object} parameterObject the window parameters
   * @returns {jQuery} a jQuery DOM element
   */
  HyperCardUiFactoryClass.prototype.getWindow = function(parameterObject, watcher) {
    let $el = UiFactory.prototype.getWindow(parameterObject);
    $el.addClass("hypercard-container");
    if (parameterObject.hasOwnProperty("settings")) {
      if (parameterObject.settings.hasOwnProperty("borders-rendered")
          && parameterObject.settings["borders-rendered"] > 0) {
        // add border styles
        let borders = ["0px", "0px", "0px", "0px"], index = 0, value = parseInt(parameterObject.settings["borders-rendered"]);
        if ((parameterObject.settings["borders-rendered"] & 1) == 1) {
          borders[index] = "2px";
        }
        index++;
        if ((parameterObject.settings["borders-rendered"] & 2) == 2) {
          borders[index] = "2px";
        }
        index++;
        if ((parameterObject.settings["borders-rendered"] & 4) == 4) {
          borders[index] = "2px";
        }
        index++;
        if ((parameterObject.settings["borders-rendered"] & 8) == 8) {
          borders[index] = "2px";
        }
        $el.css("border-width", borders.join(" "));
        if (parameterObject.settings.hasOwnProperty("border-corners")
            && parameterObject.settings["border-corners"] === "rounded") {
          borders = ["0px", "0px", "0px", "0px"];
          index = 0;
          if ((parameterObject.settings["borders-rendered"] & 1) == 1
              && (parameterObject.settings["borders-rendered"] & 8) == 8) {
            // has top and left borders
            borders[index] = "10px";
          }
          index++;
          if ((parameterObject.settings["borders-rendered"] & 1) == 1
              && (parameterObject.settings["borders-rendered"] & 2) == 2) {
            // has top and right borders
            borders[index] = "10px";
          }
          index++;
          if ((parameterObject.settings["borders-rendered"] & 4) == 4
              && (parameterObject.settings["borders-rendered"] & 8) == 8) {
            // has bottom and left borders
            borders[index] = "10px";
          }
          index++;
          if ((parameterObject.settings["borders-rendered"] & 4) == 4
              && (parameterObject.settings["borders-rendered"] & 2) == 2) {
            // has bottom and right borders
            borders[index] = "10px";
          }
          $el.css("border-radius", borders.join(" "));
        }
      } else {
        if (parameterObject.settings.hasOwnProperty("border-corners")
            && parameterObject.settings["border-corners"] === "rounded") {
          // set all borders rounded
          $el.css("border-radius", "10px");
        }
      }
      if (parameterObject.settings.hasOwnProperty("title")) {
        $el.addClass("with-title");
        let $h3 = $("<h3>", { "class": "title"}).html(parameterObject.settings.title);
        if (parameterObject.settings.hasOwnProperty("title-settings")) {
          if (parameterObject.settings["title-settings"].hasOwnProperty("centered")
              && parameterObject.settings["title-settings"].centered) {
            $h3.addClass("is-centered");
          }
          if (parameterObject.settings["title-settings"].hasOwnProperty("borders-rendered")
              && parameterObject.settings["title-settings"]["borders-rendered"] > 0) {
            // add border styles
            let borders = ["0px", "0px", "0px", "0px"], index = 0, value = parseInt(parameterObject.settings["title-settings"]["borders-rendered"]);
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 1) == 1) {
              borders[index] = "2px";
            }
            index++;
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 2) == 2) {
              borders[index] = "2px";
            }
            index++;
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 4) == 4) {
              borders[index] = "2px";
            }
            index++;
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 8) == 8) {
              borders[index] = "2px";
            }
            $h3.css("border-width", borders.join(" "));
            if (parameterObject.settings["title-settings"].hasOwnProperty("border-corners")
                && parameterObject.settings["title-settings"]["border-corners"] === "rounded") {
              borders = ["0px", "0px", "0px", "0px"];
              index = 0;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 1) == 1
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 8) == 8) {
                // has top and left borders
                borders[index] = "10px";
              }
              index++;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 1) == 1
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 2) == 2) {
                // has top and right borders
                borders[index] = "10px";
              }
              index++;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 4) == 4
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 8) == 8) {
                // has bottom and left borders
                borders[index] = "10px";
              }
              index++;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 4) == 4
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 2) == 2) {
                // has bottom and right borders
                borders[index] = "10px";
              }
              $h3.css("border-radius", borders.join(" "));
              $h3.css("border-style", "solid");
              $h3.css("padding", "10px");
              $h3.css("margin-top", "-2.8rem");
            }
          } else {
            if (parameterObject.settings["title-settings"].hasOwnProperty("border-corners")
                && parameterObject.settings["title-settings"]["border-corners"] === "rounded") {
              // set all borders rounded
              $h3.css("border-radius", "10px");
              $h3.css("border-style", "solid");
              $h3.css("padding", "10px");
              $h3.css("margin-top", "-2.8rem");
            }
          }          
          if (parameterObject.settings["title-settings"].hasOwnProperty("isWatched")
              && parameterObject.settings["title-settings"].isWatched
              && typeof(watcher) !== "undefined") {
            watcher.addWatchElement(parameterObject.settings["title-settings"].watchParameter, $h3);
          }
        }
        $el.prepend($h3);
      }
    }
    return $el;
  }
  return new HyperCardUiFactoryClass();
})();

/**
 * @class Factory class for producing DOS-style UI elements.
 */
const I386UiFactory = (function() {
  function I386UiFactoryClass() { }
  I386UiFactoryClass.prototype = new UiFactory();
  I386UiFactoryClass.prototype.getSpanElement = function(parameterObject) {
    console.log("sub class. call base")
    let $el = UiFactory.prototype.getSpanElement(parameterObject);
    
    if (parameterObject.hasOwnProperty("callback")) {
      // $el.addClass("c64-pointer");
    }
    return $el;
  }
  return new I386UiFactoryClass();
})();

/**
 * @class Factory class for producing NES-style UI elements.
 */
const NesUiFactory = (function() {
  function NesUiFactoryClass() { }
  NesUiFactoryClass.prototype = new UiFactory();
  /**
   * Processes an element, applying any required parameters.
   * @param {jQuery} $el the element being processed
   * @param {object} parameterObject a dictionary of paramaters being applied to the element
   */
  NesUiFactoryClass.prototype.processElement = function($el, parameterObject) {
    UiFactory.prototype.processElement($el, parameterObject);
    if (parameterObject.hasOwnProperty("callback")) {
      $el.addClass("nes-pointer");
    }
  }
  /**
   * Gets a windowed element.
   * @param {object} parameterObject the window parameters
   * @returns {jQuery} a jQuery DOM element
   */
  NesUiFactoryClass.prototype.getWindow = function(parameterObject) {
    let $el = UiFactory.prototype.getWindow(parameterObject);
    $el.addClass("nes-container");
    if (parameterObject.hasOwnProperty("settings")) {
      if (parameterObject.settings.hasOwnProperty("borders-rendered")
          && parameterObject.settings["borders-rendered"] > 0) {
        // add border styles
        let borders = ["0px", "0px", "0px", "0px"], index = 0, value = parseInt(parameterObject.settings["borders-rendered"]);
        if ((parameterObject.settings["borders-rendered"] & 1) == 1) {
          borders[index] = "4px";
        }
        index++;
        if ((parameterObject.settings["borders-rendered"] & 2) == 2) {
          borders[index] = "4px";
        }
        index++;
        if ((parameterObject.settings["borders-rendered"] & 4) == 4) {
          borders[index] = "4px";
        }
        index++;
        if ((parameterObject.settings["borders-rendered"] & 8) == 8) {
          borders[index] = "4px";
        }
        $el.css("border-width", borders.join(" "));
        if (parameterObject.settings.hasOwnProperty("border-corners")
            && parameterObject.settings["border-corners"] === "rounded") {
          borders = ["0px", "0px", "0px", "0px"];
          index = 0;
          if ((parameterObject.settings["borders-rendered"] & 1) == 1
              && (parameterObject.settings["borders-rendered"] & 8) == 8) {
            // has top and left borders
            borders[index] = "10px";
          }
          index++;
          if ((parameterObject.settings["borders-rendered"] & 1) == 1
              && (parameterObject.settings["borders-rendered"] & 2) == 2) {
            // has top and right borders
            borders[index] = "10px";
          }
          index++;
          if ((parameterObject.settings["borders-rendered"] & 4) == 4
              && (parameterObject.settings["borders-rendered"] & 8) == 8) {
            // has bottom and left borders
            borders[index] = "10px";
          }
          index++;
          if ((parameterObject.settings["borders-rendered"] & 4) == 4
              && (parameterObject.settings["borders-rendered"] & 2) == 2) {
            // has bottom and right borders
            borders[index] = "10px";
          }
          $el.css("border-radius", borders.join(" "));
        }
      } else {
        if (parameterObject.settings.hasOwnProperty("border-corners")
            && parameterObject.settings["border-corners"] === "rounded") {
          // set all borders rounded
          $el.css("border-radius", "10px");
        }
      }
      if (parameterObject.settings.hasOwnProperty("title")) {
        $el.addClass("with-title");
        let $h3 = $("<h3>", { "class": "title"}).html(parameterObject.settings.title);
        if (parameterObject.settings.hasOwnProperty("title-settings")) {
          if (parameterObject.settings["title-settings"].hasOwnProperty("centered")
              && parameterObject.settings["title-settings"].centered) {
            $h3.addClass("is-centered");
          }
          if (parameterObject.settings["title-settings"].hasOwnProperty("borders-rendered")
              && parameterObject.settings["title-settings"]["borders-rendered"] > 0) {
            // add border styles
            let borders = ["0px", "0px", "0px", "0px"], index = 0, value = parseInt(parameterObject.settings["title-settings"]["borders-rendered"]);
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 1) == 1) {
              borders[index] = "4px";
            }
            index++;
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 2) == 2) {
              borders[index] = "4px";
            }
            index++;
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 4) == 4) {
              borders[index] = "4px";
            }
            index++;
            if ((parameterObject.settings["title-settings"]["borders-rendered"] & 8) == 8) {
              borders[index] = "4px";
            }
            $h3.css("border-width", borders.join(" "));
            if (parameterObject.settings["title-settings"].hasOwnProperty("border-corners")
                && parameterObject.settings["title-settings"]["border-corners"] === "rounded") {
              borders = ["0px", "0px", "0px", "0px"];
              index = 0;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 1) == 1
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 8) == 8) {
                // has top and left borders
                borders[index] = "10px";
              }
              index++;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 1) == 1
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 2) == 2) {
                // has top and right borders
                borders[index] = "10px";
              }
              index++;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 4) == 4
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 8) == 8) {
                // has bottom and left borders
                borders[index] = "10px";
              }
              index++;
              if ((parameterObject.settings["title-settings"]["borders-rendered"] & 4) == 4
                  && (parameterObject.settings["title-settings"]["borders-rendered"] & 2) == 2) {
                // has bottom and right borders
                borders[index] = "10px";
              }
              $h3.css("border-radius", borders.join(" "));
              $h3.css("border-style", "solid");
              $h3.css("padding", "10px");
              $h3.css("margin-top", "-2.8rem");
            }
          } else {
            if (parameterObject.settings["title-settings"].hasOwnProperty("border-corners")
                && parameterObject.settings["title-settings"]["border-corners"] === "rounded") {
              // set all borders rounded
              $h3.css("border-radius", "10px");
              $h3.css("border-style", "solid");
              $h3.css("padding", "10px");
              $h3.css("margin-top", "-2.8rem");
            }
          }
        }
        $el.prepend($h3);
      }
    }
    return $el;
  }
  return new NesUiFactoryClass();
})();

/**
 * @class Factory class for producing RPG-style UI elements.
 */
const RpguiUiFactory = (function() {
  function RpguiUiFactoryClass() { }
  RpguiUiFactoryClass.prototype = new UiFactory();
  RpguiUiFactoryClass.prototype.getSpanElement = function(parameterObject) {
    console.log("sub class. call base")
    let $el = UiFactory.prototype.getSpanElement(parameterObject);
    
    if (parameterObject.hasOwnProperty("callback")) {
      // $el.addClass("c64-pointer");
    }
    return $el;
  }
  RpguiUiFactoryClass.prototype.getTopLevelContainer = function(parameterObject) {
    console.log("sub class. call base")
    let $el = UiFactory.prototype.getTopLevelContainer(parameterObject);
    $el.addClass("rpgui-content rpgui-cursor-default");
    return $el;
  }
  return new RpguiUiFactoryClass();
})();

if (typeof(module) !== "undefined") {
  module.exports = { Condition, Direction, EquipmentItemModifier, FlagSet, InteractiveObject, InventoryData, InventorySlot, IoBehaviourData, IoEquipItem, IoItemData, IoNpcData, IoPcData, IoScript, IoSpellData, Location, AttributeLookupTable, VariableKeyTableEntry, PlayerAttribute, PlayerAttributeDescriptors, ScriptAction, ScriptTimer, StackedEvent, Watchable, Watcher, DijkstraUndirectedSearch, EdgeWeightedUndirectedGraph, GraphEdge, WeightedGraphEdge, GraphNode, SimpleVector3, SimpleVector2, HexCoordinateSystem, CompoundHexagon, Hexagon, IndexMinPQ, SimpleVector2, SimpleVector3, AlignmentGrid, CardGame, UiScene, Dice, Interactive, Script, AmigaUiFactoryOld, ContentBuilder, NesUiFactoryOld, AmigaUiFactory, C64UiFactory, HypercardUiFactory, I386UiFactory, NesUiFactory, RpguiUiFactory, UiFactory };
}

