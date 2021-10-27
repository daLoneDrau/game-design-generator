if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { RetroC64Constants } = require("../../config/retroc64-constants");
  var { RetroC64ShopScene } = require("../retroc64-shop-scene");
  var { RetroC64SceneController } = require("../scenes/retroc64-scene-controller");
}
/**
 * @class A UI class for displaying the shop's inventory.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64ShopInventoryUi(parameterObject) {
  parameterObject.columns = 8;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

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
        comment: [
          "************************************",
          "COLUMN 1 HEADER"
        ],
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "PRICE", // text
        ],
        position: [1, 15],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "1 FOR 10", // text
        ],
        position: [1, 17],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "8", // text
        ],
        position: [1, 18],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "5", // text
        ],
        position: [1, 19],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "6", // text
        ],
        position: [1, 20],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "3", // text
        ],
        position: [1, 21],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "15", // text
        ],
        position: [1, 22],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        comment: [
          "************************************",
          "COLUMN 2 HEADER"
        ],
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "DAMAGE", // text
        ],
        position: [3, 15],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "N/A", // text
        ],
        position: [3, 17],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "1-10", // text
        ],
        position: [3, 18],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "1-5", // text
        ],
        position: [3, 19],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "1", // text
        ],
        position: [3, 20],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "1-4", // text
        ],
        position: [3, 21],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "?????", // text
        ],
        position: [3, 22],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        comment: [
          "************************************",
          "COLUMN 3 HEADER"
        ],
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "ITEM", // text
        ],
        position: [5, 15],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "FOOD", // text
        ],
        position: [5, 17],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "RAPIER", // text
        ],
        position: [5, 18],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "AXE", // text
        ],
        position: [5, 19],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "SHIELD", // text
        ],
        position: [5, 20],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "BOW AND ARROWS", // text
        ],
        position: [5, 21],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "MAGIC AMULET", // text
        ],
        position: [5, 22],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
    ]
  };
  this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE]] = function(event, context) {};
  this._state = RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE;
};
RetroC64ShopInventoryUi.prototype = Object.create(UiScene.prototype);
RetroC64ShopInventoryUi.prototype.constructor = UiScene;
{ // RetroC64ShopInventoryUi Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64ShopInventoryUi.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
/**
 * This method is called by the Scene Manager when the scene starts, before preload() and create().
 * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
RetroC64ShopInventoryUi.prototype.init = function(data) {
}
/**
 * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
 */
RetroC64ShopInventoryUi.prototype.preload = function() {
}
/**
 * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
 * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
RetroC64ShopInventoryUi.prototype.create = function(data) {
  // call base
  UiScene.prototype.create.call(this, data);
}
/**
 * This method is called once per game step while the scene is running.
 * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
RetroC64ShopInventoryUi.prototype.update = function(time, delta) {
  // call base
  UiScene.prototype.update.call(this, time, delta);
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64ShopInventoryUi.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64ShopInventoryUi };
}
