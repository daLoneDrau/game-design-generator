import { WizardryScene }          from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE, 
  FADE,
  WizardryUiConfiguration }       from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene }   from "../../../wizardry-ui-state-scene.js";
import * as Materials             from "../../../../components/materials/materials.js";
import { WizardryAttribute,
  WizardryCharacterClass,
  WizardryConstants }             from "../../../../config/wizardry-constants.js";
import { WizardryCharacterMaker } from "../../../../services/wizardry-character-maker.js";

/**
 * @class Ui class for the Points distribution state of the Make Character scene.
 */
class WizardryMakeCharacterPointsUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlock used to display the character's alignment. */
    this._alignmentBlock;
    /** @private the current attribute being raised/lowered. */
    this._attributeIndex = 0;
    /** @private the list BABYLON.GUI.TextBlocks used to display the indicators for the current attribute. */
    this._attributeIndicatorBlocks = [];
    /** @private the list BABYLON.GUI.TextBlock used to display the possible class assignments. */
    this._classLabels = [];
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock = null;
    /** @private the list BABYLON.GUI.Containers used to display the buttons to lower attribute scores. */
    this._minusButtons = [];
    /** @private the name entered. */
    this._name = "";
    /** @private the BABYLON.GUI.TextBlock used to display the character's name. */
    this._nameBlock = null;
    /** @private the list BABYLON.GUI.Containers used to display the buttons to raise attribute scores. */
    this._plusButtons = [];
    /** @private the BABYLON.GUI.TextBlock used to display the # of bonus points the character has. */
    this._pointBlock = null;
    /** @private the BABYLON.GUI.TextBlock used to display the character's race. */
    this._raceBlock = null;
    /** @private the list BABYLON.GUI.TextBlocks used to display the character's attribute scores. */
    this._valueBlocks = [];
  }
  /**
   * Alters a character's attribute.
   * @param {WizardryAttribute} attribute the attribute being altered
   * @param {Number} value the value by which the attribute is being altered
   */
  alterAttribute(attribute, value) {
    let action = WizardryCharacterMaker.alterAttribute(attribute, value);
    this.set();
    if (!action.isSuccessful) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = action.error;
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Changes the attribute selection in the Points assignment state.
   * @param {Number} direction the direction the attribute selection is moving
   */
  changeAttributeSelection(direction) {
    this._attributeIndex += direction
    if (this._attributeIndex > 5) {
      this._attributeIndex = 0;
    } else if (this._attributeIndex < 0) {
      this._attributeIndex = 5;
    }
    this.set();
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let stopProcessing = true;
    switch (key) {
      case "+":
        this.alterAttribute(WizardryAttribute[this._attributeIndex], 1);
        break;
      case "-":
        this.alterAttribute(WizardryAttribute[this._attributeIndex], -1);
        break;
      case "Enter":
        this.changeAttributeSelection(1);
        break;
      case "Shift":
        this.changeAttributeSelection(-1);
        break;
      case "Escape":
        this.prevScreen();
        break;
      case "C":
      case "c":
        this.nextScreen();
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
   * Initalizes the view.
   */
  init() {
    this._parent.createScreenOutline({
      name: [WizardryConstants.MAKE_CHARACTER_POINTS, "_ui_frame"].join(""),
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
            { cell: [0, 20] },
            { cell: [39, 20] }
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

      let row = 0, attribute = WizardryAttribute.STRENGTH, clazz = WizardryCharacterClass.FIGHTER;
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
        { // +/- buttons
          let button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, -1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Decrease your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Decrease your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[-]" }
          }).container;
          grid.addControl(button, row, 1);
          this._minusButtons.push(button);
          
          let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
          grid.addControl(text, row, 2);
          this._valueBlocks.push(text);
  
          button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, 1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Increase your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Increase your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[+]" }
          }).container;
          grid.addControl(button, row, 3);
          this._plusButtons.push(button);
          
          text = this._parent.createTextBlock({
            text: "<--",
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          });
          grid.addControl(text, row, 4);
          this._attributeIndicatorBlocks.push(text);
        }
      }
      { // FIGHTER
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["A) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      row++;
      attribute = WizardryAttribute.IQ;
      clazz = WizardryCharacterClass.MAGE;
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
        { // +/- buttons
          let button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, -1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Decrease your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Decrease your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[-]" }
          }).container;
          grid.addControl(button, row, 1);
          this._minusButtons.push(button);
          
          let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
          grid.addControl(text, row, 2);
          this._valueBlocks.push(text);
  
          button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, 1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Increase your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Increase your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[+]" }
          }).container;
          grid.addControl(button, row, 3);
          this._plusButtons.push(button);
          
          text = this._parent.createTextBlock({
            text: "<--",
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          });
          grid.addControl(text, row, 4);
          this._attributeIndicatorBlocks.push(text);
        }
      }
      { // MAGE
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["B) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      row++;
      attribute = WizardryAttribute.PIETY;
      clazz = WizardryCharacterClass.PRIEST;
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
        { // +/- buttons
          let button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, -1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Decrease your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Decrease your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[-]" }
          }).container;
          grid.addControl(button, row, 1);
          this._minusButtons.push(button);
          
          let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
          grid.addControl(text, row, 2);
          this._valueBlocks.push(text);
  
          button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, 1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Increase your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Increase your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[+]" }
          }).container;
          grid.addControl(button, row, 3);
          this._plusButtons.push(button);
          
          text = this._parent.createTextBlock({
            text: "<--",
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          });
          grid.addControl(text, row, 4);
          this._attributeIndicatorBlocks.push(text);
        }
      }
      { // PRIEST
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["C) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      row++;
      attribute = WizardryAttribute.VITALITY;
      clazz = WizardryCharacterClass.THIEF;
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
        { // +/- buttons
          let button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, -1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Decrease your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Decrease your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[-]" }
          }).container;
          grid.addControl(button, row, 1);
          this._minusButtons.push(button);
          
          let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
          grid.addControl(text, row, 2);
          this._valueBlocks.push(text);
  
          button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, 1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Increase your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Increase your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[+]" }
          }).container;
          grid.addControl(button, row, 3);
          this._plusButtons.push(button);
          
          text = this._parent.createTextBlock({
            text: "<--",
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          });
          grid.addControl(text, row, 4);
          this._attributeIndicatorBlocks.push(text);
        }
      }
      { // THIEF
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["D) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      row++;
      attribute = WizardryAttribute.AGILITY;
      clazz = WizardryCharacterClass.BISHOP;
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
        { // +/- buttons
          let button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, -1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Decrease your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Decrease your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[-]" }
          }).container;
          grid.addControl(button, row, 1);
          this._minusButtons.push(button);
          
          let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
          grid.addControl(text, row, 2);
          this._valueBlocks.push(text);
  
          button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, 1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Increase your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Increase your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[+]" }
          }).container;
          grid.addControl(button, row, 3);
          this._plusButtons.push(button);
          
          text = this._parent.createTextBlock({
            text: "<--",
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          });
          grid.addControl(text, row, 4);
          this._attributeIndicatorBlocks.push(text);
        }
      }
      { // BISHOP
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["E) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      row++;
      attribute = WizardryAttribute.LUCK;
      clazz = WizardryCharacterClass.SAMURAI;
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
        { // +/- buttons
          let button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, -1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Decrease your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Decrease your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[-]" }
          }).container;
          grid.addControl(button, row, 1);
          this._minusButtons.push(button);
          
          let text = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
          grid.addControl(text, row, 2);
          this._valueBlocks.push(text);
  
          button = this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.alterAttribute(attr, 1); }],
              onPointerEnterObservable: [
                () => {
                  // stop the fade animation and restore the alpha on the message block
                  this._messageBlock.alpha = 1;
                  this._parent.stopAnimation(this._messageBlock);
                  this._messageBlock.text = ["Increase your ", attr.name].join("");
                }
              ],
              onPointerOutObservable: [
                () => {
                  // clear the tooltip if it matches the selected tooltip text
                  if (this._messageBlock.text ===  ["Increase your ", attr.name].join("")) {
                    this._messageBlock.text = "";
                  }
                }
              ]
            },
            text: { text: "[+]" }
          }).container;
          grid.addControl(button, row, 3);
          this._plusButtons.push(button);
          
          text = this._parent.createTextBlock({
            text: "<--",
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          });
          grid.addControl(text, row, 4);
          this._attributeIndicatorBlocks.push(text);
        }
      }
      { // SAMURAI
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["F) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      clazz = WizardryCharacterClass.LORD;
      { // LORD
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["G) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      clazz = WizardryCharacterClass.NINJA;
      { // NINJA
        const cl = clazz; 
        let button = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlock.alpha = 1;
                this._parent.stopAnimation(this._messageBlock);
                this._messageBlock.text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlock.text ===  cl.description) {
                  this._messageBlock.text = "";
                }
              }
            ]
          },
          text: { text: ["H) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
    }
    { // add the last 2 labels     
      let grid = WizardryScene.createGrid({
        columns: [
          9 / 38, // label
          1 / 38, // value
          28 / 38, // value
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

      this._alignmentBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      grid.addControl(this._alignmentBlock, 0, 2);

      grid.addControl(this._parent.createTextBlock({
        text: "CLASS",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 1, 0);
    }
    { // alignment options/messages
      let grid = WizardryScene.createGrid({
        columns: [],
        rows: [
          1 / 7, // instruction 1
          1 / 7, // instruction 2
          1 / 7, // instruction 3
          1 / 7, // blank
          3 / 7, // messages
        ]
      });
      this._configuration.addControl(grid, 7, 1);

      { // instruction 1
        grid.addControl(this._parent.createTextBlock({
          text: "ENTER [+,-] TO ALTER A SCORE,",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }), 0, 0);
      }
      { // instruction 2
        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 1, 0);
        
        panel.addControl(this._parent.createTextBlock({
          text: "      ",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }));
        
        panel.addControl(this._parent.createButton({
          background: {
            onPointerClickObservable: [() => { this.changeAttributeSelection(-1); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable:   [() => { }]
          },
          text: { text: "[SHIFT]" }
        }).container);
        
        panel.addControl(this._parent.createTextBlock({
          text: ",",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }));
        
        panel.addControl(this._parent.createButton({
          background: {
            onPointerClickObservable: [() => { this.changeAttributeSelection(1) }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable:   [() => { }]
          },
          text: { text: "[ENTER]" }
        }).container);
        
        panel.addControl(this._parent.createTextBlock({
          text: " TO CHANGE SCORE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }));
      } 
      { // instruction 3
        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 2, 0);
        
        panel.addControl(this._parent.createTextBlock({
          text: "      ",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }));
        
        panel.addControl(this._parent.createButton({
          background: {
            onPointerClickObservable: [() => { this.prevScreen(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable:   [() => { }]
          },
          text: { text: "[ESC]" }
        }).container);
        
        panel.addControl(this._parent.createTextBlock({
          text: " TO GO BACK OR ",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }));
        
        panel.addControl(this._parent.createButton({
          background: {
            onPointerClickObservable: [() => { this.nextScreen(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable:   [() => { }]
          },
          text: { text: "[C]" }
        }).container);
        
        panel.addControl(this._parent.createTextBlock({
          text: " TO CONTINUE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }));
      }
      { // messages
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
        grid.addControl(this._messageBlock, 4, 0);
      }
    }

    return this._configuration;
  }
  /**
   * Changes to the next screen.
   */
  nextScreen() {
    if (WizardryCharacterMaker.pointsAvailable > 0) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "You must distribute all your BONUS points before continuing.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      let atLeastOne = false;
      for (let i = this._classLabels.length - 1; i >= 0; i--) {
        if (this._classLabels[i].isVisible) {
          atLeastOne = true;
          break;
        }
      }
      if (!atLeastOne) {
        this._parent.stopAnimation(this._messageBlock);
        this._messageBlock.text = "All BONUS points have been spent, but this character doesn't qualify for any class. Re-distribute your points.";
        this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      } else {
        this._attributeIndex = 0;
        this._parent.state = WizardryConstants.MAKE_CHARACTER_CLASS;
      }
    }
  }
  /**
   * Changes to the previous screen.
   */
  prevScreen() {
    WizardryCharacterMaker.resetBonusPoints();
    this._attributeIndex = 0;
    this._parent.state = WizardryConstants.MAKE_CHARACTER_ALIGNMENT;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    this._nameBlock.text = WizardryCharacterMaker.character.name;
    this._pointBlock.text = WizardryCharacterMaker.pointsAvailable.toString();
    this._raceBlock.text = WizardryCharacterMaker.character.race.title;
    this._alignmentBlock.text = WizardryCharacterMaker.character.alignment.title;
    this._messageBlock.text = "";
    
    for (let i = this._classLabels.length - 1; i >= 0; i--) {
      this._classLabels[i].isVisible = false;
    }
    const classes = WizardryCharacterClass.values;
    for (let i = classes.length - 1; i >= 0; i--) {
      this._classLabels[i].isVisible = WizardryCharacterMaker.isEligibleForClass(classes[i]);
    }
    const attributes = WizardryAttribute.values;
    for (let i = attributes.length - 1; i >= 0; i--) {
      this._valueBlocks[i].text = WizardryCharacterMaker.character.getAttribute(attributes[i]).toString();
    }
    for (let i = this._attributeIndicatorBlocks.length - 1; i >= 0; i--) {
      this._attributeIndicatorBlocks[i].isVisible = false;
      this._minusButtons[i].isVisible = false;
      this._plusButtons[i].isVisible = false;
    }
    this._attributeIndicatorBlocks[this._attributeIndex].isVisible = true;
    this._minusButtons[this._attributeIndex].isVisible = true;
    this._plusButtons[this._attributeIndex].isVisible = true;
  }
}

export { WizardryMakeCharacterPointsUi };