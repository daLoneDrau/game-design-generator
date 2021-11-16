if (typeof(module) !== "undefined") {
  var { RetroC64Constants } = require("../../../config/retroc64-constants");
  var { RetroC64AkalabethDungeonScene } = require("../dungeon/retroc64-akalabeth-dungeon-scene");
  var { RetroC64AkalabethShopScene } = require("../shop/retroc64-akalabeth-shop-scene");
  var { RetroC64AkalabethController } = require("../../../services/akalabeth/retroc64-akalabeth-controller");
  var { RetroC64AkalabethWorldMapScene } = require("./retroc64-akalabeth-world-map-scene");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
}
/**
 * @class A Ui Scene class will be created to handle user interaction with the World Scene
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethWorldMapInterface(parameterObject) {
  parameterObject.columns = 8;
  parameterObject.rows = 24;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private A flag to watch when an action has been taken has been added. */
  this._actionTaken = false;
  { // RetroC64AkalabethWorldMapInterface View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_WORLD_MAP_DISPLAY]] = {
      group: null,
      children: [
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "COMMANDS", // text
          ],
          position: [6, 5],
          origin: [0.5, 0.5],
          tint: 10920447,
        },
        {
          comment: "COMMAND NORTH",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE25E", // text
          ],
          position: {
            x: {
              fixed: 6,
              offset: -2
            },
            y: 6
          },
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "northLabel1"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "|", // text
          ],
          position: [6, 7],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "northLabel2"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "NORTH", // text
          ],
          position: [6, 8],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "northLabel3"
        },
        {
          comment: "COMMAND WEST",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE25E", // text
          ],
          position: [5, 9],
          origin: [0.5, 0.5],
          angle: [270],
          tint: 10920447,
          dynamicField: "westLabelArrow"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "-WEST", // text
          ],
          position: {
            x: {
              fixed: 5,
              offset: {
                field: "westLabelArrow",
                pixel: -7
              }
            },
            y: 9
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "westLabel"
        },
        {
          comment: "COMMAND EAST",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "EAST-", // text
          ],
          position: {
            x: {
              fixed: 5.25,
              offset: {
                field: "westLabel",
                pixel: 10
              }
            },
            y: 9
          },
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "eastLabel"
        },
        {
          comment: "COMMAND EAST",
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
              offset: -6
            },
            y: 9
          },
          origin: [0.5, 0.5],
          angle: [90],
          tint: 10920447,
          dynamicField: "eastLabelArrow"
        },
        {
          comment: "COMMAND SOUTH",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "SOUTH", // text
          ],
          position: [6, 10],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "southLabel1"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "|", // text
          ],
          position: [6, 11],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "southLabel2"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE25E", // text
          ],
          position: {
            x: {
              fixed: 6,
              offset: -2
            },
            y: 12
          },
          origin: [0.5, 0.5],
          angle: [180],
          tint: 10920447,
          dynamicField: "southLabel3"
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
          position: [6, 13],
          origin: [0.5, 0.5],
          tint: 10920447
        },
        {
          comment: "COMMAND GO SHOP",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE247-GO TOWN", // text
          ],
          position: [6, 14],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "shopLabel"
        },
        {
          comment: "COMMAND GO DUNGEON",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE247-GO DUNGEON", // text
          ],
          position: [6, 14],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "dungeonLabel"
        },
        {
          comment: "COMMAND GO CASTLE",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\uE247-GO CASTLE", // text
          ],
          position: [6, 14],
          origin: [0.5, 0.5],
          tint: 10920447,
          dynamicField: "castleLabel"
        },
        {
          comment: "FOOD",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "FOOD=", // text
          ],
          position: [5, 21],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "foodField"
        },
        {
          comment: "HP",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "H.P=", // text
          ],
          position: [5, 22],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "hpField"
        },
        {
          comment: "GOLD",
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "GOLD=", // text
          ],
          position: [5, 23],
          origin: [0, 0.5],
          tint: 10920447,
          dynamicField: "goldField"
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
  { // RetroC64AkalabethWorldMapInterface Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_WORLD_MAP_DISPLAY]] = function(event, context) {
      if (!RetroC64AkalabethWorldMapScene.animationPlaying) {
        switch (event.key) {
          case "ArrowUp":
            context.moveNorth();
            break;
          case "ArrowDown":
            context.moveSouth();
            break;
          case "ArrowLeft":
            context.moveWest();
            break;
          case "ArrowRight":
            context.moveEast();
            break;
          case " ":
            // change the COMMAND PROMPT text
            context._dynamicFields.setText("promptField", " COMMAND? PASS");
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
            RetroC64AkalabethCharacterStatsScene.callbackState = RetroC64Constants.AKALABETH_WORLD_MAP;
            RetroC64SceneController.gotoState({ state: RetroC64Constants.AKALABETH_CHARACTER_STATS });
            break;
          case "G":
          case "g":
            {
              switch (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX]) {
                case 3:
                  // change the COMMAND PROMPT text
                  context._dynamicFields.setText("promptField", " COMMAND? GO TOWN");
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
                        state: RetroC64Constants.AKALABETH_EQUIPMENT_SHOP,
                        actions: [
                          function() {
                            // run this in a delayed call so the process to eat food happens after returning to the scene
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
                            RetroC64AkalabethController.world.levelsUnderground = 1;
                            RetroC64AkalabethController.world.newDungeonLevel();
                            RetroC64AkalabethController.world.dx = 1;
                            RetroC64AkalabethController.world.dy = 0;
                            RetroC64AkalabethController.world.px = 1;
                            RetroC64AkalabethController.world.py = 1;
                            // signal to the dungeon scene that an action was taken and reduce the player's food
                            RetroC64AkalabethDungeonScene.actionTaken = true;
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
          case " ":
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
  this._state = RetroC64Constants.AKALABETH_WORLD_MAP_DISPLAY;
};
RetroC64AkalabethWorldMapInterface.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethWorldMapInterface.prototype.constructor = UiScene;
{ // RetroC64AkalabethWorldMapInterface Getters/Setters
  /**
   * Setter for field _actionTaken.
   * @param {PropertyKey} value the value
   */
  Object.defineProperty(RetroC64AkalabethWorldMapInterface.prototype, 'actionTaken', {
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
RetroC64AkalabethWorldMapInterface.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethWorldMapInterface Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethWorldMapInterface.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethWorldMapInterface.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethWorldMapInterface.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    // start the cursor animation
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
  RetroC64AkalabethWorldMapInterface.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
    if (RetroC64AkalabethWorldMapScene.needsMapRedraw) {
      this.setCommands();
    }
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
RetroC64AkalabethWorldMapInterface.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Moves the cursor to the end of the command prompt line.
 */
RetroC64AkalabethWorldMapInterface.prototype.moveCursor = function() {
  let x = -0.5 + this._dynamicFields.getObject("promptField")[0].width / this._COLUMN_WIDTH; // to the right of the prompt message
  x += 2 / this._COLUMN_WIDTH; // add 2px buffer
  let y = 23 - 1 / this._ROW_HEIGHT; // move up 1 pixel (looks better);
  this._grid.placeAt(x, y, this._dynamicFields.getObject("blinkingCursor")[0]);
}
/**
 * Records command history on-screen.
 */
RetroC64AkalabethWorldMapInterface.prototype.recordHistory = function() {
  this._dynamicFields.setText("commandHistory2", this._dynamicFields.getText("commandHistory1"));
  this._dynamicFields.setText("commandHistory1", this._dynamicFields.getText("commandHistory0"));
  this._dynamicFields.setText("commandHistory0", this._dynamicFields.getText("promptField"));
}
/**
 * Handles updates to a Watchable instance.
 * @param {Watchable} data the Watchable instance being updated
 */
RetroC64AkalabethWorldMapInterface.prototype.watchUpdated = function(data) {
  // call base
  Watcher.prototype.watchUpdated.call(this, data);
  // update fields
  this._dynamicFields.setText("foodField", ["FOOD=", data.getNumberInInventory("FOOD")].join(""));
  this._dynamicFields.setText("hpField",   ["H.P.=", data.hitPoints].join(""));
  this._dynamicFields.setText("goldField", ["GOLD=", data.gold].join(""));
}
/**
 * Handles the player eating food after an action.
 */
RetroC64AkalabethWorldMapInterface.prototype.eatFood = function() {
  // add -1 food count
  RetroC64AkalabethController.character.addToInventory({ name: "FOOD", count: -1 });
  // check to see if player has enough food.
  if (RetroC64AkalabethController.character.getNumberInInventory("FOOD") > 0) {
    this._dynamicFields.setText("promptField", " COMMAND? ");
    this.moveCursor();
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
/**
 * Sets the available commands display.
 */
RetroC64AkalabethWorldMapInterface.prototype.setCommands = function() {
  this._dynamicFields.setVisible("northLabel1", true);
  this._dynamicFields.setVisible("northLabel2", true);
  this._dynamicFields.setVisible("northLabel3", true);
  this._dynamicFields.setVisible("westLabelArrow", true);
  this._dynamicFields.setVisible("westLabel", true);
  this._dynamicFields.setVisible("eastLabelArrow", true);
  this._dynamicFields.setVisible("eastLabel", true);
  this._dynamicFields.setVisible("southLabel1", true);
  this._dynamicFields.setVisible("southLabel2", true);
  this._dynamicFields.setVisible("southLabel3", true);
  this._dynamicFields.setVisible("castleLabel", false);
  this._dynamicFields.setVisible("dungeonLabel", false);
  this._dynamicFields.setVisible("shopLabel", false);
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY - 1][RetroC64AkalabethController.world.playerX] === 1) {
    this._dynamicFields.setVisible("northLabel1", false);
    this._dynamicFields.setVisible("northLabel2", false);
    this._dynamicFields.setVisible("northLabel3", false);
  }
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX - 1] === 1) {
    this._dynamicFields.setVisible("westLabelArrow", false);
    this._dynamicFields.setVisible("westLabel", false);
  }
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX + 1] === 1) {
    this._dynamicFields.setVisible("eastLabelArrow", false);
    this._dynamicFields.setVisible("eastLabel", false);
  }
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY + 1][RetroC64AkalabethController.world.playerX] === 1) {
    this._dynamicFields.setVisible("southLabel1", false);
    this._dynamicFields.setVisible("southLabel2", false);
    this._dynamicFields.setVisible("southLabel3", false);
  }
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX] === 3) {
    this._dynamicFields.setVisible("shopLabel", true);
  }
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX] === 4) {
    this._dynamicFields.setVisible("dungeonLabel", true);
  }
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX] === 5) {
    this._dynamicFields.setVisible("castleLabel", true);
  }
}
/**
 * Handles the player action to move north.
 */
