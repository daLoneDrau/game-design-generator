import { WebGLRenderer } from "../../../vendor/three.module.js";

function createRenderer() {
  const renderer = new WebGLRenderer();

  return renderer;
}

export { createRenderer };