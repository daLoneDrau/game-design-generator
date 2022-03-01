import { createUniversalCamera } from "../components/camera.js";
import * as Materials from "../components/materials/materials.js";

const CURSOR_FRAME_RATE = 10;
/** the delay in ms after keyboard entry */
const KEYBOARD_ENTRY_DELAY = 500;
/**
 * @class Base class for all Wizardry scenes.
 */
class WizardryScene extends BABYLON.Scene {
  /** flag indicating whether the font has been added to the dpcument. */
  static _fontAdded = false;
  /**
   * Hack to add the selected font to the scene.
   */
  static addFontInPage = function() {
    if (!WizardryScene._fontAdded) {
      const fontElement         =   document.createElement('style');
      fontElement.innerHTML     =   `
          @font-face {
              font-family: 'C64ProMono';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(http://localhost:3333/phaser/assets/font/giana.woff) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
          }`;
      document.head.appendChild(fontElement);
      WizardryScene._fontAdded = true;
    }
  }
  /**
   * Creates a blinking cursor.
   * @returns {object} the cursor container and 2 animations
   */
  static createBlinkingCursor() {
    let blinkingCursor = new BABYLON.GUI.Rectangle("Cursor");
    blinkingCursor.thickness = 0;
    blinkingCursor.background = Materials.lightRGB;
    blinkingCursor.width = "16px";
    blinkingCursor.height = "19px";
    blinkingCursor.paddingTop = "3px";
    blinkingCursor.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

    let blinkAnimation = new BABYLON.Animation(
      "blinkingCursor", // Name of the animation
      "alpha", // Property to animate
      CURSOR_FRAME_RATE, // The frames per second of the animation
      BABYLON.Animation.ANIMATIONTYPE_FLOAT // The data type of the animation
    );
    // Set the key frames of the animation - animation will last for 2.01 seconds and there are 4 keyframes at 0, 2, 3, and 3.01 seconds
    blinkAnimation.setKeys([
      {
        frame: 0, // keyframe at 0 seconds
        value: 1, // at 0 seconds the alpha should be 1 (fully visible)
      },
      {
        frame: 0.3333 * CURSOR_FRAME_RATE, // keyframe at 1/3 seconds
        value: 1, // at 1/3 seconds the alpha should be 1 (fully visible)
      },
      {
        frame: 0.3334 * CURSOR_FRAME_RATE, // keyframe at 1/3
        value: 0, // at 1/3 seconds the alpha should be 0 (invisible)
      },
      {
        frame: 0.6666 * CURSOR_FRAME_RATE, // keyframe at 2/3 seconds
        value: 0, // at 2/3 seconds the alpha should be 0 (invisible)
      },
      {
        frame: 0.6667 * CURSOR_FRAME_RATE, // keyframe at 2/3 seconds
        value: 1, // at 2/3 seconds the alpha should be 1 (fully visible)
      },
      {
        frame: 1 * CURSOR_FRAME_RATE, // keyframe at 1 seconds
        value: 1, // at 1 seconds the alpha should be 1 (fully visible)
      },
      {
        frame: 1.0001 * CURSOR_FRAME_RATE, // keyframe at 1 seconds
        value: 0, // at 1 seconds the alpha should be 0 (invisible)
      },
      {
        frame: 1.3333 * CURSOR_FRAME_RATE, // keyframe at 1 1/3 seconds
        value: 0, // at 1 1/3 seconds the alpha should be 0 (invisible)
      },
      {
        frame: 1.3334 * CURSOR_FRAME_RATE, // keyframe at 1 1/3 seconds
        value: 1, // at 1 1/3 seconds the alpha should be 1 (fully visible)
      },
      {
        frame: 1.6666 * CURSOR_FRAME_RATE, // keyframe at 1 2/3 seconds
        value: 1, // at 1 2/3 seconds the alpha should be 1 (fully visible)
      },
      {
        frame: 1.6667 * CURSOR_FRAME_RATE, // keyframe at 1 2/3 seconds
        value: 0, // at 1 2/3 seconds the alpha should be 0 (invisible)
      },
      {
        frame: 2 * CURSOR_FRAME_RATE, // keyframe at 2 seconds
        value: 0, // at 2 seconds the alpha should be 0 (invisible)
      }
    ]);
    let invisibleAnimation = new BABYLON.Animation(
      "invisibleCursor", // Name of the animation
      "alpha", // Property to animate
      CURSOR_FRAME_RATE, // The frames per second of the animation
      BABYLON.Animation.ANIMATIONTYPE_FLOAT // The data type of the animation
    );
    // Set the key frames of the animation - animation will last for 2.01 seconds and there are 4 keyframes at 0, 2, 3, and 3.01 seconds
    invisibleAnimation.setKeys([
      {
        frame: 0, // keyframe at 0 seconds
        value: 0, // at 0 seconds the alpha should be 0 (invisible)
      },
      {
        frame: CURSOR_FRAME_RATE, // keyframe at 0 seconds
        value: 0, // at 1 seconds the alpha should be 0 (invisible)
      }
    ]);
    if (typeof(blinkingCursor.animations) === "undefined") {
      blinkingCursor.animations = [];
    }
    blinkingCursor.animations.push(invisibleAnimation, blinkAnimation);
    return {
      cursor: blinkingCursor,
      visible: blinkAnimation,
      invisible: invisibleAnimation
    };
  }
  /**
   * Creates a BABYLON.GUI.Grid based on the supplied parameters.
   * @param {object} parameterObject the object containing columns and rows for the grid
   * @returns {BABYLON.GUI.Grid} the grid
   */
  static createGrid(parameterObject) {
    let grid = new BABYLON.GUI.Grid(parameterObject.hasOwnProperty("key") ? parameterObject.key : WizardryScene.randomKey());
    if (parameterObject.hasOwnProperty("columns")) {
      for (let i = 0, li = parameterObject.columns.length; i < li; i++) {
        grid.addColumnDefinition(parameterObject.columns[i]);
      }
    }
    if (parameterObject.hasOwnProperty("rows")) {
      for (let i = 0, li = parameterObject.rows.length; i < li; i++) {
        grid.addRowDefinition(parameterObject.rows[i]);
      }
    }
    return grid;
  }
  /**
   * Creates a BABYLON.GUI.ScrollViewer based on the supplied parameters.
   * @param {object} parameterObject the object containing columns and rows for the scroll viewer
   * @returns {BABYLON.GUI.ScrollViewer} the grid
   */
  static createScrollViewer(parameterObject = {}) {
    let scrollViewer = new BABYLON.GUI.ScrollViewer(parameterObject.hasOwnProperty("key") ? parameterObject.key : WizardryScene.randomKey());
    // set the thickness of the border around the scroll viewer
    scrollViewer.thickness = parameterObject.hasOwnProperty("thickness") ? parameterObject.thickness : 0;
    // set the border thicknesses of the scroll bars
    scrollViewer.horizontalBar.thickness = parameterObject.hasOwnProperty("barBorderThickness") ? parameterObject.thickness : 1;
    scrollViewer.verticalBar.thickness = parameterObject.hasOwnProperty("barBorderThickness") ? parameterObject.thickness : 1;
    // set the border colors for the scroll bars
    scrollViewer.color = parameterObject.hasOwnProperty("color") ? parameterObject.color : Materials.lightRGB;
    // set the color of the scroll bar
    scrollViewer.barColor = parameterObject.hasOwnProperty("barColor") ? parameterObject.barColor : Materials.lightRGB;
    return scrollViewer;
  }
  /**
   * Generates a random key.
   * @returns {string} a random key
   */
  static randomKey() {
    return [Date.now().toString(36), Math.random().toString(36).substring(2)].join("");
  }
  /**
   * Creates a new instance of WizardryScene.
   * @param {BABYLON.Engine} engine the engine running the scene
   */
  constructor(engine) {
    super(engine);
    /** @private the BABYLON.GUI.AdvancedDynamicTexture used for GUI. */
    this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "UI", // name for the texture
      true, // boolean indicating if the texture must be rendered in foreground (default is true)
      this // the hosting scene
    );
    /** @private flag indicating whether the scene is being entered from another. */
    this._enterScene = true;
    /** the frame rate for fading out the message block text. */
    this._messageFrameRate = 10;
    /** @private the BABYLON.GUI.TextBlock used to display messages. */
    this._messageTextBlock;
    /** @private all buttons created on the page are kept in an array for resetting highlighting after leaving the scene. */
    this._buttons = [];
    /** @private all text blocks created on the page are kept in an array for configuration after the font is loaded. */
    this._textBlocks = [];
    /** @private flag indicating whether the UI has been created. */
    this._uiCreated = false;

