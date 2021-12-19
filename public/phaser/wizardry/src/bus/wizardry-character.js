if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../assets/js/rpgbase.full");
  var { WizardryAlignment } = require("../config/wizardry-constants");
  var { WizardryAttribute } = require("../config/wizardry-constants");
  var { WizardryCharacterClass } = require("../config/wizardry-constants");
  var { WizardryCharacterStatus } = require("../config/wizardry-constants");
  var { WizardryRace } = require("../config/wizardry-constants");
  var { WizardryHpRecord } = require("./utility/wizardry-hp-record");
  var { WizardryLong } = require("./utility/wizardry-long");
}
/**
 * @class Player characters are defined by the WizardryCharacter class.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryCharacter(parameterObject) {
  /** @private the character's name. */
  this.name = "";
  /** @private flag indicating whether the character is in the maze. */
  this.inMaze = false;
  /** @private the character's race. */
  this.race = WizardryRace.NORACE;
  /** @private the character's class. */
  this.clazz = null;
  /** @private the character's age. */
  this.age = 0;
  /** @private the character's status. */
  this.status = WizardryCharacterStatus.OK;
  /** @private the character's alignment. */
  this.alignment = WizardryAlignment.UNALIGN;
  /** @private the character's attributes. */
  this.attributes = {
    STRENGTH: 0,
    IQ: 0,
    PIETY: 0,
    VITALITY: 0,
    AGILITY: 0,
    LUCK: 0,
  };
  /** @private the character's luck skills(??). */
  this.luckSkill = [0, 0, 0, 0, 0];
  /** @private the character's gold. */
  this.gold = new WizardryLong();
  /** @private the character's possessions. */
  this.possessions = {
    count: 0,
    possession: [
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      },
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      },
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      },
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      },
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      },
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      },
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      },
      {
        equipped: false,
        cursed: false,
        identified: false,
        equipmentIndex: 0
      }
    ]  
  };
  /** @private the character's exp. */
  this.exp = new WizardryLong();
  /** @private the character's mage spells. */
  this.mageSpells = [];
  /** @private the character's priest spells. */
  this.priestSpells = [];
  /** @private the character's maxLevAc. */
  this.maxLevAc = 0;
  /** @private the character's age. */
  this.age = 0;
  /** @private the character's level. */
  this.charLev = 0;
  /** @private the character's hpLeft. */
  this.hpLeft = 0;
  /** @private the character's hp max. */
  this.hpMax = 0;
  /** @private the character's known spells. */
  this.spellsKnown = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
  /** @private the character's mage spells. */
  this.mageSpells = [];
  /** @private the character's priest spells. */
  this.priestSpells = [];
  /** @private the character's hpCalcMd. */
  this.hpCalcMd = 0;
  /** @private the character's armorCl. */
  this.armorCl = 0;
  /** @private the character's heal pts. */
  this.healPts = 0;
  /** @private the character's critHitM. */
  this.critHitM = false;
  /** @private the character's swingCnt. */
  this.swingCnt = 0;
  /** @private the character's hpDamRc. */
  this.hpDamRc = new WizardryHpRecord();
  /** @private the character's wepVsty2. */
  this.wepVsty2 = [
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false]
  ];
  /** @private the character's wepVsty3. */
  this.wepVsty3 = [
    [false, false, false, false, false, false],
    [false, false, false, false, false, false]
  ];
  /** @private the character's wepVstyP. */
  this.wepVstyP = [false, false, false, false, false, false, false, false, false, false, false, false, false];
  /** @private the character's lostXyl. */
  this.lostXyl = {
    location: [0, 0, 0, 0],
    poisonAmt: [0, 0, 0, 0],
    awards: [0, 0, 0, 0],
  };
  Watchable.apply(this);
};
WizardryCharacter.prototype = Object.create(Watchable.prototype);
WizardryCharacter.prototype.constructor = Watchable;
{ // WizardryCharacter Getters/Setters
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryCharacter };
}
