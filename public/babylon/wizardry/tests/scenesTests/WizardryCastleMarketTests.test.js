import { TestScene } from "../testApp/TestScene.js";
import { WizardryConfig} from "../../src/config/wizardry-config.js";
import { WizardryXgoto} from "../../src/config/wizardry-constants.js";
import { WizardryMarketMainUi } from "../../src/scenes/castle/market/ui/wizardry-market-main-ui.js";
import { WizardryController } from "../../src/services/wizardry-controller.js";

global.globalJson = {};
global.jsonp = function jsonp(data) {
  globalJson = data;
}
require("../../src/dat/wizardry-data.jsonp")

beforeAll(() => {
  WizardryConfig.init();
});
beforeEach(() => {
  WizardryController.xgoto = WizardryXgoto.XCASTLE;
  WizardryController.partyCnt = 0;
});
describe("testing the WizardryCastleMarketTests class", () => {
  let range = 0.05, runs = 10000;
  test('User cannot enter the Inn if the party is empty', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    marketUi.goToAdventurersInn();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("No need to visit the Inn if there are no adventurers in the party.");
  });
  test('User can enter the Inn if the party has at least one member', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    WizardryController.partyCnt = 1;
    marketUi.goToAdventurersInn();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XADVNTINN);
    expect(marketUi._messageBlock.text).toBe("");
  });
  test('Keyboard entry for the Inn works as expected', () => {
    // given
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    
    // when
    marketUi.handleKeyEntry("a");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("No need to visit the Inn if there are no adventurers in the party.");
    
    // when
    marketUi.handleKeyEntry("A");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("No need to visit the Inn if there are no adventurers in the party.");
    
    // when
    WizardryController.partyCnt = 1;
    marketUi.handleKeyEntry("A");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XADVNTINN);
  });
  test('User cannot enter the Shop if the party is empty', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    marketUi.goToBoltacsTradingPost();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("There's no one in the party to buy or sell at the Trading Post.");
  });
  test('User can enter the Shop if the party has at least one member', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    WizardryController.partyCnt = 1;
    marketUi.goToBoltacsTradingPost();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);
    expect(marketUi._messageBlock.text).toBe("");
  });
  test('Keyboard entry for the Shop works as expected', () => {
    // given
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    
    // when
    marketUi.handleKeyEntry("b");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("There's no one in the party to buy or sell at the Trading Post.");
    
    // when
    marketUi.handleKeyEntry("B");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("There's no one in the party to buy or sell at the Trading Post.");
    
    // when
    WizardryController.partyCnt = 1;
    marketUi.handleKeyEntry("b");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XBOLTAC);
  });
  test('User can always go to the Edge of Town', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    marketUi.goToEdgeOfTown();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XEDGTOWN);
    expect(marketUi._messageBlock.text).toBe("");
  });
  test('Keyboard entry for the Edge of Town works as expected', () => {
    // given
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    
    // when
    marketUi.handleKeyEntry("e");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XEDGTOWN);
    expect(marketUi._messageBlock.text).toBe("");
    
    // when
    WizardryController.xgoto = WizardryXgoto.XCASTLE;
    marketUi.handleKeyEntry("E");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XEDGTOWN);
    expect(marketUi._messageBlock.text).toBe("");
  });
  test('User can always go to the Tavern', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    marketUi.goToGilgameshTavern();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XGILGAMS);
    expect(marketUi._messageBlock.text).toBe("");
  });
  test('Keyboard entry for the Tavern works as expected', () => {
    // given
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    
    // when
    marketUi.handleKeyEntry("g");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XGILGAMS);
    expect(marketUi._messageBlock.text).toBe("");
    
    // when
    WizardryController.xgoto = WizardryXgoto.XCASTLE;
    marketUi.handleKeyEntry("G");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XGILGAMS);
    expect(marketUi._messageBlock.text).toBe("");
  });
  test('User cannot enter the Temple if the party is empty', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    marketUi.goToTempleOfCant();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("Why the Temple? The party has no adventurers to restore.");
  });
  test('User can enter the Temple if the party has at least one member', () => {
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    WizardryController.partyCnt = 1;
    marketUi.goToTempleOfCant();
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCANT);
    expect(marketUi._messageBlock.text).toBe("");
  });
  test('Keyboard entry for the Temple works as expected', () => {
    // given
    const marketUi = new WizardryMarketMainUi(new TestScene());
    marketUi._messageBlock = {
      text: ""
    };
    
    // when
    marketUi.handleKeyEntry("c");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("Why the Temple? The party has no adventurers to restore.");
    
    // when
    marketUi.handleKeyEntry("C");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCASTLE);
    expect(marketUi._messageBlock.text).toBe("Why the Temple? The party has no adventurers to restore.");
    
    // when
    WizardryController.partyCnt = 1;
    marketUi.handleKeyEntry("c");

    // then
    expect(WizardryController.xgoto).toBe(WizardryXgoto.XCANT);
  });
});
