/**
 * @jest-environment jsdom
 */
const { RetroC64Config } = require("../../../src/config/retroc64-config");
const { RetroC64AkalabethWorld } = require("../../../src/bus/akalabeth/retroc64-akalabeth-world");

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

describe("testing the AkalabethWorldTest class", () => {
  let range = 0.05, runs = 10000;
  /************
   * NEW WORLD
   */
  test("Creating a new World generates a castle, several dungeons and towns.", () => {
    // given
    let world = new RetroC64AkalabethWorld();
    
    // when
    for (let c = runs; c > 0; c--) {
      world.newWorld();
      let towns = [],  dungeons = [], castle;
      for (let i = world.terrain.length - 1; i >= 0; i--) {
        let row = world.terrain[i];
        for (let j = row.length - 1; j >= 0; j--) {
          if (row[j] === 3) {
            towns.push([i, j]);
          } else if (row[j] === 4) {
            dungeons.push([i, j]);
          } else if (row[j] === 5) {
            castle = [i, j];
          }
        }
      }
      // each town should have at least one side clear for entry
      let check = [
        [0, 1], // EAST
        [0, -1], // WEST
        [1, 0], // SOUTH
        [-1, 0] // NORTH
      ];
      // check that all towns have at least one reachable side
      for (let i = towns.length - 1; i >= 0; i--) {
        let valid = false;
        for (let j = check.length - 1; j >= 0; j--) {
          let y = towns[i][0] + check[j][0];
          let x = towns[i][1] + check[j][1];
          if (x >= 0 && x < world.terrain[0].length) {
            if (y >= 0 && y < world.terrain[0].length) {
              if (world.terrain[y][x] !== 3) {
                // not a mountain
                valid = true;
                break;
              }
            }
          }
        }
        expect(valid).toBeTruthy();
      }
      // check that all dungeons have at least one reachable side
      for (let i = dungeons.length - 1; i >= 0; i--) {
        let valid = false;
        for (let j = check.length - 1; j >= 0; j--) {
          let y = dungeons[i][0] + check[j][0];
          let x = dungeons[i][1] + check[j][1];
          if (x >= 0 && x < world.terrain[0].length) {
            if (y >= 0 && y < world.terrain[0].length) {
              if (world.terrain[y][x] !== 3) {
                // not a mountain
                valid = true;
                break;
              }
            }
          }
        }
        expect(valid).toBeTruthy();
      }
      // check that the castle has at least one reachable side
      {
        let valid = false;
        for (let j = check.length - 1; j >= 0; j--) {
          let y = castle[0] + check[j][0];
          let x = castle[1] + check[j][1];
          if (x >= 0 && x < world.terrain[0].length) {
            if (y >= 0 && y < world.terrain[0].length) {
              if (world.terrain[y][x] !== 3) {
                // not a mountain
                valid = true;
                break;
              }
            }
          }
        }
        expect(valid).toBeTruthy();
      }
      
      // then
      expect(world._terrain.length).toBe(21);
    }
  });
});
