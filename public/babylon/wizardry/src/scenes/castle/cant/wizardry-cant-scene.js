import { WizardryCantMainUi }   from "./ui/wizardry-cant-main-ui.js";
import { WizardryCantPayUi }    from "./ui/wizardry-cant-pay-ui.js";
import { WizardryUiStateScene } from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }    from "../../../config/wizardry-constants.js";

/**
 * @class Temple of Cant scene.
 */
 class WizardryCantScene extends WizardryUiStateScene {
  /**
   * Creates a new WizardryCantScene instance.
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.CANT_MAIN;
    this._uiConfigurations[[WizardryConstants.CANT_MAIN]] = new WizardryCantMainUi(this);
    this._uiConfigurations[[WizardryConstants.CANT_PAY]]  = new WizardryCantPayUi(this);
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
      this.state = WizardryConstants.CANT_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryCantScene };