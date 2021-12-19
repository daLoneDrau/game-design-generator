if (typeof(module) !== "undefined") {
  var { RetroC64Constants } = require("../../../config/retroc64-constants");
  var { RetroC64AkalabethController } = require("../../../services/akalabeth/retroc64-akalabeth-controller");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
  var { RetroC64AkalabethDungeonScene } = require("./retroc64-akalabeth-dungeon-scene");
  var { UiScene, Dice } = require("../../../../../assets/js/rpgbase.full");
}
/**
 * @class The Dungeon View will have a separate scene instance to handle rendering the user interface
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethDungeonInterface(parameterObject) {
  parameterObject.columns = 10;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private A flag to watch when an action has been taken has been added. Default is true, as entering the dungeon is an action. */
  this._actionTaken = true;
  { // RetroC64AkalabethDungeonInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = {
      group: null,
      children: [
        /**
         * COMMANDS LEGEND
         */
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "COMMANDS", // text
          ],
          position: [8, 5],
          origin: [0.5, 0.5],
          tint: 10920447,
        },
        {
          comment: "COMMAND FORWARD",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE25E-FORWARD", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 6
          },
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          comment: "LEFT ARROW",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE25E", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 7
          },
          origin: [0.5, 0],
          angle: [270],
          tint: 10920447,
          dynamicField: "leftArrow"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-TURN LEFT", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "leftArrow",
                pixel: -38
              }
            },
            y: 7
          },
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: "RIGHT ARROW",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE25E", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 8
          },
          origin: [0.5, 1],
          angle: [90],
          tint: 10920447,
          dynamicField: "rightArrow"
        },
        {
          comment: "RIGHT ARROW LABEL",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-TURN RIGHT", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "rightArrow",
                pixel: -38
              }
            },
            y: 8
          },
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: "DOWN ARROW",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE25E", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 9
          },
          origin: [1, 0.5],
          angle: [180],
          tint: 10920447,
          dynamicField: "downArrow"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-TURN AROUND", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "downArrow",
                pixel: -38
              }
            },
            y: 9
          },
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: "COMMAND CLIMB",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE243-CLIMB UP/DOWN", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 10
          },
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          comment: "COMMAND STATS",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE253-STATS", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 11
          },
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: "COMMAND ATTACK",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE241-ATTACK", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 12
          },
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          comment: "COMMAND FORWARD",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE250-PAUSE", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: -38
            },
            y: 13
          },
          origin: [0, 0.5],
          tint: 10920447,
        },        
        /**
         * STATS
         */
        {
          comment: "FACING LABEL",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "FACING", // text
          ],
          position: [7, 19],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "facingLabel"
        },
        {
          comment: "FACING VALUE",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "=", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "facingLabel",
              }
            },
            y: 19
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "facingValue"
        },
        {
          comment: "LEVEL LABEL",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "LEVEL", // text
          ],
          position: [7, 20],
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          comment: "LEVEL VALUE",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "=", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "facingLabel",
              }
            },
            y: 20
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "levelValue"
        },
        {
          comment: "FOOD LABEL",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "FOOD", // text
          ],
          position: [7, 21],
          origin: [0, 0.5],
          tint: 10920447
        },
        {
          comment: "FOOD VALUE",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "=", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "facingLabel",
              }
            },
            y: 21
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "foodValue"
        },
        {
          comment: "HP LABEL",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "H.P.", // text
          ],
          position: [7, 22],
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          comment: "HP VALUE",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "=", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "facingLabel",
              }
            },
            y: 22
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "hpValue"
        },
        {
          comment: "GOLD LABEL",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "GOLD", // text
          ],
          position: [7, 23],
          origin: [0, 0.5],
          tint: 10920447,
        },
        {
          comment: "GOLD VALUE",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "=", // text
          ],
          position: {
            x: {
              fixed: 7,
              offset: {
                field: "facingLabel",
              }
            },
            y: 23
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "goldValue"
        },
        /**
         * COMMANDS + HISTORY
         */
        {
          comment: "COMMAND PROMPT",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [-0.5, 19],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "commandHistory3"
        },
        {
          comment: "COMMAND PROMPT",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [-0.5, 20],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "commandHistory2"
        },
        {
          comment: "COMMAND PROMPT",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [-0.5, 21],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "commandHistory1"
        },
        {
          comment: "COMMAND PROMPT",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "", // text
          ],
          position: [-0.5, 22],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "commandHistory0"
        },
        {
          comment: "COMMAND PROMPT",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            " COMMAND? ", // text
          ],
          position: [-0.5, 23],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "promptField"
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
                field: "promptField",
                pixel: 2
              }
            },
            y: {
              fixed: 23,
              offset: -1
            }
          },
          origin: [0, 0.5],
          dynamicField: "blinkingCursor"
        }
      ]
    };
  }
  { // RetroC64AkalabethDungeonInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = function(event, context) {
      if (!RetroC64AkalabethDungeonScene.animationPlaying) {
        switch (event.key) {
          case "ArrowUp":
            context.forward();
            break;
          case "ArrowDown":
            context.turnAround();
            break;
          case "ArrowLeft":
            context.turnLeft();
            break;
          case "ArrowRight":
            context.turnRight();
            break;
          case " ":
            // change the COMMAND PROMPT text
            context._dynamicFields.setText("promptField", " COMMAND? PASS");
            // move the cursor
            context.moveCursor();
            // set move entered to anything > 0. this starts the animation sequence
            RetroC64AkalabethDungeonScene.moveEntered = 9999; // fake animation sequence
            // start a timer to send the pass message after 375 ms and then update the screen after 375 more ms
            context._scene.time.delayedCall(
              750, // milliseconds
              function() {
                this.recordHistory();
                this._dynamicFields.setText("promptField", " COMMAND? ");
                this.moveCursor();
                this._actionTaken = true;
              }, // callback function
              [], // args
              context // the scope object
            );
            break;
          case "P":
          case "p":
            // change the COMMAND PROMPT text
            if (RetroC64AkalabethController.pauseOn) {
              context._dynamicFields.setText("promptField", " COMMAND? PAUSE OFF");
            } else {
              context._dynamicFields.setText("promptField", " COMMAND? PAUSE ON");
            }
            RetroC64AkalabethController.pauseOn = !RetroC64AkalabethController.pauseOn;
            // move the cursor
            context.moveCursor();
            // set move entered to anything > 0. this starts the animation sequence
            RetroC64AkalabethWorldMapScene.moveEntered = 9999; // fake animation sequence
            // start a timer to send the pass message after 375 ms and then update the screen after 375 more ms
            context._scene.time.delayedCall(
              750, // milliseconds
              function() {
                this.recordHistory();
                this._dynamicFields.setText("promptField", " COMMAND? ");
                this.moveCursor();
              }, // callback function
              [], // args
              context // the scope object
            );
            break;
          case "S":
          case "s":
            // change the COMMAND PROMPT text
            context._dynamicFields.setText("promptField", " COMMAND? STATS");
            // move the cursor
            context.moveCursor();
            // clear commands
            context.recordHistory();
            context._dynamicFields.setText("promptField", " COMMAND? ");
            context.moveCursor();
            // go to stats
            RetroC64AkalabethCharacterStatsScene.callbackState = RetroC64Constants.AKALABETH_DUNGEON;
            RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_CHARACTER_STATS });
            break;
          case "C":
          case "c":
            {
              switch (RetroC64AkalabethController.dungeon.getDungeonCell(RetroC64AkalabethController.dungeon.px, RetroC64AkalabethController.dungeon.py).occupant) {
                case 7:
                case 9:
                  // climb down
                  // change the COMMAND PROMPT text
                  context._dynamicFields.setText("promptField", " COMMAND? CLIMB DOWN");
                  // move the cursor
                  context.moveCursor();
                  // go to shop screen in 375 ms
                  context._scene.time.delayedCall(
                    context._delay * 0.5, // milliseconds
                    function() {
                      // clear commands
                      this.recordHistory();
                      this._dynamicFields.setText("promptField", " COMMAND? ");
                      this.moveCursor();
                      RetroC64AkalabethController.levelsUnderground++;
                      RetroC64AkalabethController.dungeon.newDungeonLevel();
                      this._actionTaken = true;
                      RetroC64AkalabethDungeonScene.needsMapRedraw = true;
                    }, // callback function
                    [], // args
                    context // the scope object
                  );
                  break;
                case 4:
                  // change the COMMAND PROMPT text
                  context._dynamicFields.setText("promptField", " COMMAND? GO DUNGEON");
                  // move the cursor
                  context.moveCursor();
                  // go to shop screen in 375 ms
                  context._scene.time.delayedCall(
                    375, // milliseconds
                    function() {
                      // clear commands
                      this.recordHistory();
                      this._dynamicFields.setText("promptField", " COMMAND? ");
                      this.moveCursor();
                      // go to dungeon
                      RetroC64SceneController.gotoState({
                        state: RetroC64Constants.AKALABETH_DUNGEON,
                        actions: [
                          function() {
                            // do not delay this call, since it needs to process when hitting the dungeon scene
                            // set direction facing and player location
                            RetroC64AkalabethController.levelsUnderground = 1;
                            RetroC64AkalabethController.dungeon.newDungeonLevel();
                            RetroC64AkalabethController.dungeon.dx = 1;
                            RetroC64AkalabethController.dungeon.dy = 0;
                            RetroC64AkalabethController.dungeon.px = 1;
                            RetroC64AkalabethController.dungeon.py = 1;
                            // signal to the dungeon scene that an action was taken and reduce the player's food
                          }
                        ]
                      });
                    }, // callback function
                    [], // args
                    context // the scope object
                  );
                  break;
                case 5:
                  // change the COMMAND PROMPT text
                  context._dynamicFields.setText("promptField", " COMMAND? GO CASTLE");
                  // move the cursor
                  context.moveCursor();
                  // go to shop screen in 375 ms
                  context._scene.time.delayedCall(
                    375, // milliseconds
                    function() {
                      // clear commands
                      this.recordHistory();
                      this._dynamicFields.setText("promptField", " COMMAND? ");
                      this.moveCursor();
                      // go to town
                      RetroC64AkalabethShopScene.callbackState = RetroC64Constants.AKALABETH_WORLD_MAP;
                      RetroC64SceneController.gotoState({
                        state: RetroC64Constants.AKALABETH_CASTLE,
                        actions: [
                          function() {
                            context._scene.time.delayedCall(
                              375, // milliseconds
                              function() { this._actionTaken = true; }, // callback function
                              [], // args
                              context // the scope object
                            )
                          }
                        ]
                      });
                    }, // callback function
                    [], // args
                    context // the scope object
                  );
                  break;
                default:
                  context.huh();
              }
            }
            break;
          case "Enter":
          case "Escape":
            context.huh();
            break;
          default:
            // change the COMMAND PROMPT text
            context._dynamicFields.setText("promptField", [" COMMAND? ", event.key].join(""));
            // move the cursor
            context.moveCursor();
            context.huh();
        }
      }
    };
  }
  this._state = RetroC64Constants.AKALABETH_DUNGEON_MAIN;
  this._delay = 500;
};
RetroC64AkalabethDungeonInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethDungeonInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethDungeonInterface Getters/Setters
  /**
   * Setter for field _actionTaken.
   * @param {PropertyKey} value the value
   */
  Object.defineProperty(RetroC64AkalabethDungeonInterface.prototype, 'actionTaken', {
    set(value) {
      if (typeof(value) !== "boolean") {
        throw ["Invalid value", value];
      }
      this._actionTaken = value;;
    }
  });
}
/**
 * Starts the scene.
 */
RetroC64AkalabethDungeonInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethDungeonInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethDungeonInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethDungeonInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethDungeonInterface.prototype.create = function(data) {
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
    RetroC64AkalabethController.character.addWatcher(this);
    RetroC64AkalabethController.character.notifyWatchers(); 
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethDungeonInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
    if (this._actionTaken) {
      this.eatFood();
      this._actionTaken = false;
    }
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethDungeonInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Moves the cursor to the end of the command prompt line.
 */
RetroC64AkalabethDungeonInterface.prototype.moveCursor = function() {
  let x = -0.5 + this._dynamicFields.getObject("promptField")[0].width / this._COLUMN_WIDTH; // to the right of the prompt message
  x += 2 / this._COLUMN_WIDTH; // add 2px buffer
  let y = 23 - 1 / this._ROW_HEIGHT; // move up 1 pixel (looks better);
  this._grid.placeAt(x, y, this._dynamicFields.getObject("blinkingCursor")[0]);
}
/**
 * Records command history on-screen.
 */
RetroC64AkalabethDungeonInterface.prototype.recordHistory = function() {
  this._dynamicFields.setText("commandHistory3", this._dynamicFields.getText("commandHistory2"));
  this._dynamicFields.setText("commandHistory2", this._dynamicFields.getText("commandHistory1"));
  this._dynamicFields.setText("commandHistory1", this._dynamicFields.getText("commandHistory0"));
  this._dynamicFields.setText("commandHistory0", this._dynamicFields.getText("promptField"));
}
/**
 * Handles updates to a Watchable instance.
@param {Watchable} data the Watchable instance being updated.
 */
RetroC64AkalabethDungeonInterface.prototype.watchUpdated = function(data) {
  // call base
  Watcher.prototype.watchUpdated.call(this, data);
  // update fields
  let facing = "EAST";
  if (RetroC64AkalabethController.dungeon.dx < 0) {
    facing = "WEST";
  } else if (RetroC64AkalabethController.dungeon.dy !== 0) {
    facing = "NORTH";
    if (RetroC64AkalabethController.dungeon.dy > 0) {
      facing = "SOUTH";
    }
  }
  this._dynamicFields.setText("facingValue", ["=", facing].join(""));
  this._dynamicFields.setText("levelValue", ["=", RetroC64AkalabethController.levelsUnderground].join(""));
let foodValue = data.getNumberInInventory("FOOD");
if (Number(foodValue) === foodValue && foodValue % 1 !== 0) {
  foodValue = foodValue.toFixed(1);
}
this._dynamicFields.setText("foodValue", ["=", foodValue].join(""));
  this._dynamicFields.setText("hpValue",   ["=", data.hitPoints].join(""));
  this._dynamicFields.setText("goldValue", ["=", data.gold].join(""));
}
/**
 * Handles the player eating food after an action.
 */
RetroC64AkalabethDungeonInterface.prototype.eatFood = function() {
  // add -0.1 food count
  RetroC64AkalabethController.character.addToInventory({ name: "FOOD", count: -0.1 });
  // check to see if player has enough food.
  if (RetroC64AkalabethController.character.getNumberInInventory("FOOD") > 0) {
    this._dynamicFields.setText("promptField", " COMMAND? ");
    this.moveCursor();
    // unfreeze controls
    RetroC64AkalabethDungeonScene.animationPlaying = false;
  } else {
    RetroC64AkalabethWorldMapScene.moveEntered = 9999; // fake animation sequence
    RetroC64AkalabethController.character.hitPoints = 0;
    // show message
    this._dynamicFields.setText("promptField", " YOU HAVE STARVED!!!!!");
    this.moveCursor();
    // go to game over screen in 1500 ms
    this._scene.time.delayedCall(
      1500, // milliseconds
      function() {
        // clear messages and history and reset the cursor
        this._dynamicFields.setText("commandHistory3", "");
        this._dynamicFields.setText("commandHistory2", "");
        this._dynamicFields.setText("commandHistory1", "");
        this._dynamicFields.setText("commandHistory0", "");
        this._dynamicFields.setText("promptField", " COMMAND? ");
        this.moveCursor();
  
        // go to game over scene
        RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_GAME_OVER }); // GAME OVER
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
RetroC64AkalabethDungeonInterface.prototype.openChest = function() {
  // remove the chest from the map
  RetroC64AkalabethController.dungeon.getDungeonCell(RetroC64AkalabethController.dungeon.px, RetroC64AkalabethController.dungeon.py).occupant = 0;
  // start a series of timed calls to reward the player and display message
  this._scene.time.delayedCall(
    this._delay * 0.25, // milliseconds
    function() {
      this.recordHistory();
      this._dynamicFields.setText("promptField", " GOLD!!!!!");
      this.moveCursor();
      // nested call to show the amount of gold found
      this._scene.time.delayedCall(
        this._delay * 0.25, // milliseconds
        function() {
          this.recordHistory();
          let gold = Dice.rollDie(5 * RetroC64AkalabethController.levelsUnderground) + RetroC64AkalabethController.levelsUnderground;
          this._dynamicFields.setText("promptField", [" ", gold, "-PIECES OF EIGHT"].join(""));
          RetroC64AkalabethController.character.gold += gold;
          this.moveCursor();
          // nested call to show the item found
          this._scene.time.delayedCall(
            this._delay * 0.25, // milliseconds
            function() {
              this.recordHistory();
              let item = Dice.getRandomMember([{ name: "FOOD", count: 1 }, { name: "RAPIER", count: 1 }, { name: "AXE", count: 1 }, { name: "SHIELD", count: 1 }, { name: "BOW AND ARROWS", count: 1 }, { name: "MAGIC AMULET", count: 1 }]);
              this._dynamicFields.setText("promptField", [" AND A ", item.name].join(""));
              RetroC64AkalabethController.character.addToInventory(item);
              this.moveCursor();
              // nested call to complete the move
              this._scene.time.delayedCall(
                this._delay * 0.25, // milliseconds
                function() {
                  this.recordHistory();
                  this._actionTaken = true;
                  RetroC64AkalabethDungeonScene.needsMapRedraw = true;
                }, // callback function
                [], // args
                this // the scope object
              );
            },
            [], // args
            this // the scope object
          )
        },
        [], // args
        this // the scope object
      )
    },
    [], // args
    this // the scope object
  );
}
RetroC64AkalabethDungeonInterface.prototype.isChestInPath = function() {
  let casting = RetroC64AkalabethController.dungeon.shadowCastQuadrant(5);
  let chestFound = false;
  for (let i = casting.length - 1; i >= 0; i--) {
    if ((casting[i].position === 8 || casting[i].position === 14 || casting[i].position === 22)
        && (casting[i].occupant === 5 || casting[i].occupant === 80)) {
      chestFound = true;
      break;
    }
    if (casting[i].position === 4 && casting[i].occupant === 5) {
      chestFound = true;
      break;
    }
  }
  return chestFound;
}
RetroC64AkalabethDungeonInterface.prototype.sendMessageBeforeAction = function(message, delayFraction, callback) {
  this._scene.time.delayedCall(
    this._delay * delayFraction, // milliseconds
    function() {
      this.recordHistory();
      this._dynamicFields.setText("promptField", message);
      this.moveCursor();
      callback();
    }, // callback function
    [], // args
    this // the scope object
  );
}
/**
 * Moves the player forward.
 */
RetroC64AkalabethDungeonInterface.prototype.forward = function() {
  // freeze controls
  RetroC64AkalabethDungeonScene.animationPlaying = false;
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? FORWARD");
  // move the cursor
  this.moveCursor();
  // enter the move
  RetroC64AkalabethDungeonScene.moveEntered = 1;
  // check the next position
  let newPosition = RetroC64AkalabethController.dungeon.getDungeonCell(
    RetroC64AkalabethController.dungeon.px + RetroC64AkalabethController.dungeon.dx,
    RetroC64AkalabethController.dungeon.py + RetroC64AkalabethController.dungeon.dy
  );
  if (newPosition.occupant !== 1 && newPosition.occupant < 10) {
    // move the player forward
    RetroC64AkalabethController.dungeon.px += RetroC64AkalabethController.dungeon.dx;
    RetroC64AkalabethController.dungeon.py += RetroC64AkalabethController.dungeon.dy;
    // is this a chest?
    if (newPosition.occupant === 5) {
      this.openChest();
    } else if (newPosition.occupant === 3) {
      // send the message and then continue the move
      let that = this;
      this.sendMessageBeforeAction(" *SECRET PASSAGE*", 0.5, function() {
        that._scene.time.delayedCall(
          that._delay * 0.5, // milliseconds
          function() {
            this.recordHistory();
            this._actionTaken = true;
            RetroC64AkalabethDungeonScene.needsMapRedraw = true;
          }, // callback function
          [], // args
          that // the scope object
        )
      });
    } else if (newPosition.occupant === 2) {
      // send the message and then continue the move
      this._scene.time.delayedCall(
        this._delay * 0.3333, // milliseconds
        function() {
          this.recordHistory();
          this._dynamicFields.setText("promptField", " AAARRRGGGHHH!!! A TRAP!");
          this.moveCursor();
          // nested call to show the amount of gold found
          this._scene.time.delayedCall(
            this._delay * 0.3333, // milliseconds
            function() {
              this.recordHistory();
              this._dynamicFields.setText("promptField", [" FALLING TO LEVEL ", RetroC64AkalabethController.levelsUnderground + 1].join(""));
              RetroC64AkalabethController.levelsUnderground++;
              RetroC64AkalabethController.dungeon.newDungeonLevel();
              RetroC64AkalabethController.dungeon.dx = 1;
              RetroC64AkalabethController.dungeon.dy = 0;
              RetroC64AkalabethController.dungeon.px = 1;
              RetroC64AkalabethController.dungeon.py = 1;
              this.moveCursor();
              // nested call to show the item found
              this._scene.time.delayedCall(
                this._delay * 0.3333, // milliseconds
                function() {
                  this.recordHistory();
                  this._actionTaken = true;
                  RetroC64AkalabethDungeonScene.needsMapRedraw = true;
                },
                [], // args
                this // the scope object
              )
            },
            [], // args
            this // the scope object
          )
        },
        [], // args
        this // the scope object
      );
    } else {
      // is there a chest (or mimic) in our path?
      if (this.isChestInPath()) {
        // send the message and then continue the move
        let that = this;
        this.sendMessageBeforeAction(" *CHEST*", 0.5, function() {
          that._scene.time.delayedCall(
            that._delay * 0.5, // milliseconds
            function() {
              this.recordHistory();
              this._actionTaken = true;
              RetroC64AkalabethDungeonScene.needsMapRedraw = true;
            }, // callback function
            [], // args
            that // the scope object
          )
        });
      } else {
        // start a timer to update the screen after 750 ms (about the time of the animation)
        this._scene.time.delayedCall(
          this._delay, // milliseconds
          function() {
            this.recordHistory();
            this._actionTaken = true;
            RetroC64AkalabethDungeonScene.needsMapRedraw = true;
          }, // callback function
          [], // args
          this // the scope object
        );
      }
    }
  } else {
    // start a timer to send the error message after 375 ms and then update the screen after 375 more ms
    let that = this;
    this.sendMessageBeforeAction(" \uE242\uE255\uE24D\uE250", 0.5, function() {
      that._scene.time.delayedCall(
        that._delay * 0.5, // milliseconds
        function() {
          this.recordHistory();
          this._actionTaken = true;
          RetroC64AkalabethDungeonScene.needsMapRedraw = true;
        }, // callback function
        [], // args
        that // the scope object
      )
    });
  }
}
/**
 * Handles the player turning left.
 */
RetroC64AkalabethDungeonInterface.prototype.turnLeft = function() {
  // freeze controls
  RetroC64AkalabethDungeonScene.animationPlaying = true;
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? TURN LEFT");
  // move the cursor
  this.moveCursor();
  // enter the move and freeze input
  RetroC64AkalabethDungeonScene.moveEntered = 3;
  // change the player's direction
  if (RetroC64AkalabethController.dungeon.dx !== 0) {
    RetroC64AkalabethController.dungeon.dy = -RetroC64AkalabethController.dungeon.dx;
    RetroC64AkalabethController.dungeon.dx = 0;
  } else {
    RetroC64AkalabethController.dungeon.dx = RetroC64AkalabethController.dungeon.dy;
    RetroC64AkalabethController.dungeon.dy = 0;
  }
  if (this.isChestInPath()) {
    // send the message and then continue the move
    let that = this;
    this.sendMessageBeforeAction(" *CHEST*", 0.5, function() {
      that._scene.time.delayedCall(
        that._delay * 0.5, // milliseconds
        function() {
          this.recordHistory();
          this._actionTaken = true;
          RetroC64AkalabethDungeonScene.needsMapRedraw = true;
        }, // callback function
        [], // args
        that // the scope object
      )
    });
  } else {
    // start a timer to update the screen after 750 ms (about the time of the animation)
    this._scene.time.delayedCall(
      this._delay, // milliseconds
      function() {
        this.recordHistory();
        this._actionTaken = true;
        RetroC64AkalabethDungeonScene.needsMapRedraw = true;
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
/**
 * Handles the player turning right.
 */
RetroC64AkalabethDungeonInterface.prototype.turnRight = function() {
  // freeze controls
  RetroC64AkalabethDungeonScene.animationPlaying = true;
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? TURN RIGHT");
  // move the cursor
  this.moveCursor();
  // enter the move
  RetroC64AkalabethDungeonScene.moveEntered = 4;
  // change the player's direction
  if (RetroC64AkalabethController.dungeon.dx !== 0) {
    RetroC64AkalabethController.dungeon.dy = RetroC64AkalabethController.dungeon.dx;
    RetroC64AkalabethController.dungeon.dx = 0;
  } else {
    RetroC64AkalabethController.dungeon.dx = -RetroC64AkalabethController.dungeon.dy;
    RetroC64AkalabethController.dungeon.dy = 0;
  }
  if (this.isChestInPath()) {
    // send the message and then continue the move
    let that = this;
    this.sendMessageBeforeAction(" *CHEST*", 0.5, function() {
      that._scene.time.delayedCall(
        that._delay * 0.5, // milliseconds
        function() {
          this.recordHistory();
          this._actionTaken = true;
          RetroC64AkalabethDungeonScene.needsMapRedraw = true;
        }, // callback function
        [], // args
        that // the scope object
      )
    });
  } else {
    // start a timer to update the screen after 750 ms (about the time of the animation)
    this._scene.time.delayedCall(
      this._delay, // milliseconds
      function() {
        this.recordHistory();
        this._actionTaken = true;
        RetroC64AkalabethDungeonScene.needsMapRedraw = true;
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
/**
 * Handles the player turning around.
 */
RetroC64AkalabethDungeonInterface.prototype.turnAround = function() {
  // freeze controls
  RetroC64AkalabethDungeonScene.animationPlaying = true;
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? TURN AROUND");
  // move the cursor
  this.moveCursor();
  // enter the move
  RetroC64AkalabethDungeonScene.moveEntered = 4;
  // change the player's direction
  RetroC64AkalabethController.dungeon.dx = -RetroC64AkalabethController.dungeon.dx;
  RetroC64AkalabethController.dungeon.dy = -RetroC64AkalabethController.dungeon.dy;
  if (this.isChestInPath()) {
    // send the message and then continue the move
    let that = this;
    that.sendMessageBeforeAction(" *CHEST*", 0.5, function() {
      that._scene.time.delayedCall(
        that._delay * 0.5, // milliseconds
        function() {
          this.recordHistory();
          this._actionTaken = true;
          RetroC64AkalabethDungeonScene.needsMapRedraw = true;
        }, // callback function
        [], // args
        that // the scope object
      )
    });
  } else {
    // start a timer to update the screen after 750 ms (about the time of the animation)
    this._scene.time.delayedCall(
      this._delay, // milliseconds
      function() {
        this.recordHistory();
        this._actionTaken = true;
        RetroC64AkalabethDungeonScene.needsMapRedraw = true;
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
RetroC64AkalabethDungeonInterface.prototype.climb = function() {

}
/** 
 * Clears the scene.
 */
RetroC64AkalabethDungeonInterface.prototype.clear = function() {
  this._dynamicFields.setText("commandHistory3", "");
  this._dynamicFields.setText("commandHistory2", "");
  this._dynamicFields.setText("commandHistory1", "");
  this._dynamicFields.setText("commandHistory0", "");
  this._dynamicFields.setText("promptField", " COMMAND? ");
  this._actionTaken = true;
}
/**
 * Handles the player entering an invalid command.
 */
RetroC64AkalabethDungeonInterface.prototype.huh = function() {
  // freeze controls
  RetroC64AkalabethDungeonScene.animationPlaying = true;
  // set move entered to anything > 0. this starts the animation sequence
  RetroC64AkalabethDungeonScene.moveEntered = 9999; // fake animation sequence
  // start a timer to send the error message after 375 ms and then update the screen after 375 more ms
  this._scene.time.delayedCall(
    375, // milliseconds
    function() {
      this.recordHistory();
      this._dynamicFields.setText("promptField", " HUH?");
      this.moveCursor();
      this._scene.time.delayedCall(
        375, // milliseconds
        function() {
          // unfreeze controls
          RetroC64AkalabethDungeonScene.animationPlaying = false;
          this.recordHistory();
          this._dynamicFields.setText("promptField", " COMMAND? ");
          this.moveCursor();
        }, // callback function
        [], // args
        this // the scope object
      );
    }, // callback function
    [], // args
    this // the scope object
  );
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethDungeonInterface };
}
