/**
 * @class David Ahl constants.
 */
var DavidAhlConstants = {
  /*********************
   * EQUIPMENT ELEMENTS - generated dynamically
   ********************/
  EQUIPMENT_ELEMENTS: {},
  /*********************
   * ACEY_DUCEY_STATES
   ********************/
  /** The Game Intro */
  ACEY_DUCEY_INTRO: 0,
  /** The Main Screen */
  ACEY_DUCEY_MAIN: 1,
  /** The Round Over Screen */
  ACEY_DUCEY_ROUND_OVER: 2,
  /*********************
   * MAIN_MENU_STATES
   ********************/
  /** The default menu displayed. */
  MAIN_MENU_DEFAULT: 0,
  /** The 'Basic Games' menu should be displayed. */
  MAIN_MENU_BASIC: 1,
  /** The 'Basic Card Games' menu should be displayed. */
  MAIN_MENU_CARD_GAMES: 2,
}
/**
 * @class Class enum using singleton pattern
 * @todo documentation
 */
const DavidAhlAttributeDescriptors = function () {
  console.trace();
  throw "Class DavidAhlAttributeDescriptors is an enum; no instances of it can be created.";
};

if (typeof(module) !== "undefined") {
  module.exports = {
    DavidAhlConstants: Object.freeze(DavidAhlConstants),
    DavidAhlAttributeDescriptors,
  };
}
