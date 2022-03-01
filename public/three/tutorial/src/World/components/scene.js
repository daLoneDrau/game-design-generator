function createScene(engine) {
  const scene = new BABYLON.Scene(engine);

  // set background color to skyblue
  scene.clearColor = new BABYLON.Color3(0.2627, 0.2588, 0.902);

  return scene;
}

export { createScene };