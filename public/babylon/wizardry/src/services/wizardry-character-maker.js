import { WizardryController } from "./wizardry-controller.js";
import { WizardryCharacter }  from "../bus/wizardry-character.js";
import { WizardryAlignment,
  WizardryAttribute,
  WizardryCharacterClass,
  WizardryCharacterStatus,
  WizardryRace,
  WizardrySpell }             from "../config/wizardry-constants.js";
import { Dice }               from "../../../assets/js/base.js";

class WizardryCharacterMaker {
  constructor() {
    /**
     * @private the base attributes assigned to each race.
     */
    this._baseAttributes = null;
    /** @private the character being created. */
    this._character = null;
    /** @private the number of attribute points assigned to distribute. */
    this._pointsAtBirth = 0;
    /** @private the number of attribute points distributed. */
    this._pointsDistributed = 0;
    /** @private the Watcher class instance used. */
    this._watcher = null;
  }
  /**
   * Gets the character instance being created.
   */
  get character() {
    return this._character;
  }
  /**
   * Gets the number of bonus points available to spend.
   */
  get pointsAvailable() {
    return this._pointsAtBirth - this._pointsDistributed;
  }
  /**
   * Alters one of the character's attributes.
   * @param {WizardryAttribute} attribute the attribute being altered
   * @param {Number} value the value by which the attribute is being altered
   * @returns {object} a parameter object defining whether the action was completed and what error message was produced
   */
  alterAttribute(attribute, value) {
    let retObj = {
      isSuccessful: true,
      error: ""
    };
    if (value > 0) {
      if (this.pointsAvailable === 0) {
        retObj.isSuccessful = false;
        retObj.error = "You have distributed all your BONUS points already.";
      } else {
        if (this._character.getAttribute(attribute) < 18) {
          this._pointsDistributed++;
          this._character.setAttribute(attribute, this._character.getAttribute(attribute) + 1);
        } else {
          retObj.isSuccessful = false;
          retObj.error = "You cannot increase any attribute above 18.";
        }
      }
    } else {
      let baseScore = this._baseAttributes[[this._character.race]][attribute];
      if (this._character.getAttribute(attribute) > baseScore) {
        this._pointsDistributed--;
        this._character.setAttribute(attribute, this._character.getAttribute(attribute) - 1);
      } else {
        retObj.isSuccessful = false;
        retObj.error = ["You cannot decrease ", attribute.title, " below ", baseScore, "."].join("");
      }
    }
    return retObj;
  }
  /**
   * Finalizes the character and adds them to the roster.
   */
  finalizeCharacter() {    
    let vitalityHpMod = 0;
    let classHpMod = 0;
    switch (this._character.clazz) {
      case WizardryCharacterClass.MAGE:
      case WizardryCharacterClass.BISHOP:
        this._character.spellsKnown[[WizardrySpell.DUMAPIC]] = true;
        this._character.spellsKnown[[WizardrySpell.MOGREF]] = true;
        this._character.mageSpells[0] = 2;
        break;
      case WizardryCharacterClass.PRIEST:
        this._character.spellsKnown[[WizardrySpell.BADIOS]] = true;
        this._character.spellsKnown[[WizardrySpell.MILWA]] = true;
        this._character.priestSpells[0] = 2;
        break;
    }
    switch (this._character.clazz) {
      case WizardryCharacterClass.FIGHTER:
      case WizardryCharacterClass.LORD:
        classHpMod = 10;
        break;
      case WizardryCharacterClass.PRIEST:
        classHpMod = 8;
        break;
      case WizardryCharacterClass.THIEF:
      case WizardryCharacterClass.BISHOP:
      case WizardryCharacterClass.NINJA:
        classHpMod = 6;
        break;
      case WizardryCharacterClass.MAGE:
        classHpMod = 4;
        break;
      case WizardryCharacterClass.SAMURAI:
        classHpMod = 16;
        break;
    }
    switch (this._character.getAttribute(WizardryAttribute.VITALITY)) {
      case 3:
        vitalityHpMod = -2;
        break;
      case 4:
      case 5:
        vitalityHpMod = -1;
        break;
      case 16:
        vitalityHpMod = 1;
        break;
      case 17:
        vitalityHpMod = 2;
        break;
      case 18:
        vitalityHpMod = 3;
        break;
    }
    classHpMod += vitalityHpMod;
    for (let i = 2; i > 0; i--) {
      if (Dice.ONE_D2.roll() === 1) {
        classHpMod *= 0.9;
        classHpMod |= 0;
      }
    }
    if (classHpMod < 2) {
      classHpMod = 2;
    }
    this._character.hpMax = classHpMod;
    this._character.hpLeft = classHpMod;
    WizardryController.addCharacterToRoster(this._character);
  }
  /**
   * 
  /**
   * Determines if a character is eligible for a certain class.
   * @param {WizardryCharacterClass} clazz the class
   * @param {WizardryCharacter} character the character beong checked for eligiblity. If not character is provided the last character made is checked.
   * @returns {Boolean} true if the character is eligible; false otherwise
   */
  isEligibleForClass(clazz, character = this._character) {
    let eligible = false;
    const str = character.getAttribute(WizardryAttribute.STRENGTH);
    const iq = character.getAttribute(WizardryAttribute.IQ);
    const pie = character.getAttribute(WizardryAttribute.PIETY);
    const agi = character.getAttribute(WizardryAttribute.AGILITY);
    const vit = character.getAttribute(WizardryAttribute.VITALITY);
    const luc = character.getAttribute(WizardryAttribute.LUCK);
    const align = character.alignment;
    switch (clazz) {
      case WizardryCharacterClass.FIGHTER:
        if (str >= 11) {
          eligible = true;
        }
        break;        
      case WizardryCharacterClass.MAGE:
        if (iq >= 11) {
          eligible = true;
        }
        break;
      case WizardryCharacterClass.PRIEST:
        if (pie >= 11
            && (align === WizardryAlignment.GOOD || align === WizardryAlignment.EVIL)) {
          eligible = true;
        }
        break;
      case WizardryCharacterClass.THIEF:
        if (agi >= 11
            && (align === WizardryAlignment.NEUTRAL || align === WizardryAlignment.EVIL)) {
          eligible = true;
        }
        break;
      case WizardryCharacterClass.BISHOP:
        if ((iq >= 12 && pie >= 12)
            && (align === WizardryAlignment.GOOD || align === WizardryAlignment.EVIL)) {
          eligible = true;
        }
        break;
      case WizardryCharacterClass.SAMURAI:
        if ((str >= 15 && iq >= 11 && pie >= 10 && vit >= 14 && agi >= 10)
            && (align === WizardryAlignment.GOOD || align === WizardryAlignment.NEUTRAL)) {
          eligible = true;
        }
        break;
      case WizardryCharacterClass.LORD:
        if ((str >= 15 && iq >= 12 && pie >= 12 && vit >= 15 && agi >= 14 && luc >= 15)
            && align === WizardryAlignment.GOOD) {
          eligible = true;
        }
        break;
      case WizardryCharacterClass.NINJA:
        if ((str >= 17 && iq >= 17 && pie >= 17 && vit >= 17 && agi >= 17 && luc >= 17)
            && align === WizardryAlignment.EVIL) {
          eligible = true;
        }
        break;
    }
    return eligible;
  }
  /**
   * Initializes a new character.
   */
  newCharacter() {
    if (typeof(this._watcher) === "undefined" || this._watcher === null) {
      // throw "Cannot initialize a new character before setting the watcher";
    }
    this._character = new WizardryCharacter();
    this._character.age = 18 * 52 + Dice.rollDie(300) - 1;
    this._character.gold = 90 + Dice.rollDie(100) - 1;
    this._character.status = WizardryCharacterStatus.OK;
    for (let i = this._character.luckSkill.length - 1; i >= 0; i--) {
      this._character.luckSkill[i] = 16;
    }
    this._character.maxLevAc = 1;
    this._character.charLev = 1;
    this._character.armorCl = 10;
    this._character.addWatcher(this._watcher);

    this._pointsAtBirth = 6 + Dice.ONE_D4.roll();
    while (this._pointsAtBirth < 20 && Dice.rollDie(11) === 11) {
      this._pointsAtBirth += 10;
    }
    this._pointsDistributed = 0;
  }
  /**
   * Triggers a notification for all character watchers.
   */
  notifyCharacterWatchers() {
    console.log("notifying watchers")
    this._character.notifyWatchers();
  }
  /**
   * Resets the character's bonus points and changes attribute scores back to base levels.
   */
  resetBonusPoints() {
    this._pointsDistributed = 0;
    this.setBaseAttributeScores();
  }
  /**
   * Sets the character's alignment.
   * @param {WizardryAlignment} alignment the alignment being set
   */
  setAlignment(alignment) {
    this._character.alignment = alignment;
  }
  /**
   * Sets the character's base attribute scores for their assigned race.
   * @param {WizardryCharacter} character the character being assigned the base scores. If no character is supplied, the last character created is used.
   */
  setBaseAttributeScores(character = this._character) {
    if (this._baseAttributes === null) {
      this._baseAttributes = {
        [WizardryRace.HUMAN]: {
          [WizardryAttribute.STRENGTH]: 8,
          [WizardryAttribute.IQ]: 8,
          [WizardryAttribute.PIETY]: 5,
          [WizardryAttribute.VITALITY]: 8,
          [WizardryAttribute.AGILITY]: 8,
          [WizardryAttribute.LUCK]: 9,
        },
        [WizardryRace.ELF]: {
          [WizardryAttribute.STRENGTH]: 7,
          [WizardryAttribute.IQ]: 10,
          [WizardryAttribute.PIETY]: 10,
          [WizardryAttribute.VITALITY]: 6,
          [WizardryAttribute.AGILITY]: 9,
          [WizardryAttribute.LUCK]: 6,
        },
        [WizardryRace.DWARF]: {
          [WizardryAttribute.STRENGTH]: 10,
          [WizardryAttribute.IQ]: 7,
          [WizardryAttribute.PIETY]: 10,
          [WizardryAttribute.VITALITY]: 10,
          [WizardryAttribute.AGILITY]: 5,
          [WizardryAttribute.LUCK]: 6,
        },
        [WizardryRace.GNOME]: {
          [WizardryAttribute.STRENGTH]: 7,
          [WizardryAttribute.IQ]: 7,
          [WizardryAttribute.PIETY]: 10,
          [WizardryAttribute.VITALITY]: 8,
          [WizardryAttribute.AGILITY]: 10,
          [WizardryAttribute.LUCK]: 7,
        },
        [WizardryRace.HOBBIT]: {
          [WizardryAttribute.STRENGTH]: 5,
          [WizardryAttribute.IQ]: 7,
          [WizardryAttribute.PIETY]: 7,
          [WizardryAttribute.VITALITY]: 6,
          [WizardryAttribute.AGILITY]: 10,
          [WizardryAttribute.LUCK]: 15,
        },
      };
    }
    for (let prop in this._baseAttributes[[character.race]]) {
      character.setAttribute(WizardryAttribute.fromString(prop), this._baseAttributes[[character.race]][prop]);
    }
  }
  /**
   * Sets the character's class.
   * @param {WizardryCharacterClass} clazz the class being set
   */
  setClass(clazz) {
    this._character.clazz = clazz;
  }
  /**
   * Sets the character's name.
   * @param {string} name the name being set
   */
  setName(name) {
    this._character.name = name;
  }
  /**
   * Sets the character's race.
   * @param {WizardryRace} race the race being set
   */
  setRace(race) {
    this._character.race = race;
    this.setBaseAttributeScores();
  }
  /**
   * Sets the Watcher class instance.
   * @param {Watcher} watcher the watcher being set
   */
  setWatcher(watcher) {
    this._watcher = watcher;
    // set base attributes after initial configuration setup
    this._baseAttributes = {
      [WizardryRace.HUMAN]: {
        [WizardryAttribute.STRENGTH]: 8,
        [WizardryAttribute.IQ]: 8,
        [WizardryAttribute.PIETY]: 5,
        [WizardryAttribute.VITALITY]: 8,
        [WizardryAttribute.AGILITY]: 8,
        [WizardryAttribute.LUCK]: 9,
      },
      [WizardryRace.ELF]: {
        [WizardryAttribute.STRENGTH]: 7,
        [WizardryAttribute.IQ]: 10,
        [WizardryAttribute.PIETY]: 10,
        [WizardryAttribute.VITALITY]: 6,
        [WizardryAttribute.AGILITY]: 9,
        [WizardryAttribute.LUCK]: 6,
      },
      [WizardryRace.DWARF]: {
        [WizardryAttribute.STRENGTH]: 10,
        [WizardryAttribute.IQ]: 7,
        [WizardryAttribute.PIETY]: 10,
        [WizardryAttribute.VITALITY]: 10,
        [WizardryAttribute.AGILITY]: 5,
        [WizardryAttribute.LUCK]: 6,
      },
      [WizardryRace.GNOME]: {
        [WizardryAttribute.STRENGTH]: 7,
        [WizardryAttribute.IQ]: 7,
        [WizardryAttribute.PIETY]: 10,
        [WizardryAttribute.VITALITY]: 8,
        [WizardryAttribute.AGILITY]: 10,
        [WizardryAttribute.LUCK]: 7,
      },
      [WizardryRace.HOBBIT]: {
        [WizardryAttribute.STRENGTH]: 5,
        [WizardryAttribute.IQ]: 7,
        [WizardryAttribute.PIETY]: 7,
        [WizardryAttribute.VITALITY]: 6,
        [WizardryAttribute.AGILITY]: 10,
        [WizardryAttribute.LUCK]: 15,
      },
    };
  }
}
/**
 * The WizardryCharacterMaker singleton instance.
 */
const instance = new WizardryCharacterMaker();

// Object.freeze(instance);

export { instance as WizardryCharacterMaker };