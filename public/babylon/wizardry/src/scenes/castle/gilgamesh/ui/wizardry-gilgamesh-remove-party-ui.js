import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import { WizardryConstants }    from "../../../../config/wizardry-constants.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Main state of the Training scene.
 */
class WizardryGilgameshRemovePartyUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the BABYLON.GUI.TextBlocks used to display user entry text. */
    this._entryBlock = null;
    /** @private the BABYLON.GUI.TextBlocks used to display messages. */
    this._messageBlock = null;
    /** @private the list of objects with each object having two properties: container which is a reference to a roster button container, and text which is a reference to the button's BABYLON.GUI.TextBlock. */
    this._rosterButtons = [];
    /** @private the list of reference ids for the characters displayed in the roster. */
    this._rosterIds = [];
  }
  /**
   * Displays the character roster.
   */
  displayRoster() {
    // clear the roster
    this._rosterIds.length = 0;
    for (let i = this._rosterButtons.length - 1; i >= 0; i--) {
      this._rosterButtons[i].container.isVisible = false;
    }
    // update the buttons and id list
    const charRefIds = WizardryController.characters;
    for (let i = 0, li = charRefIds.length; i < li; i++) {
      const character = WizardryController.rosterInstance.getCharacterRecord(charRefIds[i]);
      // set the button text
      this._rosterButtons[i].container.isVisible = true;
      this._rosterButtons[i].text.text = [
        i + 1,
        ") ",
        character.name,
        " ",
        character.alignment.title.substring(0, 1), 
        "-",
        character.clazz.title.substring(0, 3)
      ].join("");
      // store the character's id
      this._rosterIds.push(character.refId);
    }
  }
  /**
   * Exits the UI.
   */
  exit() {
    this._parent.state = WizardryConstants.GILGAMESH_MAIN;
  }
  /**
   * Handles user keyboard entry.
   * @param {string} key the key entered
   */
  handleKeyEntry(key) {
    let validInput = true;
    switch (key.toUpperCase()) {
      case "ESCAPE":
      case "ENTER":
        this.exit();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
        let index = parseInt(key) - 1;
        if (index < this._rosterIds.length) {
          this.removeFromParty(this._rosterIds[index]);
        } else {
          validInput = false;
        }
        break;
      default:
        validInput = false;
        break;
    }
    if (!validInput) {
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
      name: [WizardryConstants.GILGAMESH_REMOVE_PARTY, "_ui_frame"].join(""),
      cols: 40,
      rows: 24,
      color: Materials.lightRGB,
      lines: this._screenLines
    });

    { // user entry and the character roster
      let grid = WizardryScene.createGrid({
        key: "optionsGrid",
        rows: [1 / 7, 5 / 7, 1 / 7]
      });
      this._configuration.addControl(grid, 5, 1);

      { // entry prompt and cursor
        let panel = new BABYLON.GUI.StackPanel();
        panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.isVertical = false;
        grid.addControl(panel, 0, 0);

        panel.addControl(this._parent.createTextBlock({ text: "WHO WILL LEAVE ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

        this._entryBlock = this._parent.createTextBlock({ horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT });
        panel.addControl(this._entryBlock);

        let o = WizardryScene.createBlinkingCursor();
        panel.addControl(o.cursor);
        this._parent.beginDirectAnimation(
          o.cursor, //the target where the animation will take place
          [o.visible], // the list of animations to start
          0, // the initial frame
          ALPHA_FADE_FRAMERATE, // the final frame
          true // if you want animation to loop (off by default)
        );
      }
      { // roster buttons
        // roster grid 2 x 5
        let rosterGrid = WizardryScene.createGrid({
          columns: [1 / 2, 1 / 2],
          rows: [1 / 5, 1 / 5, 1 / 5, 1 / 5, 1 / 5]
        });
        grid.addControl(rosterGrid, 1, 0);
        for (let i = 0; i < 6; i++) {
          const index = i;
          let button = this._parent.createButton({
            background: {
              onPointerClickObservable: [
                () => { this.removeFromParty(this._rosterIds[index]); }, // callback
              ],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }],
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              // adaptWidthToChildren: false
            },
            text: { text: (index + 1).toString() }
          });
          button.container.width = 1;
          this._rosterButtons.push(button);
          rosterGrid.addControl(button.container, i / 2,  i % 2);
        }
      }
      { // navigation buttons
        let navGrid = WizardryScene.createGrid({
          columns: [1 / 2, 1 / 2]
        });
        grid.addControl(navGrid, 2, 0);
        
        navGrid.addControl(this._parent.createButton({
          background: {
            onPointerClickObservable: [() => { this.exit(); }],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable:   [() => { }]
          },
          text: { text: "[ESCAPE] TO EXIT" }
        }).container, 0, 1);
      }
    }

    return this._configuration;
  }
  /**
   * Removes a character from the party.
   * @param {string} refId the character's reference id
   */
  removeFromParty(refId) {
    const character = WizardryController.rosterInstance.getCharacterRecord(refId);  
    this._entryBlock.text = [character.name].join("");  
    BABYLON.setAndStartTimer({
      timeout: KEYBOARD_ENTRY_DELAY,
      contextObservable: this._parent.onBeforeRenderObservable,
      breakCondition: () => {
        // this will check if we need to break before the timeout has reached
        return this._parent.isDisposed;
      },
      onEnded: (data) => {
        // this will run when the timeout has passed
        // reset the view
        this._entryBlock.text = "";
        // remove the character from the party
        WizardryController.removeFromParty(character);
        if (WizardryController.partyCnt > 0) {
          this.set(); 
        } else {
          this.exit();
        }
      },
      onTick: (data) => {
        // this will run
      },
      onAborted: (data) => {
        // this function will run when the break condition has met (premature ending)
      },
    });
  }
  /**
   * Sets the UI, applying the current character record.
   */
  set() {
    super.set();
    this._entryBlock.text = "";
    this._messageBlock.text = "";
    this._subTitleTextBlock.text = "TAVERN";
    this.displayRoster();
  }
}

export { WizardryGilgameshRemovePartyUi };