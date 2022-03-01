import { World } from './World/World.js';

// create the main function
function main() {
  console.log(BABYLON)
  // Get a reference to the canvas element
  const canvas = document.querySelector('#game-container');

  // 1. Create an instance of the World app
  const world = new World(canvas);

  // 2. Render the scene
  world.render();
}

// call main to start the app
main();