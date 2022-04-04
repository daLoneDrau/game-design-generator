import { WizardryCharacter }       from "../bus/wizardry-character.js";
import { WizardryCharacterRoster } from "../bus/wizardry-character-roster.js";
import { WizardryEquipmentList }   from "../bus/wizardry-equipment-list.js";
import { WizardryMapLevel }        from "../bus/wizardry-map-level.js";
import { WizardryScnToc }          from "../bus/wizardry-scntoc.js";
import { DIV2,
  DIV3,
  DIV5,
  DIV6,
  WizardryAlignment,
  WizardryAttribute,
  WizardryCharacterClass,
  WizardryCharacterStatus,
  WizardryObjectType,
  WizardryRace,
  WizardrySquare,
  WizardryXgoto }                  from "../config/wizardry-constants.js";
import { Dice } from "../../../assets/js/base.js";

class WizardryMazeData {
  constructor() {
    /** @private ??. */
    this._mazeLev = 0;
    /** @private ??. */
    this._mazeX = 0;
    /** @private ??. */
    this._mazeY = 0;
    this._quickPlot = false;
  }
  /** Getter for the _mazeLev property. */
  get mazeLev() {
    return this._mazeLev;
  }
  /** Setter for the _mazeLev property. */
  set mazeLev(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._mazeLev = value;
  }
  /** Getter for the _mazeX property. */
  get mazeX() {
    return this._mazeX;
  }
  /** Setter for the _mazeX property. */
  set mazeX(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._mazeX = value;
  }
  /** Getter for the _mazeY property. */
  get mazeY() {
    return this._mazeY;
  }
  /** Setter for the _mazeY property. */
  set mazeY(value) {
    if (isNaN(parseInt(value))) {
      throw ["Invalid value", value];
    }
    this._mazeY = value;
  }
  get quickPlot() {
    return this._quickPlot;
  }
  set quickPlot(value) {
    this._quickPlot = value;
  }
}

/**
 * @class The Application will have a defined Controller class.
 */
