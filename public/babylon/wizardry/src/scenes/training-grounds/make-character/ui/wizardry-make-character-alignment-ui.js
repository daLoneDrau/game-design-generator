import { WizardryScene }          from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE, 
  FADE,
  WizardryUiConfiguration }       from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene }   from "../../../wizardry-ui-state-scene.js";
import * as Materials             from "../../../../components/materials/materials.js";
import { WizardryAlignment,
  WizardryAttribute,
  WizardryConstants }             from "../../../../config/wizardry-constants.js";
import { WizardryCharacterMaker } from "../../../../services/wizardry-character-maker.js";

/**
 * @class Ui class for the Alignment entry state of the Make Character scene.
 */
class WizardryMakeCharacterAlignmentUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlocks used to display user entry text. */
    this._entryBlock = null;
    /** @private a flag indicating whether the UI is waiting for a timer to finish. When in wait mode */
    this._inWait = false;
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock = null;
    /** @private the name entered. */
    this._name = "";
    /** @private the BABYLON.GUI.TextBlock used to display the character's name. */
    this._nameBlock;
    /** @private the BABYLON.GUI.TextBlock used to display the # of bonus points the character has. */
    this._pointBlock = null;
    /** @private the BABYLON.GUI.TextBlock used to display the character's race. */
    this._raceBlock = null;
  }
  /**
   * Chooses a character's alignment.
   * @param {string} letter the letter of the selection
   * @param {WizardryAlignment} alignment the alignment chosen
   */
  chooseAlignment(letter, alignment) {
    if (!this._inWait) {
      this._inWait = true;
      this._entryBlock.text = [letter, alignment.title].join(") ");
      WizardryCharacterMaker.setAlignment(alignment);
      BABYLON.setAndStartTimer({
        timeout: WizardryConstants.KEYBOARD_ENTRY_DELAY,
        contextObservable: this._parent.onBeforeRenderObservable,
        breakCondition: () => {
          // this will check if we need to break before the timeout has reached
          return this._parent.isDisposed;
        },
        onEnded: (data) => {
          // this will run when the timeout has passed
          this._parent.state = WizardryConstants.MAKE_CHARACTER_POINTS;
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
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    if (!this._inWait) {
      let stopProcessing = true;
      switch (key.toUpperCase()) {
        case "A":
          this.chooseAlignment(key.toUpperCase(), WizardryAlignment.GOOD);
          break;
        case "B":
          this.chooseAlignment(key.toUpperCase(), WizardryAlignment.NEUTRAL);
          break;
        case "C":
          this.chooseAlignment(key.toUpperCase(), WizardryAlignment.EVIL);
          break;
        case "ESCAPE":
          this.prevScreen();
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
  }
  /**
   * Initalizes the view.
   */
  init() {
    this._parent.createScreenOutline({
      name: [WizardryConstants.MAKE_CHARACTER_ALIGNMENT, "_ui_frame"].join(""),
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
            { cell: [10, 19] },
            { cell: [39, 19] }
          ]
        },
        {
          points: [
            { cell: [10, 19] },
            { cell: [10, 24] }
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
          1 / 38, // spacer
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

      this._nameBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      grid.addControl(this._nameBlock, 0, 2);

      grid.addControl(this._parent.createTextBlock({
        text: "RACE",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 1, 0);

      this._raceBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      grid.addControl(this._raceBlock, 1, 2);

      grid.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
          onPointerEnterObservable: [
            () => {
              // stop the fade animation and restore the alpha on the message block
              this._messageBlock.alpha = 1;
              this._parent.stopAnimation(this._messageBlock);
              this._messageBlock.text = "The number of BONUS points available to raise characteristics. There is a 9% chance of having over 10 points, but <1% of having 20 or more.";
            }
          ],
          onPointerOutObservable: [
            () => {
              // clear the tooltip if it matches the selected tooltip text
              if (this._messageBlock.text === "The number of BONUS points available to raise characteristics. There is a 9% chance of having over 10 points, but <1% of having 20 or more.") {
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
    { // alignment options/messages
      let grid = WizardryScene.createGrid({
        columns: [],
        rows: [
          1 / 7, // line
          1 / 7, // line
          5 / 7, // lines
        ]
      });
      this._configuration.addControl(grid, 7, 1);

      { // prompt and user entry field
        let subGrid = WizardryScene.createGrid({
          columns: [
            21 / 38,
            17 / 38
          ],
          rows: []
        });
        grid.addControl(subGrid, 0, 0);

        subGrid.addControl(this._parent.createTextBlock({
          text: "CHOOSE AN ALIGNMENT >",
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
            onPointerClickObservable: [() => { this.prevScreen(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: { text: "OR PRESS [ESC] TO CHANGE YOUR RACE" }
        }).container, 1, 0);
      }
      { // options and messages
        let subGrid = WizardryScene.createGrid({
          columns: [
            9 / 38,
            1 / 38,
            28 / 38
          ],
          rows: []
        });
        grid.addControl(subGrid, 2, 0);
        { // options
          let optionsGrid = WizardryScene.createGrid({
            columns: [],
            rows: [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5]
          });
          subGrid.addControl(optionsGrid, 0, 0);

          const alignments = WizardryAlignment.values;
          for (let i = 1, li = alignments.length; i < li; i++) {
            optionsGrid.addControl(this._parent.createButton({
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: [() => { this.chooseAlignment(WizardryConstants.ALPHABET[i - 1], alignments[i]); }],
                onPointerEnterObservable: [
                  () => {
                    // stop the fade animation and restore the alpha on the message block
                    this._messageBlock.alpha = 1;
                    this._parent.stopAnimation(this._messageBlock);
                    this._messageBlock.text = alignments[i].description;
                  }
                ],
                onPointerOutObservable: [
                  () => {
                    // clear the tooltip if it matches the selected tooltip text
                    if (this._messageBlock.text === alignments[i].description) {
                      this._messageBlock.text = "";
                    }
                  }
                ]
              },
              text: { text: [WizardryConstants.ALPHABET[i - 1], ") ", alignments[i].title].join("") }
            }).container, i - 1, 0);
          }
        }
        { // message block
          let subSubGrid = WizardryScene.createGrid({
            columns: [],
            rows: [1 /5, 4 / 5]
          });
          subGrid.addControl(subSubGrid, 0, 2);

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
          subSubGrid.addControl(this._messageBlock, 1, 0);
        }
      }
    }

    return this._configuration;
  }
  /**
   * Changes to the previous screen.
   */
  prevScreen() {
    this._parent.state = WizardryConstants.MAKE_CHARACTER_RACE;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    this._nameBlock.text = WizardryCharacterMaker.character.name;
    this._pointBlock.text = WizardryCharacterMaker.pointsAvailable.toString();
    this._raceBlock.text = WizardryCharacterMaker.character.race.title;
    this._inWait = false;
    this._entryBlock.text = "";
    this._messageBlock.text = "";
  }
}

export { WizardryMakeCharacterAlignmentUi };