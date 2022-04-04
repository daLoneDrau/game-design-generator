import { WizardryUiStateScene } from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }    from "../../../config/wizardry-constants.js";
import { WizardryInterface } from "../../../components/ui/wizardry-interface.js";
import { WizardryUiConfig } from "../../../config/wizardry-ui-config.js";

/**
 * @class Adventurer's Inn scene.
 */
 class WizardryInnScene extends WizardryUiStateScene {
  /**
   * Creates a new WizardryBoltacScene instance.
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.INN_MAIN;
    this._uiConfigurations[[WizardryConstants.INN_MAIN]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.INN_MAIN]);
    this._uiConfigurations[[WizardryConstants.INN_PLAYER_MENU]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.INN_PLAYER_MENU]);
    this._uiConfigurations[[WizardryConstants.INN_NAP_MENU]] = new WizardryInterface(this, WizardryUiConfig[WizardryConstants.INN_NAP_MENU]);
    /** @private the room selected for resting. */
    this._room = WizardryConstants.INN_ROOM_NONE;
    /** @private the current resting state. */
    this._currentRestState = WizardryConstants.INN_REST_HEALING;
  }
  get restState() {
    return this._currentRestState;
  }
  set restState(value) {
    return this._currentRestState = value;
  }
  /**
   * Gets the type of room selected.
   */
  get room() {
    return this._room;
  }
  /**
   * Sets the type of room selected.
   */
  set room(value) {
    if (isNaN(parseInt(value))) {
      throw ["WizardryInnScene.room setter requires an integer", value];
    }
    this._room = value;
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
      this.state = WizardryConstants.INN_MAIN;

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
      // this._uiConfigurations[WizardryConstants.GILGAMESH_ADD_PARTY].pagination = 0;
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryInnScene };