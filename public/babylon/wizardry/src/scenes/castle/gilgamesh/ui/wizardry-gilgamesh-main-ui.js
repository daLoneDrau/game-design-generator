import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { WizardryScene }        from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryConstants,
  WizardryCharacterClass,
  WizardryCharacterStatus,
  WizardryXgoto }               from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Main state of the Tavern scene.
 */
class WizardryGilgameshMainUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryGilgameshMainUi instance.
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
   * @param {String} refId the reference id of the character being inspected
   */
  activateCharacter(refId) {
    WizardryController.characterRecord = refId;
    WizardryController.xgoto = WizardryXgoto.XINSPCT3;
    WizardryController.xgoto2 = WizardryXgoto.XGILGAMS;
    if (!this.hasOwnProperty("_partyPanel")) {
      this.parent._partyPanel.resetHighlights();
      this.parent._parent.exitScene();
    } else {
      this._partyPanel.resetHighlights();
      this._parent.exitScene();
    }
  }
  /**
   * Goes to the Add Member state.
   */
  goToAddMember() {
    if (WizardryController.partyCnt < 6) {
      this._parent.state = WizardryConstants.GILGAMESH_ADD_PARTY;
      this._partyPanel.resetHighlights();
    } else {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Goes back to the Castle Market.
   */
  goToCastle() {
    WizardryController.xgoto = WizardryXgoto.XCASTLE;
    this._partyPanel.resetHighlights();
    this._parent.exitScene();
  }
  /**
   * Goes to the Remove Member state.
   */
  goToRemoveMember() {
    if (WizardryController.partyCnt > 0) {
      this._parent.state = WizardryConstants.GILGAMESH_REMOVE_PARTY;
      this._partyPanel.resetHighlights();
    } else {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
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
      case "A":
        if (WizardryController.partyCnt < 6) {
          this.goToAddMember();
        } else {
          validInput = false;
        }
        break;
      case "R":
        if (WizardryController.partyCnt > 0) {
          this.goToRemoveMember();
        } else {
          validInput = false;
        }
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        const index = parseInt(key) - 1;
        if (index < WizardryController.characters.length) {
          this.activateCharacter(WizardryController.characters[index]);
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

    { // create options
      let grid = WizardryScene.createGrid({
        key: "optionsGrid",
        columns: [
          8 / 38, // column
          30 / 38 // column
        ],
        rows: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7]
      });
      this._configuration.addControl(grid, 5, 1);

      grid.addControl(this._parent.createTextBlock({
        text: "YOU MAY ",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT,
        textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
      }), 0, 0);
    }

    this._addButton = this._parent.createButton({
      background: {
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        onPointerClickObservable: [
          () => { this.goToAddMember(); }, // callback
        ],
        onPointerEnterObservable: [() => { }],
        onPointerOutObservable: [() => { }]
      },
      text: { text: "A)DD A MEMBER," }
    }).container;

    this._removeButton = this._parent.createButton({
      background: {
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        onPointerClickObservable: [
          () => { this.goToRemoveMember() }, // callback
        ],
        onPointerEnterObservable: [() => { }],
        onPointerOutObservable: [() => { }]
      },
      text: { text: "R)EMOVE A MEMBER," }
    }).container;

    this._inspectButton = this._parent.createButton({
      background: {
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        onPointerEnterObservable: [
          () => {
            this._messageBlock.alpha = 1;
            this._parent.stopAnimation(this._messageBlock);
            this._messageBlock.text = "Press any valid player # (1-6) or click their row to inspect that player.";
          }
        ],
        onPointerOutObservable: [
          () => {
            // clear the tooltip if it matches the selected tooltip text
            if (this._messageBlock.text === "Press any valid player # (1-6) or click their row to inspect that player.") {
              this._messageBlock.text = "";
            }
          }
        ]
      },
      text: { text: "#) SEE A MEMBER," }
    }).container;

    this._leaveButton = this._parent.createButton({
      background: {
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        onPointerClickObservable: [
          () => { this.goToCastle(); }, // callback
        ],
        onPointerEnterObservable: [() => { }],
        onPointerOutObservable: [() => { }]
      },
      text: { text: "OR PRESS [ESCAPE] TO LEAVE" }
    }).container;

    return this._configuration;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    this._subTitleTextBlock.text = "TAVERN";
    { // reset the meny options
      let grid = this._configuration.getChildByName("optionsGrid");
      // remove all buttons
      grid.removeControl(this._addButton);
      grid.removeControl(this._removeButton);
      grid.removeControl(this._inspectButton);
      grid.removeControl(this._leaveButton);

      // add back buttons as needed
      let row = 0;
      if (WizardryController.partyCnt < 6) {
        grid.addControl(this._addButton, row++, 1);
      }
      if (WizardryController.partyCnt > 0) {
        grid.addControl(this._removeButton, row++, 1);
        grid.addControl(this._inspectButton, row++, 1);
      }
      grid.addControl(this._leaveButton, ++row, 1);
    }
  }
}

export { WizardryGilgameshMainUi };