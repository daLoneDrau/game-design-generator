if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { RetroC64Constants } = require("../../config/retroc64-constants");
  var { RetroC64SceneController } = require("../scenes/retroc64-scene-controller");
  var { RetroC64IntroScene } = require("../retroc64-introscene");
  var { RetroC64AkalabethController } = require("../../services/akalabeth/retroc64-akalabeth-controller");
}
/**
 * @class The UI presented for the Intro View.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64IntroUi(parameterObject) {
  parameterObject.columns = 2;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private a flag indicating the UI is accepting entries for level number */
  this._readyForLevelNumber = false;
  /** @private a flag indicating the UI is accepting entries for character class */
  this._readyForClassSelection = false;
  /** @private 
   * Displays the level entry text and moves the cursor.
   */
  this._displayLevelEntry = function() {
    // show the next label
    this._dynamicFields.setText("levelNumberEntryLabel", "LEVEL OF PLAY (1-10)......");
    // position the blinking cursor
    this._grid.placeAt(0.3525, 6 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor")[0]);
    // prepare to accept the next input
    this._readyForLevelNumber = true;
  };
  /** @private 
   * Displays the class entry text and moves the cursor.
   */
  this._displayClassEntry = function() {
  this._dynamicFields.setText("acceptCharacterEntry", "");
    // show the next label
    this._dynamicFields.setText("characterClassLabel", "AND SHALT THOU BE A FIGHTER OR A MAGE (F OR M)?");
    // position the blinking cursor
    this._grid.placeAt(0.5, 17 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor2")[0]);
    // prepare to accept the next input
    this._readyForClassSelection = true;
  };
  /** @private 
   * Handles player input when entering their lucky number.
   * @param {string} key the key that was pressed
   */
  this._handleLuckyNumberEntry = function(key) {
    switch (key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        // set lucky number
        RetroC64AkalabethController.luckyNumber = key;
        
        // display lucky number
        this._dynamicFields.setText("luckyNumberEntry", RetroC64AkalabethController.luckyNumber);
        
        // move cursor to the right
        // get the width of the digit displayed
        let charOffset = this._dynamicFields.getObject("luckyNumberEntry")[0].width;
        // grid is two columns. find the percentage of the width compared to the column
        charOffset /= (this._scene.scale.width / 2);
        // position the blinking cursor
        this._grid.placeAt(0.6075 + charOffset, 5 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor")[0]);

        // start the timer to go to the next screen
        this._scene.time.delayedCall(
          this._keyEntryDelay, // milliseconds
          this._displayLevelEntry, // callback function
          [], // args
          this
        ); // the scope object
        break;
      default:
        break;
    }
  };
  /** @private 
   * Handles player input when entering their lucky number.
   * @param {string} key the key that was pressed
   */
  this._handleLevelNumberEntry = function(key) {
    switch (key) {
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        let moveCursor = true;
        // check to see if anything was entered already
        if (RetroC64AkalabethController.levelNumber > 0) {
          // no need to reposition the cursor
          moveCursor = false;
        }
        RetroC64AkalabethController.levelNumber = key;
        // update level number
        this._dynamicFields.setText("levelNumberEntry", RetroC64AkalabethController.levelNumber);
        if (moveCursor) {
          // move cursor to the right
          // get the width of the digit displayed
          let charOffset = this._dynamicFields.getObject("levelNumberEntry")[0].width;
          // grid is two columns. find the percentage of the width compared to the column
          charOffset /= (this._scene.scale.width / 2);
          // position the blinking cursor
          this._grid.placeAt(0.3525 + charOffset, 6 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor")[0]);
        }
        break;
      case "0":
        if (RetroC64AkalabethController.levelNumber === 1) {
          RetroC64AkalabethController.levelNumber = 10;
          // update level number
          this._dynamicFields.setText("levelNumberEntry", RetroC64AkalabethController.levelNumber);
          // move cursor to the right
          // get the width of the digit displayed
          let charOffset = this._dynamicFields.getObject("levelNumberEntry")[0].width;
          // grid is two columns. find the percentage of the width compared to the column
          charOffset /= (this._scene.scale.width / 2);
          // position the blinking cursor
          this._grid.placeAt(0.3525 + charOffset, 6, this._dynamicFields.getObject("blinkingCursor")[0]);
        }
        break;
      case "Enter":
        if (RetroC64AkalabethController.levelNumber > 0) {
          // start the timer to go to the next screen
          this._scene.time.delayedCall(
            this._keyEntryDelay, // milliseconds
            this._nextState, // callback function
            [RetroC64Constants.AKALABETH_INTRO_REVIEW_CHARACTER], // args
            this
          ); // the scope object
        }
        break;
      case "Backspace":
        RetroC64AkalabethController.levelNumber = Math.floor(RetroC64AkalabethController.levelNumber / 10);
        if (RetroC64AkalabethController.levelNumber > 0) {
          this._dynamicFields.setText("levelNumberEntry", RetroC64AkalabethController.levelNumber);
        } else {
          RetroC64AkalabethController.levelNumber = -1;
          this._dynamicFields.setText("levelNumberEntry", "");
        }
        // move cursor to the right
        // get the width of the digit displayed
        let charOffset = this._dynamicFields.getObject("levelNumberEntry")[0].width;
        // grid is two columns. find the percentage of the width compared to the column
        charOffset /= (this._scene.scale.width / 2);
        // position the blinking cursor
        this._grid.placeAt(0.3525 + charOffset, 6 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor")[0]);
        break;
      default:
        break;
    }
  };
  /** @private 
   * Handles player input when reviewing their character.
   * @param {string} key the key that was pressed
   */
  this._handleCharacterReviewEntry = function(key) {
    switch (key) {
      case "Y":
      case "y":
        {
          this._dynamicFields.setText("acceptCharacterEntry", "Y");
          // move cursor to the right
          // get the width of the digit displayed
          let charOffset = this._dynamicFields.getObject("acceptCharacterEntry")[0].width;
          // grid is two columns. find the percentage of the width compared to the column
          charOffset /= (this._scene.scale.width / 2);
          // position the blinking cursor
          this._grid.placeAt(0.5 + charOffset, 16 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor2")[0]);
    
          // start the timer to go to the next screen
          this._scene.time.delayedCall(
            this._keyEntryDelay, // milliseconds
            this._displayClassEntry, // callback function
            [], // args
            this // the scope object
          );
        }
        break;
      case "N":
      case "n":
        {
          this._dynamicFields.setText("acceptCharacterEntry", "N");
          // move cursor to the right
          // get the width of the digit displayed
          let charOffset = this._dynamicFields.getObject("acceptCharacterEntry")[0].width;
          // grid is two columns. find the percentage of the width compared to the column
          charOffset /= (this._scene.scale.width / 2);
          // position the blinking cursor
          this._grid.placeAt(0.5 + charOffset, 16 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor2")[0]);
    
          // start the timer to go to the next screen
          this._scene.time.delayedCall(
            this._keyEntryDelay, // milliseconds
            this.startScene, // callback function
            [], // args
            this // the scope object
          );
        }
        break;
    }
  };
  /** @private 
   * Handles player input when entering their chosen class.
   * @param {string} key the key that was pressed
   */
  this._handleClassEntry = function(key) {
    switch (key) {
      case "F":
      case "f":
      case "M":
      case "m":
        console.log("hadnling key")
        this._dynamicFields.setText("acceptClassEntry", key.toUpperCase());
        RetroC64AkalabethController.character.class = key.toUpperCase();
        // move cursor to the right
        // get the width of the digit displayed
        let charOffset = this._dynamicFields.getObject("acceptClassEntry")[0].width;
        // grid is two columns. find the percentage of the width compared to the column
        charOffset /= (this._scene.scale.width / 2);
        // position the blinking cursor
        this._grid.placeAt(0.5 + charOffset, 17 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor2")[0]);

        // start the timer to go to the next screen
        this._scene.time.delayedCall(
          this._keyEntryDelay, // milliseconds
          function() {
            this._readyForLevelNumber = false;
            this._readyForClassSelection = false;
            this._state = RetroC64Constants.AKALABETH_INTRO_LUCKY_NUMBER;
            RetroC64SceneController.switch(RetroC64Constants.AKALABETH_EQUIPMENT_SHOP);
          }, // callback function
          [], // args
          this // the scope object
        );
        break;
    }
  };
  /** @private 
   * Moves to the next state.
   */
  this._nextState = function(value) {
    // change the state here
    this._state = value;
    // set state in the parent
    RetroC64IntroScene.state = value;
    this._stateChangeResolved = false;
  };
  /** @private the y-offset applied to the cursor's position */
  this._cursorYOffset = -0.04;
  /** @private the delays in milliseconds before processing an accepted keystroke */
  this._keyEntryDelay = 500;
  this._VIEWS[[RetroC64Constants.AKALABETH_INTRO_LUCKY_NUMBER]] = {
    group: null,
    children: [
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "TYPE THY LUCKY NUMBER (0-9).....", // text
        ],
        position: [-0.4975, 5],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.6075, 5],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "luckyNumberEntry"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [-0.4975, 6],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "levelNumberEntryLabel"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.3525, 6],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "levelNumberEntry"
      },
      {
        comment: "CREATE TWO IMAGES, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
        type: "graphics-texture",
        commands: [
          {
            order: 1,
            command: "fillStyle",
            args: [0xA6A1FF, 0] // color, alpha
          },
          {
            order: 2,
            command: "fillRect",
            args: [0, 0, 16, 16], // x, y, width, height, corner radius,
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 3,
            command: "generateTexture",
            args: ["cursor_off", 16, 16], // key, scale width, scale height
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 4,
            command: "fillStyle",
            args: [0xA6A1FF, 1] // color, alpha
          },
          {
            order: 5,
            command: "fillRect",
            args: [0, 0, 16, 16], // x, y, width, height, corner radius,
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 6,
            command: "generateTexture",
            args: ["cursor_on", 16, 16], // key, scale width, scale height
            "scale controlled args": [] // no scaled graphics
          },
        ]
      },
      {
        comment: "CREATE CURSOR SPRITE",
        type: "sprite",
        args: [
          0, // x
          0, // y
          "cursor_on" // texture
        ],
        position: [0.6075, 5 + this._cursorYOffset],
        origin: [0, 0.5],
        dynamicField: "blinkingCursor"
      }
    ]
  };
  this._VIEWS[[RetroC64Constants.AKALABETH_INTRO_REVIEW_CHARACTER]] = {
    group: null,
    children: [
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "HIT POINTS.....", // text
        ],
        position: [-0.4975, 8],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 8],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "hpValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "STRENGTH........", // text
        ],
        position: [-0.4975, 9],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 9],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "strValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "DEXTERITY.......", // text
        ],
        position: [-0.4975, 10],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 10],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "dexValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "STAMINA...........", // text
        ],
        position: [-0.4975, 11],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 11],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "stValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "WISDOM.............", // text
        ],
        position: [-0.4975, 12],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 12],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "wisValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "GOLD.................", // text
        ],
        position: [-0.4975, 13],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 13],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "goldValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "SHALT THOU PLAY WITH THESE QUALITIES (Y OR N)?", // text
        ],
        position: [-0.4975, 15],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [-0.4975, 16],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "characterClassLabel"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.5, 16],
        scale: 1,
        tint: 10920447,
        dynamicField: "acceptCharacterEntry"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.5, 17],
        scale: 1,
        tint: 10920447,
        dynamicField: "acceptClassEntry"
      },
      {
        comment: "CREATE TWO IMAGES, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
        type: "graphics-texture",
        commands: [
          {
            order: 1,
            command: "fillStyle",
            args: [0xA6A1FF, 0] // color, alpha
          },
          {
            order: 2,
            command: "fillRect",
            args: [0, 0, 16, 16], // x, y, width, height, corner radius,
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 3,
            command: "generateTexture",
            args: ["cursor_off", 16, 16], // key, scale width, scale height
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 4,
            command: "fillStyle",
            args: [0xA6A1FF, 1] // color, alpha
          },
          {
            order: 5,
            command: "fillRect",
            args: [0, 0, 16, 16], // x, y, width, height, corner radius,
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 6,
            command: "generateTexture",
            args: ["cursor_on", 16, 16], // key, scale width, scale height
            "scale controlled args": [] // no scaled graphics
          },
        ]
      },
      {
        comment: "CREATE CURSOR SPRITE",
        type: "sprite",
        args: [
          0, // x
          0, // y
          "cursor_on" // texture
        ],
        position: [0.5, 16 + this._cursorYOffset],
        origin: [0.5, 0.5],
        dynamicField: "blinkingCursor2"
      }
    ]
  };
  this._VIEWS[[RetroC64Constants.AKALABETH_INTRO_SHOP]] = {
    group: null,
    children: [
      {
        comment: "COLUMN 1 HEADER",
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "STAT'S", // text
        ],
        position: [0, 1],
        origin: [0.5, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "HIT POINTS.....", // text
        ],
        position: [-0.4975, 2],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 2],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "hpValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "STRENGTH........", // text
        ],
        position: [-0.4975, 3],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 3],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "strValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "DEXTERITY.......", // text
        ],
        position: [-0.4975, 4],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 4],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "dexValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "STAMINA...........", // text
        ],
        position: [-0.4975, 5],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 5],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "stValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "WISDOM.............", // text
        ],
        position: [-0.4975, 6],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 6],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "wisValue"
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "GOLD.................", // text
        ],
        position: [-0.4975, 7],
        origin: [0, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "", // text
        ],
        position: [0.04, 7],
        origin: [1, 0.5],
        scale: 1,
        tint: 10920447,
        dynamicField: "goldValue"
      },
      {
        comment: "COLUMN 2 HEADER",
        type: "bitmapText",
        args: [
          0, // x
          0, // y
          "c64_pro_style_16", // font
          "WEAPONS", // text
        ],
        position: [1, 1],
        origin: [0.5, 0.5],
        scale: 1,
        tint: 10920447
      },
      {
        comment: "CREATE TWO IMAGES, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
        type: "graphics-texture",
        commands: [
          {
            order: 1,
            command: "fillStyle",
            args: [0xA6A1FF, 0] // color, alpha
          },
          {
            order: 2,
            command: "fillRect",
            args: [0, 0, 16, 16], // x, y, width, height, corner radius,
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 3,
            command: "generateTexture",
            args: ["cursor_off", 16, 16], // key, scale width, scale height
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 4,
            command: "fillStyle",
            args: [0xA6A1FF, 1] // color, alpha
          },
          {
            order: 5,
            command: "fillRect",
            args: [0, 0, 16, 16], // x, y, width, height, corner radius,
            "scale controlled args": [] // no scaled graphics
          },
          {
            order: 6,
            command: "generateTexture",
            args: ["cursor_on", 16, 16], // key, scale width, scale height
            "scale controlled args": [] // no scaled graphics
          },
        ]
      },
      {
        comment: "CREATE CURSOR SPRITE",
        type: "sprite",
        args: [
          0, // x
          0, // y
          "cursor_on" // texture
        ],
        position: [0.5, 16 + this._cursorYOffset],
        origin: [0.5, 0.5],
        dynamicField: "blinkingCursor3"
      }
    ]
  };
  this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_INTRO_LUCKY_NUMBER]] = function(event, context) {
    if (RetroC64AkalabethController.luckyNumber === -1) { // entering lucky number
      context._handleLuckyNumberEntry(event.key);
    } else if (context._readyForLevelNumber) { // entering level number
      context._handleLevelNumberEntry(event.key);
    } else {
      console.log("ignoring key", event.key)
    }
  };
  this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_INTRO_REVIEW_CHARACTER]] = function(event, context) {
    if (!context._readyForClassSelection) { // entering level number
      context._handleCharacterReviewEntry(event.key);
    } else {
      context._handleClassEntry(event.key);
    }
  };
  this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_INTRO_SHOP]] = function(event, context) {
    switch (event.key) {
      case "Y":
      case "y":
        context._dynamicFields.setText("acceptCharacterEntry", "Y");
        // move cursor to the right
        // get the width of the digit displayed
        let charOffset = context._dynamicFields.getObject("acceptCharacterEntry")[0].width;
        // grid is two columns. find the percentage of the width compared to the column
        charOffset /= (context._scene.scale.width / 2);
        // position the blinking cursor
        context._grid.placeAt(0.5 + charOffset, 16 + context._cursorYOffset, context._dynamicFields.getObject("blinkingCursor2")[0]);
  
        // start the timer to go to the next screen
        context._scene.time.delayedCall(
          context._keyEntryDelay, // milliseconds
          context._displayClassEntry, // callback function
          [], // args
          context // the scope object
        );
        /*
        this._dynamicFields.setText("acceptCharacterEntry", "");
        this._dynamicFields.setText("characterClassLabel", "SHALT THOU PLAY WITH THESE QUALITIES?");
        */
        break;
    }
  };
  this._state = RetroC64Constants.AKALABETH_INTRO_LUCKY_NUMBER;
};
RetroC64IntroUi.prototype = Object.create(UiScene.prototype);
RetroC64IntroUi.prototype.constructor = UiScene;
{ // RetroC64IntroUi Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64IntroUi.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
  if (this._state === RetroC64Constants.AKALABETH_INTRO_LUCKY_NUMBER) {
    RetroC64AkalabethController.luckyNumber = -1;
    RetroC64AkalabethController.levelNumber = -1;
    this._readyForLevelNumber = false;
    this._readyForClassSelection = false;
  }
  if (this._state === RetroC64Constants.AKALABETH_INTRO_REVIEW_CHARACTER) {
    RetroC64AkalabethController.character.newCharacter();
    this._dynamicFields.setText("hpValue", RetroC64AkalabethController.character.hitPoints);
    this._dynamicFields.setText("strValue", RetroC64AkalabethController.character.strength);
    this._dynamicFields.setText("dexValue", RetroC64AkalabethController.character.dexterity);
    this._dynamicFields.setText("stValue", RetroC64AkalabethController.character.stamina);
    this._dynamicFields.setText("wisValue", RetroC64AkalabethController.character.wisdom);
    this._dynamicFields.setText("goldValue", RetroC64AkalabethController.character.gold);
    this._dynamicFields.setText("acceptCharacterEntry", "");
    this._dynamicFields.setText("acceptClassEntry", "");
    this._readyForClassSelection = false;
    this._grid.placeAt(0.5, 16 + this._cursorYOffset, this._dynamicFields.getObject("blinkingCursor2")[0]);
  }
}
/**
 * This method is called by the Scene Manager when the scene starts, before preload() and create().
 * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
RetroC64IntroUi.prototype.init = function(data) {
}
/**
 * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
 */
RetroC64IntroUi.prototype.preload = function() {
}
/**
 * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
 * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
RetroC64IntroUi.prototype.create = function(data) {
  // call base
  UiScene.prototype.create.call(this, data);
  this._dynamicFields.getObject("blinkingCursor")[0].anims.create({
    key: "blink",
    frames: [
      { key: "cursor_off" },
      { key: "cursor_on" }
    ],
    frameRate: 2,
    repeat: -1 // repeat infinitely
  });
  this._dynamicFields.getObject("blinkingCursor")[0].play("blink");
  this._dynamicFields.getObject("blinkingCursor2")[0].anims.create({
    key: "blink",
    frames: [
      { key: "cursor_off" },
      { key: "cursor_on" }
    ],
    frameRate: 2,
    repeat: -1 // repeat infinitely
  });
  this._dynamicFields.getObject("blinkingCursor2")[0].play("blink");
}
/**
 * This method is called once per game step while the scene is running.
 * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
RetroC64IntroUi.prototype.update = function(time, delta) {
  // call base
  UiScene.prototype.update.call(this, time, delta);
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64IntroUi.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64IntroUi };
}
