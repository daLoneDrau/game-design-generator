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
 * @class Ui class for the Player Menu state of the Shop scene.
 */
class WizardryBoltacPlayerUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryBoltacPlayerUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlock displaying the character's gold. */
    this._goldText = null;
    /** @private the BABYLON.GUI.TextBlock displaying the character's name. */
    this._nameText = null;
  }
  /**
   * Goes to the Buy menu.
   */
  buy() {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    if (character.gold <= 0) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "You don't have any gold.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      this._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    }
  }
  /**
   * Exits the player menu.
   */
  exit() {
    WizardryController.characterRecord = "";
    this._parent.state = WizardryConstants.BOLTAC_MAIN;
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
      case "L":
        this.exit();
        break;
      case "B":
        this.buy();
        break;
      case "S":
        this.sell();
        break;
      case "U":
        this.uncurse();
        break;
      case "I":
        this.identify();
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
   * Goes to the Identify menu.
   */
  identify() {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    if (!character.hasAnyUnidentifiedEquipment()) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "You don't have any unidentified equipment.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      this._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    super.init();
    this._parent.createScreenOutline({
      name: [WizardryConstants.BOLTAC_PLAYER_MENU, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: this._screenLines
    });
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);

    // 7 lines for the menu
    let grid = WizardryScene.createGrid({
      rows: [1 / 7, 1 / 7, 1 / 7, 4 / 7]
    });
    this._configuration.addControl(grid, 5, 1);

    { // line 1 - welcome
      let panel = new BABYLON.GUI.StackPanel();
      panel.isVertical = false;
      grid.addControl(panel, 0, 0);

      panel.addControl(this._parent.createTextBlock({ text: "WELCOME " }));
      this._nameText = this._parent.createTextBlock();
      panel.addControl(this._nameText);
    }

    { // line 2 - gold
      let panel = new BABYLON.GUI.StackPanel();
      panel.isVertical = false;
      grid.addControl(panel, 1, 0);

      panel.addControl(this._parent.createTextBlock({ text: "YOU HAVE " }));
      this._goldText = this._parent.createTextBlock();
      panel.addControl(this._goldText);
      panel.addControl(this._parent.createTextBlock({ text: " GOLD" }));
    }
    { // lines 4 - 7 - menu
      let twoColumnGrid = WizardryScene.createGrid({
        columns: [8 / 38, 30 / 38]
      });
      grid.addControl(twoColumnGrid, 3, 0);
      { // column 1 - YOU MAY
        let col1Grid = WizardryScene.createGrid({
          rows: [1 / 4, 3 / 4]
        });
        twoColumnGrid.addControl(col1Grid, 0, 0);

        col1Grid.addControl(this._parent.createTextBlock({ text: "YOU MAY", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }), 0, 0);
      }
      { // column 2 - menu
        let col2Grid = WizardryScene.createGrid({
          rows: [1 / 4, 1 / 4, 1 / 4, 1 / 4]
        });
        twoColumnGrid.addControl(col2Grid, 0, 1);
        
        { // line 3 - BUY, SELL
          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          col2Grid.addControl(panel, 0, 0);
          { // buttons
            panel.addControl(this._parent.createButton({
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: [() => { this.buy(); }],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: {
                text: "B)UY AN ITEM",
                horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
              }
            }).container);
            panel.addControl(this._parent.createTextBlock({ text: ", " }));
            panel.addControl(this._parent.createButton({
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: [() => { this.sell(); }],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: {
                text: "S)ELL AN ITEM",
                horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
              }
            }).container);
            panel.addControl(this._parent.createTextBlock({ text: ", " }));
          }
        }
        { // line 4 - UNCURSE
          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          col2Grid.addControl(panel, 1, 0);
          { // buttons
            panel.addControl(this._parent.createButton({
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: [() => { this.uncurse(); }],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: {
                text: "HAVE AN ITEM U)NCURSED",
                horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
              }
            }).container);
            panel.addControl(this._parent.createTextBlock({ text: ", " }));
          }
        }
        { // line 5 - IDENTIFY
          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          col2Grid.addControl(panel, 2, 0);
          { // buttons
            panel.addControl(this._parent.createButton({
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: [() => { this.identify(); }],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: {
                text: "HAVE AN ITEM I)DENTIFIED",
                horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
              }
            }).container);
            panel.addControl(this._parent.createTextBlock({ text: ", " }));
          }
        }
        { // LEAVE
          col2Grid.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              onPointerClickObservable: [() => { this.exit(); }],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "OR L)EAVE",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
            }
          }).container, 3, 0);
        }
      }
    }

    return this._configuration;
  }
  /**
   * Goes to the Sell menu.
   */
  sell() {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    if (character.possessions.count <= 0) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "You don't have any equipment.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      this._parent.state = WizardryConstants.BOLTAC_SELL_MENU;
    }
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    this._subTitleTextBlock.text = "SHOP ";
    if (typeof(character) !== "undefined") {
      this._nameText.text = character.name;
      this._goldText.text = character.gold.toString();
    }
  }
  /**
   * Goes to the Uncurse menu.
   */
  uncurse() {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    if (!character.hasAnyCursedEquipment()) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "You don't have any cursed equipment.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      this._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;
    }
  }
}

export { WizardryBoltacPlayerUi };