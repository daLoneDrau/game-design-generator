import { KEYBOARD_ENTRY_DELAY } from "../../../wizardry-scene.js";
import { WizardryScene } from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { FADE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiConfiguration } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import { WizardryConstants } from "../../../../config/wizardry-constants.js";
import { WizardryCharacterClass } from "../../../../config/wizardry-constants.js";
import { WizardryXgoto } from "../../../../config/wizardry-constants.js";
import { WizardryController } from "../../../../services/wizardry-controller.js";
import { WizardryCharacterMaker } from "../../../../services/wizardry-character-maker.js";
import * as Materials from "../../../../components/materials/materials.js";
import { Dice } from "../../../../../../assets/js/base.js";

/** the list of letters A-H. */
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H"];
/**
 * @class Ui class for the Change Class state of the Training scene.
 */
class WizardryTrainingChangeClassUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingChangeClassUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the callback function to process after displaying the user entry prompt. */
    this._callback = null;
    /** @private the BABYLON.GUI.TextBlock used to display the character. */
    this._characterBlock;
    /** @private the containers displaying the class change buttons. */
    this._classButtons = {};
    /** @private the map of class eligibility. */
    this._classEligibility = {};
    /** @private the cursor displayed. */
    this._cursor;
    /** @private the BABYLON.GUI.TextBlocks used to display user entry text. */
    this._entryBlock;
    /** @private the list of BABYLON.GUI.StackPanel used to display user entry. */
    this._entryPanel;
    /** @private the BABYLON.GUI.TextBlocks used to display user entry prompt. */
    this._entryPromptBlock;
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock;
    /** @private the selected class to change to. */
    this._selectedClass = null;
  }
  /**
   * Completes the action to change a character's class.
   * @param {boolean} commit if the true, the action is followed through; otherwise the action is ignored
   */
  changeClass(commit) {
    this._entryBlock.text = commit ? "YES" : "NO";
    BABYLON.setAndStartTimer({
      timeout: KEYBOARD_ENTRY_DELAY,
      contextObservable: this._parent.onBeforeRenderObservable,
      breakCondition: () => {
        // this will check if we need to break before the timeout has reached
        return this._parent.isDisposed;
      },
      onEnded: (data) => {
        // this will run when the timeout has passed
        this._entryBlock.text = "";
        this._entryPanel.isVisible = false;
        this._entryPromptBlock.isVisible = false;
        if (commit) {
          const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
          // reset character's attributes back to base
          WizardryCharacterMaker.setBaseAttributeScores(character);
          // change class
          character.clazz = this._selectedClass;
          // reset level and exp
          character.charLev = 1;
          character.exp = 0;
          // age the character by 4-7 years
          character.age += 52 * (Dice.ONE_D3.roll() - 1) + 252;
          // reset spells
          switch (character.clazz) {
            case WizardryCharacterClass.MAGE:
              character.spellsKnown[3] = true;
              break;
            case WizardryCharacterClass.PRIEST:
              character.spellsKnown[23] = true;
              break;
          }
          for (let i = character.mageSpells.length - 1; i >= 0; i--) {
            character.mageSpells[i] = 0;
          }
          for (let i = character.priestSpells.length - 1; i >= 0; i--) {
            character.priestSpells[i] = 0;
          }
          // remove all equipped items except for curse ones
          for (let i = character.possessions.count - 1; i >= 0; i--) {
            let possession = character.possessions.possession[i];
            if (!possession.cursed) {
              possession.equipped = false;
            }
          }
          // save the character roster          
          if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
            WizardryController.rosterInstance.updateRoster();
          }
          // go back to the training menu
          this._parent.state = WizardryConstants.TRAIN_CHARACTER_MAIN;
        }
      },
      onTick: (data) => {
        // this will run
      },
      onAborted: (data) => {
        // this function will run when the break condition has met (premature ending)
      },
    });
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let stopProcessing = true;
    const classes = WizardryCharacterClass.values;
    switch (key) {
      case "Escape":
      case "Enter":
        this._parent.state = WizardryConstants.TRAIN_CHARACTER_MAIN;
        break;
      case "A":
      case "a":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "B":
      case "b":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "C":
      case "c":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "D":
      case "d":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "E":
      case "e":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "F":
      case "f":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "G":
      case "g":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "H":
      case "g":
        stopProcessing = false;
        for (let i = ALPHABET.length - 1; i >= 0; i--) {
          if (ALPHABET[i] === key.toUpperCase()
              && this._classButtons[classes[i]].isVisible) {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._selectedClass = classes[i];
            this._callback = this.changeClass;
            stopProcessing = true;
          }
        }
        break;
      case "Y":
      case "y":
        if (this._entryPanel.isVisible){
          this._callback(true);
        } else {
          stopProcessing = false;
        }
        break;
      case "N":
      case "n":
        if (this._entryPanel.isVisible){
          this._callback(false);
        } else {
          stopProcessing = false;
        }
        break;
      default:
        stopProcessing = false;
        break;
    }
    if (!stopProcessing) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    this._parent.createScreenOutline({
      name: [WizardryConstants.TRAIN_CHARACTER_CHANGE_CLASS, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: [
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
        {
          points: [
            { cell: [0, 15] },
            { cell: [39, 15] }
          ]
        },
      ]
    });
    this._configuration = WizardryScene.createGrid({
      columns: [
        1 / 40, // left border
        38 / 40, // main area
        1 / 40 // right border
      ],
      rows: [
        1 / 24, // border
        1 / 24, // character info
        1 / 24, // border
        12 / 24, // menu
        1 / 24, // border
        8 / 24 // messages
      ]
    });
    this._characterBlock = this._parent.createTextBlock();
    this._configuration.addControl(this._characterBlock, 1, 1);

    { // main menu
      let rows = [];
      for (let i = 12; i > 0; i--) {
        rows.push(1 / 12);
      }
      let menuGrid = WizardryScene.createGrid({
        rows: rows
      });
      this._configuration.addControl(menuGrid, 3, 1);

      let row = 0;
      let classes = WizardryCharacterClass.values;
      for (let i = 0, li = classes.length; i < li; i++) {
        const clazz = classes[i];
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => {
              this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO CHANGE CLASSES";
              this._entryPanel.isVisible = true;
              this._entryPromptBlock.isVisible = true;
              this._selectedClass = clazz;
              this._callback = this.changeClass;
            }],
            onPointerEnterObservable: [() => {
              // stop the fade animation and restore the alpha on the message block
              this._messageBlock.alpha = 1;
              this._parent.stopAnimation(this._messageBlock);
              this._messageBlock.text = clazz.description;
            }],
            onPointerOutObservable: [() => {
              // clear the tooltip if it matches the selected tooltip text
              if (this._messageBlock.text === clazz.description) {
                this._messageBlock.text = "";
              }
            }]
          },
          text: {
            text: [ALPHABET[i], ") ", clazz.title].join(""),
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container;        
        this._classButtons[clazz] = button;
        menuGrid.addControl(button, row++, 1);
      }

      menuGrid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this._parent.backToTrainingGrounds(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "PRESS [ESC] TO LEAVE",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, row++, 1);
      row++;
      { // user entry prompt and cursor
        // prompt displayed to user
        this._entryPromptBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        this._entryPromptBlock.isVisible = false;
        menuGrid.addControl(this._entryPromptBlock, row++, 1);
        // stack panel to hold all items
        this._entryPanel = new BABYLON.GUI.StackPanel();
        this._entryPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._entryPanel.isVertical = false;
        menuGrid.addControl(this._entryPanel, row++, 1);
        this._entryPanel.addControl(this._parent.createTextBlock({ text: "                ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
        // Y button
        this._entryPanel.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this._callback(true); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[Y]",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);
        // spacer
        this._entryPanel.addControl(this._parent.createTextBlock({ text: "/", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
        // N button
        this._entryPanel.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this._callback(false); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[N]",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);
        // question mark
        this._entryPanel.addControl(this._parent.createTextBlock({ text: "? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
        // user entry
        this._entryBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        this._entryPanel.addControl(this._entryBlock);
        // cursor
        let o = WizardryScene.createBlinkingCursor();
        this._entryPanel.addControl(o.cursor);
        this._parent.beginDirectAnimation(
          o.cursor, //the target where the animation will take place
          [o.visible], // the list of animations to start
          0, // the initial frame
          ALPHA_FADE_FRAMERATE, // the final frame
          true // if you want animation to loop (off by default)
        );

        this._entryPanel.isVisible = false;
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
      this._configuration.addControl(this._messageBlock, 5, 1);
    }

    return this._configuration;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    this._selectedClass = null;
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    this._characterBlock.text = [
      character.name,
      " LEVEL ",
      character.charLev,
      " ",
      character.race.title, 
      " ",
      character.clazz.title,
      " (",
      character.status.title,
      ")"
    ].join("");
    // set map of eligibility
    let classes = WizardryCharacterClass.values;
    let atLeastOne = false;
    for (let i = 0, li = classes.length; i < li; i++) {
      if (WizardryCharacterMaker.isEligibleForClass(classes[i], character) && character.clazz !== classes[i]) {
        this._classEligibility[classes[i]] = true;
        this._classButtons[classes[i]].isVisible = true;
        atLeastOne = true;
      } else {
        this._classEligibility[classes[i]] = false;
        this._classButtons[classes[i]].isVisible = false;
      }
    }
    if (!atLeastOne) {
      this._messageBlock.text = ["There are no classes ", character.name, " can change to"].join("");
    } else {
      this._messageBlock.text = "";
    }
  }
}

export { WizardryTrainingChangeClassUi };