import { WizardryScene } from "../../scenes/wizardry-scene.js";

class WizardryUiDynamicListing {
  constructor(parameterObject) {
    this.key = parameterObject.key;
    this._elements = [];
    const layout = { rows: [], columns: [] };
    if (parameterObject.hasOwnProperty("columns")) {
      // layout holds X # of items spread out over Y columns
    } else {
      // layout arranges all items in 1 column
      for (let i = parameterObject.maxItems - 1; i >= 0; i--) {
        layout.rows.push(1 / parameterObject.maxItems);
      }
    }
    // create a grid to hold all the items
    this._container = WizardryScene.createGrid(layout);
    for (let i = 0, li = parameterObject.maxItems; i < li; i++) {
      const itemListing = parameterObject.createItem(parameterObject.scene);
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
  set() {
    const list = this._getElementListing();
    this._setList(list, this._elements);
    console.log(list);
  }
}

export { WizardryUiDynamicListing };