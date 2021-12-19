if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethDungeon } = require("../bus/akalabeth/retroc64-akalabeth-dungeon");
  var { RetroC64AkalabethWorld } = require("../bus/akalabeth/retroc64-akalabeth-world");
  var { RetroC64AkalabethDungeonGraphics } = require("../scenes/akalabeth/dungeon/retroc64-akalabeth-dungeon-graphics");
  var { RetroC64AkalabethDungeonInterface } = require("../scenes/akalabeth/dungeon/retroc64-akalabeth-dungeon-interface");
  var { RetroC64AkalabethDungeonScene } = require("../scenes/akalabeth/dungeon/retroc64-akalabeth-dungeon-scene");
  var { RetroC64AkalabethController } = require("../services/akalabeth/retroc64-akalabeth-controller");
}
/**
 * @class Utility class to circumvent cyclical dependencies in the architecture.
 */
const RetroC64Config = (function() {
  let _debug = false;
  return {
    /**
     * Initializes the class configurations.
     */
    init: function() {

      RetroC64AkalabethController.DungeonClass = RetroC64AkalabethDungeon;
      RetroC64AkalabethController.WorldClass = RetroC64AkalabethWorld;
      RetroC64AkalabethDungeonScene.GraphicsClass = RetroC64AkalabethDungeonGraphics;
      RetroC64AkalabethDungeonScene.InterfaceClass = RetroC64AkalabethDungeonInterface;

      RetroC64AkalabethDungeon.prototype.AkalabethController = RetroC64AkalabethController;
      RetroC64AkalabethWorld.prototype.AkalabethController = RetroC64AkalabethController;
      RetroC64AkalabethDungeonGraphics.prototype.DungeonScene = RetroC64AkalabethDungeonScene;
      RetroC64AkalabethDungeonInterface.prototype.DungeonScene = RetroC64AkalabethDungeonScene;
    },
  };
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64Config };
}
