import * as Material from '../materials/materials.js';

function createLadder(scene, isUp) {
  const WIDTH = 0.2;

  const ladderParent = BABYLON.MeshBuilder.CreateBox("left", {
      height: 2,
      width: 0.01,
      depth: 0.01
  }, scene);
  ladderParent.enableEdgesRendering(); // enable edge rendering
  ladderParent.edgesWidth = 3.0;
  ladderParent.edgesColor = Material.lightColor4;
  ladderParent.material = Material.darkMaterial;    
  
  const right = ladderParent.clone();
  right.parent = ladderParent;
  right.enableEdgesRendering(); // enable edge rendering
  right.edgesWidth = 3.0;

  const rung1 = BABYLON.MeshBuilder.CreateBox("left", {
      height: 0.01,
      width: WIDTH * 2,
      depth: 0.01
  }, scene);
  rung1.parent = ladderParent;
  rung1.enableEdgesRendering(); // enable edge rendering
  rung1.edgesWidth = 3.0;
  rung1.edgesColor = Material.lightColor4;
  rung1.material = Material.darkMaterial;

  const rung2 = rung1.clone();
  rung2.parent = ladderParent;
  rung2.enableEdgesRendering(); // enable edge rendering
  rung2.edgesWidth = 3.0;

  const rung3 = rung1.clone();
  rung3.parent = ladderParent;
  rung3.enableEdgesRendering(); // enable edge rendering
  rung3.edgesWidth = 3.0;

  const rung4 = rung1.clone();
  rung4.parent = ladderParent;
  rung4.enableEdgesRendering(); // enable edge rendering
  rung4.edgesWidth = 3.0;

  const hole = BABYLON.MeshBuilder.CreatePlane("plane", {
      width: 1,
      height: 1
  }, scene);
  hole.parent = ladderParent;
  hole.rotation.x = BABYLON.Tools.ToRadians(90);
  hole.enableEdgesRendering(); // enable edge rendering
  hole.edgesWidth = 3.0;
  hole.edgesColor = Material.lightColor4;
  hole.material = Material.darkMaterial;
  
  ladderParent.position.y = 1;
  ladderParent.position.x = -WIDTH;
  right.position.x = WIDTH * 2;
  rung1.position.y = -0.6;
  rung1.position.x = WIDTH;
  rung2.position.y = -0.2;
  rung2.position.x = WIDTH;
  rung3.position.y = 0.2;
  rung3.position.x = WIDTH;
  rung4.position.y = 0.6;
  rung4.position.x = WIDTH;
  if (isUp) {
    hole.position.y = 1;
  } else {
    hole.position.y = -1;
  }
  hole.position.x = WIDTH;

  return ladderParent;
}
export { createLadder };