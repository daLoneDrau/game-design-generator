import { WizardryScene } from "../../scenes/wizardry-scene.js";
import * as Materials    from "../../components/materials/materials.js";
import { WizardryInterface } from "./wizardry-interface.js";

class WizardryUiDynamicListing {
  constructor(parameterObject) {
    this.key = parameterObject.key;
    this._elements = [];
    const layout = { rows: [], columns: [] };
    if (parameterObject.hasOwnProperty("columns")) {
      // layout holds X # of items spread out over Y columns
      for (let i = parameterObject.columns - 1; i >= 0; i--) {
        layout.columns.push(1 / parameterObject.columns);
      }
      const rows = parseInt(parameterObject.maxItems / parameterObject.columns);
      for (let i = rows - 1; i >= 0; i--) {
        layout.rows.push(1 / rows);
      }
    } else {
      // layout arranges all items in 1 column
      for (let i = parameterObject.maxItems - 1; i >= 0; i--) {
        layout.rows.push(1 / parameterObject.maxItems);
      }
    }
    // create a grid to hold all the items
    this._container = WizardryScene.createGrid(layout);
    for (let i = 0, li = parameterObject.maxItems; i < li; i++) {
      const itemListing = parameterObject.createItem(parameterObject.scene, parameterObject.callback, parameterObject.scope);
      this._elements.push(itemListing);
      if (parameterObject.hasOwnProperty("columns")) {
        if (parameterObject.arrange === "byRow") {
          // arrange items by row, i.e.
          // 1. xxxxx 2. xxxxxx
          // 3. xxxxx 4. xxxxxx
        } else {
          // arrange items by column, i.e.
          // 1. xxxxx 3. xxxxxx
          // 2. xxxxx 4. xxxxxx
          this._container.addControl(
            itemListing,
            parseInt(i % (parameterObject.maxItems / parameterObject.columns)), 
            parseInt(i / (parameterObject.maxItems / parameterObject.columns))
          );
        }
      } else {
        // all items arranged in one column
        this._container.addControl(itemListing, i, 0);
      }
    }
    this._getElementListing = parameterObject.getList;
    this._setList = parameterObject.setList;
  }
  get container() {
    return this._container;
  }
  /**
   * Resets the background on all character buttons.
   */
   resetHighlights() {
    for (let i = this._elements.length - 1; i >= 0; i--) {
      const rectangle = this._elements[i];
      rectangle.background = Materials.darkRGB;
      const child = rectangle.children[0];
      if (typeof(child.children) !== "undefined") {
        const children = rectangle.children[0].children;
        for (let i = children.length - 1; i >= 0; i--) {
          children[i].color = Materials.lightRGB;
        }
      } else {
        child.color = Materials.lightRGB;
      }
    }
  }
  /**
   * 
   * @param {WizardryInterface} parent 
   */
  setDynamicElement(parent = undefined) {
    const list = this._getElementListing(parent);
    this._setList(list, this._elements);
  }
}

export { WizardryUiDynamicListing };