function createLights(scene, position) {
  // Create a directional light
  const light = new BABYLON.DirectionalLight(
    "DirectionalLight", // name
    position, // The direction of the light
    scene // The scene the light belongs to
  );

  return light;
}

export { createLights };