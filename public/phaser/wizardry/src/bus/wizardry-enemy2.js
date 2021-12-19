if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../../../assets/js/rpgbase.full");
  var { WizardryCharacterStatus } = require("../config/wizardry-constants");
}
/**
 * @class A second Enemy class is defined.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryEnemy2(parameterObject) {
  /** @private ?? */
  this.a = {
    identified: false,
    aliveCnt: 0,
    enemyCnt: 0,
    enemyId: 0,
    temp04: [
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      },
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      },
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      },
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      },
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      },
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      },
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      },
      {
        victim: 0,
        spellHsh: 0,
        agility: 0,
        hpLeft: 0,
        armorCl: 0,
        inaudCnt: 0,
        status: WizardryCharacterStatus.OK
      }
    ]
  };
  /** @private ?? */
  this.b = null;
  Watchable.apply(this);
};
WizardryEnemy2.prototype = Object.create(Watchable.prototype);
WizardryEnemy2.prototype.constructor = Watchable;
{ // WizardryEnemy2 Getters/Setters
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryEnemy2 };
}
