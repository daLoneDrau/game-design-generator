import { WizardryScene }        from "../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE,
  WizardryUiConfiguration }     from "../../wizardry-ui-configuration.js";
import * as Materials           from "../../../components/materials/materials.js";
import { WizardryConstants,
  WizardryXgoto }               from "../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Main state of the Training Grounds scene.
 */
class WizardryTrainingGroundsMainUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingGroundsMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock = null;
    /** @private the roster pagination. */
    this._pagination = 0;
    /** @private the BABYLON.GUI.Container parent for the roster display widgets. */
    this._rosterGrid;
  }
  /**
   * Displays the character roster.
   */
  displayRoster() {
    // remove old children
    let children = this._rosterGrid.children;
    for (let i = children.length - 1; i >= 0; i--) {
      this._rosterGrid.removeControl(children[i]);
      if (typeof(children[i]) !== "undefined") {
        children[i].dispose();
      }
    }
    // update the display
    const roster = WizardryController.roster;
    for (let i = 0, li = 10; i < li; i++) {
      const character = roster[i + this._pagination * 10];
      if (typeof(character) !== "undefined") {
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.inspectCharacter(character.refId); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: [
              (i + 1) % 10,
              ") ",
              character.name,
              " LEVEL ",
              character.charLev,
              " ",
              character.race.title, 
              " ",
              character.clazz.title,
              " (",
              character.status.title,
              ")",
              character.inMaze || character.lostXyl.location[0] !== 0 ? " OUT" : ""
            ].join(""),
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        });
        // set the font family since this control is dynamic and won't be created during UI initialization
        button.text.fontFamily = "C64ProMono";
        this._rosterGrid.addControl(button.container, i, 0);
      }
      if (i + this._pagination * 10 + 1 >= roster.length) {
        break;
      }
    }
    if (roster.length > 10) {
      if (this._pagination === 0) {
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [
              () => {
                this._pagination = 1;
                this.displayRoster();
              }
            ],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: { text: "FORWARD ->" }
        });
        button.text.fontFamily = "C64ProMono";
        this._rosterGrid.addControl(button.container, 10, 0);
      } else {
        let button = this._parent.createButton({
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT,
          background: {
            onPointerClickObservable: [
              () => {
                this._pagination = 0;
                this.displayRoster();
              }
            ],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: { text: "<- BACK" }
        });
        button.text.fontFamily = "C64ProMono";
        this._rosterGrid.addControl(button.container, 10, 0);
      }
    }
  }  
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let stopProcessing = true;
    switch (key) {
      case "m":
      case "M":
        this.goToMaze();
        break;
      case "t":
      case "T":
        this.goToTrainingGrounds();
        break;
      case "c":
      case "C":
        this.goToCastle();
        break;
      case "l":
      case "L":
        this.leaveGame();
        break;
      default:
        stopProcessing = false;
        break;
    }
    if (!stopProcessing) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Goes to the Market.
   */
  goToCastle() {
    WizardryController.xgoto = WizardryXgoto.XCASTLE;
    this._parent.exitScene();
  }
  /**
   * Goes to Character Creation.
   */
  goToCharacterCreation() {
    WizardryController.xgoto = WizardryXgoto.XMAKECHAR;
    this._parent.exitScene();
  }
  /**
   * Handles key entry when the menu is displayed.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let stopProcessing = false;
    let message = "Huh?";
    const roster = WizardryController.roster;
    switch (key) {
      case "a":
      case "A":
        if (roster.length < 20) {
          this.goToCharacterCreation();
        } else {
          stopProcessing = true;
          message = "Too many characters. You'll need to delete someone first."
        }
        break;
      case "Escape":
        this.goToCastle();
        break;
      case "ArrowRight":
        if (this._pagination === 0 && roster.length > 10) {
          this._pagination = 1;
          this.displayRoster();
        } else {
          stopProcessing = true;
        }
        break;
      case "ArrowLeft":
        if (this._pagination === 1 && roster.length > 10) {
          this._pagination = 0;
          this.displayRoster();
        } else {
          stopProcessing = true;
        }
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        let num = key === "0" ? 9 : parseInt(key) - 1;
        num += this._pagination * 10;
        stopProcessing = true;
        if (num < roster.length) {
          this.inspectCharacter(roster[num].refId);
        } else {
          stopProcessing = true;
        }
        break;
      default:
        stopProcessing = true;
        break;
    }
    if (stopProcessing) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.alpha = 1;
      this._messageBlock.text = message;
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    super.init();
    this._parent.createScreenOutline({
      name: [WizardryConstants.TRAINING_GROUNDS_MAIN, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: [
        /** TOP PANEL */
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
        /** ROSTER BOTTOM BORDER */
        {
          points: [
            { cell: [0, 14] },
            { cell: [39, 14] }
          ]
        },
        /** OPTIONS BOTTOM BORDER */
        {
          points: [
            { cell: [0, 18] },
            { cell: [39, 18] }
          ]
        }
      ]
    });
    this._configuration = WizardryScene.createGrid({
      columns: [
        1 / 40, // border
        38 / 40, // game area
        1 / 40, // border
      ],
      rows: [
        1 / 24, // border
        1 / 24, // title
        1 / 24, // border
        11 / 24, // roster area
        1 / 24, // border
        3 / 24, // options area
        1 / 24, // border
        5 / 24 // messages
      ]
    });
    { // add the title
      this._configuration.addControl(this._parent.createTextBlock({
        key: "TITLE",
        text: "TRAINING GROUNDS"
      }), 1, 1);
    }
    { // add messages display - JESUS this took too much experimenting to find the right way to style this text
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
    { // add options display
      let optionsGrid = WizardryScene.createGrid({
        columns: [8 / 38, 30 / 38],
        rows: [1 / 3, 1 / 3, 1 / 3]
      });
      this._configuration.addControl(optionsGrid, 5, 1);

      { // add the intro
        optionsGrid.addControl(this._parent.createTextBlock({
          text: "YOU MAY ",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        }), 0, 0); // row, column
      }
      { // add button
        optionsGrid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.goToCharacterCreation(); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageTextBlock);
                this._messageBlock.text = "Press 'N' to add a new character. Up to 20 characters can be created.";
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === "Press 'N' to add a new character. Up to 20 characters can be created.") {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: "A)DD A NEW CHARACTER" }
        }).container, 0, 1); // row, column
      }
      { // inspect button
        optionsGrid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageTextBlock);
                this._messageBlock.text = "Press any valid player # (1-0) or click their row to inspect or edit that player.";
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === "Press any valid player # (1-0) or click their row to inspect or edit that player.") {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: "#) INSPECT OR EDIT," }
        }).container, 1, 1); // row, column
      }
      { // back button
        optionsGrid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.goToCastle(); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageTextBlock);
                this._messageBlock.text = "Go back to the marketplace of the castle where you can go anywhere else.";
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === "Go back to the marketplace of the castle where you can go anywhere else.") {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: "OR PRESS [ESC] FOR CASTLE" }
        }).container, 2, 1); // row, column
      }
    }
    { // add the roster display
      this._rosterGrid = WizardryScene.createGrid({
        rows: [1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11, 1 / 11]
      });
      this._configuration.addControl(this._rosterGrid, 3, 1);
    }

    return this._configuration;
  }
  inspectCharacter(refId) {
    WizardryController.characterRecord = refId;
    WizardryController.xgoto = WizardryXgoto.XTRAINCHAR;
    this._parent.exitScene();
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    this._pagination = 0;
    this.displayRoster();
    this._messageBlock.text = "";
  }
}

export { WizardryTrainingGroundsMainUi };