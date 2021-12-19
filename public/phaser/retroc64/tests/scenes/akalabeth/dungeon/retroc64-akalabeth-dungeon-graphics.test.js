/**
 * @jest-environment jsdom
 */
const { RetroC64Config } = require("../../../../src/config/retroc64-config");
const { RetroC64AkalabethDungeonGraphics } = require("../../../../src/scenes/akalabeth/dungeon/retroc64-akalabeth-dungeon-graphics");

beforeAll(() => {
  RetroC64Config.init();
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("testing the AkalabethDungeonGraphicsTest class", () => {
  let range = 0.05, runs = 10000;
  /************
   * RENDER
   */
  test("Test the dungeon render", () => {
    let dungeonGraphics = new RetroC64AkalabethDungeonGraphics({});
    RetroC64AkalabethController.world.levelsUnderground = 1;
    RetroC64AkalabethController.world.newWorld();
    RetroC64AkalabethController.dungeon.newDungeonLevel();
    RetroC64AkalabethController.world.dx = 1;
    RetroC64AkalabethController.world.dy = 0;
    RetroC64AkalabethController.world.px = 1;
    RetroC64AkalabethController.world.py = 1;
    dungeonGraphics.render(0, 0);
    expect(true).toBeTruthy();
  });
});
