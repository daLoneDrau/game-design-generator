import { WizardryTrainingGroundsMainUi } from "./ui/wizardry-training-grounds-main-ui.js";
import { WizardryUiStateScene }          from "../wizardry-ui-state-scene.js";
import { WizardryConstants }             from "../../config/wizardry-constants.js";

/**
 * @class Base class for all Castle scenes.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
class WizardryTrainingGroundsScene extends WizardryUiStateScene {
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.TRAINING_GROUNDS_MAIN;
    // assign a UI class for each state
    this._uiConfigurations[[WizardryConstants.TRAINING_GROUNDS_MAIN]] = new WizardryTrainingGroundsMainUi(this);
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
      this.state = WizardryConstants.TRAINING_GROUNDS_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryTrainingGroundsScene  };