RetroC64AkalabethWorldMapInterface.prototype.moveNorth = function() {
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? NORTH");
  // move the cursor
  this.moveCursor();
  // check to see if mountains are in the way
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY - 1][RetroC64AkalabethController.world.playerX] === 1) {
    // sequence for animation is as follows:
    // set move entered to anything > 0. this starts the animation sequence
    RetroC64AkalabethWorldMapScene.moveEntered = 9999; // fake animation sequence
    // start a timer to send the error message after 375 ms and then update the screen after 375 more ms
    this._scene.time.delayedCall(
      375, // milliseconds
      function() {
        this.recordHistory();
        this._dynamicFields.setText("promptField", " YOU CAN'T PASS THE MOUNTAINS");
        this.moveCursor();
        this._scene.time.delayedCall(
          375, // milliseconds
          function() {
            this.recordHistory();
            this._actionTaken = true;
          }, // callback function
          [], // args
          this // the scope object
        );
      }, // callback function
      [], // args
      this // the scope object
    );
  } else {
    // enter the move
    RetroC64AkalabethWorldMapScene.moveEntered = 1;
    // change the player's position
    RetroC64AkalabethController.world.playerY--;
    // start a timer to update the screen after 750 ms (about the time of the animation)
    this._scene.time.delayedCall(
      750, // milliseconds
      function() {
        this.recordHistory();
        this._actionTaken = true;
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
/**
 * Handles the player action to move south.
 */
RetroC64AkalabethWorldMapInterface.prototype.moveSouth = function() {
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? SOUTH");
  // move the cursor
  this.moveCursor();
  // check to see if mountains are in the way
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY + 1][RetroC64AkalabethController.world.playerX] === 1) {
    // sequence for animation is as follows:
    // set move entered to anything > 0. this starts the animation sequence
    RetroC64AkalabethWorldMapScene.moveEntered = 9999; // fake animation sequence
    // start a timer to send the error message after 375 ms and then update the screen after 375 more ms
    this._scene.time.delayedCall(
      375, // milliseconds
      function() {
        this.recordHistory();
        this._dynamicFields.setText("promptField", " YOU CAN'T PASS THE MOUNTAINS");
        this.moveCursor();
        this._scene.time.delayedCall(
          375, // milliseconds
          function() {
            this.recordHistory();
            this._actionTaken = true;
          }, // callback function
          [], // args
          this // the scope object
        );
      }, // callback function
      [], // args
      this // the scope object
    );
  } else {
    // enter the move
    RetroC64AkalabethWorldMapScene.moveEntered = 2;
    // change the player's position
    RetroC64AkalabethController.world.playerY++;
    // start a timer to update the screen after 750 ms (about the time of the animation)
    this._scene.time.delayedCall(
      750, // milliseconds
      function() {
        this.recordHistory();
        this._actionTaken = true;
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
/**
 * Handles the player action to move east.
 */
RetroC64AkalabethWorldMapInterface.prototype.moveEast = function() {
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? EAST");
  // move the cursor
  this.moveCursor();
  // check to see if mountains are in the way
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX + 1] === 1) {
    // sequence for animation is as follows:
    // set move entered to anything > 0. this starts the animation sequence
    RetroC64AkalabethWorldMapScene.moveEntered = 9999; // fake animation sequence
    // start a timer to send the error message after 375 ms and then update the screen after 375 more ms
    this._scene.time.delayedCall(
      375, // milliseconds
      function() {
        this.recordHistory();
        this._dynamicFields.setText("promptField", " YOU CAN'T PASS THE MOUNTAINS");
        this.moveCursor();
        this._scene.time.delayedCall(
          375, // milliseconds
          function() {
            this.recordHistory();
            this._actionTaken = true;
          }, // callback function
          [], // args
          this // the scope object
        );
      }, // callback function
      [], // args
      this // the scope object
    );
  } else {
    // enter the move
    RetroC64AkalabethWorldMapScene.moveEntered = 4;
    // change the player's position
    RetroC64AkalabethController.world.playerX++;
    // start a timer to update the screen after 750 ms (about the time of the animation)
    this._scene.time.delayedCall(
      750, // milliseconds
      function() {
        this.recordHistory();
        this._actionTaken = true;
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
/**
 * Handles the player action to move west.
 */
RetroC64AkalabethWorldMapInterface.prototype.moveWest = function() {
  // change the COMMAND PROMPT text
  this._dynamicFields.setText("promptField", " COMMAND? WEST");
  // move the cursor
  this.moveCursor();
  // check to see if mountains are in the way
  if (RetroC64AkalabethController.world.terrain[RetroC64AkalabethController.world.playerY][RetroC64AkalabethController.world.playerX - 1] === 1) {
    // sequence for animation is as follows:
    // set move entered to anything > 0. this starts the animation sequence
    RetroC64AkalabethWorldMapScene.moveEntered = 9999; // fake animation sequence
    // start a timer to send the error message after 375 ms and then update the screen after 375 more ms
    this._scene.time.delayedCall(
      375, // milliseconds
      function() {
        this.recordHistory();
        this._dynamicFields.setText("promptField", " YOU CAN'T PASS THE MOUNTAINS");
        this.moveCursor();
        this._scene.time.delayedCall(
          375, // milliseconds
          function() {
            this.recordHistory();
            this._actionTaken = true;
          }, // callback function
          [], // args
          this // the scope object
        );
      }, // callback function
      [], // args
      this // the scope object
    );
  } else {
    // enter the move
    RetroC64AkalabethWorldMapScene.moveEntered = 3;
    // change the player's position
    RetroC64AkalabethController.world.playerX--;
    // start a timer to update the screen after 750 ms (about the time of the animation)
    this._scene.time.delayedCall(
      750, // milliseconds
      function() {
        this.recordHistory();
        this._actionTaken = true;
      }, // callback function
      [], // args
      this // the scope object
    );
  }
}
/**
 * Handles the player entering an invalid command.
 */
RetroC64AkalabethWorldMapInterface.prototype.huh = function() {
  // set move entered to anything > 0. this starts the animation sequence
  RetroC64AkalabethWorldMapScene.moveEntered = 9999; // fake animation sequence
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
  module.exports = { RetroC64AkalabethWorldMapInterface };
}
