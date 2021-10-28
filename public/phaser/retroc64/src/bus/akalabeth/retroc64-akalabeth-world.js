if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
}
/**
 * @class A class to represent the game world will be created using the 'prototype' template.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethWorld(parameterObject) {
  /** @private placeholder */
  this._te = [];
  /** @private placeholder */
  this._tx = 0;
  /** @private placeholder */
  this._ty = 0;
  /** @private placeholder */
  this._xx = [];
  /** @private place */
  this._yy = [];
  /** @private place */
  this._per = [];
  /** @private place */
  this._ld = [];
  /** @private place */
  this._cd = [];
  /** @private placew */
  this._ft = [];
  /** @private place */
  this._lad = [];
  Watchable.apply(this);
};
RetroC64AkalabethWorld.prototype = Object.create(Watchable.prototype);
RetroC64AkalabethWorld.prototype.constructor = Watchable;
{ // RetroC64AkalabethWorld Getters/Setters
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'tx', {
    /**
     * Getter for field _tx.
     * @returns {Number}
     */
    get() {
      return this._tx;
    },
    /**
     * Setter for field _tx.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._tx = value;
      this.notifyWatchers(this);
    }
  });
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'ty', {
    /**
     * Getter for field _ty.
     * @returns {Number}
     */
    get() {
      return this._ty;
    },
    /**
     * Setter for field _ty.
     * @param {PropertyKey} value the value
     */
    set(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      this._ty = value;
      this.notifyWatchers(this);
    }
  });
  /**
   * Getter for field _te.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'te', {
    get() {
      return this._te;
    },
  });
  /**
   * Getter for field _xx.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'xx', {
    get() {
      return this._xx;
    },
  });
  /**
   * Getter for field _yy.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'yy', {
    get() {
      return this._yy;
    },
  });
  /**
   * Getter for field _per.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'per', {
    get() {
      return this._per;
    },
  });
  /**
   * Getter for field _ld.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'ld', {
    get() {
      return this._ld;
    },
  });
  /**
   * Getter for field _cd.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'cd', {
    get() {
      return this._cd;
    },
  });
  /**
   * Getter for field _ft.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'ft', {
    get() {
      return this._ft;
    },
  });
  /**
   * Getter for field _lad.
   * @returns {Object}
   */
  Object.defineProperty(RetroC64AkalabethWorld.prototype, 'lad', {
    get() {
      return this._lad;
    },
  });
}
/**
 * Populates a new world.
 */
