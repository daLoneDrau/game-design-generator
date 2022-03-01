import { Watchable } from "../../../../assets/js/base.js";

/**
 * @class The HP record is another utility class.
 * @param {object} parameterObject optional initialization parameters
 */
class WizardryHpRecord extends Watchable {
  constructor(parameterObject) {
    super();
    /** @private The hpfac. */
    this._hpfac = 0;
    /** @private The hpminad. */
    this._hpminad = 0;
    /** @private The level. */
    this._level = 0;
  }
  /** Getter for the _hpfac field. */
  get hpfac() {
    return this._hpfac;
  }
  /** Setter for the _hpfac field. */
  set hpfac(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._hpfac = value;
  }
  /** Getter for the _hpminad field. */
  get hpminad() {
    return this._hpminad;
  }
  /** Setter for the _hpminad field. */
  set hpminad(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._hpminad = value;
  }
  /** Getter for the _level field. */
  get level() {
    return this._level;
  }
  /** Setter for the _level field. */
  set level(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._level = value;
  }
};

export { WizardryHpRecord };
