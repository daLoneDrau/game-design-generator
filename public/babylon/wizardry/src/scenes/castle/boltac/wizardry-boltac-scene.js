import { WizardryBoltacBuyUi }      from "./ui/wizardry-boltac-buy-ui.js";
import { WizardryBoltacIdentifyUi } from "./ui/wizardry-boltac-identify-ui.js";
import { WizardryBoltacMainUi }     from "./ui/wizardry-boltac-main-ui.js";
import { WizardryBoltacSellUi }     from "./ui/wizardry-boltac-sell-ui.js";
import { WizardryBoltacPlayerUi }   from "./ui/wizardry-boltac-player-ui.js";
import { WizardryBoltacUncurseUi }  from "./ui/wizardry-boltac-uncurse-ui.js";
import { WizardryUiStateScene }     from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }        from "../../../config/wizardry-constants.js";

/**
 * @class Boltac's Trading Post scene.
 */
 class WizardryBoltacScene extends WizardryUiStateScene {
  /**
   * Creates a new WizardryBoltacScene instance.
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.BOLTAC_MAIN;
    this._uiConfigurations[[WizardryConstants.BOLTAC_MAIN]]          = new WizardryBoltacMainUi(this);
    this._uiConfigurations[[WizardryConstants.BOLTAC_PLAYER_MENU]]   = new WizardryBoltacPlayerUi(this);
    this._uiConfigurations[[WizardryConstants.BOLTAC_BUY_MENU]]      = new WizardryBoltacBuyUi(this);
    this._uiConfigurations[[WizardryConstants.BOLTAC_IDENTIFY_MENU]] = new WizardryBoltacIdentifyUi(this);
    this._uiConfigurations[[WizardryConstants.BOLTAC_SELL_MENU]]     = new WizardryBoltacSellUi(this);
    this._uiConfigurations[[WizardryConstants.BOLTAC_UNCURSE_MENU]]  = new WizardryBoltacUncurseUi(this);
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
      this.state = WizardryConstants.BOLTAC_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
      // this._uiConfigurations[WizardryConstants.GILGAMESH_ADD_PARTY].pagination = 0;
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryBoltacScene };