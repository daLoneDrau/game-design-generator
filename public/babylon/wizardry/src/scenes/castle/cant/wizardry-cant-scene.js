import { WizardryUiStateScene } from "../../wizardry-ui-state-scene.js";
import { WizardryInterface }    from "../../../components/ui/wizardry-interface.js";
import { WizardryConstants }    from "../../../config/wizardry-constants.js";
import { WizardryUiConfig }     from "../../../config/wizardry-ui-config.js";

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
    this._uiConfigurations[[WizardryConstants.CANT_MAIN]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.CANT_MAIN]);
    this._uiConfigurations[[WizardryConstants.CANT_PAY]]  = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.CANT_PAY]);
    this._healingPhase = 0;
    this._donationRequired = 0;
  }
  /**
   * Gets the current phase of healing
   */
  get donationRequired() {
    return this._donationRequired;
  }
  /**
   * Sets the current phase of healing.
   */
  set donationRequired(value) {
    this._donationRequired = value;
  }
  /**
   * Gets the current phase of healing
   */
  get healingPhase() {
    return this._healingPhase;
  }
  /**
   * Sets the current phase of healing.
   */
  set healingPhase(value) {
    this._healingPhase = value;
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