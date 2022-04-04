import { DIV2,
  DIV3,
  DIV4,
  DIV5,
  DIV6, 
  DIV7,
  DIV8,
  DIV24,
  DIV38,
  DIV40,
  WizardryConstants,
  WizardryCharacterStatus, 
  WizardryXgoto, 
  DIV12,
  WizardryAttribute,
  WizardryCharacterClass,
  WizardryAlignment,
  DIV9,
  DIV26}             from "./wizardry-constants.js";
import { WizardryCharacter }  from "../bus/wizardry-character.js";
import * as Materials         from "../components/materials/materials.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }             from "../scenes/wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE,
  FADE }                      from "../scenes/wizardry-ui-configuration.js";
import { WizardryController } from "../services/wizardry-controller.js";
import { Dice }               from "../../../assets/js/base.js";
import { paginate } from "../components/utilities/paginate.js";
import { WizardryDataManager } from "../services/wizardry-data-manager.js";

/**
 * Wizardry UI.
 */
const WizardryUiConfig = {
  BABYLON_TIMER_ACTION: function(action, timeout = KEYBOARD_ENTRY_DELAY) {
    if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
      // running unit tests - immediately add player to party
      action();
    } else {
      BABYLON.setAndStartTimer({
        timeout: timeout,
        contextObservable: this._parent.onBeforeRenderObservable,
        breakCondition: () => {
          // this will check if we need to break before the timeout has reached
          return this._parent.isDisposed;
        },
        onEnded: (data) => {
          // this will run when the timeout has passed
          action();
        },
        onTick: (data) => {
          // this will run
        },
        onAborted: (data) => {
          // this function will run when the break condition has met (premature ending)
        },
      });
    }
  },
   /**
    * The basic screen borders.
    * @type {Array}
    */
  BASIC_BORDERS: [
    {
      points: [
        { cell: [0, 0] },
        { cell: [39, 0] }
      ]
    },
    {
      points: [
        { cell: [39, 0] },
        { cell: [39, 2] }
      ]
    },
    {
      points: [
        { cell: [39, 2] },
        { cell: [0, 2] }
      ]
    },
    {
      points: [
        { cell: [0, 2] },
        { cell: [0, 0] }
      ]
    },
    {
      points: [
        { cell: [0, 11] },
        { cell: [39, 11] }
      ]
    }
  ],
  /**
   * A basic key event handler that delegates key events to assigned responses.
   * @type {void}
   */
  BASIC_KEY_HANDLER: function() {
    const key = arguments[0];
    if (this.keyEvents.hasOwnProperty(key)) {
      const retObj = this.keyEvents[key].apply(this);
      if (retObj.isValid) {
        this._acceptingInput = false;
        this.actions[retObj.action].apply(this, Array.isArray(retObj.arguments) ? retObj.arguments : [retObj.arguments] );
      }
    }
  },
  /**
   * A key event handler that checks key events for validity before either passing along to assigned responses or displaying a message.
   * @type {void}
   */
  MESSAGED_KEY_HANDLER: function() {
    let validInput = false;
    const key = arguments[0];
    if (this.keyEvents.hasOwnProperty(key)) {
      const retObj = this.keyEvents[key].apply(this);
      validInput = retObj.isValid;
      if (validInput) {
        this._acceptingInput = false;
        this.actions[retObj.action].apply(this, Array.isArray(retObj.arguments) ? retObj.arguments : [retObj.arguments] );
      }
    }
    if (!validInput) {
      const messageBlock = this.getDynamicElement("message block");
      this._parent.stopAnimation(messageBlock);
      messageBlock.text = "Huh?";
      this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  },
  /**
   * Creates an element item for the Party Window
   * @param {WizardryScene} scene the parent scene
   * @param {void} callback the callback function. if none is provided, the elements will not be clickable
   * @param {object} scope the scope object the callback function runs on
   * @returns {BABYLON.GUI.Rectangle} the display item
   */
  PARTY_WINDOW_ITEM_FACTORY: (scene, callback = undefined, scope = undefined) => {
    /**
     * an interactive parent element to hold the party member elements.
     * @type {BABYLON.GUI.Rectangle}
     */
    const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
    rectangle.thickness = 0;
    rectangle.background = Materials.darkRGB;
    rectangle.adaptWidthToChildren = false;
    rectangle.hasCallback = false;
    if (typeof(callback) !== "undefined" && callback !== null) {
      rectangle.hasCallback = true;
      rectangle.isPointerBlocker = true;
      rectangle.hoverCursor = "pointer";
      // CLICK
      rectangle.onPointerClickObservable.add((eventData, eventState) => {
        callback.apply(scope, [rectangle.name]);
      });
      // MOUSE OVER
      rectangle.onPointerEnterObservable.add((eventData, eventState) => {
        rectangle.background = Materials.lightRGB;
        const children = rectangle.children[0].children;
        for (let i = children.length - 1; i >= 0; i--) {
          children[i].color = Materials.darkRGB;
        }
      });
      // MOUSE EXIT
      rectangle.onPointerOutObservable.add(
        (eventData, eventState) => {
          rectangle.background = Materials.darkRGB;
          const children = rectangle.children[0].children;
          for (let i = children.length - 1; i >= 0; i--) {
            children[i].color = Materials.lightRGB;
          }
        },     // callback
        -1,    // mask used to filter observers
        false, // flag indicating whether the callback is inserted at first postion
        scope  // scope object
      );
    }
    /** a BABYLON.GUI.Grid to lay out the party member elements */
    const row = WizardryScene.createGrid({
      columns: [
        DIV38,      // empty
        DIV38,      // 1 - order #
        DIV38,      // empty
        15 * DIV38, // 3 - name
        DIV38,      // empty
        5 * DIV38,  // 5 - class
        DIV38,      // empty
        2 * DIV38,  // 7 - ac
        DIV38,      // empty
        4 * DIV38,  // 9 -  hits
        DIV38,      // empty
        6 * DIV38   // 11 - status
      ]
    });
    /** a dictionary object for the interactive text blocks. */
    let o = {
      order:  scene.createTextBlock({ }),
      name:   scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),
      clazz:  scene.createTextBlock(),
      ac:     scene.createTextBlock(),
      hits:   scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT }),
      status: scene.createTextBlock()
    };
    // add widgets to row
    row.addControl(o.order,  0, 1); // row, column
    row.addControl(o.name,   0, 3); // row, column
    row.addControl(o.clazz,  0, 5); // row, column
    row.addControl(o.ac,     0, 7); // row, column
    row.addControl(o.hits,   0, 9); // row, column
    row.addControl(o.status, 0, 11); // row, column

    rectangle.addControl(row);

    return rectangle;
  },
  /**
   * Contains the settings for displaying the Party Window Header row.
   * @type {object}
   */
  PARTY_WINDOW_HEADER: {
    type: "grid",
    "initialization parameters": {
      columns: [
        DIV38,      // empty
        DIV38,      // 1 - order #
        DIV38,      // empty
        15 * DIV38, // 3 - name
        DIV38,      // empty
        5 * DIV38,  // 5 - class
        DIV38,      // empty
        2 * DIV38,  // 7 - ac
        DIV38,      // empty
        4 * DIV38,  // 9 -  hits
        DIV38,      // empty
        6 * DIV38   // 11 - status
      ]
    },
    children: [
      {
        type: "text",
        position: {
          column: 1,
          row: 0
        },
        "initialization parameters": {
          text: "#"
        }
      },
      {
        type: "text",
        position: {
          column: 3,
          row: 0
        },
        "initialization parameters": {
          text: "CHARACTER NAME",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        }
      },
      {
        type: "text",
        position: {
          column: 5,
          row: 0
        },
        "initialization parameters": {
          text: "CLASS"
        }
      },
      {
        type: "text",
        position: {
          column: 7,
          row: 0
        },
        "initialization parameters": {
          text: "AC"
        }
      },
      {
        type: "text",
        position: {
          column: 9,
          row: 0
        },
        "initialization parameters": {
          text: "HITS"
        }
      },
      {
        type: "text",
        position: {
          column: 11,
          row: 0
        },
        "initialization parameters": {
          text: "STATUS"
        }
      },
    ]
  },
  /**
   * Creates an element item for the Roster Window
   * @param {WizardryScene} scene the parent scene
   * @param {void} callback the callback function. if none is provided, the elements will not be clickable
   * @param {object} scope the scope object the callback function runs on
   * @returns {BABYLON.GUI.Rectangle} the display item
   */
  ROSTER_WINDOW_ITEM_FACTORY: (scene, callback = undefined, scope = undefined) => {
    /**
     * an interactive parent element to hold the party member elements.
     * @type {BABYLON.GUI.Rectangle}
     */
    const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
    rectangle.thickness = 0;
    rectangle.background = Materials.darkRGB;
    rectangle.adaptWidthToChildren = false;
    rectangle.hasCallback = false;
    if (typeof(callback) !== "undefined" && callback !== null) {
      rectangle.hasCallback = true;
      rectangle.isPointerBlocker = true;
      rectangle.hoverCursor = "pointer";
      // CLICK
      rectangle.onPointerClickObservable.add((eventData, eventState) => {
        callback.apply(scope, [rectangle.name]);
      });
      // MOUSE OVER
      rectangle.onPointerEnterObservable.add((eventData, eventState) => {
        rectangle.background = Materials.lightRGB;
        const child = rectangle.children[0];
        child.color = Materials.darkRGB;
      });
      // MOUSE EXIT
      rectangle.onPointerOutObservable.add(
        (eventData, eventState) => {
          rectangle.background = Materials.darkRGB;
          const child = rectangle.children[0];
          child.color = Materials.lightRGB;
        },     // callback
        -1,    // mask used to filter observers
        false, // flag indicating whether the callback is inserted at first postion
        scope  // scope object
      );
    }

    rectangle.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

    return rectangle;
  },
  /**
   * Sets the party window display during render.
   * @param {string[]} displayItems the list of party characters to display.
   * @param {BABYLON.GUI.Rectangle[]} displayElements the list of elements displaying the characters
   */
  SET_PARTY_WINDOW_DISPLAY: (displayItems, displayElements) => {
    // iterate through elements
    for (let i = displayElements.length - 1; i >= 0; i--) {
      // all elements are a rectangle containing a layout grid with text elements
      const rectangle = displayElements[i];
      const children = displayElements[i].children[0].children;
      // clear the text
      for (let j = children.length - 1; j >= 0; j--) {
        children[j].text = "";
      }
      // if the element is clickable, hide it to eliminate hover behavior
      if (rectangle.hasCallback) {
        rectangle.isVisible = false;
      }
    }
    // iterate through list items
    for (let i = 0, li = displayItems.length; i < li; i++) {
      const character = WizardryController.rosterInstance.getCharacterRecord(displayItems[i]);
      const rectangle = displayElements[i];
      const children = displayElements[i].children[0].children;
      let j = 0;
      // set the character display elements
      children[j++].text = (i + 1).toString();
      children[j++].text = character.name;
      children[j++].text = [character.alignment.title.substring(0, 1), "-", character.clazz.title.substring(0, 3)].join("");
      children[j++].text = character.armorCl > -10 ? character.armorCl.toString() : "LO";
      children[j++].text = character.hpLeft.toString();
      if (character.status === WizardryCharacterStatus.OK) {
        if (character.lostXyl.poisonAmt[0] !== 0) {
          children[j].text = "POISON";
        } else {
          children[j].text = character.hpMax.toString();
        }
      } else {
        children[j++].text = character.status.title;
      }
      // if the element is clickable, set the element name and make sure it is visible
      if (rectangle.hasCallback) {
        rectangle.name = displayItems[i];
        rectangle.isVisible = true;
      }
    }
  },
  /**
   * Sets the roster window display during render.
   * @param {object} paginationData the pagination data.
   * @param {BABYLON.GUI.Rectangle[]} displayElements the list of elements displaying the characters
   */
  SET_ROSTER_WINDOW_DISPLAY: (paginationData, displayElements) => {
    // iterate through elements
    for (let i = displayElements.length - 1; i >= 0; i--) {
      // all elements are a rectangle containing a layout grid with text elements
      const rectangle = displayElements[i];
      const child = rectangle.children[0];
      // clear the text
      child.text = "";
      // if the element is clickable, hide it to eliminate hover behavior
      if (rectangle.hasCallback) {
        rectangle.isVisible = false;
      }
    }
    const roster = WizardryController.roster;
    // iterate through list items    
    for (let i = paginationData.startIndex, li = paginationData.endIndex, j = 0; i <= li; i++, j++) {
      const character = roster[i];
      const rectangle = displayElements[j];
      const child = rectangle.children[0];
      // set the character display elements
      child.text = [
        (j + 1) % paginationData.pageSize,
        ") ",
        character.name,
        " ",
        character.alignment.title.substring(0, 1), 
        "-",
        character.clazz.title.substring(0, 3)
      ].join("");

      // if the element is clickable, set the element name and make sure it is visible
      if (rectangle.hasCallback) {
        rectangle.name = character.refId;
        rectangle.isVisible = true;
      }
    }
  }
}
WizardryUiConfig[WizardryConstants.MARKET_MAIN] = {
   /** the screen state */
  state: WizardryConstants.MARKET_MAIN,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 17] },
      { cell: [39, 17] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        5 * DIV24, // 5 - options
        DIV24,     // border
        6 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "MARKET ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "OPTIONS WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV5, DIV5, 3 * DIV5]
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              text: "YOU MAY GO TO:"
            }
          },
          {
            comment: "OPTIONS",
            type: "grid",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              rows: [DIV3, DIV3, DIV3]
            },
            children: [
              {
                comment: "INN, TAVERN",
                type: "stack",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToAdventurersInn");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "The Adventurer's Inn is a place where any weary adventurer can get a place to rest and recover from their exertions, and all for a modest charge.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "The Adventurer's Inn is a place where any weary adventurer can get a place to rest and recover from their exertions, and all for a modest charge.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "THE A)DVENTURER'S INN",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ", "
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToGilgameshTavern");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "The first stop at the beginning of a session is always Gilgamesh' Tavern, where you can assemble a party.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "The first stop at the beginning of a session is always Gilgamesh' Tavern, where you can assemble a party.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "G)ILGAMESH' TAVERN",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ","
                    }
                  }
                ]
              },
              {
                comment: "SHOP",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToBoltacsTradingPost");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "The commercial center of the Castle is owned by a friendly dwarf named Boltac.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "The commercial center of the Castle is owned by a friendly dwarf named Boltac.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "B)OLTAC'S TRADING POST",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ","
                    }
                  }
                ]
              },
              {
                comment: "TEMPLE, EDGE",
                type: "stack",
                position: {
                  column: 0,
                  row: 2
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToTempleOfCant");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "Whenever a party brings back characters who are dead, paralyzed, or otherwise unfit, they are removed from the party by the castle guards and taken to the Temple of Cant.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "Whenever a party brings back characters who are dead, paralyzed, or otherwise unfit, they are removed from the party by the castle guards and taken to the Temple of Cant.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "THE TEMPLE OF C)ANT",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ", OR "
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToEdgeOfTown");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "To go anywhere else you have to go to the Edge of Town.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "To go anywhere else you have to go to the Edge of Town.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "THE E)DGE OF TOWN.",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: "."
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    /**
     * Handler for the action to go to the Inn.
     * @type {void}
     */
    goToAdventurersInn: function() {
      const messageBlock = this.getDynamicElement("message block");
      if (WizardryController.partyCnt === 0) {
        // start animation
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "No need to visit the Inn if there are no adventurers in the party.";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [() => { this._acceptingInput = true; }]);
      } else {
        WizardryController.xgoto = WizardryXgoto.XADVNTINN;
        WizardryController.xgoto2 = WizardryXgoto.XADVNTINN;
        messageBlock.text = "";
        this._acceptingInput = true;
        this._parent.exitScene();
      }
    },
    /**
     * Handler for the action to go to the Shop.
     * @type {void}
     */
    goToBoltacsTradingPost: function() {
      const messageBlock = this.getDynamicElement("message block");
      if (WizardryController.partyCnt === 0) {
        // start animation
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "There's no one in the party to buy or sell at the Trading Post.";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [() => { this._acceptingInput = true; }]);
      } else {
        WizardryController.xgoto = WizardryXgoto.XBOLTAC;
        WizardryController.xgoto2 = WizardryXgoto.XBOLTAC;
        messageBlock.text = "";
        this._acceptingInput = true;
        this._parent.exitScene();
      }
    },
    /**
     * Handler for the action to go to the Edge of Town.
     * @type {void}
     */
    goToEdgeOfTown: function() {
      WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
      this._acceptingInput = true;
      const messageBlock = this.getDynamicElement("message block");
      messageBlock.text = "";
      this._parent.exitScene();
    },
    /**
     * Handler for the action to go to the Tavern.
     * @type {void}
     */
    goToGilgameshTavern: function() {
      WizardryController.xgoto = WizardryXgoto.XGILGAMS;
      this._acceptingInput = true;
      const messageBlock = this.getDynamicElement("message block");
      messageBlock.text = "";
      this._parent.exitScene();
    },
    /**
     * Handler for the action to go to the Temple.
     * @type {void}
     */
    goToTempleOfCant: function() {
      const messageBlock = this.getDynamicElement("message block");
      if (WizardryController.partyCnt === 0) {
        // start animation
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "Why the Temple? The party has no adventurers to restore.";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [() => { this._acceptingInput = true; }]);
      } else {
        WizardryController.xgoto = WizardryXgoto.XCANT;
        WizardryController.xgoto2 = WizardryXgoto.XBOLTAC;
        this._acceptingInput = true;
        messageBlock.text = "";
        this._parent.exitScene();
      }
    }
  },
  keyEntries: {
    "A": function() { return { isValid: true, action: "goToAdventurersInn" }; },
    "B": function() { return { isValid: true, action: "goToBoltacsTradingPost" }; },
    "C": function() { return { isValid: true, action: "goToTempleOfCant" }; },
    "E": function() { return { isValid: true, action: "goToEdgeOfTown" }; },
    "G": function() { return { isValid: true, action: "goToGilgameshTavern" }; },
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.INN_MAIN] = {
   /** the screen state */
  state: WizardryConstants.INN_MAIN,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 16] },
      { cell: [39, 16] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        4 * DIV24, // 5 - options
        DIV24,     // border
        7 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "INN ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "OPTIONS WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV4, DIV4, DIV4, DIV4]
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              text: "WELCOME TO THE ADVENTURER'S INN"
            }
          },
          {
            comment: "USER ENTRY",
            type: "stack",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false
            },
            children: [
              {
                type: "text",
                "initialization parameters": {
                  text: "WHO WILL STAY ? >",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "text",
                "initialization parameters": {
                  key: "entry block",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  dynamicElement: true
                }
              },
              {
                type: "cursor"
              }
            ]
          },
          {
            comment: "EXIT BUTTON",
            type: "button",
            position: {
              column: 0,
              row: 3
            },
            "initialization parameters": {
              background: {
                onPointerClickObservable: function() {
                  this.userAction("goToCastle");
                },
                onPointerEnterObservable: function() { },
                onPointerOutObservable: function() {  }
              },
              text: {
                text: "[ESC] TO LEAVE",
              }
            }
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      if (!isNaN(parseInt(arguments[0]))) {
        WizardryController.characterRecord = WizardryController.characters[arguments[0]];
      } else {
        WizardryController.characterRecord = arguments[0];
      }
      /** the character activated. */
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      // display the character's name
      entryBlock.text = character.name;
  
      // determine the action taken. by default, character selected can go to the player menu and select a room
      let action = () => {
        messageBlock.text = "";
        entryBlock.text = "";
        partyPanel.resetHighlights();
        this._acceptingInput = true;
        this._parent.room = WizardryConstants.INN_ROOM_NONE;
        this._parent.state = WizardryConstants.INN_PLAYER_MENU;
      };
      if (character.status !== WizardryCharacterStatus.OK) {
        // character selected cannot rest in the Inn
        action = () => {
          WizardryController.characterRecord = "";
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = "A rest won't help them. Try the Temple.";
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          this._acceptingInput = true;
          entryBlock.text = "";
        };
      }
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    goToCastle: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      entryBlock.text = "LEAVE";
      /**
       * the actions taken when the delay is complete.
       * @type {void}
       */
      const action = () => {
        WizardryController.xgoto = WizardryXgoto.XCASTLE;
        messageBlock.text = "";
        entryBlock.text = "";
        partyPanel.resetHighlights();
        this._acceptingInput = true;
        this._parent.exitScene();
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "goToCastle" }; },
    ESCAPE: function() { return { isValid: true, action: "goToCastle" }; },
    "1": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [0]
      };
      if (WizardryController.characters.length < 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [1]
      };
      if (WizardryController.characters.length < 2) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [2]
      };
      if (WizardryController.characters.length < 3) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [3]
      };
      if (WizardryController.characters.length < 4) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [4]
      };
      if (WizardryController.characters.length < 5) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [5]
      };
      if (WizardryController.characters.length < 6) {
        retObj.isValid = false;
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.INN_PLAYER_MENU] = {
   /** the screen state */
  state: WizardryConstants.INN_PLAYER_MENU,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 20] },
      { cell: [39, 20] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        8 * DIV24, // 5 - menu
        DIV24,     // border
        3 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "INN ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, DIV8, DIV8, DIV8, DIV8, DIV8, DIV8]
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              key: "welcome",
              setDynamicElement: function() {
                const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
                if (typeof(character) !== "undefined") {
                  this.text = ["WELCOME ", character.name, ". WE HAVE:"].join("");
                }
              },
              dynamicElement: true
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: function() {
                  this.userAction("nap", [WizardryConstants.INN_ROOM_STABLES]);
                },
                onPointerEnterObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // stop the fade animation and restore the alpha on the message block
                  messageBlock.alpha = 1;
                  this._parent.stopAnimation(messageBlock);
                  messageBlock.text = "Rest overnight in the stables to regain spells, but no hit points.";
                },
                onPointerOutObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // clear the tooltip if it matches the selected tooltip text
                  if (messageBlock.text === "Rest overnight in the stables to regain spells, but no hit points.") {
                    messageBlock.text = "";
                  }
                }
              },
              text: {
                text: "[A] THE STABLES (FREE!)",
              }
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 3
            },
            "initialization parameters": {
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: function() {
                  this.userAction("nap", [WizardryConstants.INN_ROOM_COTS]);
                },
                onPointerEnterObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // stop the fade animation and restore the alpha on the message block
                  messageBlock.alpha = 1;
                  this._parent.stopAnimation(messageBlock);
                  messageBlock.text = "Rent this room to regain spells and an insignificant amount of hit points.";
                },
                onPointerOutObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // clear the tooltip if it matches the selected tooltip text
                  if (messageBlock.text === "Rent this room to regain spells and an insignificant amount of hit points.") {
                    messageBlock.text = "";
                  }
                }
              },
              text: {
                text: "[B] COTS. 10 GP/WEEK.",
              }
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 4
            },
            "initialization parameters": {
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: function() {
                  this.userAction("nap", [WizardryConstants.INN_ROOM_ECONOMY]);
                },
                onPointerEnterObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // stop the fade animation and restore the alpha on the message block
                  messageBlock.alpha = 1;
                  this._parent.stopAnimation(messageBlock);
                  messageBlock.text = "Rent this room to regain spells and a modest amount of hit points.";
                },
                onPointerOutObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // clear the tooltip if it matches the selected tooltip text
                  if (messageBlock.text === "Rent this room to regain spells and a modest amount of hit points.") {
                    messageBlock.text = "";
                  }
                }
              },
              text: {
                text: "[C] ECONOMY ROOMS. 50 GP/WEEK.",
              }
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 5
            },
            "initialization parameters": {
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: function() {
                  this.userAction("nap", [WizardryConstants.INN_ROOM_MERCHANT]);
                },
                onPointerEnterObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // stop the fade animation and restore the alpha on the message block
                  messageBlock.alpha = 1;
                  this._parent.stopAnimation(messageBlock);
                  messageBlock.text = "Rent this room to regain spells and a significant amount of hit points.";
                },
                onPointerOutObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // clear the tooltip if it matches the selected tooltip text
                  if (messageBlock.text === "Rent this room to regain spells and a significant amount of hit points.") {
                    messageBlock.text = "";
                  }
                }
              },
              text: {
                text: "[D] MERCHANT SUITES. 200 GP/WEEK.",
              }
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 6
            },
            "initialization parameters": {
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: function() {
                  this.userAction("nap", [WizardryConstants.INN_ROOM_ROYAL]);
                },
                onPointerEnterObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // stop the fade animation and restore the alpha on the message block
                  messageBlock.alpha = 1;
                  this._parent.stopAnimation(messageBlock);
                  messageBlock.text = "Rent this room to regain spells and a substantial amount of hit points.";
                },
                onPointerOutObservable: function() {
                  const messageBlock = this.getDynamicElement("message block");
                  // clear the tooltip if it matches the selected tooltip text
                  if (messageBlock.text === "Rent this room to regain spells and a substantial amount of hit points.") {
                    messageBlock.text = "";
                  }
                }
              },
              text: {
                text: "[E] ROYAL SUITES. 500 GP/WEEK.",
              }
            }
          },
          {
            type: "stack",
            position: {
              column: 0,
              row: 7
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  text: "    OR ",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                }
              },
              {
                type: "button",
                "initialization parameters": {
                  background: {
                    horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                    onPointerClickObservable: function() {
                      this.userAction("exit");
                    },
                    onPointerEnterObservable: function() {
                      const messageBlock = this.getDynamicElement("message block");
                      // stop the fade animation and restore the alpha on the message block
                      messageBlock.alpha = 1;
                      this._parent.stopAnimation(messageBlock);
                      messageBlock.text = "Return to the lobby and let another character rest.";
                    },
                    onPointerOutObservable: function() {
                      const messageBlock = this.getDynamicElement("message block");
                      // clear the tooltip if it matches the selected tooltip text
                      if (messageBlock.text === "Return to the lobby and let another character rest.") {
                        messageBlock.text = "";
                      }
                    }
                  },
                  text: {
                    text: "[ESCAPE] TO LEAVE",
                  }
                }
              }
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    nap: function(room) {
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);      
      const messageBlock = this.getDynamicElement("message block");
      let min = 0;
      switch (room) {
        case WizardryConstants.INN_ROOM_COTS:
          min = 10;
          break;
        case WizardryConstants.INN_ROOM_ECONOMY:
          min = 50;
          break;
        case WizardryConstants.INN_ROOM_MERCHANT:
          min = 200;
          break;
        case WizardryConstants.INN_ROOM_ROYAL:
          min = 500;
          break;
      }
      
      if (character.gold < min) {
        // start animation
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "You can't afford that. Try downsizing.";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [() => { this._acceptingInput = true; }]);
      } else {
        messageBlock.text = "";
        this._acceptingInput = true;
        this._parent.room = room;
        this._parent.state = WizardryConstants.INN_NAP_MENU;
      }
    },
    /**
     * Handler for the action to go to return to the lobby.
     * @type {void}
     */
    exit: function() {
      this._acceptingInput = true;
      this.getDynamicElement("message block").text = "";
      WizardryController.characterRecord = "";
      this._parent.state = WizardryConstants.INN_MAIN;
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "exit" }; },
    ESCAPE: function() { return { isValid: true, action: "exit" }; },
    A: function() { return { isValid: true, action: "nap", arguments: [WizardryConstants.INN_ROOM_STABLES] }; },
    B: function() { return { isValid: true, action: "nap", arguments: [WizardryConstants.INN_ROOM_COTS] }; },
    C: function() { return { isValid: true, action: "nap", arguments: [WizardryConstants.INN_ROOM_ECONOMY] }; },
    D: function() { return { isValid: true, action: "nap", arguments: [WizardryConstants.INN_ROOM_MERCHANT] }; },
    E: function() { return { isValid: true, action: "nap", arguments: [WizardryConstants.INN_ROOM_ROYAL] }; },
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.INN_NAP_MENU] = {
   /** the screen state */
  state: WizardryConstants.INN_NAP_MENU,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS,
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,      // border
        DIV24,      // 1 - title
        DIV24,      // border
        8 * DIV24,  // 3 - party area
        DIV24,      // border
        12 * DIV24, // 5 - menu/messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "INN ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "HEALING WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          key: "healing",
          rows: [DIV12, DIV12, DIV12, DIV12, DIV12, DIV12, DIV12, DIV12, DIV12, DIV12, DIV12, DIV12],
          dynamicElement: true,
          setDynamicElement: function(parentInterface) { parentInterface.userAction("runHealingProcess"); }
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              key: "health header",
              dynamicElement: true
            }
          },
          {
            type: "text",
            position: {
              column: 0,
              row: 3
            },
            "initialization parameters": {
              key: "health",
              dynamicElement: true
            }
          },
          {
            type: "text",
            position: {
              column: 0,
              row: 5
            },
            "initialization parameters": {
              key: "gold",
              dynamicElement: true
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 7
            },
            "initialization parameters": {
              key: "healButton",
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: function() { this._interruptHealing = true; },
                onPointerEnterObservable: function() { },
                onPointerOutObservable: function() { }
              },
              text: {
                text: "PRESS [ENTER] TO STOP",
              },
              dynamicElement: true,
            }
          }
        ]
      },
      {
        comment: "LEVELING WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          key: "leveling",
          rows: [11 * DIV12, DIV12],
          dynamicElement: true
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              key: "leveling messages",
              lineSpacing: "3px",
              textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
              resizeToFit: false,
              textWrapping: true,
              dynamicElement: true
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              background: {
                horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                onPointerClickObservable: function() { this.userAction("exit"); },
                onPointerEnterObservable: function() { },
                onPointerOutObservable: function() { }
              },
              text: {
                text: "PRESS [ENTER] TO LEAVE",
              }
            }
          }
        ]
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    runHealingProcess: function() {
      // don't run until the player is in the nap menu
      if (this._parent.state === WizardryConstants.INN_NAP_MENU) {
        // do not accept input until healing begins or leveling ends
        this._acceptingInput = false;
        const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
        const healingWindow = this.getDynamicElement("healing");
        const levelingWindow = this.getDynamicElement("leveling");
        if (this._parent.restState === WizardryConstants.INN_REST_LEVELING) {
          // hide the healing window, reset the interrupt flag and stop processing
          healingWindow.isVisible = false;
          this._interruptHealing = false;
          // turn input back on
          this._acceptingInput = true;
          this.userAction("runLevelingProcess");
        } else {
          const healButton = this.getDynamicElement("healButton");
          healButton.isVisible = true;
          healingWindow.isVisible = true;
          levelingWindow.isVisible = false;
          const headerText = this.getDynamicElement("health header");
          const healthText = this.getDynamicElement("health");
          const goldText   = this.getDynamicElement("gold");
          let timeout = KEYBOARD_ENTRY_DELAY;
          /** @type {void} the action taken after completing a healing phase */
          let action = null;
          if (this._parent.room === WizardryConstants.INN_ROOM_STABLES) {
            // display a napping message
            headerText.text = [character.name, " IS NAPPING"].join("");
            healthText.text = "";
            goldText.text = "";
            healButton.isVisible = false;
            timeout *= 2;
            // wait 1/2 a second before moving on
            action = () => {
              // hide the text and move on the next phase
              headerText.text = "";
              healthText.text = "";
              goldText.text = "";
              healButton.isVisible = true;
              this._parent.restState = WizardryConstants.INN_REST_LEVELING;
              this._interruptHealing = false;
              this._acceptingInput = true;
              this.userAction("runLevelingProcess");
            };
          } else {
            this._acceptingInput = true;
            healingWindow.isVisible = true;
            levelingWindow.isVisible = false;
            let roomRate = 10, healing = 1;
            switch (this._parent.room) {
              case WizardryConstants.INN_ROOM_ECONOMY:
                roomRate = 50;
                healing = 3;
                break;
              case WizardryConstants.INN_ROOM_MERCHANT:
                roomRate = 200;
                healing = 7;
                break;
              case WizardryConstants.INN_ROOM_ROYAL:
                roomRate = 500;
                healing = 10;
                break;
            }
            if (character.gold >= roomRate
                  && character.hpLeft < character.hpMax) {
              // heal the character and charge a fee
              character.hpLeft += healing;
              character.gold -= roomRate;
              // age the character 1 week
              character.age++;
            } else {
              // once gold runs out or fully healed stop healing
              // hide the text and move on the next phase
              headerText.text = "";
              healthText.text = "";
              goldText.text = "";
              levelingWindow.isVisible = false;
              this._parent.restState = WizardryConstants.INN_REST_LEVELING;
              this._interruptHealing = false;
              this._acceptingInput = true;
              this.set();
            }
            headerText.text = [character.name, " IS HEALING UP"].join("");
            healthText.text = ["HIT POINTS (", character.hpLeft, "/", character.hpMax, ")"].join("");
            goldText.text = ["GOLD  ", character.gold].join("");
            action = () => {
              if (this._interruptHealing) {
                // hide the text and move on the next phase
                headerText.text = "";
                healthText.text = "";
                goldText.text = "";
                this._parent.restState = WizardryConstants.INN_REST_LEVELING;
                this._interruptHealing = false;
                this._acceptingInput = true;
                this.userAction("runLevelingProcess");
              } else {
                this.set();
              }
            };
          }
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
        }
      } else {
        this._acceptingInput = true;
      }
    },
    runLevelingProcess: function() {
      // don't run until the player is in the nap menu
      if (this._parent.state === WizardryConstants.INN_NAP_MENU) {
        // do not accept input until healing begins or leveling ends
        this._acceptingInput = false;
        const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
        const healingWindow = this.getDynamicElement("healing");
        const levelingWindow = this.getDynamicElement("leveling");
        if (this._parent.restState === WizardryConstants.INN_REST_LEVELING) {
          /**
           * Gets random hit points for a character, based on their class and Vitality.
           * @param {WizardryCharacter} character the character
           * @returns {Number} a random number
           */
          const rollRandomHitPoints = (character) => {
            let HITPTS = 0;
            switch (character.clazz) {
              case WizardryCharacterClass.FIGHTER:
              case WizardryCharacterClass.LORD:
                HITPTS = Dice.rollDie(10);
                break;
              case WizardryCharacterClass.PRIEST:
              case WizardryCharacterClass.SAMURAI:
                HITPTS = Dice.rollDie(8);
                break;
              case WizardryCharacterClass.THIEF:
              case WizardryCharacterClass.BISHOP:
              case WizardryCharacterClass.NINJA:
                HITPTS = Dice.rollDie(6);
                break;
              case WizardryCharacterClass.MAGE:
                HITPTS = Dice.rollDie(4);
                break;
            }
            switch (character.getAttribute(WizardryAttribute.VITALITY)) {
              case 3:
                HITPTS -= 2;
                break;
              case 4:
              case 5:
                HITPTS--;
                break;
              case 16:
                HITPTS++;
                break;
              case 17:
                HITPTS += 2;
                break;
              case 18:
                HITPTS += 3;
                break;
            }
            if (HITPTS < 1) {
              HITPTS = 1;
            }
            return HITPTS;
          }
          /** flag indicating whether to finish the loop. */
          let done = false;
          /** dictionary containing the results of the character's level progression. */
          const resultText = {
            level: "",
            attributes: [],
            spells: ""
          }
          /**
           * FLOW
           *  LOOP UNTIL DONE
           *    DETERMINE EXP 4 NEXT LVL
           *    IF ENOUGH
           *      LEVEL UP
           *    ELSE
           *      SET FLAG DONE
           */
          while (!done) {
            /** the experience points needed to move to the next level. */
            let exp4NextLevel = 0;
            if (character.charLev <= 12) {
              exp4NextLevel = WizardryCharacterClass[character.clazz].nextLevel[character.charLev];
            } else {
              exp4NextLevel = WizardryCharacterClass[character.clazz].nextLevel[12];
              for (let i = 13, li = character.charLev; i <= li; i++) {
                exp4NextLevel += WizardryCharacterClass[character.clazz].nextLevel[0];
              }
            }
            if (character.exp >= exp4NextLevel) {
              /** text displayed for gaining a level. */
              resultText.level = "YOU MADE A LEVEL!";
              // increase level by 1
              character.charLev++;
              if (character.charLev > character.maxLevAc) {
                character.maxLevAc = character.charLev;
              }
        
              this.userAction("setSpells", character);
        
              let s = this.userAction("tryLearn", character);
              if (s !== null) {
                resultText.spells = s;
              }

              s = this.userAction("gainLost", character);
              if (s.length > 0) {
                for (let i = 0, li = s.length; i < li; i++) {
                  if (!resultText.attributes.includes(s[i])) {
                    resultText.attributes.push(s[i]);
                  }
                }
              }
              
              // gain hit points
              let newHpMax = 0;
              for (let i = 1, li = character.charLev; i <= li; i++) {
                // roll new random hit points for each level
                newHpMax += rollRandomHitPoints(character);
              }
              if (character.clazz === WizardryCharacterClass.SAMURAI) {
                // samurais get to roll 1 more time
                newHpMax += rollRandomHitPoints(character);
              }
              // at a minimum characters will gain 1 hp
              if (newHpMax <= character.hpMax) {
                newHpMax = character.hpMax + 1;
              }
              character.hpMax = newHpMax;
            } else {
              if (resultText.level.length === 0) {
                resultText.level = ["YOU NEED ", exp4NextLevel - character.exp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL ", character.charLev + 1].join(""); 
                this.userAction("setSpells", [character]);
              }
              done = true;
            }
              
            // build the display string
            let displayString = [];
            displayString.push(resultText.level);
            if (resultText.spells.length > 0) {
              displayString.push(resultText.spells);
            }
            if (resultText.attributes.length > 0) {
              displayString = displayString.concat(resultText.attributes);
            }

            // clear the health window
            this.getDynamicElement("health header").text = "";
            this.getDynamicElement("health").text = "";
            this.getDynamicElement("gold").text = "";
            healingWindow.isVisible = false;
            // show the leveling window
            levelingWindow.isVisible = true;
            this.getDynamicElement("leveling messages").text = displayString.join("\n"); 
          }
          this._acceptingInput = true;
        }
      }
    },
    /**
     * Handler for the action to go to return to the lobby.
     * @type {void}
     */
    exit: function() {
      this._acceptingInput = true;
      this._parent.restState = WizardryConstants.INN_REST_HEALING
      this._parent.room = WizardryConstants.INN_ROOM_NONE;
      this._parent.state = WizardryConstants.INN_PLAYER_MENU;
    },
    /**
     * Determines if the character gained or lost attribute points during their levelling up.
     * @param {WizardryCharacter} character the character
     * @returns {Array} the list of string detailing gains/losses
     */
    gainLost: function(character) {
      /** the strings returned. */
      const retStrings = [];
      /** @type {Array} the list of attributes. */
      const attributes = WizardryAttribute.values;
      for (let i = attributes.length - 1; i >= 0; i--) {
        if (Dice.rollDie(4) - 1 !== 0) {
          let attributeValue = character.getAttribute(attributes[i]);
          if (Dice.rollDie(130) - 1 < character.age / 52) {
            // if 1D130 is less than your age, there is a chance of the attribute going down
            if (attributeValue == 18 && Dice.rollDie(6) - 1 !== 4) {
              // (* NOTHING *)
            } else {
              attributeValue--;
              retStrings.push("YOU LOST ");
              retStrings.push(attributes[i].title);
              retStrings.push("\n");
              if (attributes[i] === WizardryAttribute.VITALITY) {
                retStrings.push("** YOU HAVE DIED OF OLD AGE **\n");
                character.status = WizardryCharacterStatus.LOST;
                character.hpLeft = 0;
              }
            }
          } else {
            if (attributeValue !== 18) {
              attributeValue++;
              retStrings.push("YOU GAINED ");
              retStrings.push(attributes[i].title);
              retStrings.push("\n");                    
            }
            character.setAttribute(attributes[i], attributeValue);
          }
        }
      }
      return retStrings;
    },
    /**
     * Sets how many spells of each LEVEL of POWER and class (magical or priestly) a character can throw.
     * @param {WizardryCharacter} character the character
     */
    setSpells: function(character) {
      /**
       * Sets the minimum # of spells a character can cast per level based on the # of spells known per level.
       * @param {WizardryCharacter} character the character
       * @param {Boolean} isPriest flag indicating if the Priest spell book is used; otherwise the Mage spell book is used
       * @param {Number} level the spell level
       * @param {Number} low the spell index to start with
       * @param {Number} high the spell index to finish at
       */
      const minSpellCount = (character, isPriest, level, low, high) => {
        let spellsKnown = 0;
        for (let i = low; i <= high; i++) {
          if (character.spellsKnown[i]) {
            spellsKnown++;
          }
        }
        if (isPriest) {
          character.priestSpells[level] = spellsKnown;
        } else {
          character.mageSpells[level] = spellsKnown;
        }
      };
      /**
       * Sets the minimum # of Mage spells a character can cast for all levels.
       * @param {WizardryCharacter} character the character
       */
      const minimumMageSpells = (character) => {
        minSpellCount(character, false, 0,  0,  3);
        minSpellCount(character, false, 1,  4,  5);
        minSpellCount(character, false, 2,  6,  7);
        minSpellCount(character, false, 3,  8, 10);
        minSpellCount(character, false, 4, 11, 13);
        minSpellCount(character, false, 5, 14, 17);
        minSpellCount(character, false, 6, 18, 20);
      }
      /**
       * Sets the minimum # of Priest spells a character can cast for all levels.
       * @param {WizardryCharacter} character the character
       */
      const minimumPriestSpells = (character) => {
        minSpellCount(character, true, 0, 21, 25);
        minSpellCount(character, true, 1, 26, 29);
        minSpellCount(character, true, 2, 30, 33);
        minSpellCount(character, true, 3, 34, 37);
        minSpellCount(character, true, 4, 38, 43);
        minSpellCount(character, true, 5, 44, 47);
        minSpellCount(character, true, 6, 48, 49);
      }
      /**
       * Calculates the number of spells a character can cast at each level.
       * @param {WizardryCharacter} character the character
       * @param {String} spellBook the spell book used
       * @param {Number} minCasterLevel the minimum level at which a caster receives spells
       * @param {Number} modifierPerLevel a cumulative modifier applied at each level, reducing the possbile number of spells that can be cast
       */
      const spellsPerLevel = (character, spellBook, minCasterLevel, modifierPerLevel) => {
        let spellCount = character.charLev - minCasterLevel;
        if (spellCount > 0) {
          let spellLevel = 0;
          while (spellLevel >= 0 && spellLevel <= 6 && spellCount > 0) {
            if (spellCount > character[spellBook][spellLevel]) {
              character[spellBook][spellLevel] = spellCount;
            }
            spellLevel++;
            spellCount -= modifierPerLevel;
          }
          for (spellLevel = 0; spellLevel <= 6; spellLevel++) {
            if (character[spellBook][spellLevel] > 9) {
              character[spellBook][spellLevel] = 9;
            }
          }
        }
      }
      minimumPriestSpells(character);
      minimumMageSpells(character);
      switch (character.clazz) {
        case WizardryCharacterClass.PRIEST:
          spellsPerLevel(character, "priestSpells", 0, 2);
          break;
        case WizardryCharacterClass.MAGE:
          spellsPerLevel(character, "mageSpells", 0, 2);
          break;
        case WizardryCharacterClass.BISHOP:
          spellsPerLevel(character, "priestSpells", 3, 4);
          spellsPerLevel(character, "mageSpells", 0, 4);
          break;
        case WizardryCharacterClass.LORD:
          spellsPerLevel(character, "priestSpells", 3, 2);
          break;
        case WizardryCharacterClass.SAMURAI:
          spellsPerLevel(character, "mageSpells", 3, 3);
          break;
      }
    },
    /**
     * Tries to learn new spells for each LEVEL of POWER and class (magical or priestly) a character can throw. 
     * @param {WizardryCharacter} character the character
     * @returns {String} any strings indicating success at learning, or null if no spells were learned
     */
    tryLearn: function(character) {
      /** the text returned, indicating success at learning */
      let retText = null;
      /** a flag indicating whetner the character has learned new spells. */
      let learned = false;
      /**  @type {WizardryAttribute} the attribute tested for learning capability. */
      let attribute = WizardryAttribute.IQ;
      /**
       * Try to learn a range of spells.
       * @param {Number} beginningIndex the beginning index of the spell range 
       * @param {Number} endingIndex the ending index of the spell range 
       */
      const tryToLearn = (beginningIndex, endingIndex) => {
        /** flag indicating the character knows at least one spell in the range. */
        let atLeastOneSpellKnown = false;
        for (let i = beginningIndex; i <= endingIndex; i++) {
          atLeastOneSpellKnown ||= character.spellsKnown[i];
          if (atLeastOneSpellKnown) {
            break;
          }
        }
        for (let i = beginningIndex; i <= endingIndex; i++) {
          if (!character.spellsKnown[i]) {
            // if a character doesn't know a spell, they have a chance to learn it if they can roll 1D30-1 lower than their magic attribute (IQ or PIETY),
            // OR they don't know ANY spells in that range, in which case they automatically learn the first spell in the range
            if (Dice.rollDie(30) - 1 < character.getAttribute(attribute) || !atLeastOneSpellKnown) {
              learned = true;
              atLeastOneSpellKnown = true;
              character.spellsKnown[i] = true;
            }
          }
        }
      }
      /**
       * Try to learn new Mage spells.
       */
      const tryMage = () => {
        attribute = WizardryAttribute.IQ;
        if (character.mageSpells[0] > 0) {
          tryToLearn(0, 3);
        }
        if (character.mageSpells[1] > 0) {
          tryToLearn(4, 5);
        }
        if (character.mageSpells[2] > 0) {
          tryToLearn(6, 7);
        }
        if (character.mageSpells[3] > 0) {
          tryToLearn(8, 10);
        }
        if (character.mageSpells[4] > 0) {
          tryToLearn(11, 13);
        }
        if (character.mageSpells[5] > 0) {
          tryToLearn(14, 17);
        }
        if (character.mageSpells[6] > 0) {
          tryToLearn(18, 20);
        }
      }
      /**
       * Try to learn new Priest spells.
       */
      const tryPriest = () => {
        attribute = WizardryAttribute.PIETY;
        if (character.priestSpells[0] > 0) {
          tryToLearn(21, 25);
        }
        if (character.priestSpells[1] > 0) {
          tryToLearn(26, 29);
        }
        if (character.priestSpells[2] > 0) {
          tryToLearn(30, 33);
        }
        if (character.priestSpells[3] > 0) {
          tryToLearn(34, 37);
        }
        if (character.priestSpells[4] > 0) {
          tryToLearn(38, 43);
        }
        if (character.priestSpells[5] > 0) {
          tryToLearn(44, 47);
        }
        if (character.priestSpells[6] > 0) {
          tryToLearn(48, 49);
        }
      }
      tryMage();
      tryPriest();
      if (learned) {
        retText = "YOU LEARNED NEW SPELLS!!!!";
      }
      this.userAction("setSpells", [character]);
      return retText;
    },
    handleKeyPress: function() {
      this._acceptingInput = true;
      if (this._parent.restState === WizardryConstants.INN_REST_HEALING) {
        this._interruptHealing = true;
      } else {
        this.userAction("exit");
      }
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "handleKeyPress" }; },
    ESCAPE: function() { return { isValid: true, action: "handleKeyPress" }; },
  },
  keyHandler: WizardryUiConfig.BASIC_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.GILGAMESH_MAIN] = {
   /** the screen state */
  state: WizardryConstants.GILGAMESH_MAIN,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 19] },
      { cell: [39, 19] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "TAVERN ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          columns: [8 * DIV38, 30 * DIV38]
        },
        children: [
          {
            type: "grid",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              rows: [DIV7, 6 * DIV7]
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  text: "YOU MAY ",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
                }
              },
            ]
          },
          {
            comment: "BUTTON PANEL",
            type: "grid",
            position: {
              column: 1,
              row: 0
            },
            "initialization parameters": {
              rows: [DIV7, DIV7, DIV7, DIV7, 3 * DIV7],
              key: "button panel",
              setDynamicElement: function(parent) {
                const elements = [];
                const addButton = parent.getDynamicElement("addButton");
                const removeButton = parent.getDynamicElement("removeButton");
                const inspectButton = parent.getDynamicElement("inspectButton");
                const exitButton = parent.getDynamicElement("exitButton");
                this.removeControl(addButton);
                this.removeControl(removeButton);
                this.removeControl(inspectButton);
                this.removeControl(exitButton);
                if (WizardryController.characters.length < 6) {
                  elements.push(addButton);
                }
                if (WizardryController.characters.length > 0) {
                  elements.push(removeButton);
                }
                elements.push(inspectButton);
                elements.push(exitButton);

                for (let i = 0, li = elements.length; i < li; i++) {
                  this.addControl(elements[i], i, 0);
                }
              },
              dynamicElement: true
            },
            children: [
              {
                comment: "ADD MEMBER",
                type: "stack",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "addButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToAddMember");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "A)DD A MEMBER",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ",",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "REMOVE MEMBER",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "removeButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToRemoveMember");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "R)EMOVE A MEMBER",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ",",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "INSPECT MEMBER",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "inspectButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "Press any valid player # (1-6) or click their row to inspect that player.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "Press any valid player # (1-6) or click their row to inspect that player.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "#) SEE A MEMBER",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ",",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "EXIT",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "exitButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "text",
                    "initialization parameters": {
                      text: "OR ",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToCastle");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "PRESS [ESCAPE] TO LEAVE",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ".",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      if (!isNaN(parseInt(arguments[0]))) {
        WizardryController.characterRecord = WizardryController.characters[arguments[0]];
      } else {
        WizardryController.characterRecord = arguments[0];
      }
      
      messageBlock.text = "";
      partyPanel.resetHighlights();
      this._acceptingInput = true;
      WizardryController.xgoto = WizardryXgoto.XINSPCT3;
      WizardryController.xgoto2 = WizardryXgoto.XGILGAMS;
      this._parent.exitScene();
    },
    /**
     * Goes to the Add Member state.
     */
    goToAddMember: function() {
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      messageBlock.text = "";
      partyPanel.resetHighlights();
      this._acceptingInput = true;
      this._parent.state = WizardryConstants.GILGAMESH_ADD_PARTY;
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    goToCastle: function() {
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      WizardryController.xgoto = WizardryXgoto.XCASTLE;
      messageBlock.text = "";
      partyPanel.resetHighlights();
      this._acceptingInput = true;
      this._parent.exitScene();
    },
    /**
     * Goes to the Add Member state.
     */
     goToRemoveMember: function() {
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      messageBlock.text = "";
      partyPanel.resetHighlights();
      this._acceptingInput = true;
      this._parent.state = WizardryConstants.GILGAMESH_REMOVE_PARTY;
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "goToCastle" }; },
    ESCAPE: function() { return { isValid: true, action: "goToCastle" }; },
    A: function() {
      const retObj = {
        isValid: true,
        action: "goToAddMember"
      };
      if (WizardryController.characters.length === 6) {
        retObj.isValid = false;
      }
      return retObj;
    },
    R: function() {
      const retObj = {
        isValid: true,
        action: "goToRemoveMember"
      };
      if (WizardryController.characters.length === 0) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "1": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [0]
      };
      if (WizardryController.characters.length < 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [1]
      };
      if (WizardryController.characters.length < 2) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [2]
      };
      if (WizardryController.characters.length < 3) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [3]
      };
      if (WizardryController.characters.length < 4) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [4]
      };
      if (WizardryController.characters.length < 5) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [5]
      };
      if (WizardryController.characters.length < 6) {
        retObj.isValid = false;
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.GILGAMESH_ADD_PARTY] = {
   /** the screen state */
  state: WizardryConstants.GILGAMESH_ADD_PARTY,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 19] },
      { cell: [39, 19] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "TAVERN ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "ROSTER",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV7, 5 * DIV7, DIV7],
          key: "rosterMenu",
          setDynamicElement: function(parent) {
            if (parent._parent.rosterPage <= 1) {
              parent.getDynamicElement("nextButton").isVisible = true;
              parent.getDynamicElement("prevButton").isVisible = false;
            } else {
              parent.getDynamicElement("nextButton").isVisible = false;
              parent.getDynamicElement("prevButton").isVisible = true;
            }
          },
          dynamicElement: true
        },
        children: [
          {
            comment: "USER ENTRY",
            type: "stack",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false
            },
            children: [
              {
                type: "text",
                "initialization parameters": {
                  text: "WHO WILL JOIN ? >",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "text",
                "initialization parameters": {
                  key: "entry block",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  dynamicElement: true
                }
              },
              {
                type: "cursor"
              }
            ]
          },
          {
            comment: "ROSTER LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              key: "roster listing",
              maxItems: 10,
              columns: 2,
              arrange: "byColumn",
              callback: "addToParty",
              createItem: WizardryUiConfig.ROSTER_WINDOW_ITEM_FACTORY,
              getList: (parent) => {
                let data = { startIndex: 0, endIndex: 0 };
                if (parent._parent.state === WizardryConstants.GILGAMESH_ADD_PARTY) {
                  // only run if in the add to party screen
                  data = paginate(WizardryController.roster.length, parent._parent.rosterPage, 10);
                  parent._parent.rosterPage = data.currentPage;
                }
                return data;
              },
              setList: WizardryUiConfig.SET_ROSTER_WINDOW_DISPLAY
            }
          },
          {
            comment: "NAVIGATION BUTTONS",
            type: "grid",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              columns: [DIV2, DIV2]
            },
            children: [
              {
                type: "button",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  background: {
                    onPointerClickObservable: function() {
                      this.userAction("nextPage");
                    },
                    onPointerEnterObservable: function() { },
                    onPointerOutObservable: function() {  }
                  },
                  text: {
                    text: "N)EXT PAGE",
                  },
                  key: "nextButton",
                  dynamicElement: true
                }
              },
              {
                type: "button",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  background: {
                    onPointerClickObservable: function() {
                      this.userAction("prevPage");
                    },
                    onPointerEnterObservable: function() { },
                    onPointerOutObservable: function() {  }
                  },
                  text: {
                    text: "P)REVIOUS PAGE",
                  },
                  key: "prevButton",
                  dynamicElement: true
                }
              },
              {
                type: "button",
                position: {
                  column: 1,
                  row: 0
                },
                "initialization parameters": {
                  background: {
                    onPointerClickObservable: function() {
                      this.userAction("exit");
                    },
                    onPointerEnterObservable: function() { },
                    onPointerOutObservable: function() {  }
                  },
                  text: {
                    text: "[ESC] TO EXIT",
                  }
                }
              },
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    addToParty: function() {
      /**
       * Gets the party's alignment.
       * @returns {WizardryAlignment} the party's alignment
       */
      const getPartyAlignment = () => {
        let align = WizardryAlignment.NEUTRAL;
        for (let i = WizardryController.characters.length - 1; i >= 0; i--) {
          const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characters[i]);
          if (character.alignment !== WizardryAlignment.NEUTRAL) {
            align = character.alignment;
            break;
          }
        }
        return align;
      };
  
      let stop = false;
      let character;
      const alignment = getPartyAlignment();
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("roster listing");
      if (!isNaN(parseInt(arguments[0]))) {
        let index = this._parent.rosterPage - 1;
        index *= 10;
        index += arguments[0];
        console.log("character index",index)
        character = WizardryController.roster[index];
      } else {
        character = WizardryController.rosterInstance.getCharacterRecord(arguments[0]);
      }
      // if the character was found, but is INMAZE or has a location flag, exit and display an error message
      if (character.inMaze || character.lostXyl.location[2] !== 0) {
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "** OUT **";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        listPanel.resetHighlights();
        stop = true;
        this._acceptingInput = true;
      }
      // if the party isn't NEUTRAL and trying to add opposite alignments, exit and display an error message
      if (!stop && alignment !== WizardryAlignment.NEUTRAL) {
        if (character.alignment !== WizardryAlignment.NEUTRAL
            && character.alignment !== alignment) {
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = "** BAD ALIGNMENT **";
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          listPanel.resetHighlights();
          stop = true;
          this._acceptingInput = true;
        }
      }
      if (!stop) {    
        entryBlock.text = [character.name].join("");
        const action = () => {
          entryBlock.text = "";
          WizardryController.addToParty(character);
          listPanel.resetHighlights();
          if (WizardryController.partyCnt < 6) {
            this.set(); 
          } else {
            this.userAction("exit");
          }
          this._acceptingInput = true;
        };        
        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
      }
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    exit: function() {
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("roster listing");
      this._parent.rosterPage = 0;
      messageBlock.text = "";
      listPanel.resetHighlights();
      this._acceptingInput = true;
      this._parent.state = WizardryConstants.GILGAMESH_MAIN;
    },
    /**
     * Goes to the next roster page.
     */
     nextPage: function() {
      this._parent.rosterPage++;
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("roster listing");
      messageBlock.text = "";
      listPanel.resetHighlights();
      this._acceptingInput = true;
      this.set();
    },
    /**
     * Goes to the next roster page.
     */
     prevPage: function() {
      this._parent.rosterPage--;
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("roster listing");
      messageBlock.text = "";
      listPanel.resetHighlights();
      this._acceptingInput = true;
      this.set();
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "exit" }; },
    ESCAPE: function() { return { isValid: true, action: "exit" }; },
    N: function() {
      const retObj = {
        isValid: true,
        action: "nextPage"
      };
      if (this._parent.rosterPage > 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    P: function() {
      const retObj = {
        isValid: true,
        action: "prevPage"
      };
      if (this._parent.rosterPage <= 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "1": function() {
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [0]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += 0;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const id = 1;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const id = 2;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const id = 3;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const id = 4;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const id = 5;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "7": function() {
      const id = 6;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "8": function() {
      const id = 7;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "9": function() {
      const id = 8;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "0": function() {
      const id = 9;
      const retObj = {
        isValid: true,
        action: "addToParty",
        arguments: [id]
      };
      let index = this._parent.rosterPage - 1;
      index *= 10;
      index += id;
      if (WizardryController.roster.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.GILGAMESH_REMOVE_PARTY] = {
   /** the screen state */
  state: WizardryConstants.GILGAMESH_REMOVE_PARTY,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 19] },
      { cell: [39, 19] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "TAVERN ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV7, DIV7, 5 * DIV7]
        },
        children: [
          {
            comment: "USER ENTRY",
            type: "stack",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false
            },
            children: [
              {
                type: "text",
                "initialization parameters": {
                  text: "WHO WILL LEAVE ? >",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "text",
                "initialization parameters": {
                  key: "entry block",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  dynamicElement: true
                }
              },
              {
                type: "cursor"
              }
            ]
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              background: {
                onPointerClickObservable: function() {
                  this.userAction("exit");
                },
                onPointerEnterObservable: function() { },
                onPointerOutObservable: function() {  }
              },
              text: {
                text: "[ESC] TO EXIT",
              }
            }
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      let refId;
      if (!isNaN(parseInt(arguments[0]))) {
        refId = WizardryController.characters[arguments[0]];
      } else {
        refId = arguments[0];
      }
      
      const character = WizardryController.rosterInstance.getCharacterRecord(refId);  
      entryBlock.text = [character.name].join("");

      const action = () => {
        messageBlock.text = "";
        partyPanel.resetHighlights();
        entryBlock.text = "";
        this._acceptingInput = true;
        // remove the character from the party
        WizardryController.removeFromParty(character);
        if (WizardryController.partyCnt > 0) {
          this.set(); 
        } else {
          this.userAction("exit");
        }
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    },
    /**
     * Handler for the action to return to the main menu.
     * @type {void}
     */
    exit: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("party listing");
      entryBlock.text = "";
      messageBlock.text = "";
      listPanel.resetHighlights();
      this._acceptingInput = true;
      this._parent.state = WizardryConstants.GILGAMESH_MAIN;
    },
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "exit" }; },
    ESCAPE: function() { return { isValid: true, action: "exit" }; },
    "1": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [0]
      };
      if (WizardryController.characters.length < 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [1]
      };
      if (WizardryController.characters.length < 2) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [2]
      };
      if (WizardryController.characters.length < 3) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [3]
      };
      if (WizardryController.characters.length < 4) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [4]
      };
      if (WizardryController.characters.length < 5) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [5]
      };
      if (WizardryController.characters.length < 6) {
        retObj.isValid = false;
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.BOLTAC_SELECT_CHARACTER] = {
   /** the screen state */
  state: WizardryConstants.BOLTAC_SELECT_CHARACTER,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 19] },
      { cell: [39, 19] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "SHOP ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV7, DIV7, DIV7, 3 * DIV7, DIV7]
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              text: "WELCOME TO THE TRADING POST"
            }
          },
          {
            comment: "USER ENTRY",
            type: "stack",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false
            },
            children: [
              {
                type: "text",
                "initialization parameters": {
                  text: "WHO WILL ENTER ? >",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "text",
                "initialization parameters": {
                  key: "entry block",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  dynamicElement: true
                }
              },
              {
                type: "cursor"
              }
            ]
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 4
            },
            "initialization parameters": {
              background: {
                onPointerClickObservable: function() {
                  this.userAction("goToCastle");
                },
                onPointerEnterObservable: function() { },
                onPointerOutObservable: function() {  }
              },
              text: {
                text: "[ESC] TO LEAVE",
              }
            }
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      if (!isNaN(parseInt(arguments[0]))) {
        WizardryController.characterRecord = WizardryController.characters[arguments[0]];
      } else {
        WizardryController.characterRecord = arguments[0];
      }

      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      entryBlock.text = [character.name].join("");

      const action = () => {
        messageBlock.text = "";
        partyPanel.resetHighlights();
        entryBlock.text = "";
        this._acceptingInput = true;
        this._parent.state = WizardryConstants.BOLTAC_MAIN_MENU;
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    goToCastle: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("party listing");
      entryBlock.text = "LEAVE";

      const action = () => {
        entryBlock.text = "";
        messageBlock.text = "";
        listPanel.resetHighlights();
        this._acceptingInput = true;
        WizardryController.xgoto = WizardryXgoto.XCASTLE;
        this._parent.exitScene();
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "goToCastle" }; },
    ESCAPE: function() { return { isValid: true, action: "goToCastle" }; },
    "1": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [0]
      };
      if (WizardryController.characters.length < 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [1]
      };
      if (WizardryController.characters.length < 2) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [2]
      };
      if (WizardryController.characters.length < 3) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [3]
      };
      if (WizardryController.characters.length < 4) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [4]
      };
      if (WizardryController.characters.length < 5) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [5]
      };
      if (WizardryController.characters.length < 6) {
        retObj.isValid = false;
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.BOLTAC_MAIN_MENU] = {
   /** the screen state */
  state: WizardryConstants.BOLTAC_MAIN_MENU,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 19] },
      { cell: [39, 19] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "SHOP ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV7, DIV7, DIV7, 4 * DIV7]
        },
        children: [
          {
            comment: "WELCOME HEADER",
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              key: "welcome",
              setDynamicElement: function() {
                const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
                if (typeof(character) !== "undefined") {
                  this.text = ["WELCOME ", character.name].join("");
                }
              },
              dynamicElement: true
            }
          },
          {
            comment: "PLAYER GOLD",
            type: "text",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              key: "gold",
              setDynamicElement: function() {
                const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
                if (typeof(character) !== "undefined") {
                  this.text = ["YOU HAVE ", character.gold, " GOLD "].join("");
                }
              },
              dynamicElement: true
            }
          },
          {
            comment: "MENU",
            type: "grid",
            position: {
              column: 0,
              row: 3
            },
            "initialization parameters": {
              columns: [8 * DIV38, 30 * DIV38],
              rows: [DIV4, DIV4, DIV4, DIV4]
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  text: "YOU MAY ",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
                }
              },
              {
                comment: "BUY, SELL",
                type: "stack",
                position: {
                  column: 1,
                  row: 0
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToBuy");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() { }
                      },
                      text: {
                        text: "B)UY AN ITEM",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ", "
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToSell");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() { }
                      },
                      text: {
                        text: "S)ELL AN ITEM",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ","
                    }
                  }
                ]
              },
              {
                comment: "UNCURSE",
                type: "stack",
                position: {
                  column: 1,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToUncurse");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() { }
                      },
                      text: {
                        text: "HAVE AN ITEM U)NCURSED",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ","
                    }
                  }
                ]
              },
              {
                comment: "IDENTIFY",
                type: "stack",
                position: {
                  column: 1,
                  row: 2
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToIdentify");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() { }
                      },
                      text: {
                        text: "HAVE AN ITEM I)DENTIFIED",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ","
                    }
                  }
                ]
              },
              {
                comment: "LEAVE",
                type: "stack",
                position: {
                  column: 1,
                  row: 3
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "text",
                    "initialization parameters": {
                      text: "OR "
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("exit");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() { }
                      },
                      text: {
                        text: "L)EAVE",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: "."
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    /**
     * Handler for the action to go to the Purchase menu.
     * @type {void}
     */
    goToBuy: function() {
      this._acceptingInput = true;
      const messageBlock = this.getDynamicElement("message block");
      messageBlock.text = "";
      this._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    },
    /**
     * Handler for the action to go to the Sell menu.
     * @type {void}
     */
    goToSell: function() {
      this._acceptingInput = true;
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      const messageBlock = this.getDynamicElement("message block");
      if (character.possessions.count <= 0) {
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "You don't have any equipment.";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      } else {
        messageBlock.text = "";
        this._parent.state = WizardryConstants.BOLTAC_SELL_MENU;
      }
    },
    /**
     * Handler for the action to go to the Uncurse menu.
     * @type {void}
     */
    goToUncurse: function() {
      this._acceptingInput = true;
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      const messageBlock = this.getDynamicElement("message block");
      let valid = true;
      if (character.possessions.count <= 0) {
        valid = false;
      }
      if (valid) {
        let atLeastOne = false;
        for (let i = character.possessions.possession.length - 1; i >= 0; i--) {
          if (character.possessions.possession[i].cursed) {
            atLeastOne = true;
            break;
          }
        }
        valid = atLeastOne;
      }
      if (!valid) {
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "You don't have any cursed equipment.";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      } else {
        messageBlock.text = "";
        this._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;
      }
    },
    /**
     * Handler for the action to go to the Identify menu.
     * @type {void}
     */
    goToIdentify: function() {
      this._acceptingInput = true;
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      const messageBlock = this.getDynamicElement("message block");
      let valid = true;
      if (character.possessions.count <= 0) {
        valid = false;
      }
      if (valid) {
        let atLeastOne = false;
        for (let i = character.possessions.possession.length - 1; i >= 0; i--) {
          if (character.possessions.possession[i].cursed) {
            atLeastOne = true;
            break;
          }
        }
        valid = atLeastOne;
      }
      if (!valid) {
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "You don't have any unidentified equipment.";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      } else {
        messageBlock.text = "";
        this._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;
      }
    },
    /**
     * Handler for the action to go to the Character selection menu.
     * @type {void}
     */
    exit: function() {
      this._acceptingInput = true;
      const messageBlock = this.getDynamicElement("message block");
      messageBlock.text = "";
      this._parent.state = WizardryConstants.BOLTAC_SELECT_CHARACTER;
    }
  },
  keyEntries: {
    "ENTER": function() { return { isValid: true, action: "exit" }; },
    "ESCAPE": function() { return { isValid: true, action: "exit" }; },
    "L": function() { return { isValid: true, action: "exit" }; },
    "B": function() { return { isValid: true, action: "goToBuy" }; },
    "S": function() { return { isValid: true, action: "goToSell" }; },
    "U": function() { return { isValid: true, action: "goToUncurse" }; },
    "I": function() { return { isValid: true, action: "goToIdentify" }; },
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.BOLTAC_BUY_MENU] = {
   /** the screen state */
  state: WizardryConstants.BOLTAC_BUY_MENU,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat(
    {
      points: [
        { cell: [0, 19] },
        { cell: [39, 19] }
      ]
    },
    {
      points: [
        { cell: [1 + (2 * DIV3)  * 38, 11.5] },
        { cell: [1 + (2 * DIV3)  * 38, 18.5] }
      ]
    }
  ),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "SHOP ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "INVENTORY",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          columns: [2 * DIV3, DIV3]
        },
        children: [
          {
            comment: "INVENTORY DISPLAY",
            type: "grid",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              rows: [6 * DIV7, DIV7]
            },
            children: [
              {
                comment: "INVENTORY LISTING",
                type: "dynamic listing",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  key: "inventory listing",
                  maxItems: 6,
                  callback: "purchase",
                  /**
                   * Creates a list item for display.
                   * @param {WizardryScene} scene the parent scene
                   * @param {void} callback the callback function for when an item is clicked
                   * @param {WizardryInterface} scope the value of this provided for the callback
                   * @returns {BABYLON.GUI.Rectangle} the rectangle containing the list item
                   */
                  createItem: (scene, callback = undefined, scope = undefined) => {
                    /**
                     * an interactive parent element to hold the party member elements.
                     * @type {BABYLON.GUI.Rectangle}
                     */
                    const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
                    rectangle.thickness = 0;
                    rectangle.background = Materials.darkRGB;
                    rectangle.adaptWidthToChildren = false;
                    rectangle.hasCallback = false;
                    if (typeof(callback) !== "undefined" && callback !== null) {
                      rectangle.hasCallback = true;
                      rectangle.isPointerBlocker = true;
                      rectangle.hoverCursor = "pointer";
                      // CLICK
                      rectangle.onPointerClickObservable.add((eventData, eventState) => {
                        callback.apply(scope, [rectangle.name]);
                      });
                      // MOUSE OVER
                      rectangle.onPointerEnterObservable.add((eventData, eventState) => {
                        rectangle.background = Materials.lightRGB;
                        const children = rectangle.children[0].children;
                        for (let i = children.length - 1; i >= 0; i--) {
                          children[i].color = Materials.darkRGB;
                        }
                      });
                      // MOUSE EXIT
                      rectangle.onPointerOutObservable.add(
                        (eventData, eventState) => {
                          rectangle.background = Materials.darkRGB;
                          const children = rectangle.children[0].children;
                          for (let i = children.length - 1; i >= 0; i--) {
                            children[i].color = Materials.lightRGB;
                          }
                        },     // callback
                        -1,    // mask used to filter observers
                        false, // flag indicating whether the callback is inserted at first postion
                        scope  // scope object
                      );
                    }
                    /** a BABYLON.GUI.Grid to lay out the party member elements */
                    const row = WizardryScene.createGrid({
                      columns: [
                        DIV8,     // #
                        5 * DIV8, // name
                        2 * DIV8, // price
                      ]
                    });
                    // add text blocks to row
                    row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 0); // row, column
                    row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 1); // row, column
                    row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT }),  0, 2); // row, column
                
                    rectangle.addControl(row);
                
                    return rectangle;
                  },
                  /**
                   * Gets the pagination data for displaying the Trading Post inventory for sale.
                   * @param {WizardryInterface} parent the parent interface
                   * @returns {object} the pagination data
                   */
                  getList: (parent) => {
                    let data = { startIndex: 0, endIndex: 0 };
                    if (parent._parent.state === WizardryConstants.BOLTAC_BUY_MENU) {
                      // only run if in the purchase from shop screen
                      const inventory = [];
                      const ids = WizardryController.equipmentListInstance.getIds();
                      for (let i = 0, li = ids.length; i < li; i++) {
                        if (WizardryController.boltacsInventory[ids[i]] !== 0) {
                          inventory.push(ids[i]);
                        }
                      }

                      data = paginate(inventory.length, parent._parent.inventoryPage, 6);
                      parent._parent.inventoryPage = data.currentPage;
                      parent._parent.inventoryLastPage = data.totalPages;
                    }
                    return data;
                  },
                  /**
                   * Sets all display elements.
                   * @param {object} paginationData the pagination data
                   * @param {BABYLON.GUI.Rectangle[]} displayElements the list of display elements
                   */
                  setList: (paginationData, displayElements) => {
                    const inventory = [];
                    const ids = WizardryController.equipmentListInstance.getIds();
                    for (let i = 0, li = ids.length; i < li; i++) {
                      if (WizardryController.boltacsInventory[ids[i]] !== 0) {
                        inventory.push(ids[i]);
                      }
                    }
                    // iterate through elements
                    for (let i = displayElements.length - 1; i >= 0; i--) {
                      // all elements are a rectangle containing a layout grid with text elements
                      const rectangle = displayElements[i];
                      const children = displayElements[i].children[0].children;
                      // clear the text
                      for (let j = children.length - 1; j >= 0; j--) {
                        children[j].text = "";
                      }
                      // if the element is clickable, hide it to eliminate hover behavior
                      if (rectangle.hasCallback) {
                        rectangle.isVisible = false;
                      }
                    }
                    // iterate through list items
                    for (let i = paginationData.startIndex, li = paginationData.endIndex, j = 0; i <= li; i++, j++) {
                      const listItem = WizardryController.equipmentListInstance.getEquipmentItem(inventory[i]);
                      const rectangle = displayElements[j];
                      const children = rectangle.children[0].children;
                      let k = 0;
                      // set the item display elements
                      children[k++].text = [j + 1, ")"].join("");
                      children[k++].text = listItem.name;
                      children[k].text = listItem.price.toString();
                      // if the element is clickable, set the element name and make sure it is visible
                      if (rectangle.hasCallback) {
                        rectangle.name = inventory[i].toString();
                        rectangle.isVisible = true;
                      }
                    }
                  }
                }
              },
              {
                comment: "PAGINATION",
                type: "grid",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  columns: [2 * DIV9, DIV3, 4 * DIV9],
                  key: "pagination",
                  setDynamicElement: function(parent) {
                    // hide the start/back buttons when on first page
                    if (parent._parent.inventoryPage <= 1) {
                      parent.getDynamicElement("startButton").isVisible = false;
                      parent.getDynamicElement("backButton").isVisible = false;
                    } else {
                      parent.getDynamicElement("startButton").isVisible = true;
                      parent.getDynamicElement("backButton").isVisible = true;
                    }
                    // hide the forward button when on last page
                    if (parent._parent.inventoryPage === parent._parent.inventoryLastPage) {
                      parent.getDynamicElement("forwardButton").isVisible = false;
                    } else {
                      parent.getDynamicElement("forwardButton").isVisible = true;
                    }
                  },
                  dynamicElement: true
                },
                children: [
                  {
                    type: "button",
                    position: {
                      column: 0,
                      row: 0
                    },
                    "initialization parameters": {
                      background: {
                        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                        onPointerClickObservable: function() {
                          this.userAction("scroll", [0]);
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "S)TART",
                      },
                      key: "startButton",
                      dynamicElement: true
                    }
                  },
                  {
                    type: "button",
                    position: {
                      column: 1,
                      row: 0
                    },
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("scroll", [2]);
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "<-- BACK",
                      },
                      key: "backButton",
                      dynamicElement: true
                    }
                  },
                  {
                    type: "button",
                    position: {
                      column: 2,
                      row: 0
                    },
                    "initialization parameters": {
                      background: {
                        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
                        onPointerClickObservable: function() {
                          this.userAction("scroll", [1]);
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "FORWARD -->",
                      },
                      key: "forwardButton",
                      dynamicElement: true
                    }
                  }
                ]
              }
            ]
          },
          {
            comment: "MESSAGES/PURCHASE CONFIRMATION",
            type: "grid",
            position: {
              column: 1,
              row: 0
            },
            "initialization parameters": {
              rows: [2 * DIV7, DIV7, DIV7, DIV7, 2 * DIV7],
              key: "confirm purchases",
              setDynamicElement: function(parent) {
                this.isVisible = false;
              },
              dynamicElement: true
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  text: " UNUSABLE ITEM",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "text",
                position: {
                  column: 0,
                  row: 2
                },
                "initialization parameters": {
                  text: " CONFIRM BUY",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                comment: "USER ENTRY",
                type: "stack",
                position: {
                  column: 0,
                  row: 3
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
                  isVertical: false
                },
                children: [
                  {
                    type: "text",
                    "initialization parameters": {
                      text: " ",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("completePurchase", [true]);
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "(Y)",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: "/",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("completePurchase", [false]);
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "(N)",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: " ? >",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      key: "entry block",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                      dynamicElement: true
                    }
                  },
                  {
                    type: "cursor"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        comment: "INSTRUCTIONS",
        type: "grid",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          rows: [DIV4, DIV4, DIV2]
        },
        children: [
          {
            comment: "GOLD",
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              key: "gold",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              setDynamicElement: function() {
                if (WizardryController.characterRecord.length !== 0) {
                  const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
                  this.text = ["YOU HAVE ", character.gold, " GOLD"].join("");
                }
              },
              dynamicElement: true
            }
          },
          {
            type: "stack",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  text: "#) OR CLICK A ROW TO PURCHASE OR ",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "button",
                "initialization parameters": {
                  background: {
                    horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                    onPointerClickObservable: function() {
                      this.userAction("exit");
                    },
                    onPointerEnterObservable: function() { },
                    onPointerOutObservable: function() {  }
                  },
                  text: {
                    text: "L)EAVE",
                  }
                }
              }
            ]
          },
          {
            comment: "MESSAGE BLOCK",
            type: "text",
            position: {
              column: 1,
              row: 7
            },
            "initialization parameters": {
              key: "message block",
              lineSpacing: "3px",
              textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
              resizeToFit: false,
              textWrapping: true,
              animations: [FADE],
              dynamicElement: true
            }
          }
        ]
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    purchase: function() {
      this._acceptingInput = true;

      this.getDynamicElement("entry block").text = "";
      const messageBlock = this.getDynamicElement("message block");
      // start testing
      let stop = false;
      const id = parseInt(arguments[0]);
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      const item = WizardryController.equipmentListInstance.getEquipmentItem(id);
      
      if (item.price > character.gold) { // character can't afford the item
        stop = true;
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "** YOU CANNOT AFFORD IT **";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        this.set();
      }
      if (!stop) {
        if (character.possessions.count >= 8) { // character has no room in inventory
          stop = true;
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = "** YOU CANT CARRY ANYTHING MORE **";
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          this.set();
        }
      }
      if (!stop) {
        if (item.classUse[character.clazz]) { // character purchases the item
          character.addToInventory({
            equipped: false,
            identified: true,
            cursed: false,
            id: id
          });
          character.gold -= item.price;
          if (WizardryController.boltacsInventory[id] > 0) {
            WizardryController.boltacsInventory[id]--;
            // TODO - SAVE BOLTAC
            if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
              // WizardryDataManager.updateRoster(arr, () => { });
            }
          }
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = "** JUST WHAT YOU NEEDED **";
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          this.set();
        } else { // open the confirmation window before purchase
          this.getDynamicElement("confirm purchases").isVisible = true;
          this._purchaseItemId = id;
        }
      }
    },
    completePurchase: function() {
      const commit = arguments[0];
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");

      entryBlock.text = commit ? "Y" : "N";

      const action = () => {
        this._acceptingInput = true;
        entryBlock.text = "";
        this.getDynamicElement("confirm purchases").isVisible = false;
        this._parent.stopAnimation(messageBlock);
        if (commit) {
          const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
          const item = WizardryController.equipmentListInstance.getEquipmentItem(this._purchaseItemId);
          character.addToInventory({
            equipped: false,
            identified: true,
            cursed: false,
            id: this._purchaseItemId
          });
          character.gold -= item.price;
          if (WizardryController.boltacsInventory[this._purchaseItemId] > 0) {
            WizardryController.boltacsInventory[this._purchaseItemId]--;
          }
          messageBlock.text = "** ITS YOUR MONEY **";
        } else {
          messageBlock.text = "** WE ALL MAKE MISTAKES **";
        }
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        this.set();
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    exit: function() {
      this._acceptingInput = true;
      if (!this.getDynamicElement("confirm purchases").isVisible) {
        const entryBlock = this.getDynamicElement("entry block");
        const messageBlock = this.getDynamicElement("message block");
        const listPanel = this.getDynamicElement("inventory listing");
        this._parent.inventoryPage = 0;
        entryBlock.text = "";
        messageBlock.text = "";
        listPanel.resetHighlights();
        this._parent.state = WizardryConstants.BOLTAC_MAIN_MENU;
      }
    },
    /**
     * Scrolls the inventory listing.
     */
    scroll: function() {
      this._acceptingInput = true;
      if (!this.getDynamicElement("confirm purchases").isVisible) {
        const direction = arguments[0];
        switch (direction) {
          case 0:
            this._parent.inventoryPage = 0;
            break;
          case 2:
            this._parent.inventoryPage--;
            break;
          case 1:
            this._parent.inventoryPage++;
            break;
          default:
            throw ["Invalid direction", direction];
        }
        this.set();
      }
    }
  },
  keyEntries: {
    ENTER: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.action = "completePurchase";
        retObj.arguments = [true];
      }
      return retObj;
    },
    ESCAPE: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.action = "completePurchase";
        retObj.arguments = [false];
      }
      return retObj;
    },
    ARROWLEFT: function() {
      const retObj = {
        isValid: true,
        action: "scroll",
        arguments: [2]
      };
      if (this._parent.inventoryPage <= 1) {
        retObj.isValid = false;
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    S: function() {
      const retObj = {
        isValid: true,
        action: "scroll",
        arguments: [0]
      };
      if (this._parent.inventoryPage <= 1) {
        retObj.isValid = false;
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    ARROWRIGHT: function() {
      const retObj = {
        isValid: true,
        action: "scroll",
        arguments: [1]
      };
      if (this._parent.inventoryPage === this._parent.inventoryLastPage) {
        retObj.isValid = false;
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    Y: function() {
      const retObj = {
        isValid: true,
        action: "completePurchase",
        arguments: [true]
      };
      if (!this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    N: function() {
      const retObj = {
        isValid: true,
        action: "completePurchase",
        arguments: [true]
      };
      if (!this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "1": function() {
      const index = 0;
      const retObj = {
        isValid: false,
        action: "purchase",
        arguments: []
      };
      const inventory = [];
      const ids = WizardryController.equipmentListInstance.getIds();
      for (let i = 0, li = ids.length; i < li; i++) {
        if (WizardryController.boltacsInventory[ids[i]] !== 0) {
          inventory.push(ids[i]);
        }
      }
      const data = paginate(inventory.length, this._parent.inventoryPage, 6);
      if (data.endIndex - data.startIndex >= index) {
        retObj.isValid = true;
        retObj.arguments.push(inventory[data.startIndex + index]);
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const index = 1;
      const retObj = {
        isValid: false,
        action: "purchase",
        arguments: []
      };
      const inventory = [];
      const ids = WizardryController.equipmentListInstance.getIds();
      for (let i = 0, li = ids.length; i < li; i++) {
        if (WizardryController.boltacsInventory[ids[i]] !== 0) {
          inventory.push(ids[i]);
        }
      }
      const data = paginate(inventory.length, this._parent.inventoryPage, 6);
      if (data.endIndex - data.startIndex >= index) {
        retObj.isValid = true;
        retObj.arguments.push(inventory[data.startIndex + index]);
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const index = 2;
      const retObj = {
        isValid: false,
        action: "purchase",
        arguments: []
      };
      const inventory = [];
      const ids = WizardryController.equipmentListInstance.getIds();
      for (let i = 0, li = ids.length; i < li; i++) {
        if (WizardryController.boltacsInventory[ids[i]] !== 0) {
          inventory.push(ids[i]);
        }
      }
      const data = paginate(inventory.length, this._parent.inventoryPage, 6);
      if (data.endIndex - data.startIndex >= index) {
        retObj.isValid = true;
        retObj.arguments.push(inventory[data.startIndex + index]);
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const index = 3;
      const retObj = {
        isValid: false,
        action: "purchase",
        arguments: []
      };
      const inventory = [];
      const ids = WizardryController.equipmentListInstance.getIds();
      for (let i = 0, li = ids.length; i < li; i++) {
        if (WizardryController.boltacsInventory[ids[i]] !== 0) {
          inventory.push(ids[i]);
        }
      }
      const data = paginate(inventory.length, this._parent.inventoryPage, 6);
      if (data.endIndex - data.startIndex >= index) {
        retObj.isValid = true;
        retObj.arguments.push(inventory[data.startIndex + index]);
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const index = 4;
      const retObj = {
        isValid: false,
        action: "purchase",
        arguments: []
      };
      const inventory = [];
      const ids = WizardryController.equipmentListInstance.getIds();
      for (let i = 0, li = ids.length; i < li; i++) {
        if (WizardryController.boltacsInventory[ids[i]] !== 0) {
          inventory.push(ids[i]);
        }
      }
      const data = paginate(inventory.length, this._parent.inventoryPage, 6);
      if (data.endIndex - data.startIndex >= index) {
        retObj.isValid = true;
        retObj.arguments.push(inventory[data.startIndex + index]);
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const index = 5;
      const retObj = {
        isValid: false,
        action: "purchase",
        arguments: []
      };
      const inventory = [];
      const ids = WizardryController.equipmentListInstance.getIds();
      for (let i = 0, li = ids.length; i < li; i++) {
        if (WizardryController.boltacsInventory[ids[i]] !== 0) {
          inventory.push(ids[i]);
        }
      }
      const data = paginate(inventory.length, this._parent.inventoryPage, 6);
      if (data.endIndex - data.startIndex >= index) {
        retObj.isValid = true;
        retObj.arguments.push(inventory[data.startIndex + index]);
      }
      if (this.getDynamicElement("confirm purchases").isVisible) {
        retObj.isValid = false;
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.BOLTAC_SELL_MENU] = {
   /** the screen state */
  state: WizardryConstants.BOLTAC_SELL_MENU,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat(
    {
      points: [
        { cell: [0, 19] },
        { cell: [39, 19] }
      ]
    },
  ),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        8 * DIV24, // 5 - items for sale
        DIV24,     // border
        DIV24,     // 7 - entry prompt
        DIV24,     // 8 - exit button
        DIV24,     // 9 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "SHOP ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "ITEMS FOR SALE",
        type: "dynamic listing",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          key: "inventory listing",
          maxItems: 8,
          callback: "sell",
          /**
           * Creates a list item for display.
           * @param {WizardryScene} scene the parent scene
           * @param {void} callback the callback function for when an item is clicked
           * @param {WizardryInterface} scope the value of this provided for the callback
           * @returns {BABYLON.GUI.Rectangle} the rectangle containing the list item
           */
          createItem: (scene, callback = undefined, scope = undefined) => {
            /**
             * an interactive parent element to hold the party member elements.
             * @type {BABYLON.GUI.Rectangle}
             */
            const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
            rectangle.thickness = 0;
            rectangle.background = Materials.darkRGB;
            rectangle.adaptWidthToChildren = false;
            rectangle.hasCallback = false;
            if (typeof(callback) !== "undefined" && callback !== null) {
              rectangle.hasCallback = true;
              rectangle.isPointerBlocker = true;
              rectangle.hoverCursor = "pointer";
              // CLICK
              rectangle.onPointerClickObservable.add((eventData, eventState) => {
                callback.apply(scope, [rectangle.name]);
              });
              // MOUSE OVER
              rectangle.onPointerEnterObservable.add((eventData, eventState) => {
                rectangle.background = Materials.lightRGB;
                const children = rectangle.children[0].children;
                for (let i = children.length - 1; i >= 0; i--) {
                  children[i].color = Materials.darkRGB;
                }
              });
              // MOUSE EXIT
              rectangle.onPointerOutObservable.add(
                (eventData, eventState) => {
                  rectangle.background = Materials.darkRGB;
                  const children = rectangle.children[0].children;
                  for (let i = children.length - 1; i >= 0; i--) {
                    children[i].color = Materials.lightRGB;
                  }
                },     // callback
                -1,    // mask used to filter observers
                false, // flag indicating whether the callback is inserted at first postion
                scope  // scope object
              );
            }
            /** a BABYLON.GUI.Grid to lay out the party member elements */
            const row = WizardryScene.createGrid({
              columns: [
                DIV8,     // #
                DIV3,     // name
                DIV4,     // price
                7 * DIV24 // empty
              ]
            });
            // add text blocks to row
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 0); // row, column
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 1); // row, column
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT }),  0, 2); // row, column
        
            rectangle.addControl(row);
        
            return rectangle;
          },
          /**
            * Gets the character's inventory.
            * @param {WizardryInterface} parent the parent interface
            * @returns {object} the pagination data
            */
          getList: (parent) => {
            let arr = [];
            if (WizardryController.characterRecord.length > 0) {
              arr = arr.concat(WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord).possessions.possession);
            }
            return arr;
          },
          /**
            * Sets all display elements.
            * @param {object[]} equipmentData the character's equipment data
            * @param {BABYLON.GUI.Rectangle[]} displayElements the list of display elements
            */
          setList: (equipmentData, displayElements) => {
            // iterate through elements
            for (let i = displayElements.length - 1; i >= 0; i--) {
              // all elements are a rectangle containing a layout grid with text elements
              const rectangle = displayElements[i];
              const children = displayElements[i].children[0].children;
              // clear the text
              for (let j = children.length - 1; j >= 0; j--) {
                children[j].text = "";
              }
              // if the element is clickable, hide it to eliminate hover behavior
              if (rectangle.hasCallback) {
                rectangle.isVisible = false;
              }
            }
            // iterate through list items
            for (let i = 0, li = equipmentData.length; i < li; i++) {
              if (equipmentData[i].equipmentIndex >= 0) {
                const listItem = WizardryController.equipmentListInstance.getEquipmentItem(equipmentData[i].equipmentIndex);
                const rectangle = displayElements[i];
                const children = rectangle.children[0].children;
                let k = 0;
                // set the item display elements
                children[k++].text = [i + 1, ")"].join("");
                children[k++].text = equipmentData[i].identified ? listItem.name : listItem.nameUnknown;
                children[k].text   = (equipmentData[i].identified ? Math.floor(listItem.price / 2) : 1).toString();
                // if the element is clickable, set the element name and make sure it is visible
                if (rectangle.hasCallback) {
                  rectangle.name = i.toString();
                  rectangle.isVisible = true;
                }
              }
            }
          }
        }
      },
      {
        comment: "USER ENTRY",
        type: "stack",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          isVertical: false
        },
        children: [
          {
            type: "text",
            "initialization parameters": {
              text: "WHICH DO YOU WISH TO SELL ? >",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            "initialization parameters": {
              key: "entry block",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              dynamicElement: true
            }
          },
          {
            type: "cursor"
          }
        ]
      },
      {
        type: "button",
        position: {
          column: 1,
          row: 8
        },
        "initialization parameters": {
          background: {
            onPointerClickObservable: function() {
              this.userAction("exit");
            },
            onPointerEnterObservable: function() { },
            onPointerOutObservable: function() {  }
          },
          text: {
            text: "[ESC] TO LEAVE",
          }
        }
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 9
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    sell: function() {
      const index = parseInt(arguments[0]);
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      const possessionObject = character.possessions.possession[parseInt(index)];
      const item = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
  
      // set the prompt text
      entryBlock.text = possessionObject.identified ? item.name : item.nameUnknown;
  
      if (possessionObject.cursed) {
        // cursed items can't be sold. set a timer to clear the user entry prompt
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "** WE DONT BUY CURSED ITEMS **";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

        const action = () => {
          entryBlock.text = "";
          this._acceptingInput = true;
          this.set();
        };
        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
      } else {
        if (possessionObject.identified) {
          // identified items sell for 1/2 price
          character.gold += Math.floor(item.price / 2);
        } else {
          // unidentified items sell for 1 gold
          character.gold++;
        }
  
        // give the item to boltac before removing from the player's inventory
        if (WizardryController.boltacsInventory[possessionObject.equipmentIndex] >= 0) {
          WizardryController.boltacsInventory[possessionObject.equipmentIndex]++;
        }
        // TODO - save Boltac
  
        // remove the item from the player's inventory
        character.removeFromInventory(index);
  
        if (character.possessions.count > 0) {
          this._acceptingInput = true;
          this.set();
          this._acceptingInput = false;
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = "** ANYTHING ELSE, SIRE? **";
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

          // start a timer to clear the user entry prompt
          const action = () => {
            entryBlock.text = "";
            this._acceptingInput = true;
          };
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
        } else {
          this._acceptingInput = true;
          this.set();
          this._acceptingInput = false;
          // start a timer to clear the user entry prompt and exit to player menu
          const action = () => {
            entryBlock.text = "";
            this._acceptingInput = true;
            this.userAction("exit");
          };
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
        }
      }
    },
    /**
     * Handler for the action to return to the main menu.
     * @type {void}
     */
    exit: function() {
      this._acceptingInput = true;
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("inventory listing");
      entryBlock.text = "";
      messageBlock.text = "";
      listPanel.resetHighlights();
      this._parent.state = WizardryConstants.BOLTAC_MAIN_MENU;
    }
  },
  keyEntries: {
    ENTER: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      return retObj;
    },
    ESCAPE: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      return retObj;
    },
    "1": function() {
      const index = 0;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "2": function() {
      const index = 1;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "3": function() {
      const index = 2;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "4": function() {
      const index = 3;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "5": function() {
      const index = 4;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "6": function() {
      const index = 5;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "7": function() {
      const index = 6;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "8": function() {
      const index = 7;
      const retObj = {
        isValid: false,
        action: "sell",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.BOLTAC_UNCURSE_MENU] = {
   /** the screen state */
  state: WizardryConstants.BOLTAC_UNCURSE_MENU,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat(
    {
      points: [
        { cell: [0, 19] },
        { cell: [39, 19] }
      ]
    },
  ),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        8 * DIV24, // 5 - items for sale
        DIV24,     // border
        DIV24,     // 7 - entry prompt
        DIV24,     // 8 - exit button
        DIV24,     // 9 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "SHOP ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "ITEMS TO UNCURSE",
        type: "dynamic listing",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          key: "inventory listing",
          maxItems: 8,
          callback: "uncurse",
          /**
           * Creates a list item for display.
           * @param {WizardryScene} scene the parent scene
           * @param {void} callback the callback function for when an item is clicked
           * @param {WizardryInterface} scope the value of this provided for the callback
           * @returns {BABYLON.GUI.Rectangle} the rectangle containing the list item
           */
          createItem: (scene, callback = undefined, scope = undefined) => {
            /**
             * an interactive parent element to hold the party member elements.
             * @type {BABYLON.GUI.Rectangle}
             */
            const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
            rectangle.thickness = 0;
            rectangle.background = Materials.darkRGB;
            rectangle.adaptWidthToChildren = false;
            rectangle.hasCallback = false;
            if (typeof(callback) !== "undefined" && callback !== null) {
              rectangle.hasCallback = true;
              rectangle.isPointerBlocker = true;
              rectangle.hoverCursor = "pointer";
              // CLICK
              rectangle.onPointerClickObservable.add((eventData, eventState) => {
                callback.apply(scope, [rectangle.name]);
              });
              // MOUSE OVER
              rectangle.onPointerEnterObservable.add((eventData, eventState) => {
                rectangle.background = Materials.lightRGB;
                const children = rectangle.children[0].children;
                for (let i = children.length - 1; i >= 0; i--) {
                  children[i].color = Materials.darkRGB;
                }
              });
              // MOUSE EXIT
              rectangle.onPointerOutObservable.add(
                (eventData, eventState) => {
                  rectangle.background = Materials.darkRGB;
                  const children = rectangle.children[0].children;
                  for (let i = children.length - 1; i >= 0; i--) {
                    children[i].color = Materials.lightRGB;
                  }
                },     // callback
                -1,    // mask used to filter observers
                false, // flag indicating whether the callback is inserted at first postion
                scope  // scope object
              );
            }
            /** a BABYLON.GUI.Grid to lay out the party member elements */
            const row = WizardryScene.createGrid({
              columns: [
                DIV8,     // #
                DIV3,     // name
                DIV4,     // price
                7 * DIV24 // empty
              ]
            });
            // add text blocks to row
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 0); // row, column
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 1); // row, column
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT }),  0, 2); // row, column
        
            rectangle.addControl(row);
        
            return rectangle;
          },
          /**
            * Gets the character's inventory.
            * @param {WizardryInterface} parent the parent interface
            * @returns {object} the pagination data
            */
          getList: (parent) => {
            let arr = [];
            if (WizardryController.characterRecord.length > 0) {
              arr = arr.concat(WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord).possessions.possession);
            }
            return arr;
          },
          /**
            * Sets all display elements.
            * @param {object[]} equipmentData the character's equipment data
            * @param {BABYLON.GUI.Rectangle[]} displayElements the list of display elements
            */
          setList: (equipmentData, displayElements) => {
            // iterate through elements
            for (let i = displayElements.length - 1; i >= 0; i--) {
              // all elements are a rectangle containing a layout grid with text elements
              const rectangle = displayElements[i];
              const children = displayElements[i].children[0].children;
              // clear the text
              for (let j = children.length - 1; j >= 0; j--) {
                children[j].text = "";
              }
              // if the element is clickable, hide it to eliminate hover behavior
              if (rectangle.hasCallback) {
                rectangle.isVisible = false;
              }
            }
            // iterate through list items
            for (let i = 0, li = equipmentData.length; i < li; i++) {
              if (equipmentData[i].equipmentIndex >= 0) {
                const listItem = WizardryController.equipmentListInstance.getEquipmentItem(equipmentData[i].equipmentIndex);
                const rectangle = displayElements[i];
                const children = rectangle.children[0].children;
                let k = 0;
                // set the item display elements
                children[k++].text = [i + 1, ")"].join("");
                children[k++].text = equipmentData[i].identified ? listItem.name : listItem.nameUnknown;
                children[k].text   = Math.floor(listItem.price / 2).toString();
                // if the element is clickable, set the element name and make sure it is visible
                if (rectangle.hasCallback) {
                  rectangle.name = i.toString();
                  rectangle.isVisible = true;
                }
              }
            }
          }
        }
      },
      {
        comment: "USER ENTRY",
        type: "stack",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          isVertical: false
        },
        children: [
          {
            type: "text",
            "initialization parameters": {
              text: "WHICH DO YOU WISH UNCURSED ? >",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            "initialization parameters": {
              key: "entry block",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              dynamicElement: true
            }
          },
          {
            type: "cursor"
          }
        ]
      },
      {
        type: "button",
        position: {
          column: 1,
          row: 8
        },
        "initialization parameters": {
          background: {
            onPointerClickObservable: function() {
              this.userAction("exit");
            },
            onPointerEnterObservable: function() { },
            onPointerOutObservable: function() {  }
          },
          text: {
            text: "[ESC] TO LEAVE",
          }
        }
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 9
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    uncurse: function() {
      const index = parseInt(arguments[0]);
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      const possessionObject = character.possessions.possession[parseInt(index)];
      const item = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
  
      // set the prompt text
      entryBlock.text = possessionObject.identified ? item.name : item.nameUnknown;

      // default action - clear text and reset the view
      let action = () => {
        entryBlock.text = "";
        this._acceptingInput = true;
        this.set();
      };
  
      if (!possessionObject.cursed) {
        // cursed items can't be sold. set a timer to clear the user entry prompt
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "** THAT IS NOT A CURSED ITEM **";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
      } else {
        const fee = Math.floor(item.price / 2);
        if (character.gold < fee) {
          // cursed items can't be sold. set a timer to clear the user entry prompt
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = "** YOU CANT AFFORD THE FEE **";
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
        } else {
          character.gold -= fee;
          // remove the item from the player's inventory
          character.removeFromInventory(index);

          // reset the view immediately
          this._acceptingInput = true;
          this.set();
          this._acceptingInput = false;
    
          if (character.hasAnyCursedEquipment()) {
            this._parent.stopAnimation(messageBlock);
            messageBlock.text = "** ANYTHING ELSE, SIRE? **";
            this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

            // start a timer to clear the user entry prompt
            action = () => {
              entryBlock.text = "";
              this._acceptingInput = true;
            };
            WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
          } else {
            // start a timer to clear the user entry prompt and exit to player menu
            action = () => {
              entryBlock.text = "";
              this._acceptingInput = true;
              this.userAction("exit");
            };
            WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
          }
        }
      }
    },
    /**
     * Handler for the action to return to the main menu.
     * @type {void}
     */
    exit: function() {
      this._acceptingInput = true;
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("inventory listing");
      entryBlock.text = "";
      messageBlock.text = "";
      listPanel.resetHighlights();
      this._parent.state = WizardryConstants.BOLTAC_MAIN_MENU;
    }
  },
  keyEntries: {
    ENTER: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      return retObj;
    },
    ESCAPE: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      return retObj;
    },
    "1": function() {
      const index = 0;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "2": function() {
      const index = 1;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "3": function() {
      const index = 2;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "4": function() {
      const index = 3;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "5": function() {
      const index = 4;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "6": function() {
      const index = 5;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "7": function() {
      const index = 6;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "8": function() {
      const index = 7;
      const retObj = {
        isValid: false,
        action: "uncurse",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.BOLTAC_IDENTIFY_MENU] = {
   /** the screen state */
  state: WizardryConstants.BOLTAC_IDENTIFY_MENU,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat(
    {
      points: [
        { cell: [0, 19] },
        { cell: [39, 19] }
      ]
    },
  ),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        8 * DIV24, // 5 - items for sale
        DIV24,     // border
        DIV24,     // 7 - entry prompt
        DIV24,     // 8 - exit button
        DIV24,     // 9 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "SHOP ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "ITEMS TO IDENTIFY",
        type: "dynamic listing",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          key: "inventory listing",
          maxItems: 8,
          callback: "identify",
          /**
           * Creates a list item for display.
           * @param {WizardryScene} scene the parent scene
           * @param {void} callback the callback function for when an item is clicked
           * @param {WizardryInterface} scope the value of this provided for the callback
           * @returns {BABYLON.GUI.Rectangle} the rectangle containing the list item
           */
          createItem: (scene, callback = undefined, scope = undefined) => {
            /**
             * an interactive parent element to hold the party member elements.
             * @type {BABYLON.GUI.Rectangle}
             */
            const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
            rectangle.thickness = 0;
            rectangle.background = Materials.darkRGB;
            rectangle.adaptWidthToChildren = false;
            rectangle.hasCallback = false;
            if (typeof(callback) !== "undefined" && callback !== null) {
              rectangle.hasCallback = true;
              rectangle.isPointerBlocker = true;
              rectangle.hoverCursor = "pointer";
              // CLICK
              rectangle.onPointerClickObservable.add((eventData, eventState) => {
                callback.apply(scope, [rectangle.name]);
              });
              // MOUSE OVER
              rectangle.onPointerEnterObservable.add((eventData, eventState) => {
                rectangle.background = Materials.lightRGB;
                const children = rectangle.children[0].children;
                for (let i = children.length - 1; i >= 0; i--) {
                  children[i].color = Materials.darkRGB;
                }
              });
              // MOUSE EXIT
              rectangle.onPointerOutObservable.add(
                (eventData, eventState) => {
                  rectangle.background = Materials.darkRGB;
                  const children = rectangle.children[0].children;
                  for (let i = children.length - 1; i >= 0; i--) {
                    children[i].color = Materials.lightRGB;
                  }
                },     // callback
                -1,    // mask used to filter observers
                false, // flag indicating whether the callback is inserted at first postion
                scope  // scope object
              );
            }
            /** a BABYLON.GUI.Grid to lay out the party member elements */
            const row = WizardryScene.createGrid({
              columns: [
                DIV8,     // #
                DIV3,     // name
                DIV4,     // price
                7 * DIV24 // empty
              ]
            });
            // add text blocks to row
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 0); // row, column
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),  0, 1); // row, column
            row.addControl(scene.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT }),  0, 2); // row, column
        
            rectangle.addControl(row);
        
            return rectangle;
          },
          /**
            * Gets the character's inventory.
            * @param {WizardryInterface} parent the parent interface
            * @returns {object} the pagination data
            */
          getList: (parent) => {
            let arr = [];
            if (WizardryController.characterRecord.length > 0) {
              arr = arr.concat(WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord).possessions.possession);
            }
            return arr;
          },
          /**
            * Sets all display elements.
            * @param {object[]} equipmentData the character's equipment data
            * @param {BABYLON.GUI.Rectangle[]} displayElements the list of display elements
            */
          setList: (equipmentData, displayElements) => {
            // iterate through elements
            for (let i = displayElements.length - 1; i >= 0; i--) {
              // all elements are a rectangle containing a layout grid with text elements
              const rectangle = displayElements[i];
              const children = displayElements[i].children[0].children;
              // clear the text
              for (let j = children.length - 1; j >= 0; j--) {
                children[j].text = "";
              }
              // if the element is clickable, hide it to eliminate hover behavior
              if (rectangle.hasCallback) {
                rectangle.isVisible = false;
              }
            }
            // iterate through list items
            for (let i = 0, li = equipmentData.length; i < li; i++) {
              if (equipmentData[i].equipmentIndex >= 0) {
                const listItem = WizardryController.equipmentListInstance.getEquipmentItem(equipmentData[i].equipmentIndex);
                const rectangle = displayElements[i];
                const children = rectangle.children[0].children;
                let k = 0;
                // set the item display elements
                children[k++].text = [i + 1, ")"].join("");
                children[k++].text = equipmentData[i].identified ? listItem.name : listItem.nameUnknown;
                children[k].text   = Math.floor(listItem.price / 2).toString();
                // if the element is clickable, set the element name and make sure it is visible
                if (rectangle.hasCallback) {
                  rectangle.name = i.toString();
                  rectangle.isVisible = true;
                }
              }
            }
          }
        }
      },
      {
        comment: "USER ENTRY",
        type: "stack",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          isVertical: false
        },
        children: [
          {
            type: "text",
            "initialization parameters": {
              text: "WHICH DO YOU WISH IDENTIFIED ? >",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            "initialization parameters": {
              key: "entry block",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              dynamicElement: true
            }
          },
          {
            type: "cursor"
          }
        ]
      },
      {
        type: "button",
        position: {
          column: 1,
          row: 8
        },
        "initialization parameters": {
          background: {
            onPointerClickObservable: function() {
              this.userAction("exit");
            },
            onPointerEnterObservable: function() { },
            onPointerOutObservable: function() {  }
          },
          text: {
            text: "[ESC] TO LEAVE",
          }
        }
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 9
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    identify: function() {
      const index = parseInt(arguments[0]);
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      const possessionObject = character.possessions.possession[parseInt(index)];
      const item = WizardryController.equipmentListInstance.getEquipmentItem(possessionObject.equipmentIndex);
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
  
      // set the prompt text
      entryBlock.text = possessionObject.identified ? item.name : item.nameUnknown;

      // default action - clear text and reset the view
      let action = () => {
        entryBlock.text = "";
        this._acceptingInput = true;
        this.set();
      };
  
      if (possessionObject.identified) {
        this._parent.stopAnimation(messageBlock);
        messageBlock.text = "** THAT HAS BEEN IDENTIFIED **";
        this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
      } else {
        const fee = Math.floor(item.price / 2);
        if (character.gold < fee) {
          // cursed items can't be sold. set a timer to clear the user entry prompt
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = "** YOU CANT AFFORD THE FEE **";
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
        } else {
          character.gold -= fee;
          possessionObject.identified = true;

          // reset the view immediately
          this._acceptingInput = true;
          this.set();
          this._acceptingInput = false;
    
          if (character.hasAnyUnidentifiedEquipment()) {
            this._parent.stopAnimation(messageBlock);
            messageBlock.text = "** ANYTHING ELSE, SIRE? **";
            this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);

            // start a timer to clear the user entry prompt
            action = () => {
              entryBlock.text = "";
              this._acceptingInput = true;
            };
            WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
          } else {
            // start a timer to clear the user entry prompt and exit to player menu
            action = () => {
              entryBlock.text = "";
              this._acceptingInput = true;
              this.userAction("exit");
            };
            WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
          }
        }
      }
    },
    /**
     * Handler for the action to return to the main menu.
     * @type {void}
     */
    exit: function() {
      this._acceptingInput = true;
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("inventory listing");
      entryBlock.text = "";
      messageBlock.text = "";
      listPanel.resetHighlights();
      this._parent.state = WizardryConstants.BOLTAC_MAIN_MENU;
    }
  },
  keyEntries: {
    ENTER: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      return retObj;
    },
    ESCAPE: function() {
      const retObj = {
        isValid: true,
        action: "exit"
      };
      return retObj;
    },
    "1": function() {
      const index = 0;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "2": function() {
      const index = 1;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "3": function() {
      const index = 2;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "4": function() {
      const index = 3;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "5": function() {
      const index = 4;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "6": function() {
      const index = 5;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "7": function() {
      const index = 6;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    },
    "8": function() {
      const index = 7;
      const retObj = {
        isValid: false,
        action: "identify",
        arguments: []
      };
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      if (character.possessions.count > index) {
        retObj.isValid = true;
        retObj.arguments.push(index);
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.CANT_MAIN] = {
   /** the screen state */
  state: WizardryConstants.CANT_MAIN,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 17] },
      { cell: [39, 17] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        5 * DIV24, // 5 - options
        DIV24,     // border
        6 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "TEMPLE ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV5, DIV5, DIV5, DIV5, DIV5]
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              text: "WELCOME TO THE TEMPLE OF RADIANT CANT!"
            }
          },
          {
            comment: "USER ENTRY",
            type: "stack",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false
            },
            children: [
              {
                type: "text",
                "initialization parameters": {
                  text: "WHO ARE YOU HELPING ? >",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "text",
                "initialization parameters": {
                  key: "entry block",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  dynamicElement: true
                }
              },
              {
                type: "cursor"
              }
            ]
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 4
            },
            "initialization parameters": {
              background: {
                onPointerClickObservable: function() {
                  this.userAction("goToCastle");
                },
                onPointerEnterObservable: function() { },
                onPointerOutObservable: function() {  }
              },
              text: {
                text: "[ESC] TO LEAVE",
              }
            }
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("party listing");
      if (!isNaN(parseInt(arguments[0]))) {
        WizardryController.characterRecord = WizardryController.characters[arguments[0]];
      } else {
        WizardryController.characterRecord = arguments[0];
      }

      /** the character activated. */
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
      entryBlock.text = [character.name].join("");

      let action = () => {
        entryBlock.text = "";
        messageBlock.text = "";
        listPanel.resetHighlights();
        this._acceptingInput = true;
        this._parent.state = WizardryConstants.CANT_PAY;
      };
      if (character.lostXyl.location[0] + character.lostXyl.location[1] + character.lostXyl.location[2] !== 0) {
        // character doesn't need treatment
        action = () => {
          WizardryController.characterRecord = "";
          entryBlock.text = "";
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = [character.name, " IS NOT HERE"].join("");
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          listPanel.resetHighlights();
          this._acceptingInput = true;
        };
      } else if (character.status === WizardryCharacterStatus.LOST) {
        // character doesn't need treatment
        action = () => {
          WizardryController.characterRecord = "";
          entryBlock.text = "";
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = [character.name, " IS LOST"].join("");
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          listPanel.resetHighlights();
          this._acceptingInput = true;
        };
      } else if (character.status === WizardryCharacterStatus.OK) {
        // character doesn't need treatment
        action = () => {
          WizardryController.characterRecord = "";
          entryBlock.text = "";
          this._parent.stopAnimation(messageBlock);
          messageBlock.text = [character.name, " IS OK"].join("");
          this._parent.beginAnimation(messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
          listPanel.resetHighlights();
          this._acceptingInput = true;
        };
      }
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    goToCastle: function() {
      const entryBlock = this.getDynamicElement("entry block");
      const messageBlock = this.getDynamicElement("message block");
      const listPanel = this.getDynamicElement("party listing");
      entryBlock.text = "LEAVE";

      const action = () => {
        entryBlock.text = "";
        messageBlock.text = "";
        listPanel.resetHighlights();
        this._acceptingInput = true;
        WizardryController.xgoto = WizardryXgoto.XCASTLE;
        this._parent.exitScene();
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "goToCastle" }; },
    ESCAPE: function() { return { isValid: true, action: "goToCastle" }; },
    "1": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [0]
      };
      if (WizardryController.characters.length < 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [1]
      };
      if (WizardryController.characters.length < 2) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [2]
      };
      if (WizardryController.characters.length < 3) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [3]
      };
      if (WizardryController.characters.length < 4) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [4]
      };
      if (WizardryController.characters.length < 5) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [5]
      };
      if (WizardryController.characters.length < 6) {
        retObj.isValid = false;
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.CANT_PAY] = {
   /** the screen state */
  state: WizardryConstants.CANT_PAY,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 19] },
      { cell: [39, 19] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "TEMPLE ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV7, DIV7, DIV7, DIV7, DIV7, DIV7, DIV7],
          key: "menu",
          dynamicElement: true,
          setDynamicElement: function(parent) {
            if (WizardryController.characterRecord.length !== 0 && parent._parent.state === WizardryConstants.CANT_PAY) {
              /** the character receiving healing. */
              const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);
              parent.getDynamicElement("patientText").text = ["WHO ARE YOU HELPING ? >", character.name].join("");
              
              const chantingBlock = parent.getDynamicElement("chanting block");
              const donationText = parent.getDynamicElement("donationText");
              const entryBlock = parent.getDynamicElement("entry block");
              const entryText = parent.getDynamicElement("entryText");
              const exitButton = parent.getDynamicElement("exitButton");
              const resultsText = parent.getDynamicElement("resultsText");
              switch (parent._parent.healingPhase) {
                case 0:
                  // hide the priest's chants and healing results
                  chantingBlock.isVisible = false;
                  chantingBlock.children[0].isVisible = false;
                  chantingBlock.children[1].isVisible = false;
                  chantingBlock.children[2].isVisible = false;
                  chantingBlock.children[3].isVisible = false;
                  resultsText.isVisible = false;
                  // show the donation amount, the user entry field, and the exit button
                  donationText.isVisible = true;
                  entryBlock.isVisible = true;
                  exitButton.isVisible = true;

                  // clear the user entry field
                  entryText.text = "";
                  { // set donation amount
                    switch (character.status) {
                      case WizardryCharacterStatus.PLYZE:
                        parent._parent.donationRequired = 100;
                        break;
                      case WizardryCharacterStatus.STONED:
                        parent._parent.donationRequired = 200;
                        break;
                      case WizardryCharacterStatus.DEAD:
                        parent._parent.donationRequired = 250;
                        break;
                      case WizardryCharacterStatus.ASHES:
                        parent._parent.donationRequired = 500;
                        break;
                      default:
                        throw ["Incurable condition", character.status];
                    }
                    parent._parent.donationRequired *= character.charLev;
                    donationText.text = ["THE DONATION WILL BE ", parent._parent.donationRequired].join("");
                  }
                  break;
                case HEALING_PHASE:
                  // show the priest's chants
                  chantingBlock.isVisible = true;
                  // hide healing results, the donation amount, the user entry field, and the exit button
                  resultsText.isVisible = false;
                  donationText.isVisible = false;
                  entryBlock.isVisible = false;
                  exitButton.isVisible = false;
                  break;
                case EXIT_PHASE:
                  // show the priest's chants, healing results, and the exit button
                  chantingBlock.isVisible = true;
                  resultsText.isVisible = true;
                  exitButton.isVisible = true;
                  // hide the donation amount and the user entry field
                  donationText.isVisible = true;
                  entryBlock.isVisible = true;
                  break;
              }
            }
          },
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              text: "WELCOME TO THE TEMPLE OF RADIANT CANT!"
            }
          },
          {
            comment: "PATIENT NAME",
            type: "text",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "patientText",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              dynamicElement: true
            }
          },
          {
            comment: "DONATION",
            type: "text",
            position: {
              column: 0,
              row: 4
            },
            "initialization parameters": {
              key: "donationText",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              dynamicElement: true,
            }
          },
          {
            comment: "CHANTS",
            type: "grid",
            position: {
              column: 0,
              row: 4
            },
            "initialization parameters": {
              columns: [DIV4, DIV4, DIV4, DIV4],
              key: "chanting block",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              dynamicElement: true,
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  text: "MURMUR - "
                }
              },
              {
                type: "text",
                position: {
                  column: 1,
                  row: 0
                },
                "initialization parameters": {
                  text: "CHANT - "
                }
              },
              {
                type: "text",
                position: {
                  column: 2,
                  row: 0
                },
                "initialization parameters": {
                  text: "PRAY - "
                }
              },
              {
                type: "text",
                position: {
                  column: 3,
                  row: 0
                },
                "initialization parameters": {
                  text: "INVOKE!"
                }
              }
            ]
          },
          {
            comment: "USER ENTRY",
            type: "stack",
            position: {
              column: 0,
              row: 5
            },
            "initialization parameters": {
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              isVertical: false,
              key: "entry block",
              dynamicElement: true
            },
            children: [
              {
                type: "text",
                "initialization parameters": {
                  text: "WHO WILL TITHE ? >",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                }
              },
              {
                type: "text",
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  key: "entryText",
                  dynamicElement: true
                }
              },
              {
                type: "cursor"
              }
            ]
          },
          {
            comment: "RESULTS",
            type: "text",
            position: {
              column: 0,
              row: 5
            },
            "initialization parameters": {
              key: "resultsText",
              dynamicElement: true,
            }
          },
          {
            type: "button",
            position: {
              column: 0,
              row: 6
            },
            "initialization parameters": {
              background: {
                onPointerClickObservable: function() {
                  this.userAction("goToCastle");
                },
                onPointerEnterObservable: function() { },
                onPointerOutObservable: function() {  }
              },
              text: {
                text: "[ESC] TO LEAVE",
              },
              key: "exitButton",
              dynamicElement: true
            }
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const listPanel = this.getDynamicElement("party listing");
      listPanel.resetHighlights();
      if (this._parent.healingPhase === 0) {
        /** the reference id of the character paying for the healing. */
        let payerRefId = "";
        if (!isNaN(parseInt(arguments[0]))) {
          payerRefId = WizardryController.characters[arguments[0]];
        } else {
          payerRefId = arguments[0];
        }
        /** the character paying for the healing. */
        const payer = WizardryController.rosterInstance.getCharacterRecord(payerRefId);
        /** the character receiving the healing. */
        const patient = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characterRecord);

        
        const chantingBlock = parent.getDynamicElement("chanting block");
        const entryText = parent.getDynamicElement("entryText");
        const resultsText = parent.getDynamicElement("resultsText");
        const messageBlock = parent.getDynamicElement("message block");

        entryText.text = payer.name;
        /** the last action will attempt to heal and display the results. */
        const action5 = () => {
          this._parent.healingPhase = 2;
          // turn on input BEFORE user action
          this._acceptingInput = true;
          // attempt to heal the character
          this.userAction("attemptToHeal", [patient]);
          switch(patient.status) {
            case WizardryCharacterStatus.OK:
              resultsText.text = [patient.name, " IS WELL"].join("");
              break;
            case WizardryCharacterStatus.ASHES:
              resultsText.text = [patient.name, " NEEDS KADORTO NOW"].join("");
              break;
            case WizardryCharacterStatus.LOST:
              resultsText.text = [patient.name, " WILL BE BURIED"].join("");
              break;
            default:
              console.trace("after attempt", patient.status)
          }
        };
        /** reveal the last chant and move on to the last action. */
        const action4 = () => {
          // reveal the last chant
          chantingBlock.children[3].isVisible = true;
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action5]);
        };
        /** reveal the second to last chant and move on next. */
        const action3 = () => {
          // reveal the second to last chant
          chantingBlock.children[2].isVisible = true;
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action4]);
        };
        /** reveal the second chant and move on next. */
        const action2 = () => {
          // reveal the second chant
          chantingBlock.children[1].isVisible = true;
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action3]);
        };
        /** reveal the first chant and move on next. */
        const action1 = () => {
          // reveal the first chant
          chantingBlock.children[0].isVisible = true;
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action2]);
        };
        /** the action taken. default is to make a healing attempt. */
        let action = () => {
          // pay gold
          payer.gold -= this._parent.donationRequired;
          // switch to the next state and reset the UI
          this._parent.healingPhase = 1;
          this.set();
          WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action1]);
        };
        if (this._donationNeeded > payer.gold) {
          // payer can't afford treatment
          action = () => {
            this._parent.stopAnimation(this._messageBlock);
            messageBlock.text = "** CHEAP APOSTATES! OUT! **";
            this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
            this._acceptingInput = true;
          };
        }
        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
      } else {
        // ignore user entry
      }
    },
    /**
     * Attempts to heal a patient.
     * @param {WizardryCharacter} patient the patient being healed
     */
    attemptToHeal: function(patient) {
      switch (patient.status) {
        case WizardryCharacterStatus.DEAD:
          if (Dice.rollDie(100) - 1 > 50 + 3 * patient.getAttribute(WizardryAttribute.VITALITY)) {
            patient.status = WizardryCharacterStatus.ASHES;
            WizardryController.removeFromParty(patient);
          } else {
            patient.status = WizardryCharacterStatus.OK;
            patient.age += Dice.rollDie(52);
            patient.hpLeft = 1;
          }
          break;
        case WizardryCharacterStatus.ASHES:
          if (Dice.rollDie(100) - 1 > 40 + 3 * patient.getAttribute(WizardryAttribute.VITALITY)) {
            patient.status = WizardryCharacterStatus.LOST;
            WizardryController.removeFromParty(patient);
          } else {
            patient.status = WizardryCharacterStatus.OK;
            patient.age += Dice.rollDie(52);
            patient.hpLeft = patient.hpMax;
          }
          break;
        case WizardryCharacterStatus.PLYZE:
        case WizardryCharacterStatus.STONED:
          patient.status = WizardryCharacterStatus.OK;
          patient.age += Dice.rollDie(52);
          break;
        default:
          throw ["Invalid status", patient.status];
      }
      if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
        WizardryController.rosterInstance.updateRoster();
      }
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    exit: function() {
      if (this._parent.healingPhase === 0 || this._parent.healingPhase === 2) {
        const entryBlock = this.getDynamicElement("entry block");
        const messageBlock = this.getDynamicElement("message block");
        const listPanel = this.getDynamicElement("party listing");
        entryBlock.text = "LEAVE";
  
        const action = () => {
          entryBlock.text = "";
          messageBlock.text = "";
          listPanel.resetHighlights();
          this._acceptingInput = true;
          this._parent.healingPhase = 0;
          this._parent.state = WizardryConstants.CANT_MAIN;
        };
        WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
      }
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "exit" }; },
    ESCAPE: function() { return { isValid: true, action: "goToCastle" }; },
    "1": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [0]
      };
      if (WizardryController.characters.length < 1) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [1]
      };
      if (WizardryController.characters.length < 2) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [2]
      };
      if (WizardryController.characters.length < 3) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [3]
      };
      if (WizardryController.characters.length < 4) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [4]
      };
      if (WizardryController.characters.length < 5) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [5]
      };
      if (WizardryController.characters.length < 6) {
        retObj.isValid = false;
      }
      return retObj;
    }
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.EDGE_TOWN_MAIN] = {
   /** the screen state */
  state: WizardryConstants.EDGE_TOWN_MAIN,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS.concat({
    points: [
      { cell: [0, 19] },
      { cell: [39, 19] }
    ]
  }),
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "EXIT ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          columns: [8 * DIV38, 30 * DIV38]
        },
        children: [
          {
            type: "grid",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              rows: [DIV7, 6 * DIV7]
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  text: "YOU MAY ",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
                }
              },
            ]
          },
          {
            comment: "BUTTON PANEL",
            type: "grid",
            position: {
              column: 1,
              row: 0
            },
            "initialization parameters": {
              rows: [DIV7, DIV7, DIV7, DIV7, 3 * DIV7],
              key: "button panel",
              setDynamicElement: function(parent) {
                const elements = [];
                const mazeButton = parent.getDynamicElement("mazeButton");
                const trainButton = parent.getDynamicElement("trainButton");
                const exitButton = parent.getDynamicElement("exitButton");
                const leaveButton = parent.getDynamicElement("leaveButton");
                this.removeControl(mazeButton);
                this.removeControl(trainButton);
                this.removeControl(exitButton);
                this.removeControl(leaveButton);
                if (WizardryController.characters.length > 0) {
                  elements.push(mazeButton);
                }
                elements.push(trainButton);
                elements.push(exitButton);
                elements.push(leaveButton);

                for (let i = 0, li = elements.length; i < li; i++) {
                  this.addControl(elements[i], i, 0);
                }
              },
              dynamicElement: true
            },
            children: [
              {
                comment: "ENTER THE MAZE",
                type: "stack",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "mazeButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToMaze");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "ENTER THE M)AZE",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ",",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "TRAINING GROUNDS",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "trainButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToTrainingGrounds");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "GO TO THE T)RAINING GROUNDS",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ",",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "CASTLE",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "exitButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("goToCastle");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "RETURN TO THE C)ASTLE",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ",",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "LEAVE GAME",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false,
                  key: "leaveButton",
                  dynamicElement: true
                },
                children: [
                  {
                    type: "text",
                    "initialization parameters": {
                      text: "OR ",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("leaveGame");
                        },
                        onPointerEnterObservable: function() { },
                        onPointerOutObservable: function() {  }
                      },
                      text: {
                        text: "L)EAVE THE GAME",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ".",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    /**
     * Goes to the Add Member state.
     */
    goToMaze: function() {
      const messageBlock = this.getDynamicElement("message block");
      messageBlock.text = "";
      this._acceptingInput = true;
      this._parent.isEnteringMaze = true;
      this._parent.state = WizardryConstants.EDGE_TOWN_MAZE;
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    goToCastle: function() {
      const messageBlock = this.getDynamicElement("message block");
      WizardryController.xgoto = WizardryXgoto.XCASTLE;
      messageBlock.text = "";
      this._acceptingInput = true;
      this._parent.exitScene();
    },
    /**
     * Handler for the action to return to the Market.
     * @type {void}
     */
    goToTrainingGrounds: function() {
      const messageBlock = this.getDynamicElement("message block");
      this.userAction("updateCharacters");
      WizardryController.xgoto = WizardryXgoto.XTRAININ;
      messageBlock.text = "";
      this._acceptingInput = true;
      this._parent.exitScene();
    },
    /**
     * Updates all characters, saving them to the database. Afterwards the party is emptied.
     */
    updateCharacters: function() {
      // iterate through all characters and save the roster.
      for (let i = WizardryController.characters.length - 1; i >= 0; i--) {
        const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characters[i]);
        character.inMaze = false;
      }
      if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
        WizardryController.rosterInstance.updateRoster();
      }
      // reset the party count
      WizardryController.characters.length = 0;
    }
  },
  keyEntries: {
    ENTER: function() { return { isValid: true, action: "goToCastle" }; },
    ESCAPE: function() { return { isValid: true, action: "goToCastle" }; },
    C: function() { return { isValid: true, action: "goToCastle" }; },
    M: function() {
      const retObj = {
        isValid: true,
        action: "goToMaze"
      };
      if (WizardryController.characters.length === 0) {
        retObj.isValid = false;
      }
      return retObj;
    },
    T: function() {
      const retObj = {
        isValid: true,
        action: "goToTrainingGrounds"
      };
      return retObj;
    },
    L: function() {
      const retObj = {
        isValid: true,
        action: "leaveGame"
      };
      return retObj;
    },
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.EDGE_TOWN_MAZE] = {
   /** the screen state */
  state: WizardryConstants.EDGE_TOWN_MAZE,
  /** the borders drawn. */
  border: WizardryUiConfig.BASIC_BORDERS,
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        8 * DIV24, // 3 - party area
        DIV24,     // border
        7 * DIV24, // 5 - options
        DIV24,     // border
        4 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "grid",
        "initialization parameters": {
          columns: [DIV2, DIV2] // two columns
        },
        position: {
          column: 1,
          row: 1
        },
        children: [
          {
            type: "text",
            position: {
              row: 0,
              column: 0
            },
            "initialization parameters": {
              text: " CASTLE",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
            }
          },
          {
            type: "text",
            position: {
              row: 0,
              column: 1
            },
            "initialization parameters": {
              text: "EXIT ",
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
            }
          }
        ]
      },
      {
        comment: "PARTY WINDOW HEADER",
        type: "button",
        position: {
          column: 1,
          row: 2
        },
        "initialization parameters": {
          background: { },
          text: {
            text: "CURRENT PARTY",
            paddingLeft: 4,
            paddingRight: 4
          },
          position: {
            column: 1,
            row: 3
          },
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV8, DIV8, 6 * DIV8]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 1
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 2
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "BANNER",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV7, DIV7, 5 * DIV7],
          key: "dynamic element",
          setDynamicElement: function(parent) {
            if (parent._parent.isEnteringMaze) {
              /** set the action taken */
              const action = () => {
                parent._acceptingInput = true;
                parent._parent.isEnteringMaze = false;
                parent._parent.state = WizardryConstants.EDGE_TOWN_MAIN;
                // TODO - save the game
                WizardryController.mazeData.mazeX = 0;
                WizardryController.mazeData.mazeY = 0;
                WizardryController.mazeData.mazeLev = -1;
                WizardryController.directIo = 0;
                WizardryController.newMaze();
                parent._parent.exitScene();
              };
              WizardryUiConfig.BABYLON_TIMER_ACTION.apply(parent, [action, 1 /* 2000 */]);
            }
          },
          dynamicElement: true
        },
        children: [
          {
            type: "text",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              text: "ENTERING "
            }
          },
          {
            type: "text",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              text: "PROVING GROUNDS OF THE MAD OVERLORD "
            }
          }
        ]
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: { },
  keyEntries: { },
  keyHandler: WizardryUiConfig.BASIC_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.CAMP_MAZE_MAIN] = {
   /** the screen state */
  state: WizardryConstants.CAMP_MAZE_MAIN,
  /** the borders drawn. */
  border: [
    {
      points: [
        { cell: [0, 0] },
        { cell: [39, 0] }
      ]
    },
    {
      points: [
        { cell: [39, 0] },
        { cell: [39, 2] }
      ]
    },
    {
      points: [
        { cell: [39, 2] },
        { cell: [0, 2] }
      ]
    },
    {
      points: [
        { cell: [0, 2] },
        { cell: [0, 0] }
      ]
    },
    {
      points: [
        { cell: [0, 10] },
        { cell: [39, 10] }
      ]
    },
    {
      points: [
        { cell: [0, 14] },
        { cell: [39, 14] }
      ]
    }
  ],
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        DIV24,     // 1 - title
        DIV24,     // border
        7 * DIV24, // 3 - party area
        DIV24,     // border
        3 * DIV24, // 5 - menu
        DIV24,     // border
        9 * DIV24  // 7 - messages
      ]
    },
    children: [
      {
        comment: "TITLE",
        type: "text",
        "initialization parameters": {
          text: "CAMP",
        },
        position: {
          column: 1,
          row: 1
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          rows: [DIV7, 6 * DIV7]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 0
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      },
      {
        comment: "MENU",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          columns: [8 * DIV38, 30 * DIV38]
        },
        children: [
          {
            type: "grid",
            position: {
              column: 0,
              row: 0
            },
            "initialization parameters": {
              rows: [DIV3, 2 * DIV3]
            },
            children: [
              {
                type: "text",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  text: "YOU MAY ",
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
                }
              },
            ]
          },
          {
            comment: "BUTTON PANEL",
            type: "grid",
            position: {
              column: 1,
              row: 0
            },
            "initialization parameters": {
              rows: [DIV3, DIV3, DIV3]
            },
            children: [
              {
                comment: "REORDER/EQUIP/DISBAND",
                type: "stack",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("reorder");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "Select the order in which the players will march through the maze.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "Select the order in which the players will march through the maze.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "R)EORDER",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ", ",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("equip");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "Decide what of each party member's possessions they will wear. Very handy the first time you go into the maze.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "Decide what of each party member's possessions they will wear. Very handy the first time you go into the maze.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "E)QUIP",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ", ",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  },
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("disband");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "Disband the party, leaving characters in the maze waiting until a new party can rescue them.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "Disband the party, leaving characters in the maze waiting until a new party can rescue them.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "D)ISBAND",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ",",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "INSPECT",
                type: "stack",
                position: {
                  column: 0,
                  row: 1
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "Press any valid player # (1-6) or click their row to inspect that player.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "Press any valid player # (1-6) or click their row to inspect that player.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "#) TO INSPECT",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ", OR",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              },
              {
                comment: "LEAVE",
                type: "stack",
                position: {
                  column: 0,
                  row: 2
                },
                "initialization parameters": {
                  horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                  isVertical: false
                },
                children: [
                  {
                    type: "button",
                    "initialization parameters": {
                      background: {
                        onPointerClickObservable: function() {
                          this.userAction("leave");
                        },
                        onPointerEnterObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // stop the fade animation and restore the alpha on the message block
                          messageBlock.alpha = 1;
                          this._parent.stopAnimation(messageBlock);
                          messageBlock.text = "Break camp and go into the maze.";
                        },
                        onPointerOutObservable: function() {
                          const messageBlock = this.getDynamicElement("message block");
                          // clear the tooltip if it matches the selected tooltip text
                          if (messageBlock.text === "Break camp and go into the maze.") {
                            messageBlock.text = "";
                          }
                        }
                      },
                      text: {
                        text: "L)EAVE THE CAMP",
                      }
                    }
                  },
                  {
                    type: "text",
                    "initialization parameters": {
                      text: ".",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 7
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      if (!isNaN(parseInt(arguments[0]))) {
        WizardryController.characterRecord = WizardryController.characters[arguments[0]];
      } else {
        WizardryController.characterRecord = arguments[0];
      }
      const action = () => {
        messageBlock.text = "";
        partyPanel.resetHighlights();
        this._acceptingInput = true;
        WizardryController.xgoto = WizardryXgoto.XINSPCT3;
        WizardryController.xgoto2 = WizardryXgoto.XINSPCT2;
        this._parent.exitScene();
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    },
    leave: function() {
      for (let i = WizardryController.characters.length - 1; i >= 0; i--) {
        WizardryController.rosterInstance.getCharacterRecord(WizardryController.characters[i]).computeFullStats(false);
      }
      this._acceptingInput = true;
      WizardryController.xgoto = WizardryXgoto.XRUNNER;
      this._parent.exitScene();
    }
  },
  keyEntries: {
    "1": function() {
      const index = 0;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const index = 1;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const index = 2;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const index = 3;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const index = 4;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const index = 5;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    R: function() {
      const retObj = {
        isValid: true,
        action: "reorder"
      };
      return retObj;
    },
    E: function() {
      const retObj = {
        isValid: true,
        action: "equip"
      };
      return retObj;
    },
    D: function() {
      const retObj = {
        isValid: true,
        action: "disband"
      };
      return retObj;
    },
    L: function() {
      const retObj = {
        isValid: true,
        action: "leave"
      };
      return retObj;
    },
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}
WizardryUiConfig[WizardryConstants.MAZE_RUNNER_MAIN] = {
   /** the screen state */
  state: WizardryConstants.MAZE_RUNNER_MAIN,
  /** the borders drawn. */
  border: [
    {
      points: [
        { cell: [0, 0] },
        { cell: [39, 0] }
      ]
    },
    {
      points: [
        { cell: [0, 0] },
        { cell: [0, 23] }
      ]
    },
    {
      points: [
        { cell: [39, 0] },
        { cell: [39, 23] }
      ]
    },
    {
      points: [
        { cell: [0, 23] },
        { cell: [39, 23] }
      ]
    },
    {
      points: [
        { cell: [12, 0] },
        { cell: [12, 10] }
      ]
    },
    {
      points: [
        { cell: [12, 5] },
        { cell: [39, 5] }
      ]
    },
    {
      points: [
        { cell: [0, 10] },
        { cell: [39, 10] }
      ]
    },
    {
      points: [
        { cell: [0, 15] },
        { cell: [39, 15] }
      ]
    },
  ],
  /** the UI layout */
  layout: {
    configuration: {
      columns: [
        DIV40,      // left border
        38 * DIV40, // main area
        DIV40       // right border
      ],
      rows: [
        DIV24,     // border
        9 * DIV24, // 1 - commands/spells
        DIV24,     // border
        4 * DIV24, // 3 - messages
        DIV24,     // border
        7 * DIV24, // 5 - party
        DIV24,     // border
      ]
    },
    children: [
      {
        comment: "TOP/MAZE",
        type: "grid",
        position: {
          column: 1,
          row: 1
        },
        "initialization parameters": {
          columns: [11 * DIV38, DIV38, 26 * DIV38]
        },
        children: [
          {
            comment: "COMMANDS/SPELLS",
            type: "grid",
            position: {
              column: 2,
              row: 0
            },
            "initialization parameters": {
              rows: [4 * DIV9, DIV9, 4 * DIV9]
            },
            children: [
              {
                comment: "COMMANDS",
                type: "grid",
                position: {
                  column: 0,
                  row: 0
                },
                "initialization parameters": {
                  columns: [DIV3, DIV3, DIV3]
                },
                children: [
                  {
                    comment: "LEFT COLUMN",
                    type: "grid",
                    position: {
                      column: 0,
                      row: 0
                    },
                    "initialization parameters": {
                      rows: [DIV4, DIV4, DIV4, DIV4]
                    },
                    children: [
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 0
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("forward");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "F)ORWARD",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 1
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("left");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "L)EFT",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 2
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("right");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "R)IGHT",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 3
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("kick");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "K)ICK",
                          }
                        }
                      },
                    ]
                  },
                  {
                    comment: "MIDDLE COLUMN",
                    type: "grid",
                    position: {
                      column: 1,
                      row: 0
                    },
                    "initialization parameters": {
                      rows: [DIV4, DIV4, DIV4, DIV4]
                    },
                    children: [
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 0
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("camp");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "C)AMP",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 1
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("quick");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "Q)UICK",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 2
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("time");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "T)IME",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 3
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("inspect");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "I)NSPECT",
                          }
                        }
                      },
                    ]
                  },
                  {
                    comment: "RIGHT COLUMN",
                    type: "grid",
                    position: {
                      column: 2,
                      row: 0
                    },
                    "initialization parameters": {
                      rows: [DIV4, DIV4, DIV4, DIV4]
                    },
                    children: [
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 0
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerClickObservable: function() {
                              this.userAction("status");
                            },
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "S)TATUS",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 1
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "A<-W->D",
                          }
                        }
                      },
                      {
                        type: "button",
                        position: {
                          column: 0,
                          row: 2
                        },
                        "initialization parameters": {
                          background: {
                            horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                            onPointerEnterObservable: function() { },
                            onPointerOutObservable: function() { }
                          },
                          text: {
                            text: "CLUSTER",
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              {
                comment: "SPELLS",
                type: "grid",
                position: {
                  column: 0,
                  row: 2
                },
                "initialization parameters": {
                  columns: [8 * DIV26, 18 * DIV26],
                  rows: [DIV4, DIV4, DIV4, DIV4]
                },
                children: [
                  {
                    type: "text",
                    position: {
                      column: 0,
                      row: 1
                    },
                    "initialization parameters": {
                      text: "SPELLS:",
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                    }
                  },
                  {
                    type: "text",
                    position: {
                      column: 1,
                      row: 1
                    },
                    "initialization parameters": {
                      horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                      key: "active spells",
                      dynamicElement: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        comment: "MESSAGE BLOCK",
        type: "text",
        position: {
          column: 1,
          row: 3
        },
        "initialization parameters": {
          key: "message block",
          lineSpacing: "3px",
          textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
          resizeToFit: false,
          textWrapping: true,
          animations: [FADE],
          dynamicElement: true
        }
      },
      {
        comment: "PARTY WINDOW",
        type: "grid",
        position: {
          column: 1,
          row: 5
        },
        "initialization parameters": {
          rows: [DIV7, 6 * DIV7]
        },
        children: [
          Object.assign({
            comment: "PARTY WINDOW HEADER",
            position: {
              column: 0,
              row: 0
            }
          }, WizardryUiConfig.PARTY_WINDOW_HEADER),
          {
            comment: "PARTY WINDOW LISTING",
            type: "dynamic listing",
            position: {
              column: 0,
              row: 1
            },
            "initialization parameters": {
              key: "party listing",
              maxItems: 6,
              callback: "activateCharacter",
              createItem: WizardryUiConfig.PARTY_WINDOW_ITEM_FACTORY,
              getList: () => { return WizardryController.characters; },
              setList: WizardryUiConfig.SET_PARTY_WINDOW_DISPLAY
            }
          }
        ]
      }
    ]
  },
  /**
   * this dictionary of user actions available.
   */
  actions: {
    activateCharacter: function() {
      const messageBlock = this.getDynamicElement("message block");
      const partyPanel = this.getDynamicElement("party listing");
      if (!isNaN(parseInt(arguments[0]))) {
        WizardryController.characterRecord = WizardryController.characters[arguments[0]];
      } else {
        WizardryController.characterRecord = arguments[0];
      }
      const action = () => {
        messageBlock.text = "";
        partyPanel.resetHighlights();
        this._acceptingInput = true;
        WizardryController.xgoto = WizardryXgoto.XINSPCT3;
        WizardryController.xgoto2 = WizardryXgoto.XINSPCT2;
        this._parent.exitScene();
      };
      WizardryUiConfig.BABYLON_TIMER_ACTION.apply(this, [action]);
    },
    leave: function() {
      for (let i = WizardryController.characters.length - 1; i >= 0; i--) {
        WizardryController.rosterInstance.getCharacterRecord(WizardryController.characters[i]).computeFullStats(false);
      }
      this._acceptingInput = true;
      WizardryController.xgoto = WizardryXgoto.XRUNNER;
      this._parent.exitScene();
    }
  },
  keyEntries: {
    "1": function() {
      const index = 0;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "2": function() {
      const index = 1;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "3": function() {
      const index = 2;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "4": function() {
      const index = 3;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "5": function() {
      const index = 4;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    "6": function() {
      const index = 5;
      const retObj = {
        isValid: true,
        action: "activateCharacter",
        arguments: [index]
      };
      if (WizardryController.characters.length <= index) {
        retObj.isValid = false;
      }
      return retObj;
    },
    R: function() {
      const retObj = {
        isValid: true,
        action: "reorder"
      };
      return retObj;
    },
    E: function() {
      const retObj = {
        isValid: true,
        action: "equip"
      };
      return retObj;
    },
    D: function() {
      const retObj = {
        isValid: true,
        action: "disband"
      };
      return retObj;
    },
    L: function() {
      const retObj = {
        isValid: true,
        action: "leave"
      };
      return retObj;
    },
  },
  keyHandler: WizardryUiConfig.MESSAGED_KEY_HANDLER,
}

export { WizardryUiConfig };