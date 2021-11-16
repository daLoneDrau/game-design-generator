if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethCharacterStatsScene } = require("../retroc64-akalabeth-character-stats-scene");
  var { RetroC64SceneController } = require("../scenes/retroc64-scene-controller");
}
/**
 * @class The Character Stats screen will display a simple interface.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethCharacterStatsInterface(parameterObject) {
  parameterObject.columns = 5;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  { // RetroC64AkalabethCharacterStatsInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_CHARACTER_STATS_MAIN]] = {
      group: null,
      children: [
        {
          comment: "COLUMN 1 HEADER",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "STAT'S", // text
          ],
          position: [0.5, 1],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "HIT POINTS.....", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 2
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
            "11", // text
          ],
          position: [1, 2],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "hpValue"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "STRENGTH........", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 3
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
            "", // text
          ],
          position: [1, 3],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "strValue"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "DEXTERITY.......", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 4
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
            "", // text
          ],
          position: [1, 4],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "dexValue"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "STAMINA...........", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 5
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
            "", // text
          ],
          position: [1, 5],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "stValue"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WISDOM.............", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 6
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
            "", // text
          ],
          position: [1, 6],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "wisValue"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "GOLD.................", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 7
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
            "", // text
          ],
          position: [1, 7],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "goldValue"
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
            "WEAPONS", // text
          ],
          position: [3.5, 1],
          tint: 10920447
        },
        {
          comment: ["FOOD"],
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "0", // text
          ],
          position: [2.5, 2],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "foodCount"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-FOOD", // text
          ],
          position: [2.5, 2],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: ["RAPIER"],
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "0", // text
          ],
          position: [2.5, 3],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "rapierCount"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-RAPIER", // text
          ],
          position: [2.5, 3],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: ["AXE"],
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "0", // text
          ],
          position: [2.5, 4],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "axeCount"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-AXE", // text
          ],
          position: [2.5, 4],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: ["SHUELD"],
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "0", // text
          ],
          position: [2.5, 5],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "shieldCount"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-SHIELD", // text
          ],
          position: [2.5, 5],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: ["ARROWS"],
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "0", // text
          ],
          position: [2.5, 6],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "arrowCount"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-BOW AND ARROWS", // text
          ],
          position: [2.5, 6],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: ["AMULET"],
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "0", // text
          ],
          position: [2.5, 7],
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "amuletCount"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-MAGIC AMULET", // text
          ],
          position: [2.5, 7],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "PRESS -CR- TO CONTINUE", // text
          ],
          position: [2, 9],
          origin: [0.5, 0.5],
          tint: 10920447
        },
      ]
    };
  }
  { // RetroC64AkalabethCharacterStatsInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CHARACTER_STATS_MAIN]] = function(event, context) {
      switch (event.key) {
        case "Enter":
          context._scene.time.delayedCall(
            375, // milliseconds
            function() {
              RetroC64SceneController.gotoState({ state: RetroC64AkalabethCharacterStatsScene.callbackState });
            }, // callback function
            [], // args
            context // the scope object
          );
          break;
      }
    };
  }
  this._state = RetroC64Constants.AKALABETH_CHARACTER_STATS_MAIN;
};
RetroC64AkalabethCharacterStatsInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethCharacterStatsInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethCharacterStatsInterface Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethCharacterStatsInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethCharacterStatsInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethCharacterStatsInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethCharacterStatsInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethCharacterStatsInterface.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    RetroC64AkalabethController.character.addWatcher(this);
    RetroC64AkalabethController.character.notifyWatchers(); 
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethCharacterStatsInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethCharacterStatsInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Handles updates to a Watchable instance.
 * @param {Watchable} data the Watchable instance being updated
 */
RetroC64AkalabethCharacterStatsInterface.prototype.watchUpdated = function(data) {
  // call base
  Watcher.prototype.watchUpdated.call(this, data);
  // update fields
  this._dynamicFields.setText("hpValue", data.hitPoints);
  this._dynamicFields.setText("strValue", data.strength);
  this._dynamicFields.setText("dexValue", data.dexterity);
  this._dynamicFields.setText("stValue", data.stamina);
  this._dynamicFields.setText("wisValue", data.wisdom);
  this._dynamicFields.setText("goldValue", data.gold);
  this._dynamicFields.setText("foodCount", data.getNumberInInventory("FOOD"));
  this._dynamicFields.setText("rapierCount", data.getNumberInInventory("RAPIER"));
  this._dynamicFields.setText("axeCount", data.getNumberInInventory("AXE"));
  this._dynamicFields.setText("shieldCount", data.getNumberInInventory("SHIELD"));
  this._dynamicFields.setText("arrowCount", data.getNumberInInventory("BOW AND ARROWS"));
  this._dynamicFields.setText("amuletCount", data.getNumberInInventory("MAGIC AMULET"));
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethCharacterStatsInterface };
}
