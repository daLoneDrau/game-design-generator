import { WizardryMarketMainUi } from "./ui/wizardry-market-main-ui.js";
import { WizardryUiStateScene } from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }    from "../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../services/wizardry-controller.js";
import { WizardryInterface }    from "../../../components/ui/wizardry-interface.js";
import { WizardryUiConfig } from "../../../config/wizardry-ui-config.js";

/**
 * @class Castle scene.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
class WizardryMarketScene extends WizardryUiStateScene {
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.MARKET_MAIN;
    this._uiConfigurations[[WizardryConstants.MARKET_MAIN]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.MARKET_MAIN]);
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
      this.state = WizardryConstants.MARKET_MAIN;

      // reset global variables
      WizardryController.acMod2 = 0;
      WizardryController.attk012 = 0;
      WizardryController.fizzles = 0;
      WizardryController.light = 0;
      WizardryController.chestAlarm = 0;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryMarketScene };