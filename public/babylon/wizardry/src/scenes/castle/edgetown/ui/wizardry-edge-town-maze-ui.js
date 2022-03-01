import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { WizardryScene }        from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryConstants,
  WizardryXgoto }               from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Maze state of the Edge of Town scene.
 */
class WizardryEdgeTownMazeUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryEdgeTownMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
  }
  /**
   * Initalizes the view.
   */
  init() {
    super.init();
    this._parent.createScreenOutline({
      name: [WizardryConstants.EDGE_TOWN_MAZE, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: this._screenLines
    });

    let twoRowGrid = WizardryScene.createGrid({
      rows: [1 / 7, 1 / 7, 5 / 7]
    });
    this._configuration.addControl(twoRowGrid, 5, 1);

    twoRowGrid.addControl(this._parent.createTextBlock({ text: "ENTERING"}), 0, 0);
    // TODO - load scenario name
    twoRowGrid.addControl(this._parent.createTextBlock({ text: "PROVING GROUNDS OF THE MAD OVERLORD"}), 1, 0);

    return this._configuration;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    this._subTitleTextBlock.text = "EXIT ";
    
    let tmpParent = null;
    if (!this.hasOwnProperty("_partyPanel")) {
      tmpParent = this.parent;
    } else {
      tmpParent = this;
    }
    const PARENT_OBJECT = tmpParent;
    if (PARENT_OBJECT._parent.isEnteringMaze) {
      /** set the action taken */
      const action = () => {
        PARENT_OBJECT._parent.isEnteringMaze = false;
        PARENT_OBJECT._parent.state = WizardryConstants.EDGE_TOWN_MAIN;
        // TODO - save the game
        WizardryController.mazeX = 0;
        WizardryController.mazeY = 0;
        WizardryController.mazeLev = -1;
        WizardryController.directIo = 0;
        WizardryController.newMaze();
        PARENT_OBJECT._parent.exitScene();
      };
      if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
        action();
      } else {
        BABYLON.setAndStartTimer({
          timeout: 2000,
          contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
          breakCondition: () => {
            // this will check if we need to break before the timeout has reached
            return PARENT_OBJECT._parent.isDisposed;
          },
          onEnded: (data) => {
            // this will run when the timeout has passed
            action();
          },
          onTick: (data) => {
            // this will run
          },
          onAborted: (data) => {
            // this function will run when the break condition has met (premature ending)
          },
        });
      }
    }

  }
}

export { WizardryEdgeTownMazeUi };