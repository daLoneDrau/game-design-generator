import { WizardryInterface } from "../../components/ui/wizardry-interface.js";
import { WizardryConstants } from "../../config/wizardry-constants.js";
import { WizardryUiConfig } from "../../config/wizardry-ui-config.js";
import { WizardryUiStateScene } from "../wizardry-ui-state-scene.js";


/**
 * @class The maze runner scene.
 */
class WizardryMazeRunnerUiScene extends WizardryUiStateScene {
  /**
   * Creates a new WizardryCampInspectScene instance. 
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.MAZE_RUNNER_MAIN;
    this._uiConfigurations[[WizardryConstants.MAZE_RUNNER_MAIN]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.MAZE_RUNNER_MAIN]);
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
      this.state = WizardryConstants.MAZE_RUNNER_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }

    }
    super.render(updateCameras, ignoreAnimations);
  }
}

 export { WizardryMazeRunnerUiScene };