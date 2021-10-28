if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { RetroC64Constants } = require("../config/retroc64-constants");
  var { RetroC64IntroScene } = require("../scenes/retroc64-introscene");
}
/**
 * @class The Scene Controller will handle switching between scene containers.
 */
var RetroC64SceneController = (function() {
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
    // load the theme fonts
    this.load.bitmapFont("c64_pro_style_16", "/phaser/assets/font/c64_pro_style_16.png", "/phaser/assets/font/c64_pro_style_16.xml");
    this.load.bitmapFont("c64_pro_mono_16", "/phaser/assets/font/c64_pro_mono_16.png", "/phaser/assets/font/c64_pro_mono_16.xml");
  };
  /**
   * This method is called by the Game at the end of the boot sequence. The purpose is to register the scene groups and switch to the first scene.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  _scene.create = function(data) {
    /* sample process
    // set scene groups
    _sceneGroups["Main Menu"] = ["Main Menu"];
    _sceneGroups["GameConsole"] = ["GameConsole"];
    
    // switch Main Menu state
    RetroC64MainMenu.state = RetroC64Constants.MAIN_MENU_DEFAULT;
    
    // set current scene
    this.switch("Main Menu");
    */
    _sceneGroups[[RetroC64Constants.AKALABETH_WORLD_MAP]] = ["AkalabethWorldMapScene"];
    _sceneGroups[[RetroC64Constants.AKALABETH_SETUP]] = ["SetupScene"];
    _sceneGroups[[RetroC64Constants.AKALABETH_CHARACTER_CREATION]] = ["IntroScene"];
    _sceneGroups[[RetroC64Constants.AKALABETH_EQUIPMENT_SHOP]] = ["ShopScene"];
    // set initial state for Intro
    RetroC64IntroScene.state = RetroC64Constants.AKALABETH_INTRO_LUCKY_NUMBER;
    
    // set initial state for Equipment Shot
    RetroC64ShopScene.state = RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE;
    
    // set initial state for Equipment Shot
    RetroC64SetupScene.state = RetroC64Constants.AKALABETH_SETUP;
    
    // set initial state for Equipment Shot
    RetroC64AkalabethWorldMapScene.state = RetroC64Constants.AKALABETH_WORLD_MAP_DISPLAY;
    
    // set current scene
    this.switch(RetroC64Constants.AKALABETH_CHARACTER_CREATION);
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
        console.log("turn off", scenes[i])
        this.scene.setVisible(false, scenes[i]);
        this.scene.setActive(false, scenes[i]);
      }
    }
    // enable current
    _currentGroup = scene;
    let scenes = _sceneGroups[_currentGroup];
    for (let i = scenes.length - 1; i >= 0; i--) {
      console.log("turn on", scenes[i])
      this.scene.setVisible(true, scenes[i]);
      this.scene.setActive(true, scenes[i]);
    }
  };
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64SceneController };
}
