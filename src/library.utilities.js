const fs = require('fs');
const path = require('path');

const DATA_TEMPLATE = {
  appName: "",
  "data-path": ["data"],
  "templates file": "",
  theme: "",
  dimensions: [],
  "library files":[],
  "DESIGNER'S JOURNAL": {
    "Design Notes": {
    },
    Testing: {
    },
    "Next Steps": [
    ]
  },
  enums: [],
  fileHandle: "",
  appHandle: "",
  appConstants: [],
  "Design Notes": []
};

const LIB_CLASS_HANDLES = {
  "app-constants": "Constants",
  "scene-controller": "SceneController"
}
const LIB_FILE_HANDLES = {
  "app-constants": "constants",
  "scene-controller": "scene-controller"
}
/**
 * @class Factory class for producing UI elements.
 */
const LibraryLoader = (function() {
  return {
    "createLibraryData": function(data) {
      { // add the game data to the library
        let existData = this.getLibraryData();
        existData.apps.push(data);
        let filePath = path.join(__dirname, '..',  'public', 'data',  "library.json");
        let logger = fs.createWriteStream(filePath, {
          flags: 'w' // create new file or truncate existing
        });
        logger.write(JSON.stringify(existData, null, 2));
      }

      { // create design file
        let o = JSON.parse(JSON.stringify(DATA_TEMPLATE));
        o.appName = data.title;
        o.appHandle = data.appHandle;
        o.fileHandle = data.namespace;
        o.theme = data.theme;
        o.dimensions = data.dimensions;
        o["library files"] = data.lib;
        let now = new Date();
        let dateFormatted = [
          now.toLocaleString('default', { month: 'short' }),
          now.getUTCDate(),
          now.getUTCFullYear()
        ].join(" ");
        let setup = {
          title: "Setup",
          order: -9999, // always first
          content: "Initial project setup; includes the creation of any utility classes.",
          children: [],
          design: [],
          uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
        };
        o["Design Notes"].push(setup);

        { // add library files
          for (let i = o["library files"].length - 1; i >= 0; i--) {
            setup.design.push({
              tags: ["class", o["library files"][i]],
              classHandle: LIB_CLASS_HANDLES[o["library files"][i]],
              fileHandle: LIB_FILE_HANDLES[o["library files"][i]],
              uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            });
          }
        }
        
        o["DESIGNER'S JOURNAL"]["Design Notes"][dateFormatted] = ["Application data created."];
        let filePath = path.join(__dirname, '..',  'public', 'data', "models", [data.namespace, ".json"].join(""));
        let logger = fs.createWriteStream(filePath, {
          flags: 'w' // create new file or truncate existing
        });
        logger.write(JSON.stringify(o, null, 2));
      }

      { // create path for source code
        // make path for namespace
        let dirPath = path.join(__dirname, '..',  'public', 'phaser', data.namespace);
        try {
          fs.mkdirSync(dirPath);
        } catch (e) {
          // console.error(e);
        }
        // make path for html
        dirPath = path.join(__dirname, '..',  'public', 'phaser', data.namespace, "html");
        try {
          fs.mkdirSync(dirPath);
        } catch (e) {
          // console.error(e);
        }
        // make path for src
        dirPath = path.join(__dirname, '..',  'public', 'phaser', data.namespace, "src");
        try {
          fs.mkdirSync(dirPath);
        } catch (e) {
          // console.error(e);
        }
        // make path for tests
        dirPath = path.join(__dirname, '..',  'public', 'phaser', data.namespace, "tests");
        try {
          fs.mkdirSync(dirPath);
        } catch (e) {
          // console.error(e);
        }
      }
    },
    "createPhaserProject": function(data) {
      console.log("generate phaser",data)
    },
    "getAppData": function(appHandle) {
      let jsonPath = path.join(__dirname, '..',  'public', 'data', "models", [appHandle, ".json"].join(""));
      let modelData = JSON.parse(fs.readFileSync(jsonPath, { encoding:'utf8', flag:'r' }));
      console.log("+++++++serving app data");
      return modelData;   
    },
    "getLibraryData": function() {
      let jsonPath = path.join(__dirname, '..',  'public', 'data',  "library.json");
      let modelData = JSON.parse(fs.readFileSync(jsonPath, { encoding:'utf8', flag:'r' }));
      console.log("+++++++serving library data");
      return modelData;   
    },
    "updateProjectData": function(data) {
      { // update design file
        let filePath = path.join(__dirname, '..',  'public', 'data', "models", [data.fileHandle, ".json"].join(""));
        let logger = fs.createWriteStream(filePath, {
          flags: 'w' // create new file or truncate existing
        });
        logger.write(JSON.stringify(data, null, 2));
      }
    },
  }
} ());

module.exports = { LibraryLoader };