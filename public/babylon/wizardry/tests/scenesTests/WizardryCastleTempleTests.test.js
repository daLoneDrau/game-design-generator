import { TestScene } from "../testApp/TestScene.js";
import { WizardryCharacter} from "../../src/bus/wizardry-character.js";
import { WizardryConfig} from "../../src/config/wizardry-config.js";
import { WizardryAlignment,
  WizardryAttribute,
  WizardryCharacterClass,
  WizardryCharacterStatus,
  WizardryConstants,
  WizardryXgoto} from "../../src/config/wizardry-constants.js";
import { WizardryCantMainUi } from "../../src/scenes/castle/cant/ui/wizardry-cant-main-ui.js";
import { WizardryCantPayUi }  from "../../src/scenes/castle/cant/ui/wizardry-cant-pay-ui.js";
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
  WizardryController.xgoto = WizardryXgoto.XCANT;
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
describe("testing the Temple Scene", () => {
  let range = 0.05, runs = 10000;
  test('You can always leave the Temple Main menu and return to the Market', () => {
    // given
    const ui = new WizardryCantMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_MAIN;

    // when
    ui.goToCastle();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XCANT;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XCANT;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XCANT;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XCANT;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
  });
  test('Keyboard entry in the Temple Main menu deals with invalid entries', () => {
    // given
    const ui = new WizardryCantMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_MAIN;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('Selecting an unavailable/healthy player in the Temple Main menu results in an error message', () => {
    // given
    const ui = new WizardryCantMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_MAIN;
    const character = WizardryController.roster[0];

    // when - select a player by ref id
    character.lostXyl.location[0] = 1;
    character.inMaze = false;
    ui.activateCharacter(character.refId);

    // then
    expect(WizardryController.characterRecord).toBe("");
    expect(ui._messageBlock.text).toBe([character.name, " IS NOT HERE"].join(""));
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);

    // when - select a player by ref id
    character.lostXyl.location[0] = 0;
    character.status = WizardryCharacterStatus.LOST;
    character.inMaze = false;
    ui.activateCharacter(character.refId);

    // then
    expect(WizardryController.characterRecord).toBe("");
    expect(ui._messageBlock.text).toBe([character.name, " IS LOST"].join(""));
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);

    // when - select a player by ref id
    character.status = WizardryCharacterStatus.OK;
    ui.activateCharacter(character.refId);

    // then
    expect(WizardryController.characterRecord).toBe("");
    expect(ui._messageBlock.text).toBe([character.name, " IS OK"].join(""));
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
  });
  test('Selecting an unhealthy player in the Temple Main menu goes to the Temple Pay menu', () => {
    // given
    const ui = new WizardryCantMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_MAIN;
    const character = WizardryController.roster[0];

    // when - select a player by ref id
    WizardryController.addToParty(character);
    character.status = WizardryCharacterStatus.PLYZE;
    ui.activateCharacter(character.refId);

    // then
    expect(WizardryController.characterRecord).toBe(character.refId);
    expect(ui._messageBlock.text).toBe("");
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);

    // when - select a player by ref id
    WizardryController.characterRecord = "";
    ui._parent.state = WizardryConstants.CANT_MAIN;
    ui.handleKeyEntry("1");

    // then
    expect(WizardryController.characterRecord).toBe(character.refId);
    expect(ui._messageBlock.text).toBe("");
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
  });
  test('Curing Paralysis costs 100 gold/character level', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;
    const character = WizardryController.roster[0];

    // when - set level 1
    character.status = WizardryCharacterStatus.PLYZE;
    WizardryController.characterRecord = character.refId;
    character.charLev = 1;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(100);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 100");

    // when - set level 8
    character.status = WizardryCharacterStatus.PLYZE;
    WizardryController.characterRecord = character.refId;
    character.charLev = 8;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(800);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 800");
  });
  test('Curing Stoned costs 200 gold/character level', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;
    const character = WizardryController.roster[0];

    // when - set level 1
    character.status = WizardryCharacterStatus.STONED;
    WizardryController.characterRecord = character.refId;
    character.charLev = 1;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(200);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 200");

    // when - set level 8
    WizardryController.characterRecord = character.refId;
    character.charLev = 8;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(1600);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 1600");
  });
  test('Curing Dead costs 250 gold/character level', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;
    const character = WizardryController.roster[0];

    // when - set level 1
    character.status = WizardryCharacterStatus.DEAD;
    WizardryController.characterRecord = character.refId;
    character.charLev = 1;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(250);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 250");

    // when - set level 8
    character.charLev = 8;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(2000);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 2000");
  });
  test('Curing Ashes costs 500 gold/character level', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;
    const character = WizardryController.roster[0];

    // when - set level 1
    character.status = WizardryCharacterStatus.ASHES;
    WizardryController.characterRecord = character.refId;
    character.charLev = 1;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(500);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 500");

    // when - set level 8
    character.charLev = 8;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(4000);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 4000");
  });
  test('Being unable to afford a cure results in an error message', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;
    const character = WizardryController.roster[0];

    // when - set level 1
    character.status = WizardryCharacterStatus.PLYZE;
    WizardryController.characterRecord = character.refId;
    character.charLev = 1;
    ui.set();
    ui.activateCharacter(character.refId);

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(100);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 100");
    expect(ui._messageBlock.text).toBe("** CHEAP APOSTATES! OUT! **");

    // when - set level 8
    character.status = WizardryCharacterStatus.PLYZE;
    WizardryController.characterRecord = character.refId;
    character.charLev = 8;
    ui.set();

    // then
    expect(ui._currentPhase).toBe(0);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(ui._donationNeeded).toBe(800);
    expect(ui._donationBlock.text).toBe("THE DONATION WILL BE 800");
  });
  test('Paralysis can be healed automatically', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._chants = [
      { color: "" },
      { color: "" },
      { color: "" },
      { color: "" }
    ]
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._resultBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;
    const character = WizardryController.roster[0];
    character.age = 52 * 18;
    const age = character.age;

    // when - set level 1
    character.status = WizardryCharacterStatus.PLYZE;
    WizardryController.characterRecord = character.refId;
    character.charLev = 1;
    character.gold = 100
    ui.set();
    ui.activateCharacter(character.refId);

    // then
    expect(ui._currentPhase).toBe(2);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(character.status).toBe(WizardryCharacterStatus.OK);
    expect(character.gold).toBe(0);
    expect(character.age >= age + 1 && character.age <= age + 52).toBeTruthy();
    expect(ui._entryGrid.isVisible).toBeFalsy();
    expect(ui._healingGrid.isVisible).toBeTruthy();
    expect(ui._resultBlock.text).toBe("Name0 IS WELL");
    expect(ui._chants[0].color).toBe("rgb(166, 161, 255)");
    expect(ui._chants[1].color).toBe("rgb(166, 161, 255)");
    expect(ui._chants[2].color).toBe("rgb(166, 161, 255)");
    expect(ui._chants[3].color).toBe("rgb(166, 161, 255)");

    // when
    ui.exit();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
  });
  test('Stoned can be healed automatically', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._chants = [
      { color: "" },
      { color: "" },
      { color: "" },
      { color: "" }
    ]
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._resultBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;
    const character = WizardryController.roster[0];
    character.age = 52 * 18;
    const age = character.age;

    // when - set level 1
    character.status = WizardryCharacterStatus.STONED;
    WizardryController.characterRecord = character.refId;
    character.charLev = 1;
    character.gold = 200;
    ui.set();
    ui.activateCharacter(character.refId);

    // then
    expect(ui._currentPhase).toBe(2);
    expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
    expect(character.status).toBe(WizardryCharacterStatus.OK);
    expect(character.gold).toBe(0);
    expect(character.age >= age + 1 && character.age <= age + 52).toBeTruthy();
    expect(ui._entryGrid.isVisible).toBeFalsy();
    expect(ui._healingGrid.isVisible).toBeTruthy();
    expect(ui._resultBlock.text).toBe("Name0 IS WELL");
    expect(ui._chants[0].color).toBe("rgb(166, 161, 255)");
    expect(ui._chants[1].color).toBe("rgb(166, 161, 255)");
    expect(ui._chants[2].color).toBe("rgb(166, 161, 255)");
    expect(ui._chants[3].color).toBe("rgb(166, 161, 255)");

    // when
    ui.handleKeyEntry("Escape");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.CANT_MAIN);
  });
  test('A player with VIT 9 can be raised from the Dead 77% of the time', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._chants = [
      { color: "" },
      { color: "" },
      { color: "" },
      { color: "" }
    ]
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._resultBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;

    let success = 0, failure = 0;

    for (let i = runs; i > 0; i--) {
      // when - raise from dead
      const character = WizardryController.roster[0];
      WizardryController.addToParty(character);
      character.setAttribute(WizardryAttribute.VITALITY, 9);
      character.age = 52 * 18;
      const age = character.age;
      character.status = WizardryCharacterStatus.DEAD;
      WizardryController.characterRecord = character.refId;
      character.charLev = 1;
      character.gold = 250;
      character.hpMax = 9;
      ui._currentPhase = 0;
      ui.set();
      ui.activateCharacter(character.refId);

      // then
      if (character.status === WizardryCharacterStatus.OK) {
        expect(character.hpLeft).toBe(1);
        expect(character.age >= age + 1 && character.age <= age + 52).toBeTruthy();
        expect(ui._resultBlock.text).toBe("Name0 IS WELL");
        success++;
      } else if (character.status === WizardryCharacterStatus.ASHES) {
        expect(ui._resultBlock.text).toBe("Name0 NEEDS KADORTO NOW");
        expect(character.inMaze).toBeFalsy();
        failure++;
      } else {
        throw ["Unexpected status",i, character.status]
      }
      expect(ui._currentPhase).toBe(2);
      expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
      expect(character.gold).toBe(0);
      expect(ui._entryGrid.isVisible).toBeFalsy();
      expect(ui._healingGrid.isVisible).toBeTruthy();
      expect(ui._chants[0].color).toBe("rgb(166, 161, 255)");
      expect(ui._chants[1].color).toBe("rgb(166, 161, 255)");
      expect(ui._chants[2].color).toBe("rgb(166, 161, 255)");
      expect(ui._chants[3].color).toBe("rgb(166, 161, 255)");
    }

    expect(success + failure).toBe(runs);
    expect(success / runs >= 0.77 - range && success / runs <= 0.77 + range).toBeTruthy();
  });
  test('A player with VIT 9 can be raised from Ashes 67% of the time', () => {
    // given
    const ui = new WizardryCantPayUi(new TestScene());
    ui._chants = [
      { color: "" },
      { color: "" },
      { color: "" },
      { color: "" }
    ]
    ui._donationBlock = {
      text: ""
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._resultBlock = {
      text: ""
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._entryGrid = {
      isVisible: true
    };
    ui._healingGrid = {
      isVisible: true
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.CANT_PAY;

    let success = 0, failure = 0;

    for (let i = runs; i > 0; i--) {
      // when - raise from dead
      const character = WizardryController.roster[0];
      WizardryController.addToParty(character);
      character.setAttribute(WizardryAttribute.VITALITY, 9);
      character.hpMax = 9;
      character.age = 52 * 18;
      const age = character.age;
      character.status = WizardryCharacterStatus.ASHES;
      WizardryController.characterRecord = character.refId;
      character.charLev = 1;
      character.gold = 500;
      ui._currentPhase = 0;
      ui.set();
      ui.activateCharacter(character.refId);

      // then
      if (character.status === WizardryCharacterStatus.OK) {
        expect(character.hpLeft).toBe(character.hpMax);
        expect(character.age >= age + 1 && character.age <= age + 52).toBeTruthy();
        expect(ui._resultBlock.text).toBe("Name0 IS WELL");
        success++;
      } else if (character.status === WizardryCharacterStatus.LOST) {
        expect(ui._resultBlock.text).toBe("Name0 WILL BE BURIED");
        expect(character.inMaze).toBeFalsy();
        failure++;
      } else {
        throw ["Unexpected status",i, character.status]
      }
      expect(ui._currentPhase).toBe(2);
      expect(ui._parent.state).toBe(WizardryConstants.CANT_PAY);
      expect(character.gold).toBe(0);
      expect(ui._entryGrid.isVisible).toBeFalsy();
      expect(ui._healingGrid.isVisible).toBeTruthy();
      expect(ui._chants[0].color).toBe("rgb(166, 161, 255)");
      expect(ui._chants[1].color).toBe("rgb(166, 161, 255)");
      expect(ui._chants[2].color).toBe("rgb(166, 161, 255)");
      expect(ui._chants[3].color).toBe("rgb(166, 161, 255)");
    }

    expect(success + failure).toBe(runs);
    expect(success / runs >= 0.67 - range && success / runs <= 0.67 + range).toBeTruthy();
  });
});
