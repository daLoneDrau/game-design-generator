import { WizardryScene } from "../../wizardry-scene.js";
import { WizardryCharacter } from "../../../bus/wizardry-character.js";
import * as Materials from "../../../components/materials/materials.js";
import { createScreenOutline } from "../../../components/ui/screenoutline.js";
import { WizardryConstants } from "../../../config/wizardry-constants.js";
import { WizardryAlignment } from "../../../config/wizardry-constants.js";
import { WizardryAttribute } from "../../../config/wizardry-constants.js";
import { WizardryCharacterClass } from "../../../config/wizardry-constants.js";
import { WizardryCharacterStatus } from "../../../config/wizardry-constants.js";
import { WizardryRace } from "../../../config/wizardry-constants.js";
import { WizardryXgoto } from "../../../config/wizardry-constants.js";
import { WizardryCharacterMaker } from "../../../services/wizardry-character-maker.js";
import { WizardryController } from "../../../services/wizardry-controller.js";
import { Dice } from "../../../../assets/js/base.js";
import { Watcher } from "../../../../assets/js/base.js";

/** Party block headers. */
const HEADERS = [
  {
    text: "NAME",
    horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
  },
  {
    text: "RACE",
    horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
  }, 
  "POINTS", "STRENGTH", "I.Q.", "PIETY", "VITALITY", "AGILITY", "LUCK", "ALIGNMENT", "CLASS"];
const PROMPTS = ["ENTER A NAME >", "CHOOSE A RACE >", "CHOOSE AN ALIGNMENT >", "CHOOSE A CLASS >"];
/** the delay in ms after keyboard entry */
const KEYBOARD_ENTRY_DELAY = 500;

