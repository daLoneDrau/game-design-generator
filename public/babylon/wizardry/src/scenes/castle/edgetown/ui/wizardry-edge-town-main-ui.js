import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { WizardryScene }        from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryConstants,
  WizardryXgoto }               from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/** the menu options. */
const OPTIONS = [
  {
    text: "ENTER THE M)AZE,",
    action: function() { this.goToMaze(); },
    tooltip: "Venture into the Maze."
  },
  {
    text: "GO TO THE T)RAINING GROUNDS,",
    action: function() { this.goToTrainingGrounds(); },
    tooltip: "The Training Grounds allow you to create a new character and prepare them for use."
  },
  {
    text: "RETURN TO THE C)ASTLE,",
    action: function() { this.goToCastle(); },
    tooltip: "Go back to the marketplace of the castle where you can go anywhere else."
  },
  {
    text: "OR L)EAVE THE GAME.",
    action: function() { this.goToTempleOfCant(); },
    tooltip: "Go back to the marketplace of the castle where you can go anywhere else."
  }
];
/**
 * @class Ui class for the Main state of the Edge of Town scene.
 */
class WizardryEdgeTownMainUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryEdgeTownMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the list of BABYLON.GUI.Containers containing the menu options. */
    this._options = [];
    /** @private the list of BABYLON.GUI.Grid containing the menu buttons. */
    this._optionsGrid = [];
  }
  /**
   * Goes to the Market.
   */
  goToCastle() {
    WizardryController.xgoto = WizardryXgoto.XCASTLE;
    this._parent.exitScene();
  }
  /**
   * Goes to the Maze.
   */
  goToMaze() {
    if (WizardryController.partyCnt > 0) {
      // set the maze flag B4 switching the state
      this._parent.isEnteringMaze = true;
      this._parent.state = WizardryConstants.EDGE_TOWN_MAZE;
    } else {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Goes to the Training Grounds.
   */
  goToTrainingGrounds() {
    this.updateCharacters();
    WizardryController.xgoto = WizardryXgoto.XTRAININ;
    this._parent.exitScene();
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let validInput = true;
    switch (key.toUpperCase()) {
      case "M":
        if (WizardryController.partyCnt > 0) {
          this.goToMaze();
        } else {
          validInput = false;
        }
        break;
      case "T":
        this.goToTrainingGrounds();
        break;
      case "C":
      case "ENTER":
      case "ESCAPE":
        this.goToCastle();
        break;
      case "L":
        this.leaveGame();
        break;
      default:
        validInput = false;
        break;
    }
    if (!validInput) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    super.init();
    this._parent.createScreenOutline({
      name: [WizardryConstants.EDGE_TOWN_MAIN, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: this._screenLines
    });

    let twoColumnGrid = WizardryScene.createGrid({
      columns: [8 / 38, 30 / 38]
    });
    this._configuration.addControl(twoColumnGrid, 5, 1);

    { // prompt
      let grid = WizardryScene.createGrid({
        rows: [1 / 7, 6 / 7]
      });
      twoColumnGrid.addControl(grid, 0, 0);

      grid.addControl(this._parent.createTextBlock({
        text: "YOU MAY ",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      }), 0, 0); // row, column
    }
    { // options
      this._optionsGrid = WizardryScene.createGrid({
        rows: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7]
      });
      twoColumnGrid.addControl(this._optionsGrid, 0, 1);

      for (let i = 0, li = OPTIONS.length; i < li; i++) {
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [
              OPTIONS[i].action, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageTextBlock);
                this._messageBlock.text = OPTIONS[i].tooltip;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === OPTIONS[i].tooltip) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: OPTIONS[i].text }
        }).container;
        this._options.push(button);
      }
    }

    return this._configuration;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    this._subTitleTextBlock.text = "EXIT ";
    
    const children = this._optionsGrid.children;
    for (let i = children.length - 1; i >= 0; i--) {
      this._optionsGrid.removeControl(children[i]);
    }
    let row = 0;
    if (WizardryController.partyCnt > 0) {
      this._optionsGrid.addControl(this._options[0], row++, 0);
    }
    this._optionsGrid.addControl(this._options[1], row++, 0);
    this._optionsGrid.addControl(this._options[2], row++, 0);
    this._optionsGrid.addControl(this._options[3], row++, 0);
  }
  /**
   * Updates all characters, saving them to the database. Afterwards the party is emptied.
   */
  updateCharacters() {
    // iterate through all characters and save the roster.
    for (let i = WizardryController.characters.length - 1; i >= 0; i--) {
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characters[i]);
      character.inMaze = false;
    }
    if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
      WizardryController.rosterInstance.updateRoster();
    }
    // reset the party count
    WizardryController.partyCnt = 0;
    WizardryController.characters.length = 0;
  }
}

export { WizardryEdgeTownMainUi };