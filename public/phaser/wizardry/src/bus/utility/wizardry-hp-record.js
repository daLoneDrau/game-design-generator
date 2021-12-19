if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../../../assets/js/rpgbase.full");
}
/**
 * @class The HP record is another utility class.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryHpRecord(parameterObject) {
  /** @private The level. */
  this._level = 0;
  /** @private The hpfac. */
  this._hpfac = 0;
  /** @private The hpminad. */
  this._hpminad = 0;
  Watchable.apply(this);
};
WizardryHpRecord.prototype = Object.create(Watchable.prototype);
WizardryHpRecord.prototype.constructor = Watchable;
{ // WizardryHpRecord Getters/Setters
  Object.defineProperty(WizardryHpRecord.prototype, 'level', {
    /** Getter for the _level field. */
    get() {
      return this._level;
    },
    /** Setter for the _level field. */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._level = value;
    }
  });
  Object.defineProperty(WizardryHpRecord.prototype, 'hpfac', {
    /** Getter for the _hpfac field. */
    get() {
      return this._hpfac;
    },
    /** Setter for the _hpfac field. */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._hpfac = value;
    }
  });
  Object.defineProperty(WizardryHpRecord.prototype, 'hpminad', {
    /** Getter for the _hpminad field. */
    get() {
      return this._hpminad;
    },
    /** Setter for the _hpminad field. */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._hpminad = value;
    }
  });
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryHpRecord };
}
