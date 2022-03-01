import { RingBufferGeometry, Mesh, MeshBasicMaterial } from "../../../vendor/three.module.js";

function createRing() {
  // create a Mesh containing the geometry and material
  const ring = BABYLON.MeshBuilder.CreateTorus("torus", { tessellation : 12 });

  return ring;
}

export { createRing };