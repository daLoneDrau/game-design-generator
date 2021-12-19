if (typeof(module) !== "undefined") {
  var { RetroC64Constants } = require("../../../config/retroc64-constants");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
  var { RetroC64AkalabethController } = require("../../../services/akalabeth/retroc64-akalabeth-controller");
  var { UiScene } = require("../../../../../assets/js/rpgbase.full");
}
/**
 * @class The Dungeon view will have a scene instance for rendering the graphical portions.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethDungeonGraphics(parameterObject) {
  parameterObject.columns = 1;
  parameterObject.rows = 1;
  UiScene.call(this, parameterObject); // call parent constructor

  this._ignoreList = {
    6: 0, 10: 0, 11: 0, 12: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 24: 0, 25: 0, 26: 0
  }
  /** @private A Phaser.Graphics instance used for rendering the world map. */
  this._dungeonGraphics = null;
  /** @private the library of Image Game Objects. */
  this._imageLibrary = (function() {
    /** @private the image library dictionary */
    let _dictionary = {};
    /** @private the image initialization date */
    let _imageData = [
      /** ROW 1 0-2 */
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"], /* x, y, texture */
        origin: [0, 0],
        depth: 50
      },
      {
        initialization: [0, 320, "akalabeth_dungeon_blank"],
        origin: [0, 1],
        depth: 50
      },
      {
        initialization: [448, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 50
      },
      /** ROW 2 3-5 */
      {
        initialization: [0, 64, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 40
      },
      {
        initialization: [112, 64, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 45
      },
      {
        initialization: [368, 64, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 40
      },
      /** ROW 3 6-10 */
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      {
        /** 7 LEFT SIDE WALL */
        initialization: [0, 110, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      {
        initialization: [192, 110, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 35
      },
      {
        /** 9 RIGHT SIDE WALL */
        initialization: [340, 110, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      /****************/
      /** ROW 4 11- 17*/
      /****************/
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        /** 13 LEFT SIDE WALL */
        initialization: [0, 126, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [220, 126, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 25
      },
      {
        /** 15 RIGHT SIDE WALL */
        initialization: [324, 126, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      /****************/
      /** ROW 5 18-26 */
      /****************/
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        /** 21 LEFT SIDE WALL */
        initialization: [0, 135, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [236, 135, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 15
      },
      {
        /** 23 RIGHT SIDE WALL */
        initialization: [316, 135, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
    ];
    return {
      /**
       * Gets the image initialization data.
       */
      get imageData() { return _imageData; },
      /**
       * Gets an Image at a specific index.
       * @param {Number} index the image's index
       * @returns {Phaser.GameObjects.Image}
       */
      get: function(index) {
        return _dictionary[index];
      },
      /**
       * Adds an image to the library.
       * @param {object} parameterObject the image information
       */
      add: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("image")) {
          throw ["Missing image", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = null;
        }
        _dictionary[parameterObject.position] = parameterObject.image;
      }
    }
  } ());
  /** @private the library of Image Game Objects for rendering monsters. */
  this._monsterImageLibrary = (function() {
    /** @private the image library dictionary */
    let _dictionary = {};
    /** @private the image initialization date */
    let _imageData = [
      /** ROW 1 0-2 */
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"], /* x, y, texture */
        origin: [0, 0],
        depth: 50
      },
      {
        initialization: [0, 320, "akalabeth_dungeon_blank"],
        origin: [0, 1],
        depth: 50
      },
      {
        initialization: [448, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 50
      },
      /** ROW 2 3-5 */
      {
        initialization: [0, 64, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 40
      },
      {
        initialization: [112, 64, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 46
      },
      {
        initialization: [368, 64, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 40
      },
      /** ROW 3 6-10 */
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      {
        /** 7 LEFT SIDE WALL */
        initialization: [0, 110, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      {
        initialization: [192, 110, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 36
      },
      {
        /** 9 RIGHT SIDE WALL */
        initialization: [340, 110, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 30
      },
      /****************/
      /** ROW 4 11- 17*/
      /****************/
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        /** 13 LEFT SIDE WALL */
        initialization: [0, 126, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [220, 126, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 26
      },
      {
        /** 15 RIGHT SIDE WALL */
        initialization: [324, 126, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 20
      },
      /****************/
      /** ROW 5 18-26 */
      /****************/
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        /** 21 LEFT SIDE WALL */
        initialization: [0, 135, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [236, 135, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 16
      },
      {
        /** 23 RIGHT SIDE WALL */
        initialization: [316, 135, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
      {
        initialization: [0, 0, "akalabeth_dungeon_blank"],
        origin: [0, 0],
        depth: 10
      },
    ];
    return {
      /**
       * Gets the image initialization data.
       */
      get imageData() { return _imageData; },
      /**
       * Gets an Image at a specific index.
       * @param {Number} index the image's index
       * @returns {Phaser.GameObjects.Image}
       */
      get: function(index) {
        return _dictionary[index];
      },
      /**
       * Adds an image to the library.
       * @param {object} parameterObject the image information
       */
      add: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("image")) {
          throw ["Missing image", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = null;
        }
        _dictionary[parameterObject.position] = parameterObject.image;
      }
    }
  } ());
  /** @private The utility class for rendering chests in the dungeon. */
  this._chests = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'CHEST 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_chest_4',
          height: 190,
          width: 336
        },
        polygon: [
          146, 188, 146, 168,
          156, 158, 196, 158,
          196, 178, 186, 188
        ],
        lines: [
          [ 146, 188, 146, 168 ],
          [ 146, 168, 186, 168 ],
          [ 186, 168, 186, 188 ],
          [ 146, 188, 186, 188 ],
          [ 146, 168, 156, 158 ],
          [ 156, 158, 196, 158 ],
          [ 196, 158, 196, 178 ],
          [ 196, 178, 186, 188 ],
          [ 186, 168, 196, 158 ]
        ]
      },
      {
        COMMENT: 'CHEST 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_chest_8',
          height: 97,
          width: 176
        },
        polygon: [
          76,  96, 76,  86, 82,
          81, 103, 81, 103, 91,
          97,  96
        ],
        lines: [
          [ 76, 96, 76, 86 ],
          [ 76, 86, 97, 86 ],
          [ 97, 86, 97, 96 ],
          [ 76, 96, 97, 96 ],
          [ 76, 86, 82, 81 ],
          [ 82, 81, 103, 81 ],
          [ 103, 81, 103, 91 ],
          [ 103, 91, 97, 96 ],
          [ 97, 86, 103, 81 ]
        ]
      },
      {
        COMMENT: 'CHEST 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_chest_14',
          height: 64,
          width: 120
        },
        polygon: [
          52, 63, 52, 57, 56,
          53, 70, 53, 70, 60,
          66, 63
        ],
        lines: [
          [ 52, 63, 52, 57 ],
          [ 52, 57, 66, 57 ],
          [ 66, 57, 66, 63 ],
          [ 52, 63, 66, 63 ],
          [ 52, 57, 56, 53 ],
          [ 56, 53, 70, 53 ],
          [ 70, 53, 70, 60 ],
          [ 70, 60, 66, 63 ],
          [ 66, 57, 70, 53 ]
        ]
      },
      {
        COMMENT: 'CHEST 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_chest_22',
          height: 46,
          width: 88
        },
        polygon: [
          38, 46, 38, 41, 41,
          38, 51, 38, 51, 43,
          49, 46
        ],
        lines: [
          [ 38, 46, 38, 41 ],
          [ 38, 41, 49, 41 ],
          [ 49, 41, 49, 46 ],
          [ 38, 46, 49, 46 ],
          [ 38, 41, 41, 38 ],
          [ 41, 38, 51, 38 ],
          [ 51, 38, 51, 43 ],
          [ 51, 43, 49, 46 ],
          [ 49, 41, 51, 38 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addChest: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getChest: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering doors in the dungeon. */
  this._doors = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'LEFT DOOR 0 OPEN',
        texture: {
          position: 0,
          edge: 'open',
          key: 'akalabeth_door_0_open',
          height: 320,
          width: 112
        },
        polygon: [
            0,   0, 112,  64,
          112, 254,   0, 320
        ],
        lines: [
          [ 0, 0, 112, 64 ],
          [ 0, 320, 112, 254 ],
          [ 0, 48, 78, 79 ],
          [ 78, 79, 78, 274 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 0 CLOSED',
        texture: {
          position: 0,
          edge: 'closed',
          key: 'akalabeth_door_0_closed',
          height: 320,
          width: 112
        },
        polygon: [
            0,   0, 112,  64,
          112, 254,   0, 320
        ],
        lines: [
          [ 0, 0, 112, 64 ],
          [ 0, 320, 112, 254 ],
          [ 111, 64, 111, 254 ],
          [ 0, 48, 78, 79 ],
          [ 78, 79, 78, 274 ]
        ]
      },
      {
        COMMENT: 'RIGHT DOOR 2 OPEN',
        texture: {
          position: 2,
          edge: 'open',
          key: 'akalabeth_door_2_open',
          height: 320,
          width: 112
        },
        polygon: [
            0,  64, 112,   0,
          112, 320,   0, 254
        ],
        lines: [
          [ 0, 64, 112, 0 ],
          [ 0, 254, 112, 320 ],
          [ 112, 48, 34, 79 ],
          [ 34, 79, 34, 274 ]
        ]
      },
      {
        COMMENT: 'RIGHT 2 CLOSED',
        texture: {
          position: 2,
          edge: 'closed',
          key: 'akalabeth_door_2_closed',
          height: 320,
          width: 112
        },
        polygon: [
            0,  64, 112,   0,
          112, 320,   0, 254
        ],
        lines: [
          [ 0, 64, 112, 0 ],
          [ 0, 254, 112, 320 ],
          [ 1, 64, 1, 254 ],
          [ 112, 48, 34, 79 ],
          [ 34, 79, 34, 274 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 3 OPEN',
        texture: {
          position: 3,
          edge: 'open',
          key: 'akalabeth_door_3_open',
          height: 190,
          width: 192
        },
        polygon: [
           0,   0, 112,   0, 192,
          46, 192, 143, 112, 190,
           0, 190
        ],
        lines: [
          [ 0, 1, 112, 1 ],
          [ 111, 0, 111, 190 ],
          [ 0, 189, 112, 189 ],
          [ 112, 0, 192, 46 ],
          [ 112, 190, 192, 143 ],
          [ 139, 174, 139, 39 ],
          [ 166, 158, 166, 50 ],
          [ 139, 39, 166, 50 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 3 CLOSED',
        texture: {
          position: 3,
          edge: 'closed',
          key: 'akalabeth_door_3_closed',
          height: 190,
          width: 192
        },
        polygon: [
           0,   0, 112,   0, 192,
          46, 192, 143, 112, 190,
           0, 190
        ],
        lines: [
          [ 0, 1, 112, 1 ],
          [ 111, 0, 111, 190 ],
          [ 0, 189, 112, 189 ],
          [ 112, 0, 192, 46 ],
          [ 191, 46, 191, 143 ],
          [ 112, 190, 192, 143 ],
          [ 139, 174, 139, 39 ],
          [ 166, 158, 166, 50 ],
          [ 139, 39, 166, 50 ]
        ]
      },
      {
        COMMENT: 'CENTER DOOR 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_door_4_closed',
          height: 190,
          width: 336
        },
        polygon: [
            0,   0, 336,   0,
          336, 190,   0, 190
        ],
        lines: [
          [ 0, 1, 336, 1 ],
          [ 1, 0, 1, 190 ],
          [ 0, 189, 336, 189 ],
          [ 335, 0, 335, 190 ],
          [ 112, 29, 112, 190 ],
          [ 112, 29, 224, 29 ],
          [ 224, 29, 224, 190 ]
        ]
      },
      {
        COMMENT: 'RIGHT DOOR 5 OPEN',
        texture: {
          position: 5,
          edge: 'open',
          key: 'akalabeth_door_5_open',
          height: 190,
          width: 192
        },
        polygon: [
          192,   0,  80,  0,   0,
           46,   0, 143, 80, 190,
          192, 190
        ],
        lines: [
          [ 192, 1, 80, 1 ],
          [ 81, 0, 81, 190 ],
          [ 192, 189, 80, 189 ],
          [ 80, 0, 0, 46 ],
          [ 80, 190, 0, 143 ],
          [ 27, 49, 27, 159 ],
          [ 54, 39, 54, 175 ],
          [ 54, 39, 27, 49 ]
        ]
      },
      {
        COMMENT: 'RIGHT 5 CLOSED',
        texture: {
          position: 5,
          edge: 'closed',
          key: 'akalabeth_door_5_closed',
          height: 190,
          width: 192
        },
        polygon: [
          192,   0,  80,  0,   0,
           46,   0, 143, 80, 190,
          192, 190
        ],
        lines: [
          [ 192, 1, 80, 1 ],
          [ 81, 0, 81, 190 ],
          [ 192, 189, 80, 189 ],
          [ 80, 0, 0, 46 ],
          [ 1, 46, 1, 143 ],
          [ 80, 190, 0, 143 ],
          [ 27, 49, 27, 159 ],
          [ 54, 39, 54, 175 ],
          [ 54, 39, 27, 49 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 7 OPEN',
        texture: {
          position: 7,
          edge: 'open',
          key: 'akalabeth_door_7_open',
          height: 97,
          width: 220
        },
        polygon: [
           0,   0, 192,   0, 220,
          16, 220,  80, 192,  97,
           0,  97
        ],
        lines: [
          [ 0, 1, 192, 1 ],
          [ 191, 0, 191, 97 ],
          [ 0, 96, 192, 96 ],
          [ 192, 0, 220, 16 ],
          [ 192, 97, 220, 80 ],
          [ 201, 92, 201, 18 ],
          [ 210, 86, 210, 21 ],
          [ 201, 18, 210, 21 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 7 CLOSED',
        texture: {
          position: 7,
          edge: 'closed',
          key: 'akalabeth_door_7_closed',
          height: 97,
          width: 220
        },
        polygon: [
           0,   0, 192,   0, 220,
          16, 220,  80, 192,  97,
           0,  97
        ],
        lines: [
          [ 0, 1, 192, 1 ],
          [ 191, 0, 191, 97 ],
          [ 0, 96, 192, 96 ],
          [ 192, 0, 220, 16 ],
          [ 219, 16, 219, 80 ],
          [ 192, 97, 220, 80 ],
          [ 201, 92, 201, 18 ],
          [ 210, 86, 210, 21 ],
          [ 201, 18, 210, 21 ]
        ]
      },
      {
        COMMENT: 'CENTER DOOR 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_door_8_closed',
          height: 97,
          width: 176
        },
        polygon: [
            0,  0, 176,  0,
          176, 97,   0, 97
        ],
        lines: [
          [ 0, 1, 176, 1 ],
          [ 1, 0, 1, 97 ],
          [ 0, 96, 176, 96 ],
          [ 175, 0, 175, 97 ],
          [ 59, 15, 59, 97 ],
          [ 59, 15, 117, 15 ],
          [ 117, 15, 117, 97 ]
        ]
      },
      {
        COMMENT: 'RIGHT DOOR 9 OPEN',
        texture: {
          position: 9,
          edge: 'open',
          key: 'akalabeth_door_9_open',
          height: 97,
          width: 220
        },
        polygon: [
          220,  0, 28,  0,  0,
           16,  0, 80, 28, 97,
          220, 97
        ],
        lines: [
          [ 220, 1, 28, 1 ],
          [ 29, 0, 29, 97 ],
          [ 220, 96, 28, 96 ],
          [ 28, 0, 0, 16 ],
          [ 28, 97, 0, 80 ],
          [ 9, 22, 9, 85 ],
          [ 18, 19, 18, 91 ],
          [ 18, 19, 9, 22 ]
        ]
      },
      {
        COMMENT: 'RIGHT 9 CLOSED',
        texture: {
          position: 9,
          edge: 'closed',
          key: 'akalabeth_door_9_closed',
          height: 97,
          width: 220
        },
        polygon: [
          220,  0, 28,  0,  0,
           16,  0, 80, 28, 97,
          220, 97
        ],
        lines: [
          [ 220, 1, 28, 1 ],
          [ 29, 0, 29, 97 ],
          [ 220, 96, 28, 96 ],
          [ 28, 0, 0, 16 ],
          [ 1, 16, 1, 80 ],
          [ 28, 97, 0, 80 ],
          [ 9, 22, 9, 85 ],
          [ 18, 19, 18, 91 ],
          [ 18, 19, 9, 22 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 13 OPEN',
        texture: {
          position: 13,
          edge: 'open',
          key: 'akalabeth_door_13_open',
          height: 64,
          width: 236
        },
        polygon: [
          0,   0, 220,   0, 236,
          9, 236,  55, 220,  64,
          0,  64
        ],
        lines: [
          [ 0, 1, 220, 1 ],
          [ 219, 0, 219, 64 ],
          [ 0, 63, 220, 63 ],
          [ 220, 0, 236, 9 ],
          [ 220, 64, 236, 55 ],
          [ 225, 61, 225, 12 ],
          [ 230, 58, 230, 14 ],
          [ 225, 12, 230, 14 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 13 CLOSED',
        texture: {
          position: 13,
          edge: 'closed',
          key: 'akalabeth_door_13_closed',
          height: 64,
          width: 236
        },
        polygon: [
          0,   0, 220,   0, 236,
          9, 236,  55, 220,  64,
          0,  64
        ],
        lines: [
          [ 0, 1, 220, 1 ],
          [ 219, 0, 219, 64 ],
          [ 0, 63, 220, 63 ],
          [ 220, 0, 236, 9 ],
          [ 235, 9, 235, 55 ],
          [ 220, 64, 236, 55 ],
          [ 225, 61, 225, 12 ],
          [ 230, 58, 230, 14 ],
          [ 225, 12, 230, 14 ]
        ]
      },
      {
        COMMENT: 'CENTER DOOR 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_door_14_closed',
          height: 64,
          width: 120
        },
        polygon: [
            0,  0, 120,  0,
          120, 64,   0, 64
        ],
        lines: [
          [ 0, 1, 120, 1 ],
          [ 1, 0, 1, 64 ],
          [ 0, 63, 120, 63 ],
          [ 119, 0, 119, 64 ],
          [ 40, 10, 40, 64 ],
          [ 40, 10, 80, 10 ],
          [ 80, 10, 80, 64 ]
        ]
      },
      {
        COMMENT: 'RIGHT DOOR 15 OPEN',
        texture: {
          position: 15,
          edge: 'open',
          key: 'akalabeth_door_15_open',
          height: 64,
          width: 236
        },
        polygon: [
          236,  0, 16,  0,  0,
            9,  0, 55, 16, 64,
          236, 64
        ],
        lines: [
          [ 236, 1, 16, 1 ],
          [ 17, 0, 17, 64 ],
          [ 236, 63, 16, 63 ],
          [ 16, 0, 0, 9 ],
          [ 16, 64, 0, 55 ],
          [ 5, 14, 5, 58 ],
          [ 10, 12, 10, 61 ],
          [ 10, 12, 5, 14 ]
        ]
      },
      {
        COMMENT: 'RIGHT 15 CLOSED',
        texture: {
          position: 15,
          edge: 'closed',
          key: 'akalabeth_door_15_closed',
          height: 64,
          width: 236
        },
        polygon: [
          236,  0, 16,  0,  0,
            9,  0, 55, 16, 64,
          236, 64
        ],
        lines: [
          [ 236, 1, 16, 1 ],
          [ 17, 0, 17, 64 ],
          [ 236, 63, 16, 63 ],
          [ 16, 0, 0, 9 ],
          [ 1, 9, 1, 55 ],
          [ 16, 64, 0, 55 ],
          [ 5, 14, 5, 58 ],
          [ 10, 12, 10, 61 ],
          [ 10, 12, 5, 14 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 21 OPEN',
        texture: {
          position: 21,
          edge: 'open',
          key: 'akalabeth_door_21_open',
          height: 46,
          width: 244
        },
        polygon: [
          0,   0, 236,   0, 244,
          4, 244,  41, 236,  46,
          0,  46
        ],
        lines: [
          [ 0, 1, 236, 1 ],
          [ 235, 0, 235, 46 ],
          [ 0, 45, 236, 45 ],
          [ 236, 0, 244, 4 ],
          [ 236, 46, 244, 41 ],
          [ 239, 44, 239, 8 ],
          [ 242, 42, 242, 9 ],
          [ 239, 8, 242, 9 ]
        ]
      },
      {
        COMMENT: 'LEFT DOOR 21 CLOSED',
        texture: {
          position: 21,
          edge: 'closed',
          key: 'akalabeth_door_21_closed',
          height: 46,
          width: 244
        },
        polygon: [
          0,   0, 236,   0, 244,
          4, 244,  41, 236,  46,
          0,  46
        ],
        lines: [
          [ 0, 1, 236, 1 ],
          [ 235, 0, 235, 46 ],
          [ 0, 45, 236, 45 ],
          [ 236, 0, 244, 4 ],
          [ 243, 4, 243, 41 ],
          [ 236, 46, 244, 41 ],
          [ 239, 44, 239, 8 ],
          [ 242, 42, 242, 9 ],
          [ 239, 8, 242, 9 ]
        ]
      },
      {
        COMMENT: 'CENTER DOOR 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_door_22_closed',
          height: 46,
          width: 88
        },
        polygon: [
           0,  0, 88,  0,
          88, 46,  0, 46
        ],
        lines: [
          [ 0, 1, 88, 1 ],
          [ 1, 0, 1, 46 ],
          [ 0, 45, 88, 45 ],
          [ 87, 0, 87, 46 ],
          [ 29, 7, 29, 46 ],
          [ 29, 7, 59, 7 ],
          [ 59, 7, 59, 46 ]
        ]
      },
      {
        COMMENT: 'RIGHT DOOR 23 OPEN',
        texture: {
          position: 23,
          edge: 'open',
          key: 'akalabeth_door_23_open',
          height: 46,
          width: 244
        },
        polygon: [
          244,  0,  8, 0,  0,
            5,  0, 41, 8, 46,
          244, 46
        ],
        lines: [
          [ 244, 1, 8, 1 ],
          [ 9, 0, 9, 46 ],
          [ 244, 45, 8, 45 ],
          [ 8, 0, 0, 5 ],
          [ 8, 46, 0, 41 ],
          [ 3, 9, 3, 43 ],
          [ 6, 8, 6, 45 ],
          [ 6, 8, 3, 9 ]
        ]
      },
      {
        COMMENT: 'RIGHT 23 CLOSED',
        texture: {
          position: 23,
          edge: 'closed',
          key: 'akalabeth_door_23_closed',
          height: 46,
          width: 244
        },
        polygon: [
          244,  0,  8, 0,  0,
            5,  0, 41, 8, 46,
          244, 46
        ],
        lines: [
          [ 244, 1, 8, 1 ],
          [ 9, 0, 9, 46 ],
          [ 244, 45, 8, 45 ],
          [ 8, 0, 0, 5 ],
          [ 1, 5, 1, 41 ],
          [ 8, 46, 0, 41 ],
          [ 3, 9, 3, 43 ],
          [ 6, 8, 6, 45 ],
          [ 6, 8, 3, 9 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addDoor: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getDoor: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering holes in the dungeon. */
  this._floorHoles = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'FLOOR HOLE 1',
        texture: {
          position: 1,
          edge: 'closed',
          key: 'akalabeth_floor_hole_1',
          height: 320,
          width: 560
        },
        polygon: [
          223, 273, 333,
          273, 371, 295,
          185, 295
        ],
        lines: [
          [ 223, 273, 333, 273 ],
          [ 333, 273, 371, 295 ],
          [ 371, 295, 185, 295 ],
          [ 223, 273, 185, 295 ]
        ]
      },
      {
        COMMENT: 'FLOOR HOLE 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_floor_hole_4',
          height: 190,
          width: 336
        },
        polygon: [
          134, 162, 200,
          162, 222, 175,
          111, 175
        ],
        lines: [
          [ 134, 162, 200, 162 ],
          [ 200, 162, 222, 175 ],
          [ 222, 175, 111, 175 ],
          [ 134, 162, 111, 175 ]
        ]
      },
      {
        COMMENT: 'FLOOR HOLE 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_floor_hole_8',
          height: 97,
          width: 176
        },
        polygon: [
           70, 83, 105, 83,
          116, 89,  58, 89
        ],
        lines: [
          [ 70, 83, 105, 83 ],
          [ 105, 83, 116, 89 ],
          [ 116, 89, 58, 89 ],
          [ 70, 83, 58, 89 ]
        ]
      },
      {
        COMMENT: 'FLOOR HOLE 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_floor_hole_14',
          height: 64,
          width: 120
        },
        polygon: [
          48, 55, 71, 55,
          79, 59, 40, 59
        ],
        lines: [
          [ 48, 55, 71, 55 ],
          [ 71, 55, 79, 59 ],
          [ 79, 59, 40, 59 ],
          [ 48, 55, 40, 59 ]
        ]
      },
      {
        COMMENT: 'FLOOR HOLE 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_floor_hole_22',
          height: 46,
          width: 88
        },
        polygon: [
          35, 39, 52, 39,
          58, 42, 29, 42
        ],
        lines: [
          [ 35, 39, 52, 39 ],
          [ 52, 39, 58, 42 ],
          [ 58, 42, 29, 42 ],
          [ 35, 39, 29, 42 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addFloor: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getFloor: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering ladders down in the dungeon. */
  this._laddersDown = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'LADDER DOWN 1',
        texture: {
          position: 1,
          edge: 'closed',
          key: 'akalabeth_ladder_down_1',
          height: 320,
          width: 560
        },
        polygon: [
          223, 273, 333,
          273, 371, 295,
          185, 295
        ],
        lines: [
          [ 223, 273, 333, 273 ],
          [ 333, 273, 371, 295 ],
          [ 371, 295, 185, 295 ],
          [ 223, 273, 185, 295 ],
          [ 247, 23, 247, 295 ],
          [ 309, 23, 309, 295 ],
          [ 247, 240, 309, 240 ],
          [ 247, 186, 309, 186 ],
          [ 247, 132, 309, 132 ],
          [ 247, 78, 309, 78 ]
        ]
      },
      {
        COMMENT: 'LADDER DOWN 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_ladder_down_4',
          height: 190,
          width: 336
        },
        polygon: [
          134, 162, 200,
          162, 222, 175,
          111, 175
        ],
        lines: [
          [ 134, 162, 200, 162 ],
          [ 200, 162, 222, 175 ],
          [ 222, 175, 111, 175 ],
          [ 134, 162, 111, 175 ],
          [ 148, 14, 148, 175 ],
          [ 185, 14, 185, 175 ],
          [ 148, 143, 185, 143 ],
          [ 148, 111, 185, 111 ],
          [ 148, 78, 185, 78 ],
          [ 148, 46, 185, 46 ]
        ]
      },
      {
        COMMENT: 'LADDER DOWN 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_ladder_down_8',
          height: 97,
          width: 176
        },
        polygon: [
          70, 83, 105, 83,
         116, 89,  58, 89
        ],
        lines: [
          [ 70, 83, 105, 83 ],
          [ 105, 83, 116, 89 ],
          [ 116, 89, 58, 89 ],
          [ 70, 83, 58, 89 ],
          [ 78, 7, 78, 89 ],
          [ 97, 7, 97, 89 ],
          [ 78, 73, 97, 73 ],
          [ 78, 56, 97, 56 ],
          [ 78, 40, 97, 40 ],
          [ 78, 24, 97, 24 ]
        ]
      },
      {
        COMMENT: 'LADDER DOWN 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_ladder_down_14',
          height: 64,
          width: 120
        },
        polygon: [
          48, 55, 71, 55,
          79, 59, 40, 59
        ],
        lines: [
          [ 48, 55, 71, 55 ],
          [ 71, 55, 79, 59 ],
          [ 79, 59, 40, 59 ],
          [ 48, 55, 40, 59 ],
          [ 53, 5, 53, 59 ],
          [ 66, 5, 66, 59 ],
          [ 53, 48, 66, 48 ],
          [ 53, 37, 66, 37 ],
          [ 53, 26, 66, 26 ],
          [ 53, 16, 66, 16 ]
        ]
      },
      {
        COMMENT: 'LADDER DOWN 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_ladder_down_22',
          height: 46,
          width: 88
        },
        polygon: [
          35, 39, 52, 39,
          58, 42, 29, 42
        ],
        lines: [
          [ 35, 39, 52, 39 ],
          [ 52, 39, 58, 42 ],
          [ 58, 42, 29, 42 ],
          [ 35, 39, 29, 42 ],
          [ 39, 3, 39, 42 ],
          [ 49, 3, 49, 42 ],
          [ 39, 35, 49, 35 ],
          [ 39, 27, 49, 27 ],
          [ 39, 19, 49, 19 ],
          [ 39, 11, 49, 11 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addLadder: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getLadder: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering ladders going up in the dungeon. */
  this._laddersUp = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'LADDER UP 1',
        texture: {
          position: 1,
          edge: 'closed',
          key: 'akalabeth_ladder_up_1',
          height: 320,
          width: 560
        },
        polygon: [
          223, 43, 333, 43,
          371, 21, 185, 21
        ],
        lines: [
          [ 223, 43, 333, 43 ],
          [ 333, 43, 371, 21 ],
          [ 371, 21, 185, 21 ],
          [ 223, 43, 185, 21 ],
          [ 247, 23, 247, 295 ],
          [ 309, 23, 309, 295 ],
          [ 247, 240, 309, 240 ],
          [ 247, 186, 309, 186 ],
          [ 247, 132, 309, 132 ],
          [ 247, 78, 309, 78 ]
        ]
      },
      {
        COMMENT: 'LADDER UP 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_ladder_up_4',
          height: 190,
          width: 336
        },
        polygon: [
          134, 25, 200, 25,
          222, 13, 111, 13
        ],
        lines: [
          [ 134, 25, 200, 25 ],
          [ 200, 25, 222, 13 ],
          [ 222, 13, 111, 13 ],
          [ 134, 25, 111, 13 ],
          [ 148, 14, 148, 175 ],
          [ 185, 14, 185, 175 ],
          [ 148, 143, 185, 143 ],
          [ 148, 111, 185, 111 ],
          [ 148, 78, 185, 78 ],
          [ 148, 46, 185, 46 ]
        ]
      },
      {
        COMMENT: 'LADDER UP 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_ladder_up_8',
          height: 97,
          width: 176
        },
        polygon: [
           70, 13, 105, 13,
          116,  6,  58,  6
        ],
        lines: [
          [ 70, 13, 105, 13 ],
          [ 105, 13, 116, 6 ],
          [ 116, 6, 58, 6 ],
          [ 70, 13, 58, 6 ],
          [ 78, 7, 78, 89 ],
          [ 97, 7, 97, 89 ],
          [ 78, 73, 97, 73 ],
          [ 78, 56, 97, 56 ],
          [ 78, 40, 97, 40 ],
          [ 78, 24, 97, 24 ]
        ]
      },
      {
        COMMENT: 'LADDER UP 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_ladder_up_14',
          height: 64,
          width: 120
        },
        polygon: [
          48, 9, 71, 9,
          79, 4, 40, 4
        ],
        lines: [
          [ 48, 9, 71, 9 ],
          [ 71, 9, 79, 4 ],
          [ 79, 4, 40, 4 ],
          [ 48, 9, 40, 4 ],
          [ 53, 5, 53, 59 ],
          [ 66, 5, 66, 59 ],
          [ 53, 48, 66, 48 ],
          [ 53, 37, 66, 37 ],
          [ 53, 26, 66, 26 ],
          [ 53, 16, 66, 16 ]
        ]
      },
      {
        COMMENT: 'LADDER UP 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_ladder_up_22',
          height: 46,
          width: 88
        },
        polygon: [
          35, 6, 52, 6,
          58, 3, 29, 3
        ],
        lines: [
          [ 35, 6, 52, 6 ],
          [ 52, 6, 58, 3 ],
          [ 58, 3, 29, 3 ],
          [ 35, 6, 29, 3 ],
          [ 39, 3, 39, 42 ],
          [ 49, 3, 49, 42 ],
          [ 39, 35, 49, 35 ],
          [ 39, 27, 49, 27 ],
          [ 39, 19, 49, 19 ],
          [ 39, 11, 49, 11 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addLadder: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getLadder: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering walls in the dungeon. */
  this._walls = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'LEFT 0 OPEN',
        texture: {
          position: 0,
          edge: 'open',
          key: 'akalabeth_wall_0_open',
          height: 320,
          width: 112
        },
        polygon: [
            0,   0, 112,  64,
          112, 254,   0, 320
        ],
        lines: [ [ 0, 0, 112, 64 ], [ 0, 320, 112, 254 ] ]
      },
      {
        COMMENT: 'LEFT 0 CLOSED',
        texture: {
          position: 0,
          edge: 'closed',
          key: 'akalabeth_wall_0_closed',
          height: 320,
          width: 112
        },
        polygon: [
            0,   0, 112,  64,
          112, 254,   0, 320
        ],
        lines: [ [ 0, 0, 112, 64 ], [ 0, 320, 112, 254 ], [ 111, 64, 111, 254 ] ]
      },
      {
        COMMENT: 'RIGHT 2 OPEN',
        texture: {
          position: 2,
          edge: 'open',
          key: 'akalabeth_wall_2_open',
          height: 320,
          width: 112
        },
        polygon: [
          112,   0,   0,  64,
            0, 254, 112, 320
        ],
        lines: [ [ 112, 0, 0, 64 ], [ 112, 320, 0, 254 ] ]
      },
      {
        COMMENT: 'RIGHT 2 CLOSED',
        texture: {
          position: 2,
          edge: 'closed',
          key: 'akalabeth_wall_2_closed',
          height: 320,
          width: 112
        },
        polygon: [
          112,   0,   0,  64,
            0, 254, 112, 320
        ],
        lines: [ [ 112, 0, 0, 64 ], [ 112, 320, 0, 254 ], [ 1, 64, 1, 254 ] ]
      },
      {
        COMMENT: 'LEFT 3 OPEN',
        texture: {
          position: 3,
          edge: 'open',
          key: 'akalabeth_wall_3_open',
          height: 190,
          width: 192
        },
        polygon: [
           0,   0, 112,   0, 192,
          46, 192, 143, 112, 190,
           0, 190
        ],
        lines: [
          [ 0, 1, 112, 1 ],
          [ 111, 0, 111, 190 ],
          [ 0, 189, 112, 189 ],
          [ 112, 0, 192, 46 ],
          [ 112, 190, 192, 143 ]
        ]
      },
      {
        COMMENT: 'LEFT 3 CLOSED',
        texture: {
          position: 3,
          edge: 'closed',
          key: 'akalabeth_wall_3_closed',
          height: 190,
          width: 192
        },
        polygon: [
           0,   0, 112,   0, 192,
          46, 192, 143, 112, 190,
           0, 190
        ],
        lines: [
          [ 0, 1, 112, 1 ],
          [ 111, 0, 111, 190 ],
          [ 0, 189, 112, 189 ],
          [ 112, 0, 192, 46 ],
          [ 191, 46, 191, 143 ],
          [ 112, 190, 192, 143 ]
        ]
      },
      {
        COMMENT: 'CENTER 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_wall_4_closed',
          height: 190,
          width: 336
        },
        polygon: [
            0,   0, 336,   0,
          336, 190,   0, 190
        ],
        lines: [
          [ 0, 1, 336, 1 ],
          [ 1, 0, 1, 190 ],
          [ 0, 189, 336, 189 ],
          [ 335, 0, 335, 190 ]
        ]
      },
      {
        COMMENT: 'RIGHT 5 OPEN',
        texture: {
          position: 5,
          edge: 'open',
          key: 'akalabeth_wall_5_open',
          height: 190,
          width: 192
        },
        polygon: [
          192,   0,  80,  0,   0,
           46,   0, 143, 80, 190,
          192, 190
        ],
        lines: [
          [ 192, 1, 80, 1 ],
          [ 81, 0, 81, 190 ],
          [ 192, 189, 80, 189 ],
          [ 80, 0, 0, 46 ],
          [ 80, 190, 0, 143 ]
        ]
      },
      {
        COMMENT: 'RIGHT 5 CLOSED',
        texture: {
          position: 5,
          edge: 'closed',
          key: 'akalabeth_wall_5_closed',
          height: 190,
          width: 192
        },
        polygon: [
          192,   0,  80,  0,   0,
           46,   0, 143, 80, 190,
          192, 190
        ],
        lines: [
          [ 192, 1, 80, 1 ],
          [ 81, 0, 81, 190 ],
          [ 192, 189, 80, 189 ],
          [ 80, 0, 0, 46 ],
          [ 1, 46, 1, 143 ],
          [ 80, 190, 0, 143 ]
        ]
      },
      {
        COMMENT: 'LEFT 7 OPEN',
        texture: {
          position: 7,
          edge: 'open',
          key: 'akalabeth_wall_7_open',
          height: 97,
          width: 220
        },
        polygon: [
           0,   0, 192,   0, 220,
          16, 220,  80, 192,  97,
           0,  97
        ],
        lines: [
          [ 0, 1, 192, 1 ],
          [ 191, 0, 191, 97 ],
          [ 0, 96, 192, 96 ],
          [ 192, 0, 220, 16 ],
          [ 192, 97, 220, 80 ]
        ]
      },
      {
        COMMENT: 'LEFT 7 CLOSED',
        texture: {
          position: 7,
          edge: 'closed',
          key: 'akalabeth_wall_7_closed',
          height: 97,
          width: 220
        },
        polygon: [
           0,   0, 192,   0, 220,
          16, 220,  80, 192,  97,
           0,  97
        ],
        lines: [
          [ 0, 1, 192, 1 ],
          [ 191, 0, 191, 97 ],
          [ 0, 96, 192, 96 ],
          [ 192, 0, 220, 16 ],
          [ 219, 16, 219, 80 ],
          [ 192, 97, 220, 80 ]
        ]
      },
      {
        COMMENT: 'CENTER 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_wall_8_closed',
          height: 97,
          width: 176
        },
        polygon: [
            0,  0, 176,  0,
          176, 97,   0, 97
        ],
        lines: [
          [ 0, 1, 176, 1 ],
          [ 1, 0, 1, 97 ],
          [ 0, 96, 176, 96 ],
          [ 175, 0, 175, 97 ]
        ]
      },
      {
        COMMENT: 'RIGHT 9 OPEN',
        texture: {
          position: 9,
          edge: 'open',
          key: 'akalabeth_wall_9_open',
          height: 97,
          width: 220
        },
        polygon: [
          220,  0, 28,  0,  0,
           16,  0, 80, 28, 97,
          220, 97
        ],
        lines: [
          [ 220, 1, 28, 1 ],
          [ 29, 0, 29, 97 ],
          [ 220, 96, 28, 96 ],
          [ 28, 0, 0, 16 ],
          [ 28, 97, 0, 80 ]
        ]
      },
      {
        COMMENT: 'RIGHT 9 CLOSED',
        texture: {
          position: 9,
          edge: 'closed',
          key: 'akalabeth_wall_9_closed',
          height: 97,
          width: 220
        },
        polygon: [
          220,  0, 28,  0,  0,
           16,  0, 80, 28, 97,
          220, 97
        ],
        lines: [
          [ 220, 1, 28, 1 ],
          [ 29, 0, 29, 97 ],
          [ 220, 96, 28, 96 ],
          [ 28, 0, 0, 16 ],
          [ 1, 16, 1, 80 ],
          [ 28, 97, 0, 80 ]
        ]
      },
      {
        COMMENT: 'LEFT 13 OPEN',
        texture: {
          position: 13,
          edge: 'open',
          key: 'akalabeth_wall_13_open',
          height: 64,
          width: 236
        },
        polygon: [
          0,   0, 220,   0, 236,
          9, 236,  55, 220,  64,
          0,  64
        ],
        lines: [
          [ 0, 1, 220, 1 ],
          [ 219, 0, 219, 64 ],
          [ 0, 63, 220, 63 ],
          [ 220, 0, 236, 9 ],
          [ 220, 64, 236, 55 ]
        ]
      },
      {
        COMMENT: 'LEFT 13 CLOSED',
        texture: {
          position: 13,
          edge: 'closed',
          key: 'akalabeth_wall_13_closed',
          height: 64,
          width: 236
        },
        polygon: [
          0,   0, 220,   0, 236,
          9, 236,  55, 220,  64,
          0,  64
        ],
        lines: [
          [ 0, 1, 220, 1 ],
          [ 219, 0, 219, 64 ],
          [ 0, 63, 220, 63 ],
          [ 220, 0, 236, 9 ],
          [ 235, 9, 235, 55 ],
          [ 220, 64, 236, 55 ]
        ]
      },
      {
        COMMENT: 'CENTER 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_wall_14_closed',
          height: 64,
          width: 120
        },
        polygon: [
            0,  0, 120,  0,
          120, 64,   0, 64
        ],
        lines: [
          [ 0, 1, 120, 1 ],
          [ 1, 0, 1, 64 ],
          [ 0, 63, 120, 63 ],
          [ 119, 0, 119, 64 ]
        ]
      },
      {
        COMMENT: 'RIGHT 15 OPEN',
        texture: {
          position: 15,
          edge: 'open',
          key: 'akalabeth_wall_15_open',
          height: 64,
          width: 236
        },
        polygon: [
          236,  0, 16,  0,  0,
            9,  0, 55, 16, 64,
          236, 64
        ],
        lines: [
          [ 236, 1, 16, 1 ],
          [ 17, 0, 17, 64 ],
          [ 236, 63, 16, 63 ],
          [ 16, 0, 0, 9 ],
          [ 16, 64, 0, 55 ]
        ]
      },
      {
        COMMENT: 'RIGHT 15 CLOSED',
        texture: {
          position: 15,
          edge: 'closed',
          key: 'akalabeth_wall_15_closed',
          height: 64,
          width: 236
        },
        polygon: [
          236,  0, 16,  0,  0,
            9,  0, 55, 16, 64,
          236, 64
        ],
        lines: [
          [ 236, 1, 16, 1 ],
          [ 17, 0, 17, 64 ],
          [ 236, 63, 16, 63 ],
          [ 16, 0, 0, 9 ],
          [ 1, 9, 1, 55 ],
          [ 16, 64, 0, 55 ]
        ]
      },
      {
        COMMENT: 'LEFT 21 OPEN',
        texture: {
          position: 21,
          edge: 'open',
          key: 'akalabeth_wall_21_open',
          height: 46,
          width: 244
        },
        polygon: [
          0,   0, 236,   0, 244,
          4, 244,  41, 236,  46,
          0,  46
        ],
        lines: [
          [ 0, 1, 236, 1 ],
          [ 235, 0, 235, 46 ],
          [ 0, 45, 236, 45 ],
          [ 236, 0, 244, 4 ],
          [ 236, 46, 244, 41 ]
        ]
      },
      {
        COMMENT: 'LEFT 21 CLOSED',
        texture: {
          position: 21,
          edge: 'closed',
          key: 'akalabeth_wall_21_closed',
          height: 46,
          width: 244
        },
        polygon: [
          0,   0, 236,   0, 244,
          4, 244,  41, 236,  46,
          0,  46
        ],
        lines: [
          [ 0, 1, 236, 1 ],
          [ 235, 0, 235, 46 ],
          [ 0, 45, 236, 45 ],
          [ 236, 0, 244, 4 ],
          [ 243, 4, 243, 41 ],
          [ 236, 46, 244, 41 ]
        ]
      },
      {
        COMMENT: 'CENTER 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_wall_22_closed',
          height: 46,
          width: 88
        },
        polygon: [
           0,  0, 88,  0,
          88, 46,  0, 46
        ],
        lines: [
          [ 0, 1, 88, 1 ],
          [ 1, 0, 1, 46 ],
          [ 0, 45, 88, 45 ],
          [ 87, 0, 87, 46 ]
        ]
      },
      {
        COMMENT: 'RIGHT 23 OPEN',
        texture: {
          position: 23,
          edge: 'open',
          key: 'akalabeth_wall_23_open',
          height: 46,
          width: 244
        },
        polygon: [
          244,  0,  8, 0,  0,
            5,  0, 41, 8, 46,
          244, 46
        ],
        lines: [
          [ 244, 1, 8, 1 ],
          [ 9, 0, 9, 46 ],
          [ 244, 45, 8, 45 ],
          [ 8, 0, 0, 5 ],
          [ 8, 46, 0, 41 ]
        ]
      },
      {
        COMMENT: 'RIGHT 23 CLOSED',
        texture: {
          position: 23,
          edge: 'closed',
          key: 'akalabeth_wall_23_closed',
          height: 46,
          width: 244
        },
        polygon: [
          244,  0,  8, 0,  0,
            5,  0, 41, 8, 46,
          244, 46
        ],
        lines: [
          [ 244, 1, 8, 1 ],
          [ 9, 0, 9, 46 ],
          [ 244, 45, 8, 45 ],
          [ 8, 0, 0, 5 ],
          [ 1, 5, 1, 41 ],
          [ 8, 46, 0, 41 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addWall: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getWall: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering balrogs in the dungeon. */
  this._balrogs = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'BALROG 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_balrog_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            178,  68, 226,   8,
            286, 128, 286, 168,
            226, 108, 196, 108
          ],
          [
            154,  68, 106,   8,  46,
            128,  46, 168, 106, 108,
            136, 108
          ],
          [
            166, 138, 178, 138, 186, 148, 190, 168, 186, 176, 186, 188,
            194, 188, 196, 178, 198, 188, 206, 188, 206, 176, 202, 168,
            202, 148, 196, 128, 196,  98, 246,  68, 246,  48, 186,  78,
            178,  68, 186,  40, 178,  28, 175,  28, 173,  24, 171,  28,
            166,  28, 163,  28, 161,  24, 159,  28, 154,  28, 146,  40,
            154,  68, 146,  78,  86,  48,  86,  68, 136,  98, 136, 128,
            130, 148, 130, 168, 126, 176, 126, 188, 134, 188, 136, 178,
            138, 188, 146, 188, 146, 176, 142, 168, 146, 148, 154, 138
          ],
          [
            154, 138, 166, 176,
            186, 188, 175, 172,
            178, 138
          ],
          [ 246, 16, 242, 4, 250, 4 ]
        ],
        lines: [
          [ 178, 68, 226, 8 ],    [ 226, 8, 286, 128 ],   [ 286, 128, 286, 168 ],
          [ 286, 168, 226, 108 ], [ 226, 108, 196, 108 ], [ 154, 68, 106, 8 ],
          [ 106, 8, 46, 128 ],    [ 46, 128, 46, 168 ],   [ 46, 168, 106, 108 ],
          [ 106, 108, 136, 108 ], [ 166, 138, 178, 138 ], [ 178, 138, 186, 148 ],
          [ 186, 148, 190, 168 ], [ 190, 168, 186, 176 ], [ 186, 176, 186, 188 ],
          [ 186, 188, 194, 188 ], [ 194, 188, 196, 178 ], [ 196, 178, 198, 188 ],
          [ 198, 188, 206, 188 ], [ 206, 188, 206, 176 ], [ 206, 176, 202, 168 ],
          [ 202, 168, 202, 148 ], [ 202, 148, 196, 128 ], [ 196, 128, 196, 98 ],
          [ 196, 98, 246, 68 ],   [ 246, 68, 246, 48 ],   [ 246, 48, 186, 78 ],
          [ 186, 78, 178, 68 ],   [ 178, 68, 186, 40 ],   [ 186, 40, 178, 28 ],
          [ 178, 28, 175, 28 ],   [ 175, 28, 173, 24 ],   [ 173, 24, 171, 28 ],
          [ 171, 28, 166, 28 ],   [ 166, 28, 163, 28 ],   [ 163, 28, 161, 24 ],
          [ 161, 24, 159, 28 ],   [ 159, 28, 154, 28 ],   [ 154, 28, 146, 40 ],
          [ 146, 40, 154, 68 ],   [ 154, 68, 146, 78 ],   [ 146, 78, 86, 48 ],
          [ 86, 48, 86, 68 ],     [ 86, 68, 136, 98 ],    [ 136, 98, 136, 128 ],
          [ 136, 128, 130, 148 ], [ 130, 148, 130, 168 ], [ 130, 168, 126, 176 ],
          [ 126, 176, 126, 188 ], [ 126, 188, 134, 188 ], [ 134, 188, 136, 178 ],
          [ 136, 178, 138, 188 ], [ 138, 188, 146, 188 ], [ 146, 188, 146, 176 ],
          [ 146, 176, 142, 168 ], [ 142, 168, 146, 148 ], [ 146, 148, 154, 138 ],
          [ 154, 138, 166, 138 ], [ 154, 138, 166, 176 ], [ 166, 176, 186, 188 ],
          [ 186, 188, 175, 172 ], [ 175, 172, 178, 138 ], [ 86, 60, 86, 8 ],
          [ 86, 8, 62, 28 ],      [ 62, 28, 62, 108 ],    [ 246, 16, 242, 4 ],
          [ 242, 4, 250, 4 ],     [ 250, 4, 246, 16 ],    [ 246, 16, 246, 88 ],
          [ 175, 48, 178, 40 ],   [ 159, 48, 154, 40 ],   [ 166, 60, 166, 68 ]
        ]
      },
      {
        COMMENT: 'BALROG 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_balrog_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
             93,  35, 118,   4, 150,
             65, 150,  86, 118,  55,
            103,  55
          ],
          [
            81, 35, 56,  4, 24,
            65, 24, 86, 56, 55,
            71, 55
          ],
          [
             87, 70,  93, 70,  97, 76, 100, 86,  97, 90,  97, 96,
            102, 96, 103, 91, 104, 96, 108, 96, 108, 90, 106, 86,
            106, 76, 103, 65, 103, 50, 129, 35, 129, 25,  97, 40,
             93, 35,  97, 20,  93, 14,  92, 14,  91, 12,  90, 14,
             87, 14,  85, 14,  84, 12,  83, 14,  81, 14,  76, 20,
             81, 35,  76, 40,  45, 25,  45, 35,  71, 50,  71, 65,
             68, 76,  68, 86,  66, 90,  66, 96,  70, 96,  71, 91,
             72, 96,  76, 96,  76, 90,  74, 86,  76, 76,  81, 70
          ],
          [
            81, 70, 87, 90, 97,
            96, 92, 88, 93, 70
          ],
          [ 129, 8, 127, 2, 131, 2 ]
        ],
        lines: [
          [ 93, 35, 118, 4 ],   [ 118, 4, 150, 65 ],  [ 150, 65, 150, 86 ],
          [ 150, 86, 118, 55 ], [ 118, 55, 103, 55 ], [ 81, 35, 56, 4 ],
          [ 56, 4, 24, 65 ],    [ 24, 65, 24, 86 ],   [ 24, 86, 56, 55 ],
          [ 56, 55, 71, 55 ],   [ 87, 70, 93, 70 ],   [ 93, 70, 97, 76 ],
          [ 97, 76, 100, 86 ],  [ 100, 86, 97, 90 ],  [ 97, 90, 97, 96 ],
          [ 97, 96, 102, 96 ],  [ 102, 96, 103, 91 ], [ 103, 91, 104, 96 ],
          [ 104, 96, 108, 96 ], [ 108, 96, 108, 90 ], [ 108, 90, 106, 86 ],
          [ 106, 86, 106, 76 ], [ 106, 76, 103, 65 ], [ 103, 65, 103, 50 ],
          [ 103, 50, 129, 35 ], [ 129, 35, 129, 25 ], [ 129, 25, 97, 40 ],
          [ 97, 40, 93, 35 ],   [ 93, 35, 97, 20 ],   [ 97, 20, 93, 14 ],
          [ 93, 14, 92, 14 ],   [ 92, 14, 91, 12 ],   [ 91, 12, 90, 14 ],
          [ 90, 14, 87, 14 ],   [ 87, 14, 85, 14 ],   [ 85, 14, 84, 12 ],
          [ 84, 12, 83, 14 ],   [ 83, 14, 81, 14 ],   [ 81, 14, 76, 20 ],
          [ 76, 20, 81, 35 ],   [ 81, 35, 76, 40 ],   [ 76, 40, 45, 25 ],
          [ 45, 25, 45, 35 ],   [ 45, 35, 71, 50 ],   [ 71, 50, 71, 65 ],
          [ 71, 65, 68, 76 ],   [ 68, 76, 68, 86 ],   [ 68, 86, 66, 90 ],
          [ 66, 90, 66, 96 ],   [ 66, 96, 70, 96 ],   [ 70, 96, 71, 91 ],
          [ 71, 91, 72, 96 ],   [ 72, 96, 76, 96 ],   [ 76, 96, 76, 90 ],
          [ 76, 90, 74, 86 ],   [ 74, 86, 76, 76 ],   [ 76, 76, 81, 70 ],
          [ 81, 70, 87, 70 ],   [ 81, 70, 87, 90 ],   [ 87, 90, 97, 96 ],
          [ 97, 96, 92, 88 ],   [ 92, 88, 93, 70 ],   [ 45, 31, 45, 4 ],
          [ 45, 4, 32, 14 ],    [ 32, 14, 32, 55 ],   [ 129, 8, 127, 2 ],
          [ 127, 2, 131, 2 ],   [ 131, 2, 129, 8 ],   [ 129, 8, 129, 45 ],
          [ 92, 25, 93, 20 ],   [ 83, 25, 81, 20 ],   [ 87, 31, 87, 35 ]
        ]
      },
      {
        COMMENT: 'BALROG 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_balrog_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            64,  23, 81,  3, 102,
            43, 102, 57, 81,  36,
            70,  36
          ],
          [
            55, 23, 38,  3, 16,
            43, 16, 57, 38, 36,
            49, 36
          ],
          [
            59, 46, 64, 46, 66, 50, 68, 57, 66, 59, 66, 63,
            69, 63, 70, 60, 71, 63, 74, 63, 74, 59, 72, 57,
            72, 50, 70, 43, 70, 33, 88, 23, 88, 16, 66, 26,
            64, 23, 66, 13, 64,  9, 63,  9, 62,  8, 61,  9,
            59,  9, 58,  9, 58,  8, 57,  9, 55,  9, 52, 13,
            55, 23, 52, 26, 31, 16, 31, 23, 49, 33, 49, 43,
            46, 50, 46, 57, 45, 59, 45, 63, 48, 63, 49, 60,
            49, 63, 52, 63, 52, 59, 51, 57, 52, 50, 55, 46
          ],
          [
            55, 46, 59, 59, 66,
            63, 63, 58, 64, 46
          ],
          [ 88, 5, 86, 1, 89, 1 ]
        ],
        lines: [
          [ 64, 23, 81, 3 ],   [ 81, 3, 102, 43 ], [ 102, 43, 102, 57 ],
          [ 102, 57, 81, 36 ], [ 81, 36, 70, 36 ], [ 55, 23, 38, 3 ],
          [ 38, 3, 16, 43 ],   [ 16, 43, 16, 57 ], [ 16, 57, 38, 36 ],
          [ 38, 36, 49, 36 ],  [ 59, 46, 64, 46 ], [ 64, 46, 66, 50 ],
          [ 66, 50, 68, 57 ],  [ 68, 57, 66, 59 ], [ 66, 59, 66, 63 ],
          [ 66, 63, 69, 63 ],  [ 69, 63, 70, 60 ], [ 70, 60, 71, 63 ],
          [ 71, 63, 74, 63 ],  [ 74, 63, 74, 59 ], [ 74, 59, 72, 57 ],
          [ 72, 57, 72, 50 ],  [ 72, 50, 70, 43 ], [ 70, 43, 70, 33 ],
          [ 70, 33, 88, 23 ],  [ 88, 23, 88, 16 ], [ 88, 16, 66, 26 ],
          [ 66, 26, 64, 23 ],  [ 64, 23, 66, 13 ], [ 66, 13, 64, 9 ],
          [ 64, 9, 63, 9 ],    [ 63, 9, 62, 8 ],   [ 62, 8, 61, 9 ],
          [ 61, 9, 59, 9 ],    [ 59, 9, 58, 9 ],   [ 58, 9, 58, 8 ],
          [ 58, 8, 57, 9 ],    [ 57, 9, 55, 9 ],   [ 55, 9, 52, 13 ],
          [ 52, 13, 55, 23 ],  [ 55, 23, 52, 26 ], [ 52, 26, 31, 16 ],
          [ 31, 16, 31, 23 ],  [ 31, 23, 49, 33 ], [ 49, 33, 49, 43 ],
          [ 49, 43, 46, 50 ],  [ 46, 50, 46, 57 ], [ 46, 57, 45, 59 ],
          [ 45, 59, 45, 63 ],  [ 45, 63, 48, 63 ], [ 48, 63, 49, 60 ],
          [ 49, 60, 49, 63 ],  [ 49, 63, 52, 63 ], [ 52, 63, 52, 59 ],
          [ 52, 59, 51, 57 ],  [ 51, 57, 52, 50 ], [ 52, 50, 55, 46 ],
          [ 55, 46, 59, 46 ],  [ 55, 46, 59, 59 ], [ 59, 59, 66, 63 ],
          [ 66, 63, 63, 58 ],  [ 63, 58, 64, 46 ], [ 31, 20, 31, 3 ],
          [ 31, 3, 22, 9 ],    [ 22, 9, 22, 36 ],  [ 88, 5, 86, 1 ],
          [ 86, 1, 89, 1 ],    [ 89, 1, 88, 5 ],   [ 88, 5, 88, 30 ],
          [ 63, 16, 64, 13 ],  [ 57, 16, 55, 13 ], [ 59, 20, 59, 23 ]
        ]
      },
      {
        COMMENT: 'BALROG 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_balrog_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            47, 16, 59,  2, 75,
            31, 75, 41, 59, 26,
            51, 26
          ],
          [
            40, 16, 28,  2, 12,
            31, 12, 41, 28, 26,
            36, 26
          ],
          [
            43, 33, 47, 33, 49, 36, 50, 41, 49, 43, 49, 46,
            51, 46, 51, 43, 52, 46, 54, 46, 54, 43, 53, 41,
            53, 36, 51, 31, 51, 24, 64, 16, 64, 12, 49, 19,
            47, 16, 49, 10, 47,  7, 46,  7, 45,  6, 45,  7,
            43,  7, 43,  7, 42,  6, 42,  7, 40,  7, 38, 10,
            40, 16, 38, 19, 23, 12, 23, 16, 36, 24, 36, 31,
            34, 36, 34, 41, 33, 43, 33, 46, 35, 46, 36, 43,
            36, 46, 38, 46, 38, 43, 37, 41, 38, 36, 40, 33
          ],
          [
            40, 33, 43, 43, 49,
            46, 46, 42, 47, 33
          ],
          [ 64, 4, 63, 1, 65, 1 ]
        ],
        lines: [
          [ 47, 16, 59, 2 ],  [ 59, 2, 75, 31 ],  [ 75, 31, 75, 41 ],
          [ 75, 41, 59, 26 ], [ 59, 26, 51, 26 ], [ 40, 16, 28, 2 ],
          [ 28, 2, 12, 31 ],  [ 12, 31, 12, 41 ], [ 12, 41, 28, 26 ],
          [ 28, 26, 36, 26 ], [ 43, 33, 47, 33 ], [ 47, 33, 49, 36 ],
          [ 49, 36, 50, 41 ], [ 50, 41, 49, 43 ], [ 49, 43, 49, 46 ],
          [ 49, 46, 51, 46 ], [ 51, 46, 51, 43 ], [ 51, 43, 52, 46 ],
          [ 52, 46, 54, 46 ], [ 54, 46, 54, 43 ], [ 54, 43, 53, 41 ],
          [ 53, 41, 53, 36 ], [ 53, 36, 51, 31 ], [ 51, 31, 51, 24 ],
          [ 51, 24, 64, 16 ], [ 64, 16, 64, 12 ], [ 64, 12, 49, 19 ],
          [ 49, 19, 47, 16 ], [ 47, 16, 49, 10 ], [ 49, 10, 47, 7 ],
          [ 47, 7, 46, 7 ],   [ 46, 7, 45, 6 ],   [ 45, 6, 45, 7 ],
          [ 45, 7, 43, 7 ],   [ 43, 7, 43, 7 ],   [ 43, 7, 42, 6 ],
          [ 42, 6, 42, 7 ],   [ 42, 7, 40, 7 ],   [ 40, 7, 38, 10 ],
          [ 38, 10, 40, 16 ], [ 40, 16, 38, 19 ], [ 38, 19, 23, 12 ],
          [ 23, 12, 23, 16 ], [ 23, 16, 36, 24 ], [ 36, 24, 36, 31 ],
          [ 36, 31, 34, 36 ], [ 34, 36, 34, 41 ], [ 34, 41, 33, 43 ],
          [ 33, 43, 33, 46 ], [ 33, 46, 35, 46 ], [ 35, 46, 36, 43 ],
          [ 36, 43, 36, 46 ], [ 36, 46, 38, 46 ], [ 38, 46, 38, 43 ],
          [ 38, 43, 37, 41 ], [ 37, 41, 38, 36 ], [ 38, 36, 40, 33 ],
          [ 40, 33, 43, 33 ], [ 40, 33, 43, 43 ], [ 43, 43, 49, 46 ],
          [ 49, 46, 46, 42 ], [ 46, 42, 47, 33 ], [ 23, 15, 23, 2 ],
          [ 23, 2, 16, 7 ],   [ 16, 7, 16, 26 ],  [ 64, 4, 63, 1 ],
          [ 63, 1, 65, 1 ],   [ 65, 1, 64, 4 ],   [ 64, 4, 64, 21 ],
          [ 46, 12, 47, 10 ], [ 42, 12, 40, 10 ], [ 43, 15, 43, 16 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering carrion crawlers in the dungeon. */
  this._crawlers = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'CRAWLER 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_crawler_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            126,   0, 126,  12, 146,
             22, 186,  22, 206,  12,
            206,   0
          ]
        ],
        lines: [
          [ 126, 0, 126, 12 ],  [ 126, 12, 146, 22 ],
          [ 146, 22, 186, 22 ], [ 186, 22, 206, 12 ],
          [ 206, 12, 206, 0 ],  [ 206, 0, 126, 0 ],
          [ 126, 12, 106, 22 ], [ 106, 22, 106, 32 ],
          [ 206, 12, 226, 22 ], [ 226, 22, 246, 22 ],
          [ 136, 16, 126, 22 ], [ 126, 22, 126, 32 ],
          [ 126, 32, 106, 42 ], [ 106, 42, 106, 52 ],
          [ 106, 52, 126, 62 ], [ 146, 22, 146, 72 ],
          [ 146, 72, 166, 88 ], [ 186, 22, 186, 32 ],
          [ 186, 32, 206, 42 ], [ 206, 42, 206, 108 ],
          [ 196, 18, 206, 32 ], [ 206, 32, 226, 36 ],
          [ 226, 36, 226, 68 ], [ 166, 22, 166, 42 ],
          [ 166, 42, 186, 52 ], [ 186, 52, 186, 62 ],
          [ 186, 62, 166, 72 ]
        ]
      },
      {
        COMMENT: 'CRAWLER 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_crawler_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
             66,  0, 66,   6, 76,
             11, 97, 11, 108,  6,
            108,  0
          ]
        ],
        lines: [
          [ 66, 0, 66, 6 ],     [ 66, 6, 76, 11 ],
          [ 76, 11, 97, 11 ],   [ 97, 11, 108, 6 ],
          [ 108, 6, 108, 0 ],   [ 108, 0, 66, 0 ],
          [ 66, 6, 56, 11 ],    [ 56, 11, 56, 16 ],
          [ 108, 6, 118, 11 ],  [ 118, 11, 129, 11 ],
          [ 71, 8, 66, 11 ],    [ 66, 11, 66, 16 ],
          [ 66, 16, 56, 21 ],   [ 56, 21, 56, 27 ],
          [ 56, 27, 66, 32 ],   [ 76, 11, 76, 37 ],
          [ 76, 37, 87, 45 ],   [ 97, 11, 97, 16 ],
          [ 97, 16, 108, 21 ],  [ 108, 21, 108, 55 ],
          [ 103, 9, 108, 16 ],  [ 108, 16, 118, 18 ],
          [ 118, 18, 118, 35 ], [ 87, 11, 87, 21 ],
          [ 87, 21, 97, 27 ],   [ 97, 27, 97, 32 ],
          [ 97, 32, 87, 37 ]
        ]
      },
      {
        COMMENT: 'CRAWLER 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_crawler_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            45,  0, 45,  4, 52,
             7, 66,  7, 74,  4,
            74,  0
          ]
        ],
        lines: [
          [ 45, 0, 45, 4 ],   [ 45, 4, 52, 7 ],
          [ 52, 7, 66, 7 ],   [ 66, 7, 74, 4 ],
          [ 74, 4, 74, 0 ],   [ 74, 0, 45, 0 ],
          [ 45, 4, 38, 7 ],   [ 38, 7, 38, 11 ],
          [ 74, 4, 81, 7 ],   [ 81, 7, 88, 7 ],
          [ 49, 5, 45, 7 ],   [ 45, 7, 45, 11 ],
          [ 45, 11, 38, 14 ], [ 38, 14, 38, 18 ],
          [ 38, 18, 45, 21 ], [ 52, 7, 52, 24 ],
          [ 52, 24, 59, 30 ], [ 66, 7, 66, 11 ],
          [ 66, 11, 74, 14 ], [ 74, 14, 74, 36 ],
          [ 70, 6, 74, 11 ],  [ 74, 11, 81, 12 ],
          [ 81, 12, 81, 23 ], [ 59, 7, 59, 14 ],
          [ 59, 14, 66, 18 ], [ 66, 18, 66, 21 ],
          [ 66, 21, 59, 24 ]
        ]
      },
      {
        COMMENT: 'CRAWLER 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_crawler_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            33,  0, 33,  3, 38,
             5, 49,  5, 54,  3,
            54,  0
          ]
        ],
        lines: [
          [ 33, 0, 33, 3 ],   [ 33, 3, 38, 5 ],
          [ 38, 5, 49, 5 ],   [ 49, 5, 54, 3 ],
          [ 54, 3, 54, 0 ],   [ 54, 0, 33, 0 ],
          [ 33, 3, 28, 5 ],   [ 28, 5, 28, 8 ],
          [ 54, 3, 59, 5 ],   [ 59, 5, 64, 5 ],
          [ 36, 4, 33, 5 ],   [ 33, 5, 33, 8 ],
          [ 33, 8, 28, 10 ],  [ 28, 10, 28, 13 ],
          [ 28, 13, 33, 15 ], [ 38, 5, 38, 17 ],
          [ 38, 17, 43, 21 ], [ 49, 5, 49, 8 ],
          [ 49, 8, 54, 10 ],  [ 54, 10, 54, 26 ],
          [ 51, 4, 54, 8 ],   [ 54, 8, 59, 9 ],
          [ 59, 9, 59, 16 ],  [ 43, 5, 43, 10 ],
          [ 43, 10, 49, 13 ], [ 49, 13, 49, 15 ],
          [ 49, 15, 43, 17 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering daemons in the dungeon. */
  this._daemons = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'DAEMON 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_daemon_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            138,  96, 142, 114, 126, 124, 106, 124, 122, 140,  86,
            154,  86, 174,  90, 178,  86, 182,  86, 188,  94, 188,
             98, 184, 102, 188, 110, 188, 110, 182, 106, 178, 110,
            174, 110, 158, 166, 134, 222, 158, 222, 174, 226, 178,
            222, 182, 222, 188, 230, 188, 234, 184, 238, 188, 246,
            188, 246, 182, 242, 178, 246, 174, 246, 154, 210, 140,
            226, 124, 206, 124, 190, 114, 194,  96
          ],
          [
            178,  92, 242, 106, 246, 104, 202,  76, 190,  76, 186,
             74, 182,  76, 150,  76, 146,  72, 194,  72, 198,  70,
            182,  62, 178,  62, 171,  48, 171,  62, 163,  62, 163,
             48, 154,  62, 150,  62, 134,  70, 138,  72, 146,  74,
            142,  76, 130,  76,  94,  94,  94, 110, 110, 106, 110,
             96, 126,  88, 130,  88, 138,  96
          ],
          [ 246, 170, 266, 164, 246, 174 ],
          [
            150, 138, 178, 174,
            222, 174, 222, 170,
            206, 170, 178, 138
          ]
        ],
        lines: [
          [ 138, 96, 142, 114 ],  [ 142, 114, 126, 124 ], [ 126, 124, 106, 124 ],
          [ 106, 124, 122, 140 ], [ 122, 140, 86, 154 ],  [ 86, 154, 86, 174 ],
          [ 86, 174, 90, 178 ],   [ 90, 178, 86, 182 ],   [ 86, 182, 86, 188 ],
          [ 86, 188, 94, 188 ],   [ 94, 188, 98, 184 ],   [ 98, 184, 102, 188 ],
          [ 102, 188, 110, 188 ], [ 110, 188, 110, 182 ], [ 110, 182, 106, 178 ],
          [ 106, 178, 110, 174 ], [ 110, 174, 110, 158 ], [ 110, 158, 166, 134 ],
          [ 166, 134, 222, 158 ], [ 222, 158, 222, 174 ], [ 222, 174, 226, 178 ],
          [ 226, 178, 222, 182 ], [ 222, 182, 222, 188 ], [ 222, 188, 230, 188 ],
          [ 230, 188, 234, 184 ], [ 234, 184, 238, 188 ], [ 238, 188, 246, 188 ],
          [ 246, 188, 246, 182 ], [ 246, 182, 242, 178 ], [ 242, 178, 246, 174 ],
          [ 246, 174, 246, 154 ], [ 246, 154, 210, 140 ], [ 210, 140, 226, 124 ],
          [ 226, 124, 206, 124 ], [ 206, 124, 190, 114 ], [ 190, 114, 194, 96 ],
          [ 178, 92, 242, 106 ],  [ 242, 106, 246, 104 ], [ 246, 104, 202, 76 ],
          [ 202, 76, 190, 76 ],   [ 190, 76, 186, 74 ],   [ 186, 74, 182, 76 ],
          [ 182, 76, 150, 76 ],   [ 150, 76, 146, 72 ],   [ 146, 72, 194, 72 ],
          [ 194, 72, 198, 70 ],   [ 198, 70, 182, 62 ],   [ 182, 62, 178, 62 ],
          [ 178, 62, 171, 48 ],   [ 171, 48, 171, 62 ],   [ 171, 62, 163, 62 ],
          [ 163, 62, 163, 48 ],   [ 163, 48, 154, 62 ],   [ 154, 62, 150, 62 ],
          [ 150, 62, 134, 70 ],   [ 134, 70, 138, 72 ],   [ 138, 72, 146, 74 ],
          [ 146, 74, 142, 76 ],   [ 142, 76, 130, 76 ],   [ 130, 76, 94, 94 ],
          [ 94, 94, 94, 110 ],    [ 94, 110, 110, 106 ],  [ 110, 106, 110, 96 ],
          [ 110, 96, 126, 88 ],   [ 126, 88, 130, 88 ],   [ 130, 88, 138, 96 ],
          [ 110, 106, 226, 78 ],  [ 222, 72, 210, 76 ],   [ 210, 76, 210, 82 ],
          [ 210, 82, 222, 84 ],   [ 222, 84, 234, 80 ],   [ 206, 88, 218, 94 ],
          [ 186, 72, 186, 66 ],   [ 186, 66, 174, 72 ],   [ 146, 72, 146, 66 ],
          [ 146, 66, 158, 72 ],   [ 246, 170, 266, 164 ], [ 266, 164, 246, 174 ],
          [ 150, 138, 178, 174 ], [ 178, 174, 222, 174 ], [ 222, 174, 222, 170 ],
          [ 222, 170, 206, 170 ], [ 206, 170, 178, 138 ]
        ]
      },
      {
        COMMENT: 'DAEMON 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_daemon_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
             72, 49,  74, 58,  66, 63,  56, 63,  64, 71,  45, 79,
             45, 89,  47, 91,  45, 93,  45, 96,  49, 96,  51, 94,
             53, 96,  58, 96,  58, 93,  56, 91,  58, 89,  58, 81,
             87, 68, 116, 81, 116, 89, 118, 91, 116, 93, 116, 96,
            120, 96, 123, 94, 125, 96, 129, 96, 129, 93, 127, 91,
            129, 89, 129, 79, 110, 71, 118, 63, 108, 63, 100, 58,
            102, 49
          ],
          [
            93, 47, 127, 54, 129, 53, 106, 39, 100, 39, 97, 38,
            95, 39,  79, 39,  76, 37, 102, 37, 104, 36, 95, 32,
            93, 32,  90, 25,  90, 32,  85, 32,  85, 25, 81, 32,
            79, 32,  70, 36,  72, 37,  76, 38,  74, 39, 68, 39,
            49, 48,  49, 56,  58, 54,  58, 49,  66, 45, 68, 45,
            72, 49
          ],
          [ 129, 87, 139, 84, 129, 89 ],
          [
            79,  70, 93,  89, 116,
            89, 116, 87, 108,  87,
            93,  70
          ]
        ],
        lines: [
          [ 72, 49, 74, 58 ],   [ 74, 58, 66, 63 ],   [ 66, 63, 56, 63 ],
          [ 56, 63, 64, 71 ],   [ 64, 71, 45, 79 ],   [ 45, 79, 45, 89 ],
          [ 45, 89, 47, 91 ],   [ 47, 91, 45, 93 ],   [ 45, 93, 45, 96 ],
          [ 45, 96, 49, 96 ],   [ 49, 96, 51, 94 ],   [ 51, 94, 53, 96 ],
          [ 53, 96, 58, 96 ],   [ 58, 96, 58, 93 ],   [ 58, 93, 56, 91 ],
          [ 56, 91, 58, 89 ],   [ 58, 89, 58, 81 ],   [ 58, 81, 87, 68 ],
          [ 87, 68, 116, 81 ],  [ 116, 81, 116, 89 ], [ 116, 89, 118, 91 ],
          [ 118, 91, 116, 93 ], [ 116, 93, 116, 96 ], [ 116, 96, 120, 96 ],
          [ 120, 96, 123, 94 ], [ 123, 94, 125, 96 ], [ 125, 96, 129, 96 ],
          [ 129, 96, 129, 93 ], [ 129, 93, 127, 91 ], [ 127, 91, 129, 89 ],
          [ 129, 89, 129, 79 ], [ 129, 79, 110, 71 ], [ 110, 71, 118, 63 ],
          [ 118, 63, 108, 63 ], [ 108, 63, 100, 58 ], [ 100, 58, 102, 49 ],
          [ 93, 47, 127, 54 ],  [ 127, 54, 129, 53 ], [ 129, 53, 106, 39 ],
          [ 106, 39, 100, 39 ], [ 100, 39, 97, 38 ],  [ 97, 38, 95, 39 ],
          [ 95, 39, 79, 39 ],   [ 79, 39, 76, 37 ],   [ 76, 37, 102, 37 ],
          [ 102, 37, 104, 36 ], [ 104, 36, 95, 32 ],  [ 95, 32, 93, 32 ],
          [ 93, 32, 90, 25 ],   [ 90, 25, 90, 32 ],   [ 90, 32, 85, 32 ],
          [ 85, 32, 85, 25 ],   [ 85, 25, 81, 32 ],   [ 81, 32, 79, 32 ],
          [ 79, 32, 70, 36 ],   [ 70, 36, 72, 37 ],   [ 72, 37, 76, 38 ],
          [ 76, 38, 74, 39 ],   [ 74, 39, 68, 39 ],   [ 68, 39, 49, 48 ],
          [ 49, 48, 49, 56 ],   [ 49, 56, 58, 54 ],   [ 58, 54, 58, 49 ],
          [ 58, 49, 66, 45 ],   [ 66, 45, 68, 45 ],   [ 68, 45, 72, 49 ],
          [ 58, 54, 118, 40 ],  [ 116, 37, 110, 39 ], [ 110, 39, 110, 42 ],
          [ 110, 42, 116, 43 ], [ 116, 43, 123, 41 ], [ 108, 45, 114, 48 ],
          [ 97, 37, 97, 34 ],   [ 97, 34, 91, 37 ],   [ 76, 37, 76, 34 ],
          [ 76, 34, 83, 37 ],   [ 129, 87, 139, 84 ], [ 139, 84, 129, 89 ],
          [ 79, 70, 93, 89 ],   [ 93, 89, 116, 89 ],  [ 116, 89, 116, 87 ],
          [ 116, 87, 108, 87 ], [ 108, 87, 93, 70 ]
        ]
      },
      {
        COMMENT: 'DAEMON 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_daemon_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            49, 32, 51, 38, 45, 42, 38, 42, 44, 47, 31, 52,
            31, 59, 32, 60, 31, 61, 31, 63, 34, 63, 35, 62,
            36, 63, 39, 63, 39, 61, 38, 60, 39, 59, 39, 53,
            59, 45, 79, 53, 79, 59, 81, 60, 79, 61, 79, 63,
            82, 63, 84, 62, 85, 63, 88, 63, 88, 61, 86, 60,
            88, 59, 88, 52, 75, 47, 81, 42, 74, 42, 68, 38,
            69, 32
          ],
          [
            64, 31, 86, 36, 88, 35, 72, 26, 68, 26, 66, 25,
            65, 26, 54, 26, 52, 24, 69, 24, 71, 24, 65, 21,
            64, 21, 61, 16, 61, 21, 58, 21, 58, 16, 55, 21,
            54, 21, 48, 24, 49, 24, 52, 25, 51, 26, 46, 26,
            34, 32, 34, 37, 39, 36, 39, 32, 45, 30, 46, 30,
            49, 32
          ],
          [ 88, 57, 95, 55, 88, 59 ],
          [
            54, 46, 64, 59, 79,
            59, 79, 57, 74, 57,
            64, 46
          ]
        ],
        lines: [
          [ 49, 32, 51, 38 ], [ 51, 38, 45, 42 ], [ 45, 42, 38, 42 ],
          [ 38, 42, 44, 47 ], [ 44, 47, 31, 52 ], [ 31, 52, 31, 59 ],
          [ 31, 59, 32, 60 ], [ 32, 60, 31, 61 ], [ 31, 61, 31, 63 ],
          [ 31, 63, 34, 63 ], [ 34, 63, 35, 62 ], [ 35, 62, 36, 63 ],
          [ 36, 63, 39, 63 ], [ 39, 63, 39, 61 ], [ 39, 61, 38, 60 ],
          [ 38, 60, 39, 59 ], [ 39, 59, 39, 53 ], [ 39, 53, 59, 45 ],
          [ 59, 45, 79, 53 ], [ 79, 53, 79, 59 ], [ 79, 59, 81, 60 ],
          [ 81, 60, 79, 61 ], [ 79, 61, 79, 63 ], [ 79, 63, 82, 63 ],
          [ 82, 63, 84, 62 ], [ 84, 62, 85, 63 ], [ 85, 63, 88, 63 ],
          [ 88, 63, 88, 61 ], [ 88, 61, 86, 60 ], [ 86, 60, 88, 59 ],
          [ 88, 59, 88, 52 ], [ 88, 52, 75, 47 ], [ 75, 47, 81, 42 ],
          [ 81, 42, 74, 42 ], [ 74, 42, 68, 38 ], [ 68, 38, 69, 32 ],
          [ 64, 31, 86, 36 ], [ 86, 36, 88, 35 ], [ 88, 35, 72, 26 ],
          [ 72, 26, 68, 26 ], [ 68, 26, 66, 25 ], [ 66, 25, 65, 26 ],
          [ 65, 26, 54, 26 ], [ 54, 26, 52, 24 ], [ 52, 24, 69, 24 ],
          [ 69, 24, 71, 24 ], [ 71, 24, 65, 21 ], [ 65, 21, 64, 21 ],
          [ 64, 21, 61, 16 ], [ 61, 16, 61, 21 ], [ 61, 21, 58, 21 ],
          [ 58, 21, 58, 16 ], [ 58, 16, 55, 21 ], [ 55, 21, 54, 21 ],
          [ 54, 21, 48, 24 ], [ 48, 24, 49, 24 ], [ 49, 24, 52, 25 ],
          [ 52, 25, 51, 26 ], [ 51, 26, 46, 26 ], [ 46, 26, 34, 32 ],
          [ 34, 32, 34, 37 ], [ 34, 37, 39, 36 ], [ 39, 36, 39, 32 ],
          [ 39, 32, 45, 30 ], [ 45, 30, 46, 30 ], [ 46, 30, 49, 32 ],
          [ 39, 36, 81, 26 ], [ 79, 24, 75, 26 ], [ 75, 26, 75, 28 ],
          [ 75, 28, 79, 28 ], [ 79, 28, 84, 27 ], [ 74, 30, 78, 32 ],
          [ 66, 24, 66, 22 ], [ 66, 22, 62, 24 ], [ 52, 24, 52, 22 ],
          [ 52, 22, 56, 24 ], [ 88, 57, 95, 55 ], [ 95, 55, 88, 59 ],
          [ 54, 46, 64, 59 ], [ 64, 59, 79, 59 ], [ 79, 59, 79, 57 ],
          [ 79, 57, 74, 57 ], [ 74, 57, 64, 46 ]
        ]
      },
      {
        COMMENT: 'DAEMON 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_daemon_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            36, 23, 37, 28, 33, 30, 28, 30, 32, 34, 23, 37,
            23, 42, 24, 43, 23, 44, 23, 46, 25, 46, 26, 45,
            27, 46, 29, 46, 29, 44, 28, 43, 29, 42, 29, 38,
            43, 32, 58, 38, 58, 42, 59, 43, 58, 44, 58, 46,
            60, 46, 61, 45, 62, 46, 64, 46, 64, 44, 63, 43,
            64, 42, 64, 37, 55, 34, 59, 30, 54, 30, 50, 28,
            51, 23
          ],
          [
            47, 22, 63, 26, 64, 25, 53, 18, 50, 18, 49, 18,
            48, 18, 39, 18, 38, 17, 51, 17, 52, 17, 48, 15,
            47, 15, 45, 12, 45, 15, 43, 15, 43, 12, 40, 15,
            39, 15, 35, 17, 36, 17, 38, 18, 37, 18, 34, 18,
            25, 23, 25, 27, 29, 26, 29, 23, 33, 21, 34, 21,
            36, 23
          ],
          [ 64, 41, 70, 40, 64, 42 ],
          [
            39, 33, 47, 42, 58,
            42, 58, 41, 54, 41,
            47, 33
          ]
        ],
        lines: [
          [ 36, 23, 37, 28 ], [ 37, 28, 33, 30 ], [ 33, 30, 28, 30 ],
          [ 28, 30, 32, 34 ], [ 32, 34, 23, 37 ], [ 23, 37, 23, 42 ],
          [ 23, 42, 24, 43 ], [ 24, 43, 23, 44 ], [ 23, 44, 23, 46 ],
          [ 23, 46, 25, 46 ], [ 25, 46, 26, 45 ], [ 26, 45, 27, 46 ],
          [ 27, 46, 29, 46 ], [ 29, 46, 29, 44 ], [ 29, 44, 28, 43 ],
          [ 28, 43, 29, 42 ], [ 29, 42, 29, 38 ], [ 29, 38, 43, 32 ],
          [ 43, 32, 58, 38 ], [ 58, 38, 58, 42 ], [ 58, 42, 59, 43 ],
          [ 59, 43, 58, 44 ], [ 58, 44, 58, 46 ], [ 58, 46, 60, 46 ],
          [ 60, 46, 61, 45 ], [ 61, 45, 62, 46 ], [ 62, 46, 64, 46 ],
          [ 64, 46, 64, 44 ], [ 64, 44, 63, 43 ], [ 63, 43, 64, 42 ],
          [ 64, 42, 64, 37 ], [ 64, 37, 55, 34 ], [ 55, 34, 59, 30 ],
          [ 59, 30, 54, 30 ], [ 54, 30, 50, 28 ], [ 50, 28, 51, 23 ],
          [ 47, 22, 63, 26 ], [ 63, 26, 64, 25 ], [ 64, 25, 53, 18 ],
          [ 53, 18, 50, 18 ], [ 50, 18, 49, 18 ], [ 49, 18, 48, 18 ],
          [ 48, 18, 39, 18 ], [ 39, 18, 38, 17 ], [ 38, 17, 51, 17 ],
          [ 51, 17, 52, 17 ], [ 52, 17, 48, 15 ], [ 48, 15, 47, 15 ],
          [ 47, 15, 45, 12 ], [ 45, 12, 45, 15 ], [ 45, 15, 43, 15 ],
          [ 43, 15, 43, 12 ], [ 43, 12, 40, 15 ], [ 40, 15, 39, 15 ],
          [ 39, 15, 35, 17 ], [ 35, 17, 36, 17 ], [ 36, 17, 38, 18 ],
          [ 38, 18, 37, 18 ], [ 37, 18, 34, 18 ], [ 34, 18, 25, 23 ],
          [ 25, 23, 25, 27 ], [ 25, 27, 29, 26 ], [ 29, 26, 29, 23 ],
          [ 29, 23, 33, 21 ], [ 33, 21, 34, 21 ], [ 34, 21, 36, 23 ],
          [ 29, 26, 59, 19 ], [ 58, 17, 55, 18 ], [ 55, 18, 55, 20 ],
          [ 55, 20, 58, 20 ], [ 58, 20, 61, 19 ], [ 54, 21, 57, 23 ],
          [ 49, 17, 49, 16 ], [ 49, 16, 46, 17 ], [ 38, 17, 38, 16 ],
          [ 38, 16, 41, 17 ], [ 64, 41, 70, 40 ], [ 70, 40, 64, 42 ],
          [ 39, 33, 47, 42 ], [ 47, 42, 58, 42 ], [ 58, 42, 58, 41 ],
          [ 58, 41, 54, 41 ], [ 54, 41, 47, 33 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering gremlins in the dungeon. */
  this._gremlins = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'GREMLIN 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_gremlin_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            177, 168, 157, 168,
            166, 158, 186, 148,
            177, 158
          ],
          [
            177, 168, 181, 176,
            177, 182, 157, 182,
            153, 176, 157, 168
          ]
        ],
        lines: [
          [ 177, 168, 157, 168 ],
          [ 157, 168, 166, 158 ],
          [ 166, 158, 186, 148 ],
          [ 186, 148, 177, 158 ],
          [ 177, 158, 177, 168 ],
          [ 177, 168, 181, 176 ],
          [ 181, 176, 177, 182 ],
          [ 177, 182, 157, 182 ],
          [ 157, 182, 153, 176 ],
          [ 153, 176, 157, 168 ],
          [ 171, 182, 177, 188 ],
          [ 177, 188, 182, 188 ],
          [ 163, 182, 157, 188 ],
          [ 157, 188, 150, 188 ],
          [ 173, 172, 171, 172 ],
          [ 161, 172, 163, 172 ],
          [ 173, 178, 161, 178 ]
        ]
      },
      {
        COMMENT: 'GREMLIN 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_gremlin_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
            93, 86, 82, 86, 87,
            81, 97, 76, 93, 81
          ],
          [
            93, 86, 95, 90, 93,
            93, 82, 93, 80, 90,
            82, 86
          ]
        ],
        lines: [
          [ 93, 86, 82, 86 ], [ 82, 86, 87, 81 ],
          [ 87, 81, 97, 76 ], [ 97, 76, 93, 81 ],
          [ 93, 81, 93, 86 ], [ 93, 86, 95, 90 ],
          [ 95, 90, 93, 93 ], [ 93, 93, 82, 93 ],
          [ 82, 93, 80, 90 ], [ 80, 90, 82, 86 ],
          [ 90, 93, 93, 96 ], [ 93, 96, 95, 96 ],
          [ 85, 93, 82, 96 ], [ 82, 96, 79, 96 ],
          [ 91, 88, 90, 88 ], [ 84, 88, 85, 88 ],
          [ 91, 91, 84, 91 ]
        ]
      },
      {
        COMMENT: 'GREMLIN 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_gremlin_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            63, 57, 56, 57, 59,
            53, 66, 50, 63, 53
          ],
          [
            63, 57, 65, 59, 63,
            61, 56, 61, 55, 59,
            56, 57
          ]
        ],
        lines: [
          [ 63, 57, 56, 57 ], [ 56, 57, 59, 53 ],
          [ 59, 53, 66, 50 ], [ 66, 50, 63, 53 ],
          [ 63, 53, 63, 57 ], [ 63, 57, 65, 59 ],
          [ 65, 59, 63, 61 ], [ 63, 61, 56, 61 ],
          [ 56, 61, 55, 59 ], [ 55, 59, 56, 57 ],
          [ 61, 61, 63, 63 ], [ 63, 63, 65, 63 ],
          [ 58, 61, 56, 63 ], [ 56, 63, 54, 63 ],
          [ 62, 58, 61, 58 ], [ 58, 58, 58, 58 ],
          [ 62, 60, 58, 60 ]
        ]
      },
      {
        COMMENT: 'GREMLIN 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_gremlin_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            46, 41, 41, 41, 43,
            38, 49, 36, 46, 38
          ],
          [
            46, 41, 47, 43, 46,
            44, 41, 44, 40, 43,
            41, 41
          ]
        ],
        lines: [
          [ 46, 41, 41, 41 ], [ 41, 41, 43, 38 ],
          [ 43, 38, 49, 36 ], [ 49, 36, 46, 38 ],
          [ 46, 38, 46, 41 ], [ 46, 41, 47, 43 ],
          [ 47, 43, 46, 44 ], [ 46, 44, 41, 44 ],
          [ 41, 44, 40, 43 ], [ 40, 43, 41, 41 ],
          [ 45, 44, 46, 46 ], [ 46, 46, 48, 46 ],
          [ 43, 44, 41, 46 ], [ 41, 46, 39, 46 ],
          [ 45, 42, 45, 42 ], [ 42, 42, 43, 42 ],
          [ 45, 43, 42, 43 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());
  /** @private The utility class for rendering mimics in the dungeon. */
  this._mimics = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'MIMIC 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_mimic_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            146, 188, 146,
            168, 186, 168,
            186, 188
          ],
          [
            146, 168, 156, 158,
            196, 158, 196, 178,
            186, 188
          ]
        ],
        lines: [
          [ 146, 188, 146, 168 ],
          [ 146, 168, 186, 168 ],
          [ 186, 168, 186, 188 ],
          [ 186, 188, 146, 188 ],
          [ 146, 168, 156, 158 ],
          [ 156, 158, 196, 158 ],
          [ 196, 158, 196, 178 ],
          [ 196, 178, 186, 188 ],
          [ 186, 168, 196, 158 ]
        ]
      },
      {
        COMMENT: 'MIMIC 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_mimic_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
            76, 96, 76, 86,
            97, 86, 97, 96
          ],
          [
            76,  86, 82, 81, 103,
            81, 103, 91, 97,  96
          ]
        ],
        lines: [
          [ 76, 96, 76, 86 ],
          [ 76, 86, 97, 86 ],
          [ 97, 86, 97, 96 ],
          [ 97, 96, 76, 96 ],
          [ 76, 86, 82, 81 ],
          [ 82, 81, 103, 81 ],
          [ 103, 81, 103, 91 ],
          [ 103, 91, 97, 96 ],
          [ 97, 86, 103, 81 ]
        ]
      },
      {
        COMMENT: 'MIMIC 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_mimic_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            52, 63, 52, 57,
            66, 57, 66, 63
          ],
          [
            52, 57, 56, 53, 70,
            53, 70, 60, 66, 63
          ]
        ],
        lines: [
          [ 52, 63, 52, 57 ],
          [ 52, 57, 66, 57 ],
          [ 66, 57, 66, 63 ],
          [ 66, 63, 52, 63 ],
          [ 52, 57, 56, 53 ],
          [ 56, 53, 70, 53 ],
          [ 70, 53, 70, 60 ],
          [ 70, 60, 66, 63 ],
          [ 66, 57, 70, 53 ]
        ]
      },
      {
        COMMENT: 'MIMIC 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_mimic_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            38, 46, 38, 41,
            49, 41, 49, 46
          ],
          [
            38, 41, 41, 38, 51,
            38, 51, 43, 49, 46
          ]
        ],
        lines: [
          [ 38, 46, 38, 41 ],
          [ 38, 41, 49, 41 ],
          [ 49, 41, 49, 46 ],
          [ 49, 46, 38, 46 ],
          [ 38, 41, 41, 38 ],
          [ 41, 38, 51, 38 ],
          [ 51, 38, 51, 43 ],
          [ 51, 43, 49, 46 ],
          [ 49, 41, 51, 38 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());;
  /** @private The utility class for rendering orcs in the dungeon.
singleton */
  this._orcs = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'ORC 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_orc_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            166, 188, 136, 188, 150, 172, 150, 158, 136,
            142, 136, 158, 120, 142, 120,  98, 136,  82,
            150,  82, 136,  52, 150,  38, 166,  38, 182,
             38, 196,  52, 182,  82, 196,  82, 212,  98,
            212, 142, 196, 158, 196, 142, 182, 158, 182,
            172, 196, 188
          ]
        ],
        lines: [
          [ 166, 188, 136, 188 ], [ 136, 188, 150, 172 ],
          [ 150, 172, 150, 158 ], [ 150, 158, 136, 142 ],
          [ 136, 142, 136, 158 ], [ 136, 158, 120, 142 ],
          [ 120, 142, 120, 98 ],  [ 120, 98, 136, 82 ],
          [ 136, 82, 150, 82 ],   [ 150, 82, 136, 52 ],
          [ 136, 52, 150, 38 ],   [ 150, 38, 166, 38 ],
          [ 166, 188, 196, 188 ], [ 196, 188, 182, 172 ],
          [ 182, 172, 182, 158 ], [ 182, 158, 196, 142 ],
          [ 196, 142, 196, 158 ], [ 196, 158, 212, 142 ],
          [ 212, 142, 212, 98 ],  [ 212, 98, 196, 82 ],
          [ 196, 82, 182, 82 ],   [ 182, 82, 196, 52 ],
          [ 196, 52, 182, 38 ],   [ 182, 38, 166, 38 ],
          [ 136, 52, 196, 52 ],   [ 150, 82, 182, 82 ],
          [ 120, 158, 182, 98 ],  [ 150, 52, 166, 68 ],
          [ 166, 68, 182, 52 ],   [ 182, 52, 182, 68 ],
          [ 182, 68, 150, 68 ],   [ 150, 68, 150, 52 ],
          [ 166, 112, 150, 112 ], [ 150, 112, 182, 82 ],
          [ 182, 82, 182, 98 ],   [ 182, 98, 196, 98 ],
          [ 196, 98, 166, 128 ],  [ 166, 128, 166, 112 ]
        ]
      },
      {
        COMMENT: 'ORC 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_orc_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
            87,  96,  71,  96, 79,  88,  79,  81, 71, 72,  71,
            81,  63,  72,  63, 50,  71,  42,  79, 42, 71,  27,
            79,  19,  87,  19, 95,  19, 103,  27, 95, 42, 103,
            42, 111,  50, 111, 72, 103,  81, 103, 72, 95,  81,
            95,  88, 103,  96
          ]
        ],
        lines: [
          [ 87, 96, 71, 96 ],   [ 71, 96, 79, 88 ],
          [ 79, 88, 79, 81 ],   [ 79, 81, 71, 72 ],
          [ 71, 72, 71, 81 ],   [ 71, 81, 63, 72 ],
          [ 63, 72, 63, 50 ],   [ 63, 50, 71, 42 ],
          [ 71, 42, 79, 42 ],   [ 79, 42, 71, 27 ],
          [ 71, 27, 79, 19 ],   [ 79, 19, 87, 19 ],
          [ 87, 96, 103, 96 ],  [ 103, 96, 95, 88 ],
          [ 95, 88, 95, 81 ],   [ 95, 81, 103, 72 ],
          [ 103, 72, 103, 81 ], [ 103, 81, 111, 72 ],
          [ 111, 72, 111, 50 ], [ 111, 50, 103, 42 ],
          [ 103, 42, 95, 42 ],  [ 95, 42, 103, 27 ],
          [ 103, 27, 95, 19 ],  [ 95, 19, 87, 19 ],
          [ 71, 27, 103, 27 ],  [ 79, 42, 95, 42 ],
          [ 63, 81, 95, 50 ],   [ 79, 27, 87, 35 ],
          [ 87, 35, 95, 27 ],   [ 95, 27, 95, 35 ],
          [ 95, 35, 79, 35 ],   [ 79, 35, 79, 27 ],
          [ 87, 57, 79, 57 ],   [ 79, 57, 95, 42 ],
          [ 95, 42, 95, 50 ],   [ 95, 50, 103, 50 ],
          [ 103, 50, 87, 65 ],  [ 87, 65, 87, 57 ]
        ]
      },
      {
        COMMENT: 'ORC 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_orc_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            59, 63, 49, 63, 54, 58, 54, 53, 49, 48, 49,
            53, 43, 48, 43, 33, 49, 28, 54, 28, 49, 18,
            54, 13, 59, 13, 65, 13, 70, 18, 65, 28, 70,
            28, 76, 33, 76, 48, 70, 53, 70, 48, 65, 53,
            65, 58, 70, 63
          ]
        ],
        lines: [
          [ 59, 63, 49, 63 ], [ 49, 63, 54, 58 ],
          [ 54, 58, 54, 53 ], [ 54, 53, 49, 48 ],
          [ 49, 48, 49, 53 ], [ 49, 53, 43, 48 ],
          [ 43, 48, 43, 33 ], [ 43, 33, 49, 28 ],
          [ 49, 28, 54, 28 ], [ 54, 28, 49, 18 ],
          [ 49, 18, 54, 13 ], [ 54, 13, 59, 13 ],
          [ 59, 63, 70, 63 ], [ 70, 63, 65, 58 ],
          [ 65, 58, 65, 53 ], [ 65, 53, 70, 48 ],
          [ 70, 48, 70, 53 ], [ 70, 53, 76, 48 ],
          [ 76, 48, 76, 33 ], [ 76, 33, 70, 28 ],
          [ 70, 28, 65, 28 ], [ 65, 28, 70, 18 ],
          [ 70, 18, 65, 13 ], [ 65, 13, 59, 13 ],
          [ 49, 18, 70, 18 ], [ 54, 28, 65, 28 ],
          [ 43, 53, 65, 33 ], [ 54, 18, 59, 23 ],
          [ 59, 23, 65, 18 ], [ 65, 18, 65, 23 ],
          [ 65, 23, 54, 23 ], [ 54, 23, 54, 18 ],
          [ 59, 38, 54, 38 ], [ 54, 38, 65, 28 ],
          [ 65, 28, 65, 33 ], [ 65, 33, 70, 33 ],
          [ 70, 33, 59, 43 ], [ 59, 43, 59, 38 ]
        ]
      },
      {
        COMMENT: 'ORC 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_orc_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            43, 46, 36, 46, 39, 42, 39, 38, 36, 34, 36,
            38, 31, 34, 31, 24, 36, 20, 39, 20, 36, 13,
            39,  9, 43,  9, 48,  9, 51, 13, 48, 20, 51,
            20, 56, 24, 56, 34, 51, 38, 51, 34, 48, 38,
            48, 42, 51, 46
          ]
        ],
        lines: [
          [ 43, 46, 36, 46 ], [ 36, 46, 39, 42 ],
          [ 39, 42, 39, 38 ], [ 39, 38, 36, 34 ],
          [ 36, 34, 36, 38 ], [ 36, 38, 31, 34 ],
          [ 31, 34, 31, 24 ], [ 31, 24, 36, 20 ],
          [ 36, 20, 39, 20 ], [ 39, 20, 36, 13 ],
          [ 36, 13, 39, 9 ],  [ 39, 9, 43, 9 ],
          [ 43, 46, 51, 46 ], [ 51, 46, 48, 42 ],
          [ 48, 42, 48, 38 ], [ 48, 38, 51, 34 ],
          [ 51, 34, 51, 38 ], [ 51, 38, 56, 34 ],
          [ 56, 34, 56, 24 ], [ 56, 24, 51, 20 ],
          [ 51, 20, 48, 20 ], [ 48, 20, 51, 13 ],
          [ 51, 13, 48, 9 ],  [ 48, 9, 43, 9 ],
          [ 36, 13, 51, 13 ], [ 39, 20, 48, 20 ],
          [ 31, 38, 48, 24 ], [ 39, 13, 43, 16 ],
          [ 43, 16, 48, 13 ], [ 48, 13, 48, 16 ],
          [ 48, 16, 39, 16 ], [ 39, 16, 39, 13 ],
          [ 43, 27, 39, 27 ], [ 39, 27, 48, 20 ],
          [ 48, 20, 48, 24 ], [ 48, 24, 51, 24 ],
          [ 51, 24, 43, 31 ], [ 43, 31, 43, 27 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());;
  /** @private The utility class for rendering rats in the dungeon.
singleton */
  this._rats = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'RAT 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_rat_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            176, 128, 166, 138,
            156, 128, 136, 178,
            146, 188, 186, 188,
            196, 178
          ],
          [ 206, 178, 186, 188, 196, 178 ],
          [
            176, 128, 186, 108,
            173, 118, 161, 118,
            146, 108, 156, 128,
            166, 138
          ]
        ],
        lines: [
          [ 176, 128, 166, 138 ], [ 166, 138, 156, 128 ],
          [ 156, 128, 136, 178 ], [ 136, 178, 146, 188 ],
          [ 146, 188, 186, 188 ], [ 186, 188, 196, 178 ],
          [ 196, 178, 176, 128 ], [ 196, 178, 206, 178 ],
          [ 206, 178, 186, 188 ], [ 176, 128, 186, 108 ],
          [ 186, 108, 173, 118 ], [ 173, 118, 161, 118 ],
          [ 161, 118, 146, 108 ], [ 146, 108, 156, 128 ],
          [ 156, 122, 161, 128 ], [ 176, 122, 173, 128 ],
          [ 156, 148, 156, 158 ], [ 176, 148, 176, 158 ],
          [ 152, 148, 152, 158 ], [ 180, 148, 180, 158 ]
        ]
      },
      {
        COMMENT: 'RAT 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_rat_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
             92, 65, 87, 70, 82, 65,
             71, 91, 76, 96, 97, 96,
            103, 91
          ],
          [ 108, 91, 97, 96, 103, 91 ],
          [
            92, 65, 97, 55, 91, 60,
            84, 60, 76, 55, 82, 65,
            87, 70
          ]
        ],
        lines: [
          [ 92, 65, 87, 70 ],  [ 87, 70, 82, 65 ],
          [ 82, 65, 71, 91 ],  [ 71, 91, 76, 96 ],
          [ 76, 96, 97, 96 ],  [ 97, 96, 103, 91 ],
          [ 103, 91, 92, 65 ], [ 103, 91, 108, 91 ],
          [ 108, 91, 97, 96 ], [ 92, 65, 97, 55 ],
          [ 97, 55, 91, 60 ],  [ 91, 60, 84, 60 ],
          [ 84, 60, 76, 55 ],  [ 76, 55, 82, 65 ],
          [ 82, 62, 84, 65 ],  [ 92, 62, 91, 65 ],
          [ 82, 76, 82, 81 ],  [ 92, 76, 92, 81 ],
          [ 80, 76, 80, 81 ],  [ 94, 76, 94, 81 ]
        ]
      },
      {
        COMMENT: 'RAT 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_rat_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            63, 43, 59, 46, 56, 43,
            49, 60, 52, 63, 66, 63,
            70, 60
          ],
          [ 74, 60, 66, 63, 70, 60 ],
          [
            63, 43, 66, 36, 62, 40,
            58, 40, 52, 36, 56, 43,
            59, 46
          ]
        ],
        lines: [
          [ 63, 43, 59, 46 ], [ 59, 46, 56, 43 ],
          [ 56, 43, 49, 60 ], [ 49, 60, 52, 63 ],
          [ 52, 63, 66, 63 ], [ 66, 63, 70, 60 ],
          [ 70, 60, 63, 43 ], [ 70, 60, 74, 60 ],
          [ 74, 60, 66, 63 ], [ 63, 43, 66, 36 ],
          [ 66, 36, 62, 40 ], [ 62, 40, 58, 40 ],
          [ 58, 40, 52, 36 ], [ 52, 36, 56, 43 ],
          [ 56, 41, 58, 43 ], [ 63, 41, 62, 43 ],
          [ 56, 50, 56, 53 ], [ 63, 50, 63, 53 ],
          [ 54, 50, 54, 53 ], [ 64, 50, 64, 53 ]
        ]
      },
      {
        COMMENT: 'RAT 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_rat_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            46, 31, 43, 33, 41, 31,
            36, 43, 38, 46, 49, 46,
            51, 43
          ],
          [ 54, 43, 49, 46, 51, 43 ],
          [
            46, 31, 49, 26, 45, 29,
            42, 29, 38, 26, 41, 31,
            43, 33
          ]
        ],
        lines: [
          [ 46, 31, 43, 33 ], [ 43, 33, 41, 31 ],
          [ 41, 31, 36, 43 ], [ 36, 43, 38, 46 ],
          [ 38, 46, 49, 46 ], [ 49, 46, 51, 43 ],
          [ 51, 43, 46, 31 ], [ 51, 43, 54, 43 ],
          [ 54, 43, 49, 46 ], [ 46, 31, 49, 26 ],
          [ 49, 26, 45, 29 ], [ 45, 29, 42, 29 ],
          [ 42, 29, 38, 26 ], [ 38, 26, 41, 31 ],
          [ 41, 30, 42, 31 ], [ 46, 30, 45, 31 ],
          [ 41, 36, 41, 38 ], [ 46, 36, 46, 38 ],
          [ 40, 36, 40, 38 ], [ 47, 36, 47, 38 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());;
  /** @private The utility class for rendering skeletons in the dungeon. */
  this._skeletons = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'SKELETON 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_skeleton_4',
          height: 190,
          width: 336
        },
        polygon: [
          154,  28, 150,  38, 154,
           58, 178,  58, 182,  38,
          178,  28
        ],
        lines: [
          [ 120, 188, 136, 188 ], [ 136, 188, 136, 158 ],
          [ 136, 158, 150, 128 ], [ 150, 128, 182, 128 ],
          [ 182, 128, 196, 158 ], [ 196, 158, 196, 188 ],
          [ 196, 188, 212, 188 ], [ 166, 136, 166, 58 ],
          [ 162, 112, 170, 112 ], [ 160, 98, 172, 98 ],
          [ 158, 82, 174, 82 ],   [ 120, 76, 106, 82 ],
          [ 106, 82, 120, 98 ],   [ 120, 98, 120, 82 ],
          [ 120, 82, 150, 112 ],  [ 136, 98, 150, 68 ],
          [ 150, 68, 182, 68 ],   [ 182, 68, 196, 98 ],
          [ 196, 104, 196, 74 ],  [ 190, 98, 206, 98 ],
          [ 166, 38, 154, 28 ],   [ 154, 28, 150, 38 ],
          [ 150, 38, 154, 58 ],   [ 154, 58, 178, 58 ],
          [ 178, 58, 178, 52 ],   [ 178, 52, 154, 52 ],
          [ 154, 52, 154, 58 ],   [ 178, 58, 182, 38 ],
          [ 182, 38, 178, 28 ],   [ 154, 28, 178, 28 ],
          [ 156, 44, 154, 44 ],   [ 176, 44, 178, 44 ]
        ]
      },
      {
        COMMENT: 'SKELETON 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_skeleton_8',
          height: 97,
          width: 176
        },
        polygon: [
          81, 14, 79, 19, 81,
          30, 93, 30, 95, 19,
          93, 14
        ],
        lines: [
          [ 63, 96, 71, 96 ],   [ 71, 96, 71, 81 ],
          [ 71, 81, 79, 65 ],   [ 79, 65, 95, 65 ],
          [ 95, 65, 103, 81 ],  [ 103, 81, 103, 96 ],
          [ 103, 96, 111, 96 ], [ 87, 69, 87, 30 ],
          [ 85, 57, 89, 57 ],   [ 84, 50, 90, 50 ],
          [ 83, 42, 91, 42 ],   [ 63, 39, 56, 42 ],
          [ 56, 42, 63, 50 ],   [ 63, 50, 63, 42 ],
          [ 63, 42, 79, 57 ],   [ 71, 50, 79, 35 ],
          [ 79, 35, 95, 35 ],   [ 95, 35, 103, 50 ],
          [ 103, 53, 103, 38 ], [ 100, 50, 108, 50 ],
          [ 87, 19, 81, 14 ],   [ 81, 14, 79, 19 ],
          [ 79, 19, 81, 30 ],   [ 81, 30, 93, 30 ],
          [ 93, 30, 93, 27 ],   [ 93, 27, 81, 27 ],
          [ 81, 27, 81, 30 ],   [ 93, 30, 95, 19 ],
          [ 95, 19, 93, 14 ],   [ 81, 14, 93, 14 ],
          [ 82, 22, 81, 22 ],   [ 92, 22, 93, 22 ]
        ]
      },
      {
        COMMENT: 'SKELETON 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_skeleton_14',
          height: 64,
          width: 120
        },
        polygon: [
          55,  9, 54, 13, 55,
          20, 64, 20, 65, 13,
          64,  9
        ],
        lines: [
          [ 43, 63, 49, 63 ], [ 49, 63, 49, 53 ],
          [ 49, 53, 54, 43 ], [ 54, 43, 65, 43 ],
          [ 65, 43, 70, 53 ], [ 70, 53, 70, 63 ],
          [ 70, 63, 76, 63 ], [ 59, 46, 59, 20 ],
          [ 58, 38, 61, 38 ], [ 57, 33, 61, 33 ],
          [ 56, 28, 62, 28 ], [ 43, 26, 38, 28 ],
          [ 38, 28, 43, 33 ], [ 43, 33, 43, 28 ],
          [ 43, 28, 54, 38 ], [ 49, 33, 54, 23 ],
          [ 54, 23, 65, 23 ], [ 65, 23, 70, 33 ],
          [ 70, 35, 70, 25 ], [ 68, 33, 74, 33 ],
          [ 59, 13, 55, 9 ],  [ 55, 9, 54, 13 ],
          [ 54, 13, 55, 20 ], [ 55, 20, 64, 20 ],
          [ 64, 20, 64, 18 ], [ 64, 18, 55, 18 ],
          [ 55, 18, 55, 20 ], [ 64, 20, 65, 13 ],
          [ 65, 13, 64, 9 ],  [ 55, 9, 64, 9 ],
          [ 56, 15, 55, 15 ], [ 63, 15, 64, 15 ]
        ]
      },
      {
        COMMENT: 'SKELETON 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_skeleton_22',
          height: 46,
          width: 88
        },
        polygon: [
          40,  7, 39,  9, 40,
          14, 47, 14, 48,  9,
          47,  7
        ],
        lines: [
          [ 31, 46, 36, 46 ], [ 36, 46, 36, 38 ],
          [ 36, 38, 39, 31 ], [ 39, 31, 48, 31 ],
          [ 48, 31, 51, 38 ], [ 51, 38, 51, 46 ],
          [ 51, 46, 56, 46 ], [ 43, 33, 43, 14 ],
          [ 42, 27, 45, 27 ], [ 42, 24, 45, 24 ],
          [ 41, 20, 46, 20 ], [ 31, 18, 28, 20 ],
          [ 28, 20, 31, 24 ], [ 31, 24, 31, 20 ],
          [ 31, 20, 39, 27 ], [ 36, 24, 39, 16 ],
          [ 39, 16, 48, 16 ], [ 48, 16, 51, 24 ],
          [ 51, 25, 51, 18 ], [ 50, 24, 54, 24 ],
          [ 43, 9, 40, 7 ],   [ 40, 7, 39, 9 ],
          [ 39, 9, 40, 14 ],  [ 40, 14, 47, 14 ],
          [ 47, 14, 47, 13 ], [ 47, 13, 40, 13 ],
          [ 40, 13, 40, 14 ], [ 47, 14, 48, 9 ],
          [ 48, 9, 47, 7 ],   [ 40, 7, 47, 7 ],
          [ 41, 11, 40, 11 ], [ 46, 11, 47, 11 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());;
  /** @private The utility class for rendering thieves in the dungeon. */
  this._thieves = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'THIEF 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_thief_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            166,  76, 166, 172,
            186, 188, 226, 188,
            226,  98
          ],
          [
            166,  76, 146,  60,
            106,  98, 106, 188,
            146, 188, 166, 172
          ],
          [
            146, 60, 146, 38,
            166, 22, 186, 38,
            186, 60
          ]
        ],
        lines: [
          [ 166, 76, 166, 172 ],  [ 166, 172, 186, 188 ],
          [ 186, 188, 226, 188 ], [ 226, 188, 226, 98 ],
          [ 226, 98, 186, 60 ],   [ 186, 60, 166, 76 ],
          [ 166, 76, 146, 60 ],   [ 146, 60, 106, 98 ],
          [ 106, 98, 106, 188 ],  [ 106, 188, 146, 188 ],
          [ 146, 188, 166, 172 ], [ 146, 60, 146, 38 ],
          [ 146, 38, 166, 22 ],   [ 166, 22, 186, 38 ],
          [ 186, 38, 186, 60 ],   [ 186, 38, 166, 30 ],
          [ 166, 30, 146, 38 ],   [ 146, 38, 166, 68 ],
          [ 166, 68, 186, 38 ]
        ]
      },
      {
        COMMENT: 'THIEF 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_thief_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
            87,  39, 87,  88, 97,
            96, 118, 96, 118, 50
          ],
          [
            87, 39, 76, 31, 56,
            50, 56, 96, 76, 96,
            87, 88
          ],
          [
            76, 31, 76, 19, 87,
            11, 97, 19, 97, 31
          ]
        ],
        lines: [
          [ 87, 39, 87, 88 ],  [ 87, 88, 97, 96 ],
          [ 97, 96, 118, 96 ], [ 118, 96, 118, 50 ],
          [ 118, 50, 97, 31 ], [ 97, 31, 87, 39 ],
          [ 87, 39, 76, 31 ],  [ 76, 31, 56, 50 ],
          [ 56, 50, 56, 96 ],  [ 56, 96, 76, 96 ],
          [ 76, 96, 87, 88 ],  [ 76, 31, 76, 19 ],
          [ 76, 19, 87, 11 ],  [ 87, 11, 97, 19 ],
          [ 97, 19, 97, 31 ],  [ 97, 19, 87, 15 ],
          [ 87, 15, 76, 19 ],  [ 76, 19, 87, 35 ],
          [ 87, 35, 97, 19 ]
        ]
      },
      {
        COMMENT: 'THIEF 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_thief_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            59, 26, 59, 58, 66,
            63, 81, 63, 81, 33
          ],
          [
            59, 26, 52, 20, 38,
            33, 38, 63, 52, 63,
            59, 58
          ],
          [
            52, 20, 52, 13, 59,
             7, 66, 13, 66, 20
          ]
        ],
        lines: [
          [ 59, 26, 59, 58 ], [ 59, 58, 66, 63 ],
          [ 66, 63, 81, 63 ], [ 81, 63, 81, 33 ],
          [ 81, 33, 66, 20 ], [ 66, 20, 59, 26 ],
          [ 59, 26, 52, 20 ], [ 52, 20, 38, 33 ],
          [ 38, 33, 38, 63 ], [ 38, 63, 52, 63 ],
          [ 52, 63, 59, 58 ], [ 52, 20, 52, 13 ],
          [ 52, 13, 59, 7 ],  [ 59, 7, 66, 13 ],
          [ 66, 13, 66, 20 ], [ 66, 13, 59, 10 ],
          [ 59, 10, 52, 13 ], [ 52, 13, 59, 23 ],
          [ 59, 23, 66, 13 ]
        ]
      },
      {
        COMMENT: 'THIEF 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_thief_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            43, 18, 43, 42, 49,
            46, 59, 46, 59, 24
          ],
          [
            43, 18, 38, 15, 28,
            24, 28, 46, 38, 46,
            43, 42
          ],
          [
            38, 15, 38,  9, 43,
             5, 49,  9, 49, 15
          ]
        ],
        lines: [
          [ 43, 18, 43, 42 ], [ 43, 42, 49, 46 ],
          [ 49, 46, 59, 46 ], [ 59, 46, 59, 24 ],
          [ 59, 24, 49, 15 ], [ 49, 15, 43, 18 ],
          [ 43, 18, 38, 15 ], [ 38, 15, 28, 24 ],
          [ 28, 24, 28, 46 ], [ 28, 46, 38, 46 ],
          [ 38, 46, 43, 42 ], [ 38, 15, 38, 9 ],
          [ 38, 9, 43, 5 ],   [ 43, 5, 49, 9 ],
          [ 49, 9, 49, 15 ],  [ 49, 9, 43, 7 ],
          [ 43, 7, 38, 9 ],   [ 38, 9, 43, 16 ],
          [ 43, 16, 49, 9 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());;
  /** @private The utility class for rendering vipers in the dungeon. */
  this._vipers = (function() {
    let _dictionary = {};
    let _textureData = [
      {
        COMMENT: 'VIPER 4',
        texture: {
          position: 4,
          edge: 'closed',
          key: 'akalabeth_viper_4',
          height: 190,
          width: 336
        },
        polygon: [
          [
            146, 158, 146, 128,
            136, 148, 136, 158,
            136, 188, 196, 188,
            196, 158
          ],
          [
            166, 158, 156, 148,
            156, 118, 176, 118,
            176, 148, 186, 158
          ],
          [
            146, 118, 146, 108,
            156,  98, 176,  98,
            186, 108, 186, 118
          ],
          [ 176, 108, 196, 128, 166, 108 ],
          [ 166, 108, 136, 128, 157, 108 ]
        ],
        lines: [
          [ 146, 158, 146, 128 ], [ 146, 128, 136, 148 ],
          [ 136, 148, 136, 158 ], [ 136, 158, 136, 188 ],
          [ 136, 188, 196, 188 ], [ 196, 188, 196, 158 ],
          [ 196, 158, 136, 158 ], [ 136, 168, 196, 168 ],
          [ 136, 178, 196, 178 ], [ 166, 158, 156, 148 ],
          [ 156, 148, 156, 118 ], [ 156, 118, 176, 118 ],
          [ 176, 118, 176, 148 ], [ 176, 148, 186, 158 ],
          [ 156, 148, 176, 148 ], [ 156, 138, 176, 138 ],
          [ 156, 128, 176, 128 ], [ 146, 118, 146, 108 ],
          [ 146, 108, 156, 98 ],  [ 156, 98, 176, 98 ],
          [ 176, 98, 186, 108 ],  [ 186, 108, 186, 118 ],
          [ 146, 108, 166, 98 ],  [ 166, 98, 186, 108 ],
          [ 156, 108, 176, 108 ], [ 176, 108, 196, 128 ],
          [ 196, 128, 166, 108 ], [ 166, 108, 136, 128 ],
          [ 136, 128, 157, 108 ]
        ]
      },
      {
        COMMENT: 'VIPER 8',
        texture: {
          position: 8,
          edge: 'closed',
          key: 'akalabeth_viper_8',
          height: 97,
          width: 176
        },
        polygon: [
          [
             76, 81, 76, 65,  71, 76,
             71, 81, 71, 96, 103, 96,
            103, 81
          ],
          [
            87, 81, 82, 76, 82,
            60, 92, 60, 92, 76,
            97, 81
          ],
          [
            76, 60, 76, 55, 82,
            50, 92, 50, 97, 55,
            97, 60
          ],
          [ 92, 55, 103, 65, 87, 55 ],
          [ 87, 55, 71, 65, 82, 55 ]
        ],
        lines: [
          [ 76, 81, 76, 65 ],  [ 76, 65, 71, 76 ],
          [ 71, 76, 71, 81 ],  [ 71, 81, 71, 96 ],
          [ 71, 96, 103, 96 ], [ 103, 96, 103, 81 ],
          [ 103, 81, 71, 81 ], [ 71, 86, 103, 86 ],
          [ 71, 91, 103, 91 ], [ 87, 81, 82, 76 ],
          [ 82, 76, 82, 60 ],  [ 82, 60, 92, 60 ],
          [ 92, 60, 92, 76 ],  [ 92, 76, 97, 81 ],
          [ 82, 76, 92, 76 ],  [ 82, 70, 92, 70 ],
          [ 82, 65, 92, 65 ],  [ 76, 60, 76, 55 ],
          [ 76, 55, 82, 50 ],  [ 82, 50, 92, 50 ],
          [ 92, 50, 97, 55 ],  [ 97, 55, 97, 60 ],
          [ 76, 55, 87, 50 ],  [ 87, 50, 97, 55 ],
          [ 82, 55, 92, 55 ],  [ 92, 55, 103, 65 ],
          [ 103, 65, 87, 55 ], [ 87, 55, 71, 65 ],
          [ 71, 65, 82, 55 ]
        ]
      },
      {
        COMMENT: 'VIPER 14',
        texture: {
          position: 14,
          edge: 'closed',
          key: 'akalabeth_viper_14',
          height: 64,
          width: 120
        },
        polygon: [
          [
            52, 53, 52, 43, 49, 50,
            49, 53, 49, 63, 70, 63,
            70, 53
          ],
          [
            59, 53, 56, 50, 56,
            40, 63, 40, 63, 50,
            66, 53
          ],
          [
            52, 40, 52, 36, 56,
            33, 63, 33, 66, 36,
            66, 40
          ],
          [ 63, 36, 70, 43, 59, 36 ],
          [ 59, 36, 49, 43, 56, 36 ]
        ],
        lines: [
          [ 52, 53, 52, 43 ], [ 52, 43, 49, 50 ],
          [ 49, 50, 49, 53 ], [ 49, 53, 49, 63 ],
          [ 49, 63, 70, 63 ], [ 70, 63, 70, 53 ],
          [ 70, 53, 49, 53 ], [ 49, 57, 70, 57 ],
          [ 49, 60, 70, 60 ], [ 59, 53, 56, 50 ],
          [ 56, 50, 56, 40 ], [ 56, 40, 63, 40 ],
          [ 63, 40, 63, 50 ], [ 63, 50, 66, 53 ],
          [ 56, 50, 63, 50 ], [ 56, 46, 63, 46 ],
          [ 56, 43, 63, 43 ], [ 52, 40, 52, 36 ],
          [ 52, 36, 56, 33 ], [ 56, 33, 63, 33 ],
          [ 63, 33, 66, 36 ], [ 66, 36, 66, 40 ],
          [ 52, 36, 59, 33 ], [ 59, 33, 66, 36 ],
          [ 56, 36, 63, 36 ], [ 63, 36, 70, 43 ],
          [ 70, 43, 59, 36 ], [ 59, 36, 49, 43 ],
          [ 49, 43, 56, 36 ]
        ]
      },
      {
        COMMENT: 'VIPER 22',
        texture: {
          position: 22,
          edge: 'closed',
          key: 'akalabeth_viper_22',
          height: 46,
          width: 88
        },
        polygon: [
          [
            38, 38, 38, 31, 36, 36,
            36, 38, 36, 46, 51, 46,
            51, 38
          ],
          [
            43, 38, 41, 36, 41,
            29, 46, 29, 46, 36,
            49, 38
          ],
          [
            38, 29, 38, 26, 41,
            24, 46, 24, 49, 26,
            49, 29
          ],
          [ 46, 26, 51, 31, 43, 26 ],
          [ 43, 26, 36, 31, 41, 26 ]
        ],
        lines: [
          [ 38, 38, 38, 31 ], [ 38, 31, 36, 36 ],
          [ 36, 36, 36, 38 ], [ 36, 38, 36, 46 ],
          [ 36, 46, 51, 46 ], [ 51, 46, 51, 38 ],
          [ 51, 38, 36, 38 ], [ 36, 41, 51, 41 ],
          [ 36, 43, 51, 43 ], [ 43, 38, 41, 36 ],
          [ 41, 36, 41, 29 ], [ 41, 29, 46, 29 ],
          [ 46, 29, 46, 36 ], [ 46, 36, 49, 38 ],
          [ 41, 36, 46, 36 ], [ 41, 33, 46, 33 ],
          [ 41, 31, 46, 31 ], [ 38, 29, 38, 26 ],
          [ 38, 26, 41, 24 ], [ 41, 24, 46, 24 ],
          [ 46, 24, 49, 26 ], [ 49, 26, 49, 29 ],
          [ 38, 26, 43, 24 ], [ 43, 24, 49, 26 ],
          [ 41, 26, 46, 26 ], [ 46, 26, 51, 31 ],
          [ 51, 31, 43, 26 ], [ 43, 26, 36, 31 ],
          [ 36, 31, 41, 26 ]
        ]
      }
    ];
    return {
      get textureData() { return _textureData; },
      /**
       * 
       * @param {object} parameterObject the object parameters
       */
      addMonster: function(parameterObject) {
        if (!parameterObject.hasOwnProperty("position")) {
          throw ["Missing position", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("edge")) {
          throw ["Missing edge", parameterObject];
        }
        if (!parameterObject.hasOwnProperty("key")) {
          throw ["Missing key", parameterObject];
        }
        if (!_dictionary.hasOwnProperty(parameterObject.position)) {
          _dictionary[parameterObject.position] = {};
        }
        _dictionary[parameterObject.position][parameterObject.edge] = parameterObject.key;
      },
      getMonster: function(parameterObject) {
        return _dictionary[parameterObject.position][parameterObject.edge];
      },
    }
  } ());;
  /** @private A delegate for rendering dungeon cells. */
  this._dungeonCellDelegator = function(dungeonCell, cells) {
    let neighborMap = {
      0: 3,
      3: 7,
      7: 13,
      13: 21,
      2: 5,
      5: 9,
      9: 15,
      15: 23
    };
    if (dungeonCell.occupant !== 0
        && dungeonCell.occupant !== 2
        /*
        && !(dungeonCell.position === 1 && (dungeonCell.occupant === 3 || dungeonCell.occupant === 4))
        && !((dungeonCell.occupant === 5 || dungeonCell.occupant === 7 || dungeonCell.occupant === 8 || dungeonCell.occupant === 9) && neighborMap.hasOwnProperty(dungeonCell.position))*/
        ) {
      let imageLibrary = this._imageLibrary;
      // switch to the monster graphics if needed
      if (dungeonCell.occupant > 9) {
        imageLibrary = this._monsterImageLibrary;
      }
      let edge = "closed";
      let position = dungeonCell.position;
      if (dungeonCell.occupant === 1
          || dungeonCell.occupant === 3
          || dungeonCell.occupant === 4) {
        if (neighborMap.hasOwnProperty(position)) {
          // find the neighboring position
          for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].position === neighborMap[position]) {
              if (cells[i].occupant === 1
                  || cells[i].occupant === 3
                  || cells[i].occupant === 4) {
                edge = "open";
              }
              break;
            }
          }
        }
      }
      let occupant = dungeonCell.occupant;
      let imageUtility = this._walls;
      let utilityMember = "getWall";
      if (occupant <= 9) {
        switch (occupant) {
          case 1:
          case 3:
            // WALLS
            break;
          case 4:
            imageUtility = this._doors;
            utilityMember = "getDoor";
            break;
          case 5:
            imageUtility = this._chests;
            utilityMember = "getChest";
            break;
          case 6:
            throw ("DONT HAVE 6")
          case 7:
            imageUtility = this._laddersDown;
            utilityMember = "getLadder";
            break;
          case 8:
            imageUtility = this._laddersUp;
            utilityMember = "getLadder";
            break;
          case 9:
            imageUtility = this._floorHoles;
            utilityMember = "getFloor";
            break;
        }
      } else {
        occupant /= 10;
        switch (occupant) {
        }
      }
      console.log(position,utilityMember,edge)
      // assign image texture
      imageLibrary.get(position).setTexture(imageUtility[utilityMember]({
        position: position,
        edge: edge
      }));
    }
  };
  { // RetroC64AkalabethDungeonGraphics View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = {
      group: null,
      children: []
    };
  }
  { // RetroC64AkalabethDungeonGraphics Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = function(event, context) {
      
    };
  }
  this._state = RetroC64Constants.AKALABETH_DUNGEON_MAIN;
};
RetroC64AkalabethDungeonGraphics.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethDungeonGraphics.prototype.constructor = UiScene;
{ // RetroC64AkalabethDungeonGraphics Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethDungeonGraphics.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethDungeonGraphics Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethDungeonGraphics.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethDungeonGraphics.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethDungeonGraphics.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    this._dungeonGraphics = this._scene.make.graphics({
      lineStyle: { width: 2, color: 10920447 },
      fillStyle: { color: 4408038 }
    });
    this.generateTextures();
    this.createImages();
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethDungeonGraphics.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
    if (this.DungeonScene.needsMapRedraw) {
      this.render();
      this.DungeonScene.needsMapRedraw = false;
    }
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethDungeonGraphics.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Creates the dictionary of Phaser.GameObject.Image (s) used for rendering the dungeon environment and interactive objects.
 */
RetroC64AkalabethDungeonGraphics.prototype.createImages = function() {
  let imageData = this._imageLibrary.imageData;
  for (let i = imageData.length - 1; i >= 0; i--) {
    let image = this._scene.add.image(...imageData[i].initialization);
    image.setDepth(imageData[i].depth);
    image.setOrigin(...imageData[i].origin);
    this._imageLibrary.add({
      position: i,
      image: image
    });
  }
  imageData = this._monsterImageLibrary.imageData;
  for (let i = imageData.length - 1; i >= 0; i--) {
    let image = this._scene.add.image(...imageData[i].initialization);
    image.setDepth(imageData[i].depth);
    image.setOrigin(...imageData[i].origin);
    this._monsterImageLibrary.add({
      position: i,
      image: image
    });
  }
}
/**
 * Generates all textures needed.
 */
RetroC64AkalabethDungeonGraphics.prototype.generateTextures = function() {
  this._dungeonGraphics.generateTexture("akalabeth_dungeon_blank", 1, 1);
  this._dungeonGraphics.clear();
  { // walls
    // original graphics were in a 280x160 resolution. new display will be 560x320
    let textureData = this._walls.textureData;
    for (let i = textureData.length - 1; i >= 0; i--) {
      let data = textureData[i];
      // fill polygon
      this.renderPolygon(data.polygon, true);
  
      // draw frame
      for (let j = data.lines.length - 1; j >= 0; j--) {
        let line = new Phaser.Geom.Line(...data.lines[j]);
        this._dungeonGraphics.strokeLineShape(line);
      }
  
      // generate the texture
      this._dungeonGraphics.generateTexture(data.texture.key, data.texture.width, data.texture.height);
      this._dungeonGraphics.clear();
      this._walls.addWall(data.texture);
    }
  }
  { // doors
    let textureData = this._doors.textureData;
    for (let i = textureData.length - 1; i >= 0; i--) {
      let data = textureData[i];
      // fill polygon
      this.renderPolygon(data.polygon, true);
  
      // draw frame
      for (let j = data.lines.length - 1; j >= 0; j--) {
        let line = new Phaser.Geom.Line(...data.lines[j]);
        this._dungeonGraphics.strokeLineShape(line);
      }
  
      // generate the texture
      this._dungeonGraphics.generateTexture(data.texture.key, data.texture.width, data.texture.height);
      this._dungeonGraphics.clear();
      this._doors.addDoor(data.texture);
    }
  }
  { // floor holes
    let textureData = this._floorHoles.textureData;
    for (let i = textureData.length - 1; i >= 0; i--) {
      let data = textureData[i];
      // fill polygon
      this.renderPolygon(data.polygon, true);
  
      // draw frame
      for (let j = data.lines.length - 1; j >= 0; j--) {
        let line = new Phaser.Geom.Line(...data.lines[j]);
        this._dungeonGraphics.strokeLineShape(line);
      }
  
      // generate the texture
      this._dungeonGraphics.generateTexture(data.texture.key, data.texture.width, data.texture.height);
      this._dungeonGraphics.clear();
      this._floorHoles.addFloor(data.texture);
    }
  }
  { // ladders up
    let textureData = this._laddersUp.textureData;
    for (let i = textureData.length - 1; i >= 0; i--) {
      let data = textureData[i];
      // fill polygon
      this.renderPolygon(data.polygon, true);
  
      // draw frame
      for (let j = data.lines.length - 1; j >= 0; j--) {
        let line = new Phaser.Geom.Line(...data.lines[j]);
        this._dungeonGraphics.strokeLineShape(line);
      }
  
      // generate the texture
      this._dungeonGraphics.generateTexture(data.texture.key, data.texture.width, data.texture.height);
      this._dungeonGraphics.clear();
      this._laddersUp.addLadder(data.texture);
    }
  }
  { // ladders down
    let textureData = this._laddersDown.textureData;
    for (let i = textureData.length - 1; i >= 0; i--) {
      let data = textureData[i];
      // fill polygon
      this.renderPolygon(data.polygon, true);
  
      // draw frame
      for (let j = data.lines.length - 1; j >= 0; j--) {
        let line = new Phaser.Geom.Line(...data.lines[j]);
        this._dungeonGraphics.strokeLineShape(line);
      }
  
      // generate the texture
      this._dungeonGraphics.generateTexture(data.texture.key, data.texture.width, data.texture.height);
      this._dungeonGraphics.clear();
      this._laddersDown.addLadder(data.texture);
    }
  }
  { // chests
    let textureData = this._chests.textureData;
    for (let i = textureData.length - 1; i >= 0; i--) {
      let data = textureData[i];
      // fill polygon
      this.renderPolygon(data.polygon, true);
  
      // draw frame
      for (let j = data.lines.length - 1; j >= 0; j--) {
        let line = new Phaser.Geom.Line(...data.lines[j]);
        this._dungeonGraphics.strokeLineShape(line);
      }
  
      // generate the texture
      this._dungeonGraphics.generateTexture(data.texture.key, data.texture.width, data.texture.height);
      this._dungeonGraphics.clear();
      this._chests.addChest(data.texture);
    }
  }
  { // monsters
    let list = [this._balrogs, this._crawlers, this._daemons, this._gremlins, this._mimics, this._orcs, this._rats, this._skeletons, this._thieves, this._vipers];
    for (let i = list.length - 1; i >= 0; i--) {
      let obj = list[i];
      let textureData = obj.textureData;
      for (let i = textureData.length - 1; i >= 0; i--) {
        let data = textureData[i];
        // fill polygon
        if (data.polygon.length > 0) {
          if (Array.isArray(data.polygon[0])) {
            // there are multiple polygons to render
            for (let j = data.polygon.length - 1; j >= 0; j--) {
              this.renderPolygon(data.polygon[j], true);
            }
          } else {
            this.renderPolygon(data.polygon, true);
          }
        }
    
        // draw outline
        for (let j = data.lines.length - 1; j >= 0; j--) {
          let line = new Phaser.Geom.Line(...data.lines[j]);
          this._dungeonGraphics.strokeLineShape(line);
        }
    
        // generate the texture
        this._dungeonGraphics.generateTexture(data.texture.key, data.texture.width, data.texture.height);
        this._dungeonGraphics.clear();
        obj.addMonster(data.texture);
      }
    }
  }
}
/**
 * Renders a polygon using the internal Phaser.GameObjects.Graphics instance.
 * @param {Array} points the points representing the polygon
 * @param {boolean} isFilled a flag indicating whether the polygon is filled; if not filled it is stroked.
 */
