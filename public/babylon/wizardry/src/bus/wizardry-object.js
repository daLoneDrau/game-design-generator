import { WizardryHpRecord } from "./utility/wizardry-hp-record.js";
import { WizardryAlignment,
  WizardryObjectType,
  WizardryCharacterClass,
  WizardrySpell }           from "../config/wizardry-constants.js";

const TRANSFORM_JSON_FIELDS = {
  _alignment: (data, value) => { data.alignment = WizardryAlignment.fromString(value.title); },
  _armorMod: (data, value) => { data.armorMod = value; },
  _boltacXX: (data, value) => { data.boltacXX = value; },
  _changeChance: (data, value) => { data.changeChance = value; },
  _changeTo: (data, value) => { data.changeTo = value; },
  _classUse: (data, value) => {
    for (let prop in value) {
      data.classUse[WizardryCharacterClass.fromString(prop)] = value[prop];
    }
  },
  _cursed: (data, value) => { data.cursed = value; },
  _healPts: (data, value) => { data.healPts = value; },
  _name: (data, value) => { data.name = value; },
  _nameUnknown: (data, value) => { data.nameUnknown = value; },
  _objType: (data, value) => { data.objType = WizardryObjectType.fromString(value.title); },
  _price: (data, value) => { data.price = value; },
  _special: (data, value) => { data.special = value; },
  _spellPower: (data, value) => { data.spellPower = value === null ? value : WizardrySpell.fromString(value.title); },
}
/**
 * @class The application defines a class for objects.
 */
