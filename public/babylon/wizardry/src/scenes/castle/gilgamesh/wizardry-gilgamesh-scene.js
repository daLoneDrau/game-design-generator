import { WizardryUiStateScene }             from "../../wizardry-ui-state-scene.js";
import { WizardryInterface }                from "../../../components/ui/wizardry-interface.js";
import { WizardryConstants }                from "../../../config/wizardry-constants.js";
import { WizardryUiConfig }                 from "../../../config/wizardry-ui-config.js";

/**
 * @class Gilgamesh' Tavern scene.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
 class WizardryGilgameshScene extends WizardryUiStateScene {
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.GILGAMESH_MAIN;
    this._uiConfigurations[[WizardryConstants.GILGAMESH_MAIN]]         = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.GILGAMESH_MAIN]);
    this._uiConfigurations[[WizardryConstants.GILGAMESH_ADD_PARTY]]    = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.GILGAMESH_ADD_PARTY]);
    this._uiConfigurations[[WizardryConstants.GILGAMESH_REMOVE_PARTY]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.GILGAMESH_REMOVE_PARTY]);
    /**
     * the current roster page
     * @type {Number}
     */
    this._currentPage = 0;
  }
  get rosterPage() {
    return this._currentPage;
  }
  set rosterPage(value) {
    this._currentPage = value;
  }
  /**
   * Render the scene.
   * @param {boolean} updateCameras defines a boolean indicating if cameras must update according to their inputs (true by default)
   * @param {boolean} ignoreAnimations defines a boolean indicating if animations should not be executed (false by default)
   */
  render(updateCameras, ignoreAnimations) {
    if (this._enterScene) {

      // initialize the UI
      if (!this._uiCreated) {
        this.initUi();
        this._uiCreated = true;
      }
      this._enterScene = false;

      // reset local variables
      this.state = WizardryConstants.GILGAMESH_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
      this._uiConfigurations[WizardryConstants.GILGAMESH_ADD_PARTY].pagination = 0;
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryGilgameshScene };