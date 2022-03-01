import { WizardryEdgeTownMainUi } from "./ui/wizardry-edge-town-main-ui.js";
import { WizardryEdgeTownMazeUi } from "./ui/wizardry-edge-town-maze-ui.js";
import { WizardryUiStateScene }   from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }      from "../../../config/wizardry-constants.js";

/**
 * @class Edge of Town scene.
 */
class WizardryEdgeTownScene extends WizardryUiStateScene {
   /**
    * Creates a WizardryEdgeTownScene new instance.
    * @param {BABYLON.Engine} engine the engine running the scene
    */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.EDGE_TOWN_MAIN;
    this._uiConfigurations[[WizardryConstants.EDGE_TOWN_MAIN]] = new WizardryEdgeTownMainUi(this);
    this._uiConfigurations[[WizardryConstants.EDGE_TOWN_MAZE]] = new WizardryEdgeTownMazeUi(this);
    this._isEnteringMaze = false;

  }
  get isEnteringMaze() {
    return this._isEnteringMaze;
  }
  set isEnteringMaze(value) {
    this._isEnteringMaze = value;
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
      this.state = WizardryConstants.EDGE_TOWN_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryEdgeTownScene };