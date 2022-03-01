import { WizardryScene } from "./wizardry-scene.js";
import { createScreenOutline } from "../components/ui/screenoutline.js";

/**
 * @class The base class for a scene that includes different UI presentations based on the scene state.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
 class WizardryUiStateScene extends WizardryScene {
  constructor(engine) {
    super(engine);
    /** @private the UI configurations. */
    this._uiConfigurations = {};
    /** @private the current UI state. */
    this._state = 1;
  }
  get state() {
    return this._state;
  }
  /**
   * Sets the UI state.
   * @param {Number} value the new state
   */
  set state(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._state = value;
    // hide the screen outlines
    const children = this._advancedTexture.rootContainer.children;
    for (let i = 0, li = children.length; i < li; i++) {
      if (children[i] instanceof BABYLON.GUI.Line) {
        children[i].isVisible = false;
      }
    }
    // hide containers
    for (let prop in this._uiConfigurations) {
      this._uiConfigurations[prop].configuration.isVisible = false;
      // console.log("hide",prop,this._uiConfigurations[[this._state]])
    }
    // display container and lines for the state
    if (this._uiConfigurations.hasOwnProperty([[this._state]])) {
      this._uiConfigurations[[this._state]].configuration.isVisible = true;
      // console.log("show",this._uiConfigurations[[this._state]])
      this._uiConfigurations[[this._state]].set();

      for (let i = 0, li = children.length; i < li; i++) {
        if (children[i] instanceof BABYLON.GUI.Line
              && children[i].name === [this._state, "_ui_frame"].join("")) {
          children[i].isVisible = true;
        }
      }
    }
  }
  /**
   * Creates a UI frame based on the specified parameters.
   * @param {object} parameterObject the parameters
   */
  createScreenOutline(parameterObject) {    
    // create the frame
    createScreenOutline(this.getEngine().getRenderingCanvas(), this._advancedTexture, parameterObject);
  }
  /**
   * Initializes the UI.
   */
   initUi() {
    super.initUi();
    for (let prop in this._uiConfigurations) {
      this._advancedTexture.addControl(this._uiConfigurations[prop].init());
    }
    { // add keyboard entry
      if (this.onKeyboardObservable.observers.length === 0) {
        this.onKeyboardObservable.add((kbInfo) => {
          switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
              this._uiConfigurations[[this._state]].handleKeyEntry(kbInfo.event.key);
              break;
          }
        });
      } else {
        console.log("not adding")
      }
    }
  }
}

export { WizardryUiStateScene };