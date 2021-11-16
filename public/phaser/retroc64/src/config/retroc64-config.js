if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethController } = require("../services/akalabeth/retroc64-akalabeth-controller");
  var { RetroC64AkalabethWorld } = require("../bus/akalabeth/retroc64-akalabeth-world");
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

      RetroC64AkalabethController.WorldClass = RetroC64AkalabethWorld;

      RetroC64AkalabethWorld.prototype.AkalabethController = RetroC64AkalabethController;
    },
  };
} ());

if (typeof(module) !== "undefined") {
  module.exports = { RetroC64Config };
}
