import { WizardryMakeCharacterAlignmentUi } from "./ui/wizardry-make-character-alignment-ui.js";
import { WizardryMakeCharacterClassUi }     from "./ui/wizardry-make-character-class-ui.js";
import { WizardryMakeCharacterNameUi }      from "./ui/wizardry-make-character-name-ui.js";
import { WizardryMakeCharacterPointsUi }    from "./ui/wizardry-make-character-points-ui.js";
import { WizardryMakeCharacterRaceUi }      from "./ui/wizardry-make-character-race-ui.js";
import { WizardryMakeCharacterSaveUi }      from "./ui/wizardry-make-character-save-ui.js";
import { WizardryUiStateScene }             from "../../wizardry-ui-state-scene.js";
import { WizardryConstants }                from "../../../config/wizardry-constants.js";
import { WizardryCharacterMaker }           from "../../../services/wizardry-character-maker.js";
import { WizardryController }               from "../../../services/wizardry-controller.js";

/**
 * @class Character Creation scene.
 */
class WizardryCharacterCreationScene extends WizardryUiStateScene {
   /**
    * Creates a new WizardryCharacterCreationScene instance.
    * @param {BABYLON.Engine} engine the engine running the scene
    */
  constructor(engine) {
    super(engine);
    this._state = WizardryConstants.MAKE_CHARACTER_NAME;
    // assign a UI class for each state
    this._uiConfigurations[[WizardryConstants.MAKE_CHARACTER_NAME]]      = new WizardryMakeCharacterNameUi(this);
    this._uiConfigurations[[WizardryConstants.MAKE_CHARACTER_RACE]]      = new WizardryMakeCharacterRaceUi(this);
    this._uiConfigurations[[WizardryConstants.MAKE_CHARACTER_ALIGNMENT]] = new WizardryMakeCharacterAlignmentUi(this);
    this._uiConfigurations[[WizardryConstants.MAKE_CHARACTER_POINTS]]    = new WizardryMakeCharacterPointsUi(this);
    this._uiConfigurations[[WizardryConstants.MAKE_CHARACTER_CLASS]]     = new WizardryMakeCharacterClassUi(this);
    this._uiConfigurations[[WizardryConstants.MAKE_CHARACTER_SAVE]]      = new WizardryMakeCharacterSaveUi(this);
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
      this.state = WizardryConstants.MAKE_CHARACTER_NAME;
      try {
        WizardryCharacterMaker.newCharacter();
      } catch (e) {
        WizardryCharacterMaker.newCharacter();
      }
      if (WizardryController.inheritedName.length > 0) {
        WizardryCharacterMaker.setName(WizardryController.inheritedName);
        WizardryController.inheritedName = "";
        this.state = WizardryConstants.MAKE_CHARACTER_RACE;
      }

      // reset screen state
      for (let prop in this._uiConfigurations) {
        this._uiConfigurations[prop].set();
      }
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryCharacterCreationScene };