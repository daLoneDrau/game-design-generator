if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
}
/**
 * @class Utility class used to break a scene's viewport into a grid of cells. Useful for positioning text and buttons.
 * @param {object} parameterObject optional initialization parameters
 */
function DavidAhlAlignmentGrid(parameterObject) {
  /** @private The parent object used to determine the screen dimensions. If a Phaser.Scene instance is not supplied it defaults to the Phaser.Game instance. */
  this._parent = null;
  /** @private The # of cells wide the grid should be. */
  this._cellWidth = 0;
  /** @private The # of cells high the grid should be. */
  this._cellHeight = 0;
  
  this._parent = parameterObject.parent;
  this._cellWidth = this._parent.scale.width / parameterObject.columns;
  this._cellHeight = this._parent.scale.height / parameterObject.rows;
};
DavidAhlAlignmentGrid.prototype = Object.create(Phaser.GameObjects.Group.prototype);
DavidAhlAlignmentGrid.prototype.constructor = Phaser.GameObjects.Group;
{ // DavidAhlAlignmentGrid Getters/Setters
}
/**
 * Places an object in relation to the grid.
 * @param {Number} x the x-coordinate of the cell where the object should be placed
 * @param {Number} y the y-coordinate of the cell where the object should be placed
 * @param {Phaser.GameObjects.GameObject} obj game object being placed
 */
DavidAhlAlignmentGrid.prototype.placeAt = function(x, y, obj) {
  //calculate the center of the cell
  //by adding half of the height and width
  //to the x and y of the coordinates
  let x2 = this._cellWidth * x + this._cellWidth / 2;
  let y2 = this._cellHeight * y + this._cellHeight / 2;
  obj.x = x2;
  obj.y = y2;
}
/**
 * Draws a red border demarcating the grid cells.
 */
DavidAhlAlignmentGrid.prototype.show = function() {
  if (typeof(this.graphics) === "undefined") {
    this.graphics = this._parent.add.graphics({ lineStyle: { width: 4, color: 0xff0000, alpha: 1 } });
  }
  for (let i = 0; i <= this._parent.scale.width; i += this._cellWidth) {
    let line = new Phaser.Geom.Line(i, 0, i, this._parent.scale.height);
    this.graphics.strokeLineShape(line);
  }
  for (let i = 0; i <= this._parent.scale.height; i += this._cellHeight) {
    let line = new Phaser.Geom.Line(0, i, this._parent.scale.width, i);
    this.graphics.strokeLineShape(line);
  }
}
if (typeof(module) !== "undefined") {
  module.exports = { DavidAhlAlignmentGrid };
}
