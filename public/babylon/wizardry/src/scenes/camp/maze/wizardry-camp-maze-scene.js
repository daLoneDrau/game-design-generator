import { WizardryCampMazeMainUi } from "./ui/wizardry-camp-maze-main-ui.js";
import { WizardryUiStateScene }   from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }      from "../../../config/wizardry-constants.js";

/**
 * @class The character inspection scene.
 */
class WizardryCampMazeScene extends WizardryUiStateScene {
  /**
   * Creates a new WizardryCampInspectScene instance. 
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.CAMP_MAZE_MAIN;
    this._uiConfigurations[[WizardryConstants.CAMP_MAZE_MAIN]] = new WizardryCampMazeMainUi(this);
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
      this.state = WizardryConstants.CAMP_MAZE_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }

    }
    super.render(updateCameras, ignoreAnimations);
  }
}

 export { WizardryCampMazeScene };