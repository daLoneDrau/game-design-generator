import * as Materials         from "../materials/materials.js";
import { DIV6,
  DIV7,
  DIV8,
  DIV38,
  WizardryCharacterStatus }   from "../../config/wizardry-constants.js";
import { WizardryScene }      from "../../scenes/wizardry-scene.js";
import { WizardryController } from "../../services/wizardry-controller.js";

/** Party block headers. */
const PARTY_BLOCK_HEADERS = ["#", "CHARACTER NAME",  "CLASS", "AC", "HITS", "STATUS"];

/**
 * @class Class for rendering the party in a panel.
 */
class WizardryPartyPanel {
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
    /**
     * the initialization parameters for the parent layout
     * @type {object}
     */
    const gridParameters = { rows: [DIV8, DIV8, 6 * DIV8] };
    if (parameterObject.hasOwnProperty("noBuffer") && parameterObject.noBuffer) {
      gridParameters.rows.splice(1, 1);
      gridParameters.rows[0] = DIV7;
      gridParameters.rows[1] = 6 * DIV7;
    }
    /** @private the top level container - a 1 x 3 grid. */
    this._topLevelContainer = WizardryScene.createGrid(gridParameters);
    /** @private the objects containing the containers for the party UI display. */
    this._partyTextBlocks = [];
    { // header
      /** a BABYLON.GUI.Grid that takes up 1 row. */
      let headerGrid = WizardryScene.createGrid({
        columns: [
          DIV38,      // empty
          DIV38,      // 1 - order #
          DIV38,      // empty
          15 * DIV38, // 3 - name
          DIV38,      // empty
          5 * DIV38,  // 5 - class
          DIV38,      // empty
          2 * DIV38,  // 7 - ac
          DIV38,      // empty
          4 * DIV38,  // 9 -  hits
          DIV38,      // empty
          6 * DIV38   // 11 - status
        ]
      });
      if (parameterObject.hasOwnProperty("noBuffer") && parameterObject.noBuffer) {
        this._topLevelContainer.addControl(headerGrid, 0, 0);
      } else {
        this._topLevelContainer.addControl(headerGrid, 1, 0);
      }

      // add party headers
      for (let i = 0, li = PARTY_BLOCK_HEADERS.length; i < li; i++) {
        headerGrid.addControl(parameterObject.parent._parent.createTextBlock({ text: PARTY_BLOCK_HEADERS[i] }), 0, i * 2 + 1); // row, column
      }
    }
    { // individual party members
      /** a 1x6 BABYLON.GUI.Grid to hold all party member rows. */
      let partyGrid = WizardryScene.createGrid({
        rows: [DIV6, DIV6, DIV6, DIV6, DIV6, DIV6]
      });
      if (parameterObject.hasOwnProperty("noBuffer") && parameterObject.noBuffer) {
        this._topLevelContainer.addControl(partyGrid, 1, 0);
      } else {
        this._topLevelContainer.addControl(partyGrid, 2, 0);
      }

      for (let j = 0; j < 6; j++) {
        const index = j;
        /** a BABYLON.GUI.Grid to lay out the party member elements */
        const rowGrid = WizardryScene.createGrid({
          columns: [
            DIV38,      // empty
            DIV38,      // 1 - order #
            DIV38,      // empty
            15 * DIV38, // 3 - name
            DIV38,      // empty
            5 * DIV38,  // 5 - class
            DIV38,      // empty
            2 * DIV38,  // 7 - ac
            DIV38,      // empty
            4 * DIV38,  // 9 -  hits
            DIV38,      // empty
            6 * DIV38   // 11 - status
          ]
        });
        /** a dictionary object for the interactive text blocks. */
        let o = {
          order: parameterObject.parent._parent.createTextBlock({ }),
          name: parameterObject.parent._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),
          clazz: parameterObject.parent._parent.createTextBlock(),
          ac: parameterObject.parent._parent.createTextBlock(),
          hits: parameterObject.parent._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT }),
          status: parameterObject.parent._parent.createTextBlock()
        };
        // add widgets to row
        rowGrid.addControl(o.order,  0, 1); // row, column
        rowGrid.addControl(o.name,   0, 3); // row, column
        rowGrid.addControl(o.clazz,  0, 5); // row, column
        rowGrid.addControl(o.ac,     0, 7); // row, column
        rowGrid.addControl(o.hits,   0, 9); // row, column
        rowGrid.addControl(o.status, 0, 11); // row, column

        // add widgets to display list
        this._partyTextBlocks.push(o);
        if (parameterObject.isInteractive) {
          /** an interactive parent BABYLON.GUI.Rectangle to hold the party member elements */
          const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
          rectangle.thickness = 0;
          rectangle.background = Materials.darkRGB;
          rectangle.adaptWidthToChildren = false;
          rectangle.isPointerBlocker = true;
          rectangle.hoverCursor = "pointer";
          rectangle.onPointerClickObservable.add((eventData, eventState) => {
            parameterObject.callback(rectangle.name);
          });
          rectangle.onPointerEnterObservable.add((eventData, eventState) => {
            rectangle.background = Materials.lightRGB;
            const children = rectangle.children[0].children;
            for (let i = children.length - 1; i >= 0; i--) {
              children[i].color = Materials.darkRGB;
            }
          });
          rectangle.onPointerOutObservable.add(
            (eventData, eventState) => {
              rectangle.background = Materials.darkRGB;
              const children = rectangle.children[0].children;
              for (let i = children.length - 1; i >= 0; i--) {
                children[i].color = Materials.lightRGB;
              }
            },                      // callback
            -1,                     // mask used to filter observers
            false,                  // flag indicating whether the callback is inserted at first postion
            parameterObject.parent  // scope object
          );
          o.rectangle = rectangle;
          rectangle.addControl(rowGrid);
          partyGrid.addControl(rectangle, j, 0);
        } else {
          partyGrid.addControl(rowGrid, j, 0);
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
   * Resets the background on all character buttons.
   */
  resetHighlights() {
    if (this._isInteractive) {
      for (let i = this._partyTextBlocks.length - 1; i >= 0; i--) {
        const refBlock = this._partyTextBlocks[i];
        refBlock.rectangle.background = Materials.darkRGB;
        const children = refBlock.rectangle.children[0].children;
        for (let i = children.length - 1; i >= 0; i--) {
          children[i].color = Materials.lightRGB;
        }
      }
    }
  }
  /**
   * Sets the display.
   */
  set() {
    /** the reference ids for all party members. */
    const charRefIds = WizardryController.characters;
    for (let i = this._partyTextBlocks.length - 1; i >= 0; i--) {
      const refBlock = this._partyTextBlocks[i];
      refBlock.order.text = "";
      refBlock.name.text = "";
      refBlock.clazz.text = "";
      refBlock.ac.text = "";
      refBlock.hits.text = "";
      refBlock.status.text = "";
      if (this._isInteractive) {
        refBlock.rectangle.isVisible = false;
      }
    }
    for (let i = 0, li = charRefIds.length; i < li; i++) {
      const character = WizardryController.rosterInstance.getCharacterRecord(charRefIds[i]);
      console.log(character)
      const refBlock = this._partyTextBlocks[i];
      refBlock.order.text = (i + 1).toString();
      refBlock.name.text = character.name;
      refBlock.clazz.text = [character.alignment.title.substring(0, 1), "-", character.clazz.title.substring(0, 3)].join("");
      refBlock.ac.text = character.armorCl > -10 ? character.armorCl.toString() : "LO";
      refBlock.hits.text = character.hpLeft.toString();
      if (character.status === WizardryCharacterStatus.OK) {
        if (character.lostXyl.poisonAmt[0] !== 0) {
          refBlock.status.text = "POISON";
        } else {
          refBlock.status.text = character.hpMax.toString();
        }
      } else {
        refBlock.status.text = character.status.title;
      }
      if (this._isInteractive) {
        refBlock.rectangle.name = charRefIds[i];
        refBlock.rectangle.isVisible = true;
      }
    }
  }
}

export { WizardryPartyPanel };