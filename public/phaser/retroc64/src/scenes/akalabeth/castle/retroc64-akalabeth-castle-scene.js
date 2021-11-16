if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethCastleInterface } = require("./retroc64-akalabeth-castle-interface");
}
/**
 * @class The Castle will be its own scene.
 */
var RetroC64AkalabethCastleScene = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "AkalabethCastleScene",
    active: false
  });
  /** @private The current state. */
  let _state = "";
  /** @private An array field will be used to track user entry for the character's name. */
  let _nameEntry = [];
  /** @private A constant field will set the maximum name length. */
  let _MAX_NAME_LEN = 12;
  /** @private A flag will track whether the player has entered their goal. */
  let _goalsStated = false;
  /** @private RetroC64AkalabethCastleInterface instance */
  let _akalabethCastleInterface = new RetroC64AkalabethCastleInterface({ scene: _scene, show: false });
  /** @private The map of child scenes. */
  const _SCENES = {
    /** @private the scene instances displayed when this view is active */
    [RetroC64Constants.AKALABETH_CASTLE_NAME_ENTRY]: [_akalabethCastleInterface],
  };
  { // RetroC64AkalabethCastleScene Getters/Setters
    /** Sets the current state */
    Object.defineProperty(_scene, "state", {
      set: function(value) {
        if (!_SCENES.hasOwnProperty(value)) {
          throw ["Missing scenes for state", value];
        }
        _state = value;
        let scenes = _SCENES[_state];
        if (Array.isArray(scenes)) {
          for (let i = scenes.length - 1; i >= 0; i--) {
            scenes[i].startScene();
          }
        } else {
          scenes.startScene();
        }
      }
    });
    Object.defineProperty(_scene, "nameEntry", {
      /**
       * Getter for field _nameEntry.
       * @returns {Object}
       */
      get: function() {
        return _nameEntry;
      },
      /**
       * Setter for field _nameEntry.
       * @param {PropertyKey} value the value
       */
      set: function(value) {
        _nameEntry = value;
      }
    });
    Object.defineProperty(_scene, "goalsStated", {
      /**
       * Getter for field _goalsStated.
       * @returns {Object}
       */
      get: function() {
        return _goalsStated;
      },
      /**
       * Setter for field _goalsStated.
       * @param {PropertyKey} value the value
       */
      set: function(value) {
        if (typeof(value) !== "boolean") {
          throw ["Invalid value", value];
        }
        _goalsStated = value;
      }
    });
    /**
     * Getter for field _MAX_NAME_LEN.
     * @returns {Number}
     */
    Object.defineProperty(_scene, "MAX_NAME_LEN", {
      get: function() {
        return _MAX_NAME_LEN;
      }
    });
  }
  { // RetroC64AkalabethCastleScene Scene Extensions
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
      if (_state !== "") {
        _SCENES[_state].preload();
      }
    };
    /**
     * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
     */
    _scene.create = function(data) {
      if (_state !== "") {
        let scenes = _SCENES[_state];
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
        let scenes = _SCENES[_state];
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
      if (_state !== "") {
        let scenes = _SCENES[_state];
        if (Array.isArray(scenes)) {
          for (let i = scenes.length - 1; i >= 0; i--) {
            scenes[i].update(time, delta);
          }
        } else {
          scenes.update(time, delta);
        }
      }
    };
  }
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethCastleScene };
}
