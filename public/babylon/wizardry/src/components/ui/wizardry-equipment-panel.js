import * as Materials         from "../materials/materials.js";
import { DIV6,
  WizardryCharacterStatus }  from "../../config/wizardry-constants.js";
import { WizardryScene }      from "../../scenes/wizardry-scene.js";
import { WizardryController } from "../../services/wizardry-controller.js";

/** Party block headers. */
const PARTY_BLOCK_HEADERS = ["#", "CHARACTER NAME",  "CLASS", "AC", "HITS", "STATUS"];

/**
 * @class Class for rendering the player's equipment in a panel.
 */
class WizardryEquipmentPanel {
  /**
   * Creates a new instance of WizardryPartyPanel.
   * @param {object} parameterObject the initialization parameters
   */
  constructor(parameterObject) {
    if (!parameterObject.hasOwnProperty("parent")) {
      throw ["Invalid parameters", parameterObject];
    }
    if (!parameterObject.hasOwnProperty("isInteractive")) {
      parameterObject.isInteractive = false;
    }
    if (parameterObject.isInteractive
        && !parameterObject.hasOwnProperty("callback")) {
      throw ["Invalid parameters - missing callback", parameterObject];
    }
    /** @private flag indicating whether the panel is interactive. */
    this._isInteractive = parameterObject.isInteractive;
    /** @private the top level container - a 1 x 6 grid. */
    this._topLevelContainer = WizardryScene.createGrid({
      rows: [DIV6, DIV6, 4 * DIV6]
    });
    /** @private the objects containing the containers for the party UI display. */
    this._equipmentTextBlocks = [];
    { // ROW 1 - header
      this._topLevelContainer.addControl(parameterObject.parent._parent.createTextBlock({ text: "*=EQUIP, -=CURSED, ?=UNKNOWN, #=UNUSABLE" }), 0, 0);
    }
    { // ROW 3-6 - equipment items
      /** a 2x4 BABYLON.GUI.Grid to hold all party member rows. */
      let equipmentGrid = WizardryScene.createGrid({
        columns: [1 / 2, 1 / 2],
        rows: [1 / 4, 1 / 4, 1 / 4, 1 / 4]
      });
      this._topLevelContainer.addControl(equipmentGrid, 2, 0);

      for (let j = 0; j < 4; j++) {
        // create 2 buttons
        const button1 = parameterObject.parent._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => {                
              parameterObject.callback(button1.container.name);
            }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        });
        equipmentGrid.addControl(button1.container, j, 0);
        this._equipmentTextBlocks.push(button1);

        const button2 = parameterObject.parent._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => {                
              parameterObject.callback(button2.container.name);
            }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        });
        equipmentGrid.addControl(button2.container, j, 1);
        this._equipmentTextBlocks.push(button2);

        if (parameterObject.isInteractive) {
          button1.enable(false);
          button2.enable(false);
        }
      }
    }
  }
  /**
   * Gets the panel's container.
   */
  get container() {
    return this._topLevelContainer;
  }
  /**
   * Enables/disables the panel.
   * @param {Boolean} value if true, the panel is enabled; otherwise it is disabled
   */
  enable(value) {
    for (let i = this._equipmentTextBlocks.length - 1; i >= 0; i--) {
      this._equipmentTextBlocks[i].enable(value);
    }
  }
  /**
   * Sets the display.
   */
  set() {
    /** the character being displayed. */
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    for (let i = this._equipmentTextBlocks.length - 1; i >= 0; i--) {
      const refBlock = this._equipmentTextBlocks[i];
      if (character.possessions.possession[i].equipmentIndex >= 0) {
        const possessionObject = character.possessions.possession[i];
        const itemData = WizardryController.equipmentListInstance.getEquipmentItem(character.possessions.possession[i].equipmentIndex);
        let s = [i + 1, ")"];
        if (possessionObject.equipped) {
          if (possessionObject.cursed) {
            s.push("-");
          } else {
            s.push("*");
          }
        } else {
          if (possessionObject.identified) {
            if (itemData.classUse[character.clazz]) {
              s.push(" ");
            } else {
              s.push("#");
            }
          } else {
            s.push("?");
          }
        }
        if (possessionObject.identified) {
          s.push(itemData.name);
        } else {
          s.push(itemData.nameUnknown);
        }
        refBlock.text.text = s.join("");
        refBlock.container.name = i;
      } else {
        refBlock.text.text = "";
        refBlock.enable(false);
        console.log("setting to blank",i,refBlock)
      }
    }
  }
}

export { WizardryEquipmentPanel };