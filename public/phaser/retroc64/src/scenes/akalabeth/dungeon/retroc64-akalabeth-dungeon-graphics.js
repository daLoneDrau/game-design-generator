if (typeof(module) !== "undefined") {
  var { RetroC64AkalabethController } = require("../../../services/akalabeth/retroc64-akalabeth-controller");
  var { RetroC64AkalabethDungeonScene } = require("./retroc64-akalabeth-dungeon-scene");
  var { RetroC64SceneController } = require("../../../scenes/retroc64-scene-controller");
}
/**
 * @class The Dungeon view will have a scene instance for rendering the graphical portions.
 * @param {object} parameterObject optional initialization parameters
 */
function RetroC64AkalabethDungeonGraphics(parameterObject) {
  parameterObject.columns = 1;
  parameterObject.rows = 1;
  UiScene.call(this, parameterObject); // call parent constructor

  /** @private A Phaser.Graphics instance used for rendering the world map. */
  this._dungeonGraphics = null;
  { // RetroC64AkalabethDungeonGraphics View Templates
    this._VIEWS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = {
      group: null,
      children: []
    };
  }
  { // RetroC64AkalabethDungeonGraphics Key Listener Handlers
    this._KEY_UP_EVENT_HANDLERS[[RetroC64Constants.AKALABETH_DUNGEON_MAIN]] = function(event, context) {
      
    };
  }
  this._state = RetroC64Constants.AKALABETH_DUNGEON_MAIN;
};
RetroC64AkalabethDungeonGraphics.prototype = Object.create(UiScene.prototype);
RetroC64AkalabethDungeonGraphics.prototype.constructor = UiScene;
{ // RetroC64AkalabethDungeonGraphics Getters/Setters
}
/**
 * Starts the scene.
 */
RetroC64AkalabethDungeonGraphics.prototype.startScene = function() {
  if (!this._setupComplete) {
    this.init();
    this.preload();
    this.create();
    this._setupComplete = true;
  }
  this._stateChangeResolved = false;
}
{ // RetroC64AkalabethDungeonGraphics Scene Extensions
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
     * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
 */
  RetroC64AkalabethDungeonGraphics.prototype.init = function(data) {
  }
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  RetroC64AkalabethDungeonGraphics.prototype.preload = function() {
  }
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  RetroC64AkalabethDungeonGraphics.prototype.create = function(data) {
    // call base
    UiScene.prototype.create.call(this, data);
    this._dungeonGraphics = this._scene.make.graphics({ lineStyle: { width: 3, color: 10920447 } });
  }
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  RetroC64AkalabethDungeonGraphics.prototype.update = function(time, delta) {
    // call base
    UiScene.prototype.update.call(this, time, delta);
    if (RetroC64AkalabethDungeonScene.actionTaken) {
      this.render();
      RetroC64AkalabethDungeonScene.actionTaken = false;
    }
  }
}
/**
 * Delegates KeyUp events to the property handler.
 * @param {object} event the event being emitted
 */
RetroC64AkalabethDungeonGraphics.prototype.handleKeyUpEvent = function(event) {
  this._KEY_UP_EVENT_HANDLERS[this._state](event, this);
}
/**
 * Renders the dungeon field of view.
 */
