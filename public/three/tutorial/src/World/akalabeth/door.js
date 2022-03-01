import * as Material from '../materials/materials.js';
import { createWall } from './wall.js';

function createDoor(scene) {
  const wall = createWall(scene);
  const door = BABYLON.MeshBuilder.CreatePlane("plane", {
      width: 1,
      height: 1.7
  }, scene);
  door.parent = wall; // parent the wall to the door
  door.position.y = -0.15; // move the door down to the bottom of the wall
  door.position.z = 1; // move the door out to the wall's edge
  door.enableEdgesRendering(); // enable edge rendering
  door.edgesWidth = 3.0;
  door.edgesColor = Material.lightColor4;
  door.material = Material.darkMaterial;

  const door2 = door.clone();
  door2.enableEdgesRendering(); // enable edge rendering
  door2.edgesWidth = 3.0;
  door2.position.z = -1; // move the door out to the wall's edge

  const door3 = door.clone();
  door3.enableEdgesRendering(); // enable edge rendering
  door3.edgesWidth = 3.0;
  door3.position.x = -1;
  door3.position.z = 0;
  door3.rotation.y = BABYLON.Tools.ToRadians(90);

  const door4 = door.clone();
  door4.enableEdgesRendering(); // enable edge rendering
  door4.edgesWidth = 3.0;
  door4.position.x = 1;
  door4.position.z = 0;
  door4.rotation.y = BABYLON.Tools.ToRadians(-90);

  return wall;
}
export { createDoor };