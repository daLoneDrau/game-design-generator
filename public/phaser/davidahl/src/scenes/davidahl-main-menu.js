if (typeof(module) !== "undefined") {
  var { Phaser } = require("phaser");
  var { DavidAhlConstants } = require("../config/davidahl-constants.js");
}
/**
 * @class The Main Menu is the application entry point. From here, all game menus and links to cartridges are displayed.
 */
var DavidAhlMainMenu = (function() {
  /** @private Scene instance. */
  let _scene = new Phaser.Scene({
    key: "Main Menu",
    active: false
  });
  /** @private The current rendering state, determining which set of options is displayed. */
  let _state = -1;
  /** @private flag indicating whether the latest change to the state was resolved */
  let _stateChangeResolved = true;
  /** @private The map of UI templates displayed for each menu state. */
  const _TEMPLATES = {
    /** @private template for state MAIN_MENU_CARD_GAMES */
    [DavidAhlConstants.MAIN_MENU_CARD_GAMES]: {
      group: null,
      children: [
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 1]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "David Ahl's Computer Games", // text
          ],
          position: [6, 2],
          scale: 1.25,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Microcomputer Edition", // text
          ],
          position: [6, 3],
          scale: 0.875,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[1] Acey Ducey", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlGameConsole.cartridge = \"Acey Ducey\"; DavidAhlController.currentScene = \"GameConsole\";"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 5],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[ESC] Back to Basic Computer Games", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_BASIC;"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 6],
          tint: 0xA6A1FF
        },
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 11]
        }
      ]
    },
    /** @private template for state MAIN_MENU_BASIC */
    [DavidAhlConstants.MAIN_MENU_BASIC]: {
      group: null,
      children: [
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 1]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "David Ahl's Computer Games", // text
          ],
          position: [6, 2],
          scale: 1.25,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Microcomputer Edition", // text
          ],
          position: [6, 3],
          scale: 0.875,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[1] Card Games", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_CARD_GAMES;"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 5],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[ESC] Back to the Main Menu", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_DEFAULT;"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 6],
          tint: 0xA6A1FF
        },
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 11]
        }
      ]
    },
    /** @private template for state MAIN_MENU */
    [DavidAhlConstants.MAIN_MENU_DEFAULT]: {
      group: null,
      children: [
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 1]
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "David Ahl's Computer Games", // text
          ],
          position: [6, 2],
          scale: 1.25,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "Microcomputer Edition", // text
          ],
          position: [6, 3],
          scale: 0.875,
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[1] Basic Computer Games", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_BASIC;"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 5],
          tint: 0xA6A1FF
        },
        {
          type: "bitmapText",
          args: [
            0, // x
            0, // y
            "c64_pro_style_16", // font
            "[2] Big Computer Games", // text
          ],
          listeners: {
            pointerdown: {
              args: "",
              body: "DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_BIG;"
            }
          },
          interactive: [{ useHandCursor: true }],
          origin: [0, 0.5],
          position: [3, 6],
          tint: 0xA6A1FF
        },
        {
          type: "rectangle",
          args: [
            0, // x
            0, // y
            0.75, // width
            10, // height
            0xA6A1FF, // color
            1, // alpha
          ],
          position: [6, 11]
        }
      ]
    },
  };
  /** @private The dictionary of 'key up' event handlers. Keys are the menu states. */
  const _KEY_UP_EVENT_HANDLERS = {
    /** @private Key handler for the 'Card Games' menu. */
    [DavidAhlConstants.MAIN_MENU_CARD_GAMES]: function(event) {
      switch (event.key) {
        case "1":
          DavidAhlGameConsole.cartridge = "Acey Ducey";
          DavidAhlController.currentScene = "GameConsole";
          break;
        case "Escape":
          DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_BASIC;
          break;
      }
    },
    /** @private Key handler for the 'Basic Games' menu. */
    [DavidAhlConstants.MAIN_MENU_BASIC]: function(event) {
      switch (event.key) {
        case "1":
          DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_CARD_GAMES;
          break;
        case "Escape":
          DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_DEFAULT;
          break;
      }
    },
    /** @private Key handler for the Default menu. */
    [DavidAhlConstants.MAIN_MENU_DEFAULT]: function(event) {
      switch (event.key) {
        case "1":
          DavidAhlMainMenu.state = DavidAhlConstants.MAIN_MENU_BASIC;
          break;
      }
    },
  };
  { // DavidAhlMainMenu Getters/Setters
    /** Gets/sets the current state. */
    Object.defineProperty(_scene, "state", {
      get: function() {
        return _state;
      },
      set: function(value) {
        _state = value;
        _stateChangeResolved = false;
      }
    });
  }
  /**
   * This method is called by the Scene Manager when the scene starts, before preload() and create().
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  _scene.init = function(data) {
  };
  /**
   * This method is called by the Scene Manager, after init() and before create(), only if the Scene has a LoaderPlugin. After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically. Use it to load assets. 
   */
  _scene.preload = function() {
    // load the theme fonts
    this.load.bitmapFont("c64_pro_style_16", "/phaser/assets/font/c64_pro_style_16.png", "/phaser/assets/font/c64_pro_style_16.xml");
    this.load.bitmapFont("c64_pro_mono_16", "/phaser/assets/font/c64_pro_mono_16.png", "/phaser/assets/font/c64_pro_mono_16.xml");
  };
  /**
   * This method is called by the Scene Manager when the scene starts, after init() and preload(). If the LoaderPlugin started after preload(), then this method is called only after loading is complete. Use it to create your game objects.
   * @param {object} data Any data passed via ScenePlugin.add() or ScenePlugin.start(). Same as Scene.settings.data.
   */
  _scene.create = function(data) {
    // create a grid for laying out elements
    let grid = new DavidAhlAlignmentGrid({ "parent": this, "columns": 13, "rows": 13 });
    //turn on the lines for testing
    //and layout
    grid.show();
    
    // create groups for each state
    let keys = Object.keys(_TEMPLATES);
    keys.sort();
    for (let i = keys.length - 1; i >= 0; i--) {
      let entry = _TEMPLATES[keys[i]];
      let group = this.add.group();
      entry.group = group;
      for (let j = entry.children.length - 1; j >= 0; j--) {
        let child = entry.children[j];
        switch (child.type) {
          case "rectangle":
            // if height or width is less than 1, then it is a percentage
            if (child.args[2] < 1) {
              child.args[2] *= this.scale.width;
            }
            if (child.args[3] < 1) {
              child.args[3] *= this.scale.height;
            }
            break;
        }
        let object = this.add[child.type](...child.args);
        // set the origin
        if (child.hasOwnProperty("origin")) {
          object.setOrigin(...child.origin); // set the origin property
        } else {
          object.setOrigin(0.5); // set the origin to the middle
        }
        switch (child.type) {
          case "bitmapText":
            if (child.hasOwnProperty("scale")) {
              object.setScale(child.scale);
            }
            if (child.hasOwnProperty("tint")) {
              object.setTint(child.tint);
            }
            if (child.hasOwnProperty("dropShadow")) {
              object.setDropShadow(...child.dropShadow); // set the origin property
            }
            break;
        }
        // add listeners
        if (child.hasOwnProperty("listeners")) {
          let listeners = Object.keys(child.listeners);
          for (let i = listeners.length - 1; i >= 0; i--) {
            switch (child.type) {
              case "dom":
                object.addListener(listeners[i]);
                object.on(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body));
                break;
              default:
                object.addListener(listeners[i], new Function(child.listeners[listeners[i]].args, child.listeners[listeners[i]].body));
                break;
            }
          }
        }
        // add interactive
        if (child.hasOwnProperty("interactive")) {
          object.setInteractive(...child.interactive); // set the origin property
        }
        // add the element to the group
        group.add(object, true);
    
        // place the element where needed
        grid.placeAt(child.position[0], child.position[1], object);
      }
      // hide the group
      group.setVisible(false);
    }
    //  Global event listener, catches all keys
    //  Receives every single key up event, regardless of type
    this.input.keyboard.on('keyup', function (event) {
      _KEY_UP_EVENT_HANDLERS[_state](event);
    });
  };
  /**
   * This method is called once per game step while the scene is running.
   * @param {Number} time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param {Number} delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  _scene.update = function(time, delta) {
    if (!_stateChangeResolved) {
      // hide all templates
      let keys = Object.keys(_TEMPLATES);
      for (let i = keys.length - 1; i >= 0; i--) {
        _TEMPLATES[keys[i]].group.setVisible(false);
      }
    
      // show the current template
      _TEMPLATES[_state].group.setVisible(true);
    
      // reset the flag
      _stateChangeResolved = true;
    }
  };
  return _scene;
} ());

if (typeof(module) !== "undefined") {
  module.exports = { DavidAhlMainMenu };
}
