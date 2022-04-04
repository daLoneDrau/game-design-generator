import { TestScene } from "../testApp/TestScene.js";
import { WizardryCharacter} from "../../src/bus/wizardry-character.js";
import { WizardryConfig} from "../../src/config/wizardry-config.js";
import { WizardryAlignment,
  WizardryAttribute,
  WizardryCharacterClass,
  WizardryCharacterStatus,
  WizardryConstants,
  WizardryXgoto} from "../../src/config/wizardry-constants.js";
import { WizardryEdgeTownMainUi } from "../../src/scenes/castle/edgetown/ui/wizardry-edge-town-main-ui.js";
import { WizardryEdgeTownMazeUi } from "../../src/scenes/castle/edgetown/ui/wizardry-edge-town-maze-ui.js";
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
  WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
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
describe("testing the Edge of Town Scene", () => {
  let range = 0.05, runs = 10000;
  test('You can always leave the Edge of Town Main menu and return to the Market', () => {
    // given
    const ui = new WizardryEdgeTownMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAIN;

    // when
    ui.goToCastle();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
  });
  test('You can always leave the Edge of Town Main menu and go to the Training Grounds', () => {
    // given
    const ui = new WizardryEdgeTownMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAIN;

    // when
    ui.goToTrainingGrounds();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XTRAININ);

    // when
    WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("t");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XTRAININ);

    // when
    WizardryController.xgoto = WizardryXgoto.XEDGTOWN;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("T");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XTRAININ);
  });
  test('If noone is in the party, you can\'t go to the Maze', () => {
    // given
    const ui = new WizardryEdgeTownMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAIN;

    // when
    ui.goToMaze();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XEDGTOWN);
    expect(ui._messageBlock.text).toBe("Huh?");

    // when
    ui._messageBlock.text = "";
    ui.handleKeyEntry("m");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XEDGTOWN);
    expect(ui._messageBlock.text).toBe("Huh?");

    // when
    ui._messageBlock.text = "";
    ui.handleKeyEntry("M");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XEDGTOWN);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('If at least one is in the party, you can go to the Maze', () => {
    // given
    const ui = new WizardryEdgeTownMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAIN;

    // when
    WizardryController.addToParty(WizardryController.roster[0]);
    ui.goToMaze();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAZE);

    // when
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAIN;
    ui.handleKeyEntry("m");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAZE);

    // when
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAIN;
    ui.handleKeyEntry("M");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAZE);
  });
  test('Keyboard entry in the Inn Main menu deals with invalid entries', () => {
    // given
    const ui = new WizardryEdgeTownMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAIN;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('The Maze UI just takes the player to the next state', () => {
    // given
    const ui = new WizardryEdgeTownMazeUi(new TestScene());
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
      resetHighlights: () => {},
      set: () => {}
    };
    ui._parent.state = WizardryConstants.EDGE_TOWN_MAZE;

    // when
    ui.set();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.EDGE_TOWN_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XNEWMAZE);
    expect(WizardryController.mazeData.mazeX).toBe(0);
    expect(WizardryController.mazeData.mazeY).toBe(0);
    expect(WizardryController.mazeData.mazeLev).toBe(-1);
    expect(WizardryController.directIo).toBe(0);
  });
});
