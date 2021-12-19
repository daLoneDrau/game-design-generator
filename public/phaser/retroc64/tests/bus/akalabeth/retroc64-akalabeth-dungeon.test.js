/**
 * @jest-environment jsdom
 */
const { RetroC64Config } = require("../../../src/config/retroc64-config");
const { RetroC64AkalabethDungeon } = require("../../../src/bus/akalabeth/retroc64-akalabeth-dungeon");
const { RetroC64AkalabethController } = require("../../../src/services/akalabeth/retroc64-akalabeth-controller");

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

describe("testing the AkalabethDungeonTest class", () => {
  let range = 0.05, runs = 10000;
  /************
   * RAYCASTING
   */
  test("Raycasting in each direction returns the expected cells in order", () => {
    // given
    let dungeon = new RetroC64AkalabethDungeon();
    RetroC64AkalabethController.levelsUnderground = 1;
    dungeon.dx = 1;
    dungeon.dy = 0;
    dungeon.px = 1;
    dungeon.py = 1;
    
    // when
    dungeon.newDungeonLevel();
    
    // empty the dungeon
    for (let y = 1, ly = 10; y < ly; y++) {
      let r = [];
      for (let x = 1, lx = 10; x < lx; x++) {
        dungeon.getDungeonCell(x, y).occupant = 0;
      }
    }
    let min = 1, max = 9;
    dungeon.px = 5;
    dungeon.py = 5;
    let rayCast = dungeon.raycastQuadrant(5);
    // then - test facing east
    expect(rayCast[rayCast.length - 1].vector2.x).toBe(max);
    expect(rayCast[rayCast.length - 1].vector2.y).toBe(max);
    
    // when
    dungeon.dx = -1;
    dungeon.dy = 0;
    rayCast = dungeon.raycastQuadrant(5);
    
    // then - test facing west
    expect(rayCast[rayCast.length - 1].vector2.x).toBe(min);
    expect(rayCast[rayCast.length - 1].vector2.y).toBe(min);
    
    // when
    dungeon.dx = 0;
    dungeon.dy = 1;
    rayCast = dungeon.raycastQuadrant(5);
    
    // then - test facing south
    expect(rayCast[rayCast.length - 1].vector2.x).toBe(min);
    expect(rayCast[rayCast.length - 1].vector2.y).toBe(max);
    
    // when
    dungeon.dx = 0;
    dungeon.dy = -1;
    rayCast = dungeon.raycastQuadrant(5);
    
    // then - test facing north
    expect(rayCast[rayCast.length - 1].vector2.x).toBe(max);
    expect(rayCast[rayCast.length - 1].vector2.y).toBe(min);
  });
  
  /************
   * SHADOWCASTING
   */
   test("Shadowcasting returns rings in the correct order", () => {
    // given
    let dungeon = new RetroC64AkalabethDungeon();
    RetroC64AkalabethController.levelsUnderground = 1;
    dungeon.dx = 1;
    dungeon.dy = 0;
    dungeon.px = 1;
    dungeon.py = 1;
    
    // when
    dungeon.newDungeonLevel();
    
    // empty the dungeon
    for (let y = 1, ly = 9; y < ly; y++) {
      let r = [];
      for (let x = 1, lx = 9; x < lx; x++) {
        dungeon.getDungeonCell(x, y).occupant = 0;
      }
    }
    let rings = dungeon.getRings8Topolgy(1);
    expect(rings.length).toBe(1);
    expect(rings[0].length).toBe(8);
    let map = {};
    for (let i = rings[0].length - 1; i >= 0; i--) {
      map[[rings[0][i].vector.x,rings[0][i].vector.y].join(",")] = rings[0][i];
    }
    expect(Object.keys(map).length).toBe(8);

    rings = dungeon.getRings8Topolgy(2);
    expect(rings.length).toBe(2);
    expect(rings[0].length).toBe(8);
    expect(rings[1].length).toBe(16);
    map = {};
    for (let i = rings[0].length - 1; i >= 0; i--) {
      map[[rings[0][i].vector.x,rings[0][i].vector.y].join(",")] = rings[0][i];
    }
    for (let i = rings[1].length - 1; i >= 0; i--) {
      map[[rings[1][i].vector.x,rings[1][i].vector.y].join(",")] = rings[1][i];
    }
    expect(Object.keys(map).length).toBe(24);

    rings = dungeon.getRings8Topolgy(5);
    expect(rings.length).toBe(5);
    expect(rings[0].length).toBe(8);
    expect(rings[1].length).toBe(16);
    expect(rings[2].length).toBe(24);
    expect(rings[3].length).toBe(32);
    expect(rings[4].length).toBe(40);
    map = {};
    for (let i = rings[0].length - 1; i >= 0; i--) {
      map[[rings[0][i].vector.x,rings[0][i].vector.y].join(",")] = rings[0][i];
    }
    for (let i = rings[1].length - 1; i >= 0; i--) {
      map[[rings[1][i].vector.x,rings[1][i].vector.y].join(",")] = rings[1][i];
    }
    for (let i = rings[2].length - 1; i >= 0; i--) {
      map[[rings[2][i].vector.x,rings[2][i].vector.y].join(",")] = rings[2][i];
    }
    for (let i = rings[3].length - 1; i >= 0; i--) {
      map[[rings[3][i].vector.x,rings[3][i].vector.y].join(",")] = rings[3][i];
    }
    for (let i = rings[4].length - 1; i >= 0; i--) {
      map[[rings[4][i].vector.x,rings[4][i].vector.y].join(",")] = rings[4][i];
    }
    expect(Object.keys(map).length).toBe(120);
    dungeon.shadowCastQuadrant(5)
  });
});
