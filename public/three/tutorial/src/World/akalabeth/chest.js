import * as Material from '../materials/materials.js';

function createChest(scene) {
  const chest = BABYLON.MeshBuilder.CreateBox("chest", {
      height: 0.25,
      width: 0.3333,
      depth: 0.25
  }, scene);

  // Move the sphere upward 1/2 its height
  chest.position.y = 0.13;
  chest.rotation.y = BABYLON.Tools.ToRadians(-60);
  chest.enableEdgesRendering(); 
  chest.edgesWidth = 3.0;
  chest.edgesColor = Material.lightColor4;
  chest.material = Material.darkMaterial;

  return chest;
}
export { createChest };