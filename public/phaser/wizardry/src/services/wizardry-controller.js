if (typeof(module) !== "undefined") {
  var { WizardryXgoto } = require("../config/wizardry-constants");
  var { WizardryScnToc } = require("../bus/wizardry-scntoc");
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
    /** Getter the _llbase04 property. */
    get llbase04() {
      return _llbase04;
    },
    /** Setter the _llbase04 property. */
    set llbase04(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _llbase04 = value;
    },
    /** Getter the _xgoto property. */
    get xgoto() {
      return _xgoto;
    },
    /** Setter the _xgoto property. */
    set xgoto(value) {
      _xgoto = value;
    },
    /** Getter the _xgoto2 property. */
    get xgoto2() {
      return _xgoto2;
    },
    /** Setter the _xgoto2 property. */
    set xgoto2(value) {
      _xgoto2 = value;
    },
  };
} ());

if (typeof(module) !== "undefined") {
  module.exports = { WizardryController };
}
