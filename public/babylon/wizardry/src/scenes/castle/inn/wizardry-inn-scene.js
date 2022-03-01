import { WizardryInnMainUi }    from "./ui/wizardry-inn-main-ui.js";
import { WizardryInnNapUi }  from "./ui/wizardry-inn-nap-ui.js";
import { WizardryInnPlayerUi }  from "./ui/wizardry-inn-player-ui.js";
import { WizardryUiStateScene } from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }    from "../../../config/wizardry-constants.js";

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
    this._uiConfigurations[[WizardryConstants.INN_MAIN]]        = new WizardryInnMainUi(this);
    this._uiConfigurations[[WizardryConstants.INN_PLAYER_MENU]] = new WizardryInnPlayerUi(this);
    this._uiConfigurations[[WizardryConstants.INN_NAP_MENU]]    = new WizardryInnNapUi(this);
    /** @private the room selected for resting. */
    this._room = WizardryConstants.INN_ROOM_NONE;
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