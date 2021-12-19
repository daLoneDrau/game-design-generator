if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethCharacterCreationScene } = require("./retroc64-akalabeth-character-creation-scene");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
}
/**
 * @class A UI for the character creation process. This UI will handle the four steps in the process:

* getting the player's lucky number
* getting the game's level of play
* rolling a new character
* selecting the player's class
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethCharacterCreationInterface(parameterObject) {
  parameterObject.columns = 2;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private A delay of 500 milliseconds will be used when processing user keyboard entry. */
  this._keyEntryDelay = 500;
  { // RetroC64AkalabethCharacterCreationInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_LUCKY_NUMBER]] = {
      group: null,
      children: [
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "TYPE THY LUCKY NUMBER (0-9)..... ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 5
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "luckyField1"
        },
        {
          comment: "CREATE TWO IMAGE (F OR M)S, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
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
          position: {
            x: {
              fixed: -0.5,
              offset: {
                field: "luckyField1"
              }
            },
            y: 5
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor1"
        }
      ]
    };
    this._VIEWS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_LEVEL_OF_PLAY]] = {
      group: null,
      children: [
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 5
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "luckyField2"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "LEVEL OF PLAY (1-10)...... ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 7
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "levelOfPlayField2"
        },
        {
          comment: "CREATE TWO IMAGE (F OR M)S, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
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
          position: {
            x: {
              fixed: -0.5,
              offset: {
                pixel: 2,
                field: "levelOfPlayField2"
              }
            },
            y: 7
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor2"
        }
      ]
    };
    this._VIEWS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_REVIEW_CHARACTER]] = {
      group: null,
      children: [
        {
          comment: "HP",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "HIT POINTS.....", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 7
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 7
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "hpValue3"
        },
        {
          comment: "STR",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "STRENGTH........", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 8
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 8
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "strValue3"
        },
        {
          comment: "DEX",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "DEXTERITY.......", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 9
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 9
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "dexValue3"
        },
        {
          comment: "ST",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "STAMINA...........", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 10
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 10
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "stValue3"
        },
        {
          comment: "WIS",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WISDOM.............", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 11
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 11
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "wisValue3"
        },
        {
          comment: "GOLD",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "GOLD.................", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 12
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 12
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "goldValue3"
        },
        {
          comment: "PROMPT",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "SHALT THOU PLAY WITH THESE QUALITIES (Y OR N)? ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 14
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "promptField3"
        },
        {
          comment: "CREATE TWO IMAGE (F OR M)S, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
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
          position: {
            x: {
              fixed: -0.5,
              offset: {
                field: "promptField3"
              }
            },
            y: 14
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor3"
        }
      ]
    };
    this._VIEWS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_SELECT_CLASS]] = {
      group: null,
      children: [
        {
          comment: "HP",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "HIT POINTS.....", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 7
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 7
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "hpValue4"
        },
        {
          comment: "STR",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "STRENGTH........", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 8
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 8
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "strValue4"
        },
        {
          comment: "DEX",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "DEXTERITY.......", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 9
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 9
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "dexValue4"
        },
        {
          comment: "ST",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "STAMINA...........", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 10
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 10
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "stValue4"
        },
        {
          comment: "WIS",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WISDOM.............", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 11
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 11
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "wisValue4"
        },
        {
          comment: "GOLD",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "GOLD.................", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 12
          },
          origin: [0, 0.5],
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
          position: {
            x: {
              fixed: 0,
              offset: 24
            },
            y: 12
          },
          origin: [1, 0.5],
          tint: 10920447,
          dynamicField: "goldValue4"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "SHALT THOU PLAY WITH THESE QUALITIES (Y OR N)? YES", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 14
          },
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "AND SHALT THOU BE A FIGHTER OR A MAGE (F OR M)? ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 15
          },
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          comment: "PROMPT",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 16],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "promptField4"
        },
        {
          comment: "CREATE TWO IMAGE (F OR M)S, CURSOR_ON AND CURSOR_OFF. OFF IS MADE FIRST, SINCE THE GRAPHICS NEEDS TO BE EMPTY",
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
          position: {
            x: {
              fixed: 0.5,
              offset: {
                field: "promptField4"
              }
            },
            y: 16
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor4"
        }
      ]
    };
  }
  { // RetroC64AkalabethCharacterCreationInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_LUCKY_NUMBER]] = function(event, context) {
      switch (event.key) {
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
          {
            // set lucky number
            RetroC64AkalabethController.luckyNumber = event.key;
            
            // display lucky number
            context._dynamicFields.setText("luckyField1", [context._dynamicFields.getText("luckyField1"), RetroC64AkalabethController.luckyNumber].join(""));
            context._dynamicFields.setText("luckyField2", context._dynamicFields.getText("luckyField1"));
            
            // move cursor to the right
            context.moveCursor("blinkingCursor1", -0.5, 5, "luckyField1");
      
            // start the timer to go to the next screen
            context._scene.time.delayedCall(
              context._keyEntryDelay, // milliseconds
              function () {
                // reset the text and move the cursor back
                this._dynamicFields.setText("luckyField1", "TYPE THY LUCKY NUMBER (0-9)..... ");
                this.moveCursor("blinkingCursor1", -0.5, 5, "luckyField1");
                
                // go to the next state
                this._state = RetroC64Constants.AKALABETH_CHARACTER_CREATION_LEVEL_OF_PLAY;
                this._stateChangeResolved = false;
              }, // callback function
              [], // args
              context
            ); // the scope object
          }
          break;
      }
    };
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_LEVEL_OF_PLAY]] = function(event, context) {
      switch (event.key) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          {
            // set level of play
            RetroC64AkalabethController.levelOfPlay = event.key;
            
            // display level of play
            context._dynamicFields.setText("levelOfPlayField2", ["LEVEL OF PLAY (1-10)...... ", RetroC64AkalabethController.levelOfPlay].join(""));
            
            // move cursor to the right
            context.moveCursor("blinkingCursor2", -0.5, 7, "levelOfPlayField2");
          }
          break;
        case "0":
          {
            if (RetroC64AkalabethController.levelOfPlay === 1) {
              // set level of play to 10
              RetroC64AkalabethController.levelOfPlay = 10;
              // display level of play
            context._dynamicFields.setText("levelOfPlayField2", ["LEVEL OF PLAY (1-10)...... ", RetroC64AkalabethController.levelOfPlay].join(""));
              
              // move cursor to the right
              context.moveCursor("blinkingCursor2", -0.5, 7, "levelOfPlayField2");
            }
          }
          break;
        case "Enter":
          {
            if (RetroC64AkalabethController.levelOfPlay > 0) {
              // start the timer to go to the next screen
              context._scene.time.delayedCall(
                context._keyEntryDelay, // milliseconds
                function () {
                  // reset the text and move the cursor back
                  this._dynamicFields.setText("luckyField2", "");
                  this._dynamicFields.setText("levelOfPlayField2", "LEVEL OF PLAY (1-10)...... ");
                  this.moveCursor("blinkingCursor2", -0.5, 7, "levelOfPlayField2");
                  
                  // go to the next state
                  RetroC64AkalabethController.character.newCharacter();
                  this._state = RetroC64Constants.AKALABETH_CHARACTER_CREATION_REVIEW_CHARACTER;
                  this._stateChangeResolved = false;
                }, // callback function
                [], // args
                context
              ); // the scope object
            }
          }
          break;
        case "Backspace":
          {
            if (RetroC64AkalabethController.levelOfPlay > 0) {
              if (RetroC64AkalabethController.levelOfPlay / 10 === 1) {
                // set level of play
                RetroC64AkalabethController.levelOfPlay = 1;
                
                // display level of play
                context._dynamicFields.setText("levelOfPlayField2", ["LEVEL OF PLAY (1-10)...... ", RetroC64AkalabethController.levelOfPlay].join(""));
              } else {                
                // set level of play
                RetroC64AkalabethController.levelOfPlay = 0;
                
                // display level of play
                context._dynamicFields.setText("levelOfPlayField2", "LEVEL OF PLAY (1-10)...... ");                
              }
              // move cursor to the right
              context.moveCursor("blinkingCursor2", -0.5, 7, "levelOfPlayField2");
            }
          }
          break;
      }
    };
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_REVIEW_CHARACTER]] = function(event, context) {
      switch (event.key) {
        case "Y":
        case "y":
          {
            // display entry
            context._dynamicFields.setText("promptField3", "SHALT THOU PLAY WITH THESE QUALITIES (Y OR N)? YES");
            
            // move cursor to the right
            context.moveCursor("blinkingCursor3", -0.5, 14, "promptField3");
            // start the timer to go to the next screen
            context._scene.time.delayedCall(
              context._keyEntryDelay, // milliseconds
              function () {
                // reset the text and move the cursor back
                this._dynamicFields.setText("promptField3", "SHALT THOU PLAY WITH THESE QUALITIES (Y OR N)? ");
                this.moveCursor("blinkingCursor3", -0.5, 14, "promptField3");
                
                // go to the next state
                this._state = RetroC64Constants.AKALABETH_CHARACTER_CREATION_SELECT_CLASS;
                this._stateChangeResolved = false;
              }, // callback function
              [], // args
              context
            ); // the scope object
          }
          break;
        case "N":
        case "n":
          {
            // display entry
            context._dynamicFields.setText("promptField3", "SHALT THOU PLAY WITH THESE QUALITIES (Y OR N)? NO");
            
            // move cursor to the right
            context.moveCursor("blinkingCursor3", -0.5, 14, "promptField3");
            // start the timer to go to the next screen
            context._scene.time.delayedCall(
              context._keyEntryDelay, // milliseconds
              function () {
                // reset the text and move the cursor back
                this._dynamicFields.setText("promptField3", "SHALT THOU PLAY WITH THESE QUALITIES (Y OR N)? ");
                this.moveCursor("blinkingCursor3", -0.5, 14, "promptField3");
                
                // re-roll stats
                RetroC64AkalabethController.character.newCharacter();
              }, // callback function
              [], // args
              context
            ); // the scope object
          }
          break;
      }
    };
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CHARACTER_CREATION_SELECT_CLASS]] = function(event, context) {
      let valid = false;
      switch (event.key) {
        case "F":
        case "f":
          {
            // display entry
            context._dynamicFields.setText("promptField4", "FIGHTER");
      
            // set the class
            RetroC64AkalabethController.character.class = "F";
      
            // validate the class
            valid = true;
          }
          break;
        case "M":
        case "m":
          {
            // display entry
            context._dynamicFields.setText("promptField4", "MAGE");
      
            // set the class
            RetroC64AkalabethController.character.class = "M";
      
            // validate the class
            valid = true;
          }
          break;
      }
      if (valid) {
        // move cursor to the right
        context.moveCursor("blinkingCursor4", 0.5, 16, "promptField4");
        // start the timer to go to the next screen
        context._scene.time.delayedCall(
          context._keyEntryDelay, // milliseconds
          function () {
            // reset the text and move the cursor back
            this._dynamicFields.setText("promptField4", "");
            this.moveCursor("blinkingCursor4", 0.5, 16, "promptField4");
            
            // reset the state and go to the next scene
            this._state = RetroC64Constants.AKALABETH_CHARACTER_CREATION_LUCKY_NUMBER;
            this._stateChangeResolved = false;
            RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_EQUIPMENT_SHOP });
          }, // callback function
          [], // args
          context
        ); // the scope object
      }
    };
  }
  this._state = RetroC64Constants.AKALABETH_CHARACTER_CREATION_LUCKY_NUMBER;
};
RetroC64AkalabethCharacterCreationInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethCharacterCreationInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethCharacterCreationInterface Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethCharacterCreationInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethCharacterCreationInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethCharacterCreationInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethCharacterCreationInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethCharacterCreationInterface.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    // start the cursor animation
    this._dynamicFields.getObject("blinkingCursor1")[0].anims.create({
      key: "blink",
      frames: [
        { key: "cursor_off" },
        { key: "cursor_on" }
      ],
      frameRate: 2,
      repeat: -1 // repeat infinitely
    });
    this._dynamicFields.getObject("blinkingCursor1")[0].play("blink");
    
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
    
    this._dynamicFields.getObject("blinkingCursor3")[0].anims.create({
      key: "blink",
      frames: [
        { key: "cursor_off" },
        { key: "cursor_on" }
      ],
      frameRate: 2,
      repeat: -1 // repeat infinitely
    });
    this._dynamicFields.getObject("blinkingCursor3")[0].play("blink");
    
    this._dynamicFields.getObject("blinkingCursor4")[0].anims.create({
      key: "blink",
      frames: [
        { key: "cursor_off" },
        { key: "cursor_on" }
      ],
      frameRate: 2,
      repeat: -1 // repeat infinitely
    });
    this._dynamicFields.getObject("blinkingCursor4")[0].play("blink");
    RetroC64AkalabethController.character.addWatcher(this);
    RetroC64AkalabethController.character.notifyWatchers(); 
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethCharacterCreationInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethCharacterCreationInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Moves the cursor to the right of a specific field.
 * @param {string} cursorId the cursor sprite's unique id
 * @param {Number} column the column where the cursor will be placed
 * @param {Number} row the row where the cursor will be placed
 * @param {string} offsetField the id of the field the cursor will be placed next to
 */
RetroC64AkalabethCharacterCreationInterface.prototype.moveCursor = function(cursorId, column, row, offsetField) {
  let x = column + this._dynamicFields.getObject(offsetField)[0].width / this._COLUMN_WIDTH; // to the right of the offset field
  x += 2 / this._COLUMN_WIDTH; // add 2px buffer
  let y = row - 1 / this._ROW_HEIGHT; // move up 1 pixel (looks better);
  this._grid.placeAt(x, y, this._dynamicFields.getObject(cursorId)[0]);
}
/**
 * Handles updates to a Watchable instance.
 * @param {Watchable} data the Watchable instance being updated
 */
RetroC64AkalabethCharacterCreationInterface.prototype.watchUpdated = function(data) {
  // call base
  Watcher.prototype.watchUpdated.call(this, data);
  // update fields
  this._dynamicFields.setText("hpValue3", data.hitPoints);
  this._dynamicFields.setText("strValue3", data.strength);
  this._dynamicFields.setText("dexValue3", data.dexterity);
  this._dynamicFields.setText("stValue3", data.stamina);
  this._dynamicFields.setText("wisValue3", data.wisdom);
  this._dynamicFields.setText("goldValue3", data.gold);
  this._dynamicFields.setText("hpValue4", data.hitPoints);
  this._dynamicFields.setText("strValue4", data.strength);
  this._dynamicFields.setText("dexValue4", data.dexterity);
  this._dynamicFields.setText("stValue4", data.stamina);
  this._dynamicFields.setText("wisValue4", data.wisdom);
  this._dynamicFields.setText("goldValue4", data.gold);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethCharacterCreationInterface };
}
