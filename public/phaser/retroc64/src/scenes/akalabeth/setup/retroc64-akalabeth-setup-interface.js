if (typeof(module) !== "undefined") {
  var { RetroC64SetupScene } = require("./retroc64-akalabeth-setup-scene");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
}
/**
 * @class A UI class for displaying a wait message while the world is populated.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethSetupInterface(parameterObject) {
  parameterObject.columns = 1;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private Flag indicating the first update has been called. */
  this._firstUpdate = true;
  /** @private The time each cycle of the scene is supposed to last. */
  this._cycleLength = 500;
  /** @private The number of cycles to run before moving to the next scene. */
  this._maxCycles = 10;
  /** @private A field to track the time (in ms) when the last cycle was started. */
  this._cycleStartTime = 0;
  /** @private The number of cycles that have run. */
  this._numCycles = 0;
  { // RetroC64AkalabethSetupInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_SETUP]] = {
      group: null,
      children: [
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            " WELCOME TO AKALABETH, WORLD OF DOOM!", // text
          ],
          position: [-0.5, 11],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "  (PLEASE WAIT)", // text
          ],
          position: [-0.5, 22],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "waitField"
        }
      ]
    };
  }
  { // RetroC64AkalabethSetupInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_SETUP]] = function(event, context) {
      
    };
  }
  this._state = RetroC64Constants.AKALABETH_SETUP;
};
RetroC64AkalabethSetupInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethSetupInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethSetupInterface Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethSetupInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethSetupInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethSetupInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethSetupInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethSetupInterface.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethSetupInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
    if (this._firstUpdate) {
      console.log("first update");
      RetroC64AkalabethController.world.newWorld();
      this._firstUpdate = false;
      this._cycleStartTime = time;
    }
    if (this._cycleStartTime + this._cycleLength <= time) {
      if (this._numCycles < this._maxCycles) {
        this._dynamicFields.setText("waitField", [this._dynamicFields.getText("waitField"), "."].join(""));
        this._cycleStartTime = time;
        this._numCycles++;
      } else {
        // reset all variables
        this._firstUpdate = true;
        this._numCycles = 0;
        this._dynamicFields.setText("waitField", "  (PLEASE WAIT)");
        // move on the next scene
        RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_WORLD_MAP });
      }
    }
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethSetupInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethSetupInterface };
}