const WizardryController = (function() {
  /** @private the current character record being displayed. */
  let _characterRecord = "";
  /**
   * the current adventuring party.
   * @private
   * @type {WizardryCharacter[]}
   */
  let _characters = [];
  /**
   * The current dungeon levels.
   * @private
   * @type {WizardryMapLevel}
   */
  let _currentMap = null;
  /**
   * the map of global script variables.
   */
  let _globalScriptVariables = (function() {
    let _scriptVariables = {
    };
    return {
      /**
       * Gets the value of a global boolean.
       * @param {string} key the variable name
       * @returns {Boolean} the variable's value; default is false if it was never set
       */
      getBooleanValue(key) {
        if (!_scriptVariables.hasOwnProperty(key)) {
          _scriptVariables[key] = false;
        }
        return _scriptVariables[key];
      },
      setVariable(key, value) {
        _scriptVariables[key] = value;
      }
    }
  } ());
  /**
   * The map of locations on the current map level where fights occur.
   * @private
   * @type {Boolean[][]}
   */
  let _fightMap = [];
  /** @private the name the character has inherited, e.g. as part of a re-roll. */
  let _inheritedName = "";
  /**
   * The dictionary of dungeon levels.
   * @private
   * @type {object}
   */
  let _maps = {};
  let _mazeData = new WizardryMazeData();
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
  let _encB4Run = false;
  /** @private ??. */
  let _charDsk = [];
  /** @private ??. */
  let _scnToc = new WizardryScnToc();
  /** @private ??. */
  let _iocache = [];
  /** @private the character roster. */
  let _roster = new WizardryCharacterRoster();
  /** @private the equipment list. */
  let _equipmentList = new WizardryEquipmentList();
  /** @private boltac's inventory -  map of equipemt ids and the # in stock. */
  let _boltacsInventory = {};
  return {
    /** Getter for the _acMod2 property. */
    get acMod2() {
      return _acMod2;
    },
    /** Setter for the _acMod2 property. */
    set acMod2(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _acMod2 = value;
    },
    /** Getter for the _attk012 property. */
    get attk012() {
      return _attk012;
    },
    /** Setter for the _attk012 property. */
    set attk012(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _attk012 = value;
    },
    /** Getter for the _characterRecord property. */
    get characterRecord() {
      return _characterRecord;
    },
    /** Setter for the _characterRecord property. */
    set characterRecord(value) {
      _characterRecord = value;
    },
    /** Getter for the array containing the current adventuring party members' reference ids. */
    get characters() {
      return _characters;
    },
    /** Getter for the _chestAlarm property. */
    get chestAlarm() {
      return _chestAlarm;
    },
    /** Setter for the _chestAlarm property. */
    set chestAlarm(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _chestAlarm = value;
    },
    /** Getter for the _directIo property. */
    get directIo() {
      return _directIo;
    },
    /** Setter for the _directIo property. */
    set directIo(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _directIo = value;
    },
    /** Getter for the _fizzles property. */
    get fizzles() {
      return _fizzles;
    },
    /** Setter for the _fizzles property. */
    set fizzles(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _fizzles = value;
    },
    get globalVariables() {
      return _globalScriptVariables;
    },
    /**
     * Gets the inherited name. Used by the character creator when re-rolling a character. This should really by a Global script variable.
     */
    get inheritedName() {
      return _inheritedName;
    },
    /**
     * Sets the inherited name.
     * @param {string} value
     */
    set inheritedName(value) {
      _inheritedName = value;
    },
    /** Getter for the _llbase04 property. */
    get llbase04() {
      return _llbase04;
    },
    /** Setter for the _llbase04 property. */
    set llbase04(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _llbase04 = value;
    },
    /** Getter for the _light property. */
    get light() {
      return _light;
    },
    /** Setter for the _light property. */
    set light(value) {
      if (isNaN(parseInt(value))) {
        throw ["Invalid value", value];
      }
      _light = value;
    },
    get mazeData() {
      return _mazeData;
    },
    /** Getter for the _partyCnt property. */
    get partyCnt() {
      return _characters.length;
    },
    get boltacsInventory() {
      return _boltacsInventory;
    },
    /** Gets a copy of the character roster. */
    get roster() {
      return _roster.roster;
    },
    /** Gets the equipment list instance. */
    get equipmentListInstance() {
      return _equipmentList;
    },
    /** Gets the character roster instance. */
    get rosterInstance() {
      return _roster;
    },
    /** Getter for the _timeDelay property. */
    get timeDelay() {
      return _timeDelay;
    },
    /** Setter for the _timeDelay property. */
    set timeDelay(value) {
      _timeDelay = value;
    },
    /** Getter for the _xgoto property. */
    get xgoto() {
      return _xgoto;
    },
    /** Setter for the _xgoto property. */
    set xgoto(value) {
      if (this.xgoto !== value) {
        // changing the game state
        switch (value) {
          case WizardryXgoto.XRUNNER:
            _mazeData.quickPlot = false;
            // TODO - fix this
            /*
            READMAZE; // re-load maze
            CLROOMFG( MAZEX, MAZEY); // clear the current room of fights
            REPEAT
              RUNMAIN // run the main loop. taken care of in scene
            UNTIL false
            */
            break;
        }
      }
      _xgoto = value;
    },
    /** Getter for the _xgoto2 property. */
    get xgoto2() {
      return _xgoto2;
    },
    /** Setter for the _xgoto2 property. */
    set xgoto2(value) {
      _xgoto2 = value;
    },
    /**
     * Adds a character to the roster. This is only called from the Character Maker scene.
     * @param {WizardryCharacter} character the character being added
     */
    addCharacterToRoster: function(character) {
      if (typeof(character) == "undefined" || character === null) {
        throw ["Need a WizardryCharacter instance to add", character];
      }
      _roster.addToRoster(character);
    },
    /**
     * Adds a character to the current party.
     * @param {WizardryCharacter} character the character being added
     */
    addToParty(character) {
      if (!_characters.includes(character.refId)) {
        _characters.push(character.refId);         // add the character to the party
        character.inMaze = true;                   // add the INMAZE flag to the character in the party
        character.partyOrder = _characters.length; // store the character's position
        if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
          _roster.updateRoster();
        }
      }
    },
    /**
     * 
     * @param {WizardryCharacter} character the character being outfitted
     * @param {Boolean} equipAll a flag indicating whether the character should equip all items
     */
    equipCharacter(character, equipAll) {
      
      
      
      
      let UNARMED = true;
      let values = WizardryObjectType.values;
      for (let prop in values) {
        CANUSE[prop] = false;
      }
      let UNUSED = false;
      let POSSI = 0;
      let POSSCNT = 0;
      let LUCKI = 0;
      let OBJI;
      let OBJECT;
      /**
       * original array indexed 1-8
       * @type {Number[]}
       */
      let OBJLIST = [0, 0, 0, 0, 0, 0, 0, 0];
      

      

      if (equipAll) {
        ARM4CHAR();
      }

      if (character.clazz === WizardryCharacterClass.NINJA) {
        if (UNARMED) {
          character.armorCl -= parseInt(character.charLev * DIV3) - 2;
        }
      }
    },
    /**
     * Initializes Boltac's Trading Post inventory.  Called from the Init scene.
     */
    initializeBoltacsInventory: function() {
      let keys = _equipmentList.getIds();
      for (let i = 0, li = keys.length; i < li; i++) {
        _boltacsInventory[keys[i]] = _equipmentList.getEquipmentItem(keys[i]).boltacXX;
      }
    },
    /**
     * Initializes the character roster.  Called from the Init scene.
     * @param {Array} arr the roster array
     */
    initializeCharacterRoster: function(arr) {
      _roster.init(arr);
      // go through roster, finding all characters who should be in the party
      const roster = _roster.roster;
      /** dictionary for storing party members by order and refid */
      const party = {};
      for (let i = 0, li = roster.length; i < li; i++) {
        const character = roster[i];
        if (character.inMaze && character.lostXyl.location[2] === 0 && character.status !== WizardryCharacterStatus.LOST) {
          party[character.partyOrder] = character.refId;
        }
      }
      // sort party members by order and put in party
      const keys = Object.keys(party);
      if (keys.length > 0) {
        keys.sort();
        for (let i = 0, li = keys.length; i < li; i++) {
          _characters.push(party[keys[i]]);
        }
      }
      console.log("init roster")
    },
    /**
     * Initializes the equipment list.  Called from the Init scene.
     * @param {Array} arr the roster array
     */
    initializeEquipmentList: function(arr) {
      _equipmentList.init(arr);
    },
    initializeMapLevels: function(levels) {
      for (let prop in levels) {
        _maps[prop] = levels[prop];
      }
    },
    newMaze() {
      /**
       * Map out the locations of a random fight.
       */
      const fights = () => {
        // clear the array of fight locations
        _fightMap.length = 0;
        for (let x = 19; x >= 0; x--) {
          const arr = [];
          for (let y = 19; y >= 0; y--) {
            arr.push(false);
          }
          _fightMap.push(arr);
        }
        let fightX = 0, fightY = 0;
        /**
         * Find a spot on the map that is a treasure room, but hasn't been marked with a fight.
         */
        const findSpot = () => {
          // pick a random location
          let x1 = Dice.rollDie(20) - 1;
          let y1 = Dice.rollDie(20) - 1;
          fightX = x1;
          fightY = y1;
          do {
            if (_currentMap.getCell(fightX, fightY).isTreasureRoom) {
              // if this is a treasure room
              if (!_fightMap[fightX][fightY]) {
                // and the location wasn't selected for the fight map
                break;
              }
            }
            fightX++;
            if (fightX > 19) {
              fightX = 0;
              fightY++;
              if (fightY > 19) {
                fightY = 0
              }
            }
          } while (fightX !== x1 && fightY !== y1);
        };
        /**
         * Fills a room with flags indicating it has a fight.
         * @param {Number} x the x-coordinate of the first cell in the room
         * @param {Number} y the y-coordinate of the first cell in the room
         */
        const fillRoom = (x, y) => {
          const cells = _currentMap.getAllCellsForRoom(x, y);
          for (let i = cells.length - 1; i >= 0; i--) {
            _fightMap[x][y] = true;
          }
        };
        // fill the multi-dimensional boolean array with false values
        _fightMap.length = 0;
        for (let i = 19; i >= 0; i--) {
          const arr = [];
          _fightMap.push(arr);
          for (let i = 19; i >= 0; i--) {
            arr.push(false);
          }
        }
        // fill 9 random rooms with encounters
        for (let x = 1; x <= 9; x++) {
          findSpot();
          fillRoom(fightX, fightY);
        }
        // fill any rooms marked with encounters
        for (let x = 0; x <= 19; x++) {
          for (let y = 0; y <= 19; y++) {
            if (_currentMap.getCell(x, y).type === WizardrySquare.ENCOUNTE) {
              fillRoom(x, y);
            }
          }
        }
      };
      if (_mazeData.mazeLev === 0) {
        _xgoto = WizardryXgoto.XCHK4WIN;
      } else {
        if (_mazeData.mazeLev < 0) { // entering the maze from town
          _mazeData.mazeLev = 1;
          _xgoto = WizardryXgoto.XINSPCT2;
        } else {
          _xgoto = WizardryXgoto.XRUNNER;
        }
        _currentMap = new WizardryMapLevel(_maps[_mazeData.mazeLev]);
        fights();
        // CLRRECT( 1, 11, 38, 4);
      }
         
    },
    /**
     * Removes a character from the current party.
     * @param {WizardryCharacter} character the character being removed
     */
    removeFromParty(character) {
      if (_characters.includes(character.refId)) {
        const index = _characters.indexOf(character.refId);
        if (index > -1) {
          _characters.splice(index, 1); // remove the character to the party
          character.inMaze = false;     // remove the INMAZE flag from the character
          // re-order the party
          for (let i = _characters.length - 1; i >= 0; i--) {
            const character = _roster.getCharacterRecord(_characters[i]);
            character.partyOrder = i;
          }
        }
        if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
          _roster.updateRoster();
        }
      }
    },
  };
} ());

export { WizardryController };
