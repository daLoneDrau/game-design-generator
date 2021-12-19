if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethWorldMapScene } = require("./retroc64-akalabeth-world-map-scene");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
}
/**
 * @class The UI Scene class for displaying the graphical part of the display.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethWorldMapGraphics(parameterObject) {
  parameterObject.columns = 1;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private An array of images visualizing the game world. */
  this._terrainImages = [];
  /** @private A Phaser.Graphics instance used for rendering the world map. */
  this._worldMapGraphics = null;
  /** @private The time in milliseconds when the move animation was started. */
  this._moveAnimationStarted = 0;
  /** @private The length in milliseconds of the move cycle animation. */
  this._moveCycleLength = 750;
  /** @private The World Map displays a 3x3 cluster of map cells, surrounded by a 5x5 border ring. The border ring cells will be cropped and not appear fully. */
  this._borderCrop = 0.1667;
  { // RetroC64AkalabethWorldMapGraphics View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_WORLD_MAP_DISPLAY]] = {
      group: null,
      children: []
    };
  }
  { // RetroC64AkalabethWorldMapGraphics Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_WORLD_MAP_DISPLAY]] = function(event, context) {
      
    };
  }
  this._state = RetroC64Constants.AKALABETH_WORLD_MAP_DISPLAY;
};
RetroC64AkalabethWorldMapGraphics.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethWorldMapGraphics.prototype.constructor = UiScene;
{ // RetroC64AkalabethWorldMapGraphics Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethWorldMapGraphics.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethWorldMapGraphics Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethWorldMapGraphics.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethWorldMapGraphics.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethWorldMapGraphics.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    this._worldMapGraphics = this._scene.make.graphics({ lineStyle: { width: 3, color: 10920447 } });
    this.createCrosshairs();
    this.generateCastleTexture();
    this.generateDungeonTexture();
    this.generateMountainTexture();
    this.generateShopTexture();
    this.generateUnknownTexture();
    this.generateBlankTexture();
    // need 25 images for the terrain
    for (let x = 0, lx = 5; x < lx; x++) {
      this._terrainImages.push([]);
      for (let y = 0, ly = 5; y < ly; y++) {
        let image = this._scene.add.image(0, 0, 'akalabeth_blank');
        image.setDepth(10);
        this._terrainImages[x].push(image);
      }
    }
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethWorldMapGraphics.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
    if (RetroC64AkalabethWorldMapScene.needsMapRedraw) {
      this.drawWorldMap();
      RetroC64AkalabethWorldMapScene.needsMapRedraw = false;
    }
    if (RetroC64AkalabethWorldMapScene.moveEntered > 0 && this._moveAnimationStarted === 0) {
      // move was entered.  for now. just run an animation
      this._moveAnimationStarted = time;
      RetroC64AkalabethWorldMapScene.animationPlaying = true;
    }
    if (this._moveAnimationStarted > 0) {
      // started the movement animation
      if (this._moveAnimationStarted + this._moveCycleLength <= time) {
        // animation cycle is over.
        this._moveAnimationStarted = 0;
        RetroC64AkalabethWorldMapScene.moveEntered = -1;
        RetroC64AkalabethWorldMapScene.animationPlaying = false;
        RetroC64AkalabethWorldMapScene.needsMapRedraw = true;
        // remove old animation data
        for (let i = this._terrainImages.length - 1; i >= 0; i--) {
          for (let j = this._terrainImages[i].length - 1; j >= 0; j--) {
            let image = this._terrainImages[i][j];
            delete image["move animation starting x"];
            delete image["move animation starting y"];
          }
        }
      } else {
        // animation cycle is still going
        let percent = (time - this._moveAnimationStarted) / this._moveCycleLength;
        switch (RetroC64AkalabethWorldMapScene.moveEntered) {
          case 1: // NORTH
            this.animateNorth(percent);
            break;
          case 2: // SOUTH
            this.animateSouth(percent);
            break;
          case 3: // WEST
            this.animateWest(percent);
            break;
          case 4: // EAST
            this.animateEast(percent);
            break;
        }
      }
    }
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethWorldMapGraphics.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Creates the crosshairs image representing the player's location. This image is displayed in the center of the world map, above all terrain. The image's location never changes.
 */
RetroC64AkalabethWorldMapGraphics.prototype.createCrosshairs = function() {
  // draw crosshairs for the player's position
  let line = new Phaser.Geom.Line(0, 7, 14, 7);
  this._worldMapGraphics.strokeLineShape(line);
  line = new Phaser.Geom.Line(7, 0, 7, 14);
  this._worldMapGraphics.strokeLineShape(line);
  // generate the texture
  this._worldMapGraphics.generateTexture('akalabeth_crosshairs', 15, 15);
  this._worldMapGraphics.clear();
  let crosshairs = this._scene.add.image(0, 0, 'akalabeth_crosshairs');
  crosshairs.setDepth(20);
  this._grid.placeAt(2, 2, crosshairs);
}
/**
 * Draws the world map.
 */
RetroC64AkalabethWorldMapGraphics.prototype.drawWorldMap = function() {
  // draw the 8 positions around the player
  for (let y = -2; y <= 2; y++) {
    for (let x = -2; x <= 2; x++) {
      let col = RetroC64AkalabethController.world.playerX + x;
      let row = RetroC64AkalabethController.world.playerY + y;
      let currentTerrain = 0;
      if (col >= 0 && col < RetroC64AkalabethController.world.terrain.length
          && row >= 0 && row < RetroC64AkalabethController.world.terrain[col].length) {
        currentTerrain = RetroC64AkalabethController.world.terrain[row][col];
      }
      let image = this._terrainImages[x + 2][y + 2];
      image.setCrop();
      switch (currentTerrain) {
        case 0:
          image.setTexture("akalabeth_blank");
          break;
        case 1:
          image.setTexture("akalabeth_mountain");
          break;
        case 2:
          image.setTexture("akalabeth_unknown");
          break;
        case 3:
          image.setTexture("akalabeth_shop");
          break;
        case 4:
          image.setTexture("akalabeth_dungeon");
          break;
        case 5:
          image.setTexture("akalabeth_castle");
          break;
        default:
          throw ["Uknown terrain", currentTerrain]
      }
    }
  }
  // position the map images
  for (let x = 0, lx = 5; x < lx; x++) {
    for (let y = 0, ly = 5; y < ly; y++) {
      this._grid.placeAt(x, y, this._terrainImages[x][y]);
    }
  }
  this.cropEdges(this._borderCrop);
}
/**
 * Renders a polygon based on the supplied points.
 * @param {string | Array.<number> | Array} List of points defining the perimeter of this Polygon
 */
RetroC64AkalabethWorldMapGraphics.prototype.renderPolygon = function(points) {
  if (!Array.isArray(points)) {
    throw ["Array is required", points];
  }
  let polygon = new Phaser.Geom.Polygon(points);
  // create a polygon out of the points
  this._worldMapGraphics.beginPath();
  this._worldMapGraphics.moveTo(polygon.points[0].x, polygon.points[0].y);
  for (let i = 1; i < polygon.points.length; i++) {
    this._worldMapGraphics.lineTo(polygon.points[i].x, polygon.points[i].y);
  }
  // this._worldMapGraphics.closePath();
  this._worldMapGraphics.strokePath();
}
/**
 * Crops the right and bottom edges of the map display.
 * @param {Number} percent the percentage of the image to display
 */
RetroC64AkalabethWorldMapGraphics.prototype.cropEdges = function(percent) {
  // crop the right column
  for (let y = 4; y >= 0; y--) {
    this._terrainImages[4][y].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150 * percent, // The width of the crop rectangle in pixels.
      150 // The height of the crop rectangle in pixels.
    );
  }
  // crop the bottom row
  for (let x = 4; x >= 0; x--) {
    this._terrainImages[x][4].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150, // The width of the crop rectangle in pixels.
      150 * percent // The height of the crop rectangle in pixels.
    );
  }
  // crop the bottom corner image
  this._terrainImages[4][4].setCrop(
    0,  // The x coordinate to start the crop from
    0,  // The y coordinate to start the crop from
    150 * percent, // The width of the crop rectangle in pixels.
    150 * percent  // The height of the crop rectangle in pixels.
  );
}
/**
 * Generates the texture representing a castle terrain.
 */
