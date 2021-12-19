if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../../assets/js/rpgbase.full");
}
/**
 * @class The application defines a custom class for wrapping Long values.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryLong(parameterObject) {
  /** @private The low portion of the Long. */
  this._low = 0;
  /** @private The mid portion of the Long. */
  this._mid = 0;
  /** @private The high portion of the Long. */
  this._high = 0;
  Watchable.apply(this);
};
WizardryLong.prototype = Object.create(Watchable.prototype);
WizardryLong.prototype.constructor = Watchable;
{ // WizardryLong Getters/Setters
  Object.defineProperty(WizardryLong.prototype, 'low', {
    /** Getter for the _low field. */
    get() {
      return this._low;
    },
    /** Setter for the _low field. */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._low = value;
    }
  });
  Object.defineProperty(WizardryLong.prototype, 'mid', {
    /** Getter for the _mid field. */
    get() {
      return this._mid;
    },
    /** Setter for the _mid field. */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._mid = value;
    }
  });
  Object.defineProperty(WizardryLong.prototype, 'high', {
    /** Getter for the _high field. */
    get() {
      return this._high;
    },
    /** Setter for the _high field. */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._high = value;
    }
  });
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryLong };
}
