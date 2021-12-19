if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethController } = require("../../services/akalabeth/retroc64-akalabeth-controller");
  var { RetroC64ShopScene } = require("../retroc64-akalabeth-shop-scene");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
}
/**
 * @class A UI class for displaying the commands available while in the shop.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethShopCommandsInterface(parameterObject) {
  parameterObject.columns = 8;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private Flag indicating an animated sequence is playing. */
  this._playingAnimation = false;
  /** @private A dictionary of items for sale in the shop. */
  this._ITEM_ENTRIES = {
    F: {
      name: "FOOD",
      count: 10,
      price: 1,
      purchaseMessage: "YOU PURCHASE FOOD (YUM! CORNED BEEF HASH)"
    },
    R: {
      name: "RAPIER",
      count: 1,
      price: 8,
      purchaseMessage: "EN GARDE! YOU BUY A RAPIER"
    },
    A: {
      name: "AXE",
      count: 1,
      price: 5,
      purchaseMessage: "ENJOY YOUR AXE"
    },
    S: {
      name: "SHIELD",
      count: 1,
      price: 6,
      purchaseMessage: "HERE'S YOUR SHIELD"
    },
    B: {
      name: "BOW AND ARROWS",
      count: 1,
      price: 3,
      purchaseMessage: "A BOW AND SOME ARROWS - WATCH THE POINTY END"
    },
    M: {
      name: "MAGIC AMULET",
      count: 1,
      price: 15,
      purchaseMessage: "AN AMULET - OOOOH, MYSTERIOUS"
    }
  };
  /** @private A delay of 2 seconds will occur after the player presses a key. */
  this._delay = 1;
  { // RetroC64AkalabethShopCommandsInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE]] = {
      group: null,
      comment: [
        "THE SHOP VIEW IS BROKEN OUT INTO THREE ROWS:",
        "TOP - PLAYER STATS AND EQUIPMENT",
        "MIDDLE - USER COMMAND SUMMARY AND ENTRY",
        "BOTTOM - EQUIPMENT FOR PURCHASE",
        "THIS IS THE TOP ROW"
      ],
      children: [
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE246-FOOD", // text
          ],
          position: [0, 9],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE252-RAPIER", // text
          ],
          position: [0, 10],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE241-AXE", // text
          ],
          position: [3, 9],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE253-SHIELD", // text
          ],
          position: [3, 10],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE251-QUIT", // text
          ],
          position: [3, 11],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE242-BOW AND ARROW", // text
          ],
          position: [5, 9],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE24D-MAGIC AMULET", // text
          ],
          position: [5, 10],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WELCOME TO THE ADVENTURE SHOP", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 12
          },
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WHICH ITEM SHALT THOU BUY? ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 13
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "promptField"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 14
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "messageField"
        },
        {
          comment: "CREATE TWO IMAGES, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
          type: "graphics-texture",
          commands: [
            {
              order: 1,
              command: "fillStyle",
              args: [0xA6A1FF, 0] // color, alpha
            },
            {
              order: 2,
              command: "fillRect",
              args: [0, 0, 16, 16], // x, y, width, height, corner radius,
              "scale controlled args": [] // no scaled graphics
            },
            {
              order: 3,
              command: "generateTexture",
              args: ["cursor_off", 16, 16], // key, scale width, scale height
              "scale controlled args": [] // no scaled graphics
            },
            {
              order: 4,
              command: "fillStyle",
              args: [0xA6A1FF, 1] // color, alpha
            },
            {
              order: 5,
              command: "fillRect",
              args: [0, 0, 16, 16], // x, y, width, height, corner radius,
              "scale controlled args": [] // no scaled graphics
            },
            {
              order: 6,
              command: "generateTexture",
              args: ["cursor_on", 16, 16], // key, scale width, scale height
              "scale controlled args": [] // no scaled graphics
            },
          ]
        },
        {
          comment: "CREATE CURSOR SPRITE",
          type: "sprite",
          args: [
            0, // x
            0, // y
            "cursor_on" // texture
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: {
                field: "promptField",
                pixel: 2
              }
            },
            y: {
              fixed: 13,
              offset: -1
            }
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor"
        }
      ]
    };
  }
  { // RetroC64AkalabethShopCommandsInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE]] = function(event, context) {
      if (!context._playingAnimation) {
        let callback = function() {
          // clear the animation flag and the display
          this._playingAnimation = false;
          this._dynamicFields.setText("promptField", "WHICH ITEM SHALT THOU BUY? ");
          this._dynamicFields.setText("messageField", "");
          
          // move the cursor
          context.moveCursor("blinkingCursor", -0.5, 13, "promptField");
        };
        let message = "";
        if (context._ITEM_ENTRIES.hasOwnProperty(event.key.toUpperCase())) {
          let item = JSON.parse(JSON.stringify(context._ITEM_ENTRIES[event.key.toUpperCase()]));
          
          // display item entered
          context._dynamicFields.setText("promptField", [context._dynamicFields.getText("promptField"), item.name].join(""));
          
          // move cursor to the right
          context.moveCursor("blinkingCursor", -0.5, 13, "promptField");
          
          if ((item.name === "RAPIER" || item.name === "BOW AND ARROWS")
              && RetroC64AkalabethController.character.class === "M") {
            message = "I'M SORRY - MAGES CAN'T USE THAT!";
          } else {
            if (RetroC64AkalabethController.character.gold < item.price) {
              message = "M'LORD THOU CAN NOT AFFORD THAT ITEM.";
            } else {
              message = item.purchaseMessage;
              RetroC64AkalabethController.character.addToInventory(item);
              RetroC64AkalabethController.character.gold -= item.price;
            }
          }
        } else if (event.key.toUpperCase() === "Q") {
          // display quit
          context._dynamicFields.setText("promptField", [context._dynamicFields.getText("promptField"), "QUIT"].join(""));
          message = "BYE";
          
          // move cursor to the right
          context.moveCursor("blinkingCursor", -0.5, 13, "promptField");
          
          // change the callback function
          callback = function() {
            // clear the animation flag and the display
            this._playingAnimation = false;
            this._dynamicFields.setText("promptField", "WHICH ITEM SHALT THOU BUY? ");
            this._dynamicFields.setText("messageField", "");
            
            // move the cursor
            context.moveCursor("blinkingCursor", -0.5, 13, "promptField");
            
            // reset the state and go to the next scene
            this._state = RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE;
            this._stateChangeResolved = false;
            RetroC64SceneController.gotoState({ state: RetroC64AkalabethShopScene.callbackState });
          };
        } else {
          // display item entered
          context._dynamicFields.setText("promptField", [context._dynamicFields.getText("promptField"), event.key.toUpperCase()].join(""));
          message = "I'M SORRY WE DON'T HAVE THAT.";
          
          // move cursor to the right
          context.moveCursor("blinkingCursor", -0.5, 13, "promptField");
        }
        // display the message
        context._dynamicFields.setText("messageField", message);
        
        // begin animation sequence
        context._playingAnimation = true;
        
        // after a pause, run the callback
        context._scene.time.delayedCall(
          context._delay, // milliseconds
          callback, // callback function
          [], // args
          context // the scope object
        );
      }
    };
  }
  this._state = RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE;
};
RetroC64AkalabethShopCommandsInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethShopCommandsInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethShopCommandsInterface Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethShopCommandsInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethShopCommandsInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethShopCommandsInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethShopCommandsInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethShopCommandsInterface.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    this._dynamicFields.getObject("blinkingCursor")[0].anims.create({
      key: "blink",
      frames: [
        { key: "cursor_off" },
        { key: "cursor_on" }
      ],
      frameRate: 2,
      repeat: -1 // repeat infinitely
    });
    this._dynamicFields.getObject("blinkingCursor")[0].play("blink");
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethShopCommandsInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethShopCommandsInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Moves the cursor to the right of a specific field.
 * @param {string} cursorId the cursor sprite's unique id
 * @param {Number} column the column where the cursor will be placed
 * @param {Number} row the row where the cursor will be placed
 * @param {string} offsetField the id of the field the cursor will be placed next to
 */
RetroC64AkalabethShopCommandsInterface.prototype.moveCursor = function(cursorId, column, row, offsetField) {
  let x = column + this._dynamicFields.getObject(offsetField)[0].width / this._COLUMN_WIDTH; // to the right of the offset field
  x += 2 / this._COLUMN_WIDTH; // add 2px buffer
    let y = row - 1 / this._ROW_HEIGHT; // move up 1 pixel (looks better);
  this._grid.placeAt(x, y, this._dynamicFields.getObject(cursorId)[0]);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethShopCommandsInterface };
}
