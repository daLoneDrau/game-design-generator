if (typeof(module) !== "undefined") {
  var { WizardrySceneController } = require("./wizardry-scene-controller");
}
/**
 * @class undefined
 */
var WizardryGame = (function() {
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
    WizardrySceneController.init();
  }
  /** @private the game configuration. */
  let _config = {
    type: Phaser.AUTO, // tells phaser to try WebGL first, and fall back to canvas if needed
    backgroundColor: new Phaser.Display.Color(255, 255, 255),
    // default is 1024x768
    width: 1024, // game width
    height: 768, // game height
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
    dom: { createContainer: true },
    parent: "domContainer", // id of the parent container
    callbacks: {
      preBoot: _preBoot,
      postBoot: _postBoot
    },
    scene: [
      WizardrySceneController,
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
  module.exports = { WizardryGame };
}
