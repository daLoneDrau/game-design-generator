import { WizardryCastleUi }     from "../../ui/wizardry-castle-ui.js";
import { KEYBOARD_ENTRY_DELAY,
  WizardryScene }               from "../../../wizardry-scene.js";
import { ALPHA_FADE_FRAMERATE } from "../../../wizardry-ui-configuration.js";
import { WizardryUiStateScene } from "../../../wizardry-ui-state-scene.js";
import { WizardryAlignment,
  WizardryConstants }           from "../../../../config/wizardry-constants.js";
import * as Materials           from "../../../../components/materials/materials.js";
import { paginate }             from "../../../../components/utilities/paginate.js";
import { WizardryController }   from "../../../../services/wizardry-controller.js";

/**
 * @class Ui class for the Main state of the Training scene.
 */
class WizardryGilgameshAddPartyUi extends WizardryCastleUi {
  /**
   * Creates a new WizardryTrainingMainUi instance.
   * @param {WizardryUiStateScene} parent the parent scene
   */
  constructor(parent) {
    super(parent);
    /** @private the current roster page. */
    this._pagination = 0;
    /** @private the BABYLON.GUI.TextBlocks used to display user entry text. */
    this._entryBlock;
    /** @private the next button used for pagination. */
    this._nextButton = null;
    /** @private the party's alignment. */
    this._partyAlignment = WizardryAlignment.NEUTRAL;
    /** @private the previous button used for pagination. */
    this._prevButton = null;
    /** @private the list of objects with each object having two properties: container which is a reference to a roster button container, and text which is a reference to the button's BABYLON.GUI.TextBlock. */
    this._rosterButtons = [];
    /** @private the list of reference ids for the characters displayed in the roster. */
    this._rosterIds = [];
    /** @private the current page being displayed. */
    this._currentPage = 0;
  }
  /**
   * Adds a character to the party.
   * @param {string} refId the character's reference id
   */
  addToParty(refId) {
    let stop = false;
    const character = WizardryController.rosterInstance.getCharacterRecord(refId);
    // if the character was found, but is INMAZE or has a location flag, exit and display an error message
    if (character.inMaze
        || character.lostXyl.location[2] !== 0) {
      this._parent.stopAnimation(this._messageBlock);
      this._messageBlock.text = "** OUT **";
      this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
      stop = true;
    }
    // if the party isn't NEUTRAL and trying to add opposite alignments, exit and display an error message
    if (!stop && this._partyAlignment !== WizardryAlignment.NEUTRAL) {
      if (character.alignment !== WizardryAlignment.NEUTRAL
          && character.alignment !== this._partyAlignment) {
        this._parent.stopAnimation(this._messageBlock);
        this._messageBlock.text = "** BAD ALIGNMENT **";
        this._parent.beginAnimation(this._messageBlock, 0, 3 * ALPHA_FADE_FRAMERATE);
        stop = true;
      }
    }
    if (!stop) {    
      this._entryBlock.text = [character.name].join("");
      if (typeof(isTestEnvironment) !== "undefined" && isTestEnvironment) {
        // running unit tests - immediately add player to party
        this._entryBlock.text = "";
        WizardryController.addToParty(character);
        if (WizardryController.partyCnt < 6) {
          this.set(); 
        } else {
          this.exit();
        }
      } else {
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
            WizardryController.addToParty(character);
            if (WizardryController.partyCnt < 6) {
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
    }
  }
  /**
   * Displays the character roster.
   */
  displayRoster() {
    const roster = WizardryController.roster;
    let paginationData = paginate(roster.length, this._currentPage, 10);
    this._currentPage = paginationData.currentPage;
    // clear the roster
    this._rosterIds.length = 0;
    for (let i = this._rosterButtons.length - 1; i >= 0; i--) {
      this._rosterButtons[i].container.isVisible = false;
      this._rosterButtons[i].text.text = "";
    }
    for (let i = paginationData.startIndex, li = paginationData.endIndex, j = 0; i <= li; i++, j++) {
      const character = roster[i];
      const widget = this._rosterButtons[j];
      // set the button text
      widget.container.isVisible = true;
      widget.container.name = character.refId;
      widget.text.text = [
        j + 1,
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
    this._currentPage = 0;
    this._parent.state = WizardryConstants.GILGAMESH_MAIN;
  }
  /**
   * Gets the party's alignment.
   */
  getPartyAlignment() {
    this._partyAlignment = WizardryAlignment.NEUTRAL;
    for (let i = WizardryController.characters.length - 1; i >= 0; i--) {
      const character = WizardryController.rosterInstance.getCharacterRecord(WizardryController.characters[i]);
      if (character.alignment !== WizardryAlignment.NEUTRAL) {
        this._partyAlignment = character.alignment;
        break;
      }
    }
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
      case "N":
        this.nextPage();
        break;
      case "P":
        this.prevPage();
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        let index = parseInt(key) - 1 >= 0 ? parseInt(key) - 1 : 9;
        if (index < this._rosterIds.length) {
          this.addToParty(this._rosterIds[index]);
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
      name: [WizardryConstants.GILGAMESH_ADD_PARTY, "_ui_frame"].join(""),
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

        panel.addControl(this._parent.createTextBlock({ text: "WHO WILL JOIN ? >", horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT }));

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
        for (let i = 0; i < 10; i++) {
          const index = i;
          const button = this._parent.createButton({
            background: {
              onPointerClickObservable: [
                () => { this.addToParty(button.container.name); }, // callback
              ],
              onPointerEnterObservable: [() => { }],
              onPointerOutObservable: [() => { }],
              horizontalAlignment: BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
              // adaptWidthToChildren: false
            },
            text: { text: ((index + 1) % 10).toString() }
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
        
        this._nextButton = this._parent.createButton({
          background: {
            onPointerClickObservable: [
              () => { this.nextPage(); }, // callback
            ],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: { text: "N)EXT PAGE" }
        }).container;
        navGrid.addControl(this._nextButton, 0, 0);
        
        this._prevButton = this._parent.createButton({
          background: {
            onPointerClickObservable: [
              () => { this.prevPage(); }, // callback
            ],
            onPointerEnterObservable: [() => { }],
            onPointerOutObservable: [() => { }]
          },
          text: { text: "P)REVIOUS PAGE" }
        }).container;
        navGrid.addControl(this._prevButton, 0, 0);
        
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
   * Goes to the next roster page.
   */
  nextPage() {
    this._currentPage++;
    this.set();
  }
  /**
   * Goes to the previous roster page.
   */
  prevPage() {
    this._currentPage--;
    this.set();
  }
  /**
   * Sets the UI.
   */
  set() {
    super.set();
    this._entryBlock.text = "";
    this._messageBlock.text = "";
    this._subTitleTextBlock.text = "TAVERN";
    if (this._currentPage <= 1) {
      this._nextButton.isVisible = true;
      this._prevButton.isVisible = false;
    } else {
      this._nextButton.isVisible = false;
      this._prevButton.isVisible = true;
    }
    this.getPartyAlignment();
    this.displayRoster();
  }
}

export { WizardryGilgameshAddPartyUi };