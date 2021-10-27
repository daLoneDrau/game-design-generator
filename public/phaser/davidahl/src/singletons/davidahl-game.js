if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { DavidAhlMainMenu } = require("../scenes/davidahl-main-menu");
  var { DavidAhlConstants } = require("../config/davidahl-constants");
}
/**
 * @class The Game application.
 */
var DavidAhlGame = (function() {
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
    _game.scene.queueOp("start", "Main Menu");
    _game.scene.queueOp("start", "GameConsole");
    _game.scene.queueOp("start", "Controller");
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
      DavidAhlController,
      DavidAhlGameConsole,
      DavidAhlMainMenu,
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
  module.exports = { DavidAhlGame };
}
