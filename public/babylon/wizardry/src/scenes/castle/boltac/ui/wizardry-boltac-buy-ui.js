import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE }                        from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { paginate }    from "../../../../components/utilities/paginate.js";
import { WizardryConstants, WizardryObjectType }    from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/** messages displayed from the shopkeeper. */
const SHOP_MESSAGES = [
  "** YOU CANNOT AFFORD IT **",
  "** YOU CANT CARRY ANYTHING MORE **",
  "** ITS YOUR MONEY **",
  "** WE ALL MAKE MISTAKES **",
  "** JUST WHAT YOU NEEDED **"
];
/** flag to scroll to the beginning of the inventory list. */
const SCROLL_BEGINNING = 0;
/** flag to scroll one page forward. */
const SCROLL_FORWARD = 1;
/** flag to scroll one page back. */
const SCROLL_BACK = 2;
/**
 * @class Ui class for the Buy Menu state of the Shop scene.
 */
class WizardryBoltacBuyUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryBoltacBuyUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.Grid displaying the user confirmation panel. */
    this._confirmPanel = null;
    /** @private the BABYLON.GUI.TextBlock displaying the user entry. */
    this._entryBlock = null;
    /** @private the BABYLON.GUI.TextBlock displaying the character's gold. */
    this._goldBlock = null;
    /** @private the list of widgets displaying shop inventory items. */
    this._inventoryItems = [];
    /** @private the list of object ids being displayed */
    this._objects = [];
    /** @private the flag indicating whether the item list is being scrolled forwards or backwards. */
    this._currentPage = 0;
  }
  completePurchase(commit) {
    let tmpParent = null;
    if (!this.hasOwnProperty("_partyPanel")) {
      tmpParent = this.parent;
    } else {
      tmpParent = this;
    }
    const PARENT_OBJECT = tmpParent;
    PARENT_OBJECT._entryBlock.text = commit ? "Y" : "N";
    if (typeof(isTestEnvironment) !== "undefined"
        && isTestEnvironment) {
      PARENT_OBJECT._entryBlock.text = "";
      PARENT_OBJECT._confirmPanel.isVisible = false;
      if (commit) {
        const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
        const item = WizardryController.equipmentListInstance.getEquipmentItem(PARENT_OBJECT._purchaseItemId);
        character.addToInventory({
          equipped: false,
          identified: true,
          cursed: false,
          id: PARENT_OBJECT._purchaseItemId
        });
        character.gold -= item.price;
        if (WizardryController.boltacsInventory[PARENT_OBJECT._purchaseItemId] > 0) {
          WizardryController.boltacsInventory[PARENT_OBJECT._purchaseItemId]--;
        }
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[2];
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        PARENT_OBJECT.set();
      } else {
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[3];
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        PARENT_OBJECT.set();
      }
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
          PARENT_OBJECT._confirmPanel.isVisible = false;
          if (commit) {
            const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
            const item = WizardryController.equipmentListInstance.getEquipmentItem(PARENT_OBJECT._purchaseItemId);
            character.addToInventory({
              equipped: false,
              identified: true,
              cursed: false,
              id: PARENT_OBJECT._purchaseItemId
            });
            character.gold -= item.price;
            if (WizardryController.boltacsInventory[PARENT_OBJECT._purchaseItemId] > 0) {
              WizardryController.boltacsInventory[PARENT_OBJECT._purchaseItemId]--;
            }
            PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
            PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[2];
            PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
            PARENT_OBJECT.set();
          } else {
            PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
            PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[3];
            PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
            PARENT_OBJECT.set();
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
  }
  /**
   * Exits the player menu.
   */
  exit() {
    this._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    for (let i = this._inventoryItems.length - 1; i >= 0; i--) {
      this._inventoryItems[i].resetHighlights();
    }
  }
  /** 
   * Gets the current shop inventory.
   * @returns {Array} the list of ids for all items the shop sells
   */
  getInventory() {
    const inventory = [];
    const ids = WizardryController.equipmentListInstance.getIds();
    for (let i = 0, li = ids.length; i < li; i++) {
      if (WizardryController.boltacsInventory[ids[i]] !== 0) {
        inventory.push(ids[i]);
      }
    }
    return inventory;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let validInput = true;
    switch (key.toUpperCase()) {
      case "ESCAPE":
        if (this._confirmPanel.isVisible) {
          this.completePurchase(false);
        } else {
          this.exit();
        }
        break;
      case "ENTER":
        if (this._confirmPanel.isVisible) {
          this.completePurchase(true);
        } else {
          this.exit();
        }
        break;
      case "L":
        if (!this._confirmPanel.isVisible) {
          this.exit();
        } else {
          validInput = false;
        }
        break;
      case "ARROWLEFT":
        if (!this._confirmPanel.isVisible) {
          this.scroll(SCROLL_BACK);
        } else {
          validInput = false;
        }
        break;
      case "S":
        if (!this._confirmPanel.isVisible) {
          this.scroll(SCROLL_BEGINNING);
        } else {
          validInput = false;
        }
        break;
      case "ARROWRIGHT":
        if (!this._confirmPanel.isVisible) {
          this.scroll(SCROLL_FORWARD);
        } else {
          validInput = false;
        }
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        if (!this._confirmPanel.isVisible) {
          let index = parseInt(key) - 1;
          if (this._inventoryItems[index].isVisible) {
            this.purchase(this._inventoryItems[index].name);
          } else {
            validInput = false;
          }
        } else {
          validInput = false;
        }
        break;
      case "N":
        if (this._confirmPanel.isVisible) {
          this.completePurchase(false);
        } else {
          validInput = false;
        }
        break;
      case "Y":
        if (this._confirmPanel.isVisible) {
          this.completePurchase(true);
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
        7 / 24, // 5 - listing/options
        1 / 24, // 6 - border
        4 / 24  // 7 - gold/messages
      ]
    });

    this._parent.createScreenOutline({
      name: [WizardryConstants.BOLTAC_BUY_MENU, "_ui_frame"].join(""),
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
        {
          points: [
            { cell: [0, 19] },
            { cell: [39, 19] }
          ]
        },
        {
          points: [
            { cell: [1 + (2 / 3)  * 38, 11.5] },
            { cell: [1 + (2 / 3)  * 38, 18.5] }
          ]
        } 
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
    { // create inventory items
      // 6 lines to display inventory
      let twoColumnGrid = WizardryScene.createGrid({
        columns: [2 / 3, 1 / 3]
      });
      this._configuration.addControl(twoColumnGrid, 5, 1);
      { // left column items/scroll buttons
        let leftColumn = WizardryScene.createGrid({
          rows: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7]
        });
        twoColumnGrid.addControl(leftColumn, 0, 0);
        // add items
        for (let i = 0; i < 6; i++) {
          /** the shop inventory item layout */
          const row = WizardryScene.createGrid({
            columns: [1 / 8, 5 / 8, 2 / 8]
          });
          row.addControl(this._parent.createTextBlock({ text: [(i + 1), ")"].join(""), horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }), 0, 0);

          const nameField = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
          row.addControl(nameField, 0, 1);

          const priceField = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
          row.addControl(priceField, 0, 2);

          const clickableRow = this._parent.createClickableRow({
            children: [row],
            parent: this,
            click: this.purchase,
            set: (name, price) => {
              nameField.text = name;
              priceField.text = price.toString();
            }
          });
          leftColumn.addControl(clickableRow.container, i, 0);
          this._inventoryItems.push(clickableRow);
        }
        { // add forward/back buttons
          let grid = WizardryScene.createGrid({
            columns: [2 / 9, 6 / 18, 8 / 18]
          });
          leftColumn.addControl(grid, 6, 0);
          grid.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              onPointerClickObservable: [() => { this.scroll(SCROLL_BEGINNING); }],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "S)TART",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
            }
          }).container, 0, 0);
          
          grid.addControl(this._parent.createButton({
            background: {
              onPointerClickObservable: [() => { this.scroll(SCROLL_BACK); }],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "<-- BACK",
            }
          }).container, 0, 1);
  
          grid.addControl(this._parent.createButton({
            background: {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
              onPointerClickObservable: [() => { this.scroll(SCROLL_FORWARD); }],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }]
            },
            text: {
              text: "FORWARD -->",
              horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }).container, 0, 2);
        }
      }
      { // right column - Y/N
        this._confirmPanel = WizardryScene.createGrid({
          rows: [2 / 7, 1 / 7, 1 / 7, 1 / 7, 2 / 7]
        });
        twoColumnGrid.addControl(this._confirmPanel, 0, 1);

        this._confirmPanel.addControl(this._parent.createTextBlock({ text: " UNUSABLE ITEM", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }), 1, 0);
        this._confirmPanel.addControl(this._parent.createTextBlock({ text: " CONFIRM BUY", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}), 2, 0);

        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        this._confirmPanel.addControl(panel, 3, 0);

        panel.addControl(this._parent.createTextBlock({ text: " ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}));
        panel.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.completePurchase(true); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "(Y)",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parent.createTextBlock({ text: "/", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}));

        panel.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.completePurchase(false); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "(N)",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);

        panel.addControl(this._parent.createTextBlock({ text: " ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT}));


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
    }
    { // gold/instructions and message block
      let grid = WizardryScene.createGrid({
        rows: [1 / 4, 1 / 4, 1 / 2]
      });
      this._configuration.addControl(grid, 7, 1);
      { // gold
        let row = WizardryScene.createGrid({
          columns: [9 / 38, 29 / 38]
        });
        grid.addControl(row, 0, 0);
        
        row.addControl(this._parent.createTextBlock({ text: "YOU HAVE ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }), 0, 0);

        this._goldBlock = this._parent.createTextBlock();
        row.addControl(this._goldBlock, 0, 1);
      }
      { // instructions
        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 1, 0);

        panel.addControl(this._parent.createTextBlock({ text: "#) OR CLICK A ROW TO PURCHASE OR ", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));
        panel.addControl(this._parent.createButton({
          background: {
            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            onPointerClickObservable: [() => { this.exit(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: {
            text: "L)EAVE",
            horizontalAlignment: BABYLON.GUI.HORIZONTAL_ALIGNMENT_LEFT
          }
        }).container);
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
        grid.addControl(this._messageBlock, 2, 0);
      }
    }

    return this._configuration;
  }
  /**
   * Purchases an item.
   * @param {Number} id the id of the item being purchased
   */
  purchase(id) {
    /** the scope parent object */
    let scopeParent = null;
    if (!this.hasOwnProperty("_parent")) {
      scopeParent = this.parent;
    } else {
      scopeParent = this;
    }
    /** the parent object used. */
    const PARENT_OBJECT = scopeParent;
    // start testing
    let stop = false;
    const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
    const item = WizardryController.equipmentListInstance.getEquipmentItem(parseInt(id));
    PARENT_OBJECT._purchaseItemId = parseInt(id);
    if (item.price > character.gold) { // character can't afford the item
      stop = true;
      PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
      PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[0];
      PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      PARENT_OBJECT.set();
    }
    if (!stop) {
      if (character.possessions.count >= 8) { // character has no room in inventory
        stop = true;
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[1];
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        PARENT_OBJECT.set();
      }
    }
    if (!stop) {
      if (item.classUse[character.clazz]) { // character purchases the item
        character.addToInventory({
          equipped: false,
          identified: true,
          cursed: false,
          id: parseInt(id)
        });
        character.gold -= item.price;
        if (WizardryController.boltacsInventory[id] > 0) {
          WizardryController.boltacsInventory[id]--;
          // TODO - SAVE BOLTAC
        }
        PARENT_OBJECT._parent.stopAnimation(PARENT_OBJECT._messageBlock);
        PARENT_OBJECT._messageBlock.text = SHOP_MESSAGES[4];
        PARENT_OBJECT._parent.beginAnimation(PARENT_OBJECT._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        PARENT_OBJECT.set();
      } else {
        PARENT_OBJECT._confirmPanel.isVisible = true;
      }
    }
  }
  /**
   * Scrolls the inventory listing.
   * @param {Number} direction the flag indicating the direction to scroll the listing
   */
  scroll(direction) {
    switch (direction) {
      case SCROLL_BEGINNING:
        this._currentPage = 0;
        break;
      case SCROLL_FORWARD:
        this._currentPage++;
        break;
      case SCROLL_BACK:
        this._currentPage--;
        break;
      default:
        throw ["Invalid direction", direction];
    }
    this.set();
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
    this._confirmPanel.isVisible = false;
    for (let i = this._inventoryItems.length - 1; i >= 0; i--) {
      this._inventoryItems[i].isVisible = false;
      this._inventoryItems[i].name = "";
    }
    if (typeof(character) !== "undefined") {
      let inventory = this.getInventory();
      let paginationData = paginate(inventory.length, this._currentPage, 6);
      this._currentPage = paginationData.currentPage;
      
      for (let i = paginationData.startIndex, li = paginationData.endIndex, j = 0; i <= li; i++, j++) {
        let item = WizardryController.equipmentListInstance.getEquipmentItem(inventory[i]);
        let widget = this._inventoryItems[j];
        widget.name = inventory[i].toString();
        widget.isVisible = true;
        widget.set(item.name, item.price);
      }
      // set player gold
      this._goldBlock.text = [character.gold, " GOLD"].join("");
    }
  }
}

export { WizardryBoltacBuyUi };