    // set background color to skyblue
    this.clearColor = Materials.darkColor;
    
    // create a camera
    createUniversalCamera(this);

    WizardryScene.addFontInPage();

    // detach control initially. Babylon doesn't handle listeners well
    this.detachControl();
  }
  /**
   * Gets the BABYLON.GUI.AdvancedDynamicTexture instance.
   */
  get advancedTexture() {
    return this._advancedTexture;
  }
  /**
   * Creates a button based on the supplied parameters for background and text.
   * 
   * Missing background parameters are assumed to have the following defaults:
   * 
   * thickness: 0
   * 
   * color: Materials.darkRGB
   * 
   * adaptWidthToChildren: true
   * 
   * Missing text parameters are assumed to have the following defaults:
   * 
   * text: ""
   * 
   * color: Materials.lightRGB
   * 
   * resizeToFit: true
   * @param {object} parameterObject the button parameters
   * @returns {object} a return object with two properties: a BABYLON.GUI.Rectangle instance and a BABYLON.GUI.TextBlock instance
   */
  createButton(parameterObject) {
    const rectangle = new BABYLON.GUI.Rectangle(parameterObject.hasOwnProperty("key") ? parameterObject.key : WizardryScene.randomKey());

    const text = this.createTextBlock(parameterObject.text);
    rectangle.addControl(text);

    const retObj = {
      container: rectangle,
      text: text,
      enabled: true,
      enable: (value) => {
        retObj.enabled = value;
        if (!value) {
          retObj.container.hoverCursor = "default";
          retObj.container.isPointerBlocker = false;
        } else {
          retObj.container.hoverCursor = "pointer";
          retObj.container.isPointerBlocker = true;
        }
      }
    };

    rectangle.thickness = parameterObject.background.hasOwnProperty("thickness") ? parameterObject.background.thickness : 0;
    rectangle.background = parameterObject.background.hasOwnProperty("color") ? parameterObject.background.color : Materials.darkRGB;
    rectangle.adaptWidthToChildren = parameterObject.background.hasOwnProperty("adaptWidthToChildren") ? parameterObject.background.adaptWidthToChildren : true;
    if (parameterObject.background.hasOwnProperty("horizontalAlignment")) {
      rectangle.horizontalAlignment = parameterObject.background.horizontalAlignment;
    }
    if (parameterObject.background.hasOwnProperty("verticalAlignment")) {
      rectangle.verticalAlignment = parameterObject.background.verticalAlignment;
    }
    if (parameterObject.background.hasOwnProperty("onPointerClickObservable")
        || parameterObject.background.hasOwnProperty("onPointerEnterObservable")
        || parameterObject.background.hasOwnProperty("onPointerOutObservable")) {
      rectangle.isPointerBlocker = true;
    }
    if (parameterObject.background.hasOwnProperty("onPointerClickObservable")) {
      rectangle.onPointerClickObservable.add(...parameterObject.background.onPointerClickObservable);
      rectangle.hoverCursor = "pointer";
    }
    if (parameterObject.background.hasOwnProperty("onPointerEnterObservable")) {
      rectangle.onPointerEnterObservable.add(...parameterObject.background.onPointerEnterObservable);
      if (parameterObject.background.hasOwnProperty("onPointerClickObservable")) {
        rectangle.onPointerEnterObservable.add((eventData, eventState) => {
          if (retObj.enabled) {
            rectangle.background = Materials.lightRGB;
            text.color = Materials.darkRGB;
          } else {
            rectangle.background = Materials.darkRGB;
            text.color = Materials.lightRGB;
          }
        });
      }
    }
    if (parameterObject.background.hasOwnProperty("onPointerOutObservable")) {
      rectangle.onPointerOutObservable.add(...parameterObject.background.onPointerOutObservable);
      if (parameterObject.background.hasOwnProperty("onPointerClickObservable")) {
        rectangle.onPointerOutObservable.add((eventData, eventState) => {
          rectangle.background = Materials.darkRGB;
          text.color = Materials.lightRGB;
        });
      }
    }
    this._buttons.push({ rectangle: rectangle, text: text });
    return retObj;
  }
  createClickableRow(parameterObject) {
    const rectangle = new BABYLON.GUI.Rectangle();
    rectangle.thickness = 0;
    rectangle.background = Materials.darkRGB;
    rectangle.adaptWidthToChildren = false;
    rectangle.isPointerBlocker = true;
    rectangle.hoverCursor = "pointer";

    rectangle.onPointerClickObservable.add((eventData, eventState) => {
      parameterObject.click(rectangle.name);
    });
    rectangle.onPointerEnterObservable.add((eventData, eventState) => {
      rectangle.background = Materials.lightRGB;
      const children = rectangle.children;
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child.hasOwnProperty("children") || "children" in child) {
          // only BABYLON.GUI.Containers will have children
          for (let j = child.children.length - 1; j >= 0; j--) {
            const subChild = child.children[j];
            subChild.color = Materials.darkRGB;
          }
        } else {
          child.color = Materials.darkRGB;
        }
      }
    });
    rectangle.onPointerOutObservable.add((eventData, eventState) => {
      rectangle.background = Materials.darkRGB;
      const children = rectangle.children;
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i];
        if (child.hasOwnProperty("children") || "children" in child) {
          // only BABYLON.GUI.Containers will have children
          for (let j = child.children.length - 1; j >= 0; j--) {
            const subChild = child.children[j];
            subChild.color = Materials.lightRGB;
          }
        } else {
          child.color = Materials.lightRGB;
        }
      }
    });
    for (let i = 0, li = parameterObject.children.length; i < li; i++) {
      rectangle.addControl(parameterObject.children[i]);
    }
    return {
      /**
       * Gets the row's visibility.
       */
      get isVisible() {
        return rectangle.isVisible;
      },
      /**
       * Sets the row's visibility.
       * @param {Boolean} value the name being set
       */
      set isVisible(value) {
        rectangle.isVisible = value;
      },
      /**
       * Gets the row's name.
       */
      get name() {
        return rectangle.name;
      },
      /**
       * Sets the row's name.
       * @param {String} value the name being set
       */
      set name(value) {
        rectangle.name = value;
      },
      /** the top-level container for the row. */
      container: rectangle,
      /**
       * Resets all highlights on the row.
       */
      resetHighlights: () => {
        rectangle.background = Materials.darkRGB;
        const children = rectangle.children;
        for (let i = children.length - 1; i >= 0; i--) {
          const child = children[i];
          if (child.hasOwnProperty("children") || "children" in child) {
            // only BABYLON.GUI.Containers will have children
            for (let j = child.children.length - 1; j >= 0; j--) {
              const subChild = child.children[j];
              subChild.color = Materials.lightRGB;
            }
          } else {
            child.color = Materials.lightRGB;
          }
        }
      },
      set: parameterObject.set
    };
  }
  /**
   * Creates a BABYLON.GUI.TextBlock based on the supplied parameters.
   * 
   * Missing parameters are assumed to have the following defaults:
   * 
   * text: ""
   * 
   * color: Materials.lightRGB
   * 
   * resizeToFit: true
   * 
   * @param {object} parameterObject the text block parameters
   * @returns {BABYLON.GUI.Grid} the text block
   */
  createTextBlock(parameterObject = { }) {
    /** @type {BABYLON.GUI.TextBlock} the text block being created  */
    let text = new BABYLON.GUI.TextBlock(parameterObject.hasOwnProperty("key") ? parameterObject.key : WizardryScene.randomKey());    
    text.text = parameterObject.hasOwnProperty("text") ? parameterObject.text : "";
    text.color = parameterObject.hasOwnProperty("color") ? parameterObject.color : Materials.lightRGB;
    text.resizeToFit = parameterObject.hasOwnProperty("resizeToFit") ? parameterObject.resizeToFit : true;
    if (parameterObject.hasOwnProperty("horizontalAlignment")) {
      text.horizontalAlignment = parameterObject.horizontalAlignment;
    }
    if (parameterObject.hasOwnProperty("verticalAlignment")) {
      text.horizontalAlignment = parameterObject.verticalAlignment;
    }
    if (parameterObject.hasOwnProperty("paddingLeft")) {
      text.paddingLeft = parameterObject.paddingLeft;
    }
    if (parameterObject.hasOwnProperty("paddingRight")) {
      text.paddingRight = parameterObject.paddingRight;
    }
    if (parameterObject.hasOwnProperty("paddingTop")) {
      text.paddingTop = parameterObject.paddingTop;
    }
    if (parameterObject.hasOwnProperty("paddingBottom")) {
      text.paddingBottom = parameterObject.paddingBottom;
    }
    if (parameterObject.hasOwnProperty("lineSpacing")) {
      text.lineSpacing = parameterObject.lineSpacing;
    }
    if (parameterObject.hasOwnProperty("textHorizontalAlignment")) {
      text.textHorizontalAlignment = parameterObject.textHorizontalAlignment;
    }
    if (parameterObject.hasOwnProperty("textVerticalAlignment")) {
      text.textVerticalAlignment = parameterObject.textVerticalAlignment;
    }
    if (parameterObject.hasOwnProperty("textWrapping")) {
      text.textWrapping = parameterObject.textWrapping;
    }
    this._textBlocks.push(text);
    return text;
  }
  /**
   * Resets flags and the UI upon exit.
   */
  exitScene() {
    //this._advancedTexture.dispose();
    this.detachControl();
    //this._uiCreated = false;
    this.resetButtons();
    this._enterScene = true;
  }
  /**
   * Initializes the UI.
   */
  initUi() {
    document.fonts.load('16px C64ProMono').then(() => {  // start loading font
      document.fonts.ready.then(() => {
        for (let i = this._textBlocks.length - 1; i >= 0; i--) {
          this._textBlocks[i].fontFamily = "C64ProMono";
        }
      });
    });
  }
  resetButtons() {
    for (let i = this._buttons.length - 1; i >= 0; i--) {
      this._buttons[i].rectangle.background = Materials.darkRGB;
      this._buttons[i].text.color = Materials.lightRGB;
    }
  }
}

export { KEYBOARD_ENTRY_DELAY, WizardryScene };