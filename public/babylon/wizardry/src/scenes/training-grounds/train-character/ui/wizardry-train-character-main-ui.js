import { KEYBOARD_ENTRY_DELAY } from "../../../wizardry-scene.js";
import { WizardryScene } from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { FADE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiConfiguration } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import { WizardryConstants } from "../../../../config/wizardry-constants.js";
import { WizardryXgoto } from "../../../../config/wizardry-constants.js";
import { WizardryController } from "../../../../services/wizardry-controller.js";
import * as Materials from "../../../../components/materials/materials.js";

/**
 * @class Ui class for the Main state of the Training scene.
 */
class WizardryTrainingMainUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the callback function to process after displaying the user entry prompt. */
    this._callback = null;
    /** @private the BABYLON.GUI.TextBlock used to display the character. */
    this._characterBlock;
    /** @private the container dispaying the class change button. */
    this._classChangeButton;
    /** @private the cursor displayed. */
    this._cursor;
    /** @private the BABYLON.GUI.TextBlocks used to display user entry text. */
    this._entryBlock;
    /** @private the list of BABYLON.GUI.StackPanel used to display user entry. */
    this._entryPanel;
    /** @private the BABYLON.GUI.TextBlocks used to display user entry prompt. */
    this._entryPromptBlock;
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock;
  }
  /**
   * Completes the action to delete a character
   * @param {boolean} commit if the true, the action is followed through; otherwise the action is ignored
   */
  deleteCharacter(commit) {
    this._entryBlock.text = commit ? "YES" : "NO";
    BABYLON.setAndStartTimer({
      timeout: KEYBOARD_ENTRY_DELAY,
      contextObservable: this._parent.onBeforeRenderObservable,
      breakCondition: () => {
        // this will check if we need to break before the timeout has reached
        return this._parent.isDisposed;
      },
      onEnded: (data) => {
        // this will run when the timeout has passed
        this._entryBlock.text = "";
        this._entryPanel.isVisible = false;
        this._entryPromptBlock.isVisible = false;
        if (commit) {
          WizardryController.rosterInstance.removeFromRoster(WizardryController.characterRecord);
          WizardryController.characterRecord = "";
          WizardryController.xgoto = WizardryXgoto.XTRAININ;
          this._parent.exitScene();
        }
      },
      onTick: (data) => {
        // this will run
      },
      onAborted: (data) => {
        // this function will run when the break condition has met (premature ending)
      },
    });
  }
  /**
   * Goes to the Inspection Scene.
   */
  goToInspect3() {
    WizardryController.xgoto = WizardryXgoto.XINSPCT3;
    WizardryController.xgoto2 = WizardryXgoto.XTRAINCHAR;
    this._parent.exitScene();
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let stopProcessing = true;
    switch (key) {
      case "Escape":
        WizardryController.xgoto = WizardryXgoto.XTRAININ;
        this._parent.exitScene();
        break;
      case "C":
      case "c":
        this._parent.state = WizardryConstants.TRAIN_CHARACTER_CHANGE_CLASS;
        break;
      case "D":
      case "d":
        this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO DELETE";
        this._entryPanel.isVisible = true;
        this._entryPromptBlock.isVisible = true;
        this._callback = this.deleteCharacter;
        break;
      case "I":
      case "i":
        this.goToInspect3();
        break;
      case "R":
      case "r":
        this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO REROLL";
        this._entryPanel.isVisible = true;
        this._entryPromptBlock.isVisible = true;
        this._callback = this.rerollCharacter;
        break;
      case "Y":
      case "y":
        if (this._entryPanel.isVisible){
          this._callback(true);
        } else {
          stopProcessing = false;
        }
        break;
      case "N":
      case "n":
        if (this._entryPanel.isVisible){
          this._callback(false);
        } else {
          stopProcessing = false;
        }
        break;
      default:
        stopProcessing = false;
        break;
    }
    if (!stopProcessing) {
      console.log("huh")
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    this._parent.createScreenOutline({
      name: [WizardryConstants.TRAIN_CHARACTER_MAIN, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: [
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
        {
          points: [
            { cell: [0, 11] },
            { cell: [39, 11] }
          ]
        },
      ]
    });
    this._configuration = WizardryScene.createGrid({
      columns: [
        1 / 40, // left border
        38 / 40, // main area
        1 / 40 // right border
      ],
      rows: [
        1 / 24, // border
        1 / 24, // character info
        1 / 24, // border
        8 / 24, // menu
        1 / 24, // border
        12 / 24 // empty
      ]
    });
    this._characterBlock = this._parent.createTextBlock();
    this._configuration.addControl(this._characterBlock, 1, 1);

    { // main menu
      let menuGrid = WizardryScene.createGrid({
        rows: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1/ 8, 1 / 8]
      });
      this._configuration.addControl(menuGrid, 3, 1);

      let row = 0
      menuGrid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.goToInspect3(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "YOU MAY I)NSPECT THIS CHARACTER,",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, row++, 1);

      menuGrid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => {
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO DELETE";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._callback = this.deleteCharacter;
          }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "D)ELETE THIS CHARACTER,",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, row++, 1);

      menuGrid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => {            
            this._entryPromptBlock.text = "ARE YOU SURE YOU WANT TO REROLL";
            this._entryPanel.isVisible = true;
            this._entryPromptBlock.isVisible = true;
            this._callback = this.rerollCharacter;
          }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "R)EROLL THIS CHARACTER,",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, row++, 1);

      menuGrid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this._parent.state = WizardryConstants.TRAIN_CHARACTER_CHANGE_CLASS; }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "C)HANGE THIS CHARACTER'S CLASS,",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, row++, 1);

      menuGrid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => {
            WizardryController.xgoto = WizardryXgoto.XTRAININ;
            this._parent.exitScene();
          }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "OR PRESS [ESC] TO LEAVE",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, row++, 1);
      row++;
      { // user entry prompt and cursor
        // prompt displayed to user
        this._entryPromptBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        this._entryPromptBlock.isVisible = false;
        menuGrid.addControl(this._entryPromptBlock, row++, 1);
        // stack panel to hold all items
        this._entryPanel = new BABYLON.GUI.StackPanel();
        this._entryPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this._entryPanel.isVertical = false;
        menuGrid.addControl(this._entryPanel, row++, 1);
        this._entryPanel.addControl(this._parent.createTextBlock({ text: "                ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
        // Y button
        this._entryPanel.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this._callback(true); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[Y]",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);
        // spacer
        this._entryPanel.addControl(this._parent.createTextBlock({ text: "/", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
        // N button
        this._entryPanel.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this._callback(false); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "[N]",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);
        // question mark
        this._entryPanel.addControl(this._parent.createTextBlock({ text: "? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
        // user entry
        this._entryBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        this._entryPanel.addControl(this._entryBlock);
        // cursor
        let o = WizardryScene.createBlinkingCursor();
        this._entryPanel.addControl(o.cursor);
        this._parent.beginDirectAnimation(
          o.cursor, //the target where the animation will take place
          [o.visible], // the list of animations to start
          0, // the initial frame
          ALPHA_FADE_FRAMERATE, // the final frame
          true // if you want animation to loop (off by default)
        );

        this._entryPanel.isVisible = false;
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
      this._configuration.addControl(this._messageBlock, 5, 1);
    }

    return this._configuration;
  }
  /**
   * Completes the action to reroll a character
   * @param {boolean} commit if the true, the action is followed through; otherwise the action is ignored
   */
  rerollCharacter(commit) {
    this._entryBlock.text = commit ? "YES" : "NO";
    BABYLON.setAndStartTimer({
      timeout: KEYBOARD_ENTRY_DELAY,
      contextObservable: this._parent.onBeforeRenderObservable,
      breakCondition: () => {
        // this will check if we need to break before the timeout has reached
        return this._parent.isDisposed;
      },
      onEnded: (data) => {
        // this will run when the timeout has passed
        this._entryBlock.text = "";
        this._entryPanel.isVisible = false;
        this._entryPromptBlock.isVisible = false;
        if (commit) {
          // get the name before destroying the character
          let name = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord).name;
          WizardryController.rosterInstance.removeFromRoster(WizardryController.characterRecord);
          WizardryController.characterRecord = "";
          // reset the name
          WizardryController.inheritedName = name;
          // change the state
          WizardryController.xgoto = WizardryXgoto.XMAKECHAR;
          // tell the parent to exit
          this._parent.exitScene();
        }
      },
      onTick: (data) => {
        // this will run
      },
      onAborted: (data) => {
        // this function will run when the break condition has met (premature ending)
      },
    });
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    this._characterBlock.text = [
      character.name,
      " LEVEL ",
      character.charLev,
      " ",
      character.race.title, 
      " ",
      character.clazz.title,
      " (",
      character.status.title,
      ")"
    ].join("");
  }
}

export { WizardryTrainingMainUi };