if (typeof(module) !== "undefined") {
  var { WizardrySpecialsSceneInterface } = require("./specials-scene/wizardry-specials-scene-interface");
  var { WizardryConstants } = require("../config/wizardry-constants");
  var { WizardryXgoto } = require("../config/wizardry-constants");
  var { WizardryController } = require("../services/wizardry-controller");
  var { WizardrySceneController } = require("./wizardry-scene-controller");
  var { WizardrySpecialsSceneGraphics } = require("./specials-scene/wizardry-specials-scene-graphics");
}
/**
 * @class The initial scene will load scenario data and initialize variables.
 */
var WizardrySpecialsScene = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "SpecialsScene",
    active: false
  });
  /** @private The current state. */
  let _state = "";
  /** @private ?? */
  let _spcIndex = 0;
  /** @private flag indicating whether the game has been initialized */
  let _gameInitialized = false;
  /** @private flag indicating whether the game has been initialized */
  let _initGame = function() {
    // load scenario data
    WizardryController.xgoto = WizardryXgoto.XCASTLE;
    // WRITE( CHR( 12)); // form feed
    // TEXTMODE; // put screen in text mode
    // MAZESCRN;
    //  CLRRECT( 0, 0, 40, 24);  // clear a rectangle on the screen starting at 0,0 that is 40x24
    //  draw the screen outline in the Graphics
    /*
    MAZEX    := 0;
    MAZEY    := 0;
    MAZELEV  := 0;
    PARTYCNT := 0;
    DIRECTIO := 0;
    ACMOD2   := 0;
    */
  };;
  /** @private WizardrySpecialsSceneInterface instance */
  let _specialsSceneInterface = new WizardrySpecialsSceneInterface({ scene: _scene, show: true });
  /** @private WizardrySpecialsSceneGraphics instance */
  let _specialsSceneGraphics = new WizardrySpecialsSceneGraphics({ scene: _scene, show: true });
  let _executePostStateSetter = function() {
    switch(_state) {
      case WizardryConstants.SPECIALS_INITGAME:
        _specialsSceneGraphics.state = WizardryConstants.SPECIALS_INITGAME;
        _specialsSceneInterface.state = WizardryConstants.SPECIALS_INITGAME;
        break;
    }
  }
  /** @private The map of child scenes. */
  const _SCENES = {
    /** @private the scene instances displayed when this view is active */
    [WizardryConstants.SPECIALS_MAIN]: [_specialsSceneGraphics, _specialsSceneInterface],
    /** @private the scene instances displayed when this view is active */
    [WizardryConstants.SPECIALS_INITGAME]: [_specialsSceneGraphics, _specialsSceneInterface],
  };
  { // WizardrySpecialsScene Getters/Setters
    /** Getter/Setter the current state */
    Object.defineProperty(_scene, "state", {
      get: function() {
        return _state;
      },
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
        if (typeof(_executePostStateSetter) !== "undefined") {
          _executePostStateSetter();
        }
      }
    });
  }
  { // WizardrySpecialsScene Scene Extensions
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
      if (WizardrySceneController.createCompleted) {
        if (WizardryController.xgoto === WizardryXgoto.XINSAREA) {
          // if the state isn't INSPECT, then change to that state. INSPECT goes to the RUNNER state
          if (_state !== WizardryConstants.SPECIALS_INSPECT) {
            _scene.state = WizardryConstants.SPECIALS_INSPECT;
          }
        } else {
          WizardryController.xgoto = WizardryController.xgoto2;
          _spcIndex = WizardryController.llbase04;
          if (_spcIndex < 0) {
            if (_state !== WizardryConstants.SPECIALS_INITGAME) {
              _scene.state = WizardryConstants.SPECIALS_INITGAME;
            }
          } else {
            if (_state !== WizardryConstants.SPECIALS_MISC) {
              _scene.state = WizardryConstants.SPECIALS_MISC;
            }
          }
        }
      }
    };
  }
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { WizardrySpecialsScene };
}
