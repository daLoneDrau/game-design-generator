import * as Materials    from "../../components/materials/materials.js";
import { WizardryScene } from "../../scenes/wizardry-scene.js";
import { WizardryUiDynamicListing } from "./wizardry-ui-dynamic-listing.js";

const ELEMENT_FACTORY = {
  /**
   * Creates a new grid and any children it contains.
   * @param {WizardryInterface} wizInterface the parent WizardryScene
   * @param {object} parameterObject the grid initialization parameters
   * @returns {BABYLON.GUI.Grid} the grid object
   */
  grid: (wizInterface, parameterObject) => {
    const grid = WizardryScene.createGrid(parameterObject["initialization parameters"]);
    if (parameterObject.hasOwnProperty("children")) {
      // add children
      for (let i = 0, li = parameterObject.children.length; i < li; i++) {
        let child = parameterObject.children[i];
        const control = ELEMENT_FACTORY[child.type](wizInterface, child);
        console.log(control)
        if (child.hasOwnProperty("position")) {
          grid.addControl(
            control.hasOwnProperty("ui-element") ? control["ui-element"] : control,
            child.position.row,
            child.position.column
          );
          if (control.hasOwnProperty("ui-element")) {
            wizInterface.addDynamicElement(control.instance);
          }
        } else {
          grid.addControl(
            control.hasOwnProperty("ui-element") ? control["ui-element"] : control
          );
          if (control.hasOwnProperty("ui-element")) {
            wizInterface.addDynamicElement(control.instance);
          }
        }
      }
    }
    return grid;
  },
  /**
   * 
   * @param {WizardryInterface} wizInterface 
   * @param {*} parameterObject 
   * @returns 
   */
  button: (wizInterface, parameterObject) => {
    return wizInterface.scene.createButton(parameterObject["initialization parameters"]).container;
  },
  "dynamic listing": (wizInterface, parameterObject) => {
    // create a new dictionary with the scene property from wizInterface and the initialization properties from parameterObject
    const listing = new WizardryUiDynamicListing(Object.assign({ scene: wizInterface.scene }, parameterObject["initialization parameters"]));
    return { "ui-element": listing.container, instance: listing };
  },
  /**
   * 
   * @param {WizardryInterface} wizInterface 
   * @param {*} parameterObject 
   * @returns 
   */
  textBlock: (wizInterface, parameterObject) => {
    return wizInterface.scene.createTextBlock(parameterObject["initialization parameters"]);
  }
}
/**
 * Simple Interface class.
 * @class
 */
class WizardryInterface {
  /**
   * Creates a new instance of WizardryInterface.
   * @param {WizardryScene} parent the parent scene
   * @param {object} initializationParameters the UI initialization parameters
   */
  constructor(parent, initializationParameters) {    
    /**
     * the parent scene.
     * @private
     * @type {WizardryScene}
     */
     this._parent = parent;
     /**
      * the UI layout.
      * @private
      * @type {BABYLON.GUI.Grid}
      */
     this._topLevelContainer = null;
     /** the initialization properties. */
     this._properties = initializationParameters;
     this._dynamicElements = {};
  }
  /**
   * Gets the top-level container for the UI.
   */
  get configuration() {
    return this._topLevelContainer;
  }
  /**
   * Gets the parent scene.
   */
  get scene() {
    return this._parent;
  }
  addDynamicElement(element) {
    this._dynamicElements[element.key] = element;
  }
  /**
   * Initialization is called from the parent WizardryUiStateScene. This is called the first time the parent scene is rendered; afterwards a flag is set to prevent any further calls.
   */
  init() {
    // define the layout and the top-level container
    this._topLevelContainer = WizardryScene.createGrid(this._properties.layout.configuration);
    // draw borders
    this._parent.createScreenOutline({
      name: [this._properties.state, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: this._properties.border
    });
    // add children
    for (let i = 0, li = this._properties.layout.children.length; i < li; i++) {
      let child = this._properties.layout.children[i];
      if (child.hasOwnProperty("position")) {
        this._topLevelContainer.addControl(ELEMENT_FACTORY[child.type](this, child), child.position.row, child.position.column);
      } else {
        this._topLevelContainer.addControl(ELEMENT_FACTORY[child.type](this, child));
      }
    }
    return this._topLevelContainer;
  }
  /**
   * Sets the UI.
   */
  set() {
    console.log("set", this._dynamicElements)
    for (const elementName in this._dynamicElements) {
      const element = this._dynamicElements[elementName];
      element.set();
    }
  }
}

export { WizardryInterface };