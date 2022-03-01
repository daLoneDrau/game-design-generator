import { TestScene } from "../testApp/TestScene.js";
import { WizardryCharacter} from "../../src/bus/wizardry-character.js";
import { WizardryConfig} from "../../src/config/wizardry-config.js";
import { WizardryAlignment,
  WizardryCharacterClass,
  WizardryConstants,
  WizardryXgoto} from "../../src/config/wizardry-constants.js";
import { WizardryBoltacBuyUi } from "../../src/scenes/castle/boltac/ui/wizardry-boltac-buy-ui.js";
import { WizardryBoltacIdentifyUi } from "../../src/scenes/castle/boltac/ui/wizardry-boltac-identify-ui.js";
import { WizardryBoltacMainUi } from "../../src/scenes/castle/boltac/ui/wizardry-boltac-main-ui";
import { WizardryBoltacPlayerUi } from "../../src/scenes/castle/boltac/ui/wizardry-boltac-player-ui";
import { WizardryBoltacSellUi } from "../../src/scenes/castle/boltac/ui/wizardry-boltac-sell-ui";
import { WizardryBoltacUncurseUi } from "../../src/scenes/castle/boltac/ui/wizardry-boltac-uncurse-ui.js";
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
  WizardryController.xgoto = WizardryXgoto.XBOLTAC;
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

  WizardryController.initializeEquipmentList([
    {
      _id: 0,
      _boltacXX: -1,
      _classUse: {
        PRIEST: true,
        MAGE: true,
        FIGHTER: true,
        THIEF: true,
        BISHOP: true,
        SAMURAI: true,
        LORD: true,
        NINJA: true,
      },
      _cursed: false,
      _name: "USABLE BY ALL",
      _nameUnknown: "USABLE BY ALL",
      _objType: { title: "WEAPON" },
      _price: 25
    },
    {
      _id: 1,
      _boltacXX: 3,
      _classUse: {
        PRIEST: false,
        MAGE: true,
        FIGHTER: false,
        THIEF: false,
        BISHOP: false,
        SAMURAI: false,
        LORD: false,
        NINJA: false,
      },
      _cursed: false,
      _name: "USABLE BY MAGE",
      _nameUnknown: "USABLE BY MAGE",
      _objType: { title: "WEAPON" },
      _price: 25
    },
    {
      _id: 2,
      _boltacXX: 3,
      _classUse: {
        PRIEST: false,
        MAGE: true,
        FIGHTER: true,
        THIEF: false,
        BISHOP: false,
        SAMURAI: false,
        LORD: false,
        NINJA: false,
      },
      _cursed: false,
      _name: "ONLY 3 IN SHOP",
      _nameUnknown: "ONLY 3 IN SHOP",
      _objType: { title: "WEAPON" },
      _price: 5
    }
  ]);
  WizardryController.initializeBoltacsInventory();
});
describe("testing the Shop Scene", () => {
  let range = 0.05, runs = 10000;
  test('You can always leave the Shop Main menu and return to the Market', () => {
    // given
    const ui = new WizardryBoltacMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_MAIN;

    // when
    ui.goToCastle();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XBOLTAC;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XBOLTAC;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XBOLTAC;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);

    // when
    WizardryController.xgoto = WizardryXgoto.XBOLTAC;
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
  });
  test('Keyboard entry in the Shop Main menu deals with invalid entries', () => {
    // given
    const ui = new WizardryBoltacMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_MAIN;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('Selecting a player in the Shop Main menu goes to the Player menu', () => {
    // given
    const ui = new WizardryBoltacMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_MAIN;

    // when - select a player by ref id
    ui.activateCharacter(WizardryController.roster[0].refId);

    // then
    expect(WizardryController.characterRecord).toBe(WizardryController.roster[0].refId);
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
  });
  test('Selecting a player by # in the Shop Main menu goes to the Player menu', () => {
    // given
    const ui = new WizardryBoltacMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_MAIN;

    // when - select a player by # in party
    WizardryController.addToParty(WizardryController.roster[0]);
    ui.handleKeyEntry("1");

    // then
    expect(WizardryController.characterRecord).toBe(WizardryController.roster[0].refId);
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
  });
  test('Selecting a player not in the party in the Shop Main menu displays error', () => {
    // given
    const ui = new WizardryBoltacMainUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_MAIN;

    // when - select a player by # in party
    ui.handleKeyEntry("1");

    // then
    expect(WizardryController.characterRecord).toBe("");
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('You can always leave the Shop Player menu and return to the Shop Main', () => {
    // given
    const ui = new WizardryBoltacPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;

    // when
    ui.exit();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._entryBlock.text = "";
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._entryBlock.text = "";
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._entryBlock.text = "";
    ui.handleKeyEntry("L");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._entryBlock.text = "";
    ui.handleKeyEntry("l");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_MAIN);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);
  });
  test('Keyboard entry in the Shop Player menu deals with invalid entries', () => {
    // given
    const ui = new WizardryBoltacPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('From the Shop Player menu you can go to the Shop Buy menu if you have gold', () => {
    // given
    const ui = new WizardryBoltacPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    ui.buy();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You don't have any gold.");

    // when
    ui._messageBlock.text = "";
    WizardryController.roster[0].gold = 100;
    ui.buy();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("b");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("B");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
  });
  test('From the Shop Player menu you can go to the Shop Sell menu if you have at least one item', () => {
    // given
    const ui = new WizardryBoltacPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    ui.sell();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You don't have any equipment.");

    // when
    ui._messageBlock.text = "";
    WizardryController.roster[0].addToInventory({equipped: false, identified: false, cursed: false, equipmentIndex: 0});
    ui.sell();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("s");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("S");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);
  });
  test('From the Shop Player menu you can go to the Shop Identify menu if you have at least one unidentified item', () => {
    // given
    const ui = new WizardryBoltacPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    ui.identify();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You don't have any unidentified equipment.");

    // when
    ui._messageBlock.text = "";
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: false,
      cursed: false,
      id: parseInt(0)
    });
    ui.identify();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_IDENTIFY_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("i");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_IDENTIFY_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("I");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_IDENTIFY_MENU);
  });
  test('From the Shop Player menu you can go to the Shop Uncurse menu if you have at least one cursed item', () => {
    // given
    const ui = new WizardryBoltacPlayerUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    ui.uncurse();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._messageBlock.text).toBe("You don't have any cursed equipment.");

    // when
    ui._messageBlock.text = "";
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: true,
      id: parseInt(0)
    });
    ui.uncurse();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_UNCURSE_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("u");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_UNCURSE_MENU);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_PLAYER_MENU;
    ui.handleKeyEntry("U");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_UNCURSE_MENU);
  });
  test('You can always leave the Shop Buy menu and return to the Shop Player menu', () => {
    // given
    const ui = new WizardryBoltacBuyUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;

    // when
    ui.exit();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    ui.handleKeyEntry("L");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;
    ui.handleKeyEntry("l");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);
  });
  test('Keyboard entry in the Shop Buy menu deals with invalid entries', () => {
    // given
    const ui = new WizardryBoltacBuyUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('Trying to purchase an item is allowed, if you have the cash and can use the item', () => {
    // given
    const ui = new WizardryBoltacBuyUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._inventoryItems = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
    ];
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;

    // when
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    ui.purchase(0);

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** YOU CANNOT AFFORD IT **");

    // when
    ui._messageBlock.text = "";
    WizardryController.roster[0].gold = 100;
    ui.purchase(0);

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** JUST WHAT YOU NEEDED **");
    expect(WizardryController.roster[0].gold).toBe(75);
    expect(WizardryController.roster[0].possessions.count).toBe(1);
    expect(WizardryController.roster[0].possessions.possession[0].equipmentIndex).toBe(0);
    expect(WizardryController.boltacsInventory["0"]).toBe(-1);

    // when
    ui._messageBlock.text = "";
    ui.handleKeyEntry("1");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** JUST WHAT YOU NEEDED **");
    expect(WizardryController.roster[0].gold).toBe(50);
    expect(WizardryController.roster[0].possessions.count).toBe(2);
    expect(WizardryController.roster[0].possessions.possession[1].equipmentIndex).toBe(0);
    expect(WizardryController.boltacsInventory["0"]).toBe(-1);

    // when
    ui._messageBlock.text = "";
    ui.handleKeyEntry("6");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
    expect(WizardryController.roster[0].gold).toBe(50);
    expect(WizardryController.roster[0].possessions.count).toBe(2);
    expect(WizardryController.roster[0].possessions.possession[1].equipmentIndex).toBe(0);
    expect(WizardryController.boltacsInventory["0"]).toBe(-1);
  });
  test('Trying to purchase an item requires confirmation if you cannot use the item', () => {
    // given
    const ui = new WizardryBoltacBuyUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._inventoryItems = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
    ];
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;

    // when -- PURCHASE MAGE ONLY ITEM
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].gold = 100;
    ui.purchase(1);

    // then - CONFIRMATION WINDOW SHOWS UP
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(ui._confirmPanel.isVisible).toBeTruthy();
    expect(WizardryController.roster[0].gold).toBe(100);
    expect(WizardryController.roster[0].possessions.count).toBe(0);

    // when - DO NOT CONFIRM PURCHASE
    ui.completePurchase(false);

    // then - NO ITEMS IN INVENTORY
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** WE ALL MAKE MISTAKES **");
    expect(ui._confirmPanel.isVisible).toBeFalsy();
    expect(WizardryController.roster[0].gold).toBe(100);
    expect(WizardryController.roster[0].possessions.count).toBe(0);
    expect(WizardryController.roster[0].possessions.possession[0].equipmentIndex).toBe(-1);

    // when -- PURCHASE MAGE ONLY ITEM
    ui._messageBlock.text = "";
    ui.handleKeyEntry("2");

    // then - CONFIRMATION WINDOW SHOWS UP
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(ui._confirmPanel.isVisible).toBeTruthy();
    expect(WizardryController.roster[0].gold).toBe(100);
    expect(WizardryController.roster[0].possessions.count).toBe(0);

    // when - CONFIRM PURCHASE
    ui.completePurchase(true);

    // then - 1 ITEM IN INVENTORY
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** ITS YOUR MONEY **");
    expect(ui._confirmPanel.isVisible).toBeFalsy();
    expect(WizardryController.roster[0].gold).toBe(75);
    expect(WizardryController.roster[0].possessions.count).toBe(1);
    expect(WizardryController.roster[0].possessions.possession[0].equipmentIndex).toBe(1);

    // when -- PURCHASE MAGE ONLY ITEM
    ui._messageBlock.text = "";
    ui.purchase(1);

    // then - CONFIRMATION WINDOW SHOWS UP
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(ui._confirmPanel.isVisible).toBeTruthy();
    expect(WizardryController.roster[0].gold).toBe(75);
    expect(WizardryController.roster[0].possessions.count).toBe(1);

    // when - DO NOT CONFIRM PURCHASE
    ui.handleKeyEntry("N");

    // then - 1 ITEM IN INVENTORY
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** WE ALL MAKE MISTAKES **");
    expect(ui._confirmPanel.isVisible).toBeFalsy();
    expect(WizardryController.roster[0].gold).toBe(75);
    expect(WizardryController.roster[0].possessions.count).toBe(1);
    expect(WizardryController.roster[0].possessions.possession[0].equipmentIndex).toBe(1);
    expect(WizardryController.roster[0].possessions.possession[1].equipmentIndex).toBe(-1);

    // when -- PURCHASE MAGE ONLY ITEM
    ui._messageBlock.text = "";
    ui.purchase(1);

    // then - CONFIRMATION WINDOW SHOWS UP
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(ui._confirmPanel.isVisible).toBeTruthy();
    expect(WizardryController.roster[0].gold).toBe(75);
    expect(WizardryController.roster[0].possessions.count).toBe(1);

    // when - CONFIRM PURCHASE
    ui.handleKeyEntry("Y");

    // then - 2 ITEMS IN INVENTORY
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** ITS YOUR MONEY **");
    expect(ui._confirmPanel.isVisible).toBeFalsy();
    expect(WizardryController.roster[0].gold).toBe(50);
    expect(WizardryController.roster[0].possessions.count).toBe(2);
    expect(WizardryController.roster[0].possessions.possession[0].equipmentIndex).toBe(1);
    expect(WizardryController.roster[0].possessions.possession[1].equipmentIndex).toBe(1);
  });
  test('Trying to purchase an item is not allowed if your pack is full', () => {
    // given
    const ui = new WizardryBoltacBuyUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._inventoryItems = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
    ];
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;

    // when - PURCHASE ITEM 0
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].gold = 1000;
    for (let i = 8; i > 0; i--) {
      ui.purchase(0);
    }

    // then - 8 ITEMS IN INVENTORY
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** JUST WHAT YOU NEEDED **");
    expect(WizardryController.roster[0].gold).toBe(800);
    expect(WizardryController.roster[0].possessions.count).toBe(8);
    for (let i = 7; i >= 0; i--) {
      expect(WizardryController.roster[0].possessions.possession[i].equipmentIndex).toBe(0);
    }
    expect(WizardryController.boltacsInventory["0"]).toBe(-1);

    // when - PURCHASE ITEM 0
    ui._messageBlock.text = "";
    ui.purchase(0);

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** YOU CANT CARRY ANYTHING MORE **");
    expect(WizardryController.roster[0].gold).toBe(800);
    expect(WizardryController.roster[0].possessions.count).toBe(8);
    for (let i = 7; i >= 0; i--) {
      expect(WizardryController.roster[0].possessions.possession[i].equipmentIndex).toBe(0);
    }
    expect(WizardryController.boltacsInventory["0"]).toBe(-1);
  });
  test('Purchasing limited items removes them from the Shop Inventory', () => {
    // given
    const ui = new WizardryBoltacBuyUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._inventoryItems = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        set: () => { }
      },
    ];
    ui._goldBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {},
      set: () => {}
    };
    ui._subTitleTextBlock = {
      text: ""
    };
    ui._parent.state = WizardryConstants.BOLTAC_BUY_MENU;

    // when - DISPLAY INVENTORY
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].gold = 1000;
    ui.set();

    // then - 3 ITEMS SHOULD BE DISPLAYED
    expect(ui._inventoryItems[0].isVisible).toBeTruthy();
    expect(ui._inventoryItems[0].name).toBe("0");
    expect(ui._inventoryItems[1].isVisible).toBeTruthy();
    expect(ui._inventoryItems[1].name).toBe("1");
    expect(ui._inventoryItems[2].isVisible).toBeTruthy();
    expect(ui._inventoryItems[2].name).toBe("2");
    expect(ui._inventoryItems[3].isVisible).toBeFalsy();
    expect(ui._inventoryItems[3].name).toBe("");
    expect(ui._inventoryItems[4].isVisible).toBeFalsy();
    expect(ui._inventoryItems[4].name).toBe("");
    expect(ui._inventoryItems[5].isVisible).toBeFalsy();
    expect(ui._inventoryItems[5].name).toBe("");
    expect(WizardryController.boltacsInventory["2"]).toBe(3);

    // when - BUY 3 OF #3
    for (let i = 3; i > 0; i--) {
      ui.purchase(2);
    }

    // then - 3 ITEMS IN INVENTORY
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** JUST WHAT YOU NEEDED **");
    expect(ui._inventoryItems[0].isVisible).toBeTruthy();
    expect(ui._inventoryItems[0].name).toBe("0");
    expect(ui._inventoryItems[1].isVisible).toBeTruthy();
    expect(ui._inventoryItems[1].name).toBe("1");
    expect(ui._inventoryItems[2].isVisible).toBeFalsy();
    expect(ui._inventoryItems[2].name).toBe("");
    expect(ui._inventoryItems[3].isVisible).toBeFalsy();
    expect(ui._inventoryItems[3].name).toBe("");
    expect(ui._inventoryItems[4].isVisible).toBeFalsy();
    expect(ui._inventoryItems[4].name).toBe("");
    expect(ui._inventoryItems[5].isVisible).toBeFalsy();
    expect(ui._inventoryItems[5].name).toBe("");
    expect(WizardryController.roster[0].gold).toBe(985);
    expect(WizardryController.roster[0].possessions.count).toBe(3);
    for (let i = 2; i >= 0; i--) {
      expect(WizardryController.roster[0].possessions.possession[i].equipmentIndex).toBe(2);
    }
    expect(WizardryController.boltacsInventory["2"]).toBe(0);

    // when - TRY TO PURCHASE ITEM 2
    ui._messageBlock.text = "";
    ui.handleKeyEntry("3");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_BUY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
    expect(WizardryController.roster[0].gold).toBe(985);
    expect(WizardryController.roster[0].possessions.count).toBe(3);
    for (let i = 2; i >= 0; i--) {
      expect(WizardryController.roster[0].possessions.possession[i].equipmentIndex).toBe(2);
    }
    expect(WizardryController.boltacsInventory["2"]).toBe(0);
  });
  test('You can always leave the Shop Sell menu and return to the Shop Player menu', () => {
    // given
    const ui = new WizardryBoltacSellUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;

    // when
    ui.exit();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);
  });
  test('Keyboard entry in the Shop Sell menu deals with invalid entries', () => {
    // given
    const ui = new WizardryBoltacSellUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('You can sell items in the Shop Sell menu. Identified items sell for 1/2 price, while unidentified sell for 1 gold piece. Sold items go back into shop inventory.', () => {
    // given
    const ui = new WizardryBoltacSellUi(new TestScene());
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
      set: () => { }
    };
    ui._inventoryItems = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
    ];
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;

    // when - GIVE PC POSSESSIONS AND SET THE UI
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: false,
      id: 0
    });
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: false,
      cursed: false,
      id: 2
    });
    ui.set();

    // then - UI DISPLAYS ALL POSSESSIONS
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(WizardryController.roster[0].gold).toBe(0);
    expect(WizardryController.boltacsInventory["2"]).toBe(3);
    expect(ui._inventoryItems[0].isVisible).toBeTruthy();
    expect(ui._inventoryItems[0].name).toBe("0");
    expect(ui._inventoryItems[1].isVisible).toBeTruthy();
    expect(ui._inventoryItems[1].name).toBe("1");
    expect(ui._inventoryItems[2].isVisible).toBeFalsy();
    expect(ui._inventoryItems[2].name).toBe("");
    expect(ui._inventoryItems[3].isVisible).toBeFalsy();
    expect(ui._inventoryItems[3].name).toBe("");
    expect(ui._inventoryItems[4].isVisible).toBeFalsy();
    expect(ui._inventoryItems[4].name).toBe("");
    expect(ui._inventoryItems[5].isVisible).toBeFalsy();
    expect(ui._inventoryItems[5].name).toBe("");
    expect(ui._inventoryItems[6].isVisible).toBeFalsy();
    expect(ui._inventoryItems[6].name).toBe("");
    expect(ui._inventoryItems[7].isVisible).toBeFalsy();
    expect(ui._inventoryItems[7].name).toBe("");

    // when - SELL ITEM IN SLOT 0 for 12 GOLD
    ui.sell("0");

    // then - PLAYER RECEIVED GOLD AND STILL SELLING. ONLY SLOT 0 VISIBLE
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** ANYTHING ELSE, SIRE? **");
    expect(WizardryController.roster[0].gold).toBe(12);
    expect(WizardryController.boltacsInventory["2"]).toBe(3);
    expect(ui._inventoryItems[0].isVisible).toBeTruthy();
    expect(ui._inventoryItems[0].name).toBe("0");
    expect(ui._inventoryItems[1].isVisible).toBeFalsy();
    expect(ui._inventoryItems[1].name).toBe("");
    expect(ui._inventoryItems[2].isVisible).toBeFalsy();
    expect(ui._inventoryItems[2].name).toBe("");
    expect(ui._inventoryItems[3].isVisible).toBeFalsy();
    expect(ui._inventoryItems[3].name).toBe("");
    expect(ui._inventoryItems[4].isVisible).toBeFalsy();
    expect(ui._inventoryItems[4].name).toBe("");
    expect(ui._inventoryItems[5].isVisible).toBeFalsy();
    expect(ui._inventoryItems[5].name).toBe("");
    expect(ui._inventoryItems[6].isVisible).toBeFalsy();
    expect(ui._inventoryItems[6].name).toBe("");
    expect(ui._inventoryItems[7].isVisible).toBeFalsy();
    expect(ui._inventoryItems[7].name).toBe("");

    // when - SELL UNIDENTIFIED ITEM IN SLOT 1 for 1 GOLD
    ui.handleKeyEntry("1");

    // then - PLAYER RECEIVED GOLD AND EXITS TO PLAYER MENU
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(WizardryController.roster[0].gold).toBe(13);
    expect(WizardryController.boltacsInventory["2"]).toBe(4);
  });
  test('You cannot sell cursed items in the Shop Sell menu', () => {
    // given
    const ui = new WizardryBoltacSellUi(new TestScene());
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
      set: () => { }
    };
    ui._inventoryItems = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
    ];
    ui._parent.state = WizardryConstants.BOLTAC_SELL_MENU;

    // when - GIVE PC POSSESSIONS AND SET THE UI
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: true,
      id: 0
    });
    ui.set();

    // then - UI DISPLAYS ALL POSSESSIONS
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(WizardryController.roster[0].gold).toBe(0);
    expect(ui._inventoryItems[0].isVisible).toBeTruthy();
    expect(ui._inventoryItems[0].name).toBe("0");
    expect(ui._inventoryItems[1].isVisible).toBeFalsy();
    expect(ui._inventoryItems[1].name).toBe("");
    expect(ui._inventoryItems[2].isVisible).toBeFalsy();
    expect(ui._inventoryItems[2].name).toBe("");
    expect(ui._inventoryItems[3].isVisible).toBeFalsy();
    expect(ui._inventoryItems[3].name).toBe("");
    expect(ui._inventoryItems[4].isVisible).toBeFalsy();
    expect(ui._inventoryItems[4].name).toBe("");
    expect(ui._inventoryItems[5].isVisible).toBeFalsy();
    expect(ui._inventoryItems[5].name).toBe("");
    expect(ui._inventoryItems[6].isVisible).toBeFalsy();
    expect(ui._inventoryItems[6].name).toBe("");
    expect(ui._inventoryItems[7].isVisible).toBeFalsy();
    expect(ui._inventoryItems[7].name).toBe("");

    // when - SELL ITEM IN SLOT 0 for 12 GOLD
    ui.handleKeyEntry("1");

    // then - PLAYER RECEIVED GOLD AND STILL SELLING. ONLY SLOT 0 VISIBLE
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_SELL_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** WE DONT BUY CURSED ITEMS **");
    expect(WizardryController.roster[0].gold).toBe(0);
    expect(ui._inventoryItems[0].isVisible).toBeTruthy();
    expect(ui._inventoryItems[0].name).toBe("0");
    expect(ui._inventoryItems[1].isVisible).toBeFalsy();
    expect(ui._inventoryItems[1].name).toBe("");
    expect(ui._inventoryItems[2].isVisible).toBeFalsy();
    expect(ui._inventoryItems[2].name).toBe("");
    expect(ui._inventoryItems[3].isVisible).toBeFalsy();
    expect(ui._inventoryItems[3].name).toBe("");
    expect(ui._inventoryItems[4].isVisible).toBeFalsy();
    expect(ui._inventoryItems[4].name).toBe("");
    expect(ui._inventoryItems[5].isVisible).toBeFalsy();
    expect(ui._inventoryItems[5].name).toBe("");
    expect(ui._inventoryItems[6].isVisible).toBeFalsy();
    expect(ui._inventoryItems[6].name).toBe("");
    expect(ui._inventoryItems[7].isVisible).toBeFalsy();
    expect(ui._inventoryItems[7].name).toBe("");
  });
  test('You can always leave the Shop Identify menu and return to the Shop Player menu', () => {
    // given
    const ui = new WizardryBoltacIdentifyUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;

    // when
    ui.exit();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);
  });
  test('Keyboard entry in the Shop Identify menu deals with invalid entries', () => {
    // given
    const ui = new WizardryBoltacIdentifyUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_IDENTIFY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('You can identify items in the Shop Identify menu. Identification costs 1/2 price. The character\'s inventory is untouched', () => {
    // given
    const ui = new WizardryBoltacIdentifyUi(new TestScene());
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
      set: () => { }
    };
    ui._displayRows = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
    ];
    ui._parent.state = WizardryConstants.BOLTAC_IDENTIFY_MENU;

    // when - GIVE PC POSSESSIONS (2 KNOWN, 2 UNKNOWN) AND SET THE UI
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: false,
      cursed: false,
      id: 0
    });
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: false,
      id: 2
    });
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: false,
      id: 1
    });
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: false,
      cursed: false,
      id: 1
    });
    ui.set();

    // then - UI DISPLAYS ONLY UNIDENTIFIED POSSESSIONS
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_IDENTIFY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(WizardryController.roster[0].gold).toBe(0);
    expect(ui._displayRows[0].isVisible).toBeTruthy();
    expect(ui._displayRows[0].name).toBe("0");
    expect(ui._displayRows[1].isVisible).toBeTruthy();
    expect(ui._displayRows[1].name).toBe("3");
    expect(ui._displayRows[2].isVisible).toBeFalsy();
    expect(ui._displayRows[2].name).toBe("");
    expect(ui._displayRows[3].isVisible).toBeFalsy();
    expect(ui._displayRows[3].name).toBe("");
    expect(ui._displayRows[4].isVisible).toBeFalsy();
    expect(ui._displayRows[4].name).toBe("");
    expect(ui._displayRows[5].isVisible).toBeFalsy();
    expect(ui._displayRows[5].name).toBe("");
    expect(ui._displayRows[6].isVisible).toBeFalsy();
    expect(ui._displayRows[6].name).toBe("");
    expect(ui._displayRows[7].isVisible).toBeFalsy();
    expect(ui._displayRows[7].name).toBe("");
    expect(WizardryController.roster[0].possessions.possession[0].identified).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[1].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[2].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[3].identified).toBeFalsy();

    // when - IDENTIFY ITEM IN SLOT 0 WHILE PLAYER HAS NO GOLD
    ui.identify("0");

    // then - ITEM NOT ID'D. ERROR MESSAGE DISPLAYED
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_IDENTIFY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** YOU CANT AFFORD THE FEE **");
    expect(WizardryController.roster[0].gold).toBe(0);
    expect(ui._displayRows[0].isVisible).toBeTruthy();
    expect(ui._displayRows[0].name).toBe("0");
    expect(ui._displayRows[1].isVisible).toBeTruthy();
    expect(ui._displayRows[1].name).toBe("3");
    expect(ui._displayRows[2].isVisible).toBeFalsy();
    expect(ui._displayRows[2].name).toBe("");
    expect(ui._displayRows[3].isVisible).toBeFalsy();
    expect(ui._displayRows[3].name).toBe("");
    expect(ui._displayRows[4].isVisible).toBeFalsy();
    expect(ui._displayRows[4].name).toBe("");
    expect(ui._displayRows[5].isVisible).toBeFalsy();
    expect(ui._displayRows[5].name).toBe("");
    expect(ui._displayRows[6].isVisible).toBeFalsy();
    expect(ui._displayRows[6].name).toBe("");
    expect(ui._displayRows[7].isVisible).toBeFalsy();
    expect(ui._displayRows[7].name).toBe("");
    expect(WizardryController.roster[0].possessions.possession[0].identified).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[1].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[2].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[3].identified).toBeFalsy();

    // when - IDENTIFY ITEM IN SLOT 1 for 12 GOLD
    WizardryController.roster[0].gold = 1000;
    ui.handleKeyEntry("1");

    // then - ITEM ID'D. PLAYER LOSES GOLD. MESSAGE DISPLAYED
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_IDENTIFY_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** ANYTHING ELSE, SIRE? **");
    expect(WizardryController.roster[0].gold).toBe(988);
    expect(ui._displayRows[0].isVisible).toBeTruthy();
    expect(ui._displayRows[0].name).toBe("3");
    expect(ui._displayRows[1].isVisible).toBeFalsy();
    expect(ui._displayRows[1].name).toBe("");
    expect(ui._displayRows[2].isVisible).toBeFalsy();
    expect(ui._displayRows[2].name).toBe("");
    expect(ui._displayRows[3].isVisible).toBeFalsy();
    expect(ui._displayRows[3].name).toBe("");
    expect(ui._displayRows[4].isVisible).toBeFalsy();
    expect(ui._displayRows[4].name).toBe("");
    expect(ui._displayRows[5].isVisible).toBeFalsy();
    expect(ui._displayRows[5].name).toBe("");
    expect(ui._displayRows[6].isVisible).toBeFalsy();
    expect(ui._displayRows[6].name).toBe("");
    expect(ui._displayRows[7].isVisible).toBeFalsy();
    expect(ui._displayRows[7].name).toBe("");
    expect(WizardryController.roster[0].possessions.possession[0].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[1].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[2].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[3].identified).toBeFalsy();

    // when - IDENTIFY ITEM IN SLOT 1 for 12 GOLD
    ui.handleKeyEntry("1");

    // then - ITEM ID'D. PLAYER LOSES GOLD. EXIT TO PLAYER MENU
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(WizardryController.roster[0].gold).toBe(976);
    expect(WizardryController.roster[0].possessions.possession[0].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[1].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[2].identified).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[3].identified).toBeTruthy();
  });
  test('You can always leave the Shop Uncurse menu and return to the Shop Player menu', () => {
    // given
    const ui = new WizardryBoltacUncurseUi(new TestScene());
    ui._confirmPanel = {
      isVisible: false
    };
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;

    // when
    ui.exit();

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;
    ui.handleKeyEntry("Enter");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;
    ui.handleKeyEntry("ENTER");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);

    // when
    ui._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;
    ui.handleKeyEntry("ESCAPE");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);
  });
  test('Keyboard entry in the Shop Uncurse menu deals with invalid entries', () => {
    // given
    const ui = new WizardryBoltacUncurseUi(new TestScene());
    ui._entryBlock = {
      text: ""
    };
    ui._messageBlock = {
      text: ""
    };
    ui._partyPanel = {
      resetHighlights: () => {}
    };
    ui._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;

    // when
    ui.handleKeyEntry("v");

    // then
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_UNCURSE_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("Huh?");
  });
  test('You can uncurse items in the Shop Uncurse menu. "Uncursing" costs 1/2 price and the item is destroyed afterwards.', () => {
    // given
    const ui = new WizardryBoltacUncurseUi(new TestScene());
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
      set: () => { }
    };
    ui._displayRows = [
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
      {
        container: { isVisible: true },
        name: "",
        isVisible: true,
        resetHighlights: () => {},
        set: () => { }
      },
    ];
    ui._parent.state = WizardryConstants.BOLTAC_UNCURSE_MENU;

    // when - GIVE PC POSSESSIONS (2 CURSED, 2 UCNURSED) AND SET THE UI
    WizardryController.characterRecord = WizardryController.roster[0].refId;
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: true,
      id: 0
    });
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: false,
      id: 2
    });
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: true,
      cursed: false,
      id: 1
    });
    WizardryController.roster[0].addToInventory({
      equipped: false,
      identified: false,
      cursed: true,
      id: 1
    });
    ui.set();

    // then - UI DISPLAYS ONLY CURSED POSSESSIONS
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_UNCURSE_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(WizardryController.roster[0].gold).toBe(0);
    expect(ui._displayRows[0].isVisible).toBeTruthy();
    expect(ui._displayRows[0].name).toBe("0");
    expect(ui._displayRows[1].isVisible).toBeTruthy();
    expect(ui._displayRows[1].name).toBe("3");
    expect(ui._displayRows[2].isVisible).toBeFalsy();
    expect(ui._displayRows[2].name).toBe("");
    expect(ui._displayRows[3].isVisible).toBeFalsy();
    expect(ui._displayRows[3].name).toBe("");
    expect(ui._displayRows[4].isVisible).toBeFalsy();
    expect(ui._displayRows[4].name).toBe("");
    expect(ui._displayRows[5].isVisible).toBeFalsy();
    expect(ui._displayRows[5].name).toBe("");
    expect(ui._displayRows[6].isVisible).toBeFalsy();
    expect(ui._displayRows[6].name).toBe("");
    expect(ui._displayRows[7].isVisible).toBeFalsy();
    expect(ui._displayRows[7].name).toBe("");
    expect(WizardryController.roster[0].possessions.count).toBe(4);
    expect(WizardryController.roster[0].possessions.possession[0].cursed).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[1].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[2].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[3].cursed).toBeTruthy();

    // when - UNCURSE ITEM IN SLOT 0 WHILE PLAYER HAS NO GOLD
    ui.uncurse("0");

    // then - ITEM NOT UNCURSED. ERROR MESSAGE DISPLAYED
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_UNCURSE_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** YOU CANT AFFORD THE FEE **");
    expect(WizardryController.roster[0].gold).toBe(0);
    expect(ui._displayRows[0].isVisible).toBeTruthy();
    expect(ui._displayRows[0].name).toBe("0");
    expect(ui._displayRows[1].isVisible).toBeTruthy();
    expect(ui._displayRows[1].name).toBe("3");
    expect(ui._displayRows[2].isVisible).toBeFalsy();
    expect(ui._displayRows[2].name).toBe("");
    expect(ui._displayRows[3].isVisible).toBeFalsy();
    expect(ui._displayRows[3].name).toBe("");
    expect(ui._displayRows[4].isVisible).toBeFalsy();
    expect(ui._displayRows[4].name).toBe("");
    expect(ui._displayRows[5].isVisible).toBeFalsy();
    expect(ui._displayRows[5].name).toBe("");
    expect(ui._displayRows[6].isVisible).toBeFalsy();
    expect(ui._displayRows[6].name).toBe("");
    expect(ui._displayRows[7].isVisible).toBeFalsy();
    expect(ui._displayRows[7].name).toBe("");
    expect(WizardryController.roster[0].possessions.count).toBe(4);
    expect(WizardryController.roster[0].possessions.possession[0].cursed).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[1].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[2].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[3].cursed).toBeTruthy();

    // when - UNCURSE ITEM IN SLOT 1 for 12 GOLD
    WizardryController.roster[0].gold = 1000;
    ui.handleKeyEntry("1");

    // then - ITEM UNCURSED. PLAYER LOSES GOLD AND ITEM. MESSAGE DISPLAYED
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_UNCURSE_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("** ANYTHING ELSE, SIRE? **");
    expect(WizardryController.roster[0].gold).toBe(988);
    expect(ui._displayRows[0].isVisible).toBeTruthy();
    expect(ui._displayRows[0].name).toBe("2");
    expect(ui._displayRows[1].isVisible).toBeFalsy();
    expect(ui._displayRows[1].name).toBe("");
    expect(ui._displayRows[2].isVisible).toBeFalsy();
    expect(ui._displayRows[2].name).toBe("");
    expect(ui._displayRows[3].isVisible).toBeFalsy();
    expect(ui._displayRows[3].name).toBe("");
    expect(ui._displayRows[4].isVisible).toBeFalsy();
    expect(ui._displayRows[4].name).toBe("");
    expect(ui._displayRows[5].isVisible).toBeFalsy();
    expect(ui._displayRows[5].name).toBe("");
    expect(ui._displayRows[6].isVisible).toBeFalsy();
    expect(ui._displayRows[6].name).toBe("");
    expect(ui._displayRows[7].isVisible).toBeFalsy();
    expect(ui._displayRows[7].name).toBe("");
    expect(WizardryController.roster[0].possessions.count).toBe(3);
    expect(WizardryController.roster[0].possessions.possession[0].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[1].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[2].cursed).toBeTruthy();
    expect(WizardryController.roster[0].possessions.possession[3].cursed).toBeFalsy();

    // when - UNCURSE ITEM IN SLOT 1 for 12 GOLD
    ui.handleKeyEntry("1");

    // then - ITEM UNCURSED. PLAYER LOSES GOLD AND ITEM. EXIT TO PLAYER MENU
    expect(ui._parent.state).toBe(WizardryConstants.BOLTAC_PLAYER_MENU);
    expect(ui._entryBlock.text).toBe("");
    expect(ui._messageBlock.text).toBe("");
    expect(WizardryController.roster[0].gold).toBe(976);
    expect(WizardryController.roster[0].possessions.count).toBe(2);
    expect(WizardryController.roster[0].possessions.possession[0].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[1].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[2].cursed).toBeFalsy();
    expect(WizardryController.roster[0].possessions.possession[3].cursed).toBeFalsy();
  });
});
