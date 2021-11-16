if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethShopInventoryInterface } = require("./retroc64-akalabeth-shop-inventory-interface");
  var { RetroC64ShopCommandsUiScene } = require("./retroc64-akalabeth-shop-commands-interface");
  var { RetroC64AkalabethShopPlayerStatsInterface } = require("./retroc64-akalabeth-shop-player-stats-interface");
  var { RetroC64ShopSceneUI } = require("./intro/retroc64-shop-scene-ui");
}
/**
 * @class The Scene Container for rendering the Equipment Shop scene.
 */
var RetroC64AkalabethShopScene = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "AkalabethShopScene",
    active: false
  });
  /** @private The current state. */
  let _state = "";
  /** @private The Shop will track the state to which it calls back in the Scene Controller */
  let _callbackState = RetroC64Constants.AKALABETH_SETUP;
  /** @private RetroC64AkalabethShopInventoryInterface instance */
  let _akalabethShopInventoryInterface = new RetroC64AkalabethShopInventoryInterface({ scene: _scene, show: false });
  /** @private RetroC64AkalabethShopCommandsInterface instance */
  let _akalabethShopCommandsInterface = new RetroC64AkalabethShopCommandsInterface({ scene: _scene, show: false });
  /** @private RetroC64AkalabethShopPlayerStatsInterface instance */
  let _akalabethShopPlayerStatsInterface = new RetroC64AkalabethShopPlayerStatsInterface({ scene: _scene, show: false });
  /** @private The map of child scenes. */
  const _SCENES = {
    /** @private the scene instances displayed during the equipment purchase state */
    [RetroC64Constants.AKALABETH_EQUIPMENT_SHOP_PURCHASE]: [_akalabethShopPlayerStatsInterface, _akalabethShopInventoryInterface, _akalabethShopCommandsInterface],
  };
  { // RetroC64AkalabethShopScene Getters/Setters
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
    Object.defineProperty(_scene, "callbackState", {
      /**
       * Getter for field _callbackState.
       */
      get: function() {
        return _callbackState;
      },
      /**
       * Setter for field _callbackState.
       * @param {PropertyKey} value the value
       */
      set: function(value) {
        if (isNaN(parseInt(value))) {
          throw ["Invalid value", value];
        }
        _callbackState = value;
      }
    });
  }
  { // RetroC64AkalabethShopScene Scene Extensions
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
  module.exports = { RetroC64AkalabethShopScene };
}
