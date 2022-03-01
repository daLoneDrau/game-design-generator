import { Watchable } from "../../../assets/js/base.js";
/**
 * @class Unknown Class definition
 * @param {object} parameterObject optional initialization parameters
 */
class WizardryScnToc extends Watchable {
  constructor(parameterObject) {
    super();
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
    // Watchable.apply(this);
  }
};
export { WizardryScnToc };
