if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { DavidAhlController } = require("../scenes/davidahl-controller");
  var { DavidAhlGameConsole } = require("../scenes/davidahl-gameconsole");
  var { DavidAhlConstants } = require("../config/davidahl-constants");
}
/**
 * @class Acey Ducey is a simple card game where you wager money to guess whether the next card will be above or below certain values.
 * @param {object} parameterObject optional initialization parameters
 */
function DavidAhlAceyDucey(parameterObject) {
  /** @private the game state. */
  this._state = DavidAhlConstants.ACEY_DUCEY_INTRO;
  /** @private the player's current bet */
  this._bet = 0;
  /** @private The field tracking the player's total dollars. It starts off at 100. */
  this._playerDollars = 100;
  /** @private the current hand being played. */
  this._currentCards = [];
  /** @private the discard pile. */
  this._discard = [];
  /** @private the deck of cards. */
  this._deck = [
     { "suit": "CLUBS", "rank": 2, "rankName": "2", "name": "TWO OF CLUBS" },
     { "suit": "CLUBS", "rank": 3, "rankName": "3", "name": "THREE OF CLUBS" },
     { "suit": "CLUBS", "rank": 4, "rankName": "4", "name": "FOUR OF CLUBS" },
     { "suit": "CLUBS", "rank": 5, "rankName": "5", "name": "FIVE OF CLUBS" },
     { "suit": "CLUBS", "rank": 6, "rankName": "6", "name": "SIX OF CLUBS" },
     { "suit": "CLUBS", "rank": 7, "rankName": "7", "name": "SEVEN OF CLUBS" },
     { "suit": "CLUBS", "rank": 8, "rankName": "8", "name": "EIGHT OF CLUBS" },
     { "suit": "CLUBS", "rank": 9, "rankName": "9", "name": "NINE OF CLUBS" },
     { "suit": "CLUBS", "rank": 10, "rankName": "10", "name": "TEN OF CLUBS" },
     { "suit": "CLUBS", "rank": 11, "rankName": "J", "name": "JACK OF CLUBS" },
     { "suit": "CLUBS", "rank": 12, "rankName": "Q", "name": "QUEEN OF CLUBS" },
     { "suit": "CLUBS", "rank": 13, "rankName": "K", "name": "KING OF CLUBS" },
     { "suit": "CLUBS", "rank": 14, "rankName": "A", "name": "ACE OF CLUBS" },
     { "suit": "DIAMONDS", "rank": 2, "rankName": "2", "name": "TWO OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 3, "rankName": "3", "name": "THREE OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 4, "rankName": "4", "name": "FOUR OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 5, "rankName": "5", "name": "FIVE OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 6, "rankName": "6", "name": "SIX OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 7, "rankName": "7", "name": "SEVEN OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 8, "rankName": "8", "name": "EIGHT OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 9, "rankName": "9", "name": "NINE OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 10, "rankName": "10", "name": "TEN OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 11, "rankName": "J", "name": "JACK OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 12, "rankName": "Q", "name": "QUEEN OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 13, "rankName": "K", "name": "KING OF DIAMONDS" },
     { "suit": "DIAMONDS", "rank": 14, "rankName": "A", "name": "ACE OF DIAMONDS" },
     { "suit": "HEARTS", "rank": 2, "rankName": "2", "name": "TWO OF HEARTS" },
     { "suit": "HEARTS", "rank": 3, "rankName": "3", "name": "THREE OF HEARTS" },
     { "suit": "HEARTS", "rank": 4, "rankName": "4", "name": "FOUR OF HEARTS" },
     { "suit": "HEARTS", "rank": 5, "rankName": "5", "name": "FIVE OF HEARTS" },
     { "suit": "HEARTS", "rank": 6, "rankName": "6", "name": "SIX OF HEARTS" },
     { "suit": "HEARTS", "rank": 7, "rankName": "7", "name": "SEVEN OF HEARTS" },
     { "suit": "HEARTS", "rank": 8, "rankName": "8", "name": "EIGHT OF HEARTS" },
     { "suit": "HEARTS", "rank": 9, "rankName": "9", "name": "NINE OF HEARTS" },
     { "suit": "HEARTS", "rank": 10, "rankName": "10", "name": "TEN OF HEARTS" },
     { "suit": "HEARTS", "rank": 11, "rankName": "J", "name": "JACK OF HEARTS" },
     { "suit": "HEARTS", "rank": 12, "rankName": "Q", "name": "QUEEN OF HEARTS" },
     { "suit": "HEARTS", "rank": 13, "rankName": "K", "name": "KING OF HEARTS" },
     { "suit": "HEARTS", "rank": 14, "rankName": "A", "name": "ACE OF HEARTS" },
     { "suit": "SPADES", "rank": 2, "rankName": "2", "name": "TWO OF SPADES" },
     { "suit": "SPADES", "rank": 3, "rankName": "3", "name": "THREE OF SPADES" },
     { "suit": "SPADES", "rank": 4, "rankName": "4", "name": "FOUR OF SPADES" },
     { "suit": "SPADES", "rank": 5, "rankName": "5", "name": "FIVE OF SPADES" },
     { "suit": "SPADES", "rank": 6, "rankName": "6", "name": "SIX OF SPADES" },
     { "suit": "SPADES", "rank": 7, "rankName": "7", "name": "SEVEN OF SPADES" },
     { "suit": "SPADES", "rank": 8, "rankName": "8", "name": "EIGHT OF SPADES" },
     { "suit": "SPADES", "rank": 9, "rankName": "9", "name": "NINE OF SPADES" },
     { "suit": "SPADES", "rank": 10, "rankName": "10", "name": "TEN OF SPADES" },
     { "suit": "SPADES", "rank": 11, "rankName": "J", "name": "JACK OF SPADES" },
     { "suit": "SPADES", "rank": 12, "rankName": "Q", "name": "QUEEN OF SPADES" },
     { "suit": "SPADES", "rank": 13, "rankName": "K", "name": "KING OF SPADES" },
     { "suit": "SPADES", "rank": 14, "rankName": "A", "name": "ACE OF SPADES" }
   ];
  /** @private flag indicating whether setup has been completed. */
  this._setupComplete = false;
  /** @private the parent's Phaser.Scene instance */
  this._scene = parameterObject;
  /** @private flag used to track changes to the game state. Initial state is false in order to trigger display of the Intro View after setup. */
  this._stateChangeResolved = false;
  /** @private the dictionary of dynamic fields to track */
  this._dynamicFields = (function() {
    /** @private the object dictionary */
    let _dictionary = {};
    return {
      /**
       * If this Game Object has previously been enabled for input, this will disable it.
       * @param {string} key the entry key
       */
      disableInteractive(key) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].disableInteractive();
        }
      },
      /**
       * Places a key-value pair into storage.
       * @param {string} key the entry key
       * @param {Phaser.GameObjects.GameObject} value the entry value
       */
      put: function(key, value) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          console.log(typeof(key), key instanceof String)
          throw ["Invalid key", key];
        }
        if (typeof(value) === "undefined") {
          throw ["Invalid value", value];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          _dictionary[key] = [];
        }
        _dictionary[key].push(value);
      },
      /**
       * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders. Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
       * @param {string} key the entry key
       * @param {number} topLeft The alpha value used for the top-left of the Game Object. If this is the only value given it's applied across the whole Game Object.
       * @param {number} topRight The alpha value used for the top-right of the Game Object. WebGL only.
       * @param {number} bottomLeft The alpha value used for the bottom-left of the Game Object. WebGL only.
       * @param {number} bottomRight The alpha value used for the bottom-right of the Game Object. WebGL only.
       */
      setAlpha(key, topLeft, topRight, bottomLeft, bottomRight) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setAlpha(topLeft, topRight, bottomLeft, bottomRight);
        }
      },
      /**
       * Pass this Game Object to the Input Manager to enable it for Input.
       * @param {string} key the entry key
       * @param {Phaser.Types.Input.InputConfiguration|*} hitArea Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not given it will try to create a Rectangle based on the texture frame.
       * @param {Phaser.Types.Input.HitAreaCallback} callback The callback that determines if the pointer is within the Hit Area shape or not. If you provide a shape you must also provide a callback.
       * @param {boolean} dropZone Should this Game Object be treated as a drop zone target?
       */
      setInteractive(key, hitArea, callback, dropZone) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setInteractive(hitArea, callback, dropZone);
        }
      },
      /**
       * Set the textual content of the stored GameObject.
       * @param {string} key the entry key
       * @param {string|Array.<string>} text The string, or array of strings, to be set as the content of the text item.
       */
      setText(key, text) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setText(text);
        }
      },
      /**
       * Sets an additive tint on this Game Object.
       * @param {string} key the entry key
       * @param {number} topLeft The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object.
       * @param {number} topRight The tint being applied to the top-right of the Game Object.
       * @param {number} bottomLeft The tint being applied to the bottom-left of the Game Object.
       * @param {number} bottomRight The tint being applied to the bottom-right of the Game Object.
       */
      setTint(key, topLeft, topRight, bottomLeft, bottomRight) {
        if (typeof(key) !== "string" && !(key instanceof String)) {
          throw ["Invalid key", key];
        }
        if (!_dictionary.hasOwnProperty(key)) {
          throw ["Invalid key", key];
        }
        for (let i = _dictionary[key].length - 1; i >= 0; i--) {
          _dictionary[key][i].setTint(topLeft, topRight, bottomLeft, bottomRight);
        }
      }
    }
  }());
  /** @private a map of colors and unicode characters for each card suit. */
  this._SUIT_DATA = {
   CLUBS: {
     unicode: "\u0005",
     tint: 0x000000
   },
   DIAMONDS: {
     unicode: "\u0004",
     tint: 0x4342E6
   },
   HEARTS: {
     unicode: "\u0003",
     tint: 0x4342E6
   },
   SPADES: {
     unicode: "\u0006",
     tint: 0x000000
   }
 };
  /** @private the dictionary of game views. */
  this._VIEWS = {
    /** @private The Round Over view. */
    [DavidAhlConstants.ACEY_DUCEY_ROUND_OVER]: {
      group: null,
      children: [
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 0],
          origin: [0.5, 0],
          "scale controlled args": [
            {
              index: 2,
              dimension: "width"
            }
          ]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Acey Ducey Card Game", // text
          ],
          position: [6, 1],
          scale: 1.25,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Creative Computing Morristown, New Jersey", // text
          ],
          position: [6, 2],
          scale: 0.875,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "You have $100.", // text
          ],
          position: [6, 6],
          tint: 0xA6A1FF,
          dynamicField: "roundResult"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[ENTER] Keep playing", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "this.nextRound(); this._state = DavidAhlConstants.ACEY_DUCEY_MAIN; this._stateChangeResolved = false;",
              context: this
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 8],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[ESC] Back to Card Games", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlController.currentScene = \"Main Menu\";"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 10],
          tint: 0xA6A1FF
        },
        {
          type: "graphics-texture",
          commands: [
            {
              order: 0,
              command: "fillStyle",
              args: [0xA6A1FF, 1] // color, alpha
            },
            {
              order: 1,
              command: "fillRoundedRect",
              args: [0, 0, 2/13, 3/13, 10], // x, y, scale width, scale height, corner radius,
              "scale controlled args": [
                {
                  index: 2,
                  dimension: "width"
                },
                {
                  index: 3,
                  dimension: "height"
                }
              ]
            },
            {
              order: 2,
              command: "generateTexture",
              args: ["playingCardFrame", 2/13, 3/13], // key, scale width, scale height
              "scale controlled args": [
                {
                  index: 1,
                  dimension: "width"
                },
                {
                  index: 2,
                  dimension: "height"
                }
              ]
            }
          ]
        },
        {
          comment: "CARD 1",
          type: "image",
          args: [
            0, // x
            0, // y
            "playingCardFrame" // texture
          ],
          position: [3.5, 4]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0006", // text
          ],
          position: [2.75, 2.75],
          tint: 0x000000,
          dynamicField: "card1SuitTop"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Q", // text
          ],
          position: [3.5, 4],
          tint: 0x000000,
          dynamicField: "card1Rank"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0003", // text
          ],
          position: [4.25, 5.25],
          tint: 0x000000,
          dynamicField: "card1SuitBottom"
        },
        {
          comment: "CARD 2",
          type: "image",
          args: [
            0, // x
            0, // y
            "playingCardFrame" // texture
          ],
          position: [8.5, 4],
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0006", // text
          ],
          position: [7.75, 2.75],
          tint: 0x000000,
          dynamicField: "card2SuitTop"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Q", // text
          ],
          position: [8.5, 4],
          tint: 0x000000,
          dynamicField: "card2Rank"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0003", // text
          ],
          position: [9.25, 5.25],
          tint: 0x000000,
          dynamicField: "card2SuitBottom"
        },
        {
          comment: "CARD 3",
          type: "image",
          args: [
            0, // x
            0, // y
            "playingCardFrame" // texture
          ],
          position: [6, 4]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0006", // text
          ],
          position: [5.25, 2.75],
          tint: 0x000000,
          dynamicField: "card3SuitTop"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Q", // text
          ],
          position: [6, 4],
          tint: 0x000000,
          dynamicField: "card3Rank"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0003", // text
          ],
          position: [6.75, 5.25],
          tint: 0x000000,
          dynamicField: "card3SuitBottom"
        },
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 12],
          origin: [0.5, 1],
          "scale controlled args": [
            {
              index: 2,
              dimension: "width"
            }
          ]
        }
      ]
    },
    /** @private The view for the main screen. */
    [DavidAhlConstants.ACEY_DUCEY_MAIN]: {
      group: null,
      children: [
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 0],
          origin: [0.5, 0],
          "scale controlled args": [
            {
              index: 2,
              dimension: "width"
            }
          ]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Acey Ducey Card Game", // text
          ],
          position: [6, 1],
          scale: 1.25,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Creative Computing Morristown, New Jersey", // text
          ],
          position: [6, 2],
          scale: 0.875,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "You have $100.", // text
          ],
          position: [6, 6],
          tint: 0xA6A1FF,
          dynamicField: "playerDollars"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[<]", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "this.lowerBet();",
              context: this
            }
          },
          position: [2, 7],
          tint: 0xA6A1FF,
          alpha: 0.65,
          dynamicField: "lowerBet"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Current wager:", // text
          ],
          position: [3, 7],
          origin: [0, 0.5],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "$0", // text
          ],
          position: [9, 7],
          origin: [1, 0.5],
          tint: 0xA6A1FF,
          dynamicField: "currentBet"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[>]", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "this.raiseBet();",
              context: this
            }
          },
          interactive: [{ useHandCursor: true }],
          position: [10, 7],
          tint: 0xA6A1FF,
          dynamicField: "raiseBet"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[P] Place your bet", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "this.placeBet();",
              context: this
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 8],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[V] View the instructions again", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "this._state = DavidAhlConstants.ACEY_DUCEY_INTRO; this._stateChangeResolved = false;",
              context: this
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 9],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[ESC] Back to Card Games", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlController.currentScene = \"Main Menu\";"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 10],
          tint: 0xA6A1FF
        },
        {
          type: "graphics-texture",
          commands: [
            {
              order: 0,
              command: "fillStyle",
              args: [0xA6A1FF, 1] // color, alpha
            },
            {
              order: 1,
              command: "fillRoundedRect",
              args: [0, 0, 2/13, 3/13, 10], // x, y, scale width, scale height, corner radius,
              "scale controlled args": [
                {
                  index: 2,
                  dimension: "width"
                },
                {
                  index: 3,
                  dimension: "height"
                }
              ]
            },
            {
              order: 2,
              command: "generateTexture",
              args: ["playingCardFrame", 2/13, 3/13], // key, scale width, scale height
              "scale controlled args": [
                {
                  index: 1,
                  dimension: "width"
                },
                {
                  index: 2,
                  dimension: "height"
                }
              ]
            }
          ]
        },
        {
          comment: "CARD 1",
          type: "image",
          args: [
            0, // x
            0, // y
            "playingCardFrame" // texture
          ],
          position: [3.5, 4]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0006", // text
          ],
          position: [2.75, 2.75],
          tint: 0x000000,
          dynamicField: "card1SuitTop"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Q", // text
          ],
          position: [3.5, 4],
          tint: 0x000000,
          dynamicField: "card1Rank"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0003", // text
          ],
          position: [4.25, 5.25],
          tint: 0x000000,
          dynamicField: "card1SuitBottom"
        },
        {
          comment: "CARD 2",
          type: "image",
          args: [
            0, // x
            0, // y
            "playingCardFrame" // texture
          ],
          position: [8.5, 4],
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0006", // text
          ],
          position: [7.75, 2.75],
          tint: 0x000000,
          dynamicField: "card2SuitTop"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Q", // text
          ],
          position: [8.5, 4],
          tint: 0x000000,
          dynamicField: "card2Rank"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0003", // text
          ],
          position: [9.25, 5.25],
          tint: 0x000000,
          dynamicField: "card2SuitBottom"
        },
        {
          comment: "CARD 3",
          type: "image",
          args: [
            0, // x
            0, // y
            "playingCardFrame" // texture
          ],
          position: [6, 4]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0006", // text
          ],
          position: [5.25, 2.75],
          tint: 0x000000,
          dynamicField: "card3SuitTop"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Q", // text
          ],
          position: [6, 4],
          tint: 0x000000,
          dynamicField: "card3Rank"
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "\u0003", // text
          ],
          position: [6.75, 5.25],
          tint: 0x000000,
          dynamicField: "card3SuitBottom"
        },
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 12],
          origin: [0.5, 1],
          "scale controlled args": [
            {
              index: 2,
              dimension: "width"
            }
          ]
        }
      ]
    },
    /** @private The Intro View. */
    [DavidAhlConstants.ACEY_DUCEY_INTRO]: {
      group: null,
      children: [
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 0],
          origin: [0.5, 0],
          "scale controlled args": [
            {
              index: 2,
              dimension: "width"
            }
          ]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Acey Ducey Card Game", // text
          ],
          position: [6, 1],
          scale: 1.25,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Creative Computing Morristown, New Jersey", // text
          ],
          position: [6, 2],
          scale: 0.875,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Acey-Ducey is played in the following manner:\nthe dealer (computer) deals two cards face up. You have an option to bet or not bet depending on whether or not you feel the card will have a value between the first two cards.", // text
          ],
          position: [6, 4],
          tint: 0xA6A1FF,
          maxWidth: 0.6
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[ENTER] Continue", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "this._state = DavidAhlConstants.ACEY_DUCEY_MAIN; this._stateChangeResolved = false;",
              context: this
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 8],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[ESC] Back to Card Games", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlGameConsole.cartridge = \"\"; DavidAhlController.currentScene = \"Main Menu\";"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 9],
          tint: 0xA6A1FF
        },
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 12],
          origin: [0.5, 1],
          "scale controlled args": [
            {
              index: 2,
              dimension: "width"
            }
          ]
        }
      ]
    },
  };
  /** @private The dictionary of 'key up' event handlers. Keys are the menu states. */
  this._KEY_UP_EVENT_HANDLERS = {
    /** @private Key handler for the end of the round view. */
    [DavidAhlConstants.ACEY_DUCEY_ROUND_OVER]: function(event, context) {
      switch (event.key) {
        case "Enter":
          context.nextRound();
          context._state = DavidAhlConstants.ACEY_DUCEY_MAIN;
          context._stateChangeResolved = false;
          break;
        case "Escape":
          DavidAhlController.currentScene = "Main Menu";
          break;
      }
    },
    /** @private Key handler for the main view. */
    [DavidAhlConstants.ACEY_DUCEY_MAIN]: function(event, context) {
      switch (event.key) {
        case "ArrowLeft":
          context.lowerBet();
          break;
        case "ArrowRight":
          context.raiseBet();
          break;
        case "p":
        case "P":
          context.placeBet();
          break;
        case "v":
        case "V":
          context._state = DavidAhlConstants.ACEY_DUCEY_INTRO;
          context._stateChangeResolved = false;
          break;
        case "Escape":
          DavidAhlController.currentScene = "Main Menu";
          break;
      }
    },
    /** @private Key handler for the intro view. */
    [DavidAhlConstants.ACEY_DUCEY_INTRO]: function(event, context) {
      switch (event.key) {
        case "Enter":
          context._drawNewHand = false;
          context._state = DavidAhlConstants.ACEY_DUCEY_MAIN;
          context._stateChangeResolved = false;
          break;
        case "Escape":
          DavidAhlController.currentScene = "Main Menu";
          break;
      }
    },
  };
  if (parameterObject.hasOwnProperty("scene")) {
    this._scene = parameterObject.scene;
  }
};
DavidAhlAceyDucey.prototype = Object.create(Phaser.Scene.prototype);
DavidAhlAceyDucey.prototype.constructor = Phaser.Scene;
{ // DavidAhlAceyDucey Getters/Setters
  /** Sets the current state. */
  Object.defineProperty(DavidAhlAceyDucey.prototype, 'state', {
    set(value) {
      _state = value;
      _stateChangeResolved = false;;
    }
  });
}
/**
 * Starts the game.
 */
