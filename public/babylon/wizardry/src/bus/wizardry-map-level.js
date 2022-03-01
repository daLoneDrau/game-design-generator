import { WizardrySquare } from "../config/wizardry-constants.js";

/**
 * A map level. Contains a 20x20 grid of map cells.
 * @class
 */
class WizardryMapLevel { 
  /**
   * Creates a new instance of WizardryMapLevel.
   * @param {object} parameterObject initialization parameters
   */ 
  constructor(parameterObject = {}) {
    /**
     * a 20x20 dictionary of map cells.
     * @private
     * @type {object}
     */
    this._cells = {};
    // read each room
    for (const roomName in parameterObject.rooms) {
      const room = parameterObject.rooms[roomName];
      // read each cell
      for (const coordinateSet in room.positions) {
        const split = coordinateSet.split(",");
        const x = parseInt(split[0]), y = parseInt(split[1]);
        if (!this._cells.hasOwnProperty(x)) {
          this._cells[x] = {};
        }
        this._cells[x][y] = new WizardryMapCell(parameterObject[coordinateSet]);
        this._cells[x][y].roomId = roomName;
        this._cells[x][y].isTreasureRoom = room.isTreasureRoom;
      }
    }
    for (let x = 19; x >= 0; x--) {
      for (let y = 19; y >= 0; y--) {
        if (!this._cells.hasOwnProperty(x)) {
          this._cells[x] = {};
        }
        if (!this._cells[x].hasOwnProperty(y)) {
          this._cells[x][y] = new WizardryMapCell();
        }
      }
    }
                   /*   
            ENMYCALC : PACKED ARRAY[ 1..3] OF RECORD
              MINENEMY : INTEGER;
              MULTWORS : INTEGER;
              WORSE01  : INTEGER;
              RANGE0N  : INTEGER;
              PERCWORS : INTEGER;
            END;
            */
  }
  /**
   * Gets all cell's that share a room.
   * @param {Number} x the origin cell's x-coordinate
   * @param {Number} y the origin cell's y-coordinate
   * @returns {WizardryMapCell[]} the list of cells in the room
   */
  getAllCellsForRoom(x, y) {
    let origin = this.getCell(x, y);
    const arr = [];
    for (const rowX in this._cells) {
      const row = this._cells[rowX];
      for (let colY in row) {
        const cell = row[colY];
        if (x == rowX && y === colY) {
          continue;
        }
        if (cell.roomId === origin.roomId) {
          arr.push(cell);
        }
      }
    }
    return arr;
  }
  /**
   * Gets a map cell at a specific location
   * @param {Number} x the x-coordinate
   * @param {Number} y the y-coordinate
   * @returns {WizardryMapCell} the map cell at that specific location
   */
  getCell(x, y) {
    if (isNaN(parseInt(x))) {
      throw ["X-coordinate must be an integer", x];
    }
    if (isNaN(parseInt(y))) {
      throw ["Y-coordinate must be an integer", y];
    }
    if (!this._cells.hasOwnProperty(x)) {
      throw ["X-coordinate is out of bounds", x];
    }
    if (!this._cells[x].hasOwnProperty(y)) {
      throw ["Y-coordinate is out of bounds", y];
    }
    return this._cells[x][y];
  }
}

/**
 * A map location.
 * @class
 */
class WizardryMapCell {
  /**
   * Creates a new WizardryMapCell instance.
   * @param {object} parameterObject the instance parameters
   */
  constructor(parameterObject = {}) {
    /**
     * the cell's wall configuration.
     * @private
     * @type {Number}
     */
    this._walls = 0;
    if (parameterObject.hasOwnProperty("WALLS")) {
      this._walls = parseInt(parameterObject.WALLS);
    }
    /**
     * the cell's door configuration.
     * @private
     * @type {Number}
     */
    this._doors = 0;
    if (parameterObject.hasOwnProperty("DOORS")) {
      this._doors = parameterObject.DOORS;
    }
    /**
     * the cell's hidden door configuration.
     * @private
     * @type {Number}
     */
    this._hidden = 0;
    if (parameterObject.hasOwnProperty("HIDDEN")) {
      this._hidden = parameterObject.HIDDEN;
    }
    /**
     * the cell's type.
     * @private
     * @type {WizardrySquare}
     */
    this._type = WizardrySquare.NORMAL;
    if (parameterObject.hasOwnProperty("TYPE")) {
      this._type = WizardrySquare.fromString(parameterObject.TYPE);
    }
    /**
     * the cell's auxiliary value.
     * @private
     * @type {Number}
     */
    this._aux0 = 0;
    if (parameterObject.hasOwnProperty("AUX0")) {
      this._aux0 = parseInt(parameterObject.AUX0);
    }
    /**
     * the cell's auxiliary value.
     * @private
     * @type {Number}
     */
    this._aux1 = 0;
    if (parameterObject.hasOwnProperty("AUX1")) {
      this._aux1 = parseInt(parameterObject.AUX1);
    }
    /**
     * the cell's auxiliary value.
     * @private
     * @type {Number}
     */
    this._aux2 = 0;
    if (parameterObject.hasOwnProperty("AUX2")) {
      this._aux2 = parseInt(parameterObject.AUX2);
    }
    /**
     * the cell's room identifier.
     * @private
     * @type {string}
     */
    this._roomId;
    /**
     * a flag indicating whether the cell is part of a treasure room.
     * @private
     * @type {Boolean}
     */
    this._isTreasureRoom;
  }
  /**
   * Getter for the cell's type.
   */
  get type() {
    return this._type;
  }
  /**
   * Getter for the flag indicating whether the cell is part of a treasure room.
   */
  get isTreasureRoom() {
    return this._isTreasureRoom;
  }
  /**
   * Setter for the flag indicating whether the cell is part of a treasure room.
   */
  set isTreasureRoom(value) {
    this._isTreasureRoom = value;
  }
  /**
   * Getter for the cell's room identifier.
   */
  get roomId() {
    return this._roomId;
  }
  /**
   * Setter for the cell's room identifier.
   */
  set roomId(value) {
    this._roomId = value;
  }
}

export { WizardryMapLevel };