import { WizardryScene }                                       from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE, FADE, WizardryUiConfiguration } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene }                                from "../../../wizardry-ui-state-scene.js";
import * as Materials                                          from "../../../../components/materials/materials.js";
import { WizardryAttribute, WizardryConstants, WizardryXgoto } from "../../../../config/wizardry-constants.js";
import { WizardryCharacterMaker }                              from "../../../../services/wizardry-character-maker.js";
import { WizardryController }                                  from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Name entry state of the Make Character scene.
 */
class WizardryMakeCharacterNameUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlocks used to display user entry text. */
    this._entryBlock;
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock;
    /** @private the name entered. */
    this._name = "";
    /** @private the BABYLON.GUI.TextBlock used to display the # of bonus points the character has. */
    this._pointBlock;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let stopProcessing = false;
    let char;
    switch (key) {
      case "Backspace":
        if (this._name.length > 0) {
          this._name = this._name.substring(0, this._name.length - 1);
        }
        break;
      case "Escape":
        this.prevScreen();
        stopProcessing = true;
        break;
      case "Enter":
        if (this._name.trim().length > 0) {
          WizardryCharacterMaker.setName(this._name);
          this._parent.state = WizardryConstants.MAKE_CHARACTER_RACE;
          stopProcessing = true;
        } else {
          this._parent.stopAnimation(this._messageBlock);
          this._messageBlock.text = "The name cannot be left blank.";
          this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          stopProcessing = true;
        }
        break;
      default:
        if (key.length === 1) {
          char = key.toUpperCase();
        }
        break;
    }
    if (!stopProcessing) {
      if (/^[a-z A-Z]+$/.test(char)) {
        if (this._name.length === 15) {
          this._name = this._name.substring(0, 14);
        }
        this._name = [this._name, char].join("");
      }
      this._entryBlock.text = this._name;
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    this._parent.createScreenOutline({
      name: [WizardryConstants.MAKE_CHARACTER_NAME, "_ui_frame"].join(""),
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
            { cell: [39, 4] }
          ]
        },
        {
          points: [
            { cell: [39, 4] },
            { cell: [0, 4] }
          ]
        },
        {
          points: [
            { cell: [0, 4] },
            { cell: [0, 0] }
          ]
        },
        /** ATTRIBUTES BORDER */
        {
          points: [
            { cell: [0, 13] },
            { cell: [39, 13] }
          ]
        },
        {
          points: [
            { cell: [39, 13] },
            { cell: [39, 4] }
          ]
        },
        {
          points: [
            { cell: [39, 4] },
            { cell: [0, 4] }
          ]
        },
        {
          points: [
            { cell: [0, 4] },
            { cell: [0, 13] }
          ]
        },
        /** ALIGNMENT/CLASS BORDER */
        {
          points: [
            { cell: [0, 13] },
            { cell: [39, 13] }
          ]
        },
        {
          points: [
            { cell: [39, 13] },
            { cell: [39, 16] }
          ]
        },
        {
          points: [
            { cell: [39, 16] },
            { cell: [0, 16] }
          ]
        },
        {
          points: [
            { cell: [0, 16] },
            { cell: [0, 13] }
          ]
        },
        {
          points: [
            { cell: [0, 19] },
            { cell: [39, 19] }
          ]
        },
        {
          points: [
            { cell: [0, 23] },
            { cell: [39, 23] }
          ]
        },
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
        3 / 24, // top
        1 / 24, // border
        8 / 24, // attributes area
        1 / 24, // border
        2 / 24, // align/race area
        1 / 24, // border
        7 / 24 // options
      ]
    });
    { // add the first 3 labels      
      let grid = WizardryScene.createGrid({
        columns: [
          9 / 38, // label
          1 / 38, // value
          28 / 38, // value
        ],
        rows: [
          1 / 3, // line
          1 / 3, // line
          1 / 3 // line
        ]
      });
      this._configuration.addControl(grid, 1, 1);

      grid.addControl(this._parent.createTextBlock({
        text: "NAME",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 0, 0);

      grid.addControl(this._parent.createTextBlock({
        text: "RACE",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 1, 0);

      grid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
          onPointerEnterObservable: [
            () => {
              // stop the fade animation and restore the alpha on the message block
              this._messageBlock.alpha = 1;
              this._parent.stopAnimation(this._messageBlock);
              this._messageBlock.text = "The number of BONUS points available to raise your characteristics. There is a 9% chance of having over 10 points, but <1% of having 20 or more.";
            }
          ],
          onPointerOutObservable: [
            () => {
              // clear the tooltip if it matches the selected tooltip text
              if (this._messageBlock.text === "The number of BONUS points available to raise your characteristics. There is a 9% chance of having over 10 points, but <1% of having 20 or more.") {
                this._messageBlock.text = "";
              }
            }
          ]
        },
        text: { text: "POINTS" }
      }).container, 2, 0);
      this._pointBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      grid.addControl(this._pointBlock, 2, 2);
    }
    { // add the next 6 labels   
      let grid = WizardryScene.createGrid({
        columns: [
          9 / 38, // label
          3 / 38, // minus button
          2 / 38, // value
          3 / 38, // plus button
          3 / 38, // indicator
          1 / 38, // spacer
          17 / 38, // class options
        ],
        rows: [
          1 / 8, // line
          1 / 8, // line
          1 / 8, // line
          1 / 8, // line
          1 / 8, // line
          1 / 8, // line
          1 / 8, // line
          1 / 8, // line
        ]
      });
      this._configuration.addControl(grid, 3, 1);

      let row = 0, attribute = WizardryAttribute.STRENGTH;
      { // STRENGTH
        const attr = attribute;
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = attr.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === attr.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);
      }
      row++;
      attribute = WizardryAttribute.IQ;
      { // IQ
        const attr = attribute;
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = attr.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === attr.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);
      }
      row++;
      attribute = WizardryAttribute.PIETY;
      { // PIETY
        const attr = attribute;
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = attr.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === attr.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);
      }
      row++;
      attribute = WizardryAttribute.VITALITY;
      { // VITALITY
        const attr = attribute;
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = attr.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === attr.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);
      }
      row++;
      attribute = WizardryAttribute.AGILITY;
      { // AGILITY
        const attr = attribute;
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = attr.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === attr.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);
      }
      row++;
      attribute = WizardryAttribute.LUCK;
      { // LUCK
        const attr = attribute;
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = attr.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text === attr.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);
      }
    }
    { // add the last 2 labels     
      let grid = WizardryScene.createGrid({
        columns: [
          9 / 38, // label
          29 / 38, // value
        ],
        rows: [
          1 / 2, // line
          1 / 2, // line
        ]
      });
      this._configuration.addControl(grid, 5, 1);

      grid.addControl(this._parent.createTextBlock({
        text: "ALIGNMENT",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 0, 0);
      grid.addControl(this._parent.createTextBlock({
        text: "CLASS",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 1, 0);
    }
    { // name prompt and entry

      let grid = WizardryScene.createGrid({
        columns: [],
        rows: [
          1 / 7, // line
          1 / 7, // line
          1 / 7, // line
          4 / 7, // line
        ]
      });
      this._configuration.addControl(grid, 7, 1);

      { // prompt and user entry field
        let subGrid = WizardryScene.createGrid({
          columns: [
            14 / 38,
            24 / 38
          ],
          rows: []
        });
        grid.addControl(subGrid, 0, 0);

        subGrid.addControl(this._parent.createTextBlock({
          text: "ENTER A NAME >",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        }), 0, 0);

        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        subGrid.addControl(panel, 0, 1);

        this._entryBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        panel.addControl(this._entryBlock);

        let o = WizardryScene.createBlinkingCursor();
        this._parent.stopAnimation(o.cursor);
        this._parent.beginDirectAnimation(
          o.cursor, //the target where the animation will take place
          [o.visible], // the list of animations to start
          0, // the initial frame
          10, // the final frame
          true // if you want animation to loop (off by default)
        );
        panel.addControl(o.cursor);
      }
      { // exit line
        grid.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [this.prevScreen],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: { text: "OR PRESS [ESC] FOR THE TRAINING GROUNDS" }
        }).container, 1, 0);
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
        grid.addControl(this._messageBlock, 3, 0);
      }
    }


    return this._configuration;
  }
  /**
   * Changes to the previous screen.
   */
  prevScreen() {
    WizardryController.xgoto = WizardryXgoto.XTRAININ;
    this._parent.exitScene();
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    this._pointBlock.text = WizardryCharacterMaker.pointsAvailable.toString();
    this._name = "";
    this._entryBlock.text = "";
  }
}

export { WizardryMakeCharacterNameUi };