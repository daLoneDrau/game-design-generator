if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../../../assets/js/rpgbase.full");
  var { WizardryHpRecord } = require("./utility/wizardry-hp-record");
  var { WizardryLong } = require("./utility/wizardry-long");
}
/**
 * @class The Application defines a class for Enemy objects.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryEnemy(parameterObject) {
  /** @private unknown name for an enemy group. */
  this.nameUnknownPlural = "";
  /** @private name for an enemy group. */
  this.namePlural = "";
  /** @private unknown name for an enemy. */
  this.nameUnknown = "";
  /** @private name for an enemy. */
  this.name = "";
  /** @private the enemy's pic. */
  this.pic = 0;
  /** @private the enemy's calc1. */
  this.calc1 = new WizardryLong();
  /** @private the enemy's hpRec. */
  this.hpRec = new WizardryHpRecord();
  /** @private the enemy's clazz. */
  this.clazz = 0;
  /** @private the enemy's ac. */
  this.ac = 0;
  /** @private the enemy's recSn. */
  this.recSn = 0;
  /** @private the enemy's recs. */
  this.recs = [
    new WizardryHpRecord(), new WizardryHpRecord(), new WizardryHpRecord(), new WizardryHpRecord(), new WizardryHpRecord(), new WizardryHpRecord(), new WizardryHpRecord()
  ];
  /** @private the enemy's expAmt. */
  this.expAmt = new WizardryLong();
  /** @private the enemy's drainAmt. */
  this.drainAmt = 0;
  /** @private the enemy's healPts. */
  this.healPts = 0;
  /** @private the enemy's reward1. */
  this.reward1 = 0;
  /** @private the enemy's reward2. */
  this.reward2 = 0;
  /** @private the enemy's enmyTeam. */
  this.enmyTeam = 0;
  /** @private the enemy's teamPerc. */
  this.teamPerc = 0;
  /** @private the enemy's magSpels. */
  this.magSpels = 0;
  /** @private the enemy's priSpels. */
  this.priSpels = 0;
  /** @private the enemy's unique. */
  this.unique = 0;
  /** @private the enemy's breathe. */
  this.breathe = 0;
  /** @private the enemy's unaffect. */
  this.unaffect = 0;
  /** @private the enemy's wepVsty3. */
  this.wepVsty3 = [
    false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false
  ];
  /** @private the enemy's sppc. */
  this.sppc = [
    false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false
  ];
  Watchable.apply(this);
};
WizardryEnemy.prototype = Object.create(Watchable.prototype);
WizardryEnemy.prototype.constructor = Watchable;
{ // WizardryEnemy Getters/Setters
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryEnemy };
}
