if (typeof(module) !== "undefined") {
  var { RetroC64Constants } = require("../../../config/retroc64-constants");
  var { RetroC64AkalabethController } = require("../../../services/akalabeth/retroc64-akalabeth-controller");
  var { RetroC64AkalabethCastleScene } = require("./retroc64-akalabeth-castle-scene");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
}
/**
 * @class The Castle Scene will have a user interface.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethCastleInterface(parameterObject) {
  parameterObject.columns = 2;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  { // RetroC64AkalabethCastleInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_CASTLE_NAME_ENTRY]] = {
      group: null,
      children: [
        {
          comment: "BEGIN NAMELESS GREETING",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WELCOME PEASANT INTO THE HALLS OF", // text
          ],
          position: [0.5, 2],
          tint: 10920447
        },
        {
          comment: "BEGIN NAMELESS GREETING",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "THE MIGHTY LORD BRITISH.", // text
          ],
          position: [0.5, 3],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "HEREIN THOU MAY CHOOSE TO", // text
          ],
          position: [0.5, 4],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "DARE BATTLE WITH THE EVIL", // text
          ],
          position: [0.5, 5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "CREATURES OF THE DEPTHS,", // text
          ],
          position: [0.5, 6],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "FOR GREAT REWARD!", // text
          ],
          position: [0.5, 7],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WHAT IS THY NAME PEASANT? ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 9
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "nameInputLabel"
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
              fixed: -0.5,
              offset: {
                pixel: 2,
                field: "nameInputLabel"
              }
            },
            y: 9
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "nameInputField"
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
          position: {
            x: {
              fixed: -0.5,
              offset: {
                field: "nameInputField"
              }
            },
            y: 9
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor1"
        }
      ]
    };
    this._VIEWS[[RetroC64Constants.AKALABETH_CASTLE_GOAL_ENTRY]] = {
      group: null,
      children: [
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WELCOME PEASANT INTO THE HALLS OF", // text
          ],
          position: [0.5, 2],
          tint: 10920447
        },
        {
          comment: "BEGIN NAMELESS GREETING",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "THE MIGHTY LORD BRITISH.", // text
          ],
          position: [0.5, 3],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "HEREIN THOU MAY CHOOSE TO", // text
          ],
          position: [0.5, 4],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "DARE BATTLE WITH THE EVIL", // text
          ],
          position: [0.5, 5],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "CREATURES OF THE DEPTHS,", // text
          ],
          position: [0.5, 6],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "FOR GREAT REWARD!", // text
          ],
          position: [0.5, 7],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "WHAT IS THY NAME PEASANT? ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 9
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "nameInputLabel2"
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
              fixed: -0.5,
              offset: {
                pixel: 2,
                field: "nameInputLabel2"
              }
            },
            y: 9
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "nameInputField2"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "DOEST THOU WISH FOR GRAND ADVENTURE? ", // text
          ],
          position: {
            x: {
              fixed: -0.5,
              offset: 2
            },
            y: 10
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "goalInputLabel"
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
              fixed: -0.5,
              offset: {
                pixel: 2,
                field: "goalInputLabel"
              }
            },
            y: 10
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "goalInputField"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 12],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel1"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 13],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel2"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 14],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel3"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 15],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel4"
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
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel5"
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
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel6"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 18],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel7"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 19],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel8"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 20],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel9"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 21],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel10"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 22],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "goalMessageLabel11"
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
          position: {
            x: {
              fixed: -0.5,
              offset: {
                field: "goalInputField"
              }
            },
            y: 9
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor2"
        }
      ]
    };
    this._VIEWS[[RetroC64Constants.AKALABETH_CASTLE_QUEST_INCOMPLETE]] = {
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
          position: [0.5, 2],
          tint: 10920447,
          dynamicField: "nameLineField3"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 3],
          tint: 10920447,
          dynamicField: "taskLineField3"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "GO NOW AND COMPLETE THY QUEST!", // text
          ],
          position: [0.5, 4],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "PRESS -SPACE- TO CONT.", // text
          ],
          position: [0.5, 6],
          tint: 10920447
        }
      ]
    };
    this._VIEWS[[RetroC64Constants.AKALABETH_CASTLE_QUEST_COMPLETE]] = {
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
          position: [0.5, 4],
          tint: 10920447,
          dynamicField: "nameLineField4"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "THOU HAST ACOMPLISHED THY QUEST!", // text
          ],
          position: [0.5, 6],
          tint: 10920447,
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "UNFORTUNATELY, THIS IS NOT ENOUGH TO", // text
          ],
          position: [0.5, 7],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "BECOME A KNIGHT.", // text
          ],
          position: [0.5, 8],
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
          position: [0.5, 10],
          tint: 10920447,
          dynamicField: "taskLineField4"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "GO NOW UPON THIS QUEST, AND MAY", // text
          ],
          position: [0.5, 12],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "LADY LUCK BE FAIR UNTO YOU.....", // text
          ],
          position: [0.5, 13],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            ".....ALSO I, BRITISH, HAVE INCREASED", // text
          ],
          position: [0.5, 14],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "EACH OF THY ATTRIBUTES BY ONE!", // text
          ],
          position: [0.5, 15],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "PRESS -SPACE- TO CONT.", // text
          ],
          position: [0.5, 17],
          tint: 10920447
        }
      ]
    };
    this._VIEWS[[RetroC64Constants.AKALABETH_CASTLE_GAME_COMPLETE]] = {
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
          position: [0.5, 4],
          tint: 10920447,
          dynamicField: "nameLineField5"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "THOU HAST PROVED THYSELF WORTHY", // text
          ],
          position: [0.5, 6],
          tint: 10920447,
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "OF KNIGHTHOOD, CONTINUE PLAY IF THOU", // text
          ],
          position: [0.5, 7],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "DOTH WISH, BUT THOU HAST ACOMPLISHED", // text
          ],
          position: [0.5, 8],
          tint: 10920447
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "THE MAIN OBJECTIVE OF THIS GAME...", // text
          ],
          position: [0.5, 9],
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
          position: [0.5, 11],
          tint: 10920447,
          dynamicField: "completionField1"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [0.5, 12],
          tint: 10920447,
          dynamicField: "completionField2"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "PRESS -SPACE- TO CONT.", // text
          ],
          position: [0.5, 14],
          tint: 10920447
        }
      ]
    };
  }
  { // RetroC64AkalabethCastleInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CASTLE_NAME_ENTRY]] = function(event, context) {
      if (event.key.length > 1) {
        switch (event.key) {
          case "Backspace":
            RetroC64AkalabethCastleScene.nameEntry.length = Math.max(0, RetroC64AkalabethCastleScene.nameEntry.length - 1);
            context._dynamicFields.setText("nameInputField", RetroC64AkalabethCastleScene.nameEntry.join(""));
            context.moveCursor("blinkingCursor1", "nameInputField");
            break;
          case "Enter":
            if (RetroC64AkalabethCastleScene.nameEntry.length > 0) {
              // reset the name field
              context._dynamicFields.setText("nameInputField", "");
              context.moveCursor("blinkingCursor1", "nameInputField");
              // set the name field on the next screen
              context._dynamicFields.setText("nameInputField2", RetroC64AkalabethCastleScene.nameEntry.join(""));
              // set the character's name to trigger move to next screen
              RetroC64AkalabethController.character.name = RetroC64AkalabethCastleScene.nameEntry.join("");
              // reset the name entry
              RetroC64AkalabethCastleScene.nameEntry.length = 0;
              { // set completion screen
                this._dynamicFields.setText("nameLineField5", ["LORD ", RetroC64AkalabethController.character.name].join(""));
                if (RetroC64AkalabethController.levelOfPlay === 10) {
                  context._dynamicFields.setText("completionField1", "...CALL CALIFORNIA PACIFIC COMPUTER AT");
                  context._dynamicFields.setText("completionField2", "(415)-569-9126 TO REPORT THIS AMAZING FEAT!");
                } else {
                  context._dynamicFields.setText("completionField1", "NOW MAYBE THOU ART FOOLHEARTY ENOUGH");
                  context._dynamicFields.setText("completionField2", ["TO TRY DIFFICULTY LEVEL ", RetroC64AkalabethController.levelOfPlay + 1].join(""));
                }
              }
            }
            break;
        }
      } else {
        let matches = event.key.match(/^[a-z 0-9]+$/i);
        if (matches !== null) {
          if (RetroC64AkalabethCastleScene.nameEntry.length < RetroC64AkalabethCastleScene.MAX_NAME_LEN) {
            RetroC64AkalabethCastleScene.nameEntry.push(event.key.toUpperCase());
            context._dynamicFields.setText("nameInputField", RetroC64AkalabethCastleScene.nameEntry.join(""));
            context.moveCursor("blinkingCursor1", "nameInputField");
          } else if (RetroC64AkalabethCastleScene.nameEntry.length >= RetroC64AkalabethCastleScene.MAX_NAME_LEN) {
            RetroC64AkalabethCastleScene.nameEntry[RetroC64AkalabethCastleScene.MAX_NAME_LEN - 1] = event.key.toUpperCase();
            context._dynamicFields.setText("nameInputField", RetroC64AkalabethCastleScene.nameEntry.join(""));
            context.moveCursor("blinkingCursor1", "nameInputField");
          }
        }
      }
    };
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CASTLE_GOAL_ENTRY]] = function(event, context) {
      if (context._dynamicFields.getText("goalInputField").length === 0) {
        switch (event.key) {
          case "Y":
          case "y":
            // player said yes - update the field
            context._dynamicFields.setText("goalInputField", "YES");
            // hide the cursor
            context._grid.placeAt(-1, 1, context._dynamicFields.getObject("blinkingCursor2")[0]);
            RetroC64AkalabethController.character.task = Math.max(0, Math.floor(RetroC64AkalabethController.character.wisdom / 3) - 1);
            let article = "A";
            if (RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task].name.charAt(0).match(/^[aeiou]+$/i) !== null) {
              article = "AN";
            }
            // add a new message
            context._dynamicFields.setText("goalMessageLabel1", "GOOD! THOU SHALT TRY TO BECOME A");
            context._dynamicFields.setText("goalMessageLabel2", "KNIGHT!!!");
            context._dynamicFields.setText("goalMessageLabel3", "THY FIRST TASK IS TO GO INTO THE");
            context._dynamicFields.setText("goalMessageLabel4", "DUNGEONS AND TO RETURN ONLY AFTER");
            context._dynamicFields.setText("goalMessageLabel5", ["KILLING ", article, " ", RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task].name, "."].join(""));
            context._dynamicFields.setText("goalMessageLabel6", "GO NOW UPON THIS QUEST, AND MAY");
            context._dynamicFields.setText("goalMessageLabel7", "LADY LUCK BE FAIR UNTO YOU.....");
            context._dynamicFields.setText("goalMessageLabel8", ".....ALSO I, BRITISH, HAVE INCREASED");
            context._dynamicFields.setText("goalMessageLabel9", "EACH OF THY ATTRIBUTES BY ONE!");
            context._dynamicFields.setText("goalMessageLabel11", "PRESS -SPACE- TO CONT.");
            break;
          case "N":
          case "n":
            // player said no - update the field
            context._dynamicFields.setText("goalInputField", "NO");
            // hide the cursor
            context._grid.placeAt(-1, 1, context._dynamicFields.getObject("blinkingCursor2")[0]);
            context._dynamicFields.setText("goalMessageLabel1", "THEN LEAVE AND BEGONE!"); 
            context._dynamicFields.setText("goalMessageLabel3", "PRESS -SPACE- TO CONT.");
            break;
        }
      } else {
        // player already said Yes or No
        let callback = function() { // NO
          // clear all fields
          this._dynamicFields.setText("nameInputField2", "");
          this._dynamicFields.setText("goalInputField", "");
          this._dynamicFields.setText("goalMessageLabel1", "");
          this._dynamicFields.setText("goalMessageLabel2", "");
          this._dynamicFields.setText("goalMessageLabel3", "");
          this._dynamicFields.setText("goalMessageLabel4", "");
          this._dynamicFields.setText("goalMessageLabel5", "");
          this._dynamicFields.setText("goalMessageLabel6", "");
          this._dynamicFields.setText("goalMessageLabel7", "");
          this._dynamicFields.setText("goalMessageLabel8", "");
          this._dynamicFields.setText("goalMessageLabel9", "");
          this._dynamicFields.setText("goalMessageLabel10", "");
          this._dynamicFields.setText("goalMessageLabel11", "");
          // move the cursor
          this.moveCursor("blinkingCursor2", "goalInputField");
          // clear the player's name
          RetroC64AkalabethController.character.name = "";
          // go back to the map
          RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_WORLD_MAP });
        };
        if (context._dynamicFields.getText("goalInputField") === "YES") {
          callback = function() {
            { // clear all fields
              this._dynamicFields.setText("nameInputField2", "");
              this._dynamicFields.setText("goalInputField", "");
              this._dynamicFields.setText("goalMessageLabel1", "");
              this._dynamicFields.setText("goalMessageLabel2", "");
              this._dynamicFields.setText("goalMessageLabel3", "");
              this._dynamicFields.setText("goalMessageLabel4", "");
              this._dynamicFields.setText("goalMessageLabel5", "");
              this._dynamicFields.setText("goalMessageLabel6", "");
              this._dynamicFields.setText("goalMessageLabel7", "");
              this._dynamicFields.setText("goalMessageLabel8", "");
              this._dynamicFields.setText("goalMessageLabel9", "");
              this._dynamicFields.setText("goalMessageLabel10", "");
              this._dynamicFields.setText("goalMessageLabel11", "");
            }
            // move the cursor
            this.moveCursor("blinkingCursor2", "goalInputField");
            { // set the incomplete screen
              this._dynamicFields.setText("nameLineField3", [RetroC64AkalabethController.character.name, " WHY HAST THOU RETURNED?"].join(""));
              let article = "A";
              if (RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task].name.charAt(0).match(/^[aeiou]+$/i) !== null) {
                article = "AN";
              }
              context._dynamicFields.setText("taskLineField3", ["THOU MUST KILL ", article, " ", RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task].name, "."].join(""));
            }
      
            { // set the complete screen
              this._dynamicFields.setText("nameLineField4", ["AAHH!!.....", RetroC64AkalabethController.character.name].join(""));
              let article = "A";
              if (RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task + 1].name.charAt(0).match(/^[aeiou]+$/i) !== null) {
                article = "AN";
              }
              context._dynamicFields.setText("taskLineField4", ["NOW THOU MUST KILL ", article, " ", RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task + 1].name, "."].join(""));
            }
            // set the flag
            RetroC64AkalabethCastleScene.goalsStated = true;
            // boost the player's stats
            RetroC64AkalabethController.character.hitPoints++;
            RetroC64AkalabethController.character.strength++;
            RetroC64AkalabethController.character.dexterity++;
            RetroC64AkalabethController.character.stamina++;
            RetroC64AkalabethController.character.wisdom++;
            RetroC64AkalabethController.character.gold++;
            // go back to the map
            RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_WORLD_MAP });
          }
        }
        // set a delay before clearing the screen
        context._scene.time.delayedCall(
          375, // milliseconds
          callback, // callback function
          [], // args
          context // the scope object
        ); 
      }
    };
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CASTLE_QUEST_COMPLETE]] = function(event, context) {
      // set a delay before clearing the screen
      context._scene.time.delayedCall(
        375, // milliseconds
        function () {
          // next quest
          RetroC64AkalabethController.character.task = Math.abs(RetroC64AkalabethController.character.task) + 1;
          { // set the incomplete screen
            this._dynamicFields.setText("nameLineField3", [RetroC64AkalabethController.character.name, " WHY HAST THOU RETURNED?"].join(""));
            let article = "A";
            if (RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task].name.charAt(0).match(/^[aeiou]+$/i) !== null) {
              article = "AN";
            }
            context._dynamicFields.setText("taskLineField3", ["THOU MUST KILL ", article, " ", RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task].name, "."].join(""));
          }
      
          { // set the complete screen
            if (RetroC64AkalabethController.character.task < 9) {
              this._dynamicFields.setText("nameLineField4", ["AAHH!!.....", RetroC64AkalabethController.character.name].join(""));
              let article = "A";
              if (RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task + 1].name.charAt(0).match(/^[aeiou]+$/i) !== null) {
                article = "AN";
              }
              context._dynamicFields.setText("taskLineField4", ["NOW THOU MUST KILL ", article, " ", RetroC64AkalabethController.monsters[RetroC64AkalabethController.character.task + 1].name, "."].join(""));
            }
          }
          // boost the player's stats
          RetroC64AkalabethController.character.hitPoints++;
          RetroC64AkalabethController.character.strength++;
          RetroC64AkalabethController.character.dexterity++;
          RetroC64AkalabethController.character.stamina++;
          RetroC64AkalabethController.character.wisdom++;
          RetroC64AkalabethController.character.gold++;
          // go back to the map
          RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_WORLD_MAP });
        }, // callback function
        [], // args
        context // the scope object
      );
    };
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CASTLE_QUEST_INCOMPLETE]] = function(event, context) {
      // set a delay before clearing the screen
      context._scene.time.delayedCall(
        375, // milliseconds
        function () {          
          // go back to the map
          RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_WORLD_MAP });
        }, // callback function
        [], // args
        context // the scope object
      );
    };
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_CASTLE_GAME_COMPLETE]] = function(event, context) {
      // set a delay before clearing the screen
      context._scene.time.delayedCall(
        375, // milliseconds
        function () {
          // go back to the map
          RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_WORLD_MAP });
        }, // callback function
        [], // args
        context // the scope object
      );
    };
  }
  this._state = RetroC64Constants.AKALABETH_CASTLE_NAME_ENTRY;
};
RetroC64AkalabethCastleInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethCastleInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethCastleInterface Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethCastleInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethCastleInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethCastleInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethCastleInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethCastleInterface.prototype.create = function(data) {
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
    this.moveCursor("blinkingCursor1", "nameInputField");
    
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
    this.moveCursor("blinkingCursor2", "goalInputField");
    RetroC64AkalabethController.character.addWatcher(this);
    RetroC64AkalabethController.character.notifyWatchers();
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethCastleInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethCastleInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Handles updates to a Watchable instance.
 * @param {Watchable} data the Watchable instance being updated
 */
RetroC64AkalabethCastleInterface.prototype.watchUpdated = function(data) {
  if (data.name.length > 0) {
    if (!RetroC64AkalabethCastleScene.goalsStated) {
      // name was entered but no goals, state is goal entry
      this._state = RetroC64Constants.AKALABETH_CASTLE_GOAL_ENTRY;
      this._stateChangeResolved = false;
    } else {
      if (data.task >= 0) {
        // name was entered and has goal, but task incomplete
        this._state = RetroC64Constants.AKALABETH_CASTLE_QUEST_INCOMPLETE;
        this._stateChangeResolved = false;
      } else {
        if (data.task > -9 && data.task < 0) {
          this._state = RetroC64Constants.AKALABETH_CASTLE_QUEST_COMPLETE;
          this._stateChangeResolved = false;
        } else if (data.task === -9) {
          this._state = RetroC64Constants.AKALABETH_CASTLE_GAME_COMPLETE;
          this._stateChangeResolved = false;
        }
      }
    }
  } else {
    // no name, state is name entry
    this._state = RetroC64Constants.AKALABETH_CASTLE_NAME_ENTRY;
    this._stateChangeResolved = false;
  }
}
/**
 * Moves the cursor to the right of a specific field.
 * @param {string} cursorId the cursor sprite's unique id
 * @param {string} offsetField the id of the field the cursor will be placed next to
 */
RetroC64AkalabethCastleInterface.prototype.moveCursor = function(cursorId, offsetField) {
  // get the offset field's right edge, plus 2 pixels
  let x = (this._dynamicFields.getObject(offsetField)[0].x + this._dynamicFields.getObject(offsetField)[0].width + 2) / this._COLUMN_WIDTH;
  // subtract 1/2 unit
  x += -0.5;
  // get the offset field's y location, minus 1 pixel height
  let y = (this._dynamicFields.getObject(offsetField)[0].y - 1) / this._ROW_HEIGHT;
  // move the y position based on the offset field's origin
  y -= this._dynamicFields.getObject(offsetField)[0].originY;
  this._grid.placeAt(x, y, this._dynamicFields.getObject(cursorId)[0]);
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethCastleInterface };
}
