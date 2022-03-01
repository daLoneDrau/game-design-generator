function createScreenOutline(canvas, scene, parameterObject) {
  // Creates a new AdvancedDynamicTexture in fullscreen mode. In this mode the texture will rely on a layer for its rendering. This allows it to be treated like any other layer. As such, if you have a multi camera setup, you can set the layerMask on the GUI as well. LayerMask is set through
  let advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
    "UI", // name for the texture
    true, // boolean indicating if the texture must be rendered in foreground (default is true)
    scene // the hosting scene
  );
  const cellWidth = canvas.clientWidth / parameterObject.cols;
  const cellHeight = canvas.clientHeight / parameterObject.rows;
  console.log(cellHeight,cellWidth)
  for (let i = 0, li = parameterObject.lines.length; i < li; i++) {
    let points = parameterObject.lines[i].points;
    let line = new BABYLON.GUI.Line();
    let x1, y1, x2, y2;
    if (points.length !== 2) {
      throw ["invalid points array", points];
    }
    if (points[0].hasOwnProperty("cell")) {
      // start in the middle of the cell
      x1 = points[0].cell[0] * cellWidth + cellWidth * 0.5;
      y1 = points[0].cell[1] * cellHeight + cellHeight * 0.5;
    }
    if (points[1].hasOwnProperty("cell")) {
      // start in the middle of the cell
      x2 = points[1].cell[0] * cellWidth + cellWidth * 0.5;
      y2 = points[1].cell[1] * cellHeight + cellHeight * 0.5;
    }
    line.x1 = x1;
    line.y1 = y1;
    line.x2 = x2;
    line.y2 = y2;
    line.lineWidth = 3;
    line.color = "white";
    advancedTexture.addControl(line);
  }
}

export { createScreenOutline };