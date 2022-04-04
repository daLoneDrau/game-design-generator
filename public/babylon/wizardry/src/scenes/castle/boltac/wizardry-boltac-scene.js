import { WizardryUiStateScene }     from "../../wizardry-ui-state-scene.js";
import { WizardryInterface }        from "../../../components/ui/wizardry-interface.js";
import { WizardryConstants }        from "../../../config/wizardry-constants.js";
import { WizardryUiConfig }         from "../../../config/wizardry-ui-config.js";

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
    this._state = WizardryConstants.BOLTAC_SELECT_CHARACTER;
    this._uiConfigurations[[WizardryConstants.BOLTAC_SELECT_CHARACTER]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.BOLTAC_SELECT_CHARACTER]);
    this._uiConfigurations[[WizardryConstants.BOLTAC_MAIN_MENU]]        = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.BOLTAC_MAIN_MENU]);
    this._uiConfigurations[[WizardryConstants.BOLTAC_BUY_MENU]]         = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.BOLTAC_BUY_MENU]);
    this._uiConfigurations[[WizardryConstants.BOLTAC_IDENTIFY_MENU]]    = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.BOLTAC_IDENTIFY_MENU]);
    this._uiConfigurations[[WizardryConstants.BOLTAC_SELL_MENU]]        = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.BOLTAC_SELL_MENU]);
    this._uiConfigurations[[WizardryConstants.BOLTAC_UNCURSE_MENU]]     = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.BOLTAC_UNCURSE_MENU]);
    /**
     * the current roster page
     * @type {Number}
     */
    this._currentPage = 0;
    this._lastPage = 0;
  }
  /**
   * Gets the current page of inventory displayed
   */
  get inventoryPage() {
    return this._currentPage;
  }
  /**
   * Sets the inventory page displayed.
   */
  set inventoryPage(value) {
    this._currentPage = value;
  }
  /**
   * Gets the last possible page of inventory to display
   */
  get inventoryLastPage() {
    return this._lastPage;
  }
  /**
   * Sets the last possible inventory page to display.
   */
  set inventoryLastPage(value) {
    this._lastPage = value;
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
      this.state = WizardryConstants.BOLTAC_SELECT_CHARACTER;

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