import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE }                        from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryConstants }    from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/** messages displayed from the shopkeeper. */
const SHOP_MESSAGES = [
  "** WE DONT BUY CURSED ITEMS **",
  "** ANYTHING ELSE, SIRE? **"
];
/**
 * @class Ui class for the Sell Menu state of the Shop scene.
 */
class WizardryBoltacSellUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryBoltacSellUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlock displaying the user entry. */
    this._entryBlock = null;
    /** @private the list of shop inventory items being displayed. */
    this._inventoryItems = [];
  }
  /**
   * Exits the player menu.
   */
  exit() {
    this.prepForExit();
    this._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
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
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
        let index = parseInt(key) - 1;
        if (this._inventoryItems[index].isVisible) {
          this.sell(this._inventoryItems[index].name);
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
        8 / 24, // 5 - listing/options
        1 / 24, // 6 - border
        1 / 24, // 7 - prompt
        1 / 24, // 8 - exit
        1 / 24, // 9 - messages
      ]
    });

    this._parent.createScreenOutline({
      name: [WizardryConstants.BOLTAC_SELL_MENU, "_ui_frame"].join(""),
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
        /** END PARTY BORDER /  START EQUIPMENT BORDER */
        {
          points: [
            { cell: [0, 20] },
            { cell: [39, 20] }
          ]
        }
        /** END EQUIPMENT BORDER */ 
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
    { // display player's inventory
      let grid = WizardryScene.createGrid({
        rows: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8]
      });
      this._configuration.addControl(grid, 5, 1);
      for (let i = 0; i < 8; i++) {
        /** the player inventory item layout */
        const row = WizardryScene.createGrid({
          columns: [3 / 24, 8 / 24, 6 / 24, 7 / 24]
        });
        row.addControl(this._parent.createTextBlock({ text: [(i + 1), ")"].join(""), horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }), 0, 0);

        const nameField = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        row.addControl(nameField, 0, 1);

        const priceField = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
        row.addControl(priceField, 0, 2);

        const clickableRow = this._parent.createClickableRow({
          children: [row],
          parent: this,
          click: this.sell,
          set: (name, price) => {
            nameField.text = name;
            priceField.text = price.toString();
          }
        });
        grid.addControl(clickableRow.container, i, 0);
        this._inventoryItems.push(clickableRow);
      }
    }
    { // entry prompt and cursor
      let panel = new BABYLON.GUI.StackPanel();
      panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      panel.isVertical = false;
      this._configuration.addControl(panel, 7, 1);

      panel.addControl(this._parent.createTextBlock({ text: "WHICH DO YOU WISH TO SELL ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

      this._entryBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      panel.addControl(this._entryBlock);

      let o = WizardryScene.createBlinkingCursor();
      panel.addControl(o.cursor);
      this._parent.beginDirectAnimation(
        o.cursor, //the target where the animation will take place
        [o.visible], // the list of animations to start
        0, // the initial frame
        ALPHA_FADE_FRAMERATE, // the final frame
        true // if you want animation to loop (off by default)
      );
    }
    { // exit block
      this._configuration.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [() => { this.exit(); }],
          onPointerEnterObservable: [() => { }],
          onPointerOutObservable: [() => { }]
        },
        text: {
          text: "[ESC] TO LEAVE",
          horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
        }
      }).container, 8, 1);
    }
    { // message block
      this._messageBlock = this._parent.createTextBlock({
        lineSpacing: "3px",
        //textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        // textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
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
   * Prepares to exit the scene state.
   */
  prepForExit() {
    this._messageBlock.text = "";
    this._entryBlock.text = "";
    // reset the background on all character buttons
    for (let i = this._inventoryItems.length - 1; i >= 0; i--) {
      this._inventoryItems[i].resetHighlights();
    }
  }
  /**
   * Attempts to sell an item. Unidentified items sell for 1/2 price and cursed items cannot be sold.
   * @param {String} index the index of the item being sold
   */
  sell(index) {
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    /** the scope parent object */
    let scopeParent = null;
    if (!this.hasOwnProperty("_parent")) {
      scopeParent = this.parent;
    } else {
      scopeParent = this;
    }
    /** the parent object used. */
    const PARENT_OBJECT = scopeParent;
    const possessionObject = character.possessions.possession[parseInt(index)];
    const item = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);

    // set the prompt text
    PARENT_OBJECT._entryBlock.text = possessionObject.identified ? item.name : item.nameUnknown;

    if (possessionObject.cursed) {
      // cursed items can't be sold. set a timer to clear the user entry prompt
      PARENT_OBJECT.set();
      PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
      PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[0];
      PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      if (typeof(isTestEnvironment) !== "undefined"
          && isTestEnvironment) {
        PARENT_OBJECT._entryBlock.text = "";
      } else {
        BABYLON.setAndStartTimer({
          timeout: KEYBOARD_ENTRY_DELAY,
          contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
          breakCondition: () => {
            // this will check if we need to break before the timeout has reached
            return PARENT_OBJECT._parent.isDisposed;
          },
          onEnded: (data) => {
            // this will run when the timeout has passed          
            PARENT_OBJECT._entryBlock.text = "";
          },
          onTick: (data) => {
            // this will run
          },
          onAborted: (data) => {
            // this function will run when the break condition has met (premature ending)
          },
        });
      }
    } else {
      if (possessionObject.identified) {
        // identified items sell for 1/2 price
        character.gold += Math.floor(item.price / 2);
      } else {
        // unidentified items sell for 1 gold
        character.gold++;
      }

      // give the item to boltac before removing from the player's inventory
      if (WizardryController.boltacsInventory[possessionObject.equipmentIndex] >= 0) {
        WizardryController.boltacsInventory[possessionObject.equipmentIndex]++;
      }

      // remove the item from the player's inventory
      character.removeFromInventory(parseInt(index));

      if (character.possessions.count > 0) {
        // start a timer to clear the user entry prompt
        PARENT_OBJECT.set();
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[1];
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        if (typeof(isTestEnvironment) !== "undefined"
            && isTestEnvironment) {
          PARENT_OBJECT._entryBlock.text = "";
        } else {
          BABYLON.setAndStartTimer({
            timeout: KEYBOARD_ENTRY_DELAY,
            contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
            breakCondition: () => {
              // this will check if we need to break before the timeout has reached
              return PARENT_OBJECT._parent.isDisposed;
            },
            onEnded: (data) => {
              // this will run when the timeout has passed          
              PARENT_OBJECT._entryBlock.text = "";
            },
            onTick: (data) => {
              // this will run
            },
            onAborted: (data) => {
              // this function will run when the break condition has met (premature ending)
            },
          });
        }
      } else {
        // start a timer to clear the user entry prompt and exit to player menu
        if (typeof(isTestEnvironment) !== "undefined"
            && isTestEnvironment) {
          PARENT_OBJECT._entryBlock.text = "";
          PARENT_OBJECT.exit();
        } else {
          BABYLON.setAndStartTimer({
            timeout: KEYBOARD_ENTRY_DELAY,
            contextObservable: PARENT_OBJECT._parent.onBeforeRenderObservable,
            breakCondition: () => {
              // this will check if we need to break before the timeout has reached
              return PARENT_OBJECT._parent.isDisposed;
            },
            onEnded: (data) => {
              // this will run when the timeout has passed          
              PARENT_OBJECT._entryBlock.text = "";
              PARENT_OBJECT.exit();
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
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    this._subTitleTextBlock.text = "SHOP ";
    this._entryBlock.text = "";
    // if the messages aren't showing a message from boltac, erase them
    if (!SHOP_MESSAGES.includes(this._messageBlock.text)) {
      this._messageBlock.text = "";
    }
    for (let i = this._inventoryItems.length - 1; i >= 0; i--) {
      let widget = this._inventoryItems[i];
      widget.name = "";
      widget.isVisible = false;
      widget.set("", "");
    }

    if (typeof(character) !== "undefined") {
      for (let i = this._inventoryItems.length - 1; i >= 0; i--) {
        if (character.possessions.possession[i].equipmentIndex >= 0) {
          const possessionObject = character.possessions.possession[i];
          const item = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);
          let widget = this._inventoryItems[i];
          widget.name = i.toString();
          widget.isVisible = true;
          widget.set(
            possessionObject.identified ? item.name : item.nameUnknown,
            possessionObject.identified ? Math.floor(item.price / 2) : 1
          );
        }
      }
    }
  }
}

export { WizardryBoltacSellUi };