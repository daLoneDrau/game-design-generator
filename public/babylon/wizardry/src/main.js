import { App }                from '../src/App/App.js';
import { WizardryConfig }     from "../src/config/wizardry-config.js";
import { WizardryController } from "../src/services/wizardry-controller.js";



// create the main function
function main() {
  // Get a reference to the canvas element
  const canvas = document.querySelector('#game-container');

  // initialize configuration
  WizardryConfig.init();

  // 1. Create an instance of the World app
  const app = new App(canvas);

  // 2. set the base flag to -1
  WizardryController.llbase04 = -1;

  // 3. Render the scene
  app.render();
}

// call main to start the app
main();