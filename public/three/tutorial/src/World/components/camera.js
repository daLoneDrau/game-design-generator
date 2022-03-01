function createCamera(scene) {  
  const camera = new BABYLON.UniversalCamera(
    "UniversalCamera", // name
    new BABYLON.Vector3(0, 1, 10), // position
    scene // the scene the camera belongs to
  );
  
  camera.fov = BABYLON.Tools.ToRadians(35);  // field of view: how wide the camera’s view is, in radians.
  camera.minZ = 0.1;      // near clipping plane: anything closer to the camera than this will be invisible.
  camera.maxZ = 100;      // far clipping plane: anything further away from the camera than this will be invisible.
  camera.setTarget(BABYLON.Vector3.Zero()); // Targets the camera to a particular position. In this case the scene origin
  // camera.attachControl(true); // attach input controls to respond to events from the canvas
  /*
  const camera = new BABYLON.ArcRotateCamera(
    "camera", // name
    -Math.PI / 2, // the camera rotation along the longitudinal axis
    Math.PI / 2.5, // the camera rotation along the latitudinal axis
    3, // the camera distance from its target
    new BABYLON.Vector3(0, 0, 0) // the camera target
  );
  */

  return camera;
}

export { createCamera };