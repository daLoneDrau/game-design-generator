/**
 * @jest-environment jsdom
 */

beforeAll(() => {
});

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("testing the AkalabethCharacterTest class", () => {
  let range = 0.05, runs = 10000;
});
