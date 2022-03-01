import { KEYBOARD_ENTRY_DELAY } from "../../../wizardry-scene.js";
import { WizardryScene } from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { FADE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiConfiguration } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import { WizardryConstants, WizardrySpell } from "../../../../config/wizardry-constants.js";
import { WizardryCharacterClass } from "../../../../config/wizardry-constants.js";
import { WizardryXgoto } from "../../../../config/wizardry-constants.js";
import { WizardryController } from "../../../../services/wizardry-controller.js";
import { WizardryCharacterMaker } from "../../../../services/wizardry-character-maker.js";
import * as Materials from "../../../../components/materials/materials.js";

/** the list of letters A-H. */
const ALPHABET = ["A", "B", "C", "D", "E", "F", "G", "H"];
/**
 * @class Ui class for the Change Class state of the Training scene.
 */
class WizardryCampReadSpellsMainUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryCampReadSpellsMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlock used to display the character. */
    this._characterBlock;
    /** @private the BABYLON.GUI.TextBlocks used to display the number of mage spells by level. */
    this._mageSpellBlocks = [];
    /** @private the BABYLON.GUI.TextBlocks used to display the number of priest spells by level. */
    this._priestSpellBlocks = [];
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock;
    { // UI blocks
      /** @private the list of BABYLON.GUI.TextBlocks used to display the number of mage spells. */
      this._mageSpellBlocks = [];
      /** @private the list of BABYLON.GUI.TextBlocks used to display the number of priest spells. */
      this._priestSpellBlocks = [];
    }
    { // spell block
      /** @private the list of BABLON.GUI.StackPanels displaying the level buttons. */
      this._levelPanels = [];
      /** @private the current level of spells displayed */
      this._currentLevel = 0;
      /** @private the BABLON.GUI.Grid holding the levels menu. */
      this._spellsGrid = null;
      /** @private the map of BABLON.GUI.Containers holding spell data. */
      this._spellWidgets = {};
      this._spellDescriptionObject = {
        name: null,
        translation: null,
        level: null,
        type: null,
        aoe: null,
        description: null
      }
      this._spellListingGrid = null;
      this._currentBook = "MAGE";
    }
    { // menu options
      /** @private the BABLON.GUI.Container holding the menu. */
      this._menuGrid = null;
      /** @private the BABLON.GUI.StackPanel displaying the "mage" and "priest" buttons. */
      this._spellPanel = null;
      /** @private the object containing displaying the "leave button" container and text object. */
      this._leaveButton = null;
    }
  }
  /**
   * Changes the level of spells being displayed.
   * @param {Number} newLevel the new spell level to display
   */
  changeLevel(newLevel) {
    this._currentLevel = newLevel;
    this.set();
  }
  /**
   * Displays the Priest book of spells.
   */
  displayMage() {
    this._currentBook = "MAGE";
    this.set();
  }
  /**
   * Displays the Priest book of spells.
   */
  displayPriest() {
    this._currentBook = "PRIEST";
    this.set();
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    let stopProcessing = true;
    switch (key.toUpperCase()) {
      case "ESCAPE":
      case "ENTER":
      case "L":
        this.leave();
        break;
      case "M":
        if (character.knowsMagic && character.knowsPrayers) {
          this.displayMage();
        } else {
          stopProcessing = false;
        }
        break;
      case "P":
        if (character.knowsPrayers && character.knowsPrayers) {
          this.displayPriest();
        } else {
          stopProcessing = false;
        }
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
        this.changeLevel(parseInt(key) - 1);
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
      name: [WizardryConstants.TRAIN_CHARACTER_CHANGE_CLASS, "_ui_frame"].join(""),
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
            { cell: [0, 2] },
            { cell: [39, 2] }
          ]
        },
        {
          points: [
            { cell: [0, 0] },
            { cell: [0, 2] },
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
            { cell: [0, 5] },
            { cell: [39, 5] }
          ]
        },
        {
          points: [
            { cell: [9, 6] },
            { cell: [9, 17] }
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
            { cell: [0, 22] },
            { cell: [39, 22] }
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
        1 / 24, // title
        1 / 24, // border
        2 / 24, // spells by level
        1 / 24, // border
        13 / 24, // spell listing
        1 / 24, // border
        2 / 24, // menu
        1 / 24, // border
        1 / 24, // messages
      ]
    });
    { // character header
      this._characterBlock = this._parent.createTextBlock();
      this._configuration.addControl(this._characterBlock, 1, 1);
    }

    { // spells left
      let grid = WizardryScene.createGrid({
        columns: [2 / 38, 21 / 38, 1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38,  1 / 38, 2 / 38],
        rows: [1 / 2,  1/ 2]
      });
      this._configuration.addControl(grid, 3, 1);

      grid.addControl(this._parent.createTextBlock({
        text: "MAGE   SPELLS LEFT = ",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
      }), 0, 1);
      
      for (let i = 0; i < 7; i++) {
        let text = this._parent.createTextBlock({ text: "0" });
        this._mageSpellBlocks.push(text);
        grid.addControl(text, 0, 2 + i * 2);
        if (i + 1 < 7) {
          grid.addControl(this._parent.createTextBlock({ text: "/" }), 0, 3 + i * 2);
        }
      }

      grid.addControl(this._parent.createTextBlock({
        text: "PRIEST SPELLS LEFT = ",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
      }), 1, 1);
      
      for (let i = 0; i < 7; i++) {
        let text = this._parent.createTextBlock({ text: "0" });
        this._priestSpellBlocks.push(text);
        grid.addControl(text, 1, 2 + i * 2);
        if (i + 1 < 7) {
          grid.addControl(this._parent.createTextBlock({ text: "/" }), 1, 3 + i * 2);
        }
      }
    }
    { // spells listing and description
      this._spellsGrid = WizardryScene.createGrid({
        rows: [12 / 13,  1/ 13]
      });
      this._configuration.addControl(this._spellsGrid, 5, 1);

      let twoColumnGrid = WizardryScene.createGrid({
        columns: [9 / 38, 29 / 38]
      })
      this._spellsGrid.addControl(twoColumnGrid, 0, 0);
      { // listing of spells by level
        this._spellListingGrid = WizardryScene.createGrid({
          rows: [1 / 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12,  1/ 12]
        });
        twoColumnGrid.addControl(this._spellListingGrid, 0, 0);
      }
      { // spell display
        let subGrid = WizardryScene.createGrid({
          rows: [1 / 12, 2 / 12, 1 / 12, 1 / 12, 1 / 12, 6 / 12]
        })
        twoColumnGrid.addControl(subGrid, 0, 1);
        this._spellDescriptionObject.name = this._parent.createTextBlock();
        this._spellDescriptionObject.translation = this._parent.createTextBlock({
          lineSpacing: "3px",
          resizeToFit: false,
          textWrapping: true,
        });
        this._spellDescriptionObject.level = this._parent.createTextBlock({
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        });
        this._spellDescriptionObject.type = this._parent.createTextBlock({
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        });
        this._spellDescriptionObject.aoe = this._parent.createTextBlock({
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        });
        this._spellDescriptionObject.description = this._parent.createTextBlock({
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: true,
          textWrapping: BABYLON.GUI.TextWrapping.WordWrap,
        });
        let row = 0;
        subGrid.addControl(this._spellDescriptionObject.name, row++, 0);
        subGrid.addControl(this._spellDescriptionObject.translation, row++, 0);
        subGrid.addControl(this._spellDescriptionObject.level, row++, 0);
        subGrid.addControl(this._spellDescriptionObject.type, row++, 0);
        subGrid.addControl(this._spellDescriptionObject.aoe, row++, 0);
        let scrollViewer = WizardryScene.createScrollViewer();
        subGrid.addControl(scrollViewer, row++, 0);
        scrollViewer.addControl(this._spellDescriptionObject.description);

      }
      
      const spells = WizardrySpell.values;
      spells.sort(this.sortSpells);
      for (let i = 0, li = spells.length; i < li; i++) {
        const spell = spells[i];
        this._spellWidgets[[spells[i]]] = this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => {
              // fill display fields
              this._spellDescriptionObject.name.text = spell.title;
              this._spellDescriptionObject.translation.text = spell.translation;
              this._spellDescriptionObject.level.text = ["LEVEL: ", spell.level + 1].join("");
              this._spellDescriptionObject.aoe.text = ["AREA OF EFFECT: ", spell.aoe].join("");
              this._spellDescriptionObject.type.text = ["TYPE: ", spell.type].join("");
              this._spellDescriptionObject.description.text = spell.description;
            }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable:   [() => { }]
          },
          text: {
            text: spell.title,
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container;
      }

      for (let i = 0, li = 7; i < li; i++) {
        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;

        panel.addControl(this._parent.createTextBlock({ text: "LEVEL ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

        for (let j = 0, lj = 7; j < lj; j++) {
          if (j === i) {
            panel.addControl(this._parent.createButton({
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable:   [() => { }]
              },
              text: {
                text: [" ", (j + 1), " "].join(""),
                horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
              }
            }).container);
          } else {
            panel.addControl(this._parent.createButton({
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: [() => { this.changeLevel(j); }],
                onPointerEnterObservable: [() => { }],
                onPointerOutObservable:   [() => { }]
              },
              text: {
                text: ["(", (j + 1), ")"].join(""),
                horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
              }
            }).container);
          }
        }
        this._levelPanels.push(panel);
      }
    }

    { // menu      
      this._menuGrid = WizardryScene.createGrid({
        columns: [8 / 38, 30 / 38],
        rows: [1 / 2, 1 / 2]
      });
      this._configuration.addControl(this._menuGrid, 7, 1);

      this._menuGrid.addControl(this._parent.createTextBlock({
        text: "YOU MAY ",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT,
        textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
      }), 0, 0);

      this._spellPanel = new BABYLON.GUI.StackPanel();
      this._spellPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      this._spellPanel.isVertical = false;

      this._spellPanel.addControl(this._parent.createTextBlock({ text: "SEE ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

      this._spellPanel.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.displayMage(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable:   [() => { }]
        },
        text: {
          text: "M)AGE",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);

      this._spellPanel.addControl(this._parent.createTextBlock({ text: " OR ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

      this._spellPanel.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.displayPriest(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable:   [() => { }]
        },
        text: {
          text: "P)RIEST",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);

      this._spellPanel.addControl(this._parent.createTextBlock({ text: " SPELL BOOKS ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

      this._leaveButton = this._parent.createButton({
        key: "LEAVE",
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.leave(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "OR L)EAVE.",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      });
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
      this._configuration.addControl(this._messageBlock, 9, 1);
    } 

    return this._configuration;
  }
  /**
   * Leaves the scene state.
   */
  leave() {
    this._currentLevel = 0;
    this._parent.state = WizardryConstants.INSPECT_CHARACTER_MAIN;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set()
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
    for (let i = 0, li = this._mageSpellBlocks.length; i < li; i++) {
      this._mageSpellBlocks[i].text = character.mageSpells[i].toString();
    }
    for (let i = 0, li = this._priestSpellBlocks.length; i < li; i++) {
      this._priestSpellBlocks[i].text = character.priestSpells[i].toString();
    }
    if (character.knowsMagic && !character.knowsPrayers) {
      this._currentBook = "MAGE";
    } else if (!character.knowsMagic && character.knowsPrayers) {
      this._currentBook = "PRIEST";
    }
    { // spells
      const controls = this._spellListingGrid.children;
      let row = 0;
      for (let i = controls.length - 1; i >= 0; i--) {
        this._spellListingGrid.removeControl(controls[i]);
      }
      const spells = WizardrySpell.values;
      spells.sort(this.sortSpells);
      for (let i = 0, li = spells.length; i < li; i++) {
        if (spells[i].clazz !== this._currentBook) {
          continue;
        }
        if (spells[i].level !== this._currentLevel) {
          continue;
        }
        if (!character.spellsKnown[[spells[i]]]) {
          continue;
        }
        this._spellListingGrid.addControl(this._spellWidgets[[spells[i]]], row++, 0);
      }
    }
    { // levels
      for (let i = this._levelPanels.length - 1; i >= 0; i--) {
        this._spellsGrid.removeControl(this._levelPanels[i]);
      }
      this._spellsGrid.addControl(this._levelPanels[this._currentLevel], 1, 0);
    }
    { // spell description
      this._spellDescriptionObject.name.text = "";
      this._spellDescriptionObject.translation.text = "";
      this._spellDescriptionObject.level.text = "";
      this._spellDescriptionObject.aoe.text = "";
      this._spellDescriptionObject.type.text = "";
      this._spellDescriptionObject.description.text = "";
    }
    { // menu
      this._menuGrid.removeControl(this._spellPanel);
      this._menuGrid.removeControl(this._leaveButton.container);
      if (character.knowsMagic && character.knowsPrayers) {
        this._menuGrid.addControl(this._spellPanel, 0, 1);
        this._menuGrid.addControl(this._leaveButton.container, 1, 1);
        this._leaveButton.text.text = "OR L)EAVE"
      } else {
        this._menuGrid.addControl(this._leaveButton.container, 0, 1);
        this._leaveButton.text.text = "L)EAVE"
      }
    }
  }
  /**
   * A compare function for sorting WizardrySpell members.
   * @param {WizardrySpell} a spell a
   * @param {WizardrySpell} b spell b
   * @returns {Number} the comparison value
   */
  sortSpells(a, b) {
    let c = 0;
    if (a.clazz < b.clazz) {
      c = -1;
    } else if (a.clazz > b.clazz) {
      c = 1;
    }
    if (c === 0) {
      if (a.level < b.level) {
        c = -1;
      } else if (a.level > b.level) {
        c = 1;
      }
      if (c === 0) {
        if (a.name < b.name) {
          c = -1;
        } else if (a.name > b.name) {
          c = 1;
        }
      }
    }
    return c;
  }
}

export { WizardryCampReadSpellsMainUi };