RetroC64AkalabethDungeonGraphics.prototype.render = function() {
  let px = RetroC64AkalabethController.world.px, py = RetroC64AkalabethController.world.py, dx = RetroC64AkalabethController.world.dx, dy = RetroC64AkalabethController.world.dy;
  let CENT = RetroC64AkalabethController.world.dungeonLevel[py + dy * DIS][px + dx * DIS];
  let LEFT = RetroC64AkalabethController.world.dungeonLevel[py + dy * DIS - dx][px + dx * DIS - dy];
  let RIGH = RetroC64AkalabethController.world.dungeonLevel[py + dy * DIS + dx][px + dx * DIS + dy];
  let coords = {
    L1: RetroC64AkalabethController.world.per[DIS][0],
    R1: RetroC64AkalabethController.world.per[DIS][1],
    T1: RetroC64AkalabethController.world.per[DIS][2],
    B1: RetroC64AkalabethController.world.per[DIS][3],
    L2: RetroC64AkalabethController.world.per[DIS + 1][0],
    R2: RetroC64AkalabethController.world.per[DIS + 1][1],
    T2: RetroC64AkalabethController.world.per[DIS + 1][2],
    B2: RetroC64AkalabethController.world.per[DIS + 1][3]
  };
  console.log("center",py + dy * DIS,px + dx * DIS);
  console.log("left",py + dy * DIS - dx,px + dx * DIS - dy);
  console.log("right",py + dy * DIS + dx,px + dx * DIS + dy);
  console.log(LEFT, CENT, RIGH);
  CENT  = parseInt(CENT);
  LEFT  = parseInt(LEFT);
  RIGH = parseInt(RIGH);
  let MC = parseInt(CENT / 10); // the monster type in this location
  CENT  = CENT - MC * 10;
  LEFT  = parseInt((LEFT / 10 - parseInt(LEFT / 10)) * 10 + .1);
  RIGH  = parseInt((RIGH / 10 - parseInt(RIGH / 10)) * 10 + .1);
  console.log(LEFT, CENT, RIGH);
  console.log("DIS",DIS,"MC",MC)
  if (DIS === 0) {
    this.leftRightWalls(DIS, LEFT, RIGH, coords);
  } else {
    this.centerWalls(CENT, coords);
    switch (CENT) {
      case 1:
      case 3:
      case 4:
        EN = 1;
        break;
      case 5:
        this.leftRightWalls();
        if (DIS > 0) {
          /*
          HPLOT 139 - 10 / DIS,PER%(DIS,3) TO 139 - 10 / DIS,PER%(DIS,3) - 10 / DIS TO 139 + 10 / DIS,PER%(DIS,3) - 10 / DIS TO 139 + 10 / DIS,PER%(DIS,3) TO 139 - 10 / DIS,PER%(DIS,3)
          INVERSE :
          PRINT "CHEST!":
          NORMAL
          HPLOT 139 - 10 / DIS,PER%(DIS,3) - 10 / DIS TO 139 - 5 / DIS,PER%(DIS,3) - 15 / DIS TO 139 + 15 / DIS,PER%(DIS,3) - 15 / DIS TO 139 + 15 / DIS,PER%(DIS,3) - 5 / DIS TO 139 + 10 / DIS,PER%(DIS,3)
          HPLOT 139 + 10 / DIS,PER%(DIS,3) - 10 / DIS TO 139 + 15 / DIS,PER%(DIS,3) - 15 / DIS
          */
        }
        break;
      case 7:
      case 9:
        this.leftRightWalls();
        // HPLOT FT%(DIS,0),FT%(DIS,4) TO FT%(DIS,2),FT%(DIS,5) TO FT%(DIS,3),FT%(DIS,5) TO FT%(DIS,1),FT%(DIS,4) TO FT%(DIS,0),FT%(DIS,4)
        if (CENT === 7) {
          /*
          BASE = LAD%(DIS,3): 
          TP   = LAD%(DIS,2):   
          LX   = LAD%(DIS,0):   
          RX   = LAD%(DIS,1):   
          HPLOT LX,BA TO LX,TP:
          HPLOT RX,TP TO RX,BA
  
          Y1 = (BA * 4 + TP) / 5:     
          Y2 = (BA * 3 + TP * 2) / 5: 
          Y3 = (BA * 2 + TP * 3) / 5: 
          Y4 = (BA + TP * 4) / 5:     
          HPLOT LX,Y1 TO RX,Y1:
          HPLOT LX,Y2 TO RX,Y2:
          HPLOT LX,Y3 TO RX,Y3:
          HPLOT LX,Y4 TO RX,Y4
          */
        }
        break;
      case 8:
        this.leftRightWalls();
        /*
        HPLOT FT%(DIS,0),158 - FT%(DIS,4) TO FT%(DIS,2),158 - FT%(DIS,5) TO FT%(DIS,3),158 - FT%(DIS,5) TO FT%(DIS,1),158 - FT%(DIS,4) TO FT%(DIS,0),158 - FT%(DIS,4)
        BASE = LAD%(DIS,3): 
        TP   = LAD%(DIS,2):   
        LX   = LAD%(DIS,0):   
        RX   = LAD%(DIS,1):   
        HPLOT LX,BA TO LX,TP:
        HPLOT RX,TP TO RX,BA
  
        Y1 = (BA * 4 + TP) / 5:     
        Y2 = (BA * 3 + TP * 2) / 5: 
        Y3 = (BA * 2 + TP * 3) / 5: 
        Y4 = (BA + TP * 4) / 5:     
        HPLOT LX,Y1 TO RX,Y1:
        HPLOT LX,Y2 TO RX,Y2:
        HPLOT LX,Y3 TO RX,Y3:
        HPLOT LX,Y4 TO RX,Y4
        */
        break;
    }
  }
  if (MC > 0) {
    /*
    B = 79 + YY%(DIS): 
    C = 139
    INVERSE :
    IF MC = 8 THEN 
      PRINT "CHEST!";:
      CALL - 868:
      PRINT :
      NORMAL :
      GOTO 269
    */
  }
  if (EN === 0) {
    this.render(DIS + 1, EN);
  }
}
/**
 * Renders the center walls.
 * @param {Number} CENT the center location's value
 * @param {object} coords the coordinates
 */
