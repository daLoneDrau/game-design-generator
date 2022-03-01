const lightColor = new BABYLON.Color3(0.651, 0.6314, 1);
const lightColor4 = new BABYLON.Color4(0.651, 0.6314, 1, 1);
const darkColor = new BABYLON.Color3(0.2627, 0.2588, 0.902);
const darkColor4 = new BABYLON.Color4(0.2627, 0.2588, 0.902, 1);

let lightMaterial, darkMaterial;

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

export { lightColor, lightColor4, darkColor, darkColor4, lightMaterial, darkMaterial, initMaterials };