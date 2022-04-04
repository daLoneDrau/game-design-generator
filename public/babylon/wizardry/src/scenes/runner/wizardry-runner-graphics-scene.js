import { createDungeonCamera, createUniversalCamera } from "../../components/camera.js";
import * as Materials from "../../components/materials/materials.js";
/**
 * @class 
 */
class WizardryRunnerGraphicsScene extends BABYLON.Scene {
  /**
   * Creates a new instance of WizardryRunnerGraphicsScene.
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    
    // Sets a boolean that indicates if the scene must clear the render buffer before rendering a frame
    this.autoClear = false;

    // set background color to skyblue
    this.clearColor = Materials.darkColor;
    
    // create a camera
    createDungeonCamera(this);

    // detach control initially. Babylon doesn't handle listeners well
    this.detachControl();

    

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape.
    var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, this);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, this);
  }
  /**
   * Resets flags and the UI upon exit.
   */
  exitScene() {
    //this._advancedTexture.dispose();
    this.detachControl();
  }
  /**
   * Render the scene.
   * @param {boolean} updateCameras defines a boolean indicating if cameras must update according to their inputs (true by default)
   * @param {boolean} ignoreAnimations defines a boolean indicating if animations should not be executed (false by default)
   */
  render(updateCameras, ignoreAnimations) {

    super.render(updateCameras, ignoreAnimations);
  }
}

export { WizardryRunnerGraphicsScene };