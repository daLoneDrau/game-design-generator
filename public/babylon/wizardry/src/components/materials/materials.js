if (typeof(module) !== "undefined") {
  require("../../../../vendor/babylon.js")
}

/** the {BABYLON.Color3} light foreground color. */
const lightColor = new BABYLON.Color3(0.651, 0.6314, 1);
/** the {BABYLON.Color4} light foreground color. */
const lightColor4 = new BABYLON.Color4(0.651, 0.6314, 1, 1);
/** the {string} light foreground color. */
const lightRGB = "rgb(166, 161, 255)";
/** the {BABYLON.Color3} dark background color. */
const darkColor = new BABYLON.Color3(0.2627, 0.2588, 0.902);
/** the {BABYLON.Color4} dark background color. */
const darkColor4 = new BABYLON.Color4(0.2627, 0.2588, 0.902, 1);
/** the {string} dark background color. */
const darkRGB = "rgb(67, 66, 230)";

let lightMaterial, darkMaterial;

/**
 * Initializes materials for the selected scene.
 * @param {BABYLON.Scene} scene the scene the material belongs to
 */
function initMaterials(scene) {
  if (typeof(lightMaterial) === "undefined") {
    lightMaterial = new BABYLON.StandardMaterial("lightMaterial", scene);
    lightMaterial.emissiveColor = lightColor;  // the color or texture of the material as if self lit;
  }
  if (typeof(darkMaterial) === "undefined") {
    darkMaterial = new BABYLON.StandardMaterial("darkMaterial", scene);
    darkMaterial.emissiveColor = darkColor;  // the color or texture of the material as if self lit;
  }
}
function initStyle(advancedTexture) {
  let style = advancedTexture.createStyle();
  style.fontSize = 16;
  style.fontFamily = "C64ProMono";
}

export { lightColor, lightColor4, lightRGB, darkColor, darkColor4, darkRGB, lightMaterial, darkMaterial, initMaterials, initStyle };