import { WizardryCampInspectMainUi } from "./ui/wizardry-camp-inspect-main-ui.js";
import { WizardryCampReadSpellsMainUi } from "./ui/wizardry-camp-read-spells-main-ui.js";
import { WizardryUiStateScene }      from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }         from "../../../config/wizardry-constants.js";

/**
 * @class The character inspection scene.
 */
class WizardryCampInspectScene extends WizardryUiStateScene {
  /**
   * Creates a new WizardryCampInspectScene instance. 
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.INSPECT_CHARACTER_MAIN;
    const mainMenu = new WizardryCampInspectMainUi(this);
    this._uiConfigurations[[WizardryConstants.INSPECT_CHARACTER_MAIN]] = mainMenu;
    this._uiConfigurations[[WizardryConstants.INSPECT_DROP_MAIN]] = mainMenu;
    this._uiConfigurations[[WizardryConstants.INSPECT_READ_SPELLS_MAIN]] = new WizardryCampReadSpellsMainUi(this);
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
      this.state = WizardryConstants.INSPECT_CHARACTER_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }

    }
    super.render(updateCameras, ignoreAnimations);
  }
}

 export { WizardryCampInspectScene };