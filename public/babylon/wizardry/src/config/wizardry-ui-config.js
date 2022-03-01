import { DIV2,
  DIV24,
  DIV38,
  DIV40,
  DIV8,
  WizardryConstants,
  WizardryCharacterStatus }   from "./wizardry-constants.js";
import { WizardryCharacter }  from "../bus/wizardry-character.js";
import * as Materials         from "../components/materials/materials.js";
import { WizardryScene }      from "../scenes/wizardry-scene.js";
import { WizardryController } from "../services/wizardry-controller.js";
import { Dice } from "../../../assets/js/base.js";

/**
 * Wizardry UI.
 */
const WizardryUiConfig = {
   /**
    * The basic screen borders.
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
    },
    {
      points: [
        { cell: [0, 19] },
        { cell: [39, 19] }
      ]
    }
  ],
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
        callback(rectangle.name);
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
        type: "textBlock",
        position: {
          column: 1,
          row: 0
        },
        "initialization parameters": {
          text: "#"
        }
      },
      {
        type: "textBlock",
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
        type: "textBlock",
        position: {
          column: 5,
          row: 0
        },
        "initialization parameters": {
          text: "CLASS"
        }
      },
      {
        type: "textBlock",
        position: {
          column: 7,
          row: 0
        },
        "initialization parameters": {
          text: "AC"
        }
      },
      {
        type: "textBlock",
        position: {
          column: 9,
          row: 0
        },
        "initialization parameters": {
          text: "HITS"
        }
      },
      {
        type: "textBlock",
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
   * 
   * @param {string[]} displayItems 
   * @param {BABYLON.GUI.Rectangle[]} displayElements 
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
        rectangle.name = charRefIds[i];
        rectangle.isVisible = true;
      }
    }
  }
}
WizardryUiConfig[WizardryConstants.MARKET_MAIN] = {
   /** the screen state */
  state: WizardryConstants.MARKET_MAIN,
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
        DIV24, // border
        DIV24, // 1 - title
        DIV24, // border
        8 * DIV24, // 3 - party area
        DIV24, // border
        7 * DIV24, // 5 - options
        DIV24, // border
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
            type: "textBlock",
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
            type: "textBlock",
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
    ]
  }
}

export { WizardryUiConfig };