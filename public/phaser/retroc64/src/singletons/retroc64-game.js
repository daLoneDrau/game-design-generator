if (typeof(module) !== "undefined") {
  var { RetroC64SceneController } = require("./retroc64-scene-controller");
  var { RetroC64AkalabethGameOverScene } = require("./retroc64-akalabeth-game-over-scene");
  var { RetroC64AkalabethCastleScene } = require("../scenes/akalabeth/castle/retroc64-akalabeth-castle-scene");
  var { RetroC64AkalabethDungeonScene } = require("../scenes/akalabeth/dungeon/retroc64-akalabeth-dungeon-scene");
  var { RetroC64AkalabethCharacterStatsScene } = require("../scenes/akalabeth/character-stats/retroc64-akalabeth-character-stats-scene");
  var { RetroC64AkalabethWorldMapScene } = require("../scenes/akalabeth/retroc64-akalabeth-world-map-scene");
  var { RetroC64SetupScene } = require("../scenes/akalabeth/retroc64-akalabeth-setup-scene");
  var { RetroC64AkalabethShopScene } = require("../scenes/akalabeth/shop/retroc64-akalabeth-shop-scene");
  var { RetroC64AkalabethCharacterCreationScene } = require("../scenes/akalabeth/character-creation/retroc64-akalabeth-character-creation-scene");
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
    _game.scene.queueOp("start", "AkalabethGameOverScene");
    _game.scene.queueOp("start", "AkalabethCastleScene");
    _game.scene.queueOp("start", "AkalabethDungeonScene");
    _game.scene.queueOp("start", "AkalabethCharacterStatsScene");
    _game.scene.queueOp("start", "AkalabethWorldMapScene");
    _game.scene.queueOp("start", "AkalabethSetupScene");
    _game.scene.queueOp("start", "AkalabethCharacterCreationScene");
    _game.scene.queueOp("start", "AkalabethShopScene");
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
      RetroC64AkalabethCastleScene,
      RetroC64AkalabethCharacterCreationScene,
      RetroC64AkalabethCharacterStatsScene,
      RetroC64AkalabethDungeonScene,
      RetroC64AkalabethGameOverScene,
      RetroC64AkalabethSetupScene,
      RetroC64AkalabethShopScene,
      RetroC64AkalabethWorldMapScene,
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