class WizardryObject {
  static fromJson(json) {
    let object = new WizardryObject();
    let f = [];
    for (let prop in json) {
      f.push(prop);
    }
    for (let prop in json) {
      if (TRANSFORM_JSON_FIELDS.hasOwnProperty(prop)) {
        try {
          TRANSFORM_JSON_FIELDS[prop](object, json[prop]);
        } catch (e) {
          console.error(e)
        }
      }
    }
    return object;
  }
  /**
   * Creates a new instance of WizardryObject.
   * @param {object} parameterObject optional initialization parameters
   */
  constructor(parameterObject) {
    /** @private the object's alignment. */
    this._alignment = WizardryAlignment.UNALIGN;
    /** @private the object's armor class modifier. */
    this._armorMod = 0;
    /** @private the # of the item in stock in boltac's trading post. */
    this._boltacXX = 0;
    /** @private the % chance the object will change into another after use. */
    this._changeChance = 0;
    /** @private the id of the object this object may change to after use. */
    this._changeTo = 0;
    /** @private the object's dictionary of classes allowed to use it. */
    this._classUse = {
      [WizardryCharacterClass.FIGHTER]: false,
      [WizardryCharacterClass.MAGE]: false,
      [WizardryCharacterClass.PRIEST]: false,
      [WizardryCharacterClass.THIEF]: false,
      [WizardryCharacterClass.BISHOP]: false,
      [WizardryCharacterClass.SAMURAI]: false,
      [WizardryCharacterClass.LORD]: false,
      [WizardryCharacterClass.NINJA]: false
    };
    /** @private a flag indicating whether the object is cursed. */
    this._cursed = false;
    /**
     * @private the object's regeneration points when equipped. very few items will have this. limited to:
     * 
     * Armor of Lords, Ring of Death, Ring of Healing, and Werdna's Amulet
     */
    this._healPts = 0;
    /** @private The object's name. */
    this._name = "";
    /** @private The object's unidentified name. */
    this._nameUnknown = "";
    /** @private the object's type of enum WizardryObjectType. */
    this._objType = null;
    /** @private the object's price. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000. */
    this._price = 0;
    /**
     * @private flag for any special powers the object might have.
     * 
     * 0 - no powers
     * 
     * 1-6 - increase an attribue by 1
     * 
     * 7-12 - decrease an attribue by 1
     * 
     * 13 - reduce age by 1 year
     * 
     * 14 - increase age by 1 year
     * 
     * 15 - change class to samurai
     * 
     * 16 - change class to lord
     * 
     * 17 - change class to ninja
     * 
     * 18 - award 50,000 gold
     * 
     * 19 - award 50,000 exp
     * 
     * 20 - user status become LOST
     * 
     * 21 - status becomes ok, all HP healed, all poison cleared
     * 
     * 22 - heal user completely
     * 
     * 23 - heal all party members completely
     */
    this._special = 0;
    /** @private the spell power invoked when the object is used, of enum type WizardrySpell. */
    this._spellPower = null;
    /** @private the object's wepHitMod. */
    this._wepHitMod = 0;
    /** @private the object's wepHpDam. */
    this._wepHpDam = new WizardryHpRecord();
    /** @private the object's xtraSwing. */
    this._xtraSwing = 0;


    /***********************************************************
     * SAVE THESE FOR LATER, WHEN THEY CAN BE BETTER UNDERSTOOD
     **********************************************************/
    /** @private the object's wepVsty2. not clear what this is. */
    this.wepVsty2 = [];
    /** @private the object's wepVsty3. */
    this.wepVsty3 = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
    /** @private the object's wepHitMod. */
    this._wepHitMod = 0;
    /** @private the object's wepHpDam. */
    this._wepHpDam = new WizardryHpRecord();
    /** @private the object's critHitM. */
    this._critHitM = false;
    /** @private the object's wepVstyp. */
    this._wepVstyp = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  }
  /**
   * Getter for the object's alignment.
   */
  get alignment() {
    return this._alignment;
  }
  /**
   * Setter for the object's alignment.
   */
  set alignment(value) {
    this._alignment = value;
  }
  /**
   * Getter for the object's armor class modifier.
   */
  get armorMod() {
    return this._armorMod;
  }
  /**
   * Setter for the object's armor class modifier.
   */
  set armorMod(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._armorMod = value;
  }
  /**
   * Getter for the # of the item in stock in boltac's trading post.
   */
  get boltacXX() {
    return this._boltacXX;
  }
  /**
   * Setter for the # of the item in stock in boltac's trading post.
   */
  set boltacXX(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._boltacXX = value;
  }
  /**
   * Getter for the % chance the object will change into another after use.
   */
  get changeChance() {
    return this._changeChance;
  }
  /**
   * Setter for the % chance the object will change into another after use.
   */
  set changeChance(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._changeChance = value;
  }
  /**
   * Getter for the id of the object this object may change to after use.
   */
  get changeTo() {
    return this._changeTo;
  }
  /**
   * Setter for the id of the object this object may change to after use.
   */
  set changeTo(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._changeTo = value;
  }
  /**
   * Getter for the object's dictionary of classes allowed to use it.
   */
  get classUse() {
    return this._classUse;
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
   * Getter for the object's cursed status.
   */
  get cursed() {
    return this._cursed;
  }
  /**
   * Setter for the object's cursed status.
   */
  set cursed(value) {
    if (typeof(value) !== "boolean" && !(value instanceof Boolean)) {
      throw ["Cursed must be a boolean", value];
    }
    this._cursed = value;
  }
  /**
   * Getter for the object's regeneration points.
   */
  get healPts() {
    return this._healPts;
  }
  /**
   * Setter for the object's regeneration points.
   */
  set healPts(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._healPts = value;
  }
  /**
   * Getter for the object's name.
   */
  get name() {
    return this._name;
  }
  /**
   * Setter for the object's name.
   */
  set name(value) {
    if (typeof(value) !== "string" && !(value instanceof String)) {
      throw ["Name must be a string", value];
    }
    this._name = value;
  }
  /**
   * Getter for the object's unknown name.
   */
  get nameUnknown() {
    return this._nameUnknown;
  }
  /**
   * Setter for the object's unknown name.
   */
  set nameUnknown(value) {
    if (typeof(value) !== "string" && !(value instanceof String)) {
      throw ["Unknown Name must be a string", value];
    }
    this._nameUnknown = value;
  }
  /**
   * Getter for the object's type.
   */
  get objType() {
    return this._objType;
  }
  /**
   * Setter for the object's type.
   */
  set objType(value) {
    this._objType = value;
  }
  /**
   * Getter for the object's price. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000.
   */
  get price() {
    return this._price;
  }
  /**
   * Setter for the object's price. used to be a WizLong, where low was 0-9,999, mid was 10,000-99,990,000, high was 100,000,000-999,900,000,000.
   */
  set price(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._price = value;
  }
  /**
   * Getter for the object's special flag.
   */
  get special() {
    return this._special;
  }
  /**
   * Setter for the object's special flag.
   */
  set special(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._special = value;
  }
  /**
   * Getter for the object's spell power.
   */
  get spellPower() {
    return this._spellPower;
  }
  /**
   * Setter for the object's spell power.
   */
  set spellPower(value) {
    this._spellPower = value;
  }
  /**
   * Getter for the object's _wepHitMod.
   */
  get wepHitMod() {
    return this._wepHitMod;
  }
  /**
   * Setter for the object's _wepHitMod.
   */
  set wepHitMod(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._wepHitMod = value;
  }
  /**
   * Getter for the object's _wepHpDam.
   */
  get wepHpDam() {
    return this._wepHpDam;
  }
  /**
   * Getter for the _wepVstyP field.
   */
  get wepVstyP() {
    return this._wepVstyP;
  }
  /**
   * Getter for the object's extra swing.
   */
  get xtraSwing() {
    return this._xtraSwing;
  }
  /**
   * Setter for the object's extra swing.
   */
  set xtraSwing(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._xtraSwing = value;
  }
}
export { WizardryObject };
