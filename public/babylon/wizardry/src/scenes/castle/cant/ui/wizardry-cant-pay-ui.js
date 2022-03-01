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

/** the user input phase. */
const INPUT_PHASE = 0;
/** the healing phase. */
const HEALING_PHASE = 1;
/** the exit phase. */
const EXIT_PHASE = 2;
/**
 * @class Ui class for the Pay Menu state of the Temple scene.
 */
class WizardryCantPayUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryCantPayUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /**
     * The current UI phase.
     * @private
     * @type {Number}
     */
    this._currentPhase = INPUT_PHASE;
    /**
     * The text block displaying the cost of the donation needed to heal the afflicted character.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._donationBlock = null;
    /**
     * The cost of the donation needed to heal the afflicted character.
     * @private
     * @type {Number}
     */
    this._donationNeeded = 0;
    /**
     * The text block displaying user entry.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._entryBlock = null;
    /**
     * The grid used to display the user entry form.
     * @private
     * @type {BABYLON.GUI.Grid}
     */
    this._entryGrid = null;
    /**
     * The grid used to display the healing activity and results.
     * @private
     * @type {BABYLON.GUI.Grid}
     */
    this._healingGrid = null;
    /**
     * The text blocks displaying the name of the character receiving healing.
     * @private
     * @type {Array}
     */
    this._nameBlocks = [];
    this._chants = [];
    this._resultBlock = null;
  }
  /**
   * Goes to the Temple Payment scene.
   * @param {Number} index the index of the character being inspected
   */
  activateCharacter(index) {
    if (this._currentPhase === INPUT_PHASE) {
      /** the reference id of the character paying for the healing. */
      let payerRefId = "";
      if (!isNaN(parseInt(index))) {
        payerRefId = WizardryController.characters[index];
      } else {
        payerRefId = index;
      }
      /** the character paying for the healing. */
      const payer = WizardryController.rosterInstance.getCharacterRecord(payerRefId);
      /** the character receiving the healing. */
      const patient = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      let tmpParent = null;
      if (!this.hasOwnProperty("_partyPanel")) {
        tmpParent = this.parent;
      } else {
        tmpParent = this;
      }
      const PARENT_OBJECT = tmpParent;
      PARENT_OBJECT._entryBlock.text = payer.name;
      /** the last action will attempt to heal and display the results. */
      const action5 = () => {
        this._currentPhase = EXIT_PHASE;
        // attempt to heal the character
        this.attemptToHeal(patient);
        switch(patient.status) {
          case WizardryCharacterStatus.OK:
            this._resultBlock.text = [patient.name, " IS WELL"].join("");
            break;
          case WizardryCharacterStatus.ASHES:
            this._resultBlock.text = [patient.name, " NEEDS KADORTO NOW"].join("");
            break;
          case WizardryCharacterStatus.LOST:
            this._resultBlock.text = [patient.name, " WILL BE BURIED"].join("");
            break;
          default:
            console.trace("after attempt",patient.status)
        }
      };
      /** reveal the last chant and move on to the last action. */
      const action4 = () => {
        // reveal the last chant
        this._chants[3].color = Materials.lightRGB;
        if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
          action5();
        } else {
          BABYLON.setAndStartTimer({
            timeout: KEYBOARD_ENTRY_DELAY,
            contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
            breakCondition: () => {
              // this will check if we need to break before the timeout has reached
              return PARENT_OBJECT._parent.isDisposed;
            },
            onEnded: (data) => {
              // this will run when the timeout has passed
              action5();
            },
            onTick: (data) => {
              // this will run
            },
            onAborted: (data) => {
              // this function will run when the break condition has met (premature ending)
            },
          });
        }
      };
      /** reveal the second to last chant and move on next. */
      const action3 = () => {
        // reveal the last chant
        this._chants[2].color = Materials.lightRGB;
        if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
          action4();
        } else {
          BABYLON.setAndStartTimer({
            timeout: KEYBOARD_ENTRY_DELAY,
            contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
            breakCondition: () => {
              // this will check if we need to break before the timeout has reached
              return PARENT_OBJECT._parent.isDisposed;
            },
            onEnded: (data) => {
              // this will run when the timeout has passed
              action4();
            },
            onTick: (data) => {
              // this will run
            },
            onAborted: (data) => {
              // this function will run when the break condition has met (premature ending)
            },
          });
        }
      };
      /** reveal the second chant and move on next. */
      const action2 = () => {
        // reveal the last chant
        this._chants[1].color = Materials.lightRGB;
        if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
          action3();
        } else {
          BABYLON.setAndStartTimer({
            timeout: KEYBOARD_ENTRY_DELAY,
            contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
            breakCondition: () => {
              // this will check if we need to break before the timeout has reached
              return PARENT_OBJECT._parent.isDisposed;
            },
            onEnded: (data) => {
              // this will run when the timeout has passed
              action3();
            },
            onTick: (data) => {
              // this will run
            },
            onAborted: (data) => {
              // this function will run when the break condition has met (premature ending)
            },
          });
        }
      };
      /** reveal the first chant and move on next. */
      const action1 = () => {
        // reveal the last chant
        this._chants[0].color = Materials.lightRGB;
        if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
          action2();
        } else {
          BABYLON.setAndStartTimer({
            timeout: KEYBOARD_ENTRY_DELAY,
            contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
            breakCondition: () => {
              // this will check if we need to break before the timeout has reached
              return PARENT_OBJECT._parent.isDisposed;
            },
            onEnded: (data) => {
              // this will run when the timeout has passed
              action2();
            },
            onTick: (data) => {
              // this will run
            },
            onAborted: (data) => {
              // this function will run when the break condition has met (premature ending)
            },
          });
        }
      };
      /** the action taken. default is to make a healing attempt. */
      let action = () => {
        // pay gold
        payer.gold -= this._donationNeeded;
        // switch to the next state and reset the UI
        this._currentPhase = HEALING_PHASE;
        this.set();
        if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
          action1();
        } else {
          BABYLON.setAndStartTimer({
            timeout: KEYBOARD_ENTRY_DELAY,
            contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
            breakCondition: () => {
              // this will check if we need to break before the timeout has reached
              return PARENT_OBJECT._parent.isDisposed;
            },
            onEnded: (data) => {
              // this will run when the timeout has passed
              action1();
            },
            onTick: (data) => {
              // this will run
            },
            onAborted: (data) => {
              // this function will run when the break condition has met (premature ending)
            },
          });
        }
      };
      if (this._donationNeeded > payer.gold) {
        // payer can't afford treatment
        action = () => {
          PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
          PARENT_OBJECT._messageBlock.text = "** CHEAP APOSTATES! OUT! **";
          PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        };
      }
      if (typeof(isTestEnvironment) !== "undefined"  && isTestEnvironment) {
        action();
      } else {
        BABYLON.setAndStartTimer({
          timeout: KEYBOARD_ENTRY_DELAY,
          contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
          breakCondition: () => {
            // this will check if we need to break before the timeout has reached
            return PARENT_OBJECT._parent.isDisposed;
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
  }
  /**
   * Attempts to heal a patient.
   * @param {WizardryCharacter} patient the patient being healed
   */
  attemptToHeal(patient) {
    switch (patient.status) {
      case WizardryCharacterStatus.DEAD:
        if (Dice.rollDie(100) - 1 > 50 + 3 * patient.getAttribute(WizardryAttribute.VITALITY)) {
          patient.status = WizardryCharacterStatus.ASHES;
          WizardryController.removeFromParty(patient);
        } else {
          patient.status = WizardryCharacterStatus.OK;
          patient.age += Dice.rollDie(52);
          patient.hpLeft = 1;
        }
        break;
      case WizardryCharacterStatus.ASHES:
        if (Dice.rollDie(100) - 1 > 40 + 3 * patient.getAttribute(WizardryAttribute.VITALITY)) {
          patient.status = WizardryCharacterStatus.LOST;
          WizardryController.removeFromParty(patient);
        } else {
          patient.status = WizardryCharacterStatus.OK;
          patient.age += Dice.rollDie(52);
          patient.hpLeft = patient.hpMax;
        }
        break;
      case WizardryCharacterStatus.PLYZE:
      case WizardryCharacterStatus.STONED:
        patient.status = WizardryCharacterStatus.OK;
        patient.age += Dice.rollDie(52);
        break;
      default:
        throw ["Invalid status", patient.status];
    }
    if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
      WizardryController.rosterInstance.updateRoster();
    }
  }
  /**
   * Returns the player to the Castle Market.
   */
  exit() {
    this.prepForExit();
    this._parent.state = WizardryConstants.CANT_MAIN;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let validInput = true;
    switch (this._currentPhase) {
      case INPUT_PHASE:
        switch (key.toUpperCase()) {
          case "ESCAPE":
          case "ENTER":
            this.exit();
            break;
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
            const index = parseInt(key) - 1;
            if (index < WizardryController.characters.length) {
              this.activateCharacter(index);
            } else {
              validInput = false;
            }
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
        break;
      case EXIT_PHASE:
        switch (key.toUpperCase()) {
          case "ESCAPE":
          case "ENTER":
            this.exit();
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
        break;
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
        8 / 24, // 3 - party area 3-10
        1 / 24, // 4 - border - 11
        7 / 24, // 5 - menu - 12-18
        1 / 24, // 6 - border
        4 / 24, // 7 - messages
      ]
    });

    this._parent.createScreenOutline({
      name: [WizardryConstants.CANT_PAY, "_ui_frame"].join(""),
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
    { // entry grid
      this._entryGrid = WizardryScene.createGrid({
        rows: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7]
      });
      this._entryGrid.isVisible = false;
      this._configuration.addControl(this._entryGrid, 5, 1);

      this._entryGrid.addControl(this._parent.createTextBlock({ text: "WELCOME TO THE TEMPLE OF RADIANT CANT!"}), 0, 0);

      { // name block
        let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        this._nameBlocks.push(text);
        this._entryGrid.addControl(text, 2, 0);
      }
      { // donation block
        this._donationBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        this._entryGrid.addControl(this._donationBlock, 4, 0);
      }

      { // entry prompt and cursor
        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        this._entryGrid.addControl(panel, 5, 0);  

        panel.addControl(this._parent.createTextBlock({ text: "WHO WILL TITHE ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
  
        this._entryBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        panel.addControl(this._entryBlock);
  
        let o = WizardryScene.createBlinkingCursor();
        panel.addControl(o.cursor);
        this._parent.beginDirectAnimation(
          o.cursor, //the target where the animation will take place
          [o.visible], // the list of animations to start
          0, // the initial frame
          ALPHA_FADE_FRAMERATE, // the final frame
          true // if you want animation to loop (off by default)
        );
      }
      { // exit button
        this._entryGrid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.exit(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[ESC] TO LEAVE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container, 6, 0);
      }
    }
    { // healing grid
      this._healingGrid = WizardryScene.createGrid({
        rows: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7]
      });
      this._healingGrid.isVisible = false;
      this._configuration.addControl(this._healingGrid, 5, 1);

      this._healingGrid.addControl(this._parent.createTextBlock({ text: "WELCOME TO THE TEMPLE OF RADIANT CANT!"}), 0, 0);

      { // name block
        let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        this._nameBlocks.push(text);
        this._healingGrid.addControl(text, 2, 0);
      }
      { // chanting block
        let panel = new BABYLON.GUI.StackPanel();
        panel.isVertical = false;
        this._healingGrid.addControl(panel, 4, 0);

        const chants = ["MURMUR - ", "CHANT - ", "PRAY - ", "INVOKE!"];
        for (let i = 0, li = chants.length; i < li; i++) {
          this._chants.push(this._parent.createTextBlock({
            text: chants[i],
            color: Materials.darkRGB,
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          }));
          panel.addControl(this._chants[i]);
        }
      }
      { // results block
        this._resultBlock = this._parent.createTextBlock();
        this._healingGrid.addControl(this._resultBlock, 5, 0);
      }
      { // exit button
        this._entryGrid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.exit(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[ESC] TO LEAVE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container, 6, 0);
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
   * Prepares to exit the scene state.
   */
  prepForExit() {
    this._messageBlock.text = "";
    this._entryBlock.text = "";
    this._currentPhase = INPUT_PHASE;
    for (let i = this._chants.length - 1; i >= 0; i--) {
      this._chants[i].color = Materials.darkRGB;
    }
    this._resultBlock.text = "";
    this._partyPanel.resetHighlights();
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    this._subTitleTextBlock.text = "TEMPLE ";
    /** the character receiving healing. */
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    if (typeof(character) !== "undefined") {
      // set name blocks
      for (let i = this._nameBlocks.length - 1; i >= 0; i--) {
        this._nameBlocks[i].text = ["WHO ARE YOU HELPING ? >", character.name];
      }
      switch (this._currentPhase) {
        case INPUT_PHASE:
          this._entryGrid.isVisible = true;
          this._healingGrid.isVisible = false;
          { // set donation block
            switch (character.status) {
              case WizardryCharacterStatus.PLYZE:
                this._donationNeeded = 100;
                break;
              case WizardryCharacterStatus.STONED:
                this._donationNeeded = 200;
                break;
              case WizardryCharacterStatus.DEAD:
                this._donationNeeded = 250;
                break;
              case WizardryCharacterStatus.ASHES:
                this._donationNeeded = 500;
                break;
              default:
                throw ["Incurable condition", character.status];
            }
            this._donationNeeded *= character.charLev;
            this._donationBlock.text = ["THE DONATION WILL BE ", this._donationNeeded].join("");
          }
          break;
        case HEALING_PHASE:
        case EXIT_PHASE:
          this._entryGrid.isVisible = false;
          this._healingGrid.isVisible = true;
          break;
      }
    }
  }
}

export { WizardryCantPayUi };