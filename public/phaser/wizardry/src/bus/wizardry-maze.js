if (typeof(module) !== "undefined") {
  var { Watchable } = require("../../../assets/js/rpgbase.full");
  var { WizardrySquare } = require("../config/wizardry-constants");
  var { WizardryWall } = require("../config/wizardry-constants");
}
/**
 * @class The application defines a class to represent a maze level.
 * @param {object} parameterObject optional initialization parameters
 */
function WizardryMaze(parameterObject) {
  /** @private the array of map wall locations. */
  this._w = [];
  /** @private the array of map wall locations. */
  this._s = [];
  /** @private the array of map wall locations. */
  this._e = [];
  /** @private the array of map wall locations. */
  this._n = [];
  /** @private the array of fights. */
  this._fights = [];
  /** @private the array of sqreXtra. */
  this._sqreXtra = [];
  /** @private the array of sqreType. */
  this._sqreType = [];
  /** @private the array of aux0. */
  this._aux0 = [];
  /** @private the array of aux1. */
  this._aux1 = [];
  /** @private the array of aux2. */
  this._aux2 = [];
  /** @private the array of aux2. */
  this._enmyCalc = [
    {
      minEnemy: 0,
      multWors: 0,
      worse01: 0,
      rangeOn: 0,
      percWors: 0
    },
    {
      minEnemy: 0,
      multWors: 0,
      worse01: 0,
      rangeOn: 0,
      percWors: 0
    },
    {
      minEnemy: 0,
      multWors: 0,
      worse01: 0,
      rangeOn: 0,
      percWors: 0
    }
  ];
  // fill the maze with walls
  // TODO - fill with data
  Watchable.apply(this);
};
WizardryMaze.prototype = Object.create(Watchable.prototype);
WizardryMaze.prototype.constructor = Watchable;
{ // WizardryMaze Getters/Setters
}
if (typeof(module) !== "undefined") {
  module.exports = { WizardryMaze };
}
