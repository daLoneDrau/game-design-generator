if (typeof(module) !== "undefined") {
  var Phaser = require("phaser");
  var { RetroC64AkalabethMonsterData } = require("./retroc64-akalabeth-monster-data");
  var { RetroC64Constants } = require("../../config/retroc64-constants");
  var { Dice } = require("../../../../../../../lib/RPGBase-NodeJS/src/services/dice");
}
/**
 * @class The Dungeon itself will be represented by a prototype class made up of vectors that are assigned values.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethDungeon(parameterObject) {
  /** @private The Dungeon level */
  this._dungeonLevel = [];
  /** @private The list of monsters generated for the dungeon level. */
  this._monsters = [];
  /** @private PX field */
  this._px = 0;
  /** @private The dungeon will be made up of cells; a cell is a vector 2 instance with flags for the cell occupant (empty, wall, monster, etc...) and visibility */
  this._dungeonCell = function(vector) {
    this.vector2 = vector;
    this.occupant = 0;
    this.isVisible = false;
  };
  /** @private the PY field */
  this._py = 0;
  /** @private The DX field */
  this._dx = 1;
  /** @private The DY field */
  this._dy = 0;
  this._monsterXp = 0;
};
{ // RetroC64AkalabethDungeon Getters/Setters
  Object.defineProperty(RetroC64AkalabethDungeon.prototype, 'monsterXp', {
    /**
     * Getter for field _monsterXp.
     * @returns {Object}
     */
    get() {
      return this._monsterXp;
    },
    /**
     * Setter for field _monsterXp.
     * @param {PropertyKey} value the value
     */
    set(value) {
      this._monsterXp = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethDungeon.prototype, 'dungeonLevel', {
    /**
     * Getter for field _dungeonLevel.
     * @returns {Object}
     */
    get() {
      return this._dungeonLevel;
    },
    /**
     * Setter for field _dungeonLevel.
     * @param {PropertyKey} value the value
     */
    set(value) {
      this._dungeonLevel = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethDungeon.prototype, 'monsters', {
    /**
     * Getter for field _monsters.
     * @returns {Object}
     */
    get() {
      return this._monsters;
    },
    /**
     * Setter for field _monsters.
     * @param {PropertyKey} value the value
     */
    set(value) {
      this._monsters = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethDungeon.prototype, 'px', {
    /**
     * Getter for field _px.
     * @returns {Number}
     */
    get() {
      return this._px;
    },
    /**
     * Setter for field _px.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._px = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethDungeon.prototype, 'py', {
    /**
     * Getter for field _py.
     * @returns {Number}
     */
    get() {
      return this._py;
    },
    /**
     * Setter for field _py.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._py = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethDungeon.prototype, 'dx', {
    /**
     * Getter for field _dx.
     * @returns {Number}
     */
    get() {
      return this._dx;
    },
    /**
     * Setter for field _dx.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._dx = value;
    }
  });
  Object.defineProperty(RetroC64AkalabethDungeon.prototype, 'dy', {
    /**
     * Getter for field _dy.
     * @returns {Number}
     */
    get() {
      return this._dy;
    },
    /**
     * Setter for field _dy.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._dy = value;
    }
  });
}
/**
 * Gets a dungeon cell that matches a specific set of coordinates, or null if no cell exists.
 * @param {Number} x the x-coordinate
 * @param {Number} y the y-coordinate
 * @returns {object}
 */
RetroC64AkalabethDungeon.prototype.getDungeonCell = function(x, y) {
  let cell = null;
  for (let i = this._dungeonLevel.length - 1; i >= 0; i--) {
    if (this._dungeonLevel[i].vector2.equals({ x: x, y: y })) {
      cell = this._dungeonLevel[i];
      break;
    }
  }
  return cell;
}
/**
 * Procedurally-generates a dungeon level.
 */
RetroC64AkalabethDungeon.prototype.newDungeonLevel = function() {
  this._dungeonLevel.length = 0;
  // the dungeon level will be a 11x11 array filled with 0s
  for(let y = 0; y <= 10; y++) {
    for(let x = 0; x <= 10; x++) {
      this._dungeonLevel.push(new this._dungeonCell(new Phaser.Math.Vector2(x, y)));
    }
  }
  
  // fill the edges with 1s (0,0 - 0,10 and then 10,0 - 10,10, as well as the sides)
  for (let x = 0; x <= 10; x++) {
    this.getDungeonCell(x, 0).occupant = 1;
    this.getDungeonCell(x, 10).occupant = 1;
    this.getDungeonCell(0, x).occupant = 1;
    this.getDungeonCell(10, x).occupant = 1;
  }
  
  // set walls at fixed locations
  for (let x = 2; x <= 8; x += 2) {
    for (let y = 1; y <= 9; y++) {
      this.getDungeonCell(x, y).occupant = 1;
      this.getDungeonCell(y, x).occupant = 1;
    }
  }
  
  // randomly place objects
  for (let x = 2; x <= 8; x += 2) {
    for (let y = 1; y <= 9; y += 2) {
      if (Math.random() > .95) {
        this.getDungeonCell(x, y).occupant = 2;
      }
      if (Math.random() > .95) {
        this.getDungeonCell(y, x).occupant = 2;
      }
      if (Math.random() > .6) {
        this.getDungeonCell(x, y).occupant = 3;
      }
      if (Math.random() > .6) {
        this.getDungeonCell(y, x).occupant = 3;
      }
      if (Math.random() > .6) {
        this.getDungeonCell(x, y).occupant = 4;
      }
      if (Math.random() > .6) {
        this.getDungeonCell(y, x).occupant = 4;
      }
      if (Math.random() > .97) {
        this.getDungeonCell(x, y).occupant = 9;
      }
      if (Math.random() > .97) {
        this.getDungeonCell(y, x).occupant = 9;
      }
      if (Math.random() > .94) {
        this.getDungeonCell(x, y).occupant = 5;
      }
      if (Math.random() > .94) {
        this.getDungeonCell(y, x).occupant = 5;
      }
    }
  }
  
  // clear off the cell to the east of the entry-point
  this.getDungeonCell(2, 1).occupant = 0;
  
  // place ladders up/down
  if (this.AkalabethController.levelsUnderground % 2 ===  0) { // place on even levels
    this.getDungeonCell(7, 3).occupant = 7;
    this.getDungeonCell(3, 7).occupant = 8;
  } else { // place on odd levels
    this.getDungeonCell(7, 3).occupant = 8;
    this.getDungeonCell(3, 7).occupant = 7;
  }
  if (this.AkalabethController.levelsUnderground === 1) { // place on 1st level
    this.getDungeonCell(1, 1).occupant = 8;  // place the ladder up
    this.getDungeonCell(7, 3).occupant = 0;  // clear our the ladder up placed for odd levels
  }
  this.generateMonsters();
  // print the dungeon
  let arr = [], r = [];
  for (let i = 0, li = this._dungeonLevel.length; i < li; i++) {
    let cell = this._dungeonLevel[i];
    if (i !== 0 && cell.vector2.x === 0) {
      arr.push(JSON.parse(JSON.stringify(r)));
      r.length = 0;
    }
    r.push(cell.occupant);
  }
  arr.push(JSON.parse(JSON.stringify(r)));
  console.log(arr)
}
/**
 * Generates monsters for a dungeon level.
 */
RetroC64AkalabethDungeon.prototype.generateMonsters = function() {
  this._monsters.length = 0;
  for (let i = 9; i >= 0; i--) {
    let monsterData = new RetroC64AkalabethMonsterData();
    monsterData.type = i;
    monsterData.hitPoints = i + 4 + this.AkalabethController.levelsUnderground;
    if (i - 1 > this.AkalabethController.levelsUnderground
        || Math.random() > .4) {
      // if the monster type is 3 levels above the dungeon level it won't appear.
      // there is also a 60% chance a monster won't be placed
      continue;
    }
    let passed = false;
    do {
      // place the monster in a random interior location
      monsterData.x = Dice.rollDie(9);
      monsterData.y = Dice.rollDie(9);
      // re-roll if the position isn't empty, or is the player's spot
    } while (this.getDungeonCell(monsterData.x, monsterData.y).occupant !== 0 || monsterData.x === this._px || monsterData.y === this._py);
    // mark the monster's position
    this.getDungeonCell(monsterData.x, monsterData.y).occupant = monsterData.type * 10;
    // change the calculation for hit points (why?)
    monsterData.hitPoints = i * 2 + this.AkalabethController.levelsUnderground * 2 * this.AkalabethController.levelOfPlay;
    this._monsters.push(monsterData);
  }
}
/**
 * Plots all points on a line between two points.
 * @param {Number} x0 the x-coordinate of the first point
 * @param {Number} y0 the y-coordinate of the first point
 * @param {Number} x1 the x-coordinate of the second point
 * @param {Number} y1 the y-coordinate of the second point
 * @param {Function} cellIsBlocker a function to verify if a cell is considered to block light
 * @returns {Array}
 */
RetroC64AkalabethDungeon.prototype.plotBresenham = function(x0, y0, x1, y1, cellIsBlocker) {
  let dx = Math.abs(x1 - x0);
  let sx = x0 < x1 ? 1 : -1;
  let dy = -Math.abs(y1 - y0);
  let sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;  /* error value e_xy */
  let plot = [];
  let x = x0, y = y0;
  while (true) { /* loop */
    let cell = this.getDungeonCell(x, y);
    plot.push(JSON.parse(JSON.stringify(cell)));
    if (typeof(cellIsBlocker) !== "undefined" && cellIsBlocker(cell)) {
      break;
    }
    if (x === x1 && y === y1) {
      break;
    }
    let e2 = 2 * err;
    if (e2 >= dy) { /* e_xy + e_x > 0 */
      err += dy;
      x += sx;
    }
    if (e2 <= dx) { /* e_xy + e_y < 0 */
      err += dx;
      y += sy;
    }
  }
  return plot;
}
/**
 * Plots the cells in an octant from a fixed direction.
 * @param {Number} maxDistance the maximum distance from the player's location.
 * @returns 
 */
RetroC64AkalabethDungeon.prototype.plotOctant = function(maxDistance) {
  let plot = [];
  for (let row = 1; row < maxDistance; row++) {
    for (let col = 0; col <= row; col++) {
      let x = this._px + col;
      let y = this._py - row;  
      plot.push(new Phaser.Math.Vector2(x, y));
    }
  }
  return plot;
}
/**
 * Plots the cells in a quadrant the maximum distance away from the player's location, in the direction the player is facing.
 * @param {Number} maxDistance the maximum distance the quadrant goes
 * @returns {Array}
 */
RetroC64AkalabethDungeon.prototype.plotQuadrant = function(maxDistance) {
  let plot = [];
  if (this._dy !== 0) {
    // facing N or S
    for (let row = 1; row < maxDistance; row++) {
      for (let col = 0; col <= row; col++) {
        let x = this._px + col;
        let y = this._py - row;
        if (this._dy > 0) { // S
          y = this._py + row;
        }
        plot.push(new Phaser.Math.Vector2(x, y));
        x = this._px - col; 
        plot.push(new Phaser.Math.Vector2(x, y));
      }
    }
  } else {
    // facing E or W
    for (let col = 1; col < maxDistance; col++) {
      for (let row = 0; row <= col; row++) {
        let x = this._px + col;
        if (this._dx < 0) {
          x = this._px - col;
        }
        let y = this._py - row;
        plot.push(new Phaser.Math.Vector2(x, y));
        y = this._py + row; 
        plot.push(new Phaser.Math.Vector2(x, y));
      }
    }
  }
  return plot;
}
RetroC64AkalabethDungeon.prototype.getRings8Topolgy = function(maxDistance) {
  class ShadowCastingCell {
    constructor() {
      this._arc = [];
      this._occupant = 0;
      this._vector;
      this._visible = true;
    }
    addArc(arcStart, arcEnd) {
      let arr = [arcStart, arcEnd];
      arr.sort(function (a, b) {
        let c = 0;
        if (a < b) {
          c = -1;
        } else if (a > b) {
          c = 1;
        }
        return c;
      });
      this._arc.push(arr);
    }
    toString() {
      let s = ["ShadowCastingCell {\r\n"];
      s.push("  arc: [ ");
      for (let i = 0, li = this._arc.length; i < li; i++) {
        s.push("[ ");
        let arr = this._arc[i];
        for (let j = 0, lj = arr.length; j < lj; j++) {
          s.push(arr[j]);
          if (j + 1 < lj) {
            s.push(", ");
          }
        }
        s.push(" ]");
        if (i + 1 < li) {
          s.push(", ");
        }
      }
      s.push(" ],");
      s.push("\r\n  vector: { ");
      s.push(this._vector.x);
      s.push(", ");
      s.push(this._vector.y);
      s.push(" },");
      s.push("\r\n  visible: ");
      s.push(this._visible);
      s.push(",");
      s.push("\r\n  occupant: ");
      s.push(this._occupant);
      s.push("\r\n}");
      return s.join("");
    }
  }
  Object.defineProperty(ShadowCastingCell.prototype, 'arc', {
    /**
     * Getter for field _arc.
     * @returns {Array}
     */
    get() {
      return this._arc;
    }
  });
  Object.defineProperty(ShadowCastingCell.prototype, 'isVisible', {
    /**
     * Getter for field _visible.
     * @returns {Boolean}
     */
    get() {
      return this._visible;
    },
    /**
     * Setter for field _visible.
     * @param {PropertyKey} value the value
     */
    set(value) {      
      this._visible = value;
    }
  });
  Object.defineProperty(ShadowCastingCell.prototype, 'occupant', {
    /**
     * Getter for field _occupant.
     * @returns {Number}
     */
    get() {
      return this._occupant;
    },
    /**
     * Setter for field _occupant.
     * @param {PropertyKey} value the value
     */
    set(value) {      
      this._occupant = value;
    }
  });
  Object.defineProperty(ShadowCastingCell.prototype, 'vector', {
    /**
     * Getter for field _vector.
     * @returns {Phaser.Math.Vector2}
     */
    get() {
      return this._vector;
    },
    /**
     * Setter for field _vector.
     * @param {PropertyKey} value the value
     */
    set(value) {      
      this._vector = value;
    }
  });

  let rings = [];
  for (let i = 1; i <= maxDistance; i++) {
    let arr = [];
    let angle = 360 / (8 * i);
    // do the top 1/2 of right side of the ring, from px+i,py to px+i,py-i
    for (let j = 0; j <= i; j++) {
      let cell = new ShadowCastingCell();
      cell.vector = new Phaser.Math.Vector2(this._px + i, this._py - j);
      if (arr.length * angle - angle * 0.5 < 0) {
        cell.addArc(arr.length * angle + angle * 0.5, 0);
        cell.addArc(360, 360 + arr.length * angle - angle * 0.5);
      } else {
        cell.addArc(arr.length * angle + angle * 0.5, arr.length * angle - angle * 0.5);
      }
      arr.push(cell);
    }
    // do top side, from px+i-1,py-i to px-i,py-i
    for (let j = i - 1; j >= - i; j--) {
      let cell = new ShadowCastingCell();
      cell.vector = new Phaser.Math.Vector2(this._px + j, this._py - i);
      cell.addArc(arr.length * angle + angle * 0.5, arr.length * angle - angle * 0.5);
      arr.push(cell);
    }
    // do the left side of the ring, from px-i,py-i+1 to px-i,py+i
    for (let j = 1 - i; j <= i; j++) {
      let cell = new ShadowCastingCell();
      cell.vector = new Phaser.Math.Vector2(this._px - i, this._py + j);
      cell.addArc(arr.length * angle + angle * 0.5, arr.length * angle - angle * 0.5);
      arr.push(cell);
    }
    // do bottom side, from px-i+1,py+i to px+i,py+i
    for (let j = 1 - i; j <= i; j++) {
      let cell = new ShadowCastingCell();
      cell.vector = new Phaser.Math.Vector2(this._px + j, this._py + i);
      cell.addArc(arr.length * angle + angle * 0.5, arr.length * angle - angle * 0.5);
      arr.push(cell);
    }
    // do the bottom 1/2 of right side of the ring, from px+i,py+i-1 to px+i,py+1
    for (let j = i - 1; j >= 1; j--) {
      let cell = new ShadowCastingCell();
      cell.vector = new Phaser.Math.Vector2(this._px + i, this._py + j);
      cell.addArc(arr.length * angle + angle * 0.5, arr.length * angle - angle * 0.5);
      arr.push(cell);
    }
    rings.push(arr);
  }
  return rings;
}
RetroC64AkalabethDungeon.prototype.shadowCastQuadrant = function(maxDistance) {
  class ShadowQueue {
    constructor() {
      this._arcSegments = [];
    }
    isInFullShadow(cell) {
      let fullyShadowed = true;
      // go through every arc the cell represents
      for (let j = cell.arc.length - 1; j >= 0; j--) {
        let arc = JSON.parse(JSON.stringify(cell.arc[j]));
        arc.sort(function (a, b) {
          let c = 0;
          if (a < b) {
            c = -1;
          } else if (a > b) {
            c = 1;
          }
          return c;
        });
        let arcHasCoverage = false;
        // go through each shadowed arc
        for (let i = this._arcSegments.length - 1; i >= 0; i--) {
          let shadow = this._arcSegments[i];
          shadow.sort(function (a, b) {
            let c = 0;
            if (a < b) {
              c = -1;
            } else if (a > b) {
              c = 1;
            }
            return c;
          });
          if (shadow[0] <= arc[0] && arc[1] <= shadow[1]) {
            // the arc is covered if and only if its starting point is at or after the shadow's starting point and its end point is at or before the shadow's end point
            arcHasCoverage = true;
            break;
          }
        }
        if (!arcHasCoverage) {
          // if any of the cell's arcs is uncovered it is not considered fully covered.
          fullyShadowed = false;
          break;
        }
      }
      return fullyShadowed;
    }
    isInPartialShadow(cell) {
      let partiallyShadowed = false;
      // go through every arc the cell represents
      for (let j = cell.arc.length - 1; j >= 0; j--) {
        let arc = cell.arc[j];
        arc.sort(function (a, b) {
          let c = 0;
          if (a < b) {
            c = -1;
          } else if (a > b) {
            c = 1;
          }
          return c;
        });
        // go through each shadowed arc
        for (let i = this._arcSegments.length - 1; i >= 0; i--) {
          let shadow = this._arcSegments[i];
          shadow.sort(function (a, b) {
            let c = 0;
            if (a < b) {
              c = -1;
            } else if (a > b) {
              c = 1;
            }
            return c;
          });
          if ((shadow[0] <= arc[0] && arc[0] <= shadow[1])
            || (shadow[0] <= arc[1] && arc[1] <= shadow[1])) {
            // the arc is covered if and only if its starting point or endpoint is between the shadow's starting or ending points
            partiallyShadowed = true;
            break;
          }
        }
        if (partiallyShadowed) {
          break;
        }
      }
      return partiallyShadowed;
    }
    merge(cell) {
      if (this.isInFullShadow(cell)) {
        // cell is fully covered. nothing to do
      } else if (this.isInPartialShadow(cell)) {
        // cell is partially covered. need to add one of the endpoints to extend a shadow
        // find the segment(s) the first and/or second part of the arc belongs to
        for (let j = cell.arc.length - 1; j >= 0; j--) {
          let arc = JSON.parse(JSON.stringify(cell.arc[j]));
          arc.sort(function (a, b) {
            let c = 0;
            if (a < b) {
              c = -1;
            } else if (a > b) {
              c = 1;
            }
            return c;
          });
          let startIndex = -1, endIndex = -1;
          for (let i = 0, li = this._arcSegments.length; i < li; i++) {
            let shadow = this._arcSegments[i];
            shadow.sort(function (a, b) {
              let c = 0;
              if (a < b) {
                c = -1;
              } else if (a > b) {
                c = 1;
              }
              return c;
            });
            if (shadow[0] <= arc[0] && arc[0] <= shadow[1]) {
              startIndex = i;
            }
            if (shadow[0] <= arc[1] && arc[1] <= shadow[1]) {
              endIndex = i;
            }
          }
          if (startIndex >= 0 && endIndex < 0) {
            // console.log("cell",cell.vector,"is partly shadowed by",this._arcSegments[startIndex])
            this._arcSegments[startIndex][1] = arc[1];
          }
          if (startIndex < 0 && endIndex >= 0) {
            // console.log("cell",cell.vector,"is partly shadowed by",this._arcSegments[endIndex])
            this._arcSegments[endIndex][0] = arc[0];
          }
          if (startIndex >= 0 && endIndex >= 0) {
            // console.log("cell",cell.vector,"bridges",this._arcSegments[startIndex],this._arcSegments[endIndex])
            this._arcSegments[startIndex][1] = this._arcSegments[endIndex][1];
            this._arcSegments.splice(endIndex, 1);
          }
          // console.log("merged",cell.toString(),"into shadows",this._arcSegments.toString());
        }
      } else {
        for (let i = cell.arc.length - 1; i >= 0; i--) {
          let arr = JSON.parse(JSON.stringify(cell.arc[i]));
          arr.sort(function (a, b) {
            let c = 0;
            if (a < b) {
              c = -1;
            } else if (a > b) {
              c = 1;
            }
            return c;
          });
          this._arcSegments.push(arr);
        }
        this._arcSegments.sort(function (a, b) {
          let c = 0;
          if (a[0] < b[0]) {
            c = -1;
          } else if (a[0] > b[0]) {
            c = 1;
          }
          return c;
        });
        // console.log("merged",cell.toString(),"into shadows",this._arcSegments.toString());
      }
    }
  };
  let shadowQueue = new ShadowQueue();
  // step 1 - get rings
  let rings = this.getRings8Topolgy(maxDistance);
  // console.log(rings.toString())
  // step 2 - go through the rings in order
  for (let i = 0, li = rings.length; i < li; i++) {
    let ring = rings[i];
    for (let j = 0, lj = ring.length; j < lj; j++) {
      let cell = ring[j];
      if (cell.vector.x === this._px && cell.vector.y === this._py) {
        continue;
      }
      cell.isVisible = true;
      // step 2a - Consult the shadow queue to determine whether the cell's arc is fully shadowed
      if (shadowQueue.isInFullShadow(cell)) {
        // step 2b.1 - if no part of cell's arc is visible, mark the cell as not visible and advance to next cell
        // console.log("cell",cell.toString(),"is in full shadow. ignoring")
        cell.isVisible = false;
      } else {
        // step 2b.2 - if at least part of the cell's arc is visible, check the dungeon location
        let dungeonCell = this.getDungeonCell(cell.vector.x, cell.vector.y);
        if (dungeonCell === null) {
          // step 2b.2.a - there is no corresponding dungeon for this cell, add this location to the shadow queue
          // console.log("cell",cell.toString(),"is non-existent. adding to shadow queue")
          shadowQueue.merge(cell);
        } else {
          cell.occupant = dungeonCell.occupant;
          if (dungeonCell.occupant === 1 || dungeonCell.occupant === 3 || dungeonCell.occupant === 4) {
            // step 2b.2.b - this location blocks visibility, add this location to the shadow queue
            // console.log("cell",cell.toString(),"is a blocker. adding to shadow queue")
            shadowQueue.merge(cell);
          }
        }
      }
    }
  }
  // console.log(rings.toString())
  
  // step 3 - get the visible quadrant
  let quadrant = this.plotQuadrant(maxDistance);  
  // add left and right cells to set
  quadrant.push(new Phaser.Math.Vector2(this._px + this._dy, this._py + this._dx));
  quadrant.push(new Phaser.Math.Vector2(this._px - this._dy, this._py - this._dx));
  // step 4 - merge visible quadrant and visible cells
  
  // determine the quadrant to view based on the direction facing
  let range = "x", opposite = "y", primaryRangeComparison = "max", secondaryRangeComparison = "min", last = 0;
  if (this._dx < 0) {
    primaryRangeComparison = "min";
    secondaryRangeComparison = "max";
    last = 9999;
  } else if (this._dy !== 0) {
    range = "y";
    opposite = "x";
    if (this._dy < 0) {
      primaryRangeComparison = "min";
      secondaryRangeComparison = "max";
      last = 9999;
    }
  }
  let tmp = {};
  for (let i = quadrant.length - 1; i >= 0; i--) {
    let v = quadrant[i];
    for (let j = rings.length - 1; j >= 0; j--) {
      let ring = rings[j];
      for (let k = ring.length - 1; k >= 0; k--) {
        if (v.x === ring[k].vector.x && v.y === ring[k].vector.y && ring[k].isVisible) {
          tmp[[v.x, ",", v.y].join("")] = ring[k];
        }
      }
    }
  }
  tmp[[this._px, ",", this._py].join("")] = {
    vector: new Phaser.Math.Vector2(this._px, this._py),
    occupant: this.getDungeonCell(this._px, this._py).occupant,
    isVisible: true
  };
  // console.log(tmp)
  let keys = Object.keys(tmp);
  let shadowCastCells = [];
  for (let i = 0, li = keys.length; i < li; i++) {
    shadowCastCells.push(tmp[keys[i]]);
  }
  shadowCastCells.sort(function(a, b) {
    let c = 0;
    // compare points, pushing furthest cells to end of the list
    let comparison = Math[primaryRangeComparison](a.vector[range], b.vector[range]);
    if (comparison === a.vector[range] && comparison !== b.vector[range]) {
      c = 1;
    } else if (comparison !== a.vector[range] && comparison === b.vector[range]) {
      c = -1;
    } else {
      // cells in equal row/column. compare by the opposite range
      comparison = Math[secondaryRangeComparison](a.vector[opposite], b.vector[opposite]);
      if (comparison === a.vector[opposite]) {
        if (range === "x") {
          c = -1;
        } else {
          c = 1;
        }
      } else if (comparison === b.vector[opposite]) {
        if (range === "x") {
          c = 1;
        } else {
          c = -1;
        }
      }
    }
    return c;
  });
  let pos = 0, beginning = range === "x" ? this._px : this._py, current = range === "x" ? this._px : this._py, playerOpposite = range === "x" ? this._py : this._px;
  let map = {
    1: 3,
    2: 6,
    3: 11,
    4: 18
  }
  for (let i = 0, li = shadowCastCells.length; i < li; i++) {
    if (current !== shadowCastCells[i].vector[range]) {
      current = shadowCastCells[i].vector[range];
      let expectedDiff = Math.abs(beginning - current);
      let actualDiff = Math.abs(playerOpposite - shadowCastCells[i].vector[opposite]);
      pos = map[expectedDiff] + expectedDiff - actualDiff;
      // changed to next row/column. do something
    }
    shadowCastCells[i].position = pos++;
  }
  // console.log(shadowCastCells)
  return shadowCastCells;
}
/**
 * Raycasts in the direction the player is facing to identify visible locations
 * @param {Number} maxDistance the maximum distance away from the player to raycast
 * @returns {Array} the list of visible dungeon cells
 */
RetroC64AkalabethDungeon.prototype.raycastQuadrant = function(maxDistance) {
  let lastCells = this.plotQuadrant(maxDistance);
  // determine the quadrant to view based on the direction facing
  let range = "x", opposite = "y", primaryRangeComparison = "max", secondaryRangeComparison = "min", last = 0;
  if (this._dx < 0) {
    primaryRangeComparison = "min";
    secondaryRangeComparison = "max";
    last = 9999;
  } else if (this._dy !== 0) {
    range = "y";
    opposite = "x";
    if (this._dy < 0) {
      primaryRangeComparison = "min";
      secondaryRangeComparison = "max";
      last = 9999;
    }
  }
  // find the furthest row/column
  let tmp = {};
  for (let i = lastCells.length - 1; i >= 0; i--) {
    last = Math[primaryRangeComparison](last, lastCells[i][range]);
  }
  for (let i = lastCells.length - 1; i >= 0; i--) {
    if (lastCells[i][range] === last) {
      tmp[[lastCells[i].x, ",", lastCells[i].y].join("")] = lastCells[i];
    }
  }
  let keys = Object.keys(tmp);
  lastCells.length = 0;
  for (let i = 0, li = keys.length; i < li; i++) {
    lastCells.push(tmp[keys[i]]);
  }
  // lastCells now contains the furthest cells from the player.
  // raycast to those cells
  tmp = {};
  for (let i = lastCells.length - 1; i >= 0; i--) {
    let that = this;
    let line = this.plotBresenham(
      this._px, this._py, // from
      lastCells[i].x, lastCells[i].y, // to
      function(cell) { return (cell.occupant === 1 || cell.occupant === 3 || cell.occupant === 4) && (cell.vector2.x !== that._px && cell.vector2.y !== that._py); }
    );
    for (let j = 0, lj = line.length; j < lj; j++) {
      tmp[[line[j].vector2.x, ",", line[j].vector2.y].join("")] = line[j];
    }
  }
  // add left and right cells to set
  tmp[[this._px + this._dy, ",", this._py + this._dx].join("")] = JSON.parse(JSON.stringify(this.getDungeonCell(this._px + this._dy, this._py + this._dx)));
  tmp[[this._px - this._dy, ",", this._py - this._dx].join("")] = JSON.parse(JSON.stringify(this.getDungeonCell(this._px - this._dy, this._py - this._dx)));
  keys = Object.keys(tmp);
  lastCells.length = 0;
  for (let i = 0, li = keys.length; i < li; i++) {
    lastCells.push(tmp[keys[i]]);
  }
  lastCells.sort(function(a, b) {
    let c = 0;
    // compare points, pushing furthest cells to end of the list
    let comparison = Math[primaryRangeComparison](a.vector2[range], b.vector2[range]);
    if (comparison === a.vector2[range] && comparison !== b.vector2[range]) {
      c = 1;
    } else if (comparison !== a.vector2[range] && comparison === b.vector2[range]) {
      c = -1;
    } else {
      // cells in equal row/column. compare by the opposite range
      comparison = Math[secondaryRangeComparison](a.vector2[opposite], b.vector2[opposite]);
      if (comparison === a.vector2[opposite]) {
        if (range === "x") {
          c = -1;
        } else {
          c = 1;
        }
      } else if (comparison === b.vector2[opposite]) {
        if (range === "x") {
          c = 1;
        } else {
          c = -1;
        }
      }
    }
    return c;
  });
  let pos = 0, beginning = range === "x" ? this._px : this._py, current = range === "x" ? this._px : this._py, playerOpposite = range === "x" ? this._py : this._px;
  let map = {
    1: 3,
    2: 6,
    3: 11,
    4: 18
  }
  for (let i = 0, li = lastCells.length; i < li; i++) {
    if (current !== lastCells[i].vector2[range]) {
      current = lastCells[i].vector2[range];
      let expectedDiff = Math.abs(beginning - current);
      let actualDiff = Math.abs(playerOpposite - lastCells[i].vector2[opposite]);
      pos = map[expectedDiff] + expectedDiff - actualDiff;
      // changed to next row/column. do something
    }
    lastCells[i].position = pos++;
  }
  return lastCells;
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethDungeon };
}