/**
 * @class The character creation scene.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
class WizardryCharacterCreationScene extends WizardryScene {
  constructor(engine) {
    super(engine);
    /** @private the index of the attribute being adjusted. */
    this._attributeIndex = 0;
    /** @private the list of BABYLON.GUI.TextBlocks used to indicate which attribute is being adjusted. */
    this._attributeIndicatorBlocks = [];
    /** @private the list of BABYLON.GUI.Containers used to display class selection labels. */
    this._classLabels = [];
    /** @private the list of BABYLON.GUI.Containers used to display class selection buttons. */
    this._classButtons = [];
    /** @private the list of UI configurations. */
    this._configurations = [];
    /** @private the list of animations for when the cursors are invisible. */
    this._cursorInvisibleAnimations = [];
    /** @private the list of animations for when the cursors are visible. */
    this._cursorVisibleAnimations = [];
    /** @private the list of cursors displayed. */
    this._cursors = [];
    /** @private the list of BABYLON.GUI.TextBlocks used to display user entry. */
    this._entryBlocks = [];
    /** @private the list of BABYLON.GUI.TextBlocks used to display messages. */
    this._messageBlocks = [];
    /** @private the list of BABYLON.GUI.Containers used to display minus buttons. */
    this._minusButtons = [];
    /** @private the list of options available, by state. */
    this._options = [
      [
        {
          text: "A) HUMAN",
          action: function() { this.chooseRace("A", WizardryRace.HUMAN); },
          tooltip: WizardryRace.HUMAN.description
        },
        {
          text: "B) ELF",
          action: function() { this.chooseRace("B", WizardryRace.ELF); },
          tooltip: WizardryRace.ELF.description
        },
        {
          text: "C) DWARF",
          action: function() { this.chooseRace("C", WizardryRace.DWARF); },
          tooltip: WizardryRace.DWARF.description
        },
        {
          text: "D) GNOME",
          action: function() { this.chooseRace("D", WizardryRace.GNOME); },
          tooltip: WizardryRace.GNOME.description
        },
        {
          text: "E) HOBBIT",
          action: function() { this.chooseRace("E", WizardryRace.HOBBIT); },
          tooltip: WizardryRace.HOBBIT.description
        },
      ],
      [
        {
          text: "A) GOOD",
          action: function() { this.chooseAlignment("A", WizardryAlignment.GOOD); },
          tooltip: WizardryAlignment.GOOD.description
        },
        {
          text: "B) NEUTRAL",
          action: function() { this.chooseAlignment("B", WizardryAlignment.NEUTRAL); },
          tooltip: WizardryAlignment.NEUTRAL.description
        },
        {
          text: "C) EVIL",
          action: function() { this.chooseAlignment("C", WizardryAlignment.EVIL); },
          tooltip: WizardryAlignment.EVIL.description
        },
      ]
    ];
    /** @private the list of BABYLON.GUI.Containers used to display plus buttons. */
    this._plusButtons = [];
    /** @private the current state. */
    this._state = WizardryConstants.MAKE_CHARACTER_NAME;
    /** @private the BABYLON.GUI.Grid used for top layout. */
    this._topGrid;
    /** @private the Watcher instance. */
    this._watcher = new Watcher();
    this._watcher.watchUpdated = (data) => {
      for (let i = this._valueBlocks.length - 1; i >= 0; i--) {
        this._valueBlocks[i].text = "";
      }
      this._valueBlocks[0].text = [" ", data.name].join("");
      this._valueBlocks[2].text = [" ", WizardryCharacterMaker.pointsAvailable].join("");
      if (data.race !== WizardryRace.NORACE) {
        this._valueBlocks[1].text = [" ", data.race.title].join("");
      }
      if (data.alignment !== WizardryAlignment.UNALIGN) {
        this._valueBlocks[9].text = [" ", data.alignment.title].join("");
      }
      if (data.clazz !== null) {
        this._valueBlocks[10].text = [" ", data.clazz.title].join("");
      }
      if (this._state > WizardryConstants.MAKE_CHARACTER_ALIGNMENT) {
        if (data.getAttribute(WizardryAttribute.STRENGTH) !== 0) {
          this._valueBlocks[3].text = [data.getAttribute(WizardryAttribute.STRENGTH) < 10 ? " " : "", data.getAttribute(WizardryAttribute.STRENGTH)].join("");
        }
        if (data.getAttribute(WizardryAttribute.IQ) !== 0) {
          this._valueBlocks[4].text = [data.getAttribute(WizardryAttribute.IQ) < 10 ? " " : "", data.getAttribute(WizardryAttribute.IQ)].join("");
        }
        if (data.getAttribute(WizardryAttribute.PIETY) !== 0) {
          this._valueBlocks[5].text = [data.getAttribute(WizardryAttribute.PIETY) < 10 ? " " : "", data.getAttribute(WizardryAttribute.PIETY)].join("");
        }
        if (data.getAttribute(WizardryAttribute.VITALITY) !== 0) {
          this._valueBlocks[6].text = [data.getAttribute(WizardryAttribute.VITALITY) < 10 ? " " : "", data.getAttribute(WizardryAttribute.VITALITY)].join("");
        }
        if (data.getAttribute(WizardryAttribute.AGILITY) !== 0) {
          this._valueBlocks[7].text = [data.getAttribute(WizardryAttribute.AGILITY) < 10 ? " " : "", data.getAttribute(WizardryAttribute.AGILITY)].join("");
        }
        if (data.getAttribute(WizardryAttribute.LUCK) !== 0) {
          this._valueBlocks[8].text = [data.getAttribute(WizardryAttribute.LUCK) < 10 ? " " : "", data.getAttribute(WizardryAttribute.LUCK)].join("");
        }
      }
    };
    /** @private the list of BABYLON.GUI.TextBlocks used to display messages. */
    this._valueBlocks = [];
  }
  /**
   * Adjusts the UI configuration.
   */
  adjustUiConfiguration() {
    this.clearUiConfiguration();
    let cursorIndexOffset = -1;
    if (this._state >= WizardryConstants.MAKE_CHARACTER_CLASS) {
      cursorIndexOffset = -2; // this state is 2 behind
    }
    // start the cursor animation for the current configuration
    if (this._state !== WizardryConstants.MAKE_CHARACTER_POINTS) {
      this.beginDirectAnimation(
        this._cursors[this._state + cursorIndexOffset], //the target where the animation will take place
        [this._cursorVisibleAnimations[this._state  + cursorIndexOffset]], // the list of animations to start
        0, // the initial frame
        10, // the final frame
        true // if you want animation to loop (off by default)
      );
    } else {
      this._minusButtons[this._attributeIndex].isVisible = true;
      this._plusButtons[this._attributeIndex].isVisible = true;
      this._attributeIndicatorBlocks[this._attributeIndex].isVisible = true;
    }
    if (this._state === WizardryConstants.MAKE_CHARACTER_NAME) {      
      this._entryBlocks[this._state - 1].text = this._name;
    }
    this.checkClassEligibility();
    // show the current configuration
    this._configurations[this._state - 1].isVisible = true;
    
    this._valueBlocks[2].text = [" ", WizardryCharacterMaker.pointsAvailable].join("");
  }
  /**
   * Clears the UI configuration.
   */
  clearUiConfiguration() {
    // hide all cursors
    for (let i = this._cursors.length - 1; i >= 0; i--) {
      this.stopAnimation(this._cursors[i]);
      this.beginDirectAnimation(
        this._cursors[i], //the target where the animation will take place
        [this._cursorInvisibleAnimations[i]], // the list of animations to start
        0, // the initial frame
        10, // the final frame
        true // if you want animation to loop (off by default)
      );
    }
    // clear all entry prompts
    for (let i = this._entryBlocks.length - 1; i >= 0; i--) {
      this._entryBlocks[i].text = "";
    }
    for (let i = this._configurations.length - 1; i >= 0; i--) {
      this._configurations[i].isVisible = false;
    }
    for (let i = this._minusButtons.length - 1; i >= 0; i--) {
      this._minusButtons[i].isVisible = false;
    }
    for (let i = this._plusButtons.length - 1; i >= 0; i--) {
      this._plusButtons[i].isVisible = false;
    }
    for (let i = this._classButtons.length - 1; i >= 0; i--) {
      this._classButtons[i].isVisible = false;
    }
    for (let i = this._classLabels.length - 1; i >= 0; i--) {
      this._classLabels[i].isVisible = false;
    }
    for (let i = this._attributeIndicatorBlocks.length - 1; i >= 0; i--) {
      this._attributeIndicatorBlocks[i].isVisible = false;
    }
    for (let i = this._messageBlocks.length - 1; i >= 0; i--) {
      this._messageBlocks[i].text = "";
      this._messageBlocks[i].alpha = 1;
    }
  }
  /**
   * Handles key entry while the user is entering a race.
   * @param {string} key the key entered
   */
  handleSaveEntry(key) {
    let race = null;
    switch (key) {
      case "Y":
      case "y":
        this.saveCharacter("YES", true);
        break;
      case "N":
      case "n":
        this.saveCharacter("NO", false);
        break;
      case "Escape":
        this.prevScreen();
        break;
      default:
        this.stopAnimation(this._messageBlocks[this._state - 1]);
        this._messageBlocks[this._state - 1].text = "Huh?";
        this.beginAnimation(this._messageBlocks[this._state - 1], 0, 3 * this._messageFrameRate);
        break;
    }
  }
  /**
   * Initializes the UI.
   */
  initUi() {
    super.initUi();
    // create the frame
    createScreenOutline(this.getEngine().getRenderingCanvas(), this._advancedTexture, {
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
      ]
    });
    this._topGrid = WizardryScene.createGrid({
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
    this._advancedTexture.addControl(this._topGrid);
    { // add the first 3 labels and values      
      let grid = WizardryScene.createGrid({
        columns: [
          9 / 38, // label
          29 / 38, // value
        ],
        rows: [
          1 / 3, // line
          1 / 3, // line
          1 / 3 // line
        ]
      });
      this._topGrid.addControl(grid, 1, 1);

      grid.addControl(this.createTextBlock({
        text: "NAME",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 0, 0);
      let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      grid.addControl(text, 0, 1);
      this._valueBlocks.push(text);

      grid.addControl(this.createTextBlock({
        text: "RACE",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
      }), 1, 0);
      text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      grid.addControl(text, 1, 1);
      this._valueBlocks.push(text);

      grid.addControl(this.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
          isPointerBlocker: true,
          onPointerEnterObservable: [
            function() {
              // stop the fade animation and restore the alpha on the message block
              this._messageBlocks[this._state - 1].alpha = 1;
              this.stopAnimation(this._messageBlocks[this._state - 1]);
              this._messageBlocks[this._state - 1].text = "The number of BONUS points available to raise your characteristics. There is a 9% chance of having over 10 points, but <1% of having 20 or more.";
            }, // callback
            -1, // the mask used to filter observers
            false, // the callback will be inserted at the last position, executed after all the others already present
            this // scope for the callback to be called from
          ],
          onPointerOutObservable: [
            function() {
              // clear the tooltip if it matches the selected tooltip text
              if (this._messageBlocks[this._state - 1].text === "The number of BONUS points available to raise your characteristics. There is a 9% chance of having over 10 points, but <1% of having 20 or more.") {
                this._messageBlocks[this._state - 1].text = "";
              }
            }, // callback
            -1, // the mask used to filter observers
            false, // the callback will be inserted at the last position, executed after all the others already present
            this // scope for the callback to be called from
          ]
        },
        text: { text: "POINTS" }
      }).container, 2, 0);
      text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      grid.addControl(text, 2, 1);
      this._valueBlocks.push(text);
    }
    { // add the next 6 labels and values and class options      
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
      this._topGrid.addControl(grid, 3, 1);

      let row = 0, attribute = WizardryAttribute.STRENGTH, clazz = WizardryCharacterClass.FIGHTER;
      { // STRENGTH
        const attr = attribute;
        grid.addControl(this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = attr.description;
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text === attr.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);

        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, -1); }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Decrease your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  ["Decrease your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[-]" }
        }).container;
        grid.addControl(button, row, 1);
        this._minusButtons.push(button);
        
        let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        grid.addControl(text, row, 2);
        this._valueBlocks.push(text);

        button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, 1); }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Increase your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===["Increase your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[+]" }
        }).container;
        grid.addControl(button, row, 3);
        this._plusButtons.push(button);
        
        text = this.createTextBlock({
          text: "<--",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        grid.addControl(text, row, 4);
        this._attributeIndicatorBlocks.push(text);
      }
      { // FIGHTER
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["A) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // FIGHTER
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("A", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["A) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
      row++;
      attribute = WizardryAttribute.IQ;
      clazz = WizardryCharacterClass.MAGE;
      { // IQ
        const attr = attribute;
        grid.addControl(this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = attr.description;
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text === attr.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);

        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, -1); }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Decrease your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  ["Decrease your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[-]" }
        }).container;
        grid.addControl(button, row, 1);
        this._minusButtons.push(button);
        
        let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        grid.addControl(text, row, 2);
        this._valueBlocks.push(text);

        button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, 1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Increase your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===["Increase your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[+]" }
        }).container;
        grid.addControl(button, row, 3);
        this._plusButtons.push(button);
        
        text = this.createTextBlock({
          text: "<--",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        grid.addControl(text, row, 4);
        this._attributeIndicatorBlocks.push(text);
      }
      { // MAGE
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["B) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // MAGE
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("B", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["B) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
      row++;
      attribute = WizardryAttribute.PIETY;
      clazz = WizardryCharacterClass.PRIEST;
      { // PIETY
        const attr = attribute;
        grid.addControl(this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = attr.description;
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text === attr.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);

        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, -1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Decrease your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  ["Decrease your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[-]" }
        }).container;
        grid.addControl(button, row, 1);
        this._minusButtons.push(button);
        
        let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        grid.addControl(text, row, 2);
        this._valueBlocks.push(text);

        button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, 1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Increase your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===["Increase your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[+]" }
        }).container;
        grid.addControl(button, row, 3);
        this._plusButtons.push(button);
        
        text = this.createTextBlock({
          text: "<--",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        grid.addControl(text, row, 4);
        this._attributeIndicatorBlocks.push(text);
      }
      { // PRIEST
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["C) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // PRIEST
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("C", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["C) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
      row++;
      attribute = WizardryAttribute.VITALITY;
      clazz = WizardryCharacterClass.THIEF;
      { // VITALITY
        const attr = attribute;
        grid.addControl(this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = attr.description;
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text === attr.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);

        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, -1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Decrease your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  ["Decrease your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[-]" }
        }).container;
        grid.addControl(button, row, 1);
        this._minusButtons.push(button);
        
        let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        grid.addControl(text, row, 2);
        this._valueBlocks.push(text);

        button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, 1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Increase your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===["Increase your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[+]" }
        }).container;
        grid.addControl(button, row, 3);
        this._plusButtons.push(button);
        
        text = this.createTextBlock({
          text: "<--",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        grid.addControl(text, row, 4);
        this._attributeIndicatorBlocks.push(text);
      }
      { // THIEF
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["D) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // THIEF
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("D", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["D) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
      row++;
      attribute = WizardryAttribute.AGILITY;
      clazz = WizardryCharacterClass.BISHOP;
      { // AGILITY
        const attr = attribute;
        grid.addControl(this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = attr.description;
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text === attr.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);

        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, -1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Decrease your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  ["Decrease your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[-]" }
        }).container;
        grid.addControl(button, row, 1);
        this._minusButtons.push(button);
        
        let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        grid.addControl(text, row, 2);
        this._valueBlocks.push(text);

        button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, 1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Increase your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===["Increase your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[+]" }
        }).container;
        grid.addControl(button, row, 3);
        this._plusButtons.push(button);
        
        text = this.createTextBlock({
          text: "<--",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        grid.addControl(text, row, 4);
        this._attributeIndicatorBlocks.push(text);
      }
      { // BISHOP
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["E) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // BISHOP
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("E", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["E) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
      row++;
      attribute = WizardryAttribute.LUCK;
      clazz = WizardryCharacterClass.SAMURAI;
      { // LUCK
        const attr = attribute;
        grid.addControl(this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = attr.description;
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text === attr.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: attribute.name }
        }).container, row, 0);

        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, -1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Decrease your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  ["Decrease your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[-]" }
        }).container;
        grid.addControl(button, row, 1);
        this._minusButtons.push(button);
        
        let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        grid.addControl(text, row, 2);
        this._valueBlocks.push(text);

        button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            isPointerBlocker: true,
            hoverCursor: "pointer",
            onPointerClickObservable: [
              () => { this.alterAttribute(attr, 1) }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerEnterObservable: [
              function() {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = ["Increase your ", attr.name].join("");
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ],
            onPointerOutObservable: [
              function() {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===["Increase your ", attr.name].join("")) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }, // callback
              -1, // the mask used to filter observers
              false, // the callback will be inserted at the last position, executed after all the others already present
              this // scope for the callback to be called from
            ]
          },
          text: { text: "[+]" }
        }).container;
        grid.addControl(button, row, 3);
        this._plusButtons.push(button);
        
        text = this.createTextBlock({
          text: "<--",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        grid.addControl(text, row, 4);
        this._attributeIndicatorBlocks.push(text);
      }
      { // SAMURAI
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["F) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // SAMURAI
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("F", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["F) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
      row++;
      clazz = WizardryCharacterClass.LORD;
      { // LORD
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["G) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // LORD
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("G", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["G) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
      row++;
      clazz = WizardryCharacterClass.NINJA;
      { // NINJA
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["H) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classLabels.push(button);
      }
      { // NINJA
        const cl = clazz; 
        let button = this.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.chooseClass("H", cl); }],
            onPointerEnterObservable: [
              () => {
                // stop the fade animation and restore the alpha on the message block
                this._messageBlocks[this._state - 1].alpha = 1;
                this.stopAnimation(this._messageBlocks[this._state - 1]);
                this._messageBlocks[this._state - 1].text = cl.description;
              }
            ],
            onPointerOutObservable: [
              () => {
                // clear the tooltip if it matches the selected tooltip text
                if (this._messageBlocks[this._state - 1].text ===  cl.description) {
                  this._messageBlocks[this._state - 1].text = "";
                }
              }
            ]
          },
          text: { text: ["H) ", cl.title].join("") }
        }).container;
        grid.addControl(button, row, 6);
        this._classButtons.push(button);
      }
    }
    { // add the last 2 labels and values      
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
      for (let i = 0, li = 2; i < li; i++) {
        grid.addControl(this.createTextBlock({
          text: HEADERS[i + 9],
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
        }), i, 0);
        let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        grid.addControl(text, i, 1);
        this._valueBlocks.push(text);
      }
      this._topGrid.addControl(grid, 5, 1);
    }
    { // ui configurations
      // create a grid to hold the different configurations
      let grid = new BABYLON.GUI.Grid();
      this._topGrid.addControl(grid, 7, 1);

      // fade animation
      const fade = new BABYLON.Animation(
        "trainingGroundsMessageFade", // Name of the animation
        "alpha", // Property to animate
        this._messageFrameRate, // The frames per second of the animation
        BABYLON.Animation.ANIMATIONTYPE_FLOAT // The data type of the animation
      );
      // Set the key frames of the animation - animation will last for 2.01 seconds and there are 4 keyframes at 0, 2, 3, and 3.01 seconds
      fade.setKeys([
        {
          frame: 0, // keyframe at 0 seconds
          value: 1, // at 0 seconds the alpha should be 1 (fully visible)
        },
        {
          frame: 2 * this._messageFrameRate, // keyframe at 1 seconds (full framerate)
          value: 1, // at 2 seconds the alpha should be 1 (fully visible)
        },
        {
          frame: 3 * this._messageFrameRate, // keyframe at 2 seconds (2 * full frame rate)
          value: 0, // at 3 seconds the alpha should be 0 (invisible)
        }
      ]);

      { // config 1 - name
        let config = WizardryScene.createGrid({
          columns: [],
          rows: [
            1 / 7, // line
            1 / 7, // line
            1 / 7, // line
            5 / 7, // line
          ]
        });
        grid.addControl(config);
        this._configurations.push(config);

        { // prompt and user entry field
          let subGrid = WizardryScene.createGrid({
            columns: [
              14 / 38,
              24 / 38
            ],
            rows: []
          });
          config.addControl(subGrid, 0, 0);
          subGrid.addControl(this.createTextBlock({
            text: PROMPTS[0],
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
          }), 0, 0);

          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          subGrid.addControl(panel, 0, 1);

          let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
          panel.addControl(text);
          this._entryBlocks.push(text);

          let o = WizardryScene.createBlinkingCursor();
          panel.addControl(o.cursor);
          this._cursors.push(o.cursor);
          this._cursorVisibleAnimations.push(o.visible);
          this._cursorInvisibleAnimations.push(o.invisible);
        }
        { // exit line
          config.addControl(this.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              onPointerClickObservable: [
                this.prevScreen, // callback
                -1, // the mask used to filter observers
                false, // the callback will be inserted at the last position, executed after all the others already present
                this // scope for the callback to be called from
              ],
              onPointerEnterObservable: [
                () => { }, // callback
                -1, // the mask used to filter observers
                false, // the callback will be inserted at the last position, executed after all the others already present
                this // scope for the callback to be called from
              ],
              onPointerOutObservable: [
                () => { }, // callback
                -1, // the mask used to filter observers
                false, // the callback will be inserted at the last position, executed after all the others already present
                this // scope for the callback to be called from
              ]
            },
            text: { text: "OR PRESS [ESC] FOR THE TRAINING GROUNDS" }
          }).container, 1, 0);
        }
        { // message block
          let text = this.createTextBlock({
            lineSpacing: "3px",
            textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            resizeToFit: false,
            textWrapping: true,
          });
          if (typeof(text.animations) === "undefined") {
            text.animations = [];
          }
          text.animations.push(fade);
          this._messageBlocks.push(text);
          config.addControl(text, 3, 0);
        }
      }
      { // config 2 - race options/messages
        let config = WizardryScene.createGrid({
          columns: [],
          rows: [
            1 / 7, // line
            1 / 7, // line
            5 / 7, // line
          ]
        });
        grid.addControl(config);
        this._configurations.push(config);

        { // prompt and user entry field
          let subGrid = WizardryScene.createGrid({
            columns: [
              14 / 38,
              24 / 38
            ],
            rows: []
          });
          config.addControl(subGrid, 0, 0);
          subGrid.addControl(this.createTextBlock({
            text: PROMPTS[1],
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
          }), 0, 0);

          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          subGrid.addControl(panel, 0, 1);

          let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
          panel.addControl(text);
          this._entryBlocks.push(text);

          let o = WizardryScene.createBlinkingCursor();
          panel.addControl(o.cursor);
          this._cursors.push(o.cursor);
          this._cursorVisibleAnimations.push(o.visible);
          this._cursorInvisibleAnimations.push(o.invisible);

          config.addControl(this.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              hoverCursor: "pointer",
              isPointerBlocker: true,
              onPointerClickObservable: [
                this.prevScreen, // callback
                -1, // the mask used to filter observers
                false, // the callback will be inserted at the last position, executed after all the others already present
                this // scope for the callback to be called from
              ],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: { text: "OR PRESS [ESC] TO CHANGE YOUR NAME" }
          }).container, 1, 0);
        }
        { // options and messages
          let subGrid = WizardryScene.createGrid({
            columns: [
              9 / 38,
              29 / 38
            ],
            rows: []
          });
          config.addControl(subGrid, 2, 0);
          { // options
            let optionsGrid = WizardryScene.createGrid({
              columns: [],
              rows: [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5]
            });
            subGrid.addControl(optionsGrid, 0, 0);
            for (let i = 0, li = this._options[0].length; i < li; i++) {
              optionsGrid.addControl(this.createButton({
                background: {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  hoverCursor: "pointer",
                  isPointerBlocker: true,
                  onPointerClickObservable: [
                    this._options[0][i].action, // callback
                    -1, // the mask used to filter observers
                    false, // the callback will be inserted at the last position, executed after all the others already present
                    this // scope for the callback to be called from
                  ],
                  onPointerEnterObservable: [
                    function() {
                      // stop the fade animation and restore the alpha on the message block
                      this._messageBlocks[1].alpha = 1;
                      this.stopAnimation(this._messageBlocks[1]);
                      this._messageBlocks[1].text = this._options[0][i].tooltip;
                      //document.body.style.cursor = 'pointer';
                    }, // callback
                    -1, // the mask used to filter observers
                    false, // the callback will be inserted at the last position, executed after all the others already present
                    this // scope for the callback to be called from
                  ],
                  onPointerOutObservable: [
                    function() {
                      // clear the tooltip if it matches the selected tooltip text
                      if (this._messageBlocks[1].text === this._options[0][i].tooltip) {
                        this._messageBlocks[1].text = "";
                      }
                    }, // callback
                    -1, // the mask used to filter observers
                    false, // the callback will be inserted at the last position, executed after all the others already present
                    this // scope for the callback to be called from
                  ]
                },
                text: { text: this._options[0][i].text }
              }).container, i, 0);
            }
          }
          { // message block
            let subSubGrid = WizardryScene.createGrid({
              columns: [],
              rows: [1 /5, 4 / 5]
            });
            subGrid.addControl(subSubGrid, 0, 1);
            let text = this.createTextBlock({
              lineSpacing: "3px",
              textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
              resizeToFit: false,
              textWrapping: true,
            });
            if (typeof(text.animations) === "undefined") {
              text.animations = [];
            }
            text.animations.push(fade);
            this._messageBlocks.push(text);
            subSubGrid.addControl(text, 1, 0);
          }
        }
      }
      { // config 3 - align options/messages
        let config = WizardryScene.createGrid({
          columns: [],
          rows: [
            1 / 7, // line
            1 / 7, // line
            1 / 7, // line
            4 / 7, // line
          ]
        });
        grid.addControl(config);
        this._configurations.push(config);

        { // prompt and user entry field
          let subGrid = WizardryScene.createGrid({
            columns: [
              21 / 38,
              17 / 38
            ],
            rows: []
          });
          config.addControl(subGrid, 0, 0);
          subGrid.addControl(this.createTextBlock({
            text: PROMPTS[2],
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
          }), 0, 0);

          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          subGrid.addControl(panel, 0, 1);

          let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
          panel.addControl(text);
          this._entryBlocks.push(text);

          let o = WizardryScene.createBlinkingCursor();
          panel.addControl(o.cursor);
          this._cursors.push(o.cursor);
          this._cursorVisibleAnimations.push(o.visible);
          this._cursorInvisibleAnimations.push(o.invisible);

          config.addControl(this.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              hoverCursor: "pointer",
              isPointerBlocker: true,
              onPointerClickObservable: [
                this.prevScreen, // callback
                -1, // the mask used to filter observers
                false, // the callback will be inserted at the last position, executed after all the others already present
                this // scope for the callback to be called from
              ],
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
          config.addControl(subGrid, 3, 0);
          { // options
            let optionsGrid = WizardryScene.createGrid({
              columns: [],
              rows: [1 / 4, 1 / 4, 1 / 4, 1 / 4]
            });
            subGrid.addControl(optionsGrid, 0, 0);
            for (let i = 0, li = this._options[1].length; i < li; i++) {
              optionsGrid.addControl(this.createButton({
                background: {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  hoverCursor: "pointer",
                  isPointerBlocker: true,
                  onPointerClickObservable: [
                    this._options[1][i].action, // callback
                    -1, // the mask used to filter observers
                    false, // the callback will be inserted at the last position, executed after all the others already present
                    this // scope for the callback to be called from
                  ],
                  onPointerEnterObservable: [
                    function() {
                      // stop the fade animation and restore the alpha on the message block
                      this._messageBlocks[2].alpha = 1;
                      this.stopAnimation(this._messageBlocks[2]);
                      this._messageBlocks[2].text = this._options[1][i].tooltip;
                      //document.body.style.cursor = 'pointer';
                    }, // callback
                    -1, // the mask used to filter observers
                    false, // the callback will be inserted at the last position, executed after all the others already present
                    this // scope for the callback to be called from
                  ],
                  onPointerOutObservable: [
                    function() {
                      // clear the tooltip if it matches the selected tooltip text
                      if (this._messageBlocks[2].text === this._options[1][i].tooltip) {
                        this._messageBlocks[2].text = "";
                      }
                    }, // callback
                    -1, // the mask used to filter observers
                    false, // the callback will be inserted at the last position, executed after all the others already present
                    this // scope for the callback to be called from
                  ]
                },
                text: { text: this._options[1][i].text }
              }).container, i, 0);
            }
          }
          { // message block
            let text = this.createTextBlock({
              lineSpacing: "3px",
              textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
              resizeToFit: false,
              textWrapping: true,
            });
            if (typeof(text.animations) === "undefined") {
              text.animations = [];
            }
            text.animations.push(fade);
            this._messageBlocks.push(text);
            subGrid.addControl(text, 0, 2);
          }
        }
      }
      { // config 4 - pts lines/messages
        let config = WizardryScene.createGrid({
          columns: [],
          rows: [
            1 / 7, // instruction 1
            1 / 7, // instruction 2
            1 / 7, // instruction 3
            1 / 7, // blank
            4 / 7, // messages
          ]
        });
        grid.addControl(config);
        this._configurations.push(config);
        
        { // instructions
          config.addControl(this.createTextBlock({
            text: "ENTER [+,-] TO ALTER A SCORE,",
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
          }), 0, 0);
          { // change score
            let panel = new BABYLON.GUI.StackPanel();
            panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            panel.isVertical = false;
            config.addControl(panel, 1, 0);
            
            panel.addControl(this.createTextBlock({
              text: "      ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
            
            panel.addControl(this.createButton({
              background: {
                onPointerClickObservable: [
                  () => { this.changeAttributeSelection(-1); }, // callback
                  -1, // the mask used to filter observers
                  false, // the callback will be inserted at the last position, executed after all the others already present
                  this // scope for the callback to be called from
                ],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: { text: "[SHIFT]" }
            }).container);
            
            panel.addControl(this.createTextBlock({
              text: ",",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
            
            panel.addControl(this.createButton({
              background: {
                onPointerClickObservable: [
                  () => { this.changeAttributeSelection(1) }, // callback
                  -1, // the mask used to filter observers
                  false, // the callback will be inserted at the last position, executed after all the others already present
                  this // scope for the callback to be called from
                ],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: { text: "[ENTER]" }
            }).container);
            
            panel.addControl(this.createTextBlock({
              text: " TO CHANGE SCORE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
          } 
          { // prev/next scene
            let panel = new BABYLON.GUI.StackPanel();
            panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            panel.isVertical = false;
            config.addControl(panel, 2, 0);
            
            panel.addControl(this.createTextBlock({
              text: "      ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
            
            panel.addControl(this.createButton({
              background: {
                onPointerClickObservable: [
                  this.prevScreen, // callback
                  -1, // the mask used to filter observers
                  false, // the callback will be inserted at the last position, executed after all the others already present
                  this // scope for the callback to be called from
                ],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: { text: "[ESC]" }
            }).container);
            
            panel.addControl(this.createTextBlock({
              text: " TO GO BACK OR ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
            
            panel.addControl(this.createButton({
              background: {
                onPointerClickObservable: [
                  this.nextScreen, // callback
                  -1, // the mask used to filter observers
                  false, // the callback will be inserted at the last position, executed after all the others already present
                  this // scope for the callback to be called from
                ],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: { text: "[C]" }
            }).container);
            
            panel.addControl(this.createTextBlock({
              text: " TO CONTINUE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
          }
        }
        { // message block
          let text = this.createTextBlock({
            lineSpacing: "3px",
            textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            resizeToFit: false,
            textWrapping: true,
          });
          if (typeof(text.animations) === "undefined") {
            text.animations = [];
          }
          text.animations.push(fade);
          this._messageBlocks.push(text);
          config.addControl(text, 4, 0);
        }
      }
      { // config 5 - class options/messages
        let config = WizardryScene.createGrid({
          columns: [],
          rows: [
            1 / 7, // prompt
            1 / 7, // escape instruction
            5 / 7, // messages
          ]
        });
        grid.addControl(config);
        this._configurations.push(config);

        { // prompt and user entry field
          let subGrid = WizardryScene.createGrid({
            columns: [
              16 / 38,
              22 / 38
            ],
            rows: []
          });
          config.addControl(subGrid, 0, 0);
          subGrid.addControl(this.createTextBlock({
            text: PROMPTS[3],
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
          }), 0, 0);

          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          subGrid.addControl(panel, 0, 1);

          let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
          panel.addControl(text);
          this._entryBlocks.push(text);

          let o = WizardryScene.createBlinkingCursor();
          panel.addControl(o.cursor);
          this._cursors.push(o.cursor);
          this._cursorVisibleAnimations.push(o.visible);
          this._cursorInvisibleAnimations.push(o.invisible);

          config.addControl(this.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              onPointerClickObservable: [
                this.prevScreen, // callback
                -1, // the mask used to filter observers
                false, // the callback will be inserted at the last position, executed after all the others already present
                this // scope for the callback to be called from
              ],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: { text: "OR PRESS [ESC] TO RE-ASSIGN ATTRIBUTES" }
          }).container, 1, 0);
        }
        { // message block
          let subSubGrid = WizardryScene.createGrid({
            columns: [],
            rows: [1 /5, 4 / 5]
          });
          config.addControl(subSubGrid, 2, 0);
          let text = this.createTextBlock({
            lineSpacing: "3px",
            textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            resizeToFit: false,
            textWrapping: true,
          });
          if (typeof(text.animations) === "undefined") {
            text.animations = [];
          }
          text.animations.push(fade);
          this._messageBlocks.push(text);
          subSubGrid.addControl(text, 1, 0);
        }
      }
      { // config 6 - save options/messages
        let config = WizardryScene.createGrid({
          columns: [],
          rows: [
            1 / 7, // prompt
            1 / 7, // escape instruction
            5 / 7, // messages
          ]
        });
        grid.addControl(config);
        this._configurations.push(config);

        { // prompt and user entry field
          // subpanel to hold everything
          let panel = new BABYLON.GUI.StackPanel();
          panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          panel.isVertical = false;
          config.addControl(panel, 0, 0);
          { // keep y/n?
            panel.addControl(this.createTextBlock({
              text: "KEEP THIS CHARACTER ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
            
            panel.addControl(this.createButton({
              background: {
                onPointerClickObservable: [() => { this.saveCharacter("YES", true); }],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: { text: "[Y]" }
            }).container);
            
            panel.addControl(this.createTextBlock({
              text: "/",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
            
            panel.addControl(this.createButton({
              background: {
                onPointerClickObservable: [() => { this.saveCharacter("NO", false); }],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable: [() => { }]
              },
              text: { text: "[N]" }
            }).container);
            
            panel.addControl(this.createTextBlock({
              text: "? >",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }));
          }
          let text = this.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
          panel.addControl(text);
          this._entryBlocks.push(text);

          let o = WizardryScene.createBlinkingCursor();
          panel.addControl(o.cursor);
          this._cursors.push(o.cursor);
          this._cursorVisibleAnimations.push(o.visible);
          this._cursorInvisibleAnimations.push(o.invisible);

          config.addControl(this.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              onPointerClickObservable: [
                this.prevScreen, // callback
                -1, // the mask used to filter observers
                false, // the callback will be inserted at the last position, executed after all the others already present
                this // scope for the callback to be called from
              ],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: { text: "OR PRESS [ESC] TO CHOOSE A NEW CLASS" }
          }).container, 1, 0);
        }
        { // message block
          let subSubGrid = WizardryScene.createGrid({
            columns: [],
            rows: [1 /5, 4 / 5]
          });
          config.addControl(subSubGrid, 2, 0);
          let text = this.createTextBlock({
            lineSpacing: "3px",
            textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            resizeToFit: false,
            textWrapping: true,
          });
          if (typeof(text.animations) === "undefined") {
            text.animations = [];
          }
          text.animations.push(fade);
          this._messageBlocks.push(text);
          subSubGrid.addControl(text, 1, 0);
        }
      }
    }
    { // add keyboard entry
      if (this.onKeyboardObservable.observers.length === 0) {
        this.onKeyboardObservable.add((kbInfo) => {
          switch (kbInfo.type) {
            case BABYLON.KeyboardEventTypes.KEYDOWN:
              switch (this._state) {
                case WizardryConstants.MAKE_CHARACTER_NAME:
                  this.handleNameEntry(kbInfo.event.key);
                  break;
                case WizardryConstants.MAKE_CHARACTER_RACE:
                  this.handleRaceEntry(kbInfo.event.key);
                  break;
                case WizardryConstants.MAKE_CHARACTER_ALIGNMENT:
                  this.handleAlignmentEntry(kbInfo.event.key);
                  break;
                case WizardryConstants.MAKE_CHARACTER_POINTS:
                  this.handlePointsEntry(kbInfo.event.key);
                  break;
                case WizardryConstants.MAKE_CHARACTER_CLASS:
                  this.handleClassEntry(kbInfo.event.key);
                  break;
                case WizardryConstants.MAKE_CHARACTER_SAVE:
                  this.handleSaveEntry(kbInfo.event.key);
                  break;
              }
            break;
          }
        });
      }
    }
  }
  /**
   * Changes to the next screen.
   */
  nextScreen() {
    switch (this._state) {
      case WizardryConstants.MAKE_CHARACTER_POINTS:
        if (WizardryCharacterMaker.pointsAvailable === 0) {
          this._state = WizardryConstants.MAKE_CHARACTER_CLASS;
          this.adjustUiConfiguration();
        } else {
          this.stopAnimation(this._messageBlocks[this._state - 1]);
          this._messageBlocks[this._state - 1].text = "You still have points to assign.";
          this.beginAnimation(this._messageBlocks[this._state - 1], 0, 3 * this._messageFrameRate);
        }
        break;
    }
  }
  /**
   * Changes to the previous screen.
   */
  prevScreen() {
    switch (this._state) {
      case WizardryConstants.MAKE_CHARACTER_NAME:
        WizardryController.xgoto = WizardryXgoto.XTRAININ;
        this.exitScene();
        break;
      case WizardryConstants.MAKE_CHARACTER_RACE:
        this._state = WizardryConstants.MAKE_CHARACTER_NAME;
        this.adjustUiConfiguration();
        break;
      case WizardryConstants.MAKE_CHARACTER_ALIGNMENT:
        this._state = WizardryConstants.MAKE_CHARACTER_RACE;
        this.adjustUiConfiguration();
        break;
      case WizardryConstants.MAKE_CHARACTER_POINTS:
        this._state = WizardryConstants.MAKE_CHARACTER_ALIGNMENT;
        WizardryCharacterMaker.resetBonusPoints();
        this._attributeIndex = 0;
        this.adjustUiConfiguration();
        break;
      case WizardryConstants.MAKE_CHARACTER_CLASS:
        WizardryCharacterMaker.setClass(null);
        this._state = WizardryConstants.MAKE_CHARACTER_POINTS;
        WizardryCharacterMaker.resetBonusPoints();
        this._attributeIndex = 0;
        this.adjustUiConfiguration();
        break;
      case WizardryConstants.MAKE_CHARACTER_SAVE:
        WizardryCharacterMaker.setClass(null);
        this._state = WizardryConstants.MAKE_CHARACTER_CLASS;
        this.adjustUiConfiguration();
        break;
    }
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
      this._attributeIndex = 0;
      try {
        WizardryCharacterMaker.newCharacter();
      } catch (e) {
        WizardryCharacterMaker.setWatcher(this._watcher);
        WizardryCharacterMaker.newCharacter();
      }
      this._name = "";
      this._state = WizardryConstants.MAKE_CHARACTER_NAME;
      
      // clear all values from the screen
      for (let i = this._valueBlocks.length - 1; i >= 0; i--) {
        this._valueBlocks[i].text = "";
      }

      if (WizardryController.inheritedName.length > 0) {
        WizardryCharacterMaker.setName(WizardryController.inheritedName);
        WizardryController.inheritedName = "";
        this._state = WizardryConstants.MAKE_CHARACTER_RACE;
      }

      this.adjustUiConfiguration();
    }
    super.render(updateCameras, ignoreAnimations);
  }  
  /**
   * Performs a save action.
   * @param {string} letter the letter of the selection
   * @param {Boolean} doSave flag indicating whether or not to save the character
   */
  saveCharacter(letter, doSave) {
    this._entryBlocks[this._state - 2].text = letter;
    if (doSave) {
      WizardryCharacterMaker.finalizeCharacter();
    }
    this._state = WizardryConstants.MAKE_CHARACTER_WAIT;
    BABYLON.setAndStartTimer({
      timeout: KEYBOARD_ENTRY_DELAY,
      contextObservable: this.onBeforeRenderObservable,
      breakCondition: () => {
        // this will check if we need to break before the timeout has reached
        return this.isDisposed;
      },
      onEnded: (data) => {
        // this will run when the timeout has passed
        WizardryController.xgoto = WizardryXgoto.XTRAININ;
        this.exitScene();
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

export { WizardryCharacterCreationScene  };