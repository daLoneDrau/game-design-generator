import { WizardryScene } from "./wizardry-scene.js";

/**
 * The rate of frames per second the FADE animation runs at.
 */
const ALPHA_FADE_FRAMERATE = 10;
/**
 * A fade animation that lasts 3 seconds.
 * @type {BABYLON.Animation}
 */
const FADE = new BABYLON.Animation(
  "alphaFade", // Name of the animation
  "alpha", // Property to animate
  ALPHA_FADE_FRAMERATE, // The frames per second of the animation
  BABYLON.Animation.ANIMATIONTYPE_FLOAT // The data type of the animation
);
// Set the key frames of the animation - animation will last for 2.01 seconds and there are 4 keyframes at 0, 2, 3, and 3.01 seconds
FADE.setKeys([
  {
    frame: 0, // keyframe at 0 seconds
    value: 1, // at 0 seconds the alpha should be 1 (fully visible)
  },
  {
    frame: 2 * ALPHA_FADE_FRAMERATE, // keyframe at 2 seconds (2 * full framerate)
    value: 1, // at 2 seconds the alpha should be 1 (fully visible)
  },
  {
    frame: 3 * ALPHA_FADE_FRAMERATE, // keyframe at 3 seconds (3 * full frame rate)
    value: 0, // at 3 seconds the alpha should be 0 (invisible)
  }
]);
/**
 * @class
 */
class WizardryUiConfiguration {
  constructor(parent) {
    /**
     * the parent scene.
     * @private
     * @type {WizardryScene}
     */
    this._parent = parent;
    /**
     * the UI layout.
     * @private
     * @type {BABYLON.GUI.Grid}
     */
    this._configuration = null;
  }
  /**
   * Getter for the configuration property.
   */
  get configuration() {
    return this._configuration;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry() {}
  /**
   * Initalizes the view.
   */
  init() {}
  /**
   * Initializes the UI layout.
   * @param {object} parameterObject the layout parameters
   */
  initializeConfiguration(parameterObject) {
    this._configuration = WizardryScene.createGrid(parameterObject);
  }
  /**
   * Sets the UI view.
   */
  set() {}
}

export { ALPHA_FADE_FRAMERATE, FADE, WizardryUiConfiguration };