if (typeof(module) !== "undefined") {
  var { WizardryConstants } = require("../../config/wizardry-constants");
  var { WizardrySceneController } = require("../wizardry-scene-controller");
  var { WizardrySpecialsScene } = require("../wizardry-specials-scene");
}
/**
 * @class The interface renderer for the Specials Scene.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardrySpecialsSceneInterface(parameterObject) {
  parameterObject.columns = 1;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  { // WizardrySpecialsSceneInterface View Templates
    this._VIEWS[[WizardryConstants.SPECIALS_MAIN]] = {
      group: null,
      children: []
    };
  }
  { // WizardrySpecialsSceneInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[WizardryConstants.SPECIALS_MAIN]] = function(event, context) {
      
    };
    this._KEY_UP_EVENT_HANDLERS[[WizardryConstants.SPECIALS_INITGAME]] = function(event, context) {
      
    };
  }
  this._state = WizardryConstants.SPECIALS_MAIN;
};
WizardrySpecialsSceneInterface.prototype = Object.create(UiScene.prototype);
WizardrySpecialsSceneInterface.prototype.constructor = UiScene;
{ // WizardrySpecialsSceneInterface Getters/Setters
}
/**
 * Starts the scene.
 */
WizardrySpecialsSceneInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // WizardrySpecialsSceneInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  WizardrySpecialsSceneInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  WizardrySpecialsSceneInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  WizardrySpecialsSceneInterface.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  WizardrySpecialsSceneInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
WizardrySpecialsSceneInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardrySpecialsSceneInterface };
}
