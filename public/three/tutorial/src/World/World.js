import { createCamera } from './components/camera.js';
import { createCube } from './components/cube.js';
import { createLights } from './components/lights.js';
import { createRing } from './components/ring.js';
import { createScene } from './components/scene.js';
import { createScreenOutline } from './ui/screenoutline.js';


import { createChest } from './akalabeth/chest.js';
import { createDoor } from './akalabeth/door.js';
import { createLadder } from './akalabeth/ladder.js';
import { createWall } from './akalabeth/wall.js';

import * as Material from './materials/materials.js';

import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let light;
let renderer;
let scene;
let engine;

class World {
  // 1. Create an instance of the World app
  constructor(canvas) {
    engine = new BABYLON.Engine(
      canvas, // the canvas to use for rendering.
      true,   // turn on antialiasing 
      {
        preserveDrawingBuffer: true,
        stencil: true
      }       // engine options
    );
    scene = createScene(engine);   

    camera = createCamera(scene);
    camera.viewport = new BABYLON.Viewport(
      0.03125,  // viewport left coordinate
      0.1875,  // viewport top coordinate
      0.78125,  // viewport width
      0.78125 // viewport height
    );
    camera.attachControl(true);

    Material.initMaterials(scene);

    /*
    light = createLights(scene, new BABYLON.Vector3(10, -10, -10));
    light.diffuse = new BABYLON.Color3(0.651, 0.6314, 1);
    */
   
    const ladder = createLadder(scene, true);
    const wall = createWall(scene);
    wall.position.x = 2;
    
    const door = createDoor(scene);
    door.position.x = -2;
    /*

    const cube = createCube(scene);
    cube.position = new BABYLON.Vector3(0, 0, 0);
    cube.position.x = 1;
    cube.rotation = new BABYLON.Vector3(-0.5, -0.1, 0.8);

    
    const ring = createRing();
    cube.addChild(ring)
    ring.position = new BABYLON.Vector3(3, 0, 0);
    ring.rotation.x = BABYLON.Tools.ToRadians(90);

    createScreenOutline(canvas, scene, {
      cols: 40,
      rows: 24,
      lines: [
        {
          points: [
            { cell: [0, 0] },
            { cell: [39, 0] }
          ]
        },
        {
          points: [
            { cell: [39, 0] },
            { cell: [39, 23] }
          ]
        },
        {
          points: [
            { cell: [39, 23] },
            { cell: [0, 23] }
          ]
        },
        {
          points: [
            { cell: [0, 23] },
            { cell: [0, 0] }
          ]
        },
        {
          points: [
            { cell: [12, 0] },
            { cell: [12, 10] }
          ]
        },
        {
          points: [
            { cell: [0, 10] },
            { cell: [39, 10] }
          ]
        },
        {
          points: [
            { cell: [12, 5] },
            { cell: [39, 5] }
          ]
        },
        {
          points: [
            { cell: [0, 15] },
            { cell: [39, 15] }
          ]
        }
      ]
    });
    /*
    camera = createCamera(canvas, scene);
    const cube = createCube(scene);
    console.log(cube)
    
    // Attach the camera to the canvas
    /*
    camera = createCamera();
    renderer = createRenderer();
    container.append(renderer.domElement);
    const cube = createCube();
    scene.add(cube);

    const ring = createRing();
    scene.add(ring);
    ring.position.set(3, 0, 0);

    const resizer = new Resizer(container, camera, renderer);
    */
  }

  // 2. Render the scene
  render() {
    // draw a single frame
    // renderer.render(scene, camera);
    // run the render loop
    engine.runRenderLoop(function(){
      scene.render();
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
      engine.resize();
    });
  }
}

export { World };