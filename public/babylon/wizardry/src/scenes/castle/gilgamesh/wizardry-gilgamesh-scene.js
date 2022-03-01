import { WizardryGilgameshAddPartyUi }      from "./ui/wizardry-gilgamesh-add-party-ui.js";
import { WizardryGilgameshMainUi }          from "./ui/wizardry-gilgamesh-main-ui.js";
import { WizardryGilgameshRemovePartyUi }   from "./ui/wizardry-gilgamesh-remove-party-ui.js";
import { WizardryUiStateScene }             from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }                from "../../../config/wizardry-constants.js";

/**
 * @class Gilgamesh' Tavern scene.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
 class WizardryGilgameshScene extends WizardryUiStateScene {
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.GILGAMESH_MAIN;
    this._uiConfigurations[[WizardryConstants.GILGAMESH_MAIN]]         = new WizardryGilgameshMainUi(this);
    this._uiConfigurations[[WizardryConstants.GILGAMESH_ADD_PARTY]]    = new WizardryGilgameshAddPartyUi(this);
    this._uiConfigurations[[WizardryConstants.GILGAMESH_REMOVE_PARTY]] = new WizardryGilgameshRemovePartyUi(this);
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