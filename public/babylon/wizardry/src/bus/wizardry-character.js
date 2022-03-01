import { WizardryHpRecord } from "./utility/wizardry-hp-record.js";
import { WizardryAlignment,
  WizardryAttribute,
  WizardryCharacterStatus,
  WizardryCharacterClass,
  WizardryRace,
  WizardrySpell }           from "../config/wizardry-constants.js";
import { Watchable }        from "../../../assets/js/base.js";

const IGNORE_JSON_FIELDS = {
  _watchers: 0,
}
const TRANSFORM_JSON_FIELDS = {
  _age: (data, value) => { data.age = value; },
  _alignment: (data, value) => { data.alignment = WizardryAlignment.fromString(value.title); },
  _armorCl: (data, value) => { data.armorCl = value; },
  _attributes: (data, attributes) => {
    for (let attribute in attributes) {
      data.setAttribute(WizardryAttribute.fromString(attribute), attributes[attribute]);
    }
  },
  _charLev: (data, value) => { data.charLev = value; },
  _clazz: (data, value) => { data.clazz = WizardryCharacterClass.fromString(value.title); },
  _exp: (data, value) => { data.exp = value; },
  _gold: (data, value) => { data.gold = value; },
  /**
   * Sets the _hpLeft field directly, since it can't be set through the property before hpMax (it gets set to 0).
   * @param {WizardryCharacter} data 
   * @param {Number} value 
   */
  _hpLeft: (data, value) => { data._hpLeft = value; },
  _hpMax: (data, value) => { data.hpMax = value; },
  _inMaze: (data, value) => { data.inMaze = value; },
  _lostXyl: (data, value) => {
    for (let i = value.location.length - 1; i >= 0; i--) {
      data.lostXyl.location[i] = value.location[i];
    }
    for (let i = value.poisonAmt.length - 1; i >= 0; i--) {
      data.lostXyl.poisonAmt[i] = value.poisonAmt[i];
    }
    for (let i = value.awards.length - 1; i >= 0; i--) {
      data.lostXyl.awards[i] = value.awards[i];
    }
  },
  _luckSkill: (data, value) => {
    for (let i = value.length - 1; i >= 0; i--) {
      data.luckSkill[i] = value[i];
    }
  },
  _mageSpells: (data, value) => {
    for (let i = value.length - 1; i >= 0; i--) {
      data.mageSpells[i] = value[i];
    }
  },
  _maxLevAc: (data, value) => { data.maxLevAc = value; },
  _name: (data, value) => { data.name = value; },
  /**
   * Sets the _partyOrder field..
   * @param {WizardryCharacter} data 
   * @param {Number} value 
   */
  _partyOrder: (data, value) => { data.partyOrder = value; },
  _priestSpells: (data, value) => {
    for (let i = value.length - 1; i >= 0; i--) {
      data.priestSpells[i] = value[i];
    }
  },
  _race: (data, value) => { data.race = WizardryRace.fromString(value.title); }, 
  _refId: (data, value) => { data._refId = value; },
  _spellsKnown: (data, value) => {
    for (let prop in value) {
      data.spellsKnown[[WizardrySpell.fromString(prop)]] = value[prop];
    }
  },
  _status: (data, value) => { data.status = WizardryCharacterStatus.fromString(value.title); },
  _timeCreated: (data, value) => { data.timeCreated = value; },
}
/**
 * @class Player characters are defined by the WizardryCharacter class.
 * @param {object} parameterObject optional initialization parameters
 */
class WizardryCharacter extends Watchable {
  static fromJson(json) {
    let character = new WizardryCharacter();
    let f = [];
    for (let prop in json) {
      f.push(prop);
    }
    for (let prop in json) {
      if (IGNORE_JSON_FIELDS.hasOwnProperty(prop)) {
        continue;
      }
      if (TRANSFORM_JSON_FIELDS.hasOwnProperty(prop)) {
        try {
          TRANSFORM_JSON_FIELDS[prop](character, json[prop]);
        } catch (e) {
          console.error(e)
        }
      }
    }
    console.log(f)
    return character;
  }
  /**
   * Generates a random key.
   * @returns {string} a random key
   */
  static randomKey() {
    return [Date.now().toString(36), Math.random().toString(36).substring(2)].join("");
  }
  constructor(parameterObject) {
    super();
    /** @private the character's age. */
    this._age = 0;
    /** @private the character's alignment. */
    this._alignment = WizardryAlignment.UNALIGN;
    /** @private the character's armorCl. */
    this._armorCl = 0;
    /** @private the character's attributes. */
    this._attributes = {
      [WizardryAttribute.STRENGTH]: 0,
      [WizardryAttribute.IQ]: 0,
      [WizardryAttribute.PIETY]: 0,
      [WizardryAttribute.VITALITY]: 0,
      [WizardryAttribute.AGILITY]: 0,
      [WizardryAttribute.LUCK]: 0,
    };
    /** @private the character's level. */
    this._charLev = 0;
    /** @private the character's class. */
    this._clazz = null;
    /** @private the character's critHitM. */
    this._critHitM = false;
    /** @private the character's exp. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000. */
    this._exp = 0;
    /** @private the character's gold. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000. */
    this._gold = 0;
    /** @private the character's heal pts. */
    this._healPts = 0;
    /** @private the character's hpCalcMd. */
    this._hpCalcMd = 0;
    /** @private the character's hpDamRc. */
    this._hpDamRc = new WizardryHpRecord();
    /** @private the character's hpLeft. */
    this._hpLeft = 0;
    /** @private the character's hp max. */
    this._hpMax = 0;
    /** @private flag indicating whether the character is in the maze. */
    this._inMaze = false;
    /** @private the character's lostXyl. in original code, and object made up of four arrays whose indices are 1-4. */
    this._lostXyl = {
      location: [0, 0, 0, 0],
      poisonAmt: [0, 0, 0, 0],
      awards: [0, 0, 0, 0],
    };
    /** @private the character's luck skills(??). */
    this._luckSkill = [0, 0, 0, 0, 0];
    /** @private the character's mage spells. an array of integers. in the original code the indices are 1-7. */
    this._mageSpells = [0, 0, 0, 0, 0, 0, 0];
    /** @private the character's maxLevAc. */
    this._maxLevAc = 0;
    /** @private the character's name. */
    this._name = "";
    /**
     * The character's party order.
     * @private
     * @type {Number}
     */
    this._partyOrder = -1;
    /** @private the character's possessions. */
    this._possessions = (function() {
      let _possession = [];
      for (let i = 8; i > 0; i--) {
        _possession.push({
          equipped: false,
          cursed: false,
          identified: false,
          equipmentIndex: -1
        });
      }
      return {
        /**
         * The number of possessions the character has in inventory.
         */
        get count() {
          let c = 0;
          for (let i = _possession.length - 1; i >= 0; i--) {
            if (_possession[i].equipmentIndex >= 0) {
              c++;
            }
          }
          return c;
        },
        /**
         * The character's individual possessions.
         */
        get possession() {
          return _possession;
        }
      }
    } ());
    /** @private the character's priest spells. an array of integers. in the original code the indices are 1-7. */
    this._priestSpells = [0, 0, 0, 0, 0, 0, 0];
    /** @private the character's race. */
    this._race = WizardryRace.NORACE;
    /** @private the character's reference id. */
    this._refId = WizardryCharacter.randomKey();
    /** @private the character's known spells. An array of 50 boolean values. */
    this._spellsKnown = {};
    const spells = WizardrySpell.values;
    for (let i = spells.length - 1; i >= 0; i--) {
      this._spellsKnown[[spells[i]]] = false;
    }
    /** @private the character's status. */
    this._status = WizardryCharacterStatus.OK;
    /** @private the character's swingCnt. */
    this._swingCnt = 0;
    /** @private the time the character was created. */
    this._timeCreated = new Date();
    /** @private the character's wepVsty2. */
    this._wepVsty2 = [
      [false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false]
    ];
    /** @private the character's wepVsty3. */
    this._wepVsty3 = [
      [false, false, false, false, false, false],
      [false, false, false, false, false, false]
    ];
    /** @private the character's wepVstyP. */
    this._wepVstyP = [false, false, false, false, false, false, false, false, false, false, false, false, false];
  }
  /**
   * Getter for the _age field.
   */
  get age() {
    return this._age;
  }
  /**
   * Setter for the _age field.
   */
  set age(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._age = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _alignment field.
   */
  get alignment() {
    return this._alignment;
  }
  /**
   * Setter for the _alignment field.
   */
  set alignment(value) {
    this._alignment = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _armorCl field.
   */
  get armorCl() {
    return this._armorCl;
  }
  /**
   * Setter for the _armorCl field.
   */
  set armorCl(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._armorCl = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _charLev field.
   */
  get charLev() {
    return this._charLev;
  }
  /**
   * Setter for the _charLev field.
   */
  set charLev(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._charLev = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _clazz field.
   */
  get clazz() {
    return this._clazz;
  }
  /**
   * Setter for the _clazz field.
   */
  set clazz(value) {
    this._clazz = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _critHitM.
   */
  get critHitM() {
    return this._critHitM;
  }
  /**
   * Setter for the _critHitM field.
   */
  set critHitM(value) {
    if (typeof(value) !== "boolean") {
      throw ["Invalid value", value];
    }
    this._critHitM = value;
  }
  /**
   * Getter for the _exp field. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000.
   */
  get exp() {
    return this._exp;
  }
  /**
   * Setter for the _exp field. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000.
   */
  set exp(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._exp = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _gold field. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000.
   */
  get gold() {
    return this._gold;
  }
  /**
   * Setter for the _gold field. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000.
   */
  set gold(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._gold = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _healPts field.
   */
  get healPts() {
    return this._healPts;
  }
  /**
   * Setter for the _healPts field.
   */
  set healPts(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._healPts = value;
  }
  /**
   * Getter for the _hpCalcMd field.
   */
  get hpCalcMd() {
    return this._hpCalcMd;
  }
  /**
   * Setter for the _hpCalcMd field.
   */
  set hpCalcMd(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._hpCalcMd = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _hpDamRc field.
   */
  get hpDamRc() {
    return this._hpDamRc;
  }
  /**
   * Getter for the _hpLeft field.
   */
  get hpLeft() {
    return this._hpLeft;
  }
  /**
   * Setter for the _hpLeft field.
   */
  set hpLeft(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._hpLeft = value;
    if (this._hpLeft > this._hpMax) {
      this._hpLeft = this._hpMax;
    }
    this.notifyWatchers();
  }
  /**
   * Getter for the _hpMax field.
   */
  get hpMax() {
    return this._hpMax;
  }
  /**
   * Setter for the _hpMax field.
   */
  set hpMax(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._hpMax = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _inMaze field.
   */
  get inMaze() {
    return this._inMaze;
  }
  /**
   * Setter for the _hpMax field.
   */
  set inMaze(value) {
    if (typeof(value) !== "boolean") {
      throw ["Invalid value", value];
    }
    this._inMaze = value;
    this.notifyWatchers();
  }
  /**
   * Flag determining if the character knows Mage spells.
   */
  get knowsMagic() {
    let knows = false;
    let keys = Object.keys(this._spellsKnown);
    for (let i = keys.length - 1; i >= 0; i--) {
      if (this._spellsKnown[keys[i]]) {
        if (WizardrySpell.fromString(keys[i]).clazz === "MAGE") {
          knows = true;
        }
      }
    }
    return knows;
  }
  /**
   * Flag determining if the character knows Priest spells.
   */
  get knowsPrayers() {
    let knows = false;
    let keys = Object.keys(this._spellsKnown);
    for (let i = keys.length - 1; i >= 0; i--) {
      if (this._spellsKnown[keys[i]]) {
        if (WizardrySpell.fromString(keys[i]).clazz === "PRIEST") {
          knows = true;
        }
      }
    }
    return knows;
  }
  /**
   * Getter for the _lostXyl field, an object containing 3 integer array members. In the original code, the arrays are indexed from 1 to 4.
   */
  get lostXyl() {
    return this._lostXyl;
  }
  /**
   * Getter for the _luckSkill field.
   */
  get luckSkill() {
    return this._luckSkill;
  }
  /**
   * Getter for the _mageSpells field, an array of integer values. In the original code the indices are 1-7, indicating the number of spells known per level.
   */
  get mageSpells() {
    return this._mageSpells;
  }
  /**
   * Getter for the _maxLevAc field.
   */
  get maxLevAc() {
    return this._maxLevAc;
  }
  /**
   * Setter for the _maxLevAc field.
   */
  set maxLevAc(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._maxLevAc = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _name field.
   */
  get name() {
    return this._name;
  }
  /**
   * Setter for the _name field.
   */
  set name(value) {
    this._name = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _partyOrder field.
   */
  get partyOrder() {
    return this._partyOrder;
  }
  /**
   * Setter for the _partyOrder field.
   */
  set partyOrder(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._partyOrder = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _possessions field.
   */
  get possessions() {
    return this._possessions;
  }
  /**
   * Getter for the _priestSpells field, an array of integer values. In the original code the indices are 1-7, indicating the number of spells known per level.
   */
  get priestSpells() {
    return this._priestSpells;
  }
  /**
   * Getter for the _race field.
   */
  get race() {
    return this._race;
  }
  /**
   * Setter for the _race field.
   */
  set race(value) {
    this._race = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _refId field.
   */
  get refId() {
    return this._refId;
  }
  /**
   * Getter for the _spellsKnown field, an array of 50 boolean values.
   */
  get spellsKnown() {
    return this._spellsKnown;
  }
  /**
   * Getter for the _status field.
   */
  get status() {
    return this._status;
  }
  /**
   * Setter for the _status field.
   */
  set status(value) {
    this._status = value;
    this.notifyWatchers();
  }
  /**
   * Getter for the _swingCnt field.
   */
  get swingCnt() {
    return this._swingCnt;
  }
  /**
   * Setter for the _swingCnt field.
   */
  set swingCnt(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._swingCnt = value;
  }
  /**
   * Getter for the _timeCreated field.
   */
  get timeCreated() {
    return this._timeCreated;
  }
  /**
   * Setter for the _timeCreated field.
   */
  set timeCreated(value) {
    this._timeCreated = new Date(value);
  }
  /**
   * Getter for the _wepVsty2 field.
   */
   get wepVsty2() {
    return this._wepVsty2;
  }
  /**
   * Getter for the _wepVsty3 field.
   */
   get wepVsty3() {
    return this._wepVsty3;
  }
  /**
   * Getter for the _wepVstyP field.
   */
  get wepVstyP() {
    return this._wepVstyP;
  }
  /**
   * Adds an item to the character's inventory.
   * @param {object} parameterObject a parameter object containing the following required fields:
   * 
   * equipped {Boolean} a flag indicating whether the item is equipped
   * 
   * identified {Boolean} a flag indicating whether the item is identified
   * 
   * cursed {Boolean} a flag indicating whether the item is cursed
   * 
   * id {Number} the item's reference id
   */
  addToInventory(parameterObject) {
    if (typeof(parameterObject) === "undefined" || parameterObject === null) {
      throw "WizardryCharacter.addToInventory() requires a parameter object";
    }
    if (!parameterObject.hasOwnProperty("equipped")
        || !parameterObject.hasOwnProperty("identified")
        || !parameterObject.hasOwnProperty("cursed")
        || !parameterObject.hasOwnProperty("id")) {
      throw ["WizardryCharacter.addToInventory() requires a well-formed parameter object", parameterObject];
    }
    let index = -1;
    for (let i = 0, li = this._possessions.possession.length; i < li; i++) {
      if (this._possessions.possession[i].equipmentIndex === -1) {
        index = i;
        break;
      }
    }
    if (index < 0) {
      throw "WizardryCharacter.addToInventory() has no room in inventory";
    }
    this._possessions.possession[index].equipped = parameterObject.equipped;
    this._possessions.possession[index].identified = parameterObject.identified;
    this._possessions.possession[index].cursed = parameterObject.cursed;
    this._possessions.possession[index].equipmentIndex = parameterObject.id;
  }
  /**
   * Adds a watcher.
   * @param {Watcher} watcher the watcher
   */
  addWatcher(watcher) {
    super.addWatcher(watcher);
  }
  /**
   * Gets an attribute's value.
   * @param {WizardryAttribute} attribute the attribute being set
   * @return {Number} the value
   */
  getAttribute(attribute) {
    return this._attributes[[attribute]];
  }
  /**
   * Determines if the character is carrying any cursed items.
   * @returns {Boolean} true if the character has at least one cursed item; false otherwise
   */
  hasAnyCursedEquipment() {
    let atLeastOne = false;
    for (let i = this._possessions.possession.length - 1; i >= 0; i--) {
      const item = this._possessions.possession[i];
      if (item.equipmentIndex >= 0 && item.cursed) {
        atLeastOne = true;
        break;
      }
    }
    return atLeastOne;
  }
  /**
   * Determines if the character is carrying any unidentified items.
   * @returns {Boolean} true if the character has at least one unidentified item; false otherwise
   */
  hasAnyUnidentifiedEquipment() {
    let atLeastOne = false;
    for (let i = this._possessions.possession.length - 1; i >= 0; i--) {
      const item = this._possessions.possession[i];
      if (item.equipmentIndex >= 0 && !item.identified) {
        atLeastOne = true;
        break;
      }
    }
    return atLeastOne;
  }
  /**
   * Removes an item from the character's inventory. All posessions in slots below the removed item are moved up, and the last inventory slot is emptied.
   * @param {Number} index the inventory item's index
   */
  removeFromInventory(index) {
    if (isNaN(parseInt(index))) {
      throw ["WizardryCharacter.removeFromInventory() requires a valid index", index];
    }
    if (this._possessions.possession[index].equipmentIndex === -1) {
      throw ["WizardryCharacter.removeFromInventory() - character has nothing in that slot", index];
    }
    // starting at the index being removed, every possession gets the values of the possessions below it
    for (let i = index, li = this._possessions.possession.length - 1; i < li; i++) {
      let poss0 = this._possessions.possession[i];
      let poss1 = this._possessions.possession[i + 1];
      poss0.equipped       = poss1.equipped;
      poss0.identified     = poss1.identified;
      poss0.cursed         = poss1.cursed;
      poss0.equipmentIndex = poss1.equipmentIndex;
    }
    this._possessions.possession[this._possessions.possession.length - 1].equipped = false
    this._possessions.possession[this._possessions.possession.length - 1].identified = false;
    this._possessions.possession[this._possessions.possession.length - 1].cursed = false;
    this._possessions.possession[this._possessions.possession.length - 1].equipmentIndex = -1;
  }
  /**
   * Sets an attribute's value.
   * @param {WizardryAttribute} attribute the attribute being set
   * @param {Number} value the new value
   */
  setAttribute(attribute, value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._attributes[[attribute]] = value;
    this.notifyWatchers();
  }
};

export { WizardryCharacter };
