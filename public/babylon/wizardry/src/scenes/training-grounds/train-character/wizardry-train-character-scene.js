import { WizardryTrainingMainUi } from "./ui/wizardry-train-character-main-ui.js";
import { WizardryTrainingChangeClassUi } from "./ui/wizardry-train-character-change-class-ui.js";
import { WizardryUiStateScene } from "../../wizardry-ui-state-scene.js";
import { WizardryConstants } from "../../../config/wizardry-constants.js";
import { WizardryXgoto } from "../../../config/wizardry-constants.js";
import { WizardryController } from "../../../services/wizardry-controller.js";

/**
 * @class The character creation scene.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
class WizardryTrainingScene extends WizardryUiStateScene {
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.TRAIN_CHARACTER_MAIN;
    this._uiConfigurations[[WizardryConstants.TRAIN_CHARACTER_MAIN]] = new WizardryTrainingMainUi(this);
    this._uiConfigurations[[WizardryConstants.TRAIN_CHARACTER_CHANGE_CLASS]] = new WizardryTrainingChangeClassUi(this);
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
      this.state = WizardryConstants.TRAIN_CHARACTER_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryTrainingScene };