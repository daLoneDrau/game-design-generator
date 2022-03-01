import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryConstants,
  WizardryCharacterStatus,
  WizardryXgoto }               from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Main state of the Shop scene. In this state, the user either chooses a player to shop, or leaves.
 */
class WizardryBoltacMainUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryBoltacMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    this._isPartyClickable = true;
    this._addButton = null;
    this._removeButton = null;
    this._inspectButton = null;
    this._leaveButton = null;
  }
  /**
   * Goes to the Inspection scene.
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
    if (typeof(isTestEnvironment) !== "undefined"
        && isTestEnvironment) {
      PARENT_OBJECT.prepForExit();
      PARENT_OBJECT._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
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
          PARENT_OBJECT.prepForExit();
          PARENT_OBJECT._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
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
    if (typeof(isTestEnvironment) !== "undefined"
        && isTestEnvironment) {
      WizardryController.xgoto = WizardryXgoto.XCASTLE;
      this.prepForExit();
      this._parent.exitScene();
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
          WizardryController.xgoto = WizardryXgoto.XCASTLE;
          this.prepForExit();
          this._parent.exitScene();
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
  /**
   * Initalizes the view.
   */
  init() {
    super.init();
    this._parent.createScreenOutline({
      name: [WizardryConstants.GILGAMESH_MAIN, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: this._screenLines
    });

    let grid = WizardryScene.createGrid({
      rows: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7]
    });
    this._configuration.addControl(grid, 5, 1);

    grid.addControl(this._parent.createTextBlock({ text: "WELCOME TO THE TRADING POST" }), 0, 0);

    { // entry prompt and cursor
      let panel = new BABYLON.GUI.StackPanel();
      panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel.isVertical = false;
      grid.addControl(panel, 1, 0);

      panel.addControl(this._parent.createTextBlock({ text: "WHO WILL ENTER ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

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
          text: "(ESC) TO LEAVE",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, 2, 0);
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
    this._subTitleTextBlock.text = "SHOP ";
  }
}

export { WizardryBoltacMainUi };