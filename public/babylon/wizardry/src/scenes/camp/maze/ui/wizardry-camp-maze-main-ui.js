import { WizardryScene }           from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE }                           from "../../../wizardry-ui-configuration.js";
import { WizardryUiConfiguration } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene }    from "../../../wizardry-ui-state-scene.js";
import * as Materials              from "../../../../components/materials/materials.js";
import { WizardryPartyPanel}       from "../../../../components/ui/wizardry-party-panel.js";
import { DIV2,
  DIV4,
  DIV24,
  DIV38,
  DIV40,
  WizardryAttribute,
  WizardryCharacterStatus,
  WizardryConstants,
  WizardryXgoto }                  from "../../../../config/wizardry-constants.js";
import { WizardryController }      from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Main state of the Training scene.
 */
class WizardryCampMazeMainUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /**
     * the textBlock used to display messages.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._messageBlock;
    /**
     * the panel displaying party members.
     * @private
     * @type {WizardryPartyPanel}
     */
    this._partyPanel;
  }
  /**
   * Goes to the Inspection scene.
   * @param {String} refId the reference id of the character being inspected
   */
  activateCharacter(refId) {
    WizardryController.characterRecord = refId;
    WizardryController.xgoto = WizardryXgoto.XINSPCT3;
    WizardryController.xgoto2 = WizardryXgoto.XINSPCT2;
    if (!this.hasOwnProperty("_partyPanel")) {
      this.parent._partyPanel.resetHighlights();
      this.parent._parent.exitScene();
    } else {
      this._partyPanel.resetHighlights();
      this._parent.exitScene();
    }
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let validInput = true;
    switch (key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        const index = parseInt(key) - 1;
        if (index < WizardryController.characters.length) {
          this.activateCharacter(WizardryController.characters[index]);
        } else {
          validInput = false;
        }
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
    this._parent.createScreenOutline({
      name: [WizardryConstants.CAMP_MAZE_MAIN, "_ui_frame"].join(""),
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
        }, // END TITLE PANEL
        {
          points: [
            { cell: [0, 10] },
            { cell: [39, 10] }
          ]
        }, // END PARTY PANEL
        {
          points: [
            { cell: [0, 13] },
            { cell: [39, 13] }
          ]
        }, // END MENU PANEL
      ]
    });
    this.initializeConfiguration({
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        7 * DIV24, // 3 - party panel
        DIV24,     // border
        3 * DIV24, // 5 - menu
        DIV24,     // border
        9 * DIV24, // 7 - message block
      ]
    });
    this.configuration.addControl(this._parent.createTextBlock({ text: "CAMP" }), 1, 1);
    
    this._partyPanel = new WizardryPartyPanel({
      parent: this,
      isInteractive: true,
      callback: this.activateCharacter,
      noBuffer: true
    });
    this.configuration.addControl(this._partyPanel.container, 3, 1);
    
    { // menu
      this._menuGrid = WizardryScene.createGrid({
        columns: [8 * DIV38, 30 * DIV38],
        rows: [DIV4, DIV4, DIV4, DIV4]
      });
      this.configuration.addControl(this._menuGrid, 5, 1);

      this._menuGrid.addControl(this._parent.createTextBlock({
        text: "YOU MAY ",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT,
        textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
      }), 0, 0);

      const panel1 = new BABYLON.GUI.StackPanel();
      panel1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel1.isVertical = false;
      this._menuGrid.addControl(panel1, 0, 1);

      panel1.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.reorder(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "R)EORDER",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);
      panel1.addControl(this._parent.createTextBlock({ text: ", " }));

      panel1.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.equip(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "E)QUIP",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);
      panel1.addControl(this._parent.createTextBlock({ text: ", " }));

      panel1.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.disband(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "D)ISBAND",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);
      panel1.addControl(this._parent.createTextBlock({ text: "," }));

      const panel2 = new BABYLON.GUI.StackPanel();
      panel2.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel2.isVertical = false;
      this._menuGrid.addControl(panel2, 1, 1);

      panel2.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerEnterObservable: [
            () => {
              this._messageBlock.alpha = 1;
              this._parent.stopAnimation(this._messageBlock);
              this._messageBlock.text = ["Press any valid player # (1-", WizardryController.characters.length, ") or click their row to inspect that player."].join("");
            }
          ],
          onPointerOutObservable: [
            () => {
              // clear the tooltip if it matches the selected tooltip text
              if (this._messageBlock.text === ["Press any valid player # (1-", WizardryController.characters.length, ") or click their row to inspect that player."].join("")) {
                this._messageBlock.text = "";
              }
            }
          ]
        },
        text: { text: "#) TO INSPECT, OR" }
      }).container);

      const panel3 = new BABYLON.GUI.StackPanel();
      panel3.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel3.isVertical = false;
      this._menuGrid.addControl(panel3, 2, 1);

      panel3.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.leaveCamp(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "L)EAVE THE CAMP",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);
      panel3.addControl(this._parent.createTextBlock({ text: "." }));     
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
      this.configuration.addControl(this._messageBlock, 7, 1);
    }

    return this.configuration;
  }
  leave() {    
    WizardryController.xgoto = WizardryController.xgoto2;
    this._parent.exitScene();
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    if (WizardryController.globalVariables.getBooleanValue("enterMaze")) {
      const charRefIds = WizardryController.characters;
      for (let i = 0, li = charRefIds.length; i < li; i++) {
        WizardryController.equipCharacter(WizardryController.rosterInstance.getCharacterRecord(charRefIds[i]), true);
      }
    }
    this._partyPanel.set();
  }
}

export { WizardryCampMazeMainUi };