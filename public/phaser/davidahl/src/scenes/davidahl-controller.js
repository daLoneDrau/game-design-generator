if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
}
/**
 * @class The Controller will handle switching between scene groups.
 */
var DavidAhlController = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "Controller",
    active: false
  });
  /** @private The current scene group being displayed. */
  let _currentGroup = "";
  /** @private The dictionary of scene groups, where groups of scenes are associated with a specific scene key. */
  let _sceneGroups = {};
  { // DavidAhlController Getters/Setters
    /** Gets the scene groups dictionary. */
    Object.defineProperty(_scene, "groups", {
      get: function() {
        return _sceneGroups;
      }
    });
    /** Sets the current scene group's key. */
    Object.defineProperty(_scene, "currentScene", {
      set: function(value) {
        if (!_sceneGroups.hasOwnProperty(value)) {
          throw ["Cannot assign current group - ", value, " - it doesn't exist"].join("");
        }
        _scene.switch(value);
      }
    });
  }
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  _scene.init = function(data) {
  };
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  _scene.preload = function() {
  };
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  _scene.create = function(data) {
    // set scene groups
    _sceneGroups["Main Menu"] = ["Main Menu"];
    _sceneGroups["GameConsole"] = ["GameConsole"];
    
    // switch Main Menu state
    DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_DEFAULT;
    
    // set current scene
    this.switch("Main Menu");
  };
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  _scene.update = function(time, delta) {
  };
  /**
   * Switches between scene groups.
   * @param {string} scene the scene group's key
   */
  _scene.switch = function(scene) {
    let keys = Object.keys(_sceneGroups);
    // disable all scenes
    for (let i = keys.length - 1; i >= 0; i--) {
      let scenes = _sceneGroups[keys[i]];
      for (let i = scenes.length - 1; i >= 0; i--) {
        console.log("turn off",scenes[i])
        this.scene.setVisible(false, scenes[i]);
        this.scene.setActive(false, scenes[i]);
      }
    }
    // enable current
    _currentGroup = scene;
    let scenes = _sceneGroups[_currentGroup];
    for (let i = scenes.length - 1; i >= 0; i--) {
      console.log("turn on",scenes[i])
      this.scene.setVisible(true, scenes[i]);
      this.scene.setActive(true, scenes[i]);
    }
  }
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { DavidAhlController };
}
