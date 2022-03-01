import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }                  from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE,
  WizardryUiConfiguration }        from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene }    from "../../../wizardry-ui-state-scene.js";
import * as Materials              from "../../../../components/materials/materials.js";
import { WizardryEquipmentPanel }  from "../../../../components/ui/wizardry-equipment-panel.js";
import { DIV24,
  DIV38,
  DIV4,
  DIV40,
  WizardryAttribute,
  WizardryCharacterClass,
  WizardryCharacterStatus,
  WizardryConstants,
  WizardryXgoto }                  from "../../../../config/wizardry-constants.js";
import { WizardryController }      from "../../../../services/wizardry-controller.js";
import { Dice } from "../../../../../../assets/js/base.js";

/**
 * @class Ui class for the Main state of the Training scene.
 */
class WizardryCampInspectMainUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private array of 8 integers. */
    this._objIds = [];
    /** @private ARRAY[ 0..7] OF ARRAY[ FALSE..TRUE] OF STRING[ 15]; */
    this._objNames = [];
    /** @private array of 8 booleans. */
    this._cursed = [];
    /** @private array of 8 booleans. */
    this._canUse = [];
    this._displayStats = true;
    this._objI = 0;
    this._unused = 0;
    this._campChar = 0;

    { // UI blocks
      /** @private the BABYLON.GUI.TextBlock used to display the character's ac. */
      this._acBlock = null;
      /** @private the BABYLON.GUI.TextBlock used to display the character's age. */
      this._ageBlock = null;
      /** @private the BABYLON.GUI.TextBlocks used to display the character's attribute scores. */
      this._attributeValueBlocks = [];
      /** @private the BABYLON.GUI.TextBlock used to display the character's exp. */
      this._expBlock = null;
      /** @private the BABYLON.GUI.TextBlock used to display the character's gold. */
      this._goldBlock = null;
      /** @private the BABYLON.GUI.TextBlock used to display the character's hp. */
      this._hpBlock = null;
      /** @private the BABYLON.GUI.TextBlocks used to display the character's items. */
      this._itemBlocks = [];
      /** @private the BABYLON.GUI.TextBlock used to display the character's exp. */
      this._levelBlock = null;
      /** @private the BABYLON.GUI.TextBlock used to display the character's name. */
      this._nameBlock = null;
      /** @private the list of BABYLON.GUI.TextBlocks used to display the number of known mage spells. */
      this._numMageSpellsBlock = [];
      /** @private the list of BABYLON.GUI.TextBlocks used to display the number of known mage spells. */
      this._numPriestSpellsBlock = [];
      /** @private the BABYLON.GUI.TextBlock used to display the character's status. */
      this._statusBlock = null;
    }
    /**
     * the equipment panel.
     * @private
     * @type {WizardryEquipmentPanel}
     */
    this._equipmentPanel = new WizardryEquipmentPanel({
      parent: this,
      callback: this.activateEquipmentItem
    });
    /**
     * the dictionary of menu configurations.
     * @private
     * @type {object}
     */
    this._menus = {};

  }
  /**
   * Gets the equipment panel displayed.
   */
  get equipmentPanel() {
    return this._equipmentPanel;
  }
  /**
   * Goes to the Inspection scene.
   * @param {String} refId the reference id of the character being inspected
   */
  activateEquipmentItem(refId) {
    if (!this.hasOwnProperty("_equipmentPanel")) {
      this.parent._menus[this.parent._parent.state].activateEquipmentItem(refId);
    } else {
      this._menus[this._parent.state].activateEquipmentItem(refId);
    }
  }
  /**
   * Displays the character's stats.
   * @param {WizardryCharacter} character the current character
   */
  displayStats(character) {
    { // name
      let charBlock = [character.name, " "];
      if (character.lostXyl.awards[3] > 0) {
        // do chevrons
      }
      charBlock.push(character.race.title, " ", character.alignment.title.substring(0, 1), "-", character.clazz.title);
      this._nameBlock.text = charBlock.join("");
    }
    { // attribute scores      
      const attributes = WizardryAttribute.values;
      for (let i = 0, li = attributes.length; i < li; i++) {
        let score = character.getAttribute(attributes[i]);
        this._attributeValueBlocks[i].text = [score < 10 ? " " : "", score].join("");
      }
    }
    { // miscellaneous
      this._goldBlock.text = character.gold.toString();
      this._expBlock.text = character.exp.toString();
      this._levelBlock.text = character.charLev.toString();
      this._ageBlock.text = Math.floor(character.age / 52).toFixed(0).toString();
      this._hpBlock.text = [character.hpLeft, "/", character.hpMax].join("");
      this._acBlock.text = (character.armorCl - WizardryController.acMod2).toString();
      this._statusBlock.text = [character.status.title, character.lostXyl.poisonAmt[0] > 0 ? " & POISONED" : ""].join("");
    }
    { // spells
      for (let i = character.mageSpells.length - 1; i >= 0; i--) {
        this._numMageSpellsBlock[i].text = character.mageSpells[i].toString();
      }
      for (let i = character.priestSpells.length - 1; i >= 0; i--) {
        this._numPriestSpellsBlock[i].text = character.priestSpells[i].toString();
      }
    }
    { // equipment
      this._equipmentPanel.set();
    }
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    this._menus[this._parent.state].handleKeyEntry(key);
  }
  /**
   * Initalizes the view.
   */
  init() {
    const baseOutline = [
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
          { cell: [0, 9] },
          { cell: [39, 9] }
        ]
      },
      {
        points: [
          { cell: [0, 0] },
          { cell: [0, 19] }
        ]
      },
      {
        points: [
          { cell: [15, 2] },
          { cell: [15, 9] }
        ]
      },
      {
        points: [
          { cell: [39, 0] },
          { cell: [39, 19] }
        ]
      },
      {
        points: [
          { cell: [0, 12] },
          { cell: [39, 12] }
        ]
      },
      {
        points: [
          { cell: [0, 19] },
          { cell: [39, 19] }
        ]
      },
    ];
    let equipmentOutline = [].concat(baseOutline);
    equipmentOutline.push({
      points: [
        { cell: [0, 21] },
        { cell: [39, 21] }
      ]
    });
    this._parent.createScreenOutline({
      name: [WizardryConstants.INSPECT_CHARACTER_MAIN, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: baseOutline
    });
    this._parent.createScreenOutline({
      name: [WizardryConstants.INSPECT_DROP_MAIN, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: equipmentOutline
    });
    this.initializeConfiguration({
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - character name
        DIV24,     // border
        6 * DIV24, // 3 - attributes - lines 3-8
        DIV24,     // border
        2 * DIV24, // 5 - spells - lines 10-11
        DIV24,     // border
        6 * DIV24, // 7 - equipment - lines 13-18
        DIV24,     // border
        4 * DIV24, // 9 - menu - lines 20-23
      ]
    });
    { // 1 - name
      this._nameBlock = this._parent.createTextBlock();
      this.configuration.addControl(this._nameBlock, 1, 1);
    }
    { // 3 - attributes
      let attributesGrid = WizardryScene.createGrid({
        columns: [
          14 / 38, // col 1
           1 / 38, // spacer
          23 / 38, // col 2
        ]
      });
      this.configuration.addControl(attributesGrid, 3, 1);
      { // col 1 attributes
        let col1Grid = WizardryScene.createGrid({
          columns: [
            11 / 14, // label
             1 / 14, // spacer
             2 / 14, // value
          ],
          rows: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]
        });
        attributesGrid.addControl(col1Grid, 1, 0);

        const attributes = WizardryAttribute.values;
        for (let i = 0, li = attributes.length; i < li; i++) {
          col1Grid.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: attributes[i].title,
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, i, 0);
          let text = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT, textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          col1Grid.addControl(text, i, 2);
          this._attributeValueBlocks.push(text);
        }
      }
      { // col 2 miscellaneous
        let col2Grid = WizardryScene.createGrid({
          rows: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]
        });
        attributesGrid.addControl(col2Grid, 1, 2);
        const LEFT_COL = 6 / 23, SPACER = 1 / 23;
        let row = 0;
        { // gold
          let newRow = WizardryScene.createGrid({
            columns: [LEFT_COL, SPACER, 16 / 23]
          });
          col2Grid.addControl(newRow, row++, 0);
  
          newRow.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "GOLD",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 0);
          this._goldBlock = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT, textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          newRow.addControl(this._goldBlock, 0, 2);
        }
        { // exp
          let newRow = WizardryScene.createGrid({
            columns: [LEFT_COL, SPACER, 16 / 23]
          });
          col2Grid.addControl(newRow, row++, 0);
  
          newRow.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "EXP",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 0);
          this._expBlock = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          newRow.addControl(this._expBlock, 0, 2);
        }
        row++;
        { // level/age
          let newRow = WizardryScene.createGrid({
            columns: [
              LEFT_COL, // label
              SPACER, // spacer
              2 / 23, // value
              SPACER, // spacer
              6 / 23, // label
              SPACER, // spacer
              6 / 23 // value
            ]
          });
          col2Grid.addControl(newRow, row++, 0);
  
          newRow.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "LEVEL",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 0);
          this._levelBlock = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          newRow.addControl(this._levelBlock, 0, 2);
  
          newRow.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "AGE",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 4);
          this._ageBlock = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          newRow.addControl(this._ageBlock, 0, 6);
        }
        { // hits/ac
          let newRow = WizardryScene.createGrid({
            columns: [
              LEFT_COL, // label
              SPACER, // spacer
              7 / 23, // value
              SPACER, // spacer
              2 / 23, // label
              SPACER, // spacer
              6 / 23 // value
            ]
          });
          col2Grid.addControl(newRow, row++, 0);
  
          newRow.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "HITS",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 0);
          this._hpBlock = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          newRow.addControl(this._hpBlock, 0, 2);
  
          newRow.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "AC",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 4);
          this._acBlock = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          newRow.addControl(this._acBlock, 0, 6);
        }
        { // status
          let newRow = WizardryScene.createGrid({
            columns: [LEFT_COL, SPACER, 16 / 23]
          });
          col2Grid.addControl(newRow, row++, 0);
  
          newRow.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "STATUS",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 0);
          this._statusBlock = this._parent.createTextBlock({  horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT });
          newRow.addControl(this._statusBlock, 0, 2);
        }
      }
    }
    { // 5 - spells
      let spellsGrid = WizardryScene.createGrid({
        columns: [
           7 / 38, // spacer
           6 / 38, // titles
           1 / 38, // spacer
          20 / 38, // spells
          4 / 38, // empty
        ],
        rows: [1 / 2, 1 / 2]
      });
      this.configuration.addControl(spellsGrid, 5, 1);

      spellsGrid.addControl(this._parent.createTextBlock({ text: "MAGE" }), 0, 1);
      spellsGrid.addControl(this._parent.createTextBlock({ text: "PRIEST" }), 1, 1);
      { // mage spells
        let newRow = WizardryScene.createGrid({
          columns: [
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
          ]
        });
        spellsGrid.addControl(newRow, 0, 3);
        for (let i = 0, li = 7; i < li; i++) {
          let text = this._parent.createTextBlock();
          newRow.addControl(text, 0, i * 2);
          this._numMageSpellsBlock.push(text);
          if (i + 1 < li) {
            newRow.addControl(this._parent.createTextBlock({ text: "/" }), 0, i * 2 + 1);
          }
        }
      }
      { // priest spells
        let newRow = WizardryScene.createGrid({
          columns: [
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
            1 / 20, // slash
            2 / 20, // # spells
          ]
        });
        spellsGrid.addControl(newRow, 1, 3);
        for (let i = 0, li = 7; i < li; i++) {
          let text = this._parent.createTextBlock();
          newRow.addControl(text, 0, i * 2);
          this._numPriestSpellsBlock.push(text);
          if (i + 1 < li) {
            newRow.addControl(this._parent.createTextBlock({ text: "/" }), 0, i * 2 + 1);
          }
        }
      }
    }
    { // 7 - equipment
      this.configuration.addControl(this._equipmentPanel.container, 7, 1);      
    }
    { // 9 - menu
      this._menus[WizardryConstants.INSPECT_CHARACTER_MAIN] = new MainMenuInterface(this);
      this._menus[WizardryConstants.INSPECT_DROP_MAIN] = new DropItemInterface(this);
    }
    /*
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
      this.configuration.addControl(this._messageBlock, 11, 1);
    }
    */

    return this.configuration;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    /** the character being inspected. */
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    this.displayStats(character);
    this._equipmentPanel.set();
    for (let state in this._menus) {
      this._menus[state].isVisible = false;
    }
    this._menus[this._parent.state].isVisible = true;
  }
}

/**
 * Class to display and handle events for the Main Menu state.
 * @class
 */
class MainMenuInterface {
  /**
   * Creates a new instance of MainMenuInterface.
   * @param {WizardryCampInspectMainUi} parent the parent UI
   */
  constructor(parent) {
    /**
     * the list of menu configurations.
     * @private
     * @type {BABYLON.GUI.Grid[]}
     */
    this._menus = [];
    /**
     * the parent UI.
     * @private
     * @type {WizardryCampInspectMainUi}
     */
    this._parentUi = parent;
    this.init();
  }
  /**
   * Sets the menu visibility.
   * @param {Boolean} show
   */
  set isVisible(show) {
    /** the character being inspected. */
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    // hide all the menus
    for (let i = this._menus.length - 1; i >= 0; i--) {
      this._menus[i].isVisible = false;
    }
    if (show) {
      this._parentUi.equipmentPanel.enable(false);
      const menuType = this.getMenuType(character);
      let children;
      switch (menuType) {
        case 0:
          children = this._menus[menuType].children[0].children;
          if (character.knowsMagic || character.knowsPrayers) {
            children[1].isVisible = true;
            children[2].isVisible = true;
          } else {
            children[1].isVisible = false;
            children[2].isVisible = false;
          }
          break;
        case 1:
          children = this._menus[menuType].children[2].children;
          if (character.knowsMagic || character.knowsPrayers) {
            children[0].isVisible = true;
            children[1].isVisible = true;
          } else {
            children[0].isVisible = false;
            children[1].isVisible = false;
          }
          break;
        case 2:
          // TB, SP1, SP2, SP3, SP4
          const SP3 = this._menus[menuType].children[3];
          const SP4 = this._menus[menuType].children[4];
          children = this._menus[menuType].children;
          if (character.knowsMagic || character.knowsPrayers) {
            // remove SP3 and 4
            this._menus[menuType].removeControl(SP3);
            this._menus[menuType].removeControl(SP4);
            // add 3 to 2,1
            this._menus[menuType].addControl(SP3, 2, 1);
            // add 4 to 3,1
            this._menus[menuType].addControl(SP4, 3, 1);
            // make SP2 visible
            children[2].isVisible = true;
          } else {
            // remove SP3 and 4
            this._menus[menuType].removeControl(SP3);
            this._menus[menuType].removeControl(SP4);
            // add 3 to 1,1
            this._menus[menuType].addControl(SP3, 1, 1);
            // add 4 to 2,1
            this._menus[menuType].addControl(SP4, 2, 1);
            // make SP2 invisible
            children[2].isVisible = false;
          }
          if (character.clazz === WizardryCharacterClass.BISHOP) {
            SP3.children[2].isVisible = true;
            SP3.children[3].isVisible = true;
          } else {
            SP3.children[2].isVisible = false;
            SP3.children[3].isVisible = false;
          }
          break;
      }
      this._menus[menuType].isVisible = true;
    }
  }
  /**
   * Casts a spell.
   */
  cast() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_CAST_MAIN;
  }
  /**
   * Drops an item.
   */
  drop() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_DROP_MAIN;
  }
  /**
   * Equips an item.
   */
  equip() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_EQUIP_MAIN;
  }
  /**
   * Gets the menu configuration.
   * @param {WizardryCharacter} character the current character
   * @returns {Number} the menu configuration identifier
   */
  getMenuType(character) {
    // default inspection scene allows player to EQUIP, DROP, TRADE, READ, CAST, USE, IDENTIFY, LEAVE
    let menuType = 2;
    switch (WizardryController.xgoto2) {
      case WizardryXgoto.XGILGAMS:
        // tavern inspection scene allows player to EQUIP, DROP, TRADE, READ, LEAVE
        menuType = 1;
        break;
      case WizardryXgoto.XTRAINCHAR:
        // training inspection scene allows player to READ, LEAVE
        menuType = 0;
        break;
      default:
        if (character.status !== WizardryCharacterStatus.OK) {
          menuType = 1;
        }
        break;
    }
    return menuType;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    const menuType = this.getMenuType(character);
    let validInput = true;
    switch (key.toUpperCase()) {
      case "L":
      case "ENTER":
      case "ESCAPE":
        this.leave();
        break;
      case "R":
        if (character.knowsMagic || character.knowsPrayers) {
          this.readSpellBooks();
        } else {
          validInput = false;
        }
        break;
      case "E":
        switch (menuType) {
          case 1:
          case 2:
            this.equip();
            break;
          default:
            validInput = false;
        }
        break;
      case "D":
        switch (menuType) {
          case 1:
          case 2:
            this.drop();
            break;
          default:
            validInput = false;
        }
        break;
      case "T":
        switch (menuType) {
          case 1:
          case 2:
            this.trade();
            break;
          default:
            validInput = false;
        }
        break;
      case "C":
        switch (menuType) {
          case 2:
            this.cast();
            break;
          default:
            validInput = false;
        }
        break;
      case "U":
        switch (menuType) {
          case 2:
            this.useItem();
            break;
          default:
            validInput = false;
        }
        break;
      case "I":
        if (character.clazz === WizardryCharacterClass.BISHOP) {
          switch (menuType) {
            case 2:
              this.identify();
              break;
            default:
              validInput = false;
          }
        } else {
          validInput = false;
        }
        break;
      default:
        validInput = false;
        break;
    }
    if (!validInput) {
      /*
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      */
    }
  }
  /**
   * Identifies an item.
   */
  identify() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_IDENTIFY_MAIN;
  }
  /**
   * Initializes the interface.
   */
  init() {
    { // version #1
      let grid = WizardryScene.createGrid({
        rows: [DIV4, DIV4, DIV4, DIV4]
      });
      grid.isVisible = false;
      this._parentUi.configuration.addControl(grid, 9, 1);
      this._menus.push(grid);

      const panel = new BABYLON.GUI.StackPanel();
      panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel.isVertical = false;
      grid.addControl(panel, 0, 0);

      panel.addControl(this._parentUi._parent.createTextBlock({
        text: "YOU MAY ",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT,
        textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
      }));

      panel.addControl(this._parentUi._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.readSpellBooks(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "R)EAD SPELL BOOKS",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);

      panel.addControl(this._parentUi._parent.createTextBlock({
        text: ", OR ",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
        textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
      }));

      panel.addControl(this._parentUi._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.leave(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "L)EAVE",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container);

      panel.addControl(this._parentUi._parent.createTextBlock({
        text: ".",
        horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
        textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
      }));
    }
    { // version #2
      let grid = WizardryScene.createGrid({
        columns: [ 8 * DIV38, 30 * DIV38],
        rows: [DIV4, DIV4, DIV4, DIV4]
      });
      grid.isVisible = false;
      this._parentUi.configuration.addControl(grid, 9, 1);
      this._menus.push(grid);

      { // YOU MAY
        grid.addControl(this._parentUi._parent.createTextBlock({
          text: "YOU MAY ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
        }), 0, 0);
      }
      { // row 1 - equip, drop, trade
        const panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 0, 1);

        panel.addControl(this._parentUi._parent.createButton({
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

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ", ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.drop(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "D)ROP AN ITEM",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ", ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.trade(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "T)RADE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ",",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));
      }
      { // row 2 - read, leave
        const panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 1, 1);

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.readSpellBooks(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "R)EAD SPELL BOOKS",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ", ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: "OR ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.leave(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "L)EAVE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ".",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));
      }
    }
    { // version #3
      let grid = WizardryScene.createGrid({
        columns: [ 8 * DIV38, 30 * DIV38],
        rows: [DIV4, DIV4, DIV4, DIV4]
      });
      grid.isVisible = false;
      this._parentUi.configuration.addControl(grid, 9, 1);
      this._menus.push(grid);

      { // YOU MAY
        grid.addControl(this._parentUi._parent.createTextBlock({
          text: "YOU MAY ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
        }), 0, 0);
      }
      { // row 1 - equip, drop, trade
        const panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 0, 1);

        panel.addControl(this._parentUi._parent.createButton({
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

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ", ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.drop(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "D)ROP AN ITEM",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ", ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.trade(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "T)RADE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ",",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));
      }
      { // row 2 - read, cast
        const panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 1, 1);

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.readSpellBooks(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "R)EAD SPELL BOOKS",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ", ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.cast(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "CAST S)PELLS",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ",",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));
      }
      { // row 3 - use, identify
        const panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 2, 1);

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.useItem(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "U)SE AN ITEM",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ", ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.identify(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "I)DENTIFY AN ITEM",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ",",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));
      }
      { // row 4 - leave
        const panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 3, 1);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: "OR ",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));

        panel.addControl(this._parentUi._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.leave(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "L)EAVE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parentUi._parent.createTextBlock({
          text: ".",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT,
          textHorizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }));
      }
    }
  }
  /**
   * Leaves the scene.
   */
  leave() {    
    WizardryController.xgoto = WizardryController.xgoto2;
    this._parentUi._parent.exitScene();
  }
  /**
   * Reads the character's spell books.
   */
  readSpellBooks() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_READ_SPELLS_MAIN;
  }
  /**
   * Trades among the party.
   */
  trade() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_TRADE_MAIN;
  }
  /**
   * Uses an item.
   */
  useItem() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_USE_MAIN;
  }
}

