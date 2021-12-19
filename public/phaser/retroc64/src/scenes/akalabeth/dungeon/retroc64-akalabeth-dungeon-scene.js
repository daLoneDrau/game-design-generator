if (typeof(module) !== "undefined") {
  var { RetroC64Constants } = require("../../../config/retroc64-constants");
}
/**
 * @class The Dungeon View displays the character's trek through the dungeons.
 */
var RetroC64AkalabethDungeonScene = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "AkalabethDungeonScene",
    active: false
  });
  /** @private The current state. */
  let _state = "";
  /** @private A flag will be used to indicate when an animation is playing. */
  let _animationPlaying = false;
  /** @private A flag will be used to indicate when a 'Move' command has been entered by the player. */
  let _moveEntered = -1;
  /** @private  Flag indicating whether the world map needs to be re-drawn. */
  let _needsMapRedraw = true;
  /** @private RetroC64AkalabethDungeonInterface instance */
  let _akalabethDungeonInterface = null;
  /** @private RetroC64AkalabethDungeonGraphics instance */
  let _akalabethDungeonGraphics = null;
  /** @private The map of child scenes. */
  const _SCENES = {
    /** @private the scene instances displayed when this view is active */
    [RetroC64Constants.AKALABETH_DUNGEON_MAIN]: [_akalabethDungeonGraphics, _akalabethDungeonInterface],
  };
  { // RetroC64AkalabethDungeonScene Getters/Setters
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
    Object.defineProperty(_scene, "animationPlaying", {
      /**
       * Getter for field _animationPlaying.
       * @returns {Object}
       */
      get: function() {
        return _animationPlaying;
      },
      /**
       * Setter for field _animationPlaying.
       * @param {PropertyKey} value the value
       */
      set: function(value) {
        if (typeof(value) !== "boolean") {
          throw ["Invalid value", value];
        }
        _animationPlaying = value;
      }
    });
    Object.defineProperty(_scene, "moveEntered", {
      /**
       * Getter for field _moveEntered.
       * @returns {Number}
       */
      get: function() {
        return _moveEntered;
      },
      /**
       * Setter for field _moveEntered.
       * @param {PropertyKey} value the value
       */
      set: function(value) {
        if (isNaN(parseInt(value))) {
          throw ["Invalid value", value];
        }
        _moveEntered = value;
      }
    });
    Object.defineProperty(_scene, "needsMapRedraw", {
      /**
       * Getter for field _needsMapRedraw.
       * @returns {Object}
       */
      get: function() {
        return _needsMapRedraw;
      },
      /**
       * Setter for field _needsMapRedraw.
       * @param {PropertyKey} value the value
       */
      set: function(value) {
        if (typeof(value) !== "boolean") {
          throw ["Invalid value", value];
        }
        _needsMapRedraw = value;
      }
    });
  }
  { // RetroC64AkalabethDungeonScene Scene Extensions
    /**
     * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
     */
    _scene.init = function(data) {
      if (_akalabethDungeonGraphics === null) {
        _akalabethDungeonGraphics = new this.GraphicsClass({ scene: _scene, show: false });
        _SCENES[RetroC64Constants.AKALABETH_DUNGEON_MAIN][0] = _akalabethDungeonGraphics;
      }
      if (_akalabethDungeonInterface === null) {
        _akalabethDungeonInterface = new this.InterfaceClass({ scene: _scene, show: false });
        _SCENES[RetroC64Constants.AKALABETH_DUNGEON_MAIN][1] = _akalabethDungeonInterface;
      }
      
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
  /**
   * Clears the scene.
   */
  _scene.clear = function() {
    _akalabethDungeonInterface.clear();
    _needsMapRedraw = true;
  }
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethDungeonScene };
}
