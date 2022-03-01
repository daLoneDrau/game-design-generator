import { TestScene } from "../testApp/TestScene.js";
import { WizardryCharacter} from "../../src/bus/wizardry-character.js";
import { WizardryConfig} from "../../src/config/wizardry-config.js";
import { WizardryAlignment,
  WizardryAttribute,
  WizardryCharacterClass,
  WizardryCharacterStatus,
  WizardryConstants,
  WizardryXgoto} from "../../src/config/wizardry-constants.js";
import { WizardryInnMainUi } from "../../src/scenes/castle/inn/ui/wizardry-inn-main-ui.js";
import { WizardryInnNapUi } from "../../src/scenes/castle/inn/ui/wizardry-inn-nap-ui.js";
import { WizardryInnPlayerUi } from "../../src/scenes/castle/inn/ui/wizardry-inn-player-ui.js";
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
  WizardryController.xgoto = WizardryXgoto.XADVNTINN;
  WizardryController.partyCnt = 0;
  WizardryController.characterRecord = "";
  WizardryController.characters.length = 0;
  WizardryController.rosterInstance._roster = {}

  for (let i = 0, li = 8; i < li; i++) {
    const character = new WizardryCharacter();
    character.name = ["Name" , i].join("");
    character.alignment = WizardryAlignment.GOOD;
    character.clazz = WizardryCharacterClass.FIGHTER;
    WizardryController.rosterInstance._roster[character.refId] = character;
  }
  {
    const character = new WizardryCharacter();
    character.name = "Name9";
    character.alignment = WizardryAlignment.GOOD;
    character.clazz = WizardryCharacterClass.MAGE;
    // give the player 2 lvl 1 MAGE spells
    character.spellsKnown[0] = true;
    character.spellsKnown[1] = true;
    character.spellsKnown[4] = true;
    character.spellsKnown[5] = true;
    WizardryController.rosterInstance._roster[character.refId] = character;
  }
  {
    const character = new WizardryCharacter();
    character.name = "Name10";
    character.alignment = WizardryAlignment.GOOD;
    character.clazz = WizardryCharacterClass.PRIEST;
    // give the player 2 lvl 1 PRIEST spells
    character.spellsKnown[21] = true;
    character.spellsKnown[22] = true;
    WizardryController.rosterInstance._roster[character.refId] = character;
  }
});
describe("testing the Inn Scene", () => {
  let range = 0.05, runs = 10000;
  test('You can always leave the Inn Main menu and return to the Market', () => {
    // given
    const ui = new WizardryInnMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_MAIN;

    // when
    ui.goToCastle();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XADVNTINN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XADVNTINN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XADVNTINN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XADVNTINN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
  });
  test('Keyboard entry in the Inn Main menu deals with invalid entries', () => {
    // given
    const ui = new WizardryInnMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_MAIN;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('Selecting a player in the Inn Main menu goes to the Player menu', () => {
    // given
    const ui = new WizardryInnMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_MAIN;

    // when - select a player by ref id
    ui.activateCharacter(WizardryController.roster[0].refId);

    // then
    expect(WizardryController.characterRecord).toBe(WizardryController.roster[0].refId);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
  });
  test('Selecting a player by # in the Inn Main menu goes to the Player menu', () => {
    // given
    const ui = new WizardryInnMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_MAIN

    // when - select a player by # in party
    WizardryController.addToParty(WizardryController.roster[0]);
    WizardryController.addToParty(WizardryController.roster[1]);
    WizardryController.addToParty(WizardryController.roster[2]);
    ui.handleKeyEntry("3");

    // then
    expect(WizardryController.characterRecord).toBe(WizardryController.roster[2].refId);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
  });
  test('Selecting a player not in the party in the Inn Main menu displays error', () => {
    // given
    const ui = new WizardryInnMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_MAIN;

    // when - select a player by # in party
    ui.handleKeyEntry("1");

    // then
    expect(WizardryController.characterRecord).toBe("");
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('Selecting an unwell player in the Inn Main menu displays error', () => {
    // given
    const ui = new WizardryInnMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_MAIN;

    // when - select a player by # in party
    WizardryController.addToParty(WizardryController.roster[0]);
    WizardryController.roster[0].status = WizardryCharacterStatus.PLYZE;
    WizardryController.addToParty(WizardryController.roster[1]);
    WizardryController.addToParty(WizardryController.roster[2]);
    ui.handleKeyEntry("1");

    // then
    expect(WizardryController.characterRecord).toBe("");
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(ui._messageBlock.text).toBe("A rest won't help them. Try the Temple.");
  });
  test('You can always leave the Inn Player menu and return to the Market', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;

    // when
    ui.exit();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XADVNTINN);

    // when
    WizardryController.xgoto = WizardryXgoto.XADVNTINN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XADVNTINN);

    // when
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XADVNTINN);

    // when
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;
    ui.handleKeyEntry("Escape");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XADVNTINN);

    // when
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XADVNTINN);
  });
  test('Keyboard entry in the Inn Player menu deals with invalid entries', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('Trying to select an unaffordable room results in an error', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    ui.handleKeyEntry("B");

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");

    // when
    ui._messageBlock.text = "";
    ui.handleKeyEntry("C");

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");

    // when
    ui._messageBlock.text = "";
    ui.nap(WizardryConstants.INN_ROOM_MERCHANT);

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");

    // when
    ui._messageBlock.text = "";
    ui.nap(WizardryConstants.INN_ROOM_ROYAL);

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");
  });
  test('A character can nap in the Stables for 0 gold', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;
    ui._parent.room = WizardryConstants.INN_ROOM_NONE;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    ui.handleKeyEntry("A");

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_STABLES);
    expect(ui._parent.state).toBe(WizardryConstants.INN_NAP_MENU);
  });
  test('A character can nap in the Cots for 10 gold', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].gold = 9
    ui.handleKeyEntry("B");

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");

    // when
    WizardryController.roster[0].gold = 10;
    ui.nap(WizardryConstants.INN_ROOM_COTS);

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_COTS);
    expect(ui._parent.state).toBe(WizardryConstants.INN_NAP_MENU);
  });
  test('A character can nap in the Economy Room for 50 gold', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;
    ui._parent.room = WizardryConstants.INN_ROOM_NONE;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].gold = 49
    ui.handleKeyEntry("C");

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");

    // when
    WizardryController.roster[0].gold = 50;
    ui.nap(WizardryConstants.INN_ROOM_ECONOMY);

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_ECONOMY);
    expect(ui._parent.state).toBe(WizardryConstants.INN_NAP_MENU);
  });
  test('A character can nap in the Merchant Suites for 200 gold', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].gold = 199
    ui.handleKeyEntry("D");

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");

    // when
    WizardryController.roster[0].gold = 12000;
    ui.nap(WizardryConstants.INN_ROOM_MERCHANT);

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_MERCHANT);
    expect(ui._parent.state).toBe(WizardryConstants.INN_NAP_MENU);
  });
  test('A character can nap in the Royal Suite for 500 gold', () => {
    // given
    const ui = new WizardryInnPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.INN_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].gold = 499
    ui.handleKeyEntry("E");

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_NONE);
    expect(ui._parent.state).toBe(WizardryConstants.INN_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You can't afford that. Try downsizing.");

    // when
    WizardryController.roster[0].gold = 500;
    ui.nap(WizardryConstants.INN_ROOM_ROYAL);

    // then
    expect(ui._parent.room).toBe(WizardryConstants.INN_ROOM_ROYAL);
    expect(ui._parent.state).toBe(WizardryConstants.INN_NAP_MENU);
  });
  test('A MAGE sleeping in the STABLES loses no gold, heals no wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    const character = WizardryController.roster[8];
    character.hpMax = 4;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 499;
    ui.set();

    // then
    expect(character.hpLeft).toBe(1);
    expect(character.gold).toBe(499);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A PRIEST sleeping in the STABLES loses no gold, heals no wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    const character = WizardryController.roster[9];
    character.hpMax = 4;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 499;
    ui.set();

    // then
    expect(character.hpLeft).toBe(1);
    expect(character.gold).toBe(499);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(2);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the COTS w/INTERRUPT loses 10 gold, heals 1 wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_COTS;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    ui._interruptHealing = true;
    const character = WizardryController.roster[8];
    character.hpMax = 4;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 499;
    ui.set();

    // then
    expect(character.hpLeft).toBe(2);
    expect(character.gold).toBe(489);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the COTS wo/INTERRUPT loses gold, heals all wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_COTS;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    const character = WizardryController.roster[8];
    character.hpMax = 4;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 499;
    ui.set();

    // then
    expect(character.hpLeft).toBe(4);
    expect(character.gold).toBe(469);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the ECONOMY w/INTERRUPT loses 10 gold, heals 3 wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_ECONOMY;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    ui._interruptHealing = true;
    const character = WizardryController.roster[8];
    character.hpMax = 14;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 9999;
    ui.set();

    // then
    expect(character.hpLeft).toBe(4);
    expect(character.gold).toBe(9949);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the ECONOMY wo/INTERRUPT loses gold, heals all wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_ECONOMY;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    const character = WizardryController.roster[8];
    character.hpMax = 44;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 9999;
    ui.set();

    // then
    expect(character.hpLeft).toBe(44);
    expect(character.gold).toBe(9249);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the MERCHANT w/INTERRUPT loses 200 gold, heals 7 wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_MERCHANT;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    ui._interruptHealing = true;
    const character = WizardryController.roster[8];
    character.hpMax = 14;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 9999;
    ui.set();

    // then
    expect(character.hpLeft).toBe(8);
    expect(character.gold).toBe(9799);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the MERCHANT wo/INTERRUPT loses gold, heals all wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_MERCHANT;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    const character = WizardryController.roster[8];
    character.hpMax = 44;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 9999;
    ui.set();

    // then
    expect(character.hpLeft).toBe(44);
    expect(character.gold).toBe(8599);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the ROYAL w/INTERRUPT loses 200 gold, heals 10 wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_ROYAL;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    ui._interruptHealing = true;
    const character = WizardryController.roster[8];
    character.hpMax = 14;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 9999;
    ui.set();

    // then
    expect(character.hpLeft).toBe(11);
    expect(character.gold).toBe(9499);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test('A MAGE sleeping in the ROYAL wo/INTERRUPT loses gold, heals all wounds, and regains all spells', () => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._healthHeaderBlock = {
      text: ""
    };
    ui._healthBlock = {
      text: ""
    };
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._textBlock = {
      text: ""
    };
    ui._healingGrid = {
      isVisible: false
    };
    ui._textGrid = {
      isVisible: false
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.room = WizardryConstants.INN_ROOM_ROYAL;
    ui._parent.state = WizardryConstants.INN_NAP_MENU;
    const character = WizardryController.roster[8];
    character.hpMax = 44;
    character.hpLeft = 1;

    // pre-test
    expect(character.hpLeft).toBe(1);
    expect(character.mageSpells[0]).toBe(0);
    expect(character.mageSpells[1]).toBe(0);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);

    // when
    WizardryController.characterRecord = character.refId;
    character.gold = 9999;
    ui.set();

    // then
    expect(character.hpLeft).toBe(44);
    expect(character.gold).toBe(7499);
    expect(character.mageSpells[0]).toBe(2);
    expect(character.mageSpells[1]).toBe(2);
    expect(character.mageSpells[2]).toBe(0);
    expect(character.mageSpells[3]).toBe(0);
    expect(character.mageSpells[4]).toBe(0);
    expect(character.mageSpells[5]).toBe(0);
    expect(character.mageSpells[6]).toBe(0);
    expect(character.priestSpells[0]).toBe(0);
    expect(character.priestSpells[1]).toBe(0);
    expect(character.priestSpells[2]).toBe(0);
    expect(character.priestSpells[3]).toBe(0);
    expect(character.priestSpells[4]).toBe(0);
    expect(character.priestSpells[5]).toBe(0);
    expect(character.priestSpells[6]).toBe(0);
  });
  test.each([
    [1, "FIGHTER", 1000, 10, 0],
    [2, "FIGHTER", 1724, 10, 0],
    [3, "FIGHTER", 2972, 10, 1724],
    [4, "FIGHTER", 5124, 10, 2972],
    [5, "FIGHTER", 8834, 10, 5124],
    [6, "FIGHTER", 15231, 10, 8834],
    [7, "FIGHTER", 26260, 10, 15231],
    [8, "FIGHTER", 45275, 10, 26260],
    [9, "FIGHTER", 78060, 10, 45275],
    [10, "FIGHTER", 134586, 10, 78060],
    [11, "FIGHTER", 232044, 10, 134586],
    [12, "FIGHTER", 400075, 10, 232044],
    [13, "FIGHTER", 689784, 10, 400075],
    [14, "FIGHTER", 979493, 10, 689784],
  ])('A LVL %d %s gains a level after %d exp, gaining between %d and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 1 && character.hpMax <= high * (level + 1)).toBeTruthy();
    }
  });
  test.each([
    [1, "MAGE", 1100, 4, 0],
    [2, "MAGE", 1896, 4, 1100],
    [3, "MAGE", 3268, 4, 1896],
    [4, "MAGE", 5634, 4, 3268],
    [5, "MAGE", 9713, 4, 5634],
    [6, "MAGE", 16746, 4, 9713],
    [7, "MAGE", 28872, 4, 16746],
    [8, "MAGE", 49779, 4, 28872],
    [9, "MAGE", 85825, 4, 49779],
    [10, "MAGE", 147974, 4, 85825],
    [11, "MAGE", 255127, 4, 147974],
    [12, "MAGE", 439874, 4, 255127],
    [13, "MAGE", 758403, 4, 439874],
    [14, "MAGE", 1076932, 4, 758403],
  ])('A LVL %d %s gains a level after %d exp, gaining between 1 and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 1 && character.hpMax <= high * (level + 1)).toBeTruthy();
    }
  });
  test.each([
    [1, "PRIEST", 1050, 8, 0],
    [2, "PRIEST", 1810, 8, 1050],
    [3, "PRIEST", 3120, 8, 1810],
    [4, "PRIEST", 5379, 8, 3120],
    [5, "PRIEST", 9274, 8, 5379],
    [6, "PRIEST", 15989, 8, 9274],
    [7, "PRIEST", 27567, 8, 15989],
    [8, "PRIEST", 47529, 8, 27567],
    [9, "PRIEST", 81946, 8, 47529],
    [10, "PRIEST", 141286, 8, 81946],
    [11, "PRIEST", 243596, 8, 141286],
    [12, "PRIEST", 419993, 8, 243596],
    [13, "PRIEST", 724125, 8, 419993],
    [14, "PRIEST", 1028257, 8, 724125],
  ])('A LVL %d %s gains a level after %d exp, gaining between 1 and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 1 && character.hpMax <= high * (level + 1)).toBeTruthy();
    }
  });
  test.each([
    [1, "THIEF", 900, 6, 0],
    [2, "THIEF", 1551, 6, 900],
    [3, "THIEF", 2674, 6, 1551],
    [4, "THIEF", 4610, 6, 2674],
    [5, "THIEF", 7948, 6, 4610],
    [6, "THIEF", 13703, 6, 7948],
    [7, "THIEF", 23625, 6, 13703],
    [8, "THIEF", 40732, 6, 23625],
    [9, "THIEF", 70227, 6, 40732],
    [10, "THIEF", 121081, 6, 70227],
    [11, "THIEF", 208760, 6, 121081],
    [12, "THIEF", 359931, 6, 208760],
    [13, "THIEF", 620570, 6, 359931],
    [14, "THIEF", 881209, 6, 620570],
  ])('A LVL %d %s gains a level after %d exp, gaining between 1 and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 1 && character.hpMax <= high * (level + 1)).toBeTruthy();
    }
  });
  test.each([
    [1, "BISHOP", 1200, 6, 0],
    [2, "BISHOP", 2105, 6, 1200],
    [3, "BISHOP", 3692, 6, 2105],
    [4, "BISHOP", 6477, 6, 3692],
    [5, "BISHOP", 11363, 6, 6477],
    [6, "BISHOP", 19935, 6, 11363],
    [7, "BISHOP", 34973, 6, 19935],
    [8, "BISHOP", 61356, 6, 34973],
    [9, "BISHOP", 107642, 6, 61356],
    [10, "BISHOP", 188845, 6, 107642],
    [11, "BISHOP", 331307, 6, 188845],
    [12, "BISHOP", 581240, 6, 331307],
    [13, "BISHOP", 1019719, 6, 581240],
    [14, "BISHOP", 1458198, 6, 1019719],
  ])('A LVL %d %s gains a level after %d exp, gaining between 1 and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 1 && character.hpMax <= high * (level + 1)).toBeTruthy();
    }
  });
  test.each([
    [1, "SAMURAI", 1250, 8, 0],
    [2, "SAMURAI", 2192, 8, 1250],
    [3, "SAMURAI", 3845, 8, 2192],
    [4, "SAMURAI", 6745, 8, 3845],
    [5, "SAMURAI", 11833, 8, 6745],
    [6, "SAMURAI", 20759, 8, 11833],
    [7, "SAMURAI", 36419, 8, 20759],
    [8, "SAMURAI", 63892, 8, 36419],
    [9, "SAMURAI", 112091, 8, 63892],
    [10, "SAMURAI", 196650, 8, 112091],
    [11, "SAMURAI", 345000, 8, 196650],
    [12, "SAMURAI", 605263, 8, 345000],
    [13, "SAMURAI", 1061864, 8, 605263],
    [14, "SAMURAI", 1518465, 8, 1061864],
  ])('A LVL %d %s gains a level after %d exp, gaining between %d and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 2 && character.hpMax <= high * (level + 2)).toBeTruthy();
    }
  });
  test.each([
    [1, "LORD", 1300, 10, 0],
    [2, "LORD", 2280, 10, 1300],
    [3, "LORD", 4000, 10, 2280],
    [4, "LORD", 7017, 10, 4000],
    [5, "LORD", 12310, 10, 7017],
    [6, "LORD", 21596, 10, 12310],
    [7, "LORD", 37887, 10, 21596],
    [8, "LORD", 66468, 10, 37887],
    [9, "LORD", 116610, 10, 66468],
    [10, "LORD", 204578, 10, 116610],
    [11, "LORD", 358908, 10, 204578],
    [12, "LORD", 629663, 10, 358908],
    [13, "LORD", 1104671, 10, 629663],
    [14, "LORD", 1579679, 10, 1104671],
  ])('A LVL %d %s gains a level after %d exp, gaining between %d and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 1 && character.hpMax <= high * (level + 1)).toBeTruthy();
    }
  });
  test.each([
    [1, "NINJA", 1450, 6, 0],
    [2, "NINJA", 2543, 6, 1450],
    [3, "NINJA", 4461, 6, 2543],
    [4, "NINJA", 7826, 6, 4461],
    [5, "NINJA", 13729, 6, 7826],
    [6, "NINJA", 24085, 6, 13729],
    [7, "NINJA", 42254, 6, 24085],
    [8, "NINJA", 74129, 6, 42254],
    [9, "NINJA", 130050, 6, 74129],
    [10, "NINJA", 228157, 6, 130050],
    [11, "NINJA", 400275, 6, 228157],
    [12, "NINJA", 702236, 6, 400275],
    [13, "NINJA", 1231992, 6, 702236],
    [14, "NINJA", 1761748, 6, 1231992],
  ])('A LVL %d %s gains a level after %d exp, gaining between 1 and %d hit points per level', (level, clazz, expNeeded, high, initalExp) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let character = new WizardryCharacter();
    character.name = "Name";
    character.exp = initalExp;
    character.clazz = WizardryCharacterClass.fromString(clazz);
    character.charLev = level;
    WizardryController.rosterInstance._roster[character.refId] = character;

    // when
    WizardryController.characterRecord = character.refId;
    ui.set();

    // then - test UI display
    expect(ui._textBlock.text).toBe(["YOU NEED ", expNeeded - initalExp, " MORE\nEXPERIENCE POINTS TO MAKE LEVEL"].join(""));

    // when - run 1000 times. HP gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      character = new WizardryCharacter();
      character.name = "Name";
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then - 
      expect(character.charLev).toBe(level + 1);
      expect(character.hpMax >= level + 1 && character.hpMax <= high * (level + 1)).toBeTruthy();
    }
  });
  test.each([
    [1, "MAGE", 1100, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, "MAGE", 1896, 3, 4, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, "MAGE", 3268, 4, 4, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, "MAGE", 5634, 5, 5, 3, 3, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, "MAGE", 9713, 6, 6, 4, 4, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, "MAGE", 16746, 7, 7, 5, 5, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0],
    [7, "MAGE", 28872, 8, 8, 6, 6, 4, 4, 2, 3, 0, 0, 0, 0, 0, 0],
    [8, "MAGE", 49779, 9, 9, 7, 7, 5, 5, 3, 3, 1, 3, 0, 0, 0, 0],
    [9, "MAGE", 85825, 9, 9, 8, 8, 6, 6, 4, 4, 2, 3, 0, 0, 0, 0],
    [10, "MAGE", 147974, 9, 9, 9, 9, 7, 7, 5, 5, 3, 3, 1, 4, 0, 0],
    [11, "MAGE", 255127, 9, 9, 9, 9, 8, 8, 6, 6, 4, 4, 2, 4, 0, 0],
    [12, "MAGE", 439874, 9, 9, 9, 9, 9, 9, 7, 7, 5, 5, 3, 4, 1, 3],
    [13, "MAGE", 758403, 9, 9, 9, 9, 9, 9, 8, 8, 6, 6, 4, 4, 2, 3],
    [14, "MAGE", 1076932, 9, 9, 9, 9, 9, 9, 9, 9, 7, 7, 5, 5, 3, 3],
  ])('A LVL %d %s learns the expected # of spells when gaining a level', (level, clazz, expNeeded, low1, high1, low2, high2, low3, high3, low4, high4, low5, high5, low6, high6, low7, high7) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let max = [false, false, false, false, false, false, false];
    // when - run 1000 times. Spell gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      const character = new WizardryCharacter();
      character.name = "Name";
      character.setAttribute(WizardryAttribute.IQ, 14);
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then
      if (!max[0] && character.mageSpells[0] === high1) {
        max[0] = true;
      }
      if (!max[1] && character.mageSpells[1] === high2) {
        max[1] = true;
      }
      if (!max[2] && character.mageSpells[2] === high3) {
        max[2] = true;
      }
      if (!max[3] && character.mageSpells[3] === high4) {
        max[3] = true;
      }
      if (!max[4] && character.mageSpells[4] === high5) {
        max[4] = true;
      }
      if (!max[5] && character.mageSpells[5] === high6) {
        max[5] = true;
      }
      if (!max[6] && character.mageSpells[6] === high7) {
        max[6] = true;
      }
      expect(character.mageSpells[0] >= low1 && character.mageSpells[0] <= high1).toBeTruthy(); // LVL 1 SPELLS
      expect(character.mageSpells[1] >= low2 && character.mageSpells[1] <= high2).toBeTruthy(); // LVL 2 SPELLS
      expect(character.mageSpells[2] >= low3 && character.mageSpells[2] <= high3).toBeTruthy(); // LVL 3 SPELLS
      expect(character.mageSpells[3] >= low4 && character.mageSpells[3] <= high4).toBeTruthy(); // LVL 4 SPELLS
      expect(character.mageSpells[4] >= low5 && character.mageSpells[4] <= high5).toBeTruthy(); // LVL 5 SPELLS
      expect(character.mageSpells[5] >= low6 && character.mageSpells[5] <= high6).toBeTruthy(); // LVL 6 SPELLS
      expect(character.mageSpells[6] >= low7 && character.mageSpells[6] <= high7).toBeTruthy(); // LVL 7 SPELLS
      expect(character.priestSpells[0]).toBe(0);
      expect(character.priestSpells[1]).toBe(0);
      expect(character.priestSpells[2]).toBe(0);
      expect(character.priestSpells[3]).toBe(0);
      expect(character.priestSpells[4]).toBe(0);
      expect(character.priestSpells[5]).toBe(0);
      expect(character.priestSpells[6]).toBe(0);
    }
    expect(max[0]).toBeTruthy();
    expect(max[1]).toBeTruthy();
    expect(max[2]).toBeTruthy();
    expect(max[3]).toBeTruthy();
    expect(max[4]).toBeTruthy();
    expect(max[5]).toBeTruthy();
    expect(max[6]).toBeTruthy();
  });
  test.each([
    [1, "PRIEST", 1100, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, "PRIEST", 1896, 3, 5, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, "PRIEST", 3268, 4, 5, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, "PRIEST", 5634, 5, 5, 3, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, "PRIEST", 9713, 6, 6, 4, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, "PRIEST", 16746, 7, 7, 5, 5, 3, 4, 1, 4, 0, 0, 0, 0, 0, 0],
    [7, "PRIEST", 28872, 8, 8, 6, 6, 4, 4, 2, 4, 0, 0, 0, 0, 0, 0],
    [8, "PRIEST", 49779, 9, 9, 7, 7, 5, 5, 3, 4, 1, 6, 0, 0, 0, 0],
    [9, "PRIEST", 85825, 9, 9, 8, 8, 6, 6, 4, 4, 2, 6, 0, 0, 0, 0],
    [10, "PRIEST", 147974, 9, 9, 9, 9, 7, 7, 5, 5, 3, 6, 1, 4, 0, 0],
    [11, "PRIEST", 255127, 9, 9, 9, 9, 8, 8, 6, 6, 4, 6, 2, 4, 0, 0],
    [12, "PRIEST", 439874, 9, 9, 9, 9, 9, 9, 7, 7, 5, 6, 3, 4, 1, 2],
    [13, "PRIEST", 758403, 9, 9, 9, 9, 9, 9, 8, 8, 6, 6, 4, 4, 2, 2],
    [14, "PRIEST", 1076932, 9, 9, 9, 9, 9, 9, 9, 9, 7, 7, 5, 5, 3, 3],
  ])('A LVL %d %s learns the expected # of spells when gaining a level', (level, clazz, expNeeded, low1, high1, low2, high2, low3, high3, low4, high4, low5, high5, low6, high6, low7, high7) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let max = [false, false, false, false, false, false, false];
    // when - run 1000 times. Spell gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      const character = new WizardryCharacter();
      character.name = "Name";
      character.setAttribute(WizardryAttribute.PIETY, 14);
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then
      if (!max[0] && character.priestSpells[0] === high1) {
        max[0] = true;
      }
      if (!max[1] && character.priestSpells[1] === high2) {
        max[1] = true;
      }
      if (!max[2] && character.priestSpells[2] === high3) {
        max[2] = true;
      }
      if (!max[3] && character.priestSpells[3] === high4) {
        max[3] = true;
      }
      if (!max[4] && character.priestSpells[4] === high5) {
        max[4] = true;
      }
      if (!max[5] && character.priestSpells[5] === high6) {
        max[5] = true;
      }
      if (!max[6] && character.priestSpells[6] === high7) {
        max[6] = true;
      }
      expect(character.priestSpells[0] >= low1 && character.priestSpells[0] <= high1).toBeTruthy(); // LVL 1 SPELLS
      expect(character.priestSpells[1] >= low2 && character.priestSpells[1] <= high2).toBeTruthy(); // LVL 2 SPELLS
      expect(character.priestSpells[2] >= low3 && character.priestSpells[2] <= high3).toBeTruthy(); // LVL 3 SPELLS
      expect(character.priestSpells[3] >= low4 && character.priestSpells[3] <= high4).toBeTruthy(); // LVL 4 SPELLS
      expect(character.priestSpells[4] >= low5 && character.priestSpells[4] <= high5).toBeTruthy(); // LVL 5 SPELLS
      expect(character.priestSpells[5] >= low6 && character.priestSpells[5] <= high6).toBeTruthy(); // LVL 6 SPELLS
      expect(character.priestSpells[6] >= low7 && character.priestSpells[6] <= high7).toBeTruthy(); // LVL 7 SPELLS
      expect(character.mageSpells[0]).toBe(0);
      expect(character.mageSpells[1]).toBe(0);
      expect(character.mageSpells[2]).toBe(0);
      expect(character.mageSpells[3]).toBe(0);
      expect(character.mageSpells[4]).toBe(0);
      expect(character.mageSpells[5]).toBe(0);
      expect(character.mageSpells[6]).toBe(0);
    }
    expect(max[0]).toBeTruthy();
    expect(max[1]).toBeTruthy();
    expect(max[2]).toBeTruthy();
    expect(max[3]).toBeTruthy();
    expect(max[4]).toBeTruthy();
    expect(max[5]).toBeTruthy();
    expect(max[6]).toBeTruthy();
  });
  test.each([
    [1, "SAMURAI", 1250, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, "SAMURAI", 2192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, "SAMURAI", 3845, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, "SAMURAI", 6745, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, "SAMURAI", 11833, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, "SAMURAI", 20759, 4, 4, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, "SAMURAI", 36419, 5, 5, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, "SAMURAI", 63892, 6, 6, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [9, "SAMURAI", 112091, 7, 7, 4, 4, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [10, "SAMURAI", 196650, 8, 8, 5, 5, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [11, "SAMURAI", 345000, 9, 9, 6, 6, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [12, "SAMURAI", 605263, 9, 9, 7, 7, 4, 4, 1, 3, 0, 0, 0, 0, 0, 0],
    [13, "SAMURAI", 1061864, 9, 9, 8, 8, 5, 5, 2, 3, 0, 0, 0, 0, 0, 0],
    [14, "SAMURAI", 1518465, 9, 9, 9, 9, 6, 6, 3, 3, 0, 0, 0, 0, 0, 0],
  ])('A LVL %d %s learns the expected # of spells when gaining a level', (level, clazz, expNeeded, low1, high1, low2, high2, low3, high3, low4, high4, low5, high5, low6, high6, low7, high7) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let max = [false, false, false, false, false, false, false];
    // when - run 1000 times. Spell gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      const character = new WizardryCharacter();
      character.name = "Name";
      character.setAttribute(WizardryAttribute.IQ, 14);
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then
      if (!max[0] && character.mageSpells[0] === high1) {
        max[0] = true;
      }
      if (!max[1] && character.mageSpells[1] === high2) {
        max[1] = true;
      }
      if (!max[2] && character.mageSpells[2] === high3) {
        max[2] = true;
      }
      if (!max[3] && character.mageSpells[3] === high4) {
        max[3] = true;
      }
      if (!max[4] && character.mageSpells[4] === high5) {
        max[4] = true;
      }
      if (!max[5] && character.mageSpells[5] === high6) {
        max[5] = true;
      }
      if (!max[6] && character.mageSpells[6] === high7) {
        max[6] = true;
      }
      expect(character.mageSpells[0] >= low1 && character.mageSpells[0] <= high1).toBeTruthy(); // LVL 1 SPELLS
      expect(character.priestSpells[0]).toBe(0); // LVL 7 SPELLS
      expect(character.mageSpells[1] >= low2 && character.mageSpells[1] <= high2).toBeTruthy(); // LVL 2 SPELLS
      expect(character.mageSpells[2] >= low3 && character.mageSpells[2] <= high3).toBeTruthy(); // LVL 3 SPELLS
      expect(character.mageSpells[3] >= low4 && character.mageSpells[3] <= high4).toBeTruthy(); // LVL 4 SPELLS
      expect(character.mageSpells[4] >= low5 && character.mageSpells[4] <= high5).toBeTruthy(); // LVL 5 SPELLS
      expect(character.mageSpells[5] >= low6 && character.mageSpells[5] <= high6).toBeTruthy(); // LVL 6 SPELLS
      expect(character.mageSpells[6] >= low7 && character.mageSpells[6] <= high7).toBeTruthy(); // LVL 7 SPELLS
      expect(character.priestSpells[0]).toBe(0);
      expect(character.priestSpells[1]).toBe(0);
      expect(character.priestSpells[2]).toBe(0);
      expect(character.priestSpells[3]).toBe(0);
      expect(character.priestSpells[4]).toBe(0);
      expect(character.priestSpells[5]).toBe(0);
      expect(character.priestSpells[6]).toBe(0);
    }
    expect(max[0]).toBeTruthy();
    expect(max[1]).toBeTruthy();
    expect(max[2]).toBeTruthy();
    expect(max[3]).toBeTruthy();
    expect(max[4]).toBeTruthy();
    expect(max[5]).toBeTruthy();
    expect(max[6]).toBeTruthy();
  });
  test.each([
    [1, "LORD", 1300, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, "LORD", 2280, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, "LORD", 4000, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, "LORD", 7017, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, "LORD", 12310, 3, 5, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, "LORD", 21596, 4, 5, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, "LORD", 37887, 5, 5, 3, 4, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, "LORD", 66468, 6, 6, 4, 4, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [9, "LORD", 116610, 7, 7, 5, 5, 3, 4, 1, 4, 0, 0, 0, 0, 0, 0],
    [10, "LORD", 204578, 8, 8, 6, 6, 4, 4, 2, 4, 0, 0, 0, 0, 0, 0],
    [11, "LORD", 358908, 9, 9, 7, 7, 5, 5, 3, 4, 1, 6, 0, 0, 0, 0],
    [12, "LORD", 629663, 9, 9, 8, 8, 6, 6, 4, 4, 2, 6, 0, 0, 0, 0],
    [13, "LORD", 1104671, 9, 9, 9, 9, 7, 7, 5, 5, 3, 6, 1, 4, 0, 0],
    [14, "LORD", 1579679, 9, 9, 9, 9, 8, 8, 6, 6, 4, 6, 2, 4, 0, 0],
  ])('A LVL %d %s learns the expected # of spells when gaining a level', (level, clazz, expNeeded, low1, high1, low2, high2, low3, high3, low4, high4, low5, high5, low6, high6, low7, high7) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let max = [false, false, false, false, false, false, false];
    // when - run 1000 times. Spell gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      const character = new WizardryCharacter();
      character.name = "Name";
      character.setAttribute(WizardryAttribute.PIETY, 14);
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then
      if (!max[0] && character.priestSpells[0] === high1) {
        max[0] = true;
      }
      if (!max[1] && character.priestSpells[1] === high2) {
        max[1] = true;
      }
      if (!max[2] && character.priestSpells[2] === high3) {
        max[2] = true;
      }
      if (!max[3] && character.priestSpells[3] === high4) {
        max[3] = true;
      }
      if (!max[4] && character.priestSpells[4] === high5) {
        max[4] = true;
      }
      if (!max[5] && character.priestSpells[5] === high6) {
        max[5] = true;
      }
      if (!max[6] && character.priestSpells[6] === high7) {
        max[6] = true;
      }
      expect(character.priestSpells[0] >= low1 && character.priestSpells[0] <= high1).toBeTruthy(); // LVL 1 SPELLS
      expect(character.priestSpells[1] >= low2 && character.priestSpells[1] <= high2).toBeTruthy(); // LVL 2 SPELLS
      expect(character.priestSpells[2] >= low3 && character.priestSpells[2] <= high3).toBeTruthy(); // LVL 3 SPELLS
      expect(character.priestSpells[3] >= low4 && character.priestSpells[3] <= high4).toBeTruthy(); // LVL 4 SPELLS
      expect(character.priestSpells[4] >= low5 && character.priestSpells[4] <= high5).toBeTruthy(); // LVL 5 SPELLS
      expect(character.priestSpells[5] >= low6 && character.priestSpells[5] <= high6).toBeTruthy(); // LVL 6 SPELLS
      expect(character.priestSpells[6] >= low7 && character.priestSpells[6] <= high7).toBeTruthy(); // LVL 7 SPELLS
      expect(character.mageSpells[0]).toBe(0);
      expect(character.mageSpells[1]).toBe(0);
      expect(character.mageSpells[2]).toBe(0);
      expect(character.mageSpells[3]).toBe(0);
      expect(character.mageSpells[4]).toBe(0);
      expect(character.mageSpells[5]).toBe(0);
      expect(character.mageSpells[6]).toBe(0);
    }
    expect(max[0]).toBeTruthy();
    expect(max[1]).toBeTruthy();
    expect(max[2]).toBeTruthy();
    expect(max[3]).toBeTruthy();
    expect(max[4]).toBeTruthy();
    expect(max[5]).toBeTruthy();
    expect(max[6]).toBeTruthy();
  });
  test.each([
    [1, "BISHOP", 1200, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, "BISHOP", 2105, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, "BISHOP", 3692, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, "BISHOP", 6477, 5, 5, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, "BISHOP", 11363, 6, 6, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, "BISHOP", 19935, 7, 7, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, "BISHOP", 34973, 8, 8, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, "BISHOP", 61356, 9, 9, 5, 5, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [9, "BISHOP", 107642, 9, 9, 6, 6, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0],
    [10, "BISHOP", 188845, 9, 9, 7, 7, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [11, "BISHOP", 331307, 9, 9, 8, 8, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [12, "BISHOP", 581240, 9, 9, 9, 9, 5, 5, 1, 3, 0, 0, 0, 0, 0, 0],
    [13, "BISHOP", 1019719, 9, 9, 9, 9, 6, 6, 2, 3, 0, 0, 0, 0, 0, 0],
    [14, "BISHOP", 1458198, 9, 9, 9, 9, 7, 7, 3, 3, 0, 0, 0, 0, 0, 0],
  ])('A LVL %d %s learns the expected # of Mage spells when gaining a level', (level, clazz, expNeeded, low1, high1, low2, high2, low3, high3, low4, high4, low5, high5, low6, high6, low7, high7) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let max = [false, false, false, false, false, false, false];
    // when - run 1000 times. Spell gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      const character = new WizardryCharacter();
      character.name = "Name";
      character.setAttribute(WizardryAttribute.IQ, 14);
      character.setAttribute(WizardryAttribute.PIETY, 14);
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then
      if (!max[0] && character.mageSpells[0] === high1) {
        max[0] = true;
      }
      if (!max[1] && character.mageSpells[1] === high2) {
        max[1] = true;
      }
      if (!max[2] && character.mageSpells[2] === high3) {
        max[2] = true;
      }
      if (!max[3] && character.mageSpells[3] === high4) {
        max[3] = true;
      }
      if (!max[4] && character.mageSpells[4] === high5) {
        max[4] = true;
      }
      if (!max[5] && character.mageSpells[5] === high6) {
        max[5] = true;
      }
      if (!max[6] && character.mageSpells[6] === high7) {
        max[6] = true;
      }
      expect(character.mageSpells[0] >= low1 && character.mageSpells[0] <= high1).toBeTruthy(); // LVL 1 SPELLS
      expect(character.mageSpells[1] >= low2 && character.mageSpells[1] <= high2).toBeTruthy(); // LVL 2 SPELLS
      expect(character.mageSpells[2] >= low3 && character.mageSpells[2] <= high3).toBeTruthy(); // LVL 3 SPELLS
      expect(character.mageSpells[3] >= low4 && character.mageSpells[3] <= high4).toBeTruthy(); // LVL 4 SPELLS
      expect(character.mageSpells[4] >= low5 && character.mageSpells[4] <= high5).toBeTruthy(); // LVL 5 SPELLS
      expect(character.mageSpells[5] >= low6 && character.mageSpells[5] <= high6).toBeTruthy(); // LVL 6 SPELLS
      expect(character.mageSpells[6] >= low7 && character.mageSpells[6] <= high7).toBeTruthy(); // LVL 7 SPELLS
    }
    expect(max[0]).toBeTruthy();
    expect(max[1]).toBeTruthy();
    expect(max[2]).toBeTruthy();
    expect(max[3]).toBeTruthy();
    expect(max[4]).toBeTruthy();
    expect(max[5]).toBeTruthy();
    expect(max[6]).toBeTruthy();
  });
  test.each([
    [1, "BISHOP", 1200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, "BISHOP", 2105, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, "BISHOP", 3692, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, "BISHOP", 6477, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, "BISHOP", 11363, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, "BISHOP", 19935, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, "BISHOP", 34973, 5, 5, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [8, "BISHOP", 61356, 6, 6, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [9, "BISHOP", 107642, 7, 7, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [10, "BISHOP", 188845, 8, 8, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [11, "BISHOP", 331307, 9, 9, 5, 5, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [12, "BISHOP", 581240, 9, 9, 6, 6, 2, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [13, "BISHOP", 1019719, 9, 9, 7, 7, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0],
    [14, "BISHOP", 1458198, 9, 9, 8, 8, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0],
  ])('A LVL %d %s learns the expected # of Priest spells when gaining a level', (level, clazz, expNeeded, low1, high1, low2, high2, low3, high3, low4, high4, low5, high5, low6, high6, low7, high7) => {
    // given
    const ui = new WizardryInnNapUi(new TestScene());
    { // initialize UI
      ui._entryBlock = {
        text: ""
      };
      ui._healthHeaderBlock = {
        text: ""
      };
      ui._healthBlock = {
        text: ""
      };
      ui._goldBlock = {
        text: ""
      };
      ui._messageBlock = {
        text: ""
      };
      ui._subTitleTextBlock = {
        text: ""
      };
      ui._textBlock = {
        text: ""
      };
      ui._healingGrid = {
        isVisible: false
      };
      ui._textGrid = {
        isVisible: false
      };
      ui._partyPanel = {
        resetHighlights: () => {},
        set: () => {}
      };
      ui._parent.room = WizardryConstants.INN_ROOM_STABLES;
      ui._parent.state = WizardryConstants.INN_NAP_MENU;
    }
    let max = [false, false, false, false, false, false, false];
    // when - run 1000 times. Spell gain should always be between high and low
    for (let i = runs; i > 0; i--) {
      // reset character
      const character = new WizardryCharacter();
      character.name = "Name";
      character.setAttribute(WizardryAttribute.IQ, 14);
      character.setAttribute(WizardryAttribute.PIETY, 14);
      character.exp = expNeeded;
      character.clazz = WizardryCharacterClass.fromString(clazz);
      character.charLev = level;
      WizardryController.rosterInstance._roster[character.refId] = character;
      
      // when - level up
      WizardryController.characterRecord = character.refId;
      character.exp = expNeeded;
      ui.set();

      // then
      if (!max[0] && character.priestSpells[0] === high1) {
        max[0] = true;
      }
      if (!max[1] && character.priestSpells[1] === high2) {
        max[1] = true;
      }
      if (!max[2] && character.priestSpells[2] === high3) {
        max[2] = true;
      }
      if (!max[3] && character.priestSpells[3] === high4) {
        max[3] = true;
      }
      if (!max[4] && character.priestSpells[4] === high5) {
        max[4] = true;
      }
      if (!max[5] && character.priestSpells[5] === high6) {
        max[5] = true;
      }
      if (!max[6] && character.priestSpells[6] === high7) {
        max[6] = true;
      }
      expect(character.priestSpells[0] >= low1 && character.priestSpells[0] <= high1).toBeTruthy(); // LVL 1 SPELLS
      expect(character.priestSpells[1] >= low2 && character.priestSpells[1] <= high2).toBeTruthy(); // LVL 2 SPELLS
      expect(character.priestSpells[2] >= low3 && character.priestSpells[2] <= high3).toBeTruthy(); // LVL 3 SPELLS
      expect(character.priestSpells[3] >= low4 && character.priestSpells[3] <= high4).toBeTruthy(); // LVL 4 SPELLS
      expect(character.priestSpells[4] >= low5 && character.priestSpells[4] <= high5).toBeTruthy(); // LVL 5 SPELLS
      expect(character.priestSpells[5] >= low6 && character.priestSpells[5] <= high6).toBeTruthy(); // LVL 6 SPELLS
      expect(character.priestSpells[6] >= low7 && character.priestSpells[6] <= high7).toBeTruthy(); // LVL 7 SPELLS
    }
    expect(max[0]).toBeTruthy();
    expect(max[1]).toBeTruthy();
    expect(max[2]).toBeTruthy();
    expect(max[3]).toBeTruthy();
    expect(max[4]).toBeTruthy();
    expect(max[5]).toBeTruthy();
    expect(max[6]).toBeTruthy();
  });
});