/**
 * Class to display and handle events for the Drop Item state.
 * @class
 */
class DropItemInterface {
  /**
   * Creates a new instance of DropItemInterface.
   * @param {WizardryCampInspectMainUi} parent the parent UI
   */
  constructor(parent) {
    this._menu;
    /**
     * the entry block used for displaying user entry.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._entryBlock;
    /**
     * the entry block used for displaying messages.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._messageBlock;
    /**
     * the parent UI.
     * @private
     * @type {WizardryCampInspectMainUi}
     */
    this._parentUi = parent;
    this.init();
  }
  /**
   * Sets the menu visibility.
   * @param {Boolean} show
   */
  set isVisible(show) {
    this._parentUi.equipmentPanel.enable(show);
    this._menu.isVisible = show;
  }
  /**
   * Goes to the Inspection scene.
   * @param {String} refId the reference id of the character being inspected
   */
  activateEquipmentItem(index) {
    if (isNaN(parseInt(index))) {
      throw ["invalid inventory index", index];
    }
    index = parseInt(index);
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    const possessionObject = character.possessions.possession[index];
    if (possessionObject.cursed) {
      this._parentUi._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "** CURSED **";
      this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else if (possessionObject.equipped) {
      this._parentUi._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "** EQUIPPED **";
      this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      // display the item entered
      const itemData = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);
      this._entryBlock.text = possessionObject.identified ? itemData.name : itemData.nameUnknown;

      // starting with the index of the dropped item, shift all possessions up 1
      for (let i = index, li = character.possessions.possession.length - 2; i <= li; i++) {
        const inventorySlot = character.possessions.possession[i], next = character.possessions.possession[i + 1];
        inventorySlot.cursed = next.cursed;
        inventorySlot.equipped = next.equipped;
        inventorySlot.equipmentIndex = next.equipmentIndex;
        inventorySlot.identified = next.identified;
      }

      // empty the last inventory slot
      const lastSlot = character.possessions.possession[character.possessions.possession.length - 1];
      lastSlot.cursed = false;
      lastSlot.equipped = false;
      lastSlot.equipmentIndex = -1;
      lastSlot.identified = false;

      /**
       * after a slight pause, clear the user entry and either reset the display or leave.
       * @type {void}
       */
      const action = () => {
        this._entryBlock.text = "";
        if (character.possessions.count === 0) {
          this.leave();
        } else {
          // reset the UI
          this._parentUi.set();
        }
      };

      if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
        action();
      } else {
        BABYLON.setAndStartTimer({
          timeout: KEYBOARD_ENTRY_DELAY,
          contextObservable: this._parentUi._parent.onBeforeRenderObservable,
          breakCondition: () => {
            // this will check if we need to break before the timeout has reached
            return this._parentUi._parent.isDisposed;
          },
          onEnded: (data) => {
            // this will run when the timeout has passed
            action();
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
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    let validInput = true;
    switch (key.toUpperCase()) {
      case "0":
      case "ENTER":
      case "ESCAPE":
        this.leave();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        if (parseInt(key) <= character.possessions.count) {
          this.activateEquipmentItem(parseInt(key) - 1);
        } else {
          validInput = false;
        }
        break;
      default:
        validInput = false;
        break;
    }
    if (!validInput) {
      this._parentUi._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  init() {
    // top-level container
    this._menu = WizardryScene.createGrid({
      rows: [DIV4, DIV4, DIV4, DIV4]
    });
    this._menu.isVisible = false;
    this._parentUi.configuration.addControl(this._menu, 9, 1);

    { // entry prompt
      let panel = new BABYLON.GUI.StackPanel();
      panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel.isVertical = false;
      this._menu.addControl(panel, 0, 0);

      panel.addControl(this._parentUi._parent.createTextBlock({ text: "DROP ITEM (0=EXIT) ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}));

      this._entryBlock = this._parentUi._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      panel.addControl(this._entryBlock);

      let o = WizardryScene.createBlinkingCursor();
      panel.addControl(o.cursor);
      this._parentUi._parent.beginDirectAnimation(
        o.cursor, //the target where the animation will take place
        [o.visible], // the list of animations to start
        0, // the initial frame
        ALPHA_FADE_FRAMERATE, // the final frame
        true // if you want animation to loop (off by default)
      );
    }
    { // add messages display - JESUS this took too much experimenting to find the right way to style this text
      this._messageBlock = this._parentUi._parent.createTextBlock();
      if (typeof(this._messageBlock.animations) === "undefined") {
        this._messageBlock.animations = [];
      }
      this._messageBlock.animations.push(FADE);
      this._menu.addControl(this._messageBlock, 2, 0);
    }
  }
  /**
   * Return to the main menu.
   */
  leave() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_CHARACTER_MAIN;
  }
}

/**
 * Class to display and handle events for the Drop Item state.
 * @class
 */
class IdentifyItemInterface {
  /**
   * Creates a new instance of IdentifyItemInterface.
   * @param {WizardryCampInspectMainUi} parent the parent UI
   */
  constructor(parent) {
    this._menu;
    /**
     * the entry block used for displaying user entry.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._entryBlock;
    /**
     * the entry block used for displaying messages.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._messageBlock;
    /**
     * the parent UI.
     * @private
     * @type {WizardryCampInspectMainUi}
     */
    this._parentUi = parent;
    this.init();
  }
  /**
   * Sets the menu visibility.
   * @param {Boolean} show
   */
  set isVisible(show) {
    this._parentUi.equipmentPanel.enable(show);
    this._menu.isVisible = show;
  }
  /**
   * Goes to the Inspection scene.
   * @param {String} refId the reference id of the character being inspected
   */
  activateEquipmentItem(index) {
    if (isNaN(parseInt(index))) {
      throw ["invalid inventory index", index];
    }
    index = parseInt(index);
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    const possessionObject = character.possessions.possession[index];
    if (possessionObject.identified) {
      this.leave();
    } else {
      /**
       * after a slight pause, clear the user entry and either reset the display.
       * @type {void}
       */
      const action = () => {
        this._entryBlock.text = "";        
        const itemData = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);
        possessionObject.identified = Dice.rollDie(100) - 1 < (10 + 5 * character.charLev);
        const s = ["** "];
        if (possessionObject.identified) {
          s.push("SUCCESS!")
        } else {
          s.push("FAILURE")
        }
        if (!possessionObject.cursed) {
          if (Dice.rollDie(100) - 1 < 35 - 3 * character.charLev) {
            possessionObject.cursed = itemData.cursed;
            if (possessionObject.cursed) {
              s.push(" - IT WAS CURSED!");
            }
          }
        }
        s.push(" **");
        this._parentUi._parent.stopAnimation(this._messageBlock);
        this._messageBlock.text = s.join("");
        this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        // reset the UI
        this._parentUi.set();
      };
      if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
        action();
      } else {
        BABYLON.setAndStartTimer({
          timeout: KEYBOARD_ENTRY_DELAY,
          contextObservable: this._parentUi._parent.onBeforeRenderObservable,
          breakCondition: () => {
            // this will check if we need to break before the timeout has reached
            return this._parentUi._parent.isDisposed;
          },
          onEnded: (data) => {
            // this will run when the timeout has passed
            action();
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
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    let validInput = true;
    switch (key.toUpperCase()) {
      case "0":
      case "ENTER":
      case "ESCAPE":
        this.leave();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        if (parseInt(key) <= character.possessions.count) {
          this.activateEquipmentItem(parseInt(key) - 1);
        } else {
          validInput = false;
        }
        break;
      default:
        validInput = false;
        break;
    }
    if (!validInput) {
      this._parentUi._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  init() {
    // top-level container
    this._menu = WizardryScene.createGrid({
      rows: [DIV4, DIV4, DIV4, DIV4]
    });
    this._menu.isVisible = false;
    this._parentUi.configuration.addControl(this._menu, 9, 1);

    { // entry prompt
      let panel = new BABYLON.GUI.StackPanel();
      panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel.isVertical = false;
      this._menu.addControl(panel, 0, 0);

      panel.addControl(this._parentUi._parent.createTextBlock({ text: "DROP ITEM (0=EXIT) ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}));

      this._entryBlock = this._parentUi._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      panel.addControl(this._entryBlock);

      let o = WizardryScene.createBlinkingCursor();
      panel.addControl(o.cursor);
      this._parentUi._parent.beginDirectAnimation(
        o.cursor, //the target where the animation will take place
        [o.visible], // the list of animations to start
        0, // the initial frame
        ALPHA_FADE_FRAMERATE, // the final frame
        true // if you want animation to loop (off by default)
      );
    }
    { // add messages display - JESUS this took too much experimenting to find the right way to style this text
      this._messageBlock = this._parentUi._parent.createTextBlock();
      if (typeof(this._messageBlock.animations) === "undefined") {
        this._messageBlock.animations = [];
      }
      this._messageBlock.animations.push(FADE);
      this._menu.addControl(this._messageBlock, 2, 0);
    }
  }
  /**
   * Return to the main menu.
   */
  leave() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_CHARACTER_MAIN;
  }
}

/**
 * Class to display and handle events for the Equip Item state.
 * @class
 */
class EquipItemInterface {
  /**
   * Creates a new instance of EquipItemInterface.
   * @param {WizardryCampInspectMainUi} parent the parent UI
   */
  constructor(parent) {
    this._menu;
    /**
     * the entry block used for displaying user entry.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._entryBlock;
    /**
     * the entry block used for displaying messages.
     * @private
     * @type {BABYLON.GUI.TextBlock}
     */
    this._messageBlock;
    /**
     * the parent UI.
     * @private
     * @type {WizardryCampInspectMainUi}
     */
    this._parentUi = parent;
    this.init();
  }
  /**
   * Sets the menu visibility.
   * @param {Boolean} show
   */
  set isVisible(show) {
    this._parentUi.equipmentPanel.enable(show);
    this._menu.isVisible = show;
  }
  /**
   * Goes to the Inspection scene.
   * @param {String} refId the reference id of the character being inspected
   */
  activateEquipmentItem(index) {
    if (isNaN(parseInt(index))) {
      throw ["invalid inventory index", index];
    }
    index = parseInt(index);
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    const possessionObject = character.possessions.possession[index];
    if (possessionObject.cursed) {
      this._parentUi._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "** CURSED **";
      this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else if (possessionObject.equipped) {
      this._parentUi._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "** EQUIPPED **";
      this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      // display the item entered
      const itemData = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);
      this._entryBlock.text = possessionObject.identified ? itemData.name : itemData.nameUnknown;

      // starting with the index of the dropped item, shift all possessions up 1
      for (let i = index, li = character.possessions.possession.length - 2; i <= li; i++) {
        const inventorySlot = character.possessions.possession[i], next = character.possessions.possession[i + 1];
        inventorySlot.cursed = next.cursed;
        inventorySlot.equipped = next.equipped;
        inventorySlot.equipmentIndex = next.equipmentIndex;
        inventorySlot.identified = next.identified;
      }

      // empty the last inventory slot
      const lastSlot = character.possessions.possession[character.possessions.possession.length - 1];
      lastSlot.cursed = false;
      lastSlot.equipped = false;
      lastSlot.equipmentIndex = -1;
      lastSlot.identified = false;

      /**
       * after a slight pause, clear the user entry and either reset the display or leave.
       * @type {void}
       */
      const action = () => {
        this._entryBlock.text = "";
        if (character.possessions.count === 0) {
          this.leave();
        } else {
          // reset the UI
          this._parentUi.set();
        }
      };

      if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
        action();
      } else {
        BABYLON.setAndStartTimer({
          timeout: KEYBOARD_ENTRY_DELAY,
          contextObservable: this._parentUi._parent.onBeforeRenderObservable,
          breakCondition: () => {
            // this will check if we need to break before the timeout has reached
            return this._parentUi._parent.isDisposed;
          },
          onEnded: (data) => {
            // this will run when the timeout has passed
            action();
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
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    let validInput = true;
    switch (key.toUpperCase()) {
      case "0":
      case "ENTER":
      case "ESCAPE":
        this.leave();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        if (parseInt(key) <= character.possessions.count) {
          this.activateEquipmentItem(parseInt(key) - 1);
        } else {
          validInput = false;
        }
        break;
      default:
        validInput = false;
        break;
    }
    if (!validInput) {
      this._parentUi._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parentUi._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  init() {
    // top-level container
    this._menu = WizardryScene.createGrid({
      rows: [DIV4, DIV4, DIV4, DIV4]
    });
    this._menu.isVisible = false;
    this._parentUi.configuration.addControl(this._menu, 9, 1);

    { // entry prompt
      let panel = new BABYLON.GUI.StackPanel();
      panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel.isVertical = false;
      this._menu.addControl(panel, 0, 0);

      panel.addControl(this._parentUi._parent.createTextBlock({ text: "DROP ITEM (0=EXIT) ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}));

      this._entryBlock = this._parentUi._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      panel.addControl(this._entryBlock);

      let o = WizardryScene.createBlinkingCursor();
      panel.addControl(o.cursor);
      this._parentUi._parent.beginDirectAnimation(
        o.cursor, //the target where the animation will take place
        [o.visible], // the list of animations to start
        0, // the initial frame
        ALPHA_FADE_FRAMERATE, // the final frame
        true // if you want animation to loop (off by default)
      );
    }
    { // add messages display - JESUS this took too much experimenting to find the right way to style this text
      this._messageBlock = this._parentUi._parent.createTextBlock();
      if (typeof(this._messageBlock.animations) === "undefined") {
        this._messageBlock.animations = [];
      }
      this._messageBlock.animations.push(FADE);
      this._menu.addControl(this._messageBlock, 2, 0);
    }
  }
  /**
   * Return to the main menu.
   */
  leave() {
    this._parentUi._parent.state = WizardryConstants.INSPECT_CHARACTER_MAIN;
  }
}

export { WizardryCampInspectMainUi };