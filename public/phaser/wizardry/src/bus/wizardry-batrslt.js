if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../../../assets/js/rpgbase.full");
}
/**
 * @class ??
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryBatrslt(parameterObject) {
  /** @private ?? */
  this.enmyCnt = [];
  /** @private ?? */
  this.enmyId = [];
  /** @private ?? */
  this.drained = [];
  Watchable.apply(this);
};
WizardryBatrslt.prototype = Object.create(Watchable.prototype);
WizardryBatrslt.prototype.constructor = Watchable;
{ // WizardryBatrslt Getters/Setters
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryBatrslt };
}