RetroC64AkalabethDungeonGraphics.prototype.centerWalls = function(CENT, coords) {
  if (CENT === 1 || CENT === 3 || CENT === 4) {
    console.log("plot lines", coords.L1, coords.T1, coords.R1, coords.T1)
    console.log("plot lines", coords.R1, coords.B1, coords.L1, coords.B1)
    // HPLOT L1,T1 TO R1,T1 TO R1,B1 TO L1,B1 TO L1,T1
    
    if (CENT === 4) {
      // HPLOT CD%(DIS,0),CD%(DIS,3) TO CD%(DIS,0),CD%(DIS,2) TO CD%(DIS,1),CD%(DIS,2) TO CD%(DIS,1),CD%(DIS,3):
    }
  }
}
/**
 * Renders the left and right walls in the dungeon field of view.
 */
RetroC64AkalabethDungeonGraphics.prototype.leftRightWalls = function(DIS, LEFT, RIGHT, coords) {
  if (LEFT === 1 || LEFT == 3 || LEFT === 4) {
    console.log("plot lines", coords.L1, coords.T1, coords.L2, coords.T2)
    console.log("plot lines", coords.L1, coords.B1, coords.L2, coords.B2)
    /*
    HPLOT L1,T1 TO L2,T2:
    HPLOT L1,B1 TO L2,B2
    */
    if (LEFT === 4) {
      if (DIS > 0) {
        // HPLOT LD%(DIS,0),LD%(DIS,4) TO LD%(DIS,0),LD%(DIS,2) TO LD%(DIS,1),LD%(DIS,3) TO LD%(DIS,1),LD%(DIS,5)
      } else {
        // HPLOT 0,LD%(DIS,2) - 3 TO LD%(DIS,1),LD%(DIS,3) TO LD%(DIS,1),LD%(DIS,5)
      }
    }
  } else {
    // left is not a wall
    if (DIS !== 0) {
      // close off the left side with a line from top to bottom
      // HPLOT L1,T1 TO L1,B1
    }
    // HPLOT L1,T2 TO L2,T2 TO L2,B2 TO L1,B2
  }
  if (RIGHT === 1 || RIGHT == 3 || RIGHT === 4) {
    console.log("plot lines", coords.R1, coords.T1, coords.R2, coords.T2)
    console.log("plot lines", coords.R1, coords.B1, coords.R2, coords.B2)
    /*
    HPLOT R1,T1 TO R2,T2:
    HPLOT R1,B1 TO R2,B2
    */
    if (RIGHT === 4) {
      if (DIS > 0) {
        // HPLOT 279 - LD%(DIS,0),LD%(DIS,4) TO 279 - LD%(DIS,0),LD%(DIS,2) TO 279 - LD%(DIS,1),LD%(DIS,3) TO 279 - LD%(DIS,1),LD%(DIS,5)
      } else {
        // HPLOT 279,LD%(DIS,2) - 3 TO 279 - LD%(DIS,1),LD%(DIS,3) TO 279 - LD%(DIS,1),LD%(DIS,5)
      }
    }
  } else {
    // right is not a wall
    if (DIS !== 0) {
      // close off the left side with a line from top to bottom
      // HPLOT R1,T1 TO R1,B1
    }
    // HPLOT R1,T2 TO R2,T2 TO R2,B2 TO R1,B2
  }
}
if (typeof(module) !== "undefined") {
  module.exports = { RetroC64AkalabethDungeonGraphics };
}
