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
  "Design Notes": [],
  "Design Implementation": {}
};

const LIB_CLASS_HANDLES = {
  "app-config": "Config",
  "app-constants": "Constants",
  "game": "Game",
  "scene-controller": "SceneController"
}
const LIB_FILE_HANDLES = {
  "app-config": "config",
  "app-constants": "constants",
  "game": "game",
  "scene-controller": "scene-controller"
}
const LIB_CLASS_PATH = {
  "app-config": ["config"],
  "app-constants": ["config"],
  "game": ["singletons"],
  "scene-controller": ["scenes"]
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
        let filePath = path.join(__dirname, '..', '..',  'public', 'data',  "library.json");
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

        if (o["library files"].length > 0) { // create library files
          let files = [];
          let setup = {
            title: "Setup",
            order: -9999, // always first
            content: "Initial project setup; includes the creation of any utility classes.",
            children: [],
            design: [],
            uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
          };
          o["Design Notes"].push(setup);
          let c = ["Initial project setup; includes the creation of the following utility classes:"];
          for (let i = o["library files"].length - 1; i >= 0; i--) {
            files.push({
              tags: ["class", o["library files"][i]],
              classHandle: LIB_CLASS_HANDLES[o["library files"][i]],
              fileHandle: LIB_FILE_HANDLES[o["library files"][i]],
              filePath: LIB_CLASS_PATH[o["library files"][i]],
              uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            });
            c.push([" * ", LIB_CLASS_HANDLES[o["library files"][i]]].join(""));
          }
          setup.content = c.join("\r\n");
          for (let i = files.length - 1; i >= 0; i--) {
            setup.design.push({ designUid: files[i].uid });
            let path = files[i].filePath;
            let last = o["Design Implementation"];
            for (let j = 0, lj = path.length; j < lj; j++) {
              if (!last.hasOwnProperty(path[j])) {
                last[path[j]] = {};
              }
              last = last[path[j]]
              if (j + 1 >= lj) {
                last[files[i].classHandle] = files[i];
              }
            }
          }
        }

        // add filler
        o["Design Notes"].push({
          title: "",
          order: 9999,
          content: "",
          children: [{
            title: "",
            order: 9999, // always first
            content: "",
            children: [{
              title: "",
              order: 9999, // always first
              content: "",
              children: [{
                title: "",
                order: 9999, // always first
                content: "",
                children: [{
                  title: "",
                  order: 9999, // always first
                  content: "",
                  children: [{
                    title: "",
                    order: 9999, // always first
                    content: "",
                    children: [{
                      title: "",
                      order: 9999, // always first
                      content: "",
                      children: [{
                        title: "",
                        order: 9999, // always first
                        content: "",
                        children: [],
                        design: [],
                        uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
                      }],
                      design: [],
                      uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
                    }],
                    design: [],
                    uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
                  }],
                  design: [],
                  uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
                }],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
              }],
              design: [],
              uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
            }],
            design: [],
            uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
          }],
          design: [],
          uid: [Date.now().toString(36), Math.random().toString(36).substring(2)].join("")
        });
        
        o["DESIGNER'S JOURNAL"]["Design Notes"][dateFormatted] = ["Application data created."];
        let filePath = path.join(__dirname, '..',  '..',  'public', 'data', "models", [data.namespace, ".json"].join(""));
        let logger = fs.createWriteStream(filePath, {
          flags: 'w' // create new file or truncate existing
        });
        logger.write(JSON.stringify(o, null, 2));
      }

      { // create path for source code
        // make path for namespace
        let dirPath = path.join(__dirname, '..',  '..',  'public', 'phaser', data.namespace);
        try {
          fs.mkdirSync(dirPath);
        } catch (e) {
          // console.error(e);
        }
        // make path for html
        dirPath = path.join(__dirname, '..',  '..',  'public', 'phaser', data.namespace, "html");
        try {
          fs.mkdirSync(dirPath);
        } catch (e) {
          // console.error(e);
        }
        // make path for src
        dirPath = path.join(__dirname, '..',  '..',  'public', 'phaser', data.namespace, "src");
        try {
          fs.mkdirSync(dirPath);
        } catch (e) {
          // console.error(e);
        }
        // make path for tests
        dirPath = path.join(__dirname, '..',  '..',  'public', 'phaser', data.namespace, "tests");
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
      let jsonPath = path.join(__dirname, '..', '..',  'public', 'data', "models", [appHandle, ".json"].join(""));
      let modelData = JSON.parse(fs.readFileSync(jsonPath, { encoding:'utf8', flag:'r' }));
      console.log("+++++++serving app data");
      return modelData;   
    },
    "getLibraryData": function() {
      let jsonPath = path.join(__dirname, '..', '..',  'public', 'data',  "library.json");
      let modelData = JSON.parse(fs.readFileSync(jsonPath, { encoding:'utf8', flag:'r' }));
      console.log("+++++++serving library data");
      return modelData;   
    },
    "updateProjectData": function(data) {
      { // update design file
        let filePath = path.join(__dirname, '..', '..',  'public', 'data', "models", [data.fileHandle, ".json"].join(""));
        let logger = fs.createWriteStream(filePath, {
          flags: 'w' // create new file or truncate existing
        });
        logger.write(JSON.stringify(data, null, 2));
      }
    },
  }
} ());

module.exports = { LibraryLoader };