DavidAhlAceyDucey.prototype.startGame = function() {
  if (!this._setupComplete) {
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._playerDollars = 100;
  this.nextRound();
  this._state = DavidAhlConstants.ACEY_DUCEY_INTRO;
  this._stateChangeResolved = false;
}
/**
 * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
 */
DavidAhlAceyDucey.prototype.preload = function() {
  // load the theme fonts
  this._scene.load.bitmapFont("c64_pro_style_16", "/phaser/assets/font/c64_pro_style_16.png", "/phaser/assets/font/c64_pro_style_16.xml");
  this._scene.load.bitmapFont("c64_pro_mono_16", "/phaser/assets/font/c64_pro_mono_16.png", "/phaser/assets/font/c64_pro_mono_16.xml");
}
/**
 * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
 * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
DavidAhlAceyDucey.prototype.create = function(data) {
  // create a grid for laying out elements
  let grid = new DavidAhlAlignmentGrid({ "parent": this._scene, "columns": 13, "rows": 13 });
  //turn on the lines for testing
  //and layout
  grid.show();
  
  // create groups for each state. when the state is switched, objects will be hidden/shown by group
  let keys = Object.keys(this._VIEWS);
  keys.sort();
  for (let i = keys.length - 1; i >= 0; i--) {
    let entry = this._VIEWS[keys[i]];
    let group = this._scene.add.group();
    entry.group = group;
    // sort children to push any textures to the top. these need to be created before we can use them
    entry.children.sort(function(a, b) {
      let c = 0;
      if (a.type === "graphics-texture" && b.type !== "graphics-texture") {
        c = -1;
      } else if (a.type !== "graphics-texture" && b.type === "graphics-texture") {
        c = 1
      }
      return c;
    });
    // iterate through children creating them
    for (let j = 0, lj = entry.children.length; j < lj; j++) {
      let child = entry.children[j];
      if (child.hasOwnProperty("scale controlled args")) {
        let arr = child["scale controlled args"];
        for (let k = arr.length - 1; k >= 0; k--) {
          let controlledArgument = arr[k];
          child.args[controlledArgument.index] *= this._scene.scale[controlledArgument.dimension];
        }
      }
      switch (child.type) {
        case "graphics-texture":
          // created graphics textures are created but no objects are created for them. these will be in other UI entries
          let myG = this._scene.make.graphics();
          let commands = child.commands;
          commands.sort(function(a, b) {
            let c = 0;
            if (a.order < b.order) {
              c = -1;
            } else if (a.order > b.order) {
              c = 1;
            }
            return c;
          });
          for (let k = 0, lk = commands.length; k < lk; k++) {
            let graphicsCommand = commands[k];
            if (graphicsCommand.hasOwnProperty("scale controlled args")) {
              let arr = graphicsCommand["scale controlled args"];
              for (let l = arr.length - 1; l >= 0; l--) {
                let controlledArgument = arr[l];
                graphicsCommand.args[controlledArgument.index] *= this._scene.scale[controlledArgument.dimension];
              }
            }
            myG[graphicsCommand.command](...graphicsCommand.args);
          }
          continue;
          break;
      }
      // create the object
      let object = this._scene.add[child.type](...child.args);
      
      // set the origin
      if (child.hasOwnProperty("origin")) {
        object.setOrigin(...child.origin); // set the origin property
      } else {
        object.setOrigin(0.5); // set the origin to the middle
      }
      switch (child.type) {
        case "bitmapText":
          if (child.hasOwnProperty("scale")) {
            object.setScale(child.scale);
          }
          if (child.hasOwnProperty("tint")) {
            object.setTint(child.tint);
          }
          if (child.hasOwnProperty("alpha")) {
            object.setAlpha(child.alpha);
          }
          if (child.hasOwnProperty("dropShadow")) {
            object.setDropShadow(...child.dropShadow); // set the origin property
          }
          if (child.hasOwnProperty("maxWidth")) {
            if (Array.isArray()) {
              // maxwidth setting is an array of width and word wrap code
              if (child.maxWidth[0] < 1) {
                child.maxWidth[0] *= this._scene.scale.width;
              }
              object.setMaxWidth(...child.maxWidth);
            } else {
              if (isNaN(parseFloat(child.maxWidth))) {
                throw ["Invalid setting for maxWidth", child];
              }
              // maxwidth setting is just the width value
              if (child.maxWidth < 1) {
                object.setMaxWidth(child.maxWidth * this._scene.scale.width);
              } else {
                object.setMaxWidth(child.maxWidth);
              }
            }
          }
          break;
      }
      // add listeners
      if (child.hasOwnProperty("listeners")) {
        let listeners = Object.keys(child.listeners);
        for (let i = listeners.length - 1; i >= 0; i--) {
          switch (child.type) {
            case "dom":
              object.addListener(listeners[i]);
              object.on(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body));
              break;
            default:
              if (child.listeners[listeners[i]].hasOwnProperty("context")) {
                object.addListener(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body), child.listeners[listeners[i]].context);
              } else {
                object.addListener(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body));
              }
              break;
          }
        }
      }
      // add interactive
      if (child.hasOwnProperty("interactive")) {
        object.setInteractive(...child.interactive); // set the origin property
      }
      // map dynamic fields
      if (child.hasOwnProperty("dynamicField")) {
        this._dynamicFields.put(child.dynamicField, object);
      }
      // add the element to the group
      group.add(object, true);
  
      // place the element where needed
      grid.placeAt(child.position[0], child.position[1], object);
    }
    // hide the group
    group.setVisible(false);
  }
}
/**
 * This method is called once per game step while the scene is running.
 * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
DavidAhlAceyDucey.prototype.update = function(time, delta) {
  if (!this._stateChangeResolved) {
    // hide all templates
    let keys = Object.keys(this._VIEWS);
    for (let i = keys.length - 1; i >= 0; i--) {
      this._VIEWS[keys[i]].group.setVisible(false);
    }
  
    // show the current template
    this._VIEWS[this._state].group.setVisible(true);
  
    // reset the flag
    this._stateChangeResolved = true;
  }
}
/**
 * Shuffles all discarded cards back into the deck.
 */
DavidAhlAceyDucey.prototype.shuffleDeck = function() {
  for (let i = this._discard.length - 1; i >= 0; i--) {
    this._deck.push(this._discard.splice(i, 1)[0]);
  }
}
/**
 * Draws a random card from the deck.
 */
DavidAhlAceyDucey.prototype.drawCard = function() {
  return this._deck.splice(Dice.getRandomIndex(this._deck), 1)[0];
}
/**
 * Pulls the initial two cards from the deck.
 */
DavidAhlAceyDucey.prototype.initialDraw = function() {
  let card0 = this.drawCard(), card1 = this.drawCard();
  while (card0.rank >= card1.rank || Math.abs(card0.rank - card1.rank) === 1) {
    this._discard.push(card0, card1);
    this.shuffleDeck();
    card0 = this.drawCard();
    card1 = this.drawCard();
  }
  this._currentCards.length = 0;
  this._currentCards.push(card0, card1);
  // show card 1
  this._dynamicFields.setText("card1SuitTop", this._SUIT_DATA[this._currentCards[0].suit].unicode);
  this._dynamicFields.setTint("card1SuitTop", this._SUIT_DATA[this._currentCards[0].suit].tint);
  this._dynamicFields.setText("card1SuitBottom", this._SUIT_DATA[this._currentCards[0].suit].unicode);
  this._dynamicFields.setTint("card1SuitBottom", this._SUIT_DATA[this._currentCards[0].suit].tint);
  this._dynamicFields.setText("card1Rank", this._currentCards[0].rankName);
  this._dynamicFields.setTint("card1Rank", this._SUIT_DATA[this._currentCards[0].suit].tint);
  // show card 2
  this._dynamicFields.setText("card2SuitTop", this._SUIT_DATA[this._currentCards[1].suit].unicode);
  this._dynamicFields.setTint("card2SuitTop", this._SUIT_DATA[this._currentCards[1].suit].tint);
  this._dynamicFields.setText("card2SuitBottom", this._SUIT_DATA[this._currentCards[1].suit].unicode);
  this._dynamicFields.setTint("card2SuitBottom", this._SUIT_DATA[this._currentCards[1].suit].tint);
  this._dynamicFields.setText("card2Rank", this._currentCards[1].rankName);
  this._dynamicFields.setTint("card2Rank", this._SUIT_DATA[this._currentCards[1].suit].tint);
  // hide card 3
  this._dynamicFields.setText("card3SuitTop", "");
  this._dynamicFields.setText("card3SuitBottom", "");
  this._dynamicFields.setText("card3Rank", "");
  // show current bet
  this._dynamicFields.setText("currentBet", ["$", this._bet].join(""));
  // show player dollars
  this._dynamicFields.setText("playerDollars", ["You have $", this._playerDollars].join(""));
}
/**
 * Lowers the player's wager.
 */
DavidAhlAceyDucey.prototype.lowerBet = function() {
  // lower the wager
  this._bet--;
  if (this._bet < 0) {
    this._bet = 0;
  }
  // update the view
  this._dynamicFields.setText("currentBet", ["$", this._bet].join(""));
  // enable/disable buttons
  this._dynamicFields.setAlpha("lowerBet", 1);
  this._dynamicFields.setAlpha("raiseBet", 1);
  this._dynamicFields.setInteractive("raiseBet", { cursor: "pointer" });
  if (this._bet === 0) { // disable the lower bet button
    this._dynamicFields.setAlpha("lowerBet", 0.65);
    this._dynamicFields.disableInteractive("lowerBet");
  }
}
/**
 * Raises the player's wager.
 */
DavidAhlAceyDucey.prototype.raiseBet = function() {
  // raise the wager
  this._bet++;
  if (this._bet > this._playerDollars) {
    this._bet = this._playerDollars;
  }
  // update the view
  this._dynamicFields.setText("currentBet", ["$", this._bet].join(""));
  // enable/disable buttons
  this._dynamicFields.setAlpha("lowerBet", 1);
  this._dynamicFields.setAlpha("raiseBet", 1);
  this._dynamicFields.setInteractive("lowerBet", { cursor: "pointer" });
  if (this._bet === this._playerDollars) { // disable the lower bet button
    this._dynamicFields.setAlpha("raiseBet", 0.65);
    this._dynamicFields.disableInteractive("raiseBet");
  }
}
/**
 * Places the player's bet and resolves the round.
 */
DavidAhlAceyDucey.prototype.placeBet = function() {
  // draw a new card
  this._currentCards.push(this.drawCard());
  // show card 3
  this._dynamicFields.setText("card3SuitTop", this._SUIT_DATA[this._currentCards[2].suit].unicode);
  this._dynamicFields.setTint("card3SuitTop", this._SUIT_DATA[this._currentCards[2].suit].tint);
  this._dynamicFields.setText("card3SuitBottom", this._SUIT_DATA[this._currentCards[2].suit].unicode);
  this._dynamicFields.setTint("card3SuitBottom", this._SUIT_DATA[this._currentCards[2].suit].tint);
  this._dynamicFields.setText("card3Rank", this._currentCards[2].rankName);
  this._dynamicFields.setTint("card3Rank", this._SUIT_DATA[this._currentCards[2].suit].tint);
  
  let msg = "YOU WIN!!!";
  // check to see if the player won or lost
  if (this._currentCards[2].rank <= this._currentCards[0].rank || this._currentCards[2].rank >= this._currentCards[1].rank) {
    this._bet = -this._bet;
    msg = "SORRY, YOU LOSE";
  }
  // reward/punish player
  this._playerDollars += this._bet;
  if (this._bet === 0) {
    msg = "CHICKEN!!";
  }
  this._dynamicFields.setText("roundResult", msg);
  
  // go to next screen
  this._state = DavidAhlConstants.ACEY_DUCEY_ROUND_OVER;
  this._stateChangeResolved = false;
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
DavidAhlAceyDucey.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Starts the next round.
 */
DavidAhlAceyDucey.prototype.nextRound = function() {
  this._bet = 0;
  this.shuffleDeck();
  this.initialDraw();
  // disable the lower bet button
  this._dynamicFields.setAlpha("lowerBet", 0.65);
  this._dynamicFields.disableInteractive("lowerBet");
  // enable the raise bet button
  this._dynamicFields.setAlpha("raiseBet", 1);
  this._dynamicFields.setInteractive("raiseBet", { cursor: "pointer" });
}
if (typeof(module) !== "undefined") {
  module.exports = { DavidAhlAceyDucey };
}
