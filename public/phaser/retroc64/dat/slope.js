const DIV3 = 0.3333333333333333333333;
const TOP_SLOPE = 0.571429;
const BOTTOM_SLOPE = -0.589286;
let x = [0, 112, 192, 220, 236, 244];
let runWalls = function() {
  let position = 0;
  for (let i = 0, li = x.length; i < li; i++) {
    if (i + 1 === li) {
      break;
    }
    { // open
      let o = {
        COMMENT: ["LEFT ", position, " OPEN"].join(""),
        texture: {
          position: position,
          edge: "open",
          key: ["akalabeth_wall_", position, "_open"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) {
        // first iteration  
        { // polygon
          // beginning lx,ty
          polygon.push(x[i], Math.round(x[i] * TOP_SLOPE));
          // rx, ty
          polygon.push(x[i + 1], Math.round(x[i + 1] * TOP_SLOPE));
          // rx, by
          polygon.push(x[i + 1], Math.round(x[i + 1] * BOTTOM_SLOPE + 320));
          // lx, by
          polygon.push(x[i], Math.round(x[i] * BOTTOM_SLOPE + 320));
        }  
        { // lines
          lines.push([
            x[i], Math.round(x[i] * TOP_SLOPE),
            x[i + 1], Math.round(x[i + 1] * TOP_SLOPE)
          ]);
          lines.push([
            x[i], Math.round(x[i] * BOTTOM_SLOPE + 320),
            x[i + 1], Math.round(x[i + 1] * BOTTOM_SLOPE + 320)
          ]);
        }
        // set height
        o.texture.height = Math.round(x[i] * BOTTOM_SLOPE + 320);
      } else {
        let left   = 0;
        let middle = x[i];
        let right  = x[i + 1];
        let top = 0;
        let topMiddle = Math.round(x[i + 1] * TOP_SLOPE) - Math.round(x[i] * TOP_SLOPE);
        let bottomMiddle = Math.round((x[i + 1]) * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        let bottom = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        { // polygon
          // start at left painting facing wall top edge
          polygon.push(left, top);
          // stop at right side of facing wall top edge
          polygon.push(middle, top);
          // start perspective of non-facing side
          polygon.push(right, topMiddle);
          // go down right edge of non-facing side
          polygon.push(right, bottomMiddle);
          // slope to right edge of facing side
          polygon.push(middle, bottom);
          // complete bottom edge of facing side
          polygon.push(left, bottom);
        }      
        { // lines
          // draw top edge of facing wall
          lines.push([
            left, top + 1,
            middle, top + 1
          ]);
          // draw right edge of facing wall
          lines.push([
            middle - 1, top,
            middle - 1, bottom
          ]);
          // draw bottom edge of facing wall
          lines.push([
            left, bottom - 1,
            middle, bottom - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middle, top,
            right, topMiddle
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middle, bottom,
            right, bottomMiddle
          ]);
        }  
        // set height
        o.texture.height = bottom;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    { // closed
      let o = {
        COMMENT: ["LEFT ", position, " CLOSED"].join(""),
        texture: {
          position: position,
          edge: "closed",
          key: ["akalabeth_wall_", position, "_closed"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) {
        // first iteration  
        { // polygon
          // beginning lx,ty
          polygon.push(x[i], Math.round(x[i] * TOP_SLOPE));
          // rx, ty
          polygon.push(x[i + 1], Math.round(x[i + 1] * TOP_SLOPE));
          // rx, by
          polygon.push(x[i + 1], Math.round(x[i + 1] * BOTTOM_SLOPE + 320));
          // lx, by
          polygon.push(x[i], Math.round(x[i] * BOTTOM_SLOPE + 320));
        }
        { // lines
          lines.push([
            x[i], Math.round(x[i] * TOP_SLOPE),
            x[i + 1], Math.round(x[i + 1] * TOP_SLOPE)
          ]);
          lines.push([
            x[i], Math.round(x[i] * BOTTOM_SLOPE + 320),
            x[i + 1], Math.round(x[i + 1] * BOTTOM_SLOPE + 320)
          ]);
          lines.push([
            x[i + 1] - 1, Math.round(x[i + 1] * TOP_SLOPE),
            x[i + 1] - 1, Math.round(x[i + 1] * BOTTOM_SLOPE + 320)
          ]);
        }
        // set height
        o.texture.height = Math.round(x[i] * BOTTOM_SLOPE + 320);
      } else {
        let left   = 0;
        let middle = x[i];
        let right  = x[i + 1];
        let top = 0;
        let topMiddle = Math.round(x[i + 1] * TOP_SLOPE) - Math.round(x[i] * TOP_SLOPE);
        let bottomMiddle = Math.round((x[i + 1]) * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        let bottom = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        { // polygon
          // start at left painting facing wall top edge
          polygon.push(left, top);
          // stop at right side of facing wall top edge
          polygon.push(middle, top);
          // start perspective of non-facing side
          polygon.push(right, topMiddle);
          // go down right edge of non-facing side
          polygon.push(right, bottomMiddle);
          // slope to right edge of facing side
          polygon.push(middle, bottom);
          // complete bottom edge of facing side
          polygon.push(left, bottom);
        }      
        { // lines
          // draw top edge of facing wall
          lines.push([
            left, top + 1,
            middle, top + 1
          ]);
          // draw right edge of facing wall
          lines.push([
            middle - 1, top,
            middle - 1, bottom
          ]);
          // draw bottom edge of facing wall
          lines.push([
            left, bottom - 1,
            middle, bottom - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middle, top,
            right, topMiddle
          ]);
          // draw right edge of non-facing wall
          lines.push([
            right - 1, topMiddle,
            right - 1, bottomMiddle
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middle, bottom,
            right, bottomMiddle
          ]);
        }  
        // set height
        o.texture.height = bottom;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    { // center
      if (i > 0) {
        let o = {
          COMMENT: ["CENTER ", position + 1].join(""),
          texture: {
            position: position + 1,
            edge: "closed",
            key: ["akalabeth_wall_", position + 1, "_closed"].join(""),
          }
        };
        let polygon = [];
        let lines = [];
        let left = 0;
        let right = 560 - x[i] * 2;
        let top = 0;
        let topMiddle = Math.round(x[i + 1] * TOP_SLOPE) - Math.round(x[i] * TOP_SLOPE);
        let bottomMiddle = Math.round((x[i + 1]) * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        let bottom = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        { // polygon
          polygon.push(left, top);
          polygon.push(right, top);
          polygon.push(right, bottom);
          polygon.push(left, bottom);
        }      
        { // lines
          lines.push([
            left, top + 1,
            right, top + 1
          ]);
          lines.push([
            left + 1, top,
            left + 1, bottom
          ]);
          lines.push([
            left, bottom - 1,
            right, bottom - 1
          ]);
          lines.push([
            right - 1, top,
            right - 1, bottom
          ]);
        }  
        // set height
        o.polygon = polygon;
        o.lines = lines;
        o.texture.height = bottom;
        o.texture.width = right;
        console.log(o);
      }
    }
    { // right open
      let o = {
        COMMENT: ["RIGHT ", position + 2, " OPEN"].join(""),
        texture: {
          position: position + 2,
          edge: "open",
          key: ["akalabeth_wall_", position + 2, "_open"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) {
        // first iteration  
        { // polygon
          // beginning lx,ty
          polygon.push(x[i + 1], Math.round(x[i] * TOP_SLOPE));
          // rx, ty
          polygon.push(x[i], Math.round(x[i + 1] * TOP_SLOPE));
          // rx, by
          polygon.push(x[i], Math.round(x[i + 1] * BOTTOM_SLOPE + 320));
          // lx, by
          polygon.push(x[i + 1], Math.round(x[i] * BOTTOM_SLOPE + 320));
        }
        { // lines
          lines.push([
            x[i + 1], Math.round(x[i] * TOP_SLOPE),
            x[i], Math.round(x[i + 1] * TOP_SLOPE)
          ]);
          lines.push([
            x[i + 1], Math.round(x[i] * BOTTOM_SLOPE + 320),
            x[i], Math.round(x[i + 1] * BOTTOM_SLOPE + 320)
          ]);
        }
        // set height
        o.texture.height = Math.round(x[i] * BOTTOM_SLOPE + 320);  
      } else {
        let right = x[i + 1];
        let middle = x[i + 1] - x[i];
        let left = 0;
        let top = 0;
        let topMiddle = Math.round((x[i + 1] - x[i]) * TOP_SLOPE);
        let bottomMiddle = Math.round((x[i + 1]) * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        let bottom = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        { // polygon
          // start at right edge painting facing wall
          polygon.push(right, top);
          // stop at left edge of facing wall
          polygon.push(middle, top);
          // start perspective of non-facing side
          polygon.push(left, topMiddle);
          // go down left edge of non-facing side
          polygon.push(left, bottomMiddle);
          // slope to left edge of facing side
          polygon.push(middle, bottom);
          // complete bottom edge of facing side
          polygon.push(right, bottom);
        }      
        { // lines
          // draw top edge of facing wall
          lines.push([
            right, top + 1,
            middle, top + 1
          ]);
          // draw left edge of facing wall
          lines.push([
            middle + 1, top,
            middle + 1, bottom
          ]);
          // draw bottom edge of facing wall
          lines.push([
            right, bottom - 1,
            middle, bottom - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middle, top,
            left, topMiddle
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middle, bottom,
            left, bottomMiddle
          ]);
        }  
        // set height
        o.texture.height = bottom;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    { // right closed
      let o = {
        COMMENT: ["RIGHT ", position + 2, " CLOSED"].join(""),
        texture: {
          position: position + 2,
          edge: "closed",
          key: ["akalabeth_wall_", position + 2, "_closed"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) {
        // first iteration  
        { // polygon
          // beginning lx,ty
          polygon.push(x[i + 1], Math.round(x[i] * TOP_SLOPE));
          // rx, ty
          polygon.push(x[i], Math.round(x[i + 1] * TOP_SLOPE));
          // rx, by
          polygon.push(x[i], Math.round(x[i + 1] * BOTTOM_SLOPE + 320));
          // lx, by
          polygon.push(x[i + 1], Math.round(x[i] * BOTTOM_SLOPE + 320));
        }
        { // lines
          lines.push([
            x[i + 1], Math.round(x[i] * TOP_SLOPE),
            x[i], Math.round(x[i + 1] * TOP_SLOPE)
          ]);
          lines.push([
            x[i + 1], Math.round(x[i] * BOTTOM_SLOPE + 320),
            x[i], Math.round(x[i + 1] * BOTTOM_SLOPE + 320)
          ]);
          lines.push([
            1, Math.round(x[i + 1] * TOP_SLOPE),
            1, Math.round(x[i + 1] * BOTTOM_SLOPE + 320)
          ]);
        }
        // set height
        o.texture.height = Math.round(x[i] * BOTTOM_SLOPE + 320);  
      } else {
        let right = x[i + 1];
        let middle = x[i + 1] - x[i];
        let left = 0;
        let top = 0;
        let topMiddle = Math.round((x[i + 1] - x[i]) * TOP_SLOPE);
        let bottomMiddle = Math.round((x[i + 1]) * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        let bottom = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        { // polygon
          // start at right edge painting facing wall
          polygon.push(right, top);
          // stop at left edge of facing wall
          polygon.push(middle, top);
          // start perspective of non-facing side
          polygon.push(left, topMiddle);
          // go down left edge of non-facing side
          polygon.push(left, bottomMiddle);
          // slope to left edge of facing side
          polygon.push(middle, bottom);
          // complete bottom edge of facing side
          polygon.push(right, bottom);
        }      
        { // lines
          // draw top edge of facing wall
          lines.push([
            right, top + 1,
            middle, top + 1
          ]);
          // draw left edge of facing wall
          lines.push([
            middle + 1, top,
            middle + 1, bottom
          ]);
          // draw bottom edge of facing wall
          lines.push([
            right, bottom - 1,
            middle, bottom - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middle, top,
            left, topMiddle
          ]);
          // draw left edge of non-facing wall
          lines.push([
            left + 1, topMiddle,
            left + 1, bottomMiddle
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middle, bottom,
            left, bottomMiddle
          ]);
        }  
        // set height
        o.texture.height = bottom;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runDoors = function() {
  let position = 0;
  for (let i = 0, li = x.length; i < li; i++) {
    if (i + 1 === li) {
      break;
    }
    { // left open
      let o = {
        COMMENT: ["LEFT DOOR ", position, " OPEN"].join(""),
        texture: {
          position: position,
          edge: "open",
          key: ["akalabeth_door_", position, "_open"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) { // first iteration
        /*********************
         * WALL EDGES
         */
        let leftX        = x[i];
        let leftTopY     = Math.round(leftX * TOP_SLOPE);
        let leftBottomY  = Math.round(leftX * BOTTOM_SLOPE) + 320;
        let rightX       = x[i + 1];
        let rightTopY    = Math.round(rightX * TOP_SLOPE);
        let rightBottomY = Math.round(rightX * BOTTOM_SLOPE) + 320;
        /*********************
         * DOOR EDGES
         */
        let doorRightX       = rightX - Math.round((rightX - leftX) * 0.3);
        let doorRightTopY    = Math.round(doorRightX * TOP_SLOPE);
        let doorRightBottomY = Math.round(doorRightX * BOTTOM_SLOPE) + 320;
        { // polygon
          // beginning lx,ty
          polygon.push(leftX, leftTopY);
          // rx, ty
          polygon.push(rightX, rightTopY);
          // rx, by
          polygon.push(rightX, rightBottomY);
          // lx, by
          polygon.push(leftX, leftBottomY);
        }
        { // WALL lines
          lines.push([
            leftX, leftTopY,
            rightX, rightTopY
          ]);
          lines.push([
            leftX, leftBottomY,
            rightX, rightBottomY
          ]);
        }
        { // DOOR lines
          lines.push([
            leftX, leftTopY + Math.round((leftBottomY - leftTopY) * 0.15),
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15)
          ]);
          lines.push([
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15),
            doorRightX, doorRightBottomY
          ]);
        }
        // set height
        o.texture.height = leftBottomY;
      } else {
        /*********************
         * WALL EDGES
         */
        let leftX         = 0;
        let middleX       = x[i];
        let rightX        = x[i + 1];
        /** the top-most point of the wall. */
        let topY          = 0;
        /** the bottom-most point of the wall. */
        let bottomY       = Math.round(middleX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);
        /** the highest point of the wall's edge as it extends into the distance. */
        let topMiddleY    = Math.round(rightX * TOP_SLOPE) - Math.round(middleX * TOP_SLOPE);
        /** the lowest point of the wall's edge as it extends into the distance. */
        let bottomMiddleY = Math.round(rightX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);

        /*********************
         * DOOR EDGES
         */
        /** door left is left offset + (right edge - left edge) * 1/3 */
        let doorLeftX         = middleX + Math.round((rightX - middleX) * DIV3);
        /** door right is door left + (right edge - left edge) * 1/3 */
        let doorRightX        = doorLeftX + Math.round((rightX - middleX) * DIV3);
        /** door bottom is (door left * bottom slope equation plus height of viewing field) - top offset (left edge * top slope equation) */
        let doorLeftBottomY   = Math.round(doorLeftX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);
        let doorRightBottomY  = Math.round(doorRightX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);
        /** door top is (door left  - left offset) * top slope equation */
        let doorLeftTopY      = Math.round((doorLeftX - middleX) * TOP_SLOPE);
        let doorRightTopY     = Math.round((doorRightX - middleX) * TOP_SLOPE);
        { // WALL polygon
          // start at left painting facing wall top edge
          polygon.push(leftX, topY);
          // stop at right side of facing wall top edge
          polygon.push(middleX, topY);
          // start perspective of non-facing side
          polygon.push(rightX, topMiddleY);
          // go down right edge of non-facing side
          polygon.push(rightX, bottomMiddleY);
          // slope to right edge of facing side
          polygon.push(middleX, bottomY);
          // complete bottom edge of facing side
          polygon.push(leftX, bottomY);
        }      
        { // WALL lines
          // draw top edge of facing wall
          lines.push([
            leftX, topY + 1,
            middleX, topY + 1
          ]);
          // draw right edge of facing wall
          lines.push([
            middleX - 1, topY,
            middleX - 1, bottomY
          ]);
          // draw bottom edge of facing wall
          lines.push([
            leftX, bottomY - 1,
            middleX, bottomY - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middleX, topY,
            rightX, topMiddleY
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middleX, bottomY,
            rightX, bottomMiddleY
          ]);
        }
        { // DOOR LINES
          // draw door left edge
          lines.push([
            doorLeftX, doorLeftBottomY,
            doorLeftX, Math.round(doorLeftTopY + (doorLeftBottomY - doorLeftTopY) * 0.15) // door left top point offset by 15% of the door height
          ]);
          // draw door right edge
          lines.push([
            doorRightX, doorRightBottomY,
            doorRightX, Math.round(doorRightTopY + (doorRightBottomY - doorRightTopY) * 0.15) // door right top point offset by 15% of the door height
          ]);
          // draw door top edge
          lines.push([
            doorLeftX, Math.round(doorLeftTopY + (doorLeftBottomY - doorLeftTopY) * 0.15),
            doorRightX, Math.round(doorRightTopY + (doorRightBottomY - doorRightTopY) * 0.15)
          ]);
        }
        // set height
        o.texture.height = bottomY;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    { // left closed
      let o = {
        COMMENT: ["LEFT DOOR ", position, " CLOSED"].join(""),
        texture: {
          position: position,
          edge: "closed",
          key: ["akalabeth_door_", position, "_closed"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) { // first iteration
        /*********************
         * WALL EDGES
         */
        let leftX        = x[i];
        let leftTopY     = Math.round(leftX * TOP_SLOPE);
        let leftBottomY  = Math.round(leftX * BOTTOM_SLOPE) + 320;
        let rightX       = x[i + 1];
        let rightTopY    = Math.round(rightX * TOP_SLOPE);
        let rightBottomY = Math.round(rightX * BOTTOM_SLOPE) + 320;
        /*********************
         * DOOR EDGES
         */
        let doorRightX       = rightX - Math.round((rightX - leftX) * 0.3);
        let doorRightTopY    = Math.round(doorRightX * TOP_SLOPE);
        let doorRightBottomY = Math.round(doorRightX * BOTTOM_SLOPE) + 320;
        { // polygon
          // beginning lx,ty
          polygon.push(leftX, leftTopY);
          // rx, ty
          polygon.push(rightX, rightTopY);
          // rx, by
          polygon.push(rightX, rightBottomY);
          // lx, by
          polygon.push(leftX, leftBottomY);
        }
        { // WALL lines
          lines.push([
            leftX, leftTopY,
            rightX, rightTopY
          ]);
          lines.push([
            leftX, leftBottomY,
            rightX, rightBottomY
          ]);
          lines.push([
            rightX - 1, rightTopY,
            rightX - 1, rightBottomY
          ]);
        }
        { // DOOR lines
          lines.push([
            leftX, leftTopY + Math.round((leftBottomY - leftTopY) * 0.15),
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15)
          ]);
          lines.push([
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15),
            doorRightX, doorRightBottomY
          ]);
        }
        // set height
        o.texture.height = leftBottomY;
      } else {
        /*********************
         * WALL EDGES
         */
        let leftX         = 0;
        let middleX       = x[i];
        let rightX        = x[i + 1];
        /** the top-most point of the wall. */
        let topY          = 0;
        /** the bottom-most point of the wall. */
        let bottomY       = Math.round(middleX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);
        /** the highest point of the wall's edge as it extends into the distance. */
        let topMiddleY    = Math.round(rightX * TOP_SLOPE) - Math.round(middleX * TOP_SLOPE);
        /** the lowest point of the wall's edge as it extends into the distance. */
        let bottomMiddleY = Math.round(rightX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);

        /*********************
         * DOOR EDGES
         */
        /** door left is left offset + (right edge - left edge) * 1/3 */
        let doorLeftX         = middleX + Math.round((rightX - middleX) * DIV3);
        /** door right is door left + (right edge - left edge) * 1/3 */
        let doorRightX        = doorLeftX + Math.round((rightX - middleX) * DIV3);
        /** door bottom is (door left * bottom slope equation plus height of viewing field) - top offset (left edge * top slope equation) */
        let doorLeftBottomY   = Math.round(doorLeftX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);
        let doorRightBottomY  = Math.round(doorRightX * BOTTOM_SLOPE + 320) - Math.round(middleX * TOP_SLOPE);
        /** door top is (door left  - left offset) * top slope equation */
        let doorLeftTopY      = Math.round((doorLeftX - middleX) * TOP_SLOPE);
        let doorRightTopY     = Math.round((doorRightX - middleX) * TOP_SLOPE);
        { // WALL polygon
          // start at left painting facing wall top edge
          polygon.push(leftX, topY);
          // stop at right side of facing wall top edge
          polygon.push(middleX, topY);
          // start perspective of non-facing side
          polygon.push(rightX, topMiddleY);
          // go down right edge of non-facing side
          polygon.push(rightX, bottomMiddleY);
          // slope to right edge of facing side
          polygon.push(middleX, bottomY);
          // complete bottom edge of facing side
          polygon.push(leftX, bottomY);
        }      
        { // WALL lines
          // draw top edge of facing wall
          lines.push([
            leftX, topY + 1,
            middleX, topY + 1
          ]);
          // draw right edge of facing wall
          lines.push([
            middleX - 1, topY,
            middleX - 1, bottomY
          ]);
          // draw bottom edge of facing wall
          lines.push([
            leftX, bottomY - 1,
            middleX, bottomY - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middleX, topY,
            rightX, topMiddleY
          ]);
          // draw right edge of non-facing wall
          lines.push([
            rightX - 1, topMiddleY,
            rightX - 1, bottomMiddleY
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middleX, bottomY,
            rightX, bottomMiddleY
          ]);
        }
        { // DOOR LINES
          // draw door left edge
          lines.push([
            doorLeftX, doorLeftBottomY,
            doorLeftX, Math.round(doorLeftTopY + (doorLeftBottomY - doorLeftTopY) * 0.15) // door left top point offset by 15% of the door height
          ]);
          // draw door right edge
          lines.push([
            doorRightX, doorRightBottomY,
            doorRightX, Math.round(doorRightTopY + (doorRightBottomY - doorRightTopY) * 0.15) // door right top point offset by 15% of the door height
          ]);
          // draw door top edge
          lines.push([
            doorLeftX, Math.round(doorLeftTopY + (doorLeftBottomY - doorLeftTopY) * 0.15),
            doorRightX, Math.round(doorRightTopY + (doorRightBottomY - doorRightTopY) * 0.15)
          ]);
        }
        // set height
        o.texture.height = bottomY;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    { // center
      if (i > 0) {
        let o = {
          COMMENT: ["DOOR ", position + 1].join(""),
          texture: {
            position: position + 1,
            edge: "closed",
            key: ["akalabeth_door_", position + 1, "_closed"].join(""),
          }
        };
        let polygon = [];
        let lines = [];
        let left = 0;
        let right = 560 - x[i] * 2;
        let doorLeft = Math.round(right * DIV3);
        let doorRight = right - Math.round(right * DIV3);
        let top = 0;
        let topMiddle = Math.round(x[i + 1] * TOP_SLOPE) - Math.round(x[i] * TOP_SLOPE);
        let bottomMiddle = Math.round((x[i + 1]) * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        let bottom = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        let doorTop = Math.round(bottom * 0.15);
        { // polygon
          polygon.push(left, top);
          polygon.push(right, top);
          polygon.push(right, bottom);
          polygon.push(left, bottom);
        }      
        { // lines
          lines.push([
            left, top + 1,
            right, top + 1
          ]);
          lines.push([
            left + 1, top,
            left + 1, bottom
          ]);
          lines.push([
            left, bottom - 1,
            right, bottom - 1
          ]);
          lines.push([
            right - 1, top,
            right - 1, bottom
          ]);
          // door
          lines.push([
            doorLeft, doorTop,
            doorLeft, bottom
          ]);
          lines.push([
            doorLeft, doorTop,
            doorRight, doorTop
          ]);
          lines.push([
            doorRight, doorTop,
            doorRight, bottom
          ]);
        }  
        // set height
        o.polygon = polygon;
        o.lines = lines;
        o.texture.height = bottom;
        o.texture.width = right;
        console.log(o);
      }
    }
    { // right open
      let o = {
        COMMENT: ["RIGHT DOOR ", position + 2, " OPEN"].join(""),
        texture: {
          position: position + 2,
          edge: "open",
          key: ["akalabeth_door_", position + 2, "_open"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) { // first iteration
        /*********************
         * WALL EDGES
         */
        let leftX        = x[i];
        let rightX       = x[i + 1];
        let leftTopY     = Math.round(rightX * TOP_SLOPE);
        let leftBottomY  = Math.round(rightX * BOTTOM_SLOPE) + 320;
        let rightTopY    = Math.round(leftX * TOP_SLOPE);
        let rightBottomY = Math.round(leftX * BOTTOM_SLOPE) + 320;
        /*********************
         * DOOR EDGES
         */
        let doorLeftX       = leftX + Math.round((rightX - leftX) * 0.3);
        let doorLeftTopY    = Math.round((rightX - doorLeftX) * TOP_SLOPE);
        let doorLeftBottomY = Math.round((rightX - doorLeftX) * BOTTOM_SLOPE) + 320;
        { // polygon
          // beginning lx,ty
          polygon.push(leftX, leftTopY);
          // rx, ty
          polygon.push(rightX, rightTopY);
          // rx, by
          polygon.push(rightX, rightBottomY);
          // lx, by
          polygon.push(leftX, leftBottomY);
        }
        { // WALL lines
          lines.push([
            leftX, leftTopY,
            rightX, rightTopY
          ]);
          lines.push([
            leftX, leftBottomY,
            rightX, rightBottomY
          ]);
        }
        { // DOOR lines
          lines.push([
            rightX, rightTopY + Math.round((rightBottomY - rightTopY) * 0.15),
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15)
          ]);
          lines.push([
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15),
            doorLeftX, doorLeftBottomY
          ]);
        }
        // set height
        o.texture.height = Math.round(x[i] * BOTTOM_SLOPE + 320);  
      } else {
        /*********************
         * WALL EDGES
         */
        let rightX        = x[i + 1];
        let middleX       = x[i + 1] - x[i];
        let leftX         = 0;
        let topY          = 0;
        let topMiddleY    = Math.round(middleX * TOP_SLOPE);
        let bottomMiddleY = Math.round(rightX * BOTTOM_SLOPE) + 320 - Math.round(x[i] * TOP_SLOPE);
        let bottomY       = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        /*********************
         * DOOR EDGES
         */
        // calculate the slope of the current line.
        let slope;
        {
          let x1 = 0, y1 = bottomMiddleY;
          let x2 = middleX, y2 = bottomY;
          let m = (y2 - y1) / (x2 - x1);
          slope = function(x) {
            return Math.round(m * x + y1);
          }
        }
        /** door left is 1/3 width of wall */
        let doorLeftX         = Math.round(middleX * DIV3);
        /** door right is door left + 1/3 width of wall */
        let doorRightX        = doorLeftX + doorLeftX;
        /** door bottom is (door left * bottom slope equation plus height of viewing field) - top offset (left edge * top slope equation) */
        let doorLeftTopY      = Math.round((middleX - doorLeftX) * TOP_SLOPE);
        let doorRightTopY     = Math.round((middleX - doorRightX) * TOP_SLOPE);
        let doorLeftBottomY   = slope(doorLeftX);
        let doorRightBottomY  = slope(doorRightX);
        { // polygon
          // start at right edge painting facing wall
          polygon.push(rightX, topY);
          // stop at left edge of facing wall
          polygon.push(middleX, topY);
          // start perspective of non-facing side
          polygon.push(leftX, topMiddleY);
          // go down left edge of non-facing side
          polygon.push(leftX, bottomMiddleY);
          // slope to left edge of facing side
          polygon.push(middleX, bottomY);
          // complete bottom edge of facing side
          polygon.push(rightX, bottomY);
        }
        { // WALL lines
          // draw top edge of facing wall
          lines.push([
            rightX, topY + 1,
            middleX, topY + 1
          ]);
          // draw left edge of facing wall
          lines.push([
            middleX + 1, topY,
            middleX + 1, bottomY
          ]);
          // draw bottom edge of facing wall
          lines.push([
            rightX, bottomY - 1,
            middleX, bottomY - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middleX, topY,
            leftX, topMiddleY
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middleX, bottomY,
            leftX, bottomMiddleY
          ]);
        }
        { // DOOR lines
          lines.push([
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15),
            doorLeftX, doorLeftBottomY
          ]);
          lines.push([
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15),
            doorRightX, doorRightBottomY
          ]);
          lines.push([
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15),
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15)
          ]);
        }
        // set height
        o.texture.height = bottomY;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    { // right closed
      let o = {
        COMMENT: ["RIGHT ", position + 2, " CLOSED"].join(""),
        texture: {
          position: position + 2,
          edge: "closed",
          key: ["akalabeth_wall_", position + 2, "_closed"].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      if (i === 0) { // first iteration
        /*********************
         * WALL EDGES
         */
        let leftX        = x[i];
        let rightX       = x[i + 1];
        let leftTopY     = Math.round(rightX * TOP_SLOPE);
        let leftBottomY  = Math.round(rightX * BOTTOM_SLOPE) + 320;
        let rightTopY    = Math.round(leftX * TOP_SLOPE);
        let rightBottomY = Math.round(leftX * BOTTOM_SLOPE) + 320;
        /*********************
         * DOOR EDGES
         */
        let doorLeftX       = leftX + Math.round((rightX - leftX) * 0.3);
        let doorLeftTopY    = Math.round((rightX - doorLeftX) * TOP_SLOPE);
        let doorLeftBottomY = Math.round((rightX - doorLeftX) * BOTTOM_SLOPE) + 320;
        { // polygon
          // beginning lx,ty
          polygon.push(leftX, leftTopY);
          // rx, ty
          polygon.push(rightX, rightTopY);
          // rx, by
          polygon.push(rightX, rightBottomY);
          // lx, by
          polygon.push(leftX, leftBottomY);
        }
        { // WALL lines
          lines.push([
            leftX, leftTopY,
            rightX, rightTopY
          ]);
          lines.push([
            leftX, leftBottomY,
            rightX, rightBottomY
          ]);
          lines.push([
            leftX + 1, leftTopY,
            leftX + 1, leftBottomY
          ]);
        }
        { // DOOR lines
          lines.push([
            rightX, rightTopY + Math.round((rightBottomY - rightTopY) * 0.15),
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15)
          ]);
          lines.push([
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15),
            doorLeftX, doorLeftBottomY
          ]);
        }
        // set height
        o.texture.height = Math.round(x[i] * BOTTOM_SLOPE + 320);  
      } else {
        /*********************
         * WALL EDGES
         */
        let rightX        = x[i + 1];
        let middleX       = x[i + 1] - x[i];
        let leftX         = 0;
        let topY          = 0;
        let topMiddleY    = Math.round(middleX * TOP_SLOPE);
        let bottomMiddleY = Math.round(rightX * BOTTOM_SLOPE) + 320 - Math.round(x[i] * TOP_SLOPE);
        let bottomY       = Math.round(x[i] * BOTTOM_SLOPE + 320) - Math.round(x[i] * TOP_SLOPE);
        /*********************
         * DOOR EDGES
         */
        // calculate the slope of the current line.
        let slope;
        {
          let x1 = 0, y1 = bottomMiddleY;
          let x2 = middleX, y2 = bottomY;
          let m = (y2 - y1) / (x2 - x1);
          slope = function(x) {
            return Math.round(m * x + y1);
          }
        }
        /** door left is 1/3 width of wall */
        let doorLeftX         = Math.round(middleX * DIV3);
        /** door right is door left + 1/3 width of wall */
        let doorRightX        = doorLeftX + doorLeftX;
        /** door bottom is (door left * bottom slope equation plus height of viewing field) - top offset (left edge * top slope equation) */
        let doorLeftTopY      = Math.round((middleX - doorLeftX) * TOP_SLOPE);
        let doorRightTopY     = Math.round((middleX - doorRightX) * TOP_SLOPE);
        let doorLeftBottomY   = slope(doorLeftX);
        let doorRightBottomY  = slope(doorRightX);
        { // polygon
          // start at right edge painting facing wall
          polygon.push(rightX, topY);
          // stop at left edge of facing wall
          polygon.push(middleX, topY);
          // start perspective of non-facing side
          polygon.push(leftX, topMiddleY);
          // go down left edge of non-facing side
          polygon.push(leftX, bottomMiddleY);
          // slope to left edge of facing side
          polygon.push(middleX, bottomY);
          // complete bottom edge of facing side
          polygon.push(rightX, bottomY);
        }
        { // WALL lines
          // draw top edge of facing wall
          lines.push([
            rightX, topY + 1,
            middleX, topY + 1
          ]);
          // draw left edge of facing wall
          lines.push([
            middleX + 1, topY,
            middleX + 1, bottomY
          ]);
          // draw bottom edge of facing wall
          lines.push([
            rightX, bottomY - 1,
            middleX, bottomY - 1
          ]);
          // draw top edge of non-facing wall
          lines.push([
            middleX, topY,
            leftX, topMiddleY
          ]);
          // draw side edge of non-facing wall
          lines.push([
            leftX + 1, topMiddleY,
            leftX + 1, bottomMiddleY
          ]);
          // draw bottom edge of non-facing wall
          lines.push([
            middleX, bottomY,
            leftX, bottomMiddleY
          ]);
        }
        { // DOOR lines
          lines.push([
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15),
            doorLeftX, doorLeftBottomY
          ]);
          lines.push([
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15),
            doorRightX, doorRightBottomY
          ]);
          lines.push([
            doorRightX, doorRightTopY + Math.round((doorRightBottomY - doorRightTopY) * 0.15),
            doorLeftX, doorLeftTopY + Math.round((doorLeftBottomY - doorLeftTopY) * 0.15)
          ]);
        }
        // set height
        o.texture.height = bottomY;
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.width = x[i + 1];
      console.log(o);
    }
    
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runFloorholes = function() {
  let dimensions = [
    [560, 320],
    [336, 190],
    [176,  97],
    [120,  64],
    [ 88,  46]
  ];
  let originalScreen = [280, 160];
  let points = {
    A: [111.33333333333333, 136.66666666666666],
    B: [166.66666666666666, 136.66666666666666],
    C: [185.33333333333334, 147.33333333333331],
    D: [92.66666666666666, 147.33333333333331]
  };
  let proportions = {};
  for (let prop in points) {
    let o = {
      x: points[prop][0] / originalScreen[0],
      y: points[prop][1] / originalScreen[1]
    }
    proportions[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = dimensions.length; i < li; i++) {
    // holes are trapezoids covering the following points:
    /*************************
     *             A *-----------------------* B
     *              /                         \
     *             /                           \
     *            /                             \
     *           *-------------------------------*
     *          D                                 C
     */
    let o = {
      COMMENT: ["FLOOR HOLE ", position + 1].join(""),
      texture: {
        position: position + 1,
        edge: "closed",
        key: ["akalabeth_floor_hole_", position + 1].join(""),
      }
    };
    let polygon = [];
    let lines = [];
    { // polygon
      polygon.push(Math.round(proportions.A.x * dimensions[i][0]), Math.round(proportions.A.y * dimensions[i][1]));
      polygon.push(Math.round(proportions.B.x * dimensions[i][0]), Math.round(proportions.B.y * dimensions[i][1]));
      polygon.push(Math.round(proportions.C.x * dimensions[i][0]), Math.round(proportions.C.y * dimensions[i][1]));
      polygon.push(Math.round(proportions.D.x * dimensions[i][0]), Math.round(proportions.D.y * dimensions[i][1]));
    }
    { // lines
      lines.push(
        [
          Math.round(proportions.A.x * dimensions[i][0]), Math.round(proportions.A.y * dimensions[i][1]),
          Math.round(proportions.B.x * dimensions[i][0]), Math.round(proportions.B.y * dimensions[i][1])
        ],
        [
          Math.round(proportions.B.x * dimensions[i][0]), Math.round(proportions.B.y * dimensions[i][1]),
          Math.round(proportions.C.x * dimensions[i][0]), Math.round(proportions.C.y * dimensions[i][1])
        ],
        [
          Math.round(proportions.C.x * dimensions[i][0]), Math.round(proportions.C.y * dimensions[i][1]),
          Math.round(proportions.D.x * dimensions[i][0]), Math.round(proportions.D.y * dimensions[i][1])
        ],
        [
          Math.round(proportions.A.x * dimensions[i][0]), Math.round(proportions.A.y * dimensions[i][1]),
          Math.round(proportions.D.x * dimensions[i][0]), Math.round(proportions.D.y * dimensions[i][1])
        ]
      );
    }
    o.polygon = polygon;
    o.lines = lines;
    o.texture.height = dimensions[i][1];
    o.texture.width = dimensions[i][0];
    console.log(o)
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runLaddersUp = function() {
  let dimensions = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  let originalScreen = { width: 280, height: 160 };

  let holePoints = {
    A: { x: 111.33333333333333, y: 158 - 136.66666666666666 },
    B: { x: 166.66666666666666, y: 158 - 136.66666666666666 },
    C: { x: 185.33333333333334, y: 158 - 147.33333333333331 },
    D: { x:  92.66666666666666, y: 158 - 147.33333333333331 }
  };  
  let holeProportions = {};
  for (let prop in holePoints) {
    let o = {
      x: holePoints[prop].x / originalScreen.width,
      y: holePoints[prop].y / originalScreen.height
    }
    holeProportions[prop] = o;
  }
  let sides = {
    left: {
      value: 123.55555555555554,
      property: "width"
    },
    right: {
      value: 154.44444444444446,
      property: "width"
    },
    top: {
      value: 11.666666666666686,
      property: "height"
    },
    bottom: {
      value: 147.33333333333331,
      property: "height"
    },
    rung1: {
      value: (147.33333333333331 * 4 + 11.666666666666686) / 5,
      property: "height"
    },
    rung2: {
      value: (147.33333333333331 * 3 + 11.666666666666686 * 2) / 5,
      property: "height"
    },
    rung3: {
      value: (147.33333333333331 * 2 + 11.666666666666686 * 3) / 5,
      property: "height"
    },
    rung4: {
      value: (147.33333333333331 + 11.666666666666686 * 4) / 5,
      property: "height"
    }
  };
  let ladderProportions = {};
  for (let prop in sides) {
    let o = sides[prop].value / originalScreen[sides[prop].property];
    ladderProportions[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = dimensions.length; i < li; i++) {
    // holes are trapezoids covering the following points:
    /*************************
     *             A *-----------------------* B
     *              /                         \
     *             /                           \
     *            /                             \
     *           *-------------------------------*
     *          D                                 C
     */
    let o = {
      COMMENT: ["LADDER UP ", position + 1].join(""),
      texture: {
        position: position + 1,
        edge: "closed",
        key: ["akalabeth_ladder_up_", position + 1].join(""),
      }
    };
    let polygon = [];
    let lines = [];
    { // polygon
      polygon.push(Math.round(holeProportions.A.x * dimensions[i].width), Math.round(holeProportions.A.y * dimensions[i].height));
      polygon.push(Math.round(holeProportions.B.x * dimensions[i].width), Math.round(holeProportions.B.y * dimensions[i].height));
      polygon.push(Math.round(holeProportions.C.x * dimensions[i].width), Math.round(holeProportions.C.y * dimensions[i].height));
      polygon.push(Math.round(holeProportions.D.x * dimensions[i].width), Math.round(holeProportions.D.y * dimensions[i].height));
    }
    { // lines
      // outline the hole
      lines.push(
        [
          Math.round(holeProportions.A.x * dimensions[i].width), Math.round(holeProportions.A.y * dimensions[i].height),
          Math.round(holeProportions.B.x * dimensions[i].width), Math.round(holeProportions.B.y * dimensions[i].height)
        ],
        [
          Math.round(holeProportions.B.x * dimensions[i].width), Math.round(holeProportions.B.y * dimensions[i].height),
          Math.round(holeProportions.C.x * dimensions[i].width), Math.round(holeProportions.C.y * dimensions[i].height)
        ],
        [
          Math.round(holeProportions.C.x * dimensions[i].width), Math.round(holeProportions.C.y * dimensions[i].height),
          Math.round(holeProportions.D.x * dimensions[i].width), Math.round(holeProportions.D.y * dimensions[i].height)
        ],
        [
          Math.round(holeProportions.A.x * dimensions[i].width), Math.round(holeProportions.A.y * dimensions[i].height),
          Math.round(holeProportions.D.x * dimensions[i].width), Math.round(holeProportions.D.y * dimensions[i].height)
        ]
      );
      // plot the ladder
      lines.push(
        [
          Math.round(ladderProportions.left * dimensions[i].width), Math.round(ladderProportions.top * dimensions[i].height),
          Math.round(ladderProportions.left * dimensions[i].width), Math.round(ladderProportions.bottom * dimensions[i].height)
        ],
        [
          Math.round(ladderProportions.right * dimensions[i].width), Math.round(ladderProportions.top * dimensions[i].height),
          Math.round(ladderProportions.right * dimensions[i].width), Math.round(ladderProportions.bottom * dimensions[i].height)
        ],
        [
          Math.round(ladderProportions.left * dimensions[i].width), Math.round(ladderProportions.rung1 * dimensions[i].height),
          Math.round(ladderProportions.right * dimensions[i].width), Math.round(ladderProportions.rung1 * dimensions[i].height)
        ],
        [
          Math.round(ladderProportions.left * dimensions[i].width), Math.round(ladderProportions.rung2 * dimensions[i].height),
          Math.round(ladderProportions.right * dimensions[i].width), Math.round(ladderProportions.rung2 * dimensions[i].height)
        ],
        [
          Math.round(ladderProportions.left * dimensions[i].width), Math.round(ladderProportions.rung3 * dimensions[i].height),
          Math.round(ladderProportions.right * dimensions[i].width), Math.round(ladderProportions.rung3 * dimensions[i].height)
        ],
        [
          Math.round(ladderProportions.left * dimensions[i].width), Math.round(ladderProportions.rung4 * dimensions[i].height),
          Math.round(ladderProportions.right * dimensions[i].width), Math.round(ladderProportions.rung4 * dimensions[i].height)
        ]
      )
    }
    o.polygon = polygon;
    o.lines = lines;
    o.texture.height = dimensions[i].height;
    o.texture.width = dimensions[i].width;
    console.log(o)
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runChests = function() {
  let dimensions = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  let originalScreen = { width: 168, height: 95 };

  let points = {
    A: { x: 73, y: 94 },
    B: { x: 73, y: 84 },
    C: { x: 93, y: 84 },
    D: { x: 93, y: 94 },
    E: { x: 78, y: 79 },
    F: { x: 98, y: 79 },
    G: { x: 98, y: 89 },
    D: { x: 93, y: 94 },
    D: { x: 93, y: 94 }
  };  
  let pointsScale = {};
  for (let prop in points) {
    let o = {
      x: points[prop].x / originalScreen.width,
      y: points[prop].y / originalScreen.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = dimensions.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["CHEST ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_chest_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        polygon.push(Math.round(pointsScale.A.x * dimensions[i].width), Math.round(pointsScale.A.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.B.x * dimensions[i].width), Math.round(pointsScale.B.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.E.x * dimensions[i].width), Math.round(pointsScale.E.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.F.x * dimensions[i].width), Math.round(pointsScale.F.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.G.x * dimensions[i].width), Math.round(pointsScale.G.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.D.x * dimensions[i].width), Math.round(pointsScale.D.y * dimensions[i].height));
      }
      { // lines
        lines.push(
          [
            Math.round(pointsScale.A.x * dimensions[i].width), Math.round(pointsScale.A.y * dimensions[i].height),
            Math.round(pointsScale.B.x * dimensions[i].width), Math.round(pointsScale.B.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.B.x * dimensions[i].width), Math.round(pointsScale.B.y * dimensions[i].height),
            Math.round(pointsScale.C.x * dimensions[i].width), Math.round(pointsScale.C.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.C.x * dimensions[i].width), Math.round(pointsScale.C.y * dimensions[i].height),
            Math.round(pointsScale.D.x * dimensions[i].width), Math.round(pointsScale.D.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.A.x * dimensions[i].width), Math.round(pointsScale.A.y * dimensions[i].height),
            Math.round(pointsScale.D.x * dimensions[i].width), Math.round(pointsScale.D.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.B.x * dimensions[i].width), Math.round(pointsScale.B.y * dimensions[i].height),
            Math.round(pointsScale.E.x * dimensions[i].width), Math.round(pointsScale.E.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.E.x * dimensions[i].width), Math.round(pointsScale.E.y * dimensions[i].height),
            Math.round(pointsScale.F.x * dimensions[i].width), Math.round(pointsScale.F.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.F.x * dimensions[i].width), Math.round(pointsScale.F.y * dimensions[i].height),
            Math.round(pointsScale.G.x * dimensions[i].width), Math.round(pointsScale.G.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.G.x * dimensions[i].width), Math.round(pointsScale.G.y * dimensions[i].height),
            Math.round(pointsScale.D.x * dimensions[i].width), Math.round(pointsScale.D.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.C.x * dimensions[i].width), Math.round(pointsScale.C.y * dimensions[i].height),
            Math.round(pointsScale.F.x * dimensions[i].width), Math.round(pointsScale.F.y * dimensions[i].height)
          ]
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = dimensions[i].height;
      o.texture.width = dimensions[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runSkeletons = function() {
  let dimensions = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  let originalScreen = { width: 168, height: 95 };

  let points = {
    // LEGS
    A: { x: 60, y: 94 },
    B: { x: 68, y: 94 },
    C: { x: 68, y: 79 },
    D: { x: 75, y: 64 },
    E: { x: 91, y: 64 },
    F: { x: 98, y: 79 },
    G: { x: 98, y: 94 },
    H: { x: 106, y: 94 },
    // SPINE + RIBS
    I: { x: 83, y: 68 },
    J: { x: 83, y: 29 },
    K: { x: 81, y: 56 },
    L: { x: 85, y: 56 },
    M: { x: 80, y: 49 },
    N: { x: 86, y: 49 },
    O: { x: 79, y: 41 },
    P: { x: 87, y: 41 },
    // AXE
    Q: { x: 60, y: 38 },
    R: { x: 53, y: 41 },
    S: { x: 60, y: 49 },
    T: { x: 60, y: 41 },
    U: { x: 75, y: 56 },
    // SHOULDERS
    V: { x: 68, y: 49 },
    W: { x: 75, y: 34 },
    X: { x: 91, y: 34 },
    Y: { x: 98, y: 49 },
    // DAGGER
    Z: { x: 98, y: 52 },
    AA: { x: 98, y: 37 },
    BB: { x: 95, y: 49 },
    CC: { x: 103, y: 49 },
    // SKULL
    DD: { x: 83, y: 19 },
    EE: { x: 77, y: 14 },
    FF: { x: 75, y: 19 },
    GG: { x: 77, y: 29 },
    HH: { x: 89, y: 29 },
    II: { x: 89, y: 26 },
    JJ: { x: 77, y: 26 },
    KK: { x: 91, y: 19 },
    LL: { x: 89, y: 14 },
    // EYES
    MM: { x: 78, y: 22 },
    NN: { x: 77, y: 22 },
    OO: { x: 88, y: 22 },
    PP: { x: 89, y: 22 },
  };  
  let pointsScale = {};
  for (let prop in points) {
    let o = {
      x: points[prop].x / originalScreen.width,
      y: points[prop].y / originalScreen.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = dimensions.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["SKELETON ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_skeleton_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      let points = [];
      { // polygon
        polygon.push(Math.round(pointsScale.EE.x * dimensions[i].width), Math.round(pointsScale.EE.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.FF.x * dimensions[i].width), Math.round(pointsScale.FF.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.GG.x * dimensions[i].width), Math.round(pointsScale.GG.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.HH.x * dimensions[i].width), Math.round(pointsScale.HH.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.KK.x * dimensions[i].width), Math.round(pointsScale.KK.y * dimensions[i].height));
        polygon.push(Math.round(pointsScale.LL.x * dimensions[i].width), Math.round(pointsScale.LL.y * dimensions[i].height));
      }
      { // lines
        lines.push(
          [
            Math.round(pointsScale.A.x * dimensions[i].width), Math.round(pointsScale.A.y * dimensions[i].height),
            Math.round(pointsScale.B.x * dimensions[i].width), Math.round(pointsScale.B.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.B.x * dimensions[i].width), Math.round(pointsScale.B.y * dimensions[i].height),
            Math.round(pointsScale.C.x * dimensions[i].width), Math.round(pointsScale.C.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.C.x * dimensions[i].width), Math.round(pointsScale.C.y * dimensions[i].height),
            Math.round(pointsScale.D.x * dimensions[i].width), Math.round(pointsScale.D.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.D.x * dimensions[i].width), Math.round(pointsScale.D.y * dimensions[i].height),
            Math.round(pointsScale.E.x * dimensions[i].width), Math.round(pointsScale.E.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.E.x * dimensions[i].width), Math.round(pointsScale.E.y * dimensions[i].height),
            Math.round(pointsScale.F.x * dimensions[i].width), Math.round(pointsScale.F.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.F.x * dimensions[i].width), Math.round(pointsScale.F.y * dimensions[i].height),
            Math.round(pointsScale.G.x * dimensions[i].width), Math.round(pointsScale.G.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.G.x * dimensions[i].width), Math.round(pointsScale.G.y * dimensions[i].height),
            Math.round(pointsScale.H.x * dimensions[i].width), Math.round(pointsScale.H.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.I.x * dimensions[i].width), Math.round(pointsScale.I.y * dimensions[i].height),
            Math.round(pointsScale.J.x * dimensions[i].width), Math.round(pointsScale.J.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.K.x * dimensions[i].width), Math.round(pointsScale.K.y * dimensions[i].height),
            Math.round(pointsScale.L.x * dimensions[i].width), Math.round(pointsScale.L.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.M.x * dimensions[i].width), Math.round(pointsScale.M.y * dimensions[i].height),
            Math.round(pointsScale.N.x * dimensions[i].width), Math.round(pointsScale.N.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.O.x * dimensions[i].width), Math.round(pointsScale.O.y * dimensions[i].height),
            Math.round(pointsScale.P.x * dimensions[i].width), Math.round(pointsScale.P.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.Q.x * dimensions[i].width), Math.round(pointsScale.Q.y * dimensions[i].height),
            Math.round(pointsScale.R.x * dimensions[i].width), Math.round(pointsScale.R.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.R.x * dimensions[i].width), Math.round(pointsScale.R.y * dimensions[i].height),
            Math.round(pointsScale.S.x * dimensions[i].width), Math.round(pointsScale.S.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.S.x * dimensions[i].width), Math.round(pointsScale.S.y * dimensions[i].height),
            Math.round(pointsScale.T.x * dimensions[i].width), Math.round(pointsScale.T.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.T.x * dimensions[i].width), Math.round(pointsScale.T.y * dimensions[i].height),
            Math.round(pointsScale.U.x * dimensions[i].width), Math.round(pointsScale.U.y * dimensions[i].height)
          ],
          // SHOULDERS
          [
            Math.round(pointsScale.V.x * dimensions[i].width), Math.round(pointsScale.V.y * dimensions[i].height),
            Math.round(pointsScale.W.x * dimensions[i].width), Math.round(pointsScale.W.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.W.x * dimensions[i].width), Math.round(pointsScale.W.y * dimensions[i].height),
            Math.round(pointsScale.X.x * dimensions[i].width), Math.round(pointsScale.X.y * dimensions[i].height)
          ],
          [
            Math.round(pointsScale.X.x * dimensions[i].width), Math.round(pointsScale.X.y * dimensions[i].height),
            Math.round(pointsScale.Y.x * dimensions[i].width), Math.round(pointsScale.Y.y * dimensions[i].height),
          ],
          // DAGGER
          [
            Math.round(pointsScale.Z.x * dimensions[i].width), Math.round(pointsScale.Z.y * dimensions[i].height),
            Math.round(pointsScale.AA.x * dimensions[i].width), Math.round(pointsScale.AA.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.BB.x * dimensions[i].width), Math.round(pointsScale.BB.y * dimensions[i].height),
            Math.round(pointsScale.CC.x * dimensions[i].width), Math.round(pointsScale.CC.y * dimensions[i].height),
          ],
          // SKULL
          [
            Math.round(pointsScale.DD.x * dimensions[i].width), Math.round(pointsScale.DD.y * dimensions[i].height),
            Math.round(pointsScale.EE.x * dimensions[i].width), Math.round(pointsScale.EE.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.EE.x * dimensions[i].width), Math.round(pointsScale.EE.y * dimensions[i].height),
            Math.round(pointsScale.FF.x * dimensions[i].width), Math.round(pointsScale.FF.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.FF.x * dimensions[i].width), Math.round(pointsScale.FF.y * dimensions[i].height),
            Math.round(pointsScale.GG.x * dimensions[i].width), Math.round(pointsScale.GG.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.GG.x * dimensions[i].width), Math.round(pointsScale.GG.y * dimensions[i].height),
            Math.round(pointsScale.HH.x * dimensions[i].width), Math.round(pointsScale.HH.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.HH.x * dimensions[i].width), Math.round(pointsScale.HH.y * dimensions[i].height),
            Math.round(pointsScale.II.x * dimensions[i].width), Math.round(pointsScale.II.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.II.x * dimensions[i].width), Math.round(pointsScale.II.y * dimensions[i].height),
            Math.round(pointsScale.JJ.x * dimensions[i].width), Math.round(pointsScale.JJ.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.JJ.x * dimensions[i].width), Math.round(pointsScale.JJ.y * dimensions[i].height),
            Math.round(pointsScale.GG.x * dimensions[i].width), Math.round(pointsScale.GG.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.HH.x * dimensions[i].width), Math.round(pointsScale.HH.y * dimensions[i].height),
            Math.round(pointsScale.KK.x * dimensions[i].width), Math.round(pointsScale.KK.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.KK.x * dimensions[i].width), Math.round(pointsScale.KK.y * dimensions[i].height),
            Math.round(pointsScale.LL.x * dimensions[i].width), Math.round(pointsScale.LL.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.EE.x * dimensions[i].width), Math.round(pointsScale.EE.y * dimensions[i].height),
            Math.round(pointsScale.LL.x * dimensions[i].width), Math.round(pointsScale.LL.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.MM.x * dimensions[i].width), Math.round(pointsScale.MM.y * dimensions[i].height),
            Math.round(pointsScale.NN.x * dimensions[i].width), Math.round(pointsScale.NN.y * dimensions[i].height),
          ],
          [
            Math.round(pointsScale.OO.x * dimensions[i].width), Math.round(pointsScale.OO.y * dimensions[i].height),
            Math.round(pointsScale.PP.x * dimensions[i].width), Math.round(pointsScale.PP.y * dimensions[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = dimensions[i].height;
      o.texture.width = dimensions[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runThieves = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // CLOAK RIGHT
    A: { x: C, y: B - 56 / DI },
    B: { x: C, y: B - 8 / DI },
    C: { x: C + 10 / DI, y: B },
    D: { x: C + 30 / DI, y: B },
    E: { x: C + 30 / DI, y: B - 45 / DI },
    F: { x: C + 10 / DI, y: B - 64 / DI },
    // CLOAK LEFT
    G: { x: C - 10 / DI, y: B - 64 / DI },
    H: { x: C - 30 / DI, y: B - 45 / DI },
    I: { x: C - 30 / DI, y: B },
    J: { x: C - 10 / DI, y: B },
    K: { x: C, y: B - 8 / DI },
    // HOOD
    M: { x: C - 10 / DI, y: B - 75 / DI },
    N: { x: C, y: B - 83 / DI },
    O: { x: C + 10 / DI, y: B - 75 / DI },
    P: { x: C, y: B - 79 / DI },
    Q: { x: C, y: B - 60 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["THIEF ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_thief_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      let points = [];
      { // polygon
        // left side of cloak
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height)
          ]
        );

        // right side of cloak
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height)
          ]
        );

        // HOOD
        polygon.push(
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height)
          ]
        );
      }
      { // lines
        // CLOAK RIGHT
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height)
          ],
        );
        // CLOAK LEFT
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
          ],
        );
        // HOOD
        lines.push(
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
        );
        // FACE
        lines.push(
          [
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runRats = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // 
    A: { x: C + 5 / DI, y: B - 30 / DI },
    B: { x: C, y: B - 25 / DI },
    C: { x: C - 5 / DI, y: B - 30 / DI },
    D: { x: C - 15 / DI, y: B - 5 / DI },
    E: { x: C - 10 / DI, y: B },
    F: { x: C + 10 / DI, y: B },
    G: { x: C + 15 / DI, y: B - 5 / DI },
    H: { x: C + 20 / DI, y: B - 5 / DI },
    I: { x: C + 10 / DI, y: B - 40 / DI },
    J: { x: C + 3 / DI + .5, y: B - 35 / DI },
    K: { x: C - 3 / DI + .5, y: B - 35 / DI },
    L: { x: C - 10 / DI, y: B - 40 / DI },
    M: { x: C - 5 / DI, y: B - 33 / DI },
    N: { x: C - 3 / DI + .5, y: B - 30 / DI },
    O: { x: C + 5 / DI, y: B - 33 / DI },
    P: { x: C + 3 / DI + .5, y: B - 30 / DI },
    Q: { x: C - 5 / DI, y: B - 20 / DI },
    R: { x: C - 5 / DI, y: B - 15 / DI },
    S: { x: C + 5 / DI, y: B - 20 / DI },
    T: { x: C + 5 / DI, y: B - 15 / DI },
    U: { x: C - 7 / DI, y: B - 20 / DI },
    V: { x: C - 7 / DI, y: B - 15 / DI },
    W: { x: C + 7 / DI, y: B - 20 / DI },
    X: { x: C + 7 / DI, y: B - 15 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["RAT ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_rat_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // BODY
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
          ]
        );
        // TAIL
        polygon.push(
          [
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
          ]
        );
        // HEAD
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ]
        );
      }
      { // lines
        // BODY
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height)
          ],
        );
        // TAIL
        lines.push(
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
        );
        // HEAD
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
          ],
        );
        // EYES + CLAWS 
        lines.push(
          [
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
            Math.round(pointsScale.R.x * DIMENSIONS[i].width), Math.round(pointsScale.R.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.U.x * DIMENSIONS[i].width), Math.round(pointsScale.U.y * DIMENSIONS[i].height),
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runOrcs = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // BODY A-M M-X X-N N-A
    A: { x: C, y: B },
    B: { x: C - 15 / DI, y: B },
    C: { x: C - 8 / DI, y: B - 8 / DI },
    D: { x: C - 8 / DI, y: B - 15 / DI },
    E: { x: C - 15 / DI, y: B - 23 / DI },
    F: { x: C - 15 / DI, y: B - 15 / DI },
    G: { x: C - 23 / DI, y: B - 23 / DI },
    H: { x: C - 23 / DI, y: B - 45 / DI },
    I: { x: C - 15 / DI, y: B - 53 / DI },
    J: { x: C - 8 / DI, y: B - 53 / DI },
    K: { x: C - 15 / DI, y: B - 68 / DI },
    L: { x: C - 8 / DI, y: B - 75 / DI },
    M: { x: C, y: B - 75 / DI },
    N: { x: C + 15 / DI, y: B },
    O: { x: C + 8 / DI, y: B - 8 / DI },
    P: { x: C + 8 / DI, y: B - 15 / DI },
    Q: { x: C + 15 / DI, y: B - 23 / DI },
    R: { x: C + 15 / DI, y: B - 15 / DI },
    S: { x: C + 23 / DI, y: B - 23 / DI },
    T: { x: C + 23 / DI, y: B - 45 / DI },
    U: { x: C + 15 / DI, y: B - 53 / DI },
    V: { x: C + 8 / DI, y: B - 53 / DI },
    W: { x: C + 15 / DI, y: B - 68 / DI },
    X: { x: C + 8 / DI, y: B - 75 / DI },
    // AXE
    Y: { x: C - 23 / DI, y: B - 15 / DI },
    Z: { x: C + 8 / DI, y: B - 45 / DI },
    // EYES
    AA: { x: C - 8 / DI, y: B - 68 / DI },
    BB: { x: C, y: B - 60 / DI },
    CC: { x: C + 8 / DI, y: B - 68 / DI },
    DD: { x: C + 8 / DI, y: B - 60 / DI },
    EE: { x: C - 8 / DI, y: B - 60 / DI },
    // AXE BLADE
    FF: { x: C, y: B - 38 / DI },
    GG: { x: C - 8 / DI, y: B - 38 / DI },
    HH: { x: C + 15 / DI, y: B - 45 / DI },
    II: { x: C, y: B - 30 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["ORC ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_orc_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // BODY
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
            Math.round(pointsScale.U.x * DIMENSIONS[i].width), Math.round(pointsScale.U.y * DIMENSIONS[i].height),
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
            Math.round(pointsScale.R.x * DIMENSIONS[i].width), Math.round(pointsScale.R.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
          ]
        );
      }
      { // lines
        // BODY
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
            Math.round(pointsScale.R.x * DIMENSIONS[i].width), Math.round(pointsScale.R.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.R.x * DIMENSIONS[i].width), Math.round(pointsScale.R.y * DIMENSIONS[i].height),
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
            Math.round(pointsScale.U.x * DIMENSIONS[i].width), Math.round(pointsScale.U.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.U.x * DIMENSIONS[i].width), Math.round(pointsScale.U.y * DIMENSIONS[i].height),
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
          ],
        );
        // FACE + NECK + AXE HANDLE
        lines.push(
          [
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Y.x * DIMENSIONS[i].width), Math.round(pointsScale.Y.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
          ],
        );
        // EYES
        lines.push(
          [
            Math.round(pointsScale.AA.x * DIMENSIONS[i].width), Math.round(pointsScale.AA.y * DIMENSIONS[i].height),
            Math.round(pointsScale.BB.x * DIMENSIONS[i].width), Math.round(pointsScale.BB.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.BB.x * DIMENSIONS[i].width), Math.round(pointsScale.BB.y * DIMENSIONS[i].height),
            Math.round(pointsScale.CC.x * DIMENSIONS[i].width), Math.round(pointsScale.CC.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.CC.x * DIMENSIONS[i].width), Math.round(pointsScale.CC.y * DIMENSIONS[i].height),
            Math.round(pointsScale.DD.x * DIMENSIONS[i].width), Math.round(pointsScale.DD.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.DD.x * DIMENSIONS[i].width), Math.round(pointsScale.DD.y * DIMENSIONS[i].height),
            Math.round(pointsScale.EE.x * DIMENSIONS[i].width), Math.round(pointsScale.EE.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.EE.x * DIMENSIONS[i].width), Math.round(pointsScale.EE.y * DIMENSIONS[i].height),
            Math.round(pointsScale.AA.x * DIMENSIONS[i].width), Math.round(pointsScale.AA.y * DIMENSIONS[i].height),
          ],
        );
        // AXE BLADE
        lines.push(
          [
            Math.round(pointsScale.FF.x * DIMENSIONS[i].width), Math.round(pointsScale.FF.y * DIMENSIONS[i].height),
            Math.round(pointsScale.GG.x * DIMENSIONS[i].width), Math.round(pointsScale.GG.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.GG.x * DIMENSIONS[i].width), Math.round(pointsScale.GG.y * DIMENSIONS[i].height),
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
            Math.round(pointsScale.HH.x * DIMENSIONS[i].width), Math.round(pointsScale.HH.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.HH.x * DIMENSIONS[i].width), Math.round(pointsScale.HH.y * DIMENSIONS[i].height),
            Math.round(pointsScale.II.x * DIMENSIONS[i].width), Math.round(pointsScale.II.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.II.x * DIMENSIONS[i].width), Math.round(pointsScale.II.y * DIMENSIONS[i].height),
            Math.round(pointsScale.FF.x * DIMENSIONS[i].width), Math.round(pointsScale.FF.y * DIMENSIONS[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runVipers = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // BODY SEGMENT
    A: { x: C - 10 / DI, y: B - 15 / DI },
    B: { x: C - 10 / DI, y: B - 30 / DI },
    C: { x: C - 15 / DI, y: B - 20 / DI },
    D: { x: C - 15 / DI, y: B - 15 / DI },
    E: { x: C - 15 / DI, y: B },
    F: { x: C + 15 / DI, y: B },
    G: { x: C + 15 / DI, y: B - 15 / DI },
    // COILS
    H: { x: C - 15 / DI, y: B - 10 / DI },
    I: { x: C + 15 / DI, y: B - 10 / DI },
    J: { x: C - 15 / DI, y: B - 5 / DI },
    K: { x: C + 15 / DI, y: B - 5 / DI },
    // NECK
    L: { x: C, y: B - 15 / DI },
    M: { x: C - 5 / DI, y: B - 20 / DI },
    N: { x: C - 5 / DI, y: B - 35 / DI },
    O: { x: C + 5 / DI, y: B - 35 / DI },
    P: { x: C + 5 / DI, y: B - 20 / DI },
    Q: { x: C + 10 / DI, y: B - 15 / DI },
    // NECK BANDS
    R: { x: C - 5 / DI, y: B - 25 / DI },
    S: { x: C + 5 / DI, y: B - 25 / DI },
    T: { x: C - 5 / DI, y: B - 30 / DI },
    U: { x: C + 5 / DI, y: B - 30 / DI },
    // HOOD?
    V: { x: C - 10 / DI, y: B - 35 / DI },
    W: { x: C - 10 / DI, y: B - 40 / DI },
    X: { x: C - 5 / DI, y: B - 45 / DI },
    Y: { x: C + 5 / DI, y: B - 45 / DI },
    Z: { x: C + 10 / DI, y: B - 40 / DI },
    AA: { x: C + 10 / DI, y: B - 35 / DI },
    BB: { x: C, y: B - 45 / DI },
    // FANGS
    CC: { x: C - 5 / DI, y: B - 40 / DI },
    DD: { x: C + 5 / DI, y: B - 40 / DI },
    EE: { x: C + 15 / DI, y: B - 30 / DI },
    FF: { x: C, y: B - 40 / DI },
    GG: { x: C - 15 / DI, y: B - 30 / DI },
    HH: { x: C - 5 / DI + .5, y: B - 40 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["VIPER ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_viper_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // BODY
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
          ]
        );
        // NECK
        polygon.push(
          [
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
          ]
        );
        // HOOD
        polygon.push(
          [
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Y.x * DIMENSIONS[i].width), Math.round(pointsScale.Y.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
            Math.round(pointsScale.AA.x * DIMENSIONS[i].width), Math.round(pointsScale.AA.y * DIMENSIONS[i].height),
          ]
        );
        // FANG
        polygon.push(
          [
            Math.round(pointsScale.DD.x * DIMENSIONS[i].width), Math.round(pointsScale.DD.y * DIMENSIONS[i].height),
            Math.round(pointsScale.EE.x * DIMENSIONS[i].width), Math.round(pointsScale.EE.y * DIMENSIONS[i].height),
            Math.round(pointsScale.FF.x * DIMENSIONS[i].width), Math.round(pointsScale.FF.y * DIMENSIONS[i].height),
          ]
        );
        // FANG
        polygon.push(
          [
            Math.round(pointsScale.FF.x * DIMENSIONS[i].width), Math.round(pointsScale.FF.y * DIMENSIONS[i].height),
            Math.round(pointsScale.GG.x * DIMENSIONS[i].width), Math.round(pointsScale.GG.y * DIMENSIONS[i].height),
            Math.round(pointsScale.HH.x * DIMENSIONS[i].width), Math.round(pointsScale.HH.y * DIMENSIONS[i].height),
          ]
        );
      }
      { // lines
        // BODY
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height)
          ],
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ],
        );
        // COILS
        lines.push(
          [
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
          ],
        );
        // NECK
        lines.push(
          [
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
          ],
        );
        // NECK BANDS
        lines.push(
          [
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.R.x * DIMENSIONS[i].width), Math.round(pointsScale.R.y * DIMENSIONS[i].height),
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
            Math.round(pointsScale.U.x * DIMENSIONS[i].width), Math.round(pointsScale.U.y * DIMENSIONS[i].height),
          ],
        );
        // HOOD?
        lines.push(
          [
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Y.x * DIMENSIONS[i].width), Math.round(pointsScale.Y.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Y.x * DIMENSIONS[i].width), Math.round(pointsScale.Y.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
            Math.round(pointsScale.AA.x * DIMENSIONS[i].width), Math.round(pointsScale.AA.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
            Math.round(pointsScale.BB.x * DIMENSIONS[i].width), Math.round(pointsScale.BB.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.BB.x * DIMENSIONS[i].width), Math.round(pointsScale.BB.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
          ],
        );
        // 
        lines.push(
          [
            Math.round(pointsScale.CC.x * DIMENSIONS[i].width), Math.round(pointsScale.CC.y * DIMENSIONS[i].height),
            Math.round(pointsScale.DD.x * DIMENSIONS[i].width), Math.round(pointsScale.DD.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.DD.x * DIMENSIONS[i].width), Math.round(pointsScale.DD.y * DIMENSIONS[i].height),
            Math.round(pointsScale.EE.x * DIMENSIONS[i].width), Math.round(pointsScale.EE.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.EE.x * DIMENSIONS[i].width), Math.round(pointsScale.EE.y * DIMENSIONS[i].height),
            Math.round(pointsScale.FF.x * DIMENSIONS[i].width), Math.round(pointsScale.FF.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.FF.x * DIMENSIONS[i].width), Math.round(pointsScale.FF.y * DIMENSIONS[i].height),
            Math.round(pointsScale.GG.x * DIMENSIONS[i].width), Math.round(pointsScale.GG.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.GG.x * DIMENSIONS[i].width), Math.round(pointsScale.GG.y * DIMENSIONS[i].height),
            Math.round(pointsScale.HH.x * DIMENSIONS[i].width), Math.round(pointsScale.HH.y * DIMENSIONS[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runCrawlers = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // BODY
    A: { x: C - 20 / DI, y: 79 - 47 - 32 },
    B: { x: C - 20 / DI, y: B - 88 / DI },
    C: { x: C - 10 / DI, y: B - 83 / DI },
    D: { x: C + 10 / DI, y: B - 83 / DI },
    E: { x: C + 20 / DI, y: B - 88 / DI },
    F: { x: C + 20 / DI, y: 79 - 47 - 32 },
    // TENTACLES?
    G: { x: C - 30 / DI, y: B - 83 / DI },
    H: { x: C - 30 / DI, y: B - 78 / DI },
    I: { x: C + 30 / DI, y: B - 83 / DI },
    J: { x: C + 40 / DI, y: B - 83 / DI },
    //
    K: { x: C - 15 / DI, y: B - 86 / DI },
    L: { x: C - 20 / DI, y: B - 83 / DI },
    M: { x: C - 20 / DI, y: B - 78 / DI },
    N: { x: C - 30 / DI, y: B - 73 / DI },
    O: { x: C - 30 / DI, y: B - 68 / DI },
    P: { x: C - 20 / DI, y: B - 63 / DI },
    //
    Q: { x: C - 10 / DI, y: B - 58 / DI },
    R: { x: C, y: B - 50 / DI },
    S: { x: C + 10 / DI, y: B - 78 / DI },
    T: { x: C + 20 / DI, y: B - 73 / DI },
    U: { x: C + 20 / DI, y: B - 40 / DI },
    //
    V: { x: C + 15 / DI, y: B - 85 / DI },
    W: { x: C + 20 / DI, y: B - 78 / DI },
    X: { x: C + 30 / DI, y: B - 76 / DI },
    Y: { x: C + 30 / DI, y: B - 60 / DI },
    //
    Z: { x: C, y: B - 83 / DI },
    AA: { x: C, y: B - 73 / DI },
    BB: { x: C + 10 / DI, y: B - 68 / DI },
    CC: { x: C + 10 / DI, y: B - 63 / DI },
    DD: { x: C, y: B - 58 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["CRAWLER ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_crawler_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // BODY
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ]
        );
      }
      { // lines
        // BODY
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
          ],
        );
        // TENTACLES?
        lines.push(
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
          ],
        );
        // TENTACLES?
        lines.push(
          [
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
          ],
        );
        // TENTACLES?
        lines.push(
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
            Math.round(pointsScale.R.x * DIMENSIONS[i].width), Math.round(pointsScale.R.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
            Math.round(pointsScale.U.x * DIMENSIONS[i].width), Math.round(pointsScale.U.y * DIMENSIONS[i].height),
          ],
        );
        // TENTACLES?
        lines.push(
          [
            Math.round(pointsScale.V.x * DIMENSIONS[i].width), Math.round(pointsScale.V.y * DIMENSIONS[i].height),
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.W.x * DIMENSIONS[i].width), Math.round(pointsScale.W.y * DIMENSIONS[i].height),
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.X.x * DIMENSIONS[i].width), Math.round(pointsScale.X.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Y.x * DIMENSIONS[i].width), Math.round(pointsScale.Y.y * DIMENSIONS[i].height),
          ],
        );
        // TENTACLES?
        lines.push(
          [
            Math.round(pointsScale.Z.x * DIMENSIONS[i].width), Math.round(pointsScale.Z.y * DIMENSIONS[i].height),
            Math.round(pointsScale.AA.x * DIMENSIONS[i].width), Math.round(pointsScale.AA.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.AA.x * DIMENSIONS[i].width), Math.round(pointsScale.AA.y * DIMENSIONS[i].height),
            Math.round(pointsScale.BB.x * DIMENSIONS[i].width), Math.round(pointsScale.BB.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.BB.x * DIMENSIONS[i].width), Math.round(pointsScale.BB.y * DIMENSIONS[i].height),
            Math.round(pointsScale.CC.x * DIMENSIONS[i].width), Math.round(pointsScale.CC.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.CC.x * DIMENSIONS[i].width), Math.round(pointsScale.CC.y * DIMENSIONS[i].height),
            Math.round(pointsScale.DD.x * DIMENSIONS[i].width), Math.round(pointsScale.DD.y * DIMENSIONS[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runGremlins = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // CAP
    A: { x: C + 5 / DI + .5, y: B - 10 / DI },
    B: { x: C - 5 / DI + .5, y: B - 10 / DI },
    C: { x: C, y: B - 15 / DI },
    D: { x: C + 10 / DI, y: B - 20 / DI },
    E: { x: C + 5 / DI + .5, y: B - 15 / DI },
    // BODY 
    F: { x: C + 7 / DI + .5, y: B - 6 / DI },
    G: { x: C + 5 / DI + .5, y: B - 3 / DI },
    H: { x: C - 5 / DI + .5, y: B - 3 / DI },
    I: { x: C - 7 / DI + .5, y: B - 6 / DI },
    // RIGHT LEG
    J: { x: C + 2 / DI + .5, y: B - 3 / DI },
    K: { x: C + 5 / DI + .5, y: B },
    L: { x: C + 8 / DI, y: B },
    // LEFT LEG
    M: { x: C - 2 / DI + .5, y: B - 3 / DI },
    N: { x: C - 5 / DI + .5, y: B },
    O: { x: C - 8 / DI, y: B },
    // EYE
    P: { x: C + 3 / DI + .5, y: B - 8 / DI },
    Q: { x: C + 2 / DI + .5, y: B - 8 / DI },
    // EYE
    R: { x: C - 3 / DI + .5, y: B - 8 / DI },
    S: { x: C - 2 / DI + .5, y: B - 8 / DI },
    // MOUTH
    T: { x: C + 3 / DI + .5, y: B - 5 / DI },
    U: { x: C - 3 / DI + .5, y: B - 5 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["GREMLIN ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_gremlin_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // BODY
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
          ]
        );
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ]
        );
      }
      { // lines
        // CAP
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
          ],
        );
        // BODY
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.H.x * DIMENSIONS[i].width), Math.round(pointsScale.H.y * DIMENSIONS[i].height),
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.I.x * DIMENSIONS[i].width), Math.round(pointsScale.I.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ],
        );
        // LEGS
        lines.push(
          [
            Math.round(pointsScale.J.x * DIMENSIONS[i].width), Math.round(pointsScale.J.y * DIMENSIONS[i].height),
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.K.x * DIMENSIONS[i].width), Math.round(pointsScale.K.y * DIMENSIONS[i].height),
            Math.round(pointsScale.L.x * DIMENSIONS[i].width), Math.round(pointsScale.L.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.M.x * DIMENSIONS[i].width), Math.round(pointsScale.M.y * DIMENSIONS[i].height),
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.N.x * DIMENSIONS[i].width), Math.round(pointsScale.N.y * DIMENSIONS[i].height),
            Math.round(pointsScale.O.x * DIMENSIONS[i].width), Math.round(pointsScale.O.y * DIMENSIONS[i].height),
          ],
        );
        // EYES
        lines.push(
          [
            Math.round(pointsScale.P.x * DIMENSIONS[i].width), Math.round(pointsScale.P.y * DIMENSIONS[i].height),
            Math.round(pointsScale.Q.x * DIMENSIONS[i].width), Math.round(pointsScale.Q.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.R.x * DIMENSIONS[i].width), Math.round(pointsScale.R.y * DIMENSIONS[i].height),
            Math.round(pointsScale.S.x * DIMENSIONS[i].width), Math.round(pointsScale.S.y * DIMENSIONS[i].height),
          ],
        );
        // MOUTH
        lines.push(
          [
            Math.round(pointsScale.T.x * DIMENSIONS[i].width), Math.round(pointsScale.T.y * DIMENSIONS[i].height),
            Math.round(pointsScale.U.x * DIMENSIONS[i].width), Math.round(pointsScale.U.y * DIMENSIONS[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runMimics = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // SIDE - A - D CLOSED SHAPE
    A: { x: C - 10 / DI, y: B },
    B: { x: C - 10 / DI, y: B - 10 / DI },
    C: { x: C + 10 / DI, y: B - 10 / DI },
    D: { x: C + 10 / DI, y: B },
    // B-E-F-G-D
    E: { x: C - 5 / DI, y: B - 15 / DI },
    F: { x: C + 15 / DI, y: B - 15 / DI },
    G: { x: C + 15 / DI, y: B - 5 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["MIMIC ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_mimic_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // SIDE
        polygon.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ]
        );
        // SIDE
        polygon.push(
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ]
        );
      }
      { // lines
        // SIDE
        lines.push(
          [
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
            Math.round(pointsScale.A.x * DIMENSIONS[i].width), Math.round(pointsScale.A.y * DIMENSIONS[i].height),
          ],
        );
        // SIDE
        lines.push(
          [
            Math.round(pointsScale.B.x * DIMENSIONS[i].width), Math.round(pointsScale.B.y * DIMENSIONS[i].height),
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.E.x * DIMENSIONS[i].width), Math.round(pointsScale.E.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
          ],
          [
            Math.round(pointsScale.G.x * DIMENSIONS[i].width), Math.round(pointsScale.G.y * DIMENSIONS[i].height),
            Math.round(pointsScale.D.x * DIMENSIONS[i].width), Math.round(pointsScale.D.y * DIMENSIONS[i].height),
          ],
        );
        // 
        lines.push(
          [
            Math.round(pointsScale.C.x * DIMENSIONS[i].width), Math.round(pointsScale.C.y * DIMENSIONS[i].height),
            Math.round(pointsScale.F.x * DIMENSIONS[i].width), Math.round(pointsScale.F.y * DIMENSIONS[i].height),
          ],
        );
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runDaemons = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    // LOWER BODY - A - KK
    A: { x: C - 14 / DI, y: B - 46 / DI },
    B: { x: C - 12 / DI, y: B - 37 / DI },
    C: { x: C - 20 / DI, y: B - 32 / DI },
    D: { x: C - 30 / DI, y: B - 32 / DI },
    E: { x: C - 22 / DI, y: B - 24 / DI },
    F: { x: C - 40 / DI, y: B - 17 / DI },
    G: { x: C - 40 / DI, y: B - 7 / DI },
    H: { x: C - 38 / DI, y: B - 5 / DI },
    I: { x: C - 40 / DI, y: B - 3 / DI },
    J: { x: C - 40 / DI, y: B },
    K: { x: C - 36 / DI, y: B },
    L: { x: C - 34 / DI, y: B - 2 / DI },
    M: { x: C - 32 / DI, y: B },
    N: { x: C - 28 / DI, y: B },
    O: { x: C - 28 / DI, y: B - 3 / DI },
    P: { x: C - 30 / DI, y: B - 5 / DI },
    Q: { x: C - 28 / DI, y: B - 7 / DI },
    R: { x: C - 28 / DI, y: B - 15 / DI },
    S: { x: C, y: B - 27 / DI },
    T: { x: C + 28 / DI, y: B - 15 / DI },
    U: { x: C + 28 / DI, y: B - 7 / DI },
    V: { x: C + 30 / DI, y: B - 5 / DI },
    W: { x: C + 28 / DI, y: B - 3 / DI },
    X: { x: C + 28 / DI, y: B },
    Y: { x: C + 32 / DI, y: B },
    Z: { x: C + 34 / DI, y: B - 2 / DI },
    AA: { x: C + 36 / DI, y: B },
    BB: { x: C + 40 / DI, y: B },
    CC: { x: C + 40 / DI, y: B - 3 / DI },
    DD: { x: C + 38 / DI, y: B - 5 / DI },
    EE: { x: C + 40 / DI, y: B - 7 / DI },
    FF: { x: C + 40 / DI, y: B - 17 / DI },
    GG: { x: C + 22 / DI, y: B - 24 / DI },
    HH: { x: C + 30 / DI, y: B - 32 / DI },
    II: { x: C + 20 / DI, y: B - 32 / DI },
    JJ: { x: C + 12 / DI, y: B - 37 / DI },
    KK: { x: C + 14 / DI, y: B - 46 / DI },
    // UPPER BODY LL-AQ
    LL: { x: C + 6 / DI, y: B - 48 / DI },
    MM: { x: C + 38 / DI, y: B - 41 / DI },
    NN: { x: C + 40 / DI, y: B - 42 / DI },
    OO: { x: C + 18 / DI, y: B - 56 / DI },
    PP: { x: C + 12 / DI, y: B - 56 / DI },
    QQ: { x: C + 10 / DI, y: B - 57 / DI },
    RR: { x: C + 8 / DI, y: B - 56 / DI },
    SS: { x: C - 8 / DI, y: B - 56 / DI },
    TT: { x: C - 10 / DI, y: B - 58 / DI },
    UU: { x: C + 14 / DI, y: B - 58 / DI },
    VV: { x: C + 16 / DI, y: B - 59 / DI },
    WW: { x: C + 8 / DI, y: B - 63 / DI },
    XX: { x: C + 6 / DI, y: B - 63 / DI },
    YY: { x: C + 2 / DI + .5, y: B - 70 / DI },
    ZZ: { x: C + 2 / DI + .5, y: B - 63 / DI },
    AB: { x: C - 2 / DI + .5, y: B - 63 / DI },
    AC: { x: C - 2 / DI + .5, y: B - 70 / DI },
    AD: { x: C - 6 / DI, y: B - 63 / DI },
    AE: { x: C - 8 / DI, y: B - 63 / DI },
    AF: { x: C - 16 / DI, y: B - 59 / DI },
    AG: { x: C - 14 / DI, y: B - 58 / DI },
    AH: { x: C - 10 / DI, y: B - 57 / DI },
    AI: { x: C - 12 / DI, y: B - 56 / DI },
    AJ: { x: C - 18 / DI, y: B - 56 / DI },
    AK: { x: C - 36 / DI, y: B - 47 / DI },
    AL: { x: C - 36 / DI, y: B - 39 / DI },
    AM: { x: C - 28 / DI, y: B - 41 / DI },
    AN: { x: C - 28 / DI, y: B - 46 / DI },
    AO: { x: C - 20 / DI, y: B - 50 / DI },
    AP: { x: C - 18 / DI, y: B - 50 / DI },
    AQ: { x: C - 14 / DI, y: B - 46 / DI },
    // AR-AS AT-AX AY-AZ
    AR: { x: C - 28 / DI, y: B - 41 / DI },
    AS: { x: C + 30 / DI, y: B - 55 / DI },
    AT: { x: C + 28 / DI, y: B - 58 / DI },
    AU: { x: C + 22 / DI, y: B - 56 / DI },
    AV: { x: C + 22 / DI, y: B - 53 / DI },
    AW: { x: C + 28 / DI, y: B - 52 / DI },
    AX: { x: C + 34 / DI, y: B - 54 / DI },
    AY: { x: C + 20 / DI, y: B - 50 / DI },
    AZ: { x: C + 26 / DI, y: B - 47 / DI },
    // BA-BC-BD BE-BG BH-BJ
    BA: { x: C + 10 / DI, y: B - 58 / DI },
    BC: { x: C + 10 / DI, y: B - 61 / DI },
    BD: { x: C + 4 / DI, y: B - 58 / DI },
    BE: { x: C - 10 / DI, y: B - 58 / DI },
    BF: { x: C - 10 / DI, y: B - 61 / DI },
    BG: { x: C - 4 / DI, y: B - 58 / DI },
    BH: { x: C + 40 / DI, y: B - 9 / DI },
    BI: { x: C + 50 / DI, y: B - 12 / DI },
    BJ: { x: C + 40 / DI, y: B - 7 / DI },
    // BK-BP
    BK: { x: C - 8 / DI, y: B - 25 / DI },
    BL: { x: C + 6 / DI, y: B - 7 / DI },
    BM: { x: C + 28 / DI, y: B - 7 / DI },
    BN: { x: C + 28 / DI, y: B - 9 / DI },
    BO: { x: C + 20 / DI, y: B - 9 / DI },
    BP: { x: C + 6 / DI, y: B - 25 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["DAEMON ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_daemon_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // LOWER BODY
        let lineSegments = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ", "KK"];
        let arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
        // UPPER BODY
        lineSegments = ["LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV", "WW", "XX", "YY", "ZZ", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ"];
        arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
        // TAIL 1
        lineSegments = ["BH", "BI", "BJ"];
        arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
        // TAIL 2
        lineSegments = ["BK", "BL", "BM", "BN", "BO", "BP"];
        arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
      }
      { // lines
        // LOWER BODY
        let lineSegments = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH", "II", "JJ", "KK"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // UPPER BODY
        lineSegments = ["LL","MM","NN","OO","PP","QQ","RR","SS","TT","UU","VV", "WW", "XX", "YY", "ZZ", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // 
        lineSegments = ["AR", "AS"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // 
        lineSegments = ["AT", "AU", "AV", "AW", "AX"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // 
        lineSegments = ["AY", "AZ"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // BA-BC-BD BE-BG BH-BJ
        lineSegments = ["BA", "BC", "BD"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        lineSegments = ["BE", "BF", "BG"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        lineSegments = ["BH", "BI", "BJ"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        lineSegments = ["BK", "BL", "BM", "BN", "BO", "BP"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
let runBalrogs = function() {
  const DIMENSIONS = [
    {
      width: 560,
      height: 320
    },
    {
      width: 336,
      height: 190
    },
    {
      width: 176,
      height: 97
    },
    {
      width: 120,
      height: 64
    },
    {
      width: 88,
      height: 46
    }
  ];
  const ORIGINAL_SIZE = { width: 168, height: 95 };
  const C = 83, B = 94, DI = 1;
  const POINTS = {
    //WING  A-F
    A: { x: C + 6 / DI, y: B - 60 / DI },
    B: { x: C + 30 / DI, y: B - 90 / DI },
    C: { x: C + 60 / DI, y: B - 30 / DI },
    D: { x: C + 60 / DI, y: B - 10 / DI },
    E: { x: C + 30 / DI, y: B - 40 / DI },
    F: { x: C + 15 / DI, y: B - 40 / DI },
    // WING G-L
    G: { x: C - 6 / DI, y: B - 60 / DI },
    H: { x: C - 30 / DI, y: B - 90 / DI },
    I: { x: C - 60 / DI, y: B - 30 / DI },
    J: { x: C - 60 / DI, y: B - 10 / DI },
    K: { x: C - 30 / DI, y: B - 40 / DI },
    L: { x: C - 15 / DI, y: B - 40 / DI },
    // SIDE M-BI
    M: { x: C, y: B - 25 / DI },
    N: { x: C + 6 / DI, y: B - 25 / DI },
    O: { x: C + 10 / DI, y: B - 20 / DI },
    P: { x: C + 12 / DI, y: B - 10 / DI },
    Q: { x: C + 10 / DI, y: B - 6 / DI },
    R: { x: C + 10 / DI, y: B },
    S: { x: C + 14 / DI, y: B },
    T: { x: C + 15 / DI, y: B - 5 / DI },
    U: { x: C + 16 / DI, y: B },
    V: { x: C + 20 / DI, y: B },
    W: { x: C + 20 / DI, y: B - 6 / DI },
    X: { x: C + 18 / DI, y: B - 10 / DI },
    Y: { x: C + 18 / DI, y: B - 20 / DI },
    Z: { x: C + 15 / DI, y: B - 30 / DI },
    AA: { x: C + 15 / DI, y: B - 45 / DI },
    AB: { x: C + 40 / DI, y: B - 60 / DI },
    AC: { x: C + 40 / DI, y: B - 70 / DI },
    AD: { x: C + 10 / DI, y: B - 55 / DI },
    AE: { x: C + 6 / DI, y: B - 60 / DI },
    AF: { x: C + 10 / DI, y: B - 74 / DI },
    AG: { x: C + 6 / DI, y: B - 80 / DI },
    AH: { x: C + 4 / DI + .5, y: B - 80 / DI },
    AI: { x: C + 3 / DI + .5, y: B - 82 / DI },
    AJ: { x: C + 2 / DI + .5, y: B - 80 / DI },
    AK: { x: C, y: B - 80 / DI },
    AL: { x: C - 2 / DI + .5, y: B - 80 / DI },
    AM: { x: C - 3 / DI + .5, y: B - 82 / DI },
    AN: { x: C - 4 / DI + .5, y: B - 80 / DI },
    AO: { x: C - 6 / DI, y: B - 80 / DI },
    AP: { x: C - 10 / DI, y: B - 74 / DI },
    AQ: { x: C - 6 / DI, y: B - 60 / DI },    
    AR: { x: C - 10 / DI, y: B - 55 / DI },
    AS: { x: C - 40 / DI, y: B - 70 / DI },
    AT: { x: C - 40 / DI, y: B - 60 / DI },
    AU: { x: C - 15 / DI, y: B - 45 / DI },
    AV: { x: C - 15 / DI, y: B - 30 / DI },
    AW: { x: C - 18 / DI, y: B - 20 / DI },
    AX: { x: C - 18 / DI, y: B - 10 / DI },
    AY: { x: C - 20 / DI, y: B - 6 / DI },
    AZ: { x: C - 20 / DI, y: B },
    BA: { x: C - 16 / DI, y: B },
    BB: { x: C - 15 / DI, y: B - 5 / DI },
    BC: { x: C - 14 / DI, y: B },
    BD: { x: C - 10 / DI, y: B },
    BE: { x: C - 10 / DI, y: B - 6 / DI },
    BF: { x: C - 12 / DI, y: B - 10 / DI },
    BG: { x: C - 10 / DI, y: B - 20 / DI },
    BH: { x: C - 6 / DI, y: B - 25 / DI },
    // BH-BI-R-BJ-N BK-BN
    BI: { x: C, y: B - 6 / DI },
    BJ: { x: C + 4 / DI + .5, y: B - 8 / DI },
    BK: { x: C - 40 / DI, y: B - 64 / DI },
    BL: { x: C - 40 / DI, y: B - 90 / DI },
    BM: { x: C - 52 / DI, y: B - 80 / DI },
    BN: { x: C - 52 / DI, y: B - 40 / DI },
    // MACE
    BO: { x: C + 40 / DI, y: B - 86 / DI },
    BP: { x: C + 38 / DI, y: B - 92 / DI },
    BQ: { x: C + 42 / DI, y: B - 92 / DI },
    BR: { x: C + 40 / DI, y: B - 50 / DI },
    // FEATURES
    BS: { x: C + 4 / DI + .5, y: B - 70 / DI },
    BT: { x: C + 6 / DI, y: B - 74 / DI },
    BU: { x: C - 4 / DI + .5, y: B - 70 / DI },
    BV: { x: C - 6 / DI, y: B - 74 / DI },
    BW: { x: C, y: B - 64 / DI },
    BX: { x: C, y: B - 60 / DI },
  };  
  let pointsScale = {};
  for (let prop in POINTS) {
    let o = {
      x: POINTS[prop].x / ORIGINAL_SIZE.width,
      y: POINTS[prop].y / ORIGINAL_SIZE.height
    }
    pointsScale[prop] = o;
  }
  let position = 0;
  for (let i = 0, li = DIMENSIONS.length; i < li; i++) {
    if (i !== 0) {
      let o = {
        COMMENT: ["BALROG ", position + 1].join(""),
        texture: {
          position: position + 1,
          edge: "closed",
          key: ["akalabeth_balrog_", position + 1].join(""),
        }
      };
      let polygon = [];
      let lines = [];
      { // polygon
        // WING
        let lineSegments = ["A","B","C","D","E","F"];
        let arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
        // WING
        lineSegments = ["G","H","I","J","K","L"];
        arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
        // BODY
        lineSegments = ["M","N","O","P","Q","R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM","AN","AO","AP","AQ","AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA","BB","BC","BD","BE","BF","BG","BH"];
        arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
        // TAIL
        lineSegments = ["BH","BI","R","BJ","N"];
        arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
        // MACE
        lineSegments = ["BO","BP","BQ"];
        arr = [];
        for (let j = 0, lj = lineSegments.length; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]];
          arr.push(Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height));
        }
        polygon.push(arr);
      }
      { // lines
        // WING
        let lineSegments = ["A","B","C","D","E","F"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // WING
        lineSegments = ["G","H","I","J","K","L"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // BODY
        lineSegments = ["M","N","O","P","Q","R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM","AN","AO","AP","AQ","AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ", "BA","BB","BC","BD","BE","BF","BG","BH", "M"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
             
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // TAIL
        lineSegments = ["BH","BI","R","BJ","N"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
             
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // WHIP
        lineSegments = ["BK","BL","BM","BN"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
             
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // MACE
        lineSegments = ["BO","BP","BQ","BO", "BR"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
             
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        // FEATURES
        lineSegments = ["BS","BT"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
             
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        lineSegments = ["BU","BV"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
             
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
        lineSegments = ["BW","BX"];
        for (let j = 0, lj = lineSegments.length - 1; j < lj; j++) {
          let point1 = pointsScale[lineSegments[j]], point2 = pointsScale[lineSegments[j + 1]];
          lines.push(
            [
              Math.round(point1.x * DIMENSIONS[i].width), Math.round(point1.y * DIMENSIONS[i].height),
             
              Math.round(point2.x * DIMENSIONS[i].width), Math.round(point2.y * DIMENSIONS[i].height),
            ]
          );
        }
      }
      o.polygon = polygon;
      o.lines = lines;
      o.texture.height = DIMENSIONS[i].height;
      o.texture.width = DIMENSIONS[i].width;
      console.log(o)
    }
    position += (i + 1) * 2;
    if (position % 2 === 0) {
      position = 3;
    }
  }
}
runBalrogs();