RetroC64AkalabethWorldMapGraphics.prototype.generateCastleTexture = function() {
  // generating the castle image in a 150x150 space to give room for the 3px wide line strokes, and also center the image
  this.renderPolygon([
    0, 0,
    150, 0,
    150, 150,
    0, 150,
    0, 0
  ]);
  this.renderPolygon([
    30, 30,
    30, 120,
    120, 120,
    120, 30,
    30, 30,
    120, 120
  ]);
  this.renderPolygon([
    30, 120,
    120, 30
  ]);
  // generate the texture
  this._worldMapGraphics.generateTexture('akalabeth_castle', 150, 150);
  this._worldMapGraphics.clear();
}
/**
 * Generates the texture representing a dungeon terrain.
 */
RetroC64AkalabethWorldMapGraphics.prototype.generateDungeonTexture = function() {
  this.renderPolygon([
    60, 60,
    90, 90
  ]);
  this.renderPolygon([
    60, 90,
    90, 60
  ]);
  // generate the texture
  this._worldMapGraphics.generateTexture('akalabeth_dungeon', 150, 150);
  this._worldMapGraphics.clear();
}
/**
 * Generates the texture representing a mountain terrain.
 */
RetroC64AkalabethWorldMapGraphics.prototype.generateMountainTexture = function() {
  this.renderPolygon([
    30, 150,
    30, 120,
    60, 90,
    120, 90,
    120, 150
  ]);
  this.renderPolygon([
    0, 30,
    30, 30
  ]);
  this.renderPolygon([
    150, 30,
    120, 30
  ]);
  this.renderPolygon([
    0, 120,
    30, 120
  ]);
  this.renderPolygon([
    120, 120,
    150, 120
  ]);
  this.renderPolygon([
    30, 0,
    30, 60,
    60, 60,
    60, 90,
    90, 90,
    90, 30,
    120, 30,
    120, 0
  ]);
  // generate the texture
  this._worldMapGraphics.generateTexture('akalabeth_mountain', 150, 150);
  this._worldMapGraphics.clear();
}
/**
 * Generates the texture representing a shop terrain.
 */
