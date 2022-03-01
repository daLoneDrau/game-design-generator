import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { WizardryScene }        from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryCharacterStatus, WizardryConstants, WizardryXgoto } from "../../../../config/wizardry-constants.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/** the menu options. */
const OPTIONS = [
  {
    text: "THE A)DVENTURER'S INN,",
    action: function() { this.goToAdventurersInn(); },
    tooltip: "The Adventurer's Inn is a place where any weary adventurer can get a place to rest and recover from their exertions, and all for a modest charge."
  },
  {
    text: "G)ILGAMESH' TAVERN,",
    action: function() { this.goToGilgameshTavern(); },
    tooltip: "The first stop at the beginning of a session is always Gilgamesh' Tavern, where you can assemble a party."
  },
  {
    text: "B)OLTAC'S TRADING POST,",
    action: function() { this.goToBoltacsTradingPost(); },
    tooltip: "The commercial center of the Castle is owned by a friendly dwarf named Boltac."
  },
  {
    text: "THE TEMPLE OF C)ANT,",
    action: function() { this.goToTempleOfCant(); },
    tooltip: "Whenever a party brings back characters who are dead, paralyzed, or otherwise unfit, they are removed from the party by the castle guards and taken to the Temple of Cant."
  },
  {
    text: "OR THE E)DGE OF TOWN.",
    action: function() { this.goToEdgeOfTown(); },
    tooltip: "To go anywhere else you have to go to the Edge of Town."
  }
];
/**
 * @class Ui class for the Main state of the Training scene.
 */
class WizardryMarketMainUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
  }
  /**
   * Goes to the Adventurer's Inn.
   */
  goToAdventurersInn() {
    if (WizardryController.partyCnt === 0) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "No need to visit the Inn if there are no adventurers in the party.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      WizardryController.xgoto = WizardryXgoto.XADVNTINN;
      WizardryController.xgoto2 = WizardryXgoto.XADVNTINN;
      this._parent.exitScene();
    }
  }
  /**
   * Goes to Boltac's Trading Post.
   */
  goToBoltacsTradingPost() {
    if (WizardryController.partyCnt === 0) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "There's no one in the party to buy or sell at the Trading Post.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      WizardryController.xgoto = WizardryXgoto.XBOLTAC;
      WizardryController.xgoto2 = WizardryXgoto.XBOLTAC;
      this._parent.exitScene();
    }
  }
  /**
   * Goes to the Edge of Town.
   */
  goToEdgeOfTown() {
    WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
    this._parent.exitScene();
  }
  /**
   * Goes to Gilgamesh' Tavern.
   */
  goToGilgameshTavern() {
    WizardryController.xgoto = WizardryXgoto.XGILGAMS;
    this._parent.exitScene();
  }
  /**
   * Goes to the Adventurer's Inn.
   */
  goToTempleOfCant() {
    if (WizardryController.partyCnt === 0) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Why the Temple? The party has no adventurers to restore.";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    } else {
      WizardryController.xgoto = WizardryXgoto.XCANT;
      WizardryController.xgoto2 = WizardryXgoto.XBOLTAC;
      this._parent.exitScene();
    }
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let stopProcessing = true;
    switch (key.toUpperCase()) {
      case "A":
        this.goToAdventurersInn();
        break;
      case "G":
        this.goToGilgameshTavern();
        break;
      case "B":
        this.goToBoltacsTradingPost();
        break;
      case "C":
        this.goToTempleOfCant();
        break;
      case "E":
        this.goToEdgeOfTown();
        break;
      default:
        stopProcessing = false;
        break;
    }
    if (!stopProcessing) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "Huh?";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
    }
  }
  /**
   * Initalizes the view.
   */
  init() {
    super.init();
    this._parent.createScreenOutline({
      name: [WizardryConstants.MARKET_MAIN, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: this._screenLines
    });


    
    let optionsGrid = WizardryScene.createGrid({
      //rows: [1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7, 1 / 7]
      rows: [1 / 7, 6/7]
    });
    this._configuration.addControl(optionsGrid, 5, 1);
    { // add the intro
      let introGrid = WizardryScene.createGrid({
        columns: [13 / 38, 25 / 38],
        rows: []
      });
      optionsGrid.addControl(introGrid, 0, 0);
      introGrid.addControl(this._parent.createTextBlock({
        text: "YOU MAY GO TO:",
        horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      }), 0, 1); // row, column
    }
    
    
    const panel = new BABYLON.GUI.StackPanel();
    panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    panel.isVertical = false;
    panel.clipContent = true;
    optionsGrid.addControl(panel, 1, 0);

    for (let i = 0, li = OPTIONS.length; i < li; i++) {
      panel.addControl(this._parent.createButton({
        background: {
          horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
          onPointerClickObservable: [
            OPTIONS[i].action, // callback
            -1, // the mask used to filter observers
            false, // the callback will be inserted at the last position, executed after all the others already present
            this // scope for the callback to be called from
          ],
          onPointerEnterObservable: [
            function() {
              // stop the fade animation and restore the alpha on the message block
              this._messageBlock.alpha = 1;
              this._parent.stopAnimation(this._messageTextBlock);
              this._messageBlock.text = OPTIONS[i].tooltip;
            }, // callback
            -1, // the mask used to filter observers
            false, // the callback will be inserted at the last position, executed after all the others already present
            this // scope for the callback to be called from
          ],
          onPointerOutObservable: [
            function() {
              // clear the tooltip if it matches the selected tooltip text
              if (this._messageBlock.text === OPTIONS[i].tooltip) {
                this._messageBlock.text = "";
              }
            }, // callback
            -1, // the mask used to filter observers
            false, // the callback will be inserted at the last position, executed after all the others already present
            this // scope for the callback to be called from
          ]
        },
        text: { text: OPTIONS[i].text }
      }).container);
    }

    return this._configuration;
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    console.log("set market")
    super.set();
    this._subTitleTextBlock.text = "MARKET ";
  }
}

export { WizardryMarketMainUi };