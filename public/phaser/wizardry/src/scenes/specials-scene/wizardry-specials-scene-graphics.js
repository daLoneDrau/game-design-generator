if (typeof(module) !== "undefined") {
  var Phaser = require("phaser");
  var { WizardryConstants } = require("../../config/wizardry-constants");
  var { WizardrySceneController } = require("../wizardry-scene-controller");
  var { WizardrySpecialsScene } = require("../wizardry-specials-scene");
}
/**
 * @class The graphical renderer for the Specials Scene.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardrySpecialsSceneGraphics(parameterObject) {
  parameterObject.columns = 40;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private the Phaser.Graphics instance */
  this._graphics = null;
  /** @private flag indicating whether the screen needs to be reset */
  this._resetScreen = true;
  this._uiFrame = null;
  { // WizardrySpecialsSceneGraphics View Templates
    this._VIEWS[[WizardryConstants.SPECIALS_MAIN]] = {
      group: null,
      children: []
    };
    this._VIEWS[[WizardryConstants.SPECIALS_INITGAME]] = {
      group: null,
      children: []
    };
  }
  { // WizardrySpecialsSceneGraphics Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[WizardryConstants.SPECIALS_MAIN]] = function(event, context) {
      
    };
    this._KEY_UP_EVENT_HANDLERS[[WizardryConstants.SPECIALS_INITGAME]] = function(event, context) {
      
    };
  }
  this._state = WizardryConstants.SPECIALS_MAIN;
};
WizardrySpecialsSceneGraphics.prototype = Object.create(UiScene.prototype);
WizardrySpecialsSceneGraphics.prototype.constructor = UiScene;
{ // WizardrySpecialsSceneGraphics Getters/Setters
  Object.defineProperty(WizardrySpecialsSceneGraphics.prototype, 'resetScreen', {
    /** Getter for the _resetScreen property. */
    get() {
      return this._resetScreen;;
    },
    /** Getter for the _resetScreen property. */
    set(value) {
      this._resetScreen = value;;
    }
  });
}
/**
 * Starts the scene.
 */
WizardrySpecialsSceneGraphics.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // WizardrySpecialsSceneGraphics Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  WizardrySpecialsSceneGraphics.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  WizardrySpecialsSceneGraphics.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  WizardrySpecialsSceneGraphics.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    this._graphics = this._scene.make.graphics({ lineStyle: { width: 3, color: 0 /* 10920447 */ } });
    this.generateScreenOutlineTexture();
    this.generateBlankTexture();
    this._uiFrame = this._scene.add.image(0, 0, 'blank');
    this._uiFrame.setOrigin(0,0);
    this._uiFrame.setDepth(10);
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  WizardrySpecialsSceneGraphics.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
    if (this._resetScreen) {
      console.log("reset screen")
      this._uiFrame.setTexture("screen_outline");
      this._resetScreen = false;
    }
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
WizardrySpecialsSceneGraphics.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Renders a polygon based on the supplied points.
 * @param {string | Array.<number> | Array} points the list of points defining the perimeter of this Polygon
 * @param {Phaser.Graphics} graphics the graphics instance used for rendering the polygon
 */
WizardrySpecialsSceneGraphics.prototype.renderPolygon = function(points, graphics) {
  if (!Array.isArray(points)) {
    throw ["Array is required", points];
  }
  let polygon = new Phaser.Geom.Polygon(points);
  // create a polygon out of the points
  graphics.beginPath();
  graphics.moveTo(polygon.points[0].x, polygon.points[0].y);
  for (let i = 1; i < polygon.points.length; i++) {
    graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
  }
  // graphics.closePath();
  graphics.strokePath();
}
/**
 * Generates the texture for the screen outline.
 */
WizardrySpecialsSceneGraphics.prototype.generateScreenOutlineTexture = function() {
  function getPoints(val, isX) {
    const cellWidth = 1024 /  40, cellHeight = 768 / 24, centW = cellWidth * 0.5, centH = cellHeight * 0.5;
    let ret = val * cellWidth + centW;
    if (!isX) {
      ret  = val * cellHeight + centH;
    }
    return ret;
  }
  this.renderPolygon([
    getPoints(0, true), getPoints(0, false),
    getPoints(39, true), getPoints(0, false),
    getPoints(39, true), getPoints(23, false),
    getPoints(0, true), getPoints(23, false),
    getPoints(0, true), getPoints(0, false)
  ], this._graphics);
  this.renderPolygon([
    getPoints(0, true), getPoints(10, false),
    getPoints(39, true), getPoints(10, false)
  ], this._graphics);
  this.renderPolygon([
    getPoints(0, true), getPoints(15, false),
    getPoints(39, true), getPoints(15, false)
  ], this._graphics);
  this.renderPolygon([
    getPoints(12, true), getPoints(0, false),
    getPoints(12, true), getPoints(10, false)
  ], this._graphics);
  this.renderPolygon([
    getPoints(12, true), getPoints(5, false),
    getPoints(39, true), getPoints(5, false)
  ], this._graphics);
  // generate the texture
  this._graphics.generateTexture('screen_outline', 1024, 768);
  this._graphics.clear();
}
/**
 * Generates a blank texture.
 */
WizardrySpecialsSceneGraphics.prototype.generateBlankTexture = function() {
  this._graphics.generateTexture('blank', 1, 1);
  this._graphics.clear();
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardrySpecialsSceneGraphics };
}
