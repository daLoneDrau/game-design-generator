if (typeof(module) !== "undefined") {
  var { WizardryScnToc } = require("../bus/wizardry-scntoc");
  var { WizardryXgoto } = require("../config/wizardry-constants");
}
/**
 * @class The Application will have a defined Controller class.
 */
var WizardryController = (function() {
  /** @private the partyCnt. */
  let _partyCnt = 0;
  /** @private ??. */
  let _cachebl = 0;
  /** @private ??. */
  let _scntocbl = 0;
  /** @private ??. */
  let _llbase04 = 0;
  /** @private ??. */
  let _timeDelay = 0;
  /** @private ??. */
  let _cacheWri = false;
  /** @private ??. */
  let _inChar = "";
  /** @private ??. */
  let _xgoto = null;
  /** @private ??. */
  let _xgoto2 = null;
  /** @private ??. */
  let _attk012 = 0;
  /** @private ??. */
  let _fizzles = 0;
  /** @private ??. */
  let _chestAlarm = 0;
  /** @private ??. */
  let _light = 0;
  /** @private ??. */
  let _acMod2 = 0;
  /** @private ??. */
  let _enStreng = 0;
  /** @private ??. */
  let _base12 = {
    mystreng: 0,
    gotox: null
  };
  /** @private ??. */
  let _enemyInX = 0;
  /** @private ??. */
  let _saveLev = 0;
  /** @private ??. */
  let _saveY = 0;
  /** @private ??. */
  let _saveX = 0;
  /** @private ??. */
  let _directIo = 0;
  /** @private ??. */
  let _mazeLev = 0;
  /** @private ??. */
  let _mazeY = 0;
  /** @private ??. */
  let _mazeX = 0;
  /** @private ??. */
  let _encB4Run = false;
  /** @private ??. */
  let _fightMap = [];
  /** @private ??. */
  let _charDsk = [];
  /** @private ??. */
  let _characters = [];
  /** @private ??. */
  let _scnToc = new WizardryScnToc();
  /** @private ??. */
  let _iocache = [];
  return {
  };
} ());

if (typeof(module) !== "undefined") {
  module.exports = { WizardryController };
}
