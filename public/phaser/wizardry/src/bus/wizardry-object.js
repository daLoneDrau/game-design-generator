if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../assets/js/rpgbase.full");
  var { WizardryObjectType } = require("../config/wizardry-constants");
  var { WizardryHpRecord } = require("./utility/wizardry-hp-record");
  var { WizardryLong } = require("./utility/wizardry-long");
}
/**
 * @class The application defines a class for objects.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryObject(parameterObject) {
  /** @private The object's name. */
  this.name = "";
  /** @private The object's unidentified name. */
  this.nameUnknown = "";
  /** @private the object's type. */
  this.type = null;
  /** @private the object's alignment. */
  this.alignment = WizardryAlignment.UNALIGN;
  /** @private a flag indicating whether the object is cursed. */
  this.cursed = false;
  /** @private the object's special. */
  this.special = 0;
  /** @private the object's changeTo. */
  this.changeTo = 0;
  /** @private the object's changeChance. */
  this.changeChance = 0;
  /** @private the object's price. */
  this.price = new WizardryLong();
  /** @private the object's boltAcXx. */
  this.boltAcXx = 0;
  /** @private the object's spellPower. */
  this.spellPower = 0;
  /** @private the object's dictionary of classes allowed to use it. */
  this.classUse = {
    FIGHTER: false,
    MAGE: false,
    PRIEST: false,
    THIEF: false,
    BISHOP: false,
    SAMURAI: false,
    LORD: false,
    NINJA: false
  };
  /** @private the object's healPts. */
  this.healPts = 0;
  /** @private the object's wepVsty2. */
  this.wepVsty2 = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  /** @private the object's wepVsty3. */
  this.wepVsty3 = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  /** @private the object's armorMod. */
  this.armorMod = 0;
  /** @private the object's wepHitMod. */
  this.wepHitMod = 0;
  /** @private the object's wepHpDam. */
  this.wepHpDam = new WizardryHpRecord();
  /** @private the object's xtraSwing. */
  this.xtraSwing = 0;
  /** @private the object's critHitM. */
  this.critHitM = false;
  /** @private the object's wepVstyp. */
  this.wepVstyp = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  Watchable.apply(this);
};
WizardryObject.prototype = Object.create(Watchable.prototype);
WizardryObject.prototype.constructor = Watchable;
{ // WizardryObject Getters/Setters
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryObject };
}