RetroC64AkalabethWorldMapGraphics.prototype.generateShopTexture = function() {
  // generating the shop image in a 150x150 space to give room for the 3px wide line strokes, and also center the image
  this.renderPolygon([
    30, 30,
    60, 30,
    60, 120,
    30, 120,
    30, 90,
    120, 90,
    120, 120,
    90, 120,
    90, 30,
    120, 30,
    120, 60,
    30, 60,
    30, 30
  ]);
  // generate the texture
  this._worldMapGraphics.generateTexture('akalabeth_shop', 150, 150);
  this._worldMapGraphics.clear();
}
/**
 * Generates the texture representing an unknown terrain.
 */
RetroC64AkalabethWorldMapGraphics.prototype.generateUnknownTexture = function() {
  // generating the shop image in a 150x150 space to give room for the 3px wide line strokes, and also center the image
  this.renderPolygon([
    60, 60,
    90, 60,
    90, 90,
    60, 90,
    60, 60
  ]);
  // generate the texture
  this._worldMapGraphics.generateTexture('akalabeth_unknown', 150, 150);
  this._worldMapGraphics.clear();
}
/**
 * Generates the texture representing blank terrain.
 */
RetroC64AkalabethWorldMapGraphics.prototype.generateBlankTexture = function() {
  // generate the texture
  this._worldMapGraphics.generateTexture('akalabeth_blank', 150, 150);
  this._worldMapGraphics.clear();
}
/**
 * Animates a player moving North.
 * @param {Number} percent the percentage of the animation cycle that has passed.
 */
