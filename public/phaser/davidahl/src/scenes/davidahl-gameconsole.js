if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { DavidAhlAceyDucey } = require("../bus/davidahl-acey-ducey.js");
}
/**
 * @class The Game Console will run the various game consoles available.
 */
var DavidAhlGameConsole = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "GameConsole",
    active: false
  });
  /** @private The current game cartridge. */
  let _cartridge = "";
  /** @private The map of game cartridges. */
  const _CARTRIDGES = {
    /** @private the Acey Ducey game */
    "Acey Ducey": new DavidAhlAceyDucey({ scene: _scene }),
  };
  { // DavidAhlGameConsole Getters/Setters
    /** Sets the current game cartridge */
    Object.defineProperty(_scene, "cartridge", {
      set: function(value) {
        if (!_CARTRIDGES.hasOwnProperty(value)) {
          throw ["Missing game cartridge", value];
        }
        _cartridge = value;
        let scenes = _CARTRIDGES[_cartridge];
        if (Array.isArray(scenes)) {
          for (let i = scenes.length - 1; i >= 0; i--) {
            scenes[i].startGame();
          }
        } else {
          scenes.startGame();
        }
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
    if (_cartridge !== "") {
      _CARTRIDGES[_cartridge].preload();
    }
  };
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  _scene.create = function(data) {
    if (_cartridge !== "") {
      let scenes = _CARTRIDGES[_cartridge];
      if (Array.isArray(scenes)) {
        for (let i = scenes.length - 1; i >= 0; i--) {
          scenes[i].create(data);
        }
      } else {
        scenes.create(data);
      }
    }
    //  Global event listener, catches all keys
    //  Receives every single key up event, regardless of type
    this.input.keyboard.on('keyup', function (event) {
      let scenes = _CARTRIDGES[_cartridge];
      if (Array.isArray(scenes)) {
        for (let i = scenes.length - 1; i >= 0; i--) {
          scenes[i].handleKeyUpEvent(event);
        }
      } else {
        scenes.handleKeyUpEvent(event);
      }
    });
  };
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  _scene.update = function(time, delta) {
    if (_cartridge !== "") {
      let scenes = _CARTRIDGES[_cartridge];
      if (Array.isArray(scenes)) {
        for (let i = scenes.length - 1; i >= 0; i--) {
          scenes[i].update(time, delta);
        }
      } else {
        scenes.update(time, delta);
      }
    }
  };
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { DavidAhlGameConsole };
}
