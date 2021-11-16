if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethDungeonScene } = require("../retroc64-akalabeth-dungeon-scene");
  var { RetroC64SceneController } = require("../scenes/retroc64-scene-controller");
}
/**
 * @class The Dungeon View will have a separate scene instance to handle rendering the user interface
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethDungeonInterface(parameterObject) {
  parameterObject.columns = 1;
  parameterObject.rows = 1;
  UiScene.call(this, parameterObject); // call parent constructor

  { // RetroC64AkalabethDungeonInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = {
      group: null,
      children: []
    };
  }
  { // RetroC64AkalabethDungeonInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = function(event, context) {
      
    };
  }
  this._state = RetroC64Constants.AKALABETH_DUNGEON_MAIN;
};
RetroC64AkalabethDungeonInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethDungeonInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethDungeonInterface Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethDungeonInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethDungeonInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethDungeonInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethDungeonInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethDungeonInterface.prototype.create = function(data) {
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
  RetroC64AkalabethDungeonInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethDungeonInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethDungeonInterface };
}
