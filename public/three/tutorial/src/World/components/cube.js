function createCube(scene, isEmissive) {
  // create a box shaped geometry
  // as a rule, 1 unit should equal 1 meter's height IRL
  // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
  const cube = BABYLON.MeshBuilder.CreateBox(
    "box",    // name
    {
      width: 2,
      height: 2,
      depth: 2
    },  // options
    scene
  );
  if (typeof(isEmissive) !== "undefined" && isEmissive) {
    let cubeMaterial = new BABYLON.StandardMaterial("cubeMaterial", scene);
    cubeMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);  // the color or texture of the material as if self lit;
    cube.material = cubeMaterial;
  }

  return cube;
}

export { createCube };