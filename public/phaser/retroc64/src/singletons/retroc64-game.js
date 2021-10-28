if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { RetroC64SceneController } = require("./retroc64-scene-controller");
  var { RetroC64AkalabethWorldMapScene } = require("../scenes/akalabeth/retroc64-akalabeth-world-map-scene");
  var { RetroC64SetupScene } = require("../scenes/akalabeth/retroc64-setup-scene");
  var { RetroC64ShopScene } = require("../scenes/retroc64-shop-scene");
  var { RetroC64IntroScene } = require("../scenes/retroc64-introscene");
}
/**
 * @class undefined
 */
var RetroC64Game = (function() {
  /**
   * A function to run at the start of the boot sequence.
   * @param {Phaser.Game} game The game.
   */
  let _preBoot = function(game) {
  }
  /**
   * A function to run at the end of the boot sequence. At this point, all the game systems have started and plugins have been loaded.
   * @param {Phaser.Game} game The game.
   */
  let _postBoot = function() {
    _game.scene.queueOp("start", "Controller");
    _game.scene.queueOp("start", "AkalabethWorldMapScene");
    _game.scene.queueOp("start", "SetupScene");
    _game.scene.queueOp("start", "IntroScene");
    _game.scene.queueOp("start", "ShopScene");
    RetroC64SceneController.init();
  }
  /** @private the game configuration. */
  let _config = {
    type: Phaser.AUTO, // tells phaser to try WebGL first, and fall back to canvas if needed
    backgroundColor: new Phaser.Display.Color(67, 66, 230),
    // default is 1024x768
    width: 800, // game width
    height: 600, // game height
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    dom: { createContainer: true },
    parent: "domContainer", // id of the parent container
    callbacks: {
      preBoot: _preBoot,
      postBoot: _postBoot
    },
    scene: [
      RetroC64AkalabethWorldMapScene,
      RetroC64IntroScene,
      RetroC64SetupScene,
      RetroC64ShopScene,
      RetroC64SceneController,
    ]
  };
  /** @private Game instance. */
  let _game;
  return {
    newGame: function() {
      _game = new Phaser.Game(_config);
    },
  }
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64Game };
}
