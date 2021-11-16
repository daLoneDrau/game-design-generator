if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethGameOverScene } = require("./retroc64-akalabeth-game-over-scene");
  var { RetroC64SceneController } = require("../../../retroc64-scene-controller");
}
/**
 * @class The Game Over scene will have its own interface.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethGameOverInterface(parameterObject) {
  parameterObject.columns = 1;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  { // RetroC64AkalabethGameOverInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_GAME_OVER_MAIN]] = {
      group: null,
      children: [
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WE MOURN THE PASSING OF", // text
          ],
          position: [0, 10],
          origin: [0.5, 0.5],
          tint: 10920447,
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "THE PEASANT AND HIS COMPUTER", // text
          ],
          position: [0, 11],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "nameField"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "TO INVOKE A MIRACLE OF RESSURECTION", // text
          ],
          position: [0, 12],
          origin: [0.5, 0.5],
          tint: 10920447,
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "<HIT ESC KEY>", // text
          ],
          position: [0, 13],
          origin: [0.5, 0.5],
          tint: 10920447,
        }
      ]
    };
  }
  { // RetroC64AkalabethGameOverInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_GAME_OVER_MAIN]] = function(event, context) {
      switch (event.key) {
        case "Escape":
          RetroC64AkalabethShopScene.callbackState = RetroC64Constants.AKALABETH_SETUP;
          RetroC64AkalabethWorldMapScene.needsMapRedraw = true;
          RetroC64AkalabethCastleScene.goalsStated = true;
          RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_CHARACTER_CREATION });
          break;
      }
    };
  }
  this._state = RetroC64Constants.AKALABETH_GAME_OVER_MAIN;
};
RetroC64AkalabethGameOverInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethGameOverInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethGameOverInterface Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethGameOverInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethGameOverInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethGameOverInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethGameOverInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethGameOverInterface.prototype.create = function(data) {
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
  RetroC64AkalabethGameOverInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethGameOverInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Handles updates to a Watchable instance.
 * @param {Watchable} data the Watchable instance being updated
 */
RetroC64AkalabethGameOverInterface.prototype.watchUpdated = function(data) {
  // call base
  Watcher.prototype.watchUpdated.call(this, data);
  // update fields
  let s = ["A PEASANT", "AND HIS COMPUTER"];
  if (data.name.length > 0) {
    s[0] = data.name;
  }
  this._dynamicFields.setText("nameField", s.join(" "));
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethGameOverInterface };
}
