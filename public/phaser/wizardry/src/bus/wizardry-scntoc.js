if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../assets/js/rpgbase.full");
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
    ZZERO: 0,
    ZMAZE: 0,
    ZENEMY: 0,
    ZREWARD: 0,
    ZOBJECT: 0,
    ZCHAR: 0,
    ZSPCCHRS: 0,
    ZEXP: 0
  };
  /** @private ?? */
  this.unusedXX = {
    ZZERO: 0,
    ZMAZE: 0,
    ZENEMY: 0,
    ZREWARD: 0,
    ZOBJECT: 0,
    ZCHAR: 0,
    ZSPCCHRS: 0,
    ZEXP: 0
  };
  /** @private ?? */
  this.recPer2b = {
    ZZERO: 0,
    ZMAZE: 0,
    ZENEMY: 0,
    ZREWARD: 0,
    ZOBJECT: 0,
    ZCHAR: 0,
    ZSPCCHRS: 0,
    ZEXP: 0
  };
  /** @private ?? */
  this.blOff = {
    ZZERO: 0,
    ZMAZE: 0,
    ZENEMY: 0,
    ZREWARD: 0,
    ZOBJECT: 0,
    ZCHAR: 0,
    ZSPCCHRS: 0,
    ZEXP: 0
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