RetroC64AkalabethWorldMapGraphics.prototype.animateNorth = function(percent) {
  // increase all images y
  for (let i = this._terrainImages.length - 1; i >= 0; i--) {
    for (let j = this._terrainImages[i].length - 1; j >= 0; j--) {
      let image = this._terrainImages[i][j];
      if (!image.hasOwnProperty("move animation starting x")) {
        image["move animation starting x"] = image.x;
        image["move animation starting y"] = image.y;
      }
      image.y = image["move animation starting y"] + 150 * percent;
    }
  }
  // crop the old bottom row.
  for (let x = 4; x >= 0; x--) {
    this._terrainImages[x][4].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150, // The width of the crop rectangle in pixels.
      150 * (this._borderCrop - percent) // The height of the crop rectangle in pixels. the higher the percentile, the smaller the cropped image
    );
  }
  // crop the new bottom row.
  for (let x = 4; x >= 0; x--) {
    this._terrainImages[x][3].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150, // The width of the crop rectangle in pixels.
      150 * (1.1667 - percent) // The height of the crop rectangle in pixels.
    );
  }
  // crop the sides
  for (let y = 4; y >= 0; y--) {
    this._terrainImages[4][y].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150 * this._borderCrop, // The width of the crop rectangle in pixels.
      150 // The height of the crop rectangle in pixels.
    );
  }
  // crop the old bottom corner
  this._terrainImages[4][4].setCrop(
    0,  // The x coordinate to start the crop from
    0,  // The y coordinate to start the crop from
    150 * this._borderCrop, // The width of the crop rectangle in pixels.
    150 * (this._borderCrop - percent) // The height of the crop rectangle in pixels. the higher the percentile, the smaller the cropped image
  );
  // crop the new bottom corner
  this._terrainImages[4][3].setCrop(
    0,  // The x coordinate to start the crop from
    0,  // The y coordinate to start the crop from
    150 * this._borderCrop, // The width of the crop rectangle in pixels.
    150 * (1.1667 - percent) // The height of the crop rectangle in pixels.
  );
}
/**
 * Animates a player moving South.
 * @param {Number} percent the percentage of the animation cycle that has passed.
 */
RetroC64AkalabethWorldMapGraphics.prototype.animateSouth = function(percent) {
  // decrease all images y
  for (let i = this._terrainImages.length - 1; i >= 0; i--) {
    for (let j = this._terrainImages[i].length - 1; j >= 0; j--) {
      let image = this._terrainImages[i][j];
      if (!image.hasOwnProperty("move animation starting x")) {
        image["move animation starting x"] = image.x;
        image["move animation starting y"] = image.y;
      }
      image.y = image["move animation starting y"] - 150 * percent;
    }
  }
  // crop the bottom row. going from 1/6 crop to 1
  for (let x = 4; x >= 0; x--) {
    this._terrainImages[x][4].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150, // The width of the crop rectangle in pixels.
      150 * (this._borderCrop + percent) // The height of the crop rectangle in pixels. the higher the percentile, the smaller the cropped image
    );
  }
  // crop the sides
  for (let y = 4; y >= 0; y--) {
    this._terrainImages[4][y].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150 * this._borderCrop, // The width of the crop rectangle in pixels.
      150 // The height of the crop rectangle in pixels.
    );
  }
  // crop the bottom corner
  this._terrainImages[4][4].setCrop(
    0,  // The x coordinate to start the crop from
    0,  // The y coordinate to start the crop from
    150 * this._borderCrop, // The width of the crop rectangle in pixels.
    150 * (this._borderCrop + percent) // The height of the crop rectangle in pixels. the higher the percentile, the smaller the cropped image
  );
}
/**
 * Animates a player moving North.
 * @param {Number} percent the percentage of the animation cycle that has passed.
 */
