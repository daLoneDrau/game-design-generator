/**
 * @jest-environment jsdom
 */
import { WizardryController } from "../../src/services/wizardry-controller.js"; // Cannot use import statement outside a module


beforeAll(() => {
});
describe("testing the WizardryControllerTests class", () => {
  let range = 0.05, runs = 10000;
  test('dummy test', () => {
    let x = 1;
    console.log(WizardryController)
    expect(x).toBe(1);
  });
});