RetroC64AkalabethDungeonGraphics.prototype.renderPolygon = function(points, isFilled) {
  if (!Array.isArray(points)) {
    throw ["Array is required", points];
  }
  let polygon = new Phaser.Geom.Polygon(points);
  // create a polygon out of the points
  this._dungeonGraphics.beginPath();
  this._dungeonGraphics.moveTo(polygon.points[0].x, polygon.points[0].y);
  for (let i = 1; i < polygon.points.length; i++) {
    this._dungeonGraphics.lineTo(polygon.points[i].x, polygon.points[i].y);
  }
  if (isFilled) {
    this._dungeonGraphics.fillPath();
  } else {
    this._dungeonGraphics.strokePath();
  }
}
/**
 * Renders the dungeon field of view.
 */
RetroC64AkalabethDungeonGraphics.prototype.render = function() {
  // clear all images
  let imageData = this._imageLibrary;
  for (let i = imageData.imageData.length - 1; i >= 0; i--) {
    imageData.get(i).setTexture("akalabeth_dungeon_blank");
  }
  imageData = this._monsterImageLibrary;
  for (let i = imageData.imageData.length - 1; i >= 0; i--) {
    imageData.get(i).setTexture("akalabeth_dungeon_blank");
  }
  // shadowcast to get visible cells
  let casting = RetroC64AkalabethController.dungeon.shadowCastQuadrant(5);
  // raycast to get visible cells
  // let casting = RetroC64AkalabethController.dungeon.raycastQuadrant(5);
  console.log(casting)
  for (let i = casting.length - 1; i >= 0; i--) {
    // skip any cells that don't get rendered
    if (this._ignoreList.hasOwnProperty(casting[i].position)) {
      continue;
    }
    // skip empty cells or trapdoors
    if (casting[i].occupant === 0 && casting[i].occupant === 2) {
      continue;
    }
    // skip secret doors and doors the player is standing in
    if (casting[i].position === 1 && (casting[i].occupant === 3 || casting[i].occupant === 4)) {
      continue;
    }
    let centerLane = casting[i].position === 1 || casting[i].position === 4 || casting[i].position === 8 || casting[i].position === 14 || casting[i].position === 22;
    // skip monsters in position 0 or outside the center lane
    if (casting[i].occupant >= 10 && !centerLane) {
      continue;
    }
    // skip chests in position 0 or outside the center lane
    if (casting[i].occupant === 5 && !centerLane) {
      continue;
    }
    // skip ladders outside the center lane
    if ((casting[i].occupant === 7 || casting[i].occupant === 8 || casting[i].occupant === 9) && !centerLane) {
      continue;
    }
    this._dungeonCellDelegator(casting[i], casting);
  }
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethDungeonGraphics };
}
