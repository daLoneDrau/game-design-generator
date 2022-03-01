import { WizardryXgoto }                  from "../config/wizardry-constants.js";
import { WizardryCampInspectScene }       from "../scenes/camp/inspect/wizardry-camp-inspect-scene.js";
import { WizardryCampMazeScene }          from "../scenes/camp/maze/wizardry-camp-maze-scene.js";
import { WizardryBoltacScene }            from "../scenes/castle/boltac/wizardry-boltac-scene.js";
import { WizardryCantScene }              from "../scenes/castle/cant/wizardry-cant-scene.js";
import { WizardryEdgeTownScene }          from "../scenes/castle/edgetown/wizardry-edgetown-scene.js";
import { WizardryInnScene }               from "../scenes/castle/inn/wizardry-inn-scene.js";
import { WizardryMarketScene }            from "../scenes/castle/market/wizardry-market-scene.js";
import { WizardryGilgameshScene }         from "../scenes/castle/gilgamesh/wizardry-gilgamesh-scene.js";
import { WizardryCharacterCreationScene } from "../scenes/training-grounds/make-character/wizardry-make-character-scene.js";
import { WizardryTrainingScene }          from "../scenes/training-grounds/train-character/wizardry-train-character-scene.js";
import { WizardryTrainingGroundsScene }   from "../scenes/training-grounds/wizardry-training-grounds-scene.js";
import { WizardryInitScene }              from "../scenes/init/wizardry-init-scene.js";
import { WizardryController }             from "../services/wizardry-controller.js";

/** the BABYLON.Engine instance.*/
let _engine;
/** the scene groups. Scenes are mapped to a key that indicates when it should be rendered.  */
let _sceneGroups = {};
/** the last scene group rendered. */
let _lastGroup;

/**
 * The application entry point.
 * @param {Element} canvas the canvas element used for rendering
 */
class App {
  constructor(canvas) {
    _engine = new BABYLON.Engine(
      canvas, // the canvas to use for rendering.
      true,   // turn on antialiasing 
      {
        preserveDrawingBuffer: true,
        stencil: true
      }       // engine options
    );
    // initialize scene groups
    _sceneGroups["INIT_GAME"]              = new WizardryInitScene(_engine);
    _sceneGroups[WizardryXgoto.XADVNTINN]  = new WizardryInnScene(_engine);
    _sceneGroups[WizardryXgoto.XBOLTAC]    = new WizardryBoltacScene(_engine);
    _sceneGroups[WizardryXgoto.XCANT]      = new WizardryCantScene(_engine);
    _sceneGroups[WizardryXgoto.XCASTLE]    = new WizardryMarketScene(_engine);
    _sceneGroups[WizardryXgoto.XEDGTOWN]   = new WizardryEdgeTownScene(_engine);
    _sceneGroups[WizardryXgoto.XGILGAMS]   = new WizardryGilgameshScene(_engine);
    _sceneGroups[WizardryXgoto.XTRAININ]   = new WizardryTrainingGroundsScene(_engine);
    _sceneGroups[WizardryXgoto.XMAKECHAR]  = new WizardryCharacterCreationScene(_engine);
    _sceneGroups[WizardryXgoto.XTRAINCHAR] = new WizardryTrainingScene(_engine);
    _sceneGroups[WizardryXgoto.XINSPCT2]   = new WizardryCampMazeScene(_engine);
    _sceneGroups[WizardryXgoto.XINSPCT3]   = new WizardryCampInspectScene(_engine);    
  }

  // 2. Render the scene
  render() {
    // draw a single frame
    // renderer.render(scene, camera);
    // run the render loop
    _engine.runRenderLoop(function() {
      // identify the scene group that needs rendering
      let groupName = "";
      if (WizardryController.xgoto !== null) {
        groupName = WizardryController.xgoto.toString();
      } else if (WizardryController.llbase04 < 0) {
        groupName = "INIT_GAME";
      }
      let group = _sceneGroups[groupName];
      // attach control to the current scene(s)
      if (_lastGroup !== groupName) {
        _lastGroup = groupName;
        // switching to a new scene. attach control
        if (Array.isArray(group)) {
          for (let i = group.length - 1; i >= 0; i--) {
            group[i].attachControl();
          }
        } else {
          group.attachControl();
        }
        console.log("switch to",_lastGroup)
        // add focus, remove focus, add focus to canvas in order to get listeners attached
        _engine.getRenderingCanvas().focus();
        _engine.getRenderingCanvas().blur();
        _engine.getRenderingCanvas().focus();
      }
      // render the scene(s)
      if (Array.isArray(group)) {
        for (let i = group.length - 1; i >= 0; i--) {
          group[i].render();
        }
      } else {
        group.render();
      }
    });
    // the canvas/window resize event handler
    window.addEventListener('resize', function(){
      _engine.resize();
    });
  }
}

export { App };