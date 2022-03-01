import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE }                        from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryConstants,
  WizardryCharacterStatus,
  WizardryXgoto }               from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/** the menu options. */
const OPTIONS = [
  {
    text: "[A] THE STABLES (FREE!)",
    action: function() { this.nap(WizardryConstants.INN_ROOM_STABLES); },
    tooltip: "Rest overnight in the stables to regain spells, but no hit points."
  },
  {
    text: "[B] COTS. 10 GP/WEEK.",
    action: function() { this.nap(WizardryConstants.INN_ROOM_COTS); },
    tooltip: "Rent this room to regain spells and an insignificant amount of hit points."
  },
  {
    text: "[C] ECONOMY ROOMS. 50 GP/WEEK.",
    action: function() { this.nap(WizardryConstants.INN_ROOM_ECONOMY); },
    tooltip: "Rent this room to regain spells and an modest amount of hit points."
  },
  {
    text: "[D] MERCHANT SUITES. 200 GP/WEEK.",
    action: function() { this.nap(WizardryConstants.INN_ROOM_MERCHANT); },
    tooltip: "Rent this room to regain spells and an significant amount of hit points."
  },
  {
    text: "[E] ROYAL SUITES. 500 GP/WEEK.",
    action: function() { this.nap(WizardryConstants.INN_ROOM_ROYAL); },
    tooltip: "Rent this room to regain spells and an substantial amount of hit points."
  },
  {
    text: "    OR [ENTER] TO LEAVE",
    action: function() { this.exit(); },
    tooltip: "Return to the lobby and let another character rest."
  },
];
/**
 * @class Ui class for the Player Menu state of the Shop scene.
 */
class WizardryInnPlayerUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryBoltacPlayerUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlock displaying the welcome header. */
    this._welcomeBlock = null;
  }
  /**
   * Exits the player menu.
   */
  exit() {
    WizardryController.characterRecord = "";
    this._parent.state = WizardryConstants.INN_MAIN;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let validInput = true;
    switch (key.toUpperCase()) {
      case "ESCAPE":
      case "ENTER":
        this.exit();
        break;
      case "A":
        this.nap(WizardryConstants.INN_ROOM_STABLES);
        break;
      case "B":
        this.nap(WizardryConstants.INN_ROOM_COTS);
        break;
      case "C":
        this.nap(WizardryConstants.INN_ROOM_ECONOMY);
        break;
      case "D":
        this.nap(WizardryConstants.INN_ROOM_MERCHANT);
        break;
      case "E":
        this.nap(WizardryConstants.INN_ROOM_ROYAL);
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
  init() {
    // do not call base class initialization
    // super.init();
    
    this._configuration = WizardryScene.createGrid({
      columns: [
        1 / 40, // left border
        38 / 40, // main area
        1 / 40 // right border
      ],
      rows: [
        1 / 24, // 0 - border
        1 / 24, // 1 - title
        1 / 24, // 2 - border
        8 / 24, // 3 - party area
        1 / 24, // 4 - border
        8 / 24, // 5 - menu
        1 / 24, // 6 - border
        3 / 24, // 7 - messages
      ]
    });

    this._parent.createScreenOutline({
      name: [WizardryConstants.INN_PLAYER_MENU, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: [
        /** HEADER BORDER */
        {
          points: [
            { cell: [0, 0] },
            { cell: [39, 0] }
          ]
        },
        {
          points: [
            { cell: [39, 0] },
            { cell: [39, 2] }
          ]
        },
        {
          points: [
            { cell: [39, 2] },
            { cell: [0, 2] }
          ]
        },
        {
          points: [
            { cell: [0, 2] },
            { cell: [0, 0] }
          ]
        },
        /** END HEADER / START PARTY BORDER */
        {
          points: [
            { cell: [0, 11] },
            { cell: [39, 11] }
          ]
        },
        /** END PARTY BORDER /  START MENU BORDER */
        {
          points: [
            { cell: [0, 20] },
            { cell: [39, 20] }
          ]
        }
        /** END MENU BORDER */ 
      ]
    });
    { // add the title and subtitle
      let titleGrid = WizardryScene.createGrid({
        columns: [
          1 / 2, // column
          1 / 2 // column
        ],
        rows: []
      });
      this._configuration.addControl(titleGrid, 1, 1);
      { // create the title text
        let text = this._parent.createTextBlock({
          key: "TITLE",
          text: " CASTLE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        titleGrid.addControl(text, 0, 0); // row, column
      }
      { // create the subtitle text
        this._subTitleTextBlock = this._parent.createTextBlock({
          key: "SUBTITLE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
        titleGrid.addControl(this._subTitleTextBlock, 0, 1); // row, column
      }
    }
    { // add current party header
      this._configuration.addControl(this._parent.createButton({
        background: { },
        text: {
          text: "CURRENT PARTY",
          paddingLeft: 4,
          paddingRight: 4
        }
      }).container, 2, 1);
    }
    { // add party display
      super.createPartyGrid();
    }
    { // menu
      let grid = WizardryScene.createGrid({
        rows: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8]
      });
      this._configuration.addControl(grid, 5, 1);
      { // welcome header
        this._welcomeBlock = this._parent.createTextBlock();
        grid.addControl(this._welcomeBlock, 0, 0);
      }
      // options
      for (let i = 0, li = OPTIONS.length; i < li; i++) {
        grid.addControl(this._parent.createButton({
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
        }).container, i + 2, 0);
      }
    }
    { // message block
      this._messageBlock = this._parent.createTextBlock({
        lineSpacing: "3px",
        textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
        resizeToFit: false,
        textWrapping: true,
      });
      if (typeof(this._messageBlock.animations) === "undefined") {
        this._messageBlock.animations = [];
      }
      this._messageBlock.animations.push(FADE);
      this._configuration.addControl(this._messageBlock, 7, 1);
    }

    return this._configuration;
  }
  /**
   * Take a nap.
   * @param {Number} room the type of room selected
   */
  nap(room) {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    let min = 0;
    switch (room) {
      case WizardryConstants.INN_ROOM_COTS:
        min = 10;
        break;
      case WizardryConstants.INN_ROOM_ECONOMY:
        min = 50;
        break;
      case WizardryConstants.INN_ROOM_MERCHANT:
        min = 200;
        break;
      case WizardryConstants.INN_ROOM_ROYAL:
        min = 500;
        break;
    }
    if (character.gold < min) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "You can't afford that. Try downsizing.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      this._parent.state = WizardryConstants.INN_NAP_MENU;
      this._parent.room = room;
    }
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    this._subTitleTextBlock.text = "INN ";
    if (typeof(character) !== "undefined") {
      this._welcomeBlock.text = ["WELCOME ", character.name, " . WE HAVE:"].join("");
    }
  }
}

export { WizardryInnPlayerUi };