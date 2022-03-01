import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE }                        from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryConstants,
  WizardryCharacterStatus,
  WizardryXgoto }               from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Main Menu state of the Temple scene.
 */
class WizardryCantMainUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryCantMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlock displaying the healing data. @type {BABYLON.GUI.TextBlock} */
    this._entryBlock = null;
    this._isPartyClickable = true;
  }
  /**
   * Goes to the Temple Payment scene.
   * @param {Number} index the index of the character being inspected
   */
  activateCharacter(index) {
    if (!isNaN(parseInt(index))) {
      WizardryController.characterRecord = WizardryController.characters[index];
    } else {
      WizardryController.characterRecord = index;
    }
    /** the character activated. */
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    let tmpParent = null;
    if (!this.hasOwnProperty("_partyPanel")) {
      tmpParent = this.parent;
    } else {
      tmpParent = this;
    }
    const PARENT_OBJECT = tmpParent;
    PARENT_OBJECT._entryBlock.text = character.name;

    // determine the action taken. by default, character selected can rest in the Inn
    let action = () => {
      PARENT_OBJECT.prepForExit();
      PARENT_OBJECT._parent.state = WizardryConstants.CANT_PAY;
    };
    if (character.lostXyl.location[0] + character.lostXyl.location[1] + character.lostXyl.location[2] !== 0) {
      // character doesn't need treatment
      action = () => {
        WizardryController.characterRecord = "";
        PARENT_OBJECT._entryBlock.text = "";
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = [character.name, " IS NOT HERE"].join("");
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      };
    } else if (character.status === WizardryCharacterStatus.LOST) {
      // character doesn't need treatment
      action = () => {
        WizardryController.characterRecord = "";
        PARENT_OBJECT._entryBlock.text = "";
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = [character.name, " IS LOST"].join("");
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      };
    } else if (character.status === WizardryCharacterStatus.OK) {
      // character doesn't need treatment
      action = () => {
        WizardryController.characterRecord = "";
        PARENT_OBJECT._entryBlock.text = "";
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = [character.name, " IS OK"].join("");
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      };
    }
    if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
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
  /**
   * Returns the player to the Castle Market.
   */
  goToCastle() {
    this._entryBlock.text = "LEAVE";
    /** action taken to complete the process. */
    const action = () => {
      WizardryController.xgoto = WizardryXgoto.XCASTLE;
      this.prepForExit();
      this._parent.exitScene();
    };
    if (typeof(isTestEnvironment) !== "undefined"
        && isTestEnvironment) {
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
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let validInput = true;
    switch (key.toUpperCase()) {
      case "ESCAPE":
      case "ENTER":
        this.goToCastle();
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
        5 / 24, // 5 - menu
        1 / 24, // 6 - border
        6 / 24, // 7 - messages
      ]
    });

    this._parent.createScreenOutline({
      name: [WizardryConstants.CANT_MAIN, "_ui_frame"].join(""),
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
            { cell: [0, 17] },
            { cell: [39, 17] }
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
      const grid = WizardryScene.createGrid({
        rows: [ 1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5,]
      });
      this._configuration.addControl(grid, 5, 1);

      grid.addControl(this._parent.createTextBlock({ text: "WELCOME TO THE TEMPLE OF RADIANT CANT!"}), 0, 0);

      { // entry prompt and cursor
        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 2, 0);
  
        panel.addControl(this._parent.createTextBlock({ text: "WHO ARE YOU HELPING ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
  
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
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.goToCastle(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[ESC] TO LEAVE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container, 4, 0);
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
    this._partyPanel.resetHighlights();
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    this._subTitleTextBlock.text = "TEMPLE ";
  }
}

export { WizardryCantMainUi };