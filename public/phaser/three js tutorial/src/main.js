class MainScene extends ENABLE3D.Scene3D {
  constructor() {
    super({ key: "MainScene" });
  }
  init() {
    // Get a reference to the container element that will hold our scene
    const container = document.querySelector('#scene-container');

    // Create The Camera   
    const fov = 35; // field of view: how wide the camera’s view is, in degrees.
    const aspect = container.clientWidth / container.clientHeight; // aspect ratio: the ratio of the scene’s width to its height.
    const near = 0.1; // near clipping plane: anything closer to the camera than this will be invisible.
    const far = 100; // far clipping plane: anything further away from the camera than this will be invisible.

    /*
    // Create the Renderer
    // create the renderer
    const renderer = new ENABLE3D.THREE.WebGLRenderer();
    // next, set the renderer to the same size as our container element
    renderer.setSize(container.clientWidth, container.clientHeight);
    // finally, set the pixel ratio so that our scene will look good on HiDPI displays
    renderer.setPixelRatio(window.devicePixelRatio);
    // add the automatically created <canvas> element to the page
    container.append(renderer.domElement);
    */

    // initialize 3d camera with the viewing frustrum defined above
    this.accessThirdDimension({
      camera: new ENABLE3D.THREE.PerspectiveCamera(fov, aspect, near, far)
      // renderer: renderer
    });
    // If the scene is a tiny universe, stretching forever in all directions, the camera’s viewing frustum is the part of it that we can see.
  }
  create() {
    // set the Scene

    // Set the Scene’s Background Color. can use CSS color names, RGB values, or any way to define a color in CSS
    this.third.scene.background = new ENABLE3D.THREE.Color("skyblue");

    // every object is initially created at ( 0, 0, 0 )
    // move the camera back so we can view the scene
    this.third.camera.position.set(0, 0, 10);
    console.log(this.third)

    // create a box shaped geometry
    const geometry = new ENABLE3D.THREE.BoxBufferGeometry(2, 2, 2);
    // create a default (white) Basic material. MeshBasicMaterial is visible without lights
    const material = new ENABLE3D.THREE.MeshBasicMaterial();
    // create a Mesh containing the geometry and material
    const cube = new ENABLE3D.THREE.Mesh(geometry, material);
    // add the mesh to the scene at default point 0, 0, 0
    this.third.scene.add(cube);

    
    // Create the Renderer
    // create the renderer
    const container = document.querySelector('#scene-container');
    // next, set the renderer to the same size as our container element
    //this.third.renderer.setSize(container.clientWidth, container.clientHeight);
    // finally, set the pixel ratio so that our scene will look good on HiDPI displays
    //this.third.renderer.setPixelRatio(window.devicePixelRatio);
    // add the automatically created <canvas> element to the page
    container.append(this.third.renderer.domElement);
  }
}
export { MainScene };