RetroC64AkalabethWorld.prototype.newWorld = function() {
  // reset the this._te array
  this._te.length = 0;
  for (let i = 20; i >= 0; i--) {
    let r = [];
    for (let j = 20; j >= 0; j--) {
      r.push(0);
    }
    this._te.push(r);
  }
  // fill the borders with 1s
  for (let i = 0; i <= 20; i++) {
    this._te[i][0] = 1;
    this._te[0][i] = 1;
    this._te[i][20] = 1;
    this._te[20][i] = 1;
  }
  // randomly fill the interior
  for (let x = 19; x >= 1; x--) {
    for (let y = 19; y >= 1; y--) {
      this._te[x][y] = Math.ceil(Math.random() ^ 5 * 4.5);
      if (this._te[x][y] === 3 && Math.random() > 0.5) {
        this._te[x][y] = 0;
      }
    }
  }
  this._te[Math.ceil(Math.random() * 19 + 1)][Math.ceil(Math.random() * 19 + 1)] = 5;
  this._tx = Math.ceil(Math.random() * 19 + 1);
  this._ty = Math.ceil(Math.random() * 19 + 1);
  this._te[this._tx][this._ty] = 3;
  
  // reset the this._xx and this._yy arrays
  this._xx.length = 0;
  this._yy.length = 0;
  for (let i = 10; i >= 0; i--) {
    this._xx.push(0);
    this._yy.push(0);
  }
  this._xx[0] = 139;
  this._yy[0] = 79;
  
  // reset the this._per array
  this._per.length = 0;
  for (let i = 10; i >= 0; i--) {
    let r = [];
    for (let j = 3; j >= 0; j--) {
      r.push(0);
    }
    this._per.push(r);
  }
  // fill the this._xx, this._yy, and this._per arrays with random values
  for (let i = 2; i <= 20; i += 2) {
    this._xx[i / 2] = Math.ceil(Math.atan(1 / i) / Math.atan(1) * 140 + .5);
    this._yy[i / 2] = Math.ceil(this._xx[i / 2] * 4 / 7);
    this._per[i / 2][0] = 139 - this._xx[i / 2];
    this._per[i / 2][1] = 139 + this._xx[i / 2];
    this._per[i / 2][2] = 79 - this._yy[i / 2];
    this._per[i / 2][3] = 79 + this._yy[i / 2];
  }
  this._per[0][0] = 0;
  this._per[0][1] = 279;
  this._per[0][2] = 0;
  this._per[0][3] = 159;
  
  // reset the this._cd array
  this._cd.length = 0;
  for (let i = 10; i >= 0; i--) {
    let r = [];
    for (let j = 3; j >= 0; j--) {
      r.push(0);
    }
    this._cd.push(r);
  }
  // fill the this._cd arrays with values
  for (let i = 1; i <= 10; i++) {
    this._cd[i][0] = 139 - this._xx[i] / 3;
    this._cd[i][1] = 139 + this._xx[i] / 3;
    this._cd[i][2] = 79 - this._yy[i] * .7;
    this._cd[i][3] = 79 + this._yy[i];
  }
  
  // reset the this._ld array
  this._ld.length = 0;
  for (let i = 10; i >= 0; i--) {
    let r = [];
    for (let j = 5; j >= 0; j--) {
      r.push(0);
    }
    this._ld.push(r);
  }
  // fill the this._ld arrays with values
  for (let i = 0; i <= 9; i++) {
    this._ld[i][0] = (this._per[i][0] * 2 + this._per[i + 1][0]) / 3;
    this._ld[i][1] = (this._per[i][0] + 2 * this._per[i + 1][0]) / 3;
  
    let w = this._ld[i][0] - this._per[i][0];
    this._ld[i][2] = this._per[i][2] + w * 4 / 7;
    this._ld[i][3] = this._per[i][2] + 2 * w * 4 / 7;
  
    this._ld[i][4] = (this._per[i][3] * 2 + this._per[i + 1][3]) / 3;
    this._ld[i][5] = (this._per[i][3] + 2 * this._per[i + 1][3]) / 3;
    this._ld[i][2] = this._ld[i][4] - (this._ld[i][4] - this._ld[i][2]) * .8;
    this._ld[i][3] = this._ld[i][5] - (this._ld[i][5] - this._ld[i][3]) * .8;
    if (this._ld[i][3] === this._ld[i][4]) {
      this._ld[i][3] = this._ld[i][3] - 1;
    } 
  }
  
  // reset the this._ft array
  this._ft.length = 0;
  for (let i = 10; i >= 0; i--) {
    let r = [];
    for (let j = 5; j >= 0; j--) {
      r.push(0);
    }
    this._ft.push(r);
  }
  // fill the this._ft arrays with values
  for (let i = 0; i <= 9; i++) {
    this._ft[i][0] = 139 - this._xx[i] / 3;
    this._ft[i][1] = 139 + this._xx[i] / 3;
    this._ft[i][2] = 139 - this._xx[i + 1] / 3;
    this._ft[i][3] = 139 + this._xx[i + 1] / 3;
    this._ft[i][4] = 79 + (this._yy[i] * 2 + this._yy[i + 1]) / 3;
    this._ft[i][5] = 79 + (this._yy[i] + 2 * this._yy[i + 1]) / 3;
  }
  
  // reset the this._lad array
  this._lad.length = 0;
  for (let i = 10; i >= 0; i--) {
    let r = [];
    for (let j = 3; j >= 0; j--) {
      r.push(0);
    }
    this._lad.push(r);
  }
  // fill the this._lad arrays with values
  for (let i = 0; i <= 9; i++) {
    this._lad[i][0] = (this._ft[i][0] * 2 + this._ft[i][1]) / 3;
    this._lad[i][1] = (this._ft[i][0] + 2 * this._ft[i][1]) / 3;
    this._lad[i][3] = this._ft[i][4];
    this._lad[i][2] = 159 - this._lad[i][3];
  }
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethWorld };
}
