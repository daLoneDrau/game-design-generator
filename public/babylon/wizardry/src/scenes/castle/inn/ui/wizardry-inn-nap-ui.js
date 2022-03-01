import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE }                        from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import { WizardryCharacter }    from "../../../../bus/wizardry-character.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryAttribute,
  WizardryConstants,
  WizardryCharacterStatus,
  WizardryCharacterClass,
  WizardryXgoto }               from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";
import { Dice }                 from "../../../../../../assets/js/base.js";

/** the healing phase. */
const HEALING_PHASE = 0;
/** the level up phase. */
const LEVEL_UP_PHASE = 1;
/** the spell phase. */
const SPELL_PHASE = 2;
/**
 * @class Ui class for the Nap Menu state of the Inn scene.
 */
class WizardryInnNapUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryInnNapUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    this._goldBlock = null;
    this._healingGrid = null;
    this._healthHeaderBlock = null;
    /** @private the BABYLON.GUI.TextBlock displaying the healing data. */
    this._healthBlock = null;
    this._textGrid = null;
    /** @private the BABYLON.GUI.TextBlock displaying general information. */
    this._textBlock = null;
    this._interruptHealing = false;
    this._currentPhase = HEALING_PHASE;
  }
  /**
   * Exits the player menu.
   */
  exit() {
    this._interruptHealing = false; // reset the flag before leaving
    this._parent.state = WizardryConstants.INN_PLAYER_MENU;
  }
  /**
   * Determines if the character gained or lost attribute points during their levelling up.
   * @param {WizardryCharacter} character the character
   * @returns {Array} the list of string detailing gains/losses
   */
  gainLost(character) {
    /** the strings returned. */
    const retStrings = [];
    /** @type {Array} the list of attributes. */
    const attributes = WizardryAttribute.values;
    for (let i = attributes.length - 1; i >= 0; i--) {
      if (Dice.rollDie(4) - 1 !== 0) {
        let attributeValue = character.getAttribute(attributes[i]);
        if (Dice.rollDie(130) - 1 < character.age / 52) {
          // if 1D130 is less than your age, there is a chance of the attribute going down
          if (attributeValue == 18 && Dice.rollDie(6) - 1 !== 4) {
            // (* NOTHING *)
          } else {
            attributeValue--;
            retStrings.push("YOU LOST ");
            retStrings.push(attributes[i].title);
            retStrings.push("\n");
            if (attributes[i] === WizardryAttribute.VITALITY) {
              retStrings.push("** YOU HAVE DIED OF OLD AGE **\n");
              character.status = WizardryCharacterStatus.LOST;
              character.hpLeft = 0;
            }
          }
        } else {
          if (attributeValue !== 18) {
            attributeValue++;
            retStrings.push("YOU GAINED ");
            retStrings.push(attributes[i].title);
            retStrings.push("\n");                    
          }
          character.setAttribute(attributes[i], attributeValue);
        }
      }
    }
    return retStrings;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    switch (this._currentPhase) {
      case HEALING_PHASE:
        this._interruptHealing = true;
        break;
    }
    let validInput = true;
    if (this._currentPhase === HEALING_PHASE) {
      this._interruptHealing = true;
    } else {
      switch (key.toUpperCase()) {
        case "ESCAPE":
        case "ENTER":
          this.exit();
          break;
        case "A":
          this.nap(WizardryConstants.INN_ROOM_STABLES);
          break;
        case "B":
          this.nap(WizardryConstants.INN_ROOM_COTS);
          break;
        case "C":
          this.nap(WizardryConstants.INN_ROOM_ECONOMY);
          break;
        case "D":
          this.nap(WizardryConstants.INN_ROOM_MERCHANT);
          break;
        case "E":
          this.nap(WizardryConstants.INN_ROOM_ROYAL);
          break;
        default:
          validInput = false;
          break;
      }
      if (!validInput) {
        this._parent.stopAnimation(this._messageBlock);
        this._messageBlock.text = "Huh?";
        this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      }
    }
  }
  /**
   * Heals the current character.
   * @param {WizardryCharacter} character the character
   */
  heal(character) {
    /** @type {void} the action taken after completing a healing phase */
    let action = null;
    if (this._parent.room === WizardryConstants.INN_ROOM_STABLES) {
      // display a napping message
      this._healingGrid.isVisible = false;
      this._textGrid.isVisible = true;
      this._textBlock.text = [character.name, " IS NAPPING"].join("");
      // wait 1/2 a second before moving on
      action = () => {
        // hide the text and move on the next phase
        this._textBlock.text = "";
        this._textGrid.isVisible = false;
        this._currentPhase = LEVEL_UP_PHASE;
        this.set();
      };
    } else {
      this._healingGrid.isVisible = true;
      this._textGrid.isVisible = false;
      let roomRate = 10, healing = 1;
      switch (this._parent.room) {
        case WizardryConstants.INN_ROOM_ECONOMY:
          roomRate = 50;
          healing = 3;
          break;
        case WizardryConstants.INN_ROOM_MERCHANT:
          roomRate = 200;
          healing = 7;
          break;
        case WizardryConstants.INN_ROOM_ROYAL:
          roomRate = 500;
          healing = 10;
          break;
      }
      if (character.gold >= roomRate
            && character.hpLeft < character.hpMax) {
        // heal the character and charge a fee
        character.hpLeft += healing;
        character.gold -= roomRate;
      } else {
        // once gold runs out or fully healed stop healing
        this._interruptHealing = true;
      }
      this._healthHeaderBlock.text = [character.name, " IS HEALING UP"].join("");
      this._healthBlock.text = ["HIT POINTS (", character.hpLeft, "/", character.hpMax, ")"].join("");
      this._goldBlock.text = ["GOLD  ", character.gold].join("");
      action = () => {
        if (this._interruptHealing) {
          // if healing is meant to be interrupted, move on
          this._currentPhase = LEVEL_UP_PHASE;
        }
        // go to set
        this.set();
      };
    }
    if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
      action();
    } else {
      BABYLON.setAndStartTimer({
        timeout: KEYBOARD_ENTRY_DELAY,
        contextObservable: this._parent.onBeforeRenderObservable,
        breakCondition: () => {
          // this will check if we need to break before the timeout has reached
          return this._parent.isDisposed;
        },
        onEnded: (data) => {
          // this will run when the timeout has passed          
          action();
        },
        onTick: (data) => {
          // this will run
        },
        onAborted: (data) => {
          // this function will run when the break condition has met (premature ending)
        },
      });
    }
  }
  init() {
    // do not call base class initialization
    // super.init();
    
    this._configuration = WizardryScene.createGrid({
      columns: [
        1 / 40, // left border
        38 / 40, // main area
        1 / 40 // right border
      ],
      rows: [
        1 / 24, // 0 - border
        1 / 24, // 1 - title
        1 / 24, // 2 - border
        8 / 24, // 3 - party area
        1 / 24, // 4 - border
        12 / 24, // 5 - menu/ messages
      ]
    });

    this._parent.createScreenOutline({
      name: [WizardryConstants.INN_NAP_MENU, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: [
        /** HEADER BORDER */
        {
          points: [
            { cell: [0, 0] },
            { cell: [39, 0] }
          ]
        },
        {
          points: [
            { cell: [39, 0] },
            { cell: [39, 2] }
          ]
        },
        {
          points: [
            { cell: [39, 2] },
            { cell: [0, 2] }
          ]
        },
        {
          points: [
            { cell: [0, 2] },
            { cell: [0, 0] }
          ]
        },
        /** END HEADER / START PARTY BORDER */
        {
          points: [
            { cell: [0, 11] },
            { cell: [39, 11] }
          ]
        },
        /** END PARTY BORDER /  START MENU BORDER */
        {
          points: [
            { cell: [0, 20] },
            { cell: [39, 20] }
          ]
        }
        /** END MENU BORDER */ 
      ]
    });
    { // add the title and subtitle
      let titleGrid = WizardryScene.createGrid({
        columns: [
          1 / 2, // column
          1 / 2 // column
        ],
        rows: []
      });
      this._configuration.addControl(titleGrid, 1, 1);
      { // create the title text
        let text = this._parent.createTextBlock({
          key: "TITLE",
          text: " CASTLE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        titleGrid.addControl(text, 0, 0); // row, column
      }
      { // create the subtitle text
        this._subTitleTextBlock = this._parent.createTextBlock({
          key: "SUBTITLE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
        titleGrid.addControl(this._subTitleTextBlock, 0, 1); // row, column
      }
    }
    { // add current party header
      this._configuration.addControl(this._parent.createButton({
        background: { },
        text: {
          text: "CURRENT PARTY",
          paddingLeft: 4,
          paddingRight: 4
        }
      }).container, 2, 1);
    }
    { // add party display
      super.createPartyGrid();
    }
    { // display area
      { // level up/exit
        this._textGrid = WizardryScene.createGrid({
          rows: [ 11/ 12, 1 / 12]
        });
        this._textGrid.isVisible = false;
        this._configuration.addControl(this._textGrid, 5, 1);

        this._textBlock = this._parent.createTextBlock({
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
        });
        this._textGrid.addControl(this._textBlock, 0, 0);

        this._textGrid.addControl(this._parent.createButton({
          background: {
            onPointerClickObservable: [() => { this.exit(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "PRESS [ENTER] TO LEAVE"
          }
        }).container, 0, 1);
      }
      { // healing
        this._healingGrid = WizardryScene.createGrid({
          rows: [ 1/ 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12, 1 / 12]
        });
        this._healingGrid.isVisible = false;
        this._configuration.addControl(this._healingGrid, 5, 1);
  
        this._healthHeaderBlock = this._parent.createTextBlock();
        this._healingGrid.addControl(this._healthHeaderBlock, 1, 0);
  
        this._healthBlock = this._parent.createTextBlock();
        this._healingGrid.addControl(this._healthBlock, 3, 0);
  
        this._goldBlock = this._parent.createTextBlock();
        this._healingGrid.addControl(this._goldBlock, 5, 0);
        
        this._healingGrid.addControl(this._parent.createButton({
          background: {
            onPointerClickObservable: [() => { this._interruptHealing = true; }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[PRESS ANY KEY TO STOP]"
          }
        }).container, 7, 0);
      }

    }
    { // message block
      this._messageBlock = this._parent.createTextBlock({
        lineSpacing: "3px",
        textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
        resizeToFit: false,
        textWrapping: true,
      });
      if (typeof(this._messageBlock.animations) === "undefined") {
        this._messageBlock.animations = [];
      }
      this._messageBlock.animations.push(FADE);
      this._configuration.addControl(this._messageBlock, 7, 1);
    }

    return this._configuration;
  }
  /**
   * Levels up the character.
   * @param {WizardryCharacter} character the character
   */
  levelUp(character) {
    /**
     * Gets random hit points for a character, based on their class and Vitality.
     * @param {WizardryCharacter} character the character
     * @returns {Number} a random number
     */
    const rollRandomHitPoints = (character) => {
      let HITPTS = 0;
      switch (character.clazz) {
        case WizardryCharacterClass.FIGHTER:
        case WizardryCharacterClass.LORD:
          HITPTS = Dice.rollDie(10);
          break;
        case WizardryCharacterClass.PRIEST:
        case WizardryCharacterClass.SAMURAI:
          HITPTS = Dice.rollDie(8);
          break;
        case WizardryCharacterClass.THIEF:
        case WizardryCharacterClass.BISHOP:
        case WizardryCharacterClass.NINJA:
          HITPTS = Dice.rollDie(6);
          break;
        case WizardryCharacterClass.MAGE:
          HITPTS = Dice.rollDie(4);
          break;
      }
      switch (character.getAttribute(WizardryAttribute.VITALITY)) {
        case 3:
          HITPTS -= 2;
          break;
        case 4:
        case 5:
          HITPTS--;
          break;
        case 16:
          HITPTS++;
          break;
        case 17:
          HITPTS += 2;
          break;
        case 18:
          HITPTS += 3;
          break;
      }
      if (HITPTS < 1) {
        HITPTS = 1;
      }
      return HITPTS;
    }
    /** flag indicating whether to finish the loop. */
    let done = false;
    /** dictionary containing the results of the character's level progression. */
    const resultText = {
      level: "",
      attributes: [],
      spells: ""
    }
    /**
     * FLOW
     *  LOOP UNTIL DONE
     *    DETERMINE EXP 4 NEXT LVL
     *    IF ENOUGH
     *      LEVEL UP
     *    ELSE
     *      SET FLAG DONE
     */
    while (!done) {
      /** the experience points needed to move to the next level. */
      let exp4NextLevel = 0;
      if (character.charLev <= 12) {
        exp4NextLevel = WizardryCharacterClass[character.clazz].nextLevel[character.charLev];
      } else {
        exp4NextLevel = WizardryCharacterClass[character.clazz].nextLevel[12];
        for (let i = 13, li = character.charLev; i <= li; i++) {
          exp4NextLevel += WizardryCharacterClass[character.clazz].nextLevel[0];
        }
      }
      if (character.exp >= exp4NextLevel) {
        /** text displayed for gaining a level. */
        resultText.level = "YOU MADE A LEVEL!";
        // increase level by 1
        character.charLev++;
        if (character.charLev > character.maxLevAc) {
          character.maxLevAc = character.charLev;
        }
  
        this.setSpells(character);
  
        let s = this.tryLearn(character);
        if (s !== null) {
          resultText.spells = s;
        }

        s = this.gainLost(character);
        if (s.length > 0) {
          for (let i = 0, li = s.length; i < li; i++) {
            if (!resultText.attributes.includes(s[i])) {
              resultText.attributes.push(s[i]);
            }
          }
        }
        
        // gain hit points
        let newHpMax = 0;
        for (let i = 1, li = character.charLev; i <= li; i++) {
          // roll new random hit points for each level
          newHpMax += rollRandomHitPoints(character);
        }
        if (character.clazz === WizardryCharacterClass.SAMURAI) {
          // samurais get to roll 1 more time
          newHpMax += rollRandomHitPoints(character);
        }
        // at a minimum characters will gain 1 hp
        if (newHpMax <= character.hpMax) {
          newHpMax = character.hpMax + 1;
        }
        character.hpMax = newHpMax;
      } else {
        if (resultText.level.length === 0) {
          resultText.level = ["YOU NEED ", exp4NextLevel - character.exp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""); 
          this.setSpells(character);
        }
        done = true;
      }
        
      // build the display string
      let displayString = [];
      displayString.push(resultText.level);
      if (resultText.spells.length > 0) {
        displayString.push(resultText.spells);
      }
      if (resultText.attributes.length > 0) {
        displayString = displayString.concat(resultText.attributes);
      }

      this._healingGrid.isVisible = false;
      this._textGrid.isVisible = true;
      this._textBlock.text = displayString.join("\n"); 
    }
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    /**
     * FLOW
     *  HEAL - 
     *    IN STABLES -
     *      DISPLAY MESSAGE
     *      GO TO LEVEL UP
     *    PAID ROOM -
     *      IF CHARACTER HAS ENOUGH GOLD AND NOT FULLY HEALED
     *        HEAL THE CHARACTER
     *      ELSE
     *        SET INTERRUPT FLAG
     *      WAIT 500 MS
     *      CHECK INTERRUPT FLAG
     *        IF INTERRUPT
     *          GO TO LEVEL UP
     *        ELSE
     *          GO TO HEAL
     *  LEVEL UP -
     *    IF CHARACTER MADE LEVEL
     *      SET SPELLS LEFT
     *      TRY TO LEARN NEW SPELLS
     *      GAIN/LOSE ATTRIBUTE POINTS
     *      GAIN HIT POINTS
     *      DISPLAY RESULTS AND EXIT BUTTON
     *    ELSE
     *      DISPLAY EXP POINTS NEEDED AND EXIT BUTTON
     */
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    if (typeof(character) !== "undefined") {
      switch (this._currentPhase) {
        case HEALING_PHASE:
          this.heal(character);
          break;
        case LEVEL_UP_PHASE:
          this.levelUp(character);
          break;
      }
    }
    this._subTitleTextBlock.text = "INN ";
  }
  /**
   * Sets how many spells of each LEVEL of POWER and class (magical or priestly) a character can throw.
   * @param {WizardryCharacter} character the character
   */
  setSpells(character) {
    /**
     * Sets the minimum # of spells a character can cast per level based on the # of spells known per level.
     * @param {WizardryCharacter} character the character
     * @param {Boolean} isPriest flag indicating if the Priest spell book is used; otherwise the Mage spell book is used
     * @param {Number} level the spell level
     * @param {Number} low the spell index to start with
     * @param {Number} high the spell index to finish at
     */
    const minSpellCount = (character, isPriest, level, low, high) => {
      let spellsKnown = 0;
      for (let i = low; i <= high; i++) {
        if (character.spellsKnown[i]) {
          spellsKnown++;
        }
      }
      if (isPriest) {
        character.priestSpells[level] = spellsKnown;
      } else {
        character.mageSpells[level] = spellsKnown;
      }
    };
    /**
     * Sets the minimum # of Mage spells a character can cast for all levels.
     * @param {WizardryCharacter} character the character
     */
    const minimumMageSpells = (character) => {
      minSpellCount(character, false, 0,  0,  3);
      minSpellCount(character, false, 1,  4,  5);
      minSpellCount(character, false, 2,  6,  7);
      minSpellCount(character, false, 3,  8, 10);
      minSpellCount(character, false, 4, 11, 13);
      minSpellCount(character, false, 5, 14, 17);
      minSpellCount(character, false, 6, 18, 20);
    }
    /**
     * Sets the minimum # of Priest spells a character can cast for all levels.
     * @param {WizardryCharacter} character the character
     */
    const minimumPriestSpells = (character) => {
      minSpellCount(character, true, 0, 21, 25);
      minSpellCount(character, true, 1, 26, 29);
      minSpellCount(character, true, 2, 30, 33);
      minSpellCount(character, true, 3, 34, 37);
      minSpellCount(character, true, 4, 38, 43);
      minSpellCount(character, true, 5, 44, 47);
      minSpellCount(character, true, 6, 48, 49);
    }
    /**
     * Calculates the number of spells a character can cast at each level.
     * @param {WizardryCharacter} character the character
     * @param {String} spellBook the spell book used
     * @param {Number} minCasterLevel the minimum level at which a caster receives spells
     * @param {Number} modifierPerLevel a cumulative modifier applied at each level, reducing the possbile number of spells that can be cast
     */
    const spellsPerLevel = (character, spellBook, minCasterLevel, modifierPerLevel) => {
      let spellCount = character.charLev - minCasterLevel;
      if (spellCount > 0) {
        let spellLevel = 0;
        while (spellLevel >= 0 && spellLevel <= 6 && spellCount > 0) {
          if (spellCount > character[spellBook][spellLevel]) {
            character[spellBook][spellLevel] = spellCount;
          }
          spellLevel++;
          spellCount -= modifierPerLevel;
        }
        for (spellLevel = 0; spellLevel <= 6; spellLevel++) {
          if (character[spellBook][spellLevel] > 9) {
            character[spellBook][spellLevel] = 9;
          }
        }
      }
    }
    minimumPriestSpells(character);
    minimumMageSpells(character);
    switch (character.clazz) {
      case WizardryCharacterClass.PRIEST:
        spellsPerLevel(character, "priestSpells", 0, 2);
        break;
      case WizardryCharacterClass.MAGE:
        spellsPerLevel(character, "mageSpells", 0, 2);
        break;
      case WizardryCharacterClass.BISHOP:
        spellsPerLevel(character, "priestSpells", 3, 4);
        spellsPerLevel(character, "mageSpells", 0, 4);
        break;
      case WizardryCharacterClass.LORD:
        spellsPerLevel(character, "priestSpells", 3, 2);
        break;
      case WizardryCharacterClass.SAMURAI:
        spellsPerLevel(character, "mageSpells", 3, 3);
        break;
    }
  }
  /**
   * Tries to learn new spells for each LEVEL of POWER and class (magical or priestly) a character can throw. 
   * @param {WizardryCharacter} character the character
   * @returns {String} any strings indicating success at learning, or null if no spells were learned
   */
  tryLearn(character) {
    /** the text returned, indicating success at learning */
    let retText = null;
    /** a flag indicating whetner the character has learned new spells. */
    let learned = false;
    /**  @type {WizardryAttribute} the attribute tested for learning capability. */
    let attribute = WizardryAttribute.IQ;
    /**
     * Try to learn a range of spells.
     * @param {Number} beginningIndex the beginning index of the spell range 
     * @param {Number} endingIndex the ending index of the spell range 
     */
    const tryToLearn = (beginningIndex, endingIndex) => {
      /** flag indicating the character knows at least one spell in the range. */
      let atLeastOneSpellKnown = false;
      for (let i = beginningIndex; i <= endingIndex; i++) {
        atLeastOneSpellKnown ||= character.spellsKnown[i];
        if (atLeastOneSpellKnown) {
          break;
        }
      }
      for (let i = beginningIndex; i <= endingIndex; i++) {
        if (!character.spellsKnown[i]) {
          // if a character doesn't know a spell, they have a chance to learn it if they can roll 1D30-1 lower than their magic attribute (IQ or PIETY),
          // OR they don't know ANY spells in that range, in which case they automatically learn the first spell in the range
          if (Dice.rollDie(30) - 1 < character.getAttribute(attribute) || !atLeastOneSpellKnown) {
            learned = true;
            atLeastOneSpellKnown = true;
            character.spellsKnown[i] = true;
          }
        }
      }
    }
    /**
     * Try to learn new Mage spells.
     */
    const tryMage = () => {
      attribute = WizardryAttribute.IQ;
      if (character.mageSpells[0] > 0) {
        tryToLearn(0, 3);
      }
      if (character.mageSpells[1] > 0) {
        tryToLearn(4, 5);
      }
      if (character.mageSpells[2] > 0) {
        tryToLearn(6, 7);
      }
      if (character.mageSpells[3] > 0) {
        tryToLearn(8, 10);
      }
      if (character.mageSpells[4] > 0) {
        tryToLearn(11, 13);
      }
      if (character.mageSpells[5] > 0) {
        tryToLearn(14, 17);
      }
      if (character.mageSpells[6] > 0) {
        tryToLearn(18, 20);
      }
    }
    /**
     * Try to learn new Priest spells.
     */
    const tryPriest = () => {
      attribute = WizardryAttribute.PIETY;
      if (character.priestSpells[0] > 0) {
        tryToLearn(21, 25);
      }
      if (character.priestSpells[1] > 0) {
        tryToLearn(26, 29);
      }
      if (character.priestSpells[2] > 0) {
        tryToLearn(30, 33);
      }
      if (character.priestSpells[3] > 0) {
        tryToLearn(34, 37);
      }
      if (character.priestSpells[4] > 0) {
        tryToLearn(38, 43);
      }
      if (character.priestSpells[5] > 0) {
        tryToLearn(44, 47);
      }
      if (character.priestSpells[6] > 0) {
        tryToLearn(48, 49);
      }
    }
    tryMage();
    tryPriest();
    if (learned) {
      retText = "YOU LEARNED NEW SPELLS!!!!";
    }
    this.setSpells(character);
    return retText;
  }
}

export { WizardryInnNapUi };