RetroC64AkalabethWorldMapGraphics.prototype.animateEast = function(percent) {
  // decrease all images x
  for (let i = this._terrainImages.length - 1; i >= 0; i--) {
    for (let j = this._terrainImages[i].length - 1; j >= 0; j--) {
      let image = this._terrainImages[i][j];
      if (!image.hasOwnProperty("move animation starting x")) {
        image["move animation starting x"] = image.x;
        image["move animation starting y"] = image.y;
      }
      image.x = image["move animation starting x"] - 150 * percent;
    }
  }
  // crop the bottom row.
  for (let x = 4; x >= 0; x--) {
    this._terrainImages[x][4].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150, // The width of the crop rectangle in pixels.
      150 * this._borderCrop // height is 1/6 of the image
    );
  }
  // crop the sides. going from 1/6 crop to full size
  for (let y = 4; y >= 0; y--) {
    this._terrainImages[4][y].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150 * (this._borderCrop + percent), // The width of the crop rectangle in pixels.
      150 // The height of the crop rectangle in pixels.
    );
  }
  // crop the bottom corner
  this._terrainImages[4][4].setCrop(
    0,  // The x coordinate to start the crop from
    0,  // The y coordinate to start the crop from
    150 * (this._borderCrop + percent), // The width of the crop rectangle in pixels.
    150 * this._borderCrop // height is 1/6 of the image
  );
}
/**
 * Animates a player moving West.
 * @param {Number} percent the percentage of the animation cycle that has passed.
 */
RetroC64AkalabethWorldMapGraphics.prototype.animateWest = function(percent) {
  // decrease all images x
  for (let i = this._terrainImages.length - 1; i >= 0; i--) {
    for (let j = this._terrainImages[i].length - 1; j >= 0; j--) {
      let image = this._terrainImages[i][j];
      if (!image.hasOwnProperty("move animation starting x")) {
        image["move animation starting x"] = image.x;
        image["move animation starting y"] = image.y;
      }
      image.x = image["move animation starting x"] + 150 * percent;
    }
  }
  // crop the bottom row.
  for (let x = 4; x >= 0; x--) {
    this._terrainImages[x][4].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150, // The width of the crop rectangle in pixels.
      150 * this._borderCrop // height is 1/6 of the image
    );
  }
  // crop the outer sides. going from 1/6 crop to 0
  for (let y = 4; y >= 0; y--) {
    this._terrainImages[4][y].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150 * (this._borderCrop - percent), // The width of the crop rectangle in pixels.
      150 // The height of the crop rectangle in pixels.
    );
  }
  // crop the inner side. going from full to 1/6 crop
  for (let y = 4; y >= 0; y--) {
    this._terrainImages[3][y].setCrop(
      0,  // The x coordinate to start the crop from
      0,  // The y coordinate to start the crop from
      150 * (1.1667 - percent), // The width of the crop rectangle in pixels.
      150 // The height of the crop rectangle in pixels.
    );
  }
  // crop the bottom corner
  this._terrainImages[4][4].setCrop(
    0,  // The x coordinate to start the crop from
    0,  // The y coordinate to start the crop from
    150 * (this._borderCrop - percent), // The width of the crop rectangle in pixels.
    150 * this._borderCrop // height is 1/6 of the image
  );
  // crop the inner bottom corner
  this._terrainImages[3][4].setCrop(
    0,  // The x coordinate to start the crop from
    0,  // The y coordinate to start the crop from
    150 * (1.1667 - percent), // The width of the crop rectangle in pixels.
    150 * this._borderCrop // height is 1/6 of the image
  );
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethWorldMapGraphics };
}
