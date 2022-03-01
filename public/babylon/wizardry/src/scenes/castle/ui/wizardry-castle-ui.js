import { WizardryScene }           from "../../wizardry-scene.js";
import { FADE,
  WizardryUiConfiguration }        from "../../wizardry-ui-configuration.js";
import { WizardryUiStateScene }    from "../../wizardry-ui-state-scene.js";
import * as Materials              from "../../../components/materials/materials.js";
import { WizardryPartyPanel}       from "../../../components/ui/wizardry-party-panel.js";
import { WizardryCharacterStatus } from "../../../config/wizardry-constants.js";
import { WizardryController }      from "../../../services/wizardry-controller.js";

/**
 * @class Base Ui class for all Castle scenes.
 */
class WizardryCastleUi extends WizardryUiConfiguration {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the callback function to process after displaying the user entry prompt. */
    this._entryCallback = null;
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageBlock = null;
    /** @private a flag indicating whether the party member listing should be clickable */
    this._isPartyClickable = false;
    /**
     * the panel displaying party members.
     * @private
     * @type {WizardryPartyPanel}
     */
    this._partyPanel;
    /** @private the basic screen frame. */
    this._screenLines = [
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
    ];
    /** @private the BABYLON.GUI.TextBlock used to display the subtitle. */
    this._subTitleTextBlock = null;
  }
  /**
   * Creates the grid for displaying party members.
   */
  createClickablePartyGrid() {
    // the top level container - a 1 x 3 grid
    let topLevelContainer = WizardryScene.createGrid({
      rows: [1 / 8, 1 / 8, 6 / 8]
    });
    this._configuration.addControl(topLevelContainer, 3, 1);
    { // header
      // header take up 1 row
      let headerGrid = WizardryScene.createGrid({
        columns: [
          1 / 38, // empty
          1 / 38, // order #
          1 / 38, // empty
          15 / 38, // name
          1 / 38, // empty
          5 / 38, // class
          1 / 38, // empty
          2 / 38, // ac
          1 / 38, // empty
          4 / 38, // hits
          1 / 38, // empty
          6 / 38 // status
        ]
      });
      topLevelContainer.addControl(headerGrid, 1, 0);

      // add party headers
      for (let i = 0, li = this._partyBlockHeaders.length; i < li; i++) {
        headerGrid.addControl(this._parent.createTextBlock({ text: this._partyBlockHeaders[i] }),
        0, i * 2 + 1); // row, column
      }
    }
    { // individual party members
      // party take up 6 row
      let partyGrid = WizardryScene.createGrid({
        rows: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]
      });
      topLevelContainer.addControl(partyGrid, 2, 0);

      for (let j = 0; j < 6; j++) {
        const index = j;
        const rectangle = new BABYLON.GUI.Rectangle(WizardryScene.randomKey());    
        rectangle.thickness = 0;
        rectangle.background = Materials.darkRGB;
        rectangle.adaptWidthToChildren = false;
        rectangle.isPointerBlocker = true;
        rectangle.hoverCursor = "pointer";
        rectangle.onPointerClickObservable.add((eventData, eventState) => {
          this.activateCharacter(index);
        });
        rectangle.onPointerEnterObservable.add((eventData, eventState) => {
          rectangle.background = Materials.lightRGB;
          const children = rectangle.children[0].children;
          for (let i = children.length - 1; i >= 0; i--) {
            children[i].color = Materials.darkRGB;
          }
        });
        rectangle.onPointerOutObservable.add((eventData, eventState) => {
          rectangle.background = Materials.darkRGB;
          const children = rectangle.children[0].children;
          for (let i = children.length - 1; i >= 0; i--) {
            children[i].color = Materials.lightRGB;
          }
        });
        partyGrid.addControl(rectangle, j, 0);
        
        let rowGrid = WizardryScene.createGrid({
          columns: [
            1 / 38, // empty
            1 / 38, // order #
            1 / 38, // empty
            15 / 38, // name
            1 / 38, // empty
            5 / 38, // class
            1 / 38, // empty
            2 / 38, // ac
            1 / 38, // empty
            4 / 38, // hits
            1 / 38, // empty
            6 / 38 // status
          ]
        });
        rectangle.addControl(rowGrid);

        let o = {
          rectangle: rectangle,
          order: this._parent.createTextBlock({ }),
          name: this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }),
          clazz: this._parent.createTextBlock(),
          ac: this._parent.createTextBlock(),
          hits: this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT }),
          status: this._parent.createTextBlock()
        };        
        this._partyTextBlocks.push(o);

        rowGrid.addControl(o.order,  0, 1); // row, column
        rowGrid.addControl(o.name,   0, 3); // row, column
        rowGrid.addControl(o.clazz,  0, 5); // row, column
        rowGrid.addControl(o.ac,     0, 7); // row, column
        rowGrid.addControl(o.hits,   0, 9); // row, column
        rowGrid.addControl(o.status, 0, 11); // row, column
      }
    }
  }
  createPartyGrid() {
    if (this._isPartyClickable) {
      this._partyPanel = new WizardryPartyPanel({
        parent: this,
        isInteractive: true,
        callback: this.activateCharacter
      });
      // this.createClickablePartyGrid();
    } else {
      this._partyPanel = new WizardryPartyPanel({
        parent: this
      });
      // this.createStandardPartyGrid();
    }
    this._configuration.addControl(this._partyPanel.container, 3, 1);
  }  
  /**
   * Creates the grid for displaying party members.
   */
  createStandardPartyGrid() {
    let partyDisplayGrid = WizardryScene.createGrid({
      columns: [
        1 / 38, // empty
        1 / 38, // order #
        1 / 38, // empty
        15 / 38, // name
        1 / 38, // empty
        5 / 38, // class
        1 / 38, // empty
        2 / 38, // ac
        1 / 38, // empty
        4 / 38, // hits
        1 / 38, // empty
        6 / 38 // status
      ],
      rows: [1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8, 1 / 8]
    });
    this._configuration.addControl(partyDisplayGrid, 3, 1);
    // add party headers
    for (let i = 0, li = this._partyBlockHeaders.length; i < li; i++) {
      partyDisplayGrid.addControl(this._parent.createTextBlock({ text: this._partyBlockHeaders[i] }), 1, i * 2 + 1); // row, column
    }
    // create party text blocks
    for (let j = 1, lj = 6; j <= lj; j++) {
      let o = {};
      o.order = this._parent.createTextBlock({ });
      o.name = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
      o.clazz = this._parent.createTextBlock();
      o.ac = this._parent.createTextBlock();
      o.hits = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT });
      o.status = this._parent.createTextBlock();
      this._partyTextBlocks.push(o);
      partyDisplayGrid.addControl(o.order,  j + 1, 1); // row, column
      partyDisplayGrid.addControl(o.name,   j + 1, 3); // row, column
      partyDisplayGrid.addControl(o.clazz,  j + 1, 5); // row, column
      partyDisplayGrid.addControl(o.ac,     j + 1, 7); // row, column
      partyDisplayGrid.addControl(o.hits,   j + 1, 9); // row, column
      partyDisplayGrid.addControl(o.status, j + 1, 11); // row, column
    }
  }
  /**
   * Displays the clickable adventuring party view.
   */
  displayClickableParty() {
    const charRefIds = WizardryController.characters;
    for (let i = this._partyTextBlocks.length - 1; i >= 0; i--) {
      const refBlock = this._partyTextBlocks[i];
      refBlock.order.text = "";
      refBlock.name.text = "";
      refBlock.clazz.text = "";
      refBlock.ac.text = "";
      refBlock.hits.text = "";
      refBlock.status.text = "";
      refBlock.rectangle.isVisible = false;
    }
    for (let i = 0, li = charRefIds.length; i < li; i++) {
      const character = WizardryController.rosterInstance.getCharacterRecord(charRefIds[i]);
      const refBlock = this._partyTextBlocks[i];
      refBlock.order.text = (i + 1).toString();
      refBlock.name.text = character.name;
      refBlock.clazz.text = [character.alignment.title.substring(0, 1), "-", character.clazz.title.substring(0, 3)].join("");
      refBlock.ac.text = character.armorCl > -10 ? character.armorCl.toString() : "LO";
      refBlock.hits.text = character.hpLeft.toString();
      if (character.status === WizardryCharacterStatus.OK) {
        if (character.lostXyl.poisonAmt[0] !== 0) {
          refBlock.status.text = "POISON";
        } else {
          refBlock.status.text = character.hpMax.toString();
        }
      } else {
        refBlock.status.text = character.status.title;
      }
      refBlock.rectangle.isVisible = true;
    }
  }
  /**
   * Displays the adventuring party.
   */
  displayParty() {
    if (this._isPartyClickable) {
      this.displayClickableParty();
    } else {
      this.displayStandardParty();
    }
  }
  /**
   * Displays the standard adventuring party view.
   */
  displayStandardParty() {
    const charRefIds = WizardryController.characters;
    for (let i = this._partyTextBlocks.length - 1; i >= 0; i--) {
      const refBlock = this._partyTextBlocks[i];
      refBlock.order.text = "";
      refBlock.name.text = "";
      refBlock.clazz.text = "";
      refBlock.ac.text = "";
      refBlock.hits.text = "";
      refBlock.status.text = "";
    }
    for (let i = 0, li = charRefIds.length; i < li; i++) {
      const character = WizardryController.rosterInstance.getCharacterRecord(charRefIds[i]);
      let refBlock = this._partyTextBlocks[i];
      refBlock.order.text = (i + 1).toString();
      refBlock.name.text = character.name;
      refBlock.clazz.text = [character.alignment.title.substring(0, 1), "-", character.clazz.title.substring(0, 3)].join("");
      refBlock.ac.text = character.armorCl > -10 ? character.armorCl.toString() : "LO";
      refBlock.hits.text = character.hpLeft.toString();
      if (character.status === WizardryCharacterStatus.OK) {
        if (character.lostXyl.poisonAmt[0] !== 0) {
          refBlock.status.text = "POISON";
        } else {
          refBlock.status.text = character.hpMax.toString();
        }
      } else {
        refBlock.status.text = character.status.title;
      }
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    this._configuration = WizardryScene.createGrid({
      columns: [
        1 / 40, // left border
        38 / 40, // main area
        1 / 40 // right border
      ],
      rows: [
        1 / 24, // border
        1 / 24, // title
        1 / 24, // border
        8 / 24, // party area
        1 / 24, // border
        7 / 24, // options
        1 / 24, // border
        4 / 24 // empty
      ]
    });
    { // add the title and subtitle
      let titleGrid = WizardryScene.createGrid({
        columns: [
          1 / 2, // column
          1 / 2 // column
        ],
        rows: []
      });
      this._configuration.addControl(titleGrid, 1, 1);
      { // create the title text
        let text = this._parent.createTextBlock({
          key: "TITLE",
          text: " CASTLE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });
        titleGrid.addControl(text, 0, 0); // row, column
      }
      { // create the subtitle text
        this._subTitleTextBlock = this._parent.createTextBlock({
          key: "SUBTITLE",
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
        titleGrid.addControl(this._subTitleTextBlock, 0, 1); // row, column
      }
    }
    { // add current party header
      this._configuration.addControl(this._parent.createButton({
        background: { },
        text: {
          text: "CURRENT PARTY",
          paddingLeft: 4,
          paddingRight: 4
        }
      }).container, 2, 1);
    }
    { // add party display
      this.createPartyGrid();
    }
    { // message block
      this._messageBlock = this._parent.createTextBlock({
        lineSpacing: "3px",
        textHorizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
        textVerticalAlignment: BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
        resizeToFit: false,
        textWrapping: true,
      });
      if (typeof(this._messageBlock.animations) === "undefined") {
        this._messageBlock.animations = [];
      }
      this._messageBlock.animations.push(FADE);
      this._configuration.addControl(this._messageBlock, 8, 1);
    }

    return this._configuration;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    this._parent.resetButtons();
    this._partyPanel.set();
  }
}

export { WizardryCastleUi };