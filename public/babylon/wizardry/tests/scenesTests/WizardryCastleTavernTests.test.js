import { TestScene } from "../testApp/TestScene.js";
import { WizardryCharacter} from "../../src/bus/wizardry-character.js";
import { WizardryConfig} from "../../src/config/wizardry-config.js";
import { WizardryAlignment,
  WizardryCharacterClass,
  WizardryConstants,
  WizardryXgoto} from "../../src/config/wizardry-constants.js";
import { WizardryGilgameshAddPartyUi } from "../../src/scenes/castle/gilgamesh/ui/wizardry-gilgamesh-add-party-ui.js";
import { WizardryGilgameshMainUi } from "../../src/scenes/castle/gilgamesh/ui/wizardry-gilgamesh-main-ui.js";
import { WizardryGilgameshRemovePartyUi } from "../../src/scenes/castle/gilgamesh/ui/wizardry-gilgamesh-remove-party-ui.js";
import { WizardryController } from "../../src/services/wizardry-controller.js";

global.globalJson = {};
global.isTestEnvironment = true;
global.jsonp = function jsonp(data) {
  globalJson = data;
}
require("../../src/dat/wizardry-data.jsonp")

beforeAll(() => {
  WizardryConfig.init();
});
beforeEach(() => {
  WizardryController.xgoto = WizardryXgoto.XGILGAMS;
  WizardryController.partyCnt = 0;
  WizardryController.characterRecord = "";
  WizardryController.characters.length = 0;
  WizardryController.rosterInstance._roster = {}

  for (let i = 0, li = 18; i < li; i++) {
    const character = new WizardryCharacter();
    character.name = ["Name" , i].join("");
    character.alignment = WizardryAlignment.GOOD;
    character.clazz = WizardryCharacterClass.FIGHTER;
    WizardryController.rosterInstance._roster[character.refId] = character;
  }
});
describe("testing the Tavern Main Menu", () => {
  let range = 0.05, runs = 10000;
  test('The Tavern Main menu allows you to go to the Add Member screen if you have less than six members', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;

    // when
    ui.goToAddMember();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_ADD_PARTY);
    expect(ui._messageBlock.text).toBe("");

    // when
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;
    ui.handleKeyEntry("A");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_ADD_PARTY);
    expect(ui._messageBlock.text).toBe("");

    // when
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;
    ui.handleKeyEntry("a");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_ADD_PARTY);
    expect(ui._messageBlock.text).toBe("");
  });
  test('The Tavern Main menu wll not allow you to go to the Add Member screen if you have six members', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;

    // when
    WizardryController.partyCnt = 6;
    ui.goToAddMember();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");

    // when
    ui.handleKeyEntry("A");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");

    // when
    ui.handleKeyEntry("a");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('The Tavern Main menu allows you to go to the Remove Member screen if you have at least one member', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;

    // when
    WizardryController.partyCnt = 6;
    ui.goToRemoveMember();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_REMOVE_PARTY);
    expect(ui._messageBlock.text).toBe("");

    // when
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;
    ui.handleKeyEntry("R");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_REMOVE_PARTY);
    expect(ui._messageBlock.text).toBe("");

    // when
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;
    ui.handleKeyEntry("r");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_REMOVE_PARTY);
    expect(ui._messageBlock.text).toBe("");
  });
  test('The Tavern Main menu wll not allow you to go to the Remove Member screen if you no members', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;

    // when
    WizardryController.partyCnt = 0;
    ui.goToRemoveMember();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");

    // when
    ui.handleKeyEntry("R");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");

    // when
    ui.handleKeyEntry("r");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('You can always leave the Tavern Main menu and return to the Market', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;

    // when
    ui.goToCastle();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XGILGAMS;
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XGILGAMS;
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XGILGAMS;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XGILGAMS;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
  });
  test('Keyboard entry in the Main menu deals with invalid entries', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('The Tavern Main menu allows you inspect characters in the Party', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;
    WizardryController.characters.push("player1");

    // when
    ui.activateCharacter("player1");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.characterRecord).toBe("player1");
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XINSPCT3);
    expect(WizardryController.xgoto2).toBe(WizardryXgoto.XGILGAMS);

    // when
    WizardryController.xgoto = WizardryXgoto.XGILGAMS;
    WizardryController.xgoto2 = WizardryXgoto.XGILGAMS;
    WizardryController.characterRecord = "";
    ui.handleKeyEntry("1");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.characterRecord).toBe("player1");
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XINSPCT3);
    expect(WizardryController.xgoto2).toBe(WizardryXgoto.XGILGAMS);
  });
  test('The Tavern Main menu will not allow you to inspect characters not in the Party', () => {
    // given
    const ui = new WizardryGilgameshMainUi(new TestScene());
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.GILGAMESH_MAIN;

    // when
    ui.handleKeyEntry("1");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XGILGAMS);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('The Tavern Add to Party menu will display up to 10 members in order. Pagination forward and backwards works as expected', () => {
    // given
    let visible = 0;
    const ui = new WizardryGilgameshAddPartyUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._nextButton = {
      isVisible: true
    };
    ui._prevButton = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {},
    };
    for (let i = 10; i > 0; i--) {
      ui._rosterButtons.push({
        container: { isVisible: false },
        text: { text: "" }
      });
    }
    ui._parent.state = WizardryConstants.GILGAMESH_ADD_PARTY;

    // when - INITIAL PAGE 1
    ui.set();

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(1);
    expect(visible).toBe(10);

    // when - NEXT TO 2
    visible = 0;
    ui.nextPage();

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(2);
    expect(visible).toBe(8);

    // when - NEXT STAY AT 2
    visible = 0;
    ui.nextPage();

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(2);
    expect(visible).toBe(8);

    // when - PREV TO 1
    visible = 0;
    ui.prevPage();

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(1);
    expect(visible).toBe(10);

    // when - PREV STAY AT 1
    visible = 0;
    ui.prevPage();

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(1);
    expect(visible).toBe(10);

    // when - NEXT TO 2
    visible = 0;
    ui.handleKeyEntry("n");

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(2);
    expect(visible).toBe(8);

    // when - NEXT STAY AT 2
    visible = 0;
    ui.handleKeyEntry("N");

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(2);
    expect(visible).toBe(8);

    // when - PREV TO 1
    visible = 0;
    ui.handleKeyEntry("p");

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(1);
    expect(visible).toBe(10);

    // when - PREV STAY AT 1
    visible = 0;
    ui.handleKeyEntry("P");

    // then
    for (let i = 0, li = ui._rosterButtons.length; i < li; i++) {
      if (ui._rosterButtons[i].container.isVisible) {
        visible++;
      }
    }
    expect(ui._currentPage).toBe(1);
    expect(visible).toBe(10);
  });
  test('The Tavern Add to Party menu allows you to add a character to the party', () => {
    // given
    const ui = new WizardryGilgameshAddPartyUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._nextButton = {
      isVisible: true
    };
    ui._prevButton = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {},
    };
    for (let i = 10; i > 0; i--) {
      ui._rosterButtons.push({
        container: { isVisible: false, name: "" },
        text: { text: "" }
      });
    }
    ui._parent.state = WizardryConstants.GILGAMESH_ADD_PARTY;

    // when - ADD A PLAYER TO THE PARTY
    ui.set();
    ui.addToParty(ui._rosterButtons[2].container.name);

    // then - PLAYER IS IN THE PARTY
    expect(WizardryController.partyCnt).toBe(1);
    expect(WizardryController.characters.length).toBe(1);
    expect(WizardryController.characters[0]).toBe(ui._rosterButtons[2].container.name);
  });
  test('After adding 6 members, the Tavern kicks you back to the Main menu', () => {
    // given
    const ui = new WizardryGilgameshAddPartyUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._nextButton = {
      isVisible: true
    };
    ui._prevButton = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {},
    };
    for (let i = 10; i > 0; i--) {
      ui._rosterButtons.push({
        container: { isVisible: false, name: "" },
        text: { text: "" }
      });
    }
    ui._parent.state = WizardryConstants.GILGAMESH_ADD_PARTY;

    // when - ADD 6 PLAYERS TO THE PARTY
    ui.set();
    for (let i = 5; i >= 0; i--) {
      ui.addToParty(ui._rosterButtons[i].container.name);
    }

    // then - PLAYER IS IN THE PARTY
    expect(WizardryController.partyCnt).toBe(6);
    expect(WizardryController.characters.length).toBe(6);
    expect(ui._parent.state).toBe(WizardryConstants.GILGAMESH_MAIN);
  });
});
