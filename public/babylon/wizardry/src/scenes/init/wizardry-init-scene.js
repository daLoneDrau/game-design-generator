import { createUniversalCamera } from "../../components/camera.js";
import * as Materials from "../../components/materials/materials.js";
import { createScreenOutline } from "../../components/ui/screenoutline.js";
import { WizardryCharacterClass, WizardryXgoto } from "../../config/wizardry-constants.js";
import { WizardryController } from "../../services/wizardry-controller.js";
import { WizardryDataManager } from "../../services/wizardry-data-manager.js";
import { Dice } from "../../../../assets/js/base.js";

const HEADERS = ["#", "CHARACTER NAME",  "CLASS", "AC", "HITS", "STATUS"];
/**
 * @class Specials scene.
 * @param {BABYLON.Engine} engine the engine running the scene
 */
class WizardryInitScene extends BABYLON.Scene {
  constructor(engine) {
    super(engine);
    /**
     * flag indicating when loading has completed.
     * @private
     * @type {Number}
     */
    this._loadingFlags = 0;
    this._startLoading = false;
    this._uiCreated = false;
    // set background color to skyblue
    this.clearColor = Materials.darkColor;
    
    createUniversalCamera(this);
    /** @private all text blocks created on the page. */
    this._textBlocks = [];

    // create the UI texture
    this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "UI", // name for the texture
      true, // boolean indicating if the texture must be rendered in foreground (default is true)
      this // the hosting scene
    );

    const addFontInPage = ()=>{
      const fontElement         =   document.createElement('style');
      fontElement.innerHTML     =   `
          @font-face {
              font-family: 'C64ProMono';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(http://localhost:3333/phaser/assets/font/giana.woff) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }`;
      document.head.appendChild(fontElement);
    };
    addFontInPage();
    this.detachControl();
  }
  /**
   * Initializes the UI.
   */
  initUi() {
    // create the screen outline
    createScreenOutline(this.getEngine().getRenderingCanvas(), this._advancedTexture, {
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: [
        {
          points: [
            { cell: [0, 0] },
            { cell: [39, 0] }
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
            { cell: [39, 23] },
            { cell: [0, 23] }
          ]
        },
        {
          points: [
            { cell: [0, 23] },
            { cell: [0, 0] }
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
            { cell: [0, 10] },
            { cell: [39, 10] }
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
            { cell: [0, 15] },
            { cell: [39, 15] }
          ]
        }
      ]
    });
    // create a grid for positioning UI widgets 40 cols X 24 rows
    let outerGrid = new BABYLON.GUI.Grid();
    this._advancedTexture.addControl(outerGrid);
    { // divide the outer grid
      // 1 main columns with borders
      outerGrid.addColumnDefinition(0.025);
      outerGrid.addColumnDefinition(0.95);
      outerGrid.addColumnDefinition(0.025);
      // 3 main rows
      outerGrid.addRowDefinition(0.04167);
      outerGrid.addRowDefinition(0.375);
      outerGrid.addRowDefinition(0.04167);
      outerGrid.addRowDefinition(0.1667);
      outerGrid.addRowDefinition(0.04167);
      outerGrid.addRowDefinition(0.2917);
      outerGrid.addRowDefinition(0.04167);
    }
    // subdivide the grid further
    let subGrid1 = new BABYLON.GUI.Grid();
    outerGrid.addControl(subGrid1, 1, 1); // row, column
    { // subdivide the grid
      subGrid1.addColumnDefinition(11 / 38);
      subGrid1.addColumnDefinition(1 / 38);
      subGrid1.addColumnDefinition(26 / 38);
      // color the grid section
      let rect1_1 = new BABYLON.GUI.Rectangle();
      rect1_1.thickness = 0;
      rect1_1.background = ["rgb(", Dice.rollDie(255), ", ", Dice.rollDie(255), ", ", Dice.rollDie(255), ")" ].join("");
      subGrid1.addControl(rect1_1, 0, 0); // row, column
    }
    // subdivide the grid further
    let subGrid1_1 = new BABYLON.GUI.Grid();
    subGrid1.addControl(subGrid1_1, 1, 2); // row, column
    { // subdivide the grid
      subGrid1_1.addRowDefinition(4 / 9);
      subGrid1_1.addRowDefinition(1 / 9);
      subGrid1_1.addRowDefinition(4 / 9);
      // color the grid
      let rect1_2_1 = new BABYLON.GUI.Rectangle();
      rect1_2_1.thickness = 0;
      rect1_2_1.background = ["rgb(", Dice.rollDie(255), ", ", Dice.rollDie(255), ", ", Dice.rollDie(255), ")" ].join("");
      subGrid1_1.addControl(rect1_2_1, 0, 0); // row, column

      let rect1_2_2 = new BABYLON.GUI.Rectangle();
      rect1_2_2.thickness = 0;
      rect1_2_2.background = ["rgb(", Dice.rollDie(255), ", ", Dice.rollDie(255), ", ", Dice.rollDie(255), ")" ].join("");
      subGrid1_1.addControl(rect1_2_2, 2, 0); // row, column
    }
    // subdivide the grid further
    let subGrid2 = new BABYLON.GUI.Grid();
    outerGrid.addControl(subGrid2, 5, 1); // row, column
    { // subdivide the grid
      subGrid2.addColumnDefinition(1 / 38);
      subGrid2.addColumnDefinition(1 / 38);
      subGrid2.addColumnDefinition(15 / 38);
      subGrid2.addColumnDefinition(1 / 38);
      subGrid2.addColumnDefinition(5 / 38);
      subGrid2.addColumnDefinition(1 / 38);
      subGrid2.addColumnDefinition(2 / 38);
      subGrid2.addColumnDefinition(1 / 38);
      subGrid2.addColumnDefinition(4 / 38);
      subGrid2.addColumnDefinition(1 / 38);
      subGrid2.addColumnDefinition(6 / 38);
      
      subGrid2.addRowDefinition(1 / 7);
      subGrid2.addRowDefinition(1 / 7);
      subGrid2.addRowDefinition(1 / 7);
      subGrid2.addRowDefinition(1 / 7);
      subGrid2.addRowDefinition(1 / 7);
      subGrid2.addRowDefinition(1 / 7);
      subGrid2.addRowDefinition(1 / 7);
      
      // add headers to the grid
      for (let i = 0, li = HEADERS.length; i < li; i++) {
        let text = new BABYLON.GUI.TextBlock();
        text.text = HEADERS[i];
        text.color = Materials.lightRGB;
        subGrid2.addControl(text, 0, i * 2); // row, column
        this._textBlocks.push(text);
      }
    }
    // color the 2nd section
    let rect2 = new BABYLON.GUI.Rectangle();
    rect2.thickness = 0;
    rect2.background = ["rgb(", Dice.rollDie(255), ", ", Dice.rollDie(255), ", ", Dice.rollDie(255), ")" ].join("");
    outerGrid.addControl(rect2, 3, 1); // row, column

    document.fonts.load('16px C64ProMono').then(() => {  // start loading font
      document.fonts.ready.then(() => {
        for (let i = this._textBlocks.length - 1; i >= 0; i--) {
          this._textBlocks[i].fontFamily = "C64ProMono";
        }
      });
    });

    this._uiCreated = true;
  }
  /**
   * Render the scene.
   * @param {boolean} updateCameras defines a boolean indicating if cameras must update according to their inputs (true by default)
   * @param {boolean} ignoreAnimations defines a boolean indicating if animations should not be executed (false by default)
   */
  render(updateCameras, ignoreAnimations) {
    if (!this._uiCreated) {
      this.initUi();
      this._uiCreated = true;
    }
    if (WizardryController.llbase04 === -1 && !this._startLoading) {
      const that = this;
      this._startLoading = true;
      // TODO - load scenario data
      WizardryDataManager.loadCharacters(function() {
        console.log("loaded roster",arguments[0][0]);
        WizardryController.initializeCharacterRoster(arguments[0][0]);
        that._loadingFlags++;
      });
      WizardryDataManager.loadEquipment(function() {
        WizardryController.initializeEquipmentList(arguments[0][0]);
        // TODO - load save data and initialize boltac's from that
        WizardryController.initializeBoltacsInventory();
        that._loadingFlags += 2;
      });
      WizardryDataManager.loadMaps(function() {
        WizardryController.initializeMapLevels(arguments[0][0]);
        that._loadingFlags += 4;
      });

    }
    if (this._loadingFlags === 7) {
      // loading completed. start the game
      WizardryController.timeDelay = 2000;
      WizardryController.xgoto = WizardryXgoto.XCASTLE;
      WizardryController.mazeData.mazeX = 0;
      WizardryController.mazeData.mazeY = 0;
      WizardryController.mazeData.mazeLev = 0;
      WizardryController.directIo = 0;
      WizardryController.acMod2 = 0;
    }
    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryInitScene };