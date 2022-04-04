import { WizardryUiDynamicListing } from "./wizardry-ui-dynamic-listing.js";
import * as Materials               from "../../components/materials/materials.js";
import { WizardryScene }            from "../../scenes/wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE }     from "../../scenes/wizardry-ui-configuration.js";

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
    let retObj = grid;
    if (parameterObject["initialization parameters"].hasOwnProperty("dynamicElement") && parameterObject["initialization parameters"].dynamicElement) {
      retObj = {
        "ui-element": grid,
        instance: grid
      };
      if (parameterObject["initialization parameters"].hasOwnProperty("setDynamicElement")) {
        grid.setDynamicElement = parameterObject["initialization parameters"].setDynamicElement;
      }
    }
    return retObj;
  },
  /**
   * 
   * @param {WizardryInterface} wizInterface 
   * @param {*} parameterObject 
   * @returns 
   */
  button: (wizInterface, parameterObject) => {
    const button = wizInterface.scene.createButton(parameterObject["initialization parameters"], wizInterface).container;
    let retObj = button;
    if (parameterObject["initialization parameters"].hasOwnProperty("dynamicElement") && parameterObject["initialization parameters"].dynamicElement) {
      retObj = {
        "ui-element": button,
        instance: button
      };
      if (parameterObject["initialization parameters"].hasOwnProperty("setDynamicElement")) {
        button.setDynamicElement = parameterObject["initialization parameters"].setDynamicElement;
      }
    }
    return retObj;
  },
  cursor: (wizInterface, parameterObject) => {
    let o = WizardryScene.createBlinkingCursor();
    wizInterface._parent.beginDirectAnimation(
      o.cursor, //the target where the animation will take place
      [o.visible], // the list of animations to start
      0, // the initial frame
      ALPHA_FADE_FRAMERATE, // the final frame
      true // if you want animation to loop (off by default)
    );
    return o.cursor;
  },
  "dynamic listing": (wizInterface, parameterObject) => {
    const initializationParameters = Object.assign({ scene: wizInterface.scene }, parameterObject["initialization parameters"]);
    if (initializationParameters.hasOwnProperty("callback")) {
      initializationParameters.callback = wizInterface.actions[initializationParameters.callback];
      initializationParameters.scope = wizInterface;
    }
    // create a new dictionary with the scene property from wizInterface and the initialization properties from parameterObject
    const listing = new WizardryUiDynamicListing(initializationParameters);
    return { "ui-element": listing.container, instance: listing };
  },
  stack: (wizInterface, parameterObject) => {
    const panel = new BABYLON.GUI.StackPanel(parameterObject["initialization parameters"].hasOwnProperty("key") ? parameterObject["initialization parameters"].key : WizardryScene.randomKey());
    if (parameterObject["initialization parameters"].hasOwnProperty("horizontalAlignment")) {
      panel.horizontalAlignment = parameterObject.horizontalAlignment;
    }
    if (parameterObject["initialization parameters"].hasOwnProperty("isVertical")) {
      panel.isVertical = parameterObject.isVertical;
    }
    if (parameterObject.hasOwnProperty("children")) {
      // add children
      for (let i = 0, li = parameterObject.children.length; i < li; i++) {
        let child = parameterObject.children[i];
        const control = ELEMENT_FACTORY[child.type](wizInterface, child);
        panel.addControl(
          control.hasOwnProperty("ui-element") ? control["ui-element"] : control
        );
        if (control.hasOwnProperty("ui-element")) {
          wizInterface.addDynamicElement(control.instance);
        }
      }
      let retObj = panel;
      if (parameterObject["initialization parameters"].hasOwnProperty("dynamicElement") && parameterObject["initialization parameters"].dynamicElement) {
        retObj = {
          "ui-element": panel,
          instance: panel
        };
        if (parameterObject["initialization parameters"].hasOwnProperty("setDynamicElement")) {
          panel.setDynamicElement = parameterObject["initialization parameters"].setDynamicElement;
        }
      }
      return retObj;
    }
  },
  /**
   * 
   * @param {WizardryInterface} wizInterface 
   * @param {*} parameterObject 
   * @returns 
   */
  text: (wizInterface, parameterObject) => {
    const text = wizInterface.scene.createTextBlock(parameterObject["initialization parameters"]);
    let retObj = text;
    if (parameterObject["initialization parameters"].hasOwnProperty("dynamicElement") && parameterObject["initialization parameters"].dynamicElement) {
      retObj = {
        "ui-element": text,
        instance: text
      };
      if (parameterObject["initialization parameters"].hasOwnProperty("setDynamicElement")) {
        text.setDynamicElement = parameterObject["initialization parameters"].setDynamicElement;
      }
    }
    return retObj;
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
     this._acceptingInput = true;
  }
  get actions() {
    return this._properties.actions;
  }
  get keyEvents() {
    return this._properties.keyEntries;
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
  /**
   * Adds a dynamic UI element.
   * @param {object} element the element
   */
  addDynamicElement(element) {
    if (element.hasOwnProperty("key")) {
      this._dynamicElements[element.key] = element;
    }
    if (element.hasOwnProperty("name")) {
      this._dynamicElements[element.name] = element;
    }
  }
  getDynamicElement(id) {
    return this._dynamicElements[id];
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    if (this._acceptingInput) {
      this._properties.keyHandler.apply(this, [key.toUpperCase()]);
    }
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
      const control = ELEMENT_FACTORY[child.type](this, child);
      if (child.hasOwnProperty("position")) {
        this._topLevelContainer.addControl(
          control.hasOwnProperty("ui-element") ? control["ui-element"] : control,
          child.position.row,
          child.position.column
        );
        if (control.hasOwnProperty("ui-element")) {
          this.addDynamicElement(control.instance);
        }
      } else {
        this._topLevelContainer.addControl(
          control.hasOwnProperty("ui-element") ? control["ui-element"] : control
        );
        if (control.hasOwnProperty("ui-element")) {
          this.addDynamicElement(control.instance);
        }
      }
    }
    return this._topLevelContainer;
  }
  /**
   * Sets the UI.
   */
  set() {
    for (const elementName in this._dynamicElements) {
      const element = this._dynamicElements[elementName];
      if (typeof(element.setDynamicElement) === "function") {
        element.setDynamicElement(this);
      }
    }
  }
  /**
   * Handles a user action.
   * @param {string} action the name of the action to perform
   * @param {Array} args the arguments to supply to the actions
   */
  userAction(action, args) {
    if (this._acceptingInput) {
      this._acceptingInput = false;
      this._properties.actions[action].apply(this, Array.isArray(args) ? args : [args]);
    }
  }
}

export { WizardryInterface };