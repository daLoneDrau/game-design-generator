if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../../../assets/js/rpgbase.full");
  var { WizardryZscn } = require("../config/wizardry-constants");
}
/**
 * @class Unknown Class definition
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryScnToc(parameterObject) {
  /** @private name */
  this.gameName = "";
  /** @private ?? */
  this.recPerDk = {
    WizardryZscn.ZZERO: 0,
    WizardryZscn.ZMAZE: 0,
    WizardryZscn.ZENEMY: 0,
    WizardryZscn.ZREWARD: 0,
    WizardryZscn.ZOBJECT: 0,
    WizardryZscn.ZCHAR: 0,
    WizardryZscn.ZSPCCHRS: 0,
    WizardryZscn.ZEXP: 0
  };
  /** @private ?? */
  this.unusedXX = {
    WizardryZscn.ZZERO: 0,
    WizardryZscn.ZMAZE: 0,
    WizardryZscn.ZENEMY: 0,
    WizardryZscn.ZREWARD: 0,
    WizardryZscn.ZOBJECT: 0,
    WizardryZscn.ZCHAR: 0,
    WizardryZscn.ZSPCCHRS: 0,
    WizardryZscn.ZEXP: 0
  };
  /** @private ?? */
  this.recPer2b = {
    WizardryZscn.ZZERO: 0,
    WizardryZscn.ZMAZE: 0,
    WizardryZscn.ZENEMY: 0,
    WizardryZscn.ZREWARD: 0,
    WizardryZscn.ZOBJECT: 0,
    WizardryZscn.ZCHAR: 0,
    WizardryZscn.ZSPCCHRS: 0,
    WizardryZscn.ZEXP: 0
  };
  /** @private ?? */
  this.blOff = {
    WizardryZscn.ZZERO: 0,
    WizardryZscn.ZMAZE: 0,
    WizardryZscn.ZENEMY: 0,
    WizardryZscn.ZREWARD: 0,
    WizardryZscn.ZOBJECT: 0,
    WizardryZscn.ZCHAR: 0,
    WizardryZscn.ZSPCCHRS: 0,
    WizardryZscn.ZEXP: 0
  };
  /** @private ?? */
  this.race = [];
  /** @private ?? */
  this.clazz = [];
  /** @private ?? */
  this.status = [];
  /** @private ?? */
  this.align = [];
  /** @private ?? */
  this.spellHsh = [];
  /** @private ?? */
  this.spellGrp = [];
  /** @private ?? */
  this.spell012 = [];
  Watchable.apply(this);
};
WizardryScnToc.prototype = Object.create(Watchable.prototype);
WizardryScnToc.prototype.constructor = Watchable;
{ // WizardryScnToc Getters/Setters
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryScnToc };
}
