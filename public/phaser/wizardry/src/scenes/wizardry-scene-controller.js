if (typeof(module) !== "undefined") {
  var Phaser = require("phaser");
  var { WizardryConstants } = require("../config/wizardry-constants");
}
/**
 * @class The Scene Controller will handle switching between scene containers.
 */
var WizardrySceneController = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "Controller",
    active: false
  });
  /** @private The current scene group being displayed. */
  let _currentGroup = "";
  /** @private The dictionary of scene groups, where groups of scenes are associated with a specific scene key. */
  let _sceneGroups = {};
  { // Getters/Setters
    /** Gets the scene groups dictionary. */
    Object.defineProperty(_scene, "groups", {
      get: function() {
        return _sceneGroups;
      }
    });
    /**
     * Sets the current scene group.
     * @param {PropertyKey} value
     */
    Object.defineProperty(_scene, "currentScene", {
      set: function(value) {
        if (!_sceneGroups.hasOwnProperty(value)) {
          throw ["Cannot assign current group - ", value, " - it doesn't exist"].join("");
        }
       _scene.switch(value);
      }
    });
  }
  { // WizardrySceneController Scene Extensions
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
     * This method is called by the Game at the end of the boot sequence. The purpose is to register the scene groups and switch to the first scene.
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
     */
    _scene.create = function(data) {
    };
  }
  /**
   * Switches between scene groups.
   * @param {string} scene the scene group's key
   */
  let _switch = function(scene) {
    let keys = Object.keys(_sceneGroups);
    // disable all scenes
    for (let i = keys.length - 1; i >= 0; i--) {
      let scenes = _sceneGroups[keys[i]];
      for (let i = scenes.length - 1; i >= 0; i--) {
        _scene.scene.setVisible(false, scenes[i]);
        _scene.scene.setActive(false, scenes[i]);
      }
    }
    // enable current
    _currentGroup = scene;
    let scenes = _sceneGroups[_currentGroup];
    for (let i = scenes.length - 1; i >= 0; i--) {
      _scene.scene.setVisible(true, scenes[i]);
      _scene.scene.setActive(true, scenes[i]);
    }
  };
  /**
   * Goes to the selected scene state.
   * @param {object} parameterObject the state parameters to be passed to the next scene
   */
  _scene.gotoState = function(parameterObject) {
    if (typeof(parameterObject) === "undefined") {
      throw "Parameter object is required";
    }
    if (!parameterObject.hasOwnProperty("state")  || isNaN(parseInt(parameterObject.state))) {
      throw ["Parameter object requires a valid state", parameterObject];
    }
    let valid = true;
    // TODO - perform verification on the upcoming scene
    if (valid) {
      _switch(parameterObject.state);
    }
    if (parameterObject.hasOwnProperty("actions")) {
      for (let i = 0, li = parameterObject.actions.length; i < li; i++) {
        parameterObject.actions[i].call(this);
      }
    }
  }
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { WizardrySceneController };
}
