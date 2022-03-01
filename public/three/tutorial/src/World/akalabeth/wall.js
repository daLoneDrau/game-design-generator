import * as Material from '../materials/materials.js';

function createWall(scene) {
  const wall = BABYLON.MeshBuilder.CreateBox("wall", {
      size: 2
  }, scene);

  // Move the wall upward 1/2 its height
  wall.position.y = 1.01;
  wall.enableEdgesRendering(); 
  wall.edgesWidth = 3.0;
  wall.edgesColor = Material.lightColor4;
  wall.material = Material.darkMaterial;

  return wall;
}
export { createWall };