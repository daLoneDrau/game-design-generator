const fs = require('fs');
const path = require('path');

/**
 * @class Factory class for producing UI elements.
 */
const PhaserCodeGenerator = (function() {
  let _templates;
  { // load templates
    let _jsonPath = path.join(__dirname, '.', "templates.json");
    _templates = JSON.parse(fs.readFileSync(_jsonPath, { encoding:'utf8', flag:'r' }));
  }
  let _markupDelegator = {
    "string": function(line, appData) {
      let markup = line;
      markup = markup.replace(/\[app-name\]/gi, appData.appName);
      markup = markup.replace(/\[app-handle\]/gi, appData.appHandle);
      markup = markup.replace(/\[app-height\]/gi, appData.dimensions[1]);
      markup = markup.replace(/\[app-width\]/gi, appData.dimensions[0]);
      markup = markup.replace(/\[class-definition\]/gi, appData.classDefinition);
      markup = markup.replace(/\[class-handle\]/gi, appData.classHandle);
      markup = markup.replace(/\[class-inherits\]/gi, appData.classInheritance);
      markup = markup.replace(/\[class-name\]/gi, appData.className);
      markup = markup.replace(/\[class-path\]/gi, appData.classPath);
      markup = markup.replace(/\[class-title\]/gi, appData.classTitle);
      if (markup.indexOf("[code-body]") >= 0) {
        // get leading spaces
        let leadingSpaces = [];
        for (let i = markup.search(/[^\s]/); i > 0; i--) {
          leadingSpaces.push(" ");
        }
        leadingSpaces = leadingSpaces.join("");
        let split = appData.code.split("\n"), str = [];
        // add each line of code after 1st with leading spaces
        for (let i = 0, li = split.length; i < li; i++) {
          let s = [];
          if (i > 0) {
            s.push(leadingSpaces);
          }
          let text = _markupDelegator.string(split[i], appData).split("\r\n");
          s.push(text[0]);
          str.push(s.join(""));
          for (let j = 1, lj = text.length; j < lj; j++) {
            str.push([leadingSpaces, text[j]].join(""));
          }
        }
        markup = markup.replace(/\[code-body\]/gi, str.join("\r\n"));
      }
      markup = markup.replace(/\[code-injection\]/gi, appData.codeInjection);
      markup = markup.replace(/\[dice-value\]/gi, appData.diceValue);
      markup = markup.replace(/\[dictionary-declaration\]/gi, appData.dictionaryDeclaration);
      markup = markup.replace(/\[dictionary-definition\]/gi, appData.dictionaryDefinition);
      markup = markup.replace(/\[dictionary-name\]/gi, appData.dictionaryName);
      if (markup.indexOf("[dictionary-value]") >= 0) {
        // get leading spaces
        let leadingSpaces = [];
        for (let i = markup.search(/[^\s]/); i > 0; i--) {
          leadingSpaces.push(" ");
        }
        leadingSpaces = leadingSpaces.join("");
        let split = appData.dictionaryValue.split("\n"), str = [];
        // add each line of code with leading spaces
        for (let i = 0, li = split.length; i < li; i++) {
          let s = [];
          if (i > 0) {
            s.push(leadingSpaces);
          }
          let text = _markupDelegator.string(split[i], appData).split("\r\n");
          s.push(text[0]);
          if (text.length === 1) {
            if (i + 1 === split.length) {
              s.push(",");
            }
            str.push(s.join(""));
          } else {
            // push the 1st line
            str.push(s.join(""));
            for (let j = 1, lj = text.length; j < lj; j++) {
              let line = [leadingSpaces, text[j]];
              if (j + 1 === lj && i + 1 === split.length) {
                // add a comma to the last line
                line.push(",");
              }
              str.push(line.join(""));
            }
          }
        }
        markup = markup.replace(/\[dictionary-value\]/gi, str.join("\r\n"));
      }
      markup = markup.replace(/\[dictionary-key\]/gi, appData.dictionaryKey);
      if (markup.indexOf("[element-value]") >= 0) {
        let str = [];
        // get leading spaces
        let leadingSpaces = [];
        for (let i = markup.search(/[^\s]/); i > 0; i--) {
          leadingSpaces.push(" ");
        }
        leadingSpaces = leadingSpaces.join("");
        // add each line of code with leading spaces
        for (let i = 0, li = appData.elements.length; i < li; i++) {
          let element = appData.elements[i];
          let s = [];
          s.push(markup.replace(/\[element-definition\]/, element.elementDefinition).replace(/\[element-key\]/, element.elementName).replace(/\[element-value\]/, element.elementValue));
          str.push(s.join(""));
        }
        markup = str.join("\r\n");
      }
      markup = markup.replace(/\[enum-name\]/gi, appData.enumName);
      markup = markup.replace(/\[enum-fieldName\]/gi, appData.enumFieldName);
      markup = markup.replace(/\[enum-handle\]/gi, appData.enumHandle);
      if (appData.hasOwnProperty("enumHandle")) {
        markup = markup.replace(/\[enum-handle-camelcase\]/gi,
          appData.enumHandle.replace(
            /(?:^\w|[A-Z]|\b\w|\s+)/g,
            function(match, index) {
              if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
              return index === 0 ? match.toLowerCase() : match.toUpperCase();
            })
        );
        markup = markup.replace(/\[enum-handle-titlecase\]/gi,
          appData.enumHandle.replace(
            /(?:^\w|[a-z]|\b\w|\s+)/g,
            function(match, index) {
              if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
              return index === 0 ? match.toUpperCase() : match.toLowerCase();
            })
        );
      }
      if (appData.hasOwnProperty("enumPropertyValue")) {
        if (typeof(appData.enumPropertyValue) === "string" || appData.enumPropertyValue instanceof String) {
          markup = markup.replace(/\[enum-property-value\]/gi, ["\"", appData.enumPropertyValue.replace(/"/g, "\\\""), "\""].join(""));
        } else {
          markup = markup.replace(/\[enum-property-value\]/gi, appData.enumPropertyValue);
        }
      }
      markup = markup.replace(/\[enum-raw\]/gi, appData.enumRaw);
      markup = markup.replace(/\[enum-value\]/gi, appData.enumValue);
      if (markup.indexOf("[object-string]") >= 0) {
        for (var i = appData.objects.length - 1; i >= 0; i--) {
          if (appData.objects[i].objectName === appData.objectName) {
            markup = markup.replace(/\[object-string\]/gi, JSON.stringify(appData.objects[i].objectValue, null, 2));
          }
        }
      }
      markup = markup.replace(/\[field-declaration\]/gi, appData.fieldDeclaration);
      markup = markup.replace(/\[field-definition\]/gi, appData.fieldDefinition);
      markup = markup.replace(/\[field-name\]/gi, appData.fieldName);
      markup = markup.replace(/\[field-value\]/gi, appData.fieldValue);
      if (markup.indexOf("[getter-body]") >= 0) {
        // get leading spaces
        let leadingSpaces = [];
        for (let i = markup.search(/[^\s]/); i > 0; i--) {
          leadingSpaces.push(" ");
        }
        leadingSpaces = leadingSpaces.join("");
        let split = appData.getterBody.split("\n"), str = [];
        // add each line of code with leading spaces
        for (let i = 0, li = split.length; i < li; i++) {
          let s = [];
          if (i > 0) {
            s.push(leadingSpaces);
          }
          s.push(_markupDelegator.string(split[i], appData));
          str.push(s.join(""));
        }
        markup = markup.replace(/\[getter-body\]/gi, str.join("\r\n"));
      }
      if (markup.indexOf("[getter-definition]") >= 0) {
        let split = appData.getterDefinition.split("\n"), str = [];
        for (let i = 0, li = split.length; i < li; i++) {
          str.push(markup.replace(/\[getter-definition\]/gi, split[i]));
        }
        markup = markup.trim().replace(/\[getter-definition\]/gi, str.join("\r\n"));
      }
      if (markup.indexOf("[setter-body]") >= 0) {
        // get leading spaces
        let leadingSpaces = [];
        for (let i = markup.search(/[^\s]/); i > 0; i--) {
          leadingSpaces.push(" ");
        }
        leadingSpaces = leadingSpaces.join("");
        let split = appData.setterBody.split("\n"), str = [];
        // add each line of code with leading spaces
        for (let i = 0, li = split.length; i < li; i++) {
          let s = [];
          if (i > 0) {
            s.push(leadingSpaces);
          }
          s.push(_markupDelegator.string(split[i], appData));
          str.push(s.join(""));
        }
        markup = markup.replace(/\[setter-body\]/gi, str.join("\r\n"));
      }
      if (markup.indexOf("[setter-definition]") >= 0) {
        let split = appData.setterDefinition.split("\n"), str = [];
        for (let i = 0, li = split.length; i < li; i++) {
          str.push(markup.replace(/\[setter-definition\]/gi, split[i]));
        }
        markup = markup.trim().replace(/\[setter-definition\]/gi, str.join("\r\n"));
      }
      markup = markup.replace(/\[grid-width\]/gi, appData.gridWidth);
      markup = markup.replace(/\[grid-height\]/gi, appData.gridHeight);
      markup = markup.replace(/\[import-file\]/gi, appData.importFilePath);
      markup = markup.replace(/\[import-handle\]/gi, appData.importHandle);
      markup = markup.replace(/\[import-path\]/gi, appData.importPath);
      markup = markup.replace(/\[member-args-list\]/gi, appData.arguments);
      if (markup.indexOf("[member-definition]") >= 0) {
        let split = appData.memberDefinition.split("\n"), str = [];
        for (let i = 0, li = split.length; i < li; i++) {
          str.push(markup.replace(/\[member-definition\]/gi, split[i]));
        }
        markup = markup.trim().replace(/\[member-definition\]/gi, str.join("\r\n"));
      }
      markup = markup.replace(/\[member-name\]/gi, appData.memberName);
      markup = markup.replace(/\[namespace\]/gi, appData.namespace);
      markup = markup.replace(/\[optional-class-name\]/gi, appData.optionalClassName);
      markup = markup.replace(/\[optional-file-name\]/gi, appData.optionalFileName);
      markup = markup.replace(/\[optional-file-path\]/gi, appData.optionalFilePath);
      markup = markup.replace(/\[property-name\]/gi, appData.propertyName);
      markup = markup.replace(/\[file-handle\]/gi, appData.fileHandle);
      markup = markup.replace(/\[group-name\]/gi, appData.groupName);
      markup = markup.replace(/\[required-symbol\]/gi, appData.requiredSymbol);
      markup = markup.replace(/\[required-class\]/gi, appData.requiredClass);
      markup = markup.replace(/\[scene-key\]/gi, appData.sceneKey);
      markup = markup.replace(/\[scene-value\]/gi, appData.sceneValue);
      markup = markup.replace(/\[table-lookup\]/gi, appData.tableLookup);
      markup = markup.replace(/\[table-name\]/gi, appData.tableName);
      markup = markup.replace(/\[table-random-key\]/gi, appData.tableRandomKey);
      markup = markup.replace(/\[table-raw\]/gi, appData.tableRaw);
      markup = markup.replace(/\[test-method\]/gi, appData.testMethod);
      if (appData.hasOwnProperty("testParameter")) {
        if (typeof(appData.testParameter) === "string" || appData.testParameter instanceof String) {
          markup = markup.replace(/\[test-parameter\]/gi, ["\"", appData.testParameter, "\""].join(""));
        } else if (Array.isArray(appData.testParameter)) {
          markup = markup.replace(/\[test-parameter\]/gi, JSON.stringify(appData.testParameter));
        } else {
          markup = markup.replace(/\[test-parameter\]/gi, appData.testParameter);
        }
      }
      markup = markup.replace(/\[test-property\]/gi, appData.testProperty);
      markup = markup.replace(/\[test-suite\]/gi, appData.testSuite);
      if (appData.hasOwnProperty("testSuite")) {
        markup = markup.replace(/\[test-suite-camelcase\]/gi,
          appData.testSuite.replace(
            /(?:^\w|[A-Z]|\b\w|\s+)/g,
            function(match, index) {
              if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
              return index === 0 ? match.toLowerCase() : match.toUpperCase();
            })
        );
        markup = markup.replace(/\[test-suite-titlecase\]/gi,
          appData.testSuite.replace(
            /(?:^\w|[a-z]|\b\w|\s+)/g,
            function(match, index) {
              if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
              return index === 0 ? match.toUpperCase() : match.toLowerCase();
            })
        );
        markup = markup.replace(/\[test-suite-uppercase\]/gi, appData.testSuite.toUpperCase());
      }
      markup = markup.replace(/\[theme\]/gi, appData.theme);
      markup = markup.replace(/\[theme-background-colours\]/gi, _templates.themes[appData.theme]["background color"]);
      markup = markup.replace(/\[theme-default-tint\]/gi, _templates.themes[appData.theme]["default tint"]);
      if (markup.indexOf("[theme-font-import]") >= 0) {
        if (Array.isArray(_templates.themes[appData.theme]["font imports"])) {
          let s = [];
          for (let i = _templates.themes[appData.theme]["font imports"].length - 1; i >= 0; i--) {
            s.push(markup.replace(/\[theme-font-import\]/gi, _templates.themes[appData.theme]["font imports"][i]));
          }
          markup = s.join("\r\n");
        } else {
          markup = markup.replace(/\[theme-font-import\]/gi, _templates.themes[appData.theme]["font imports"]);
        }
      }
      markup = markup.replace(/\[theme-preferred-font\]/gi, _templates.themes[appData.theme]["preferred font"]);
      if (appData.hasOwnProperty("theme")) {
        markup = markup.replace(/\[theme-camelcase\]/gi,
          appData.theme.replace(
            /(?:^\w|[A-Z]|\b\w|\s+)/g,
            function(match, index) {
              if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
              return index === 0 ? match.toLowerCase() : match.toUpperCase();
            })
        );
        markup = markup.replace(/\[theme-titlecase\]/gi,
          appData.theme.replace(
            /(?:^\w|[a-z]|\b\w|\s+)/g,
            function(match, index) {
              if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
              return index === 0 ? match.toUpperCase() : match.toLowerCase();
            })
        );
        markup = markup.replace(/\[theme-uppercase\]/gi, appData.theme.toUpperCase());
      }
      return markup;
    },
    "enums": function(definition, classData, appData) {
      return "";
    },
    "group properties": function(definition, classData, appData) {
      let codeEntries = [], str = [];
      for (let i = appData.code.length - 1; i >= 0; i--) {
        let type = appData.code[i].tags[0];
        if (type === "code") {
          type = appData.code[i].tags[1];
        }
        if (type === "group properties" && appData.code[i].classUid === classData.uid) {
          let codeEntry = JSON.parse(JSON.stringify(appData.code[i]));
          codeEntry.appHandle = appData.appHandle;
          codeEntry.appName = appData.appName;
          codeEntry.theme = appData.theme;
          codeEntry.dimensions = appData.dimensions;
          codeEntries.push(codeEntry);
        }
      }
      codeEntries.sort(function(a, b) {
        let c = 0;
        if (a.groupName < b.groupName) {
          c = 1;
        } else if (a.groupName > b.groupName) {
          c = -1;
        }
        return c;
      });
      for (let i = codeEntries.length - 1; i >= 0; i--) {
        // go through each entry
        let codeEntry = codeEntries[i];
        for (let j = 0, lj = definition.markup.length; j < lj; j++) {
          str.push(_markupDelegator["string"](definition.markup[j], codeEntry));
        }
      }
      return str.join("\r\n");
    },
    "injection marker": function(definition, classData, appData) {
      let str = [];
      // found an injection marker. what is it?
      let site = definition["marker id"].replace(/\[namespace\]/gi, appData.fileHandle);
      if (classData !== null) {
        site = site.replace(/\[class-handle\]/gi, classData.classHandle);
      }
      // console.log("+++++++++++++++process site",site)
      // check all source code entries for a matching site
      let codeEntries = [];
      for (let i = appData.code.length - 1; i >= 0; i--) {
        let type = appData.code[i].tags[0];
        if (type === "code") {
          type = appData.code[i].tags[1];
        }
        if (site === [appData.code[i].classHandle, type].join(" ")) {
          let codeEntry = JSON.parse(JSON.stringify(appData.code[i]));
          codeEntry.appHandle = appData.appHandle;
          codeEntry.appName = appData.appName;
          codeEntry.theme = appData.theme;
          codeEntry.dimensions = appData.dimensions;
          codeEntry.namespace = appData.fileHandle;
          codeEntries.push(codeEntry);
        }
      }
      if (codeEntries.length > 0) {
        codeEntries.sort(function(a, b) {
          let c = 0;
          if (parseInt(a.order) < parseInt(b.order)) {
            c = 1;
          } else if (parseInt(a.order) > parseInt(b.order)) {
            c = -1;
          }
          return c;
        });
        for (let i = codeEntries.length - 1; i >= 0; i--) {
          let codeEntry = codeEntries[i];
          // console.log(codeEntry)
          if (site.indexOf("private field") > 0) {
            codeEntry.fieldDeclaration = "let ";
            let typeSplit = codeEntry.fieldType.split(" ");
            if (typeSplit.includes("constant")) {
              codeEntry.fieldDeclaration = "const ";
            }
            if (codeEntry.classTemplate === "prototype"
                || codeEntry.classTemplate === "ui-scene") {
              codeEntry.fieldDeclaration = "this.";
            }
            for (let i = 0, li = definition.markup.length; i < li; i++) {
              str.push(_markupDelegator["string"](definition.markup[i], codeEntry));
            }
          } else if (site.indexOf("scoped dictionary enclosure") > 0) {
            codeEntry.dictionaryDeclaration = "let ";
            if (!codeEntry.hasOwnProperty("dictionaryType")) {
              codeEntry.dictionaryType = "";
            }
            let typeSplit = codeEntry.dictionaryType.split(" ");
            if (typeSplit.includes("constant")) {
              codeEntry.dictionaryDeclaration = "const ";
            } else if (codeEntry.classTemplate === "prototype"
                || codeEntry.classTemplate === "ui-scene") {
              codeEntry.dictionaryDeclaration = "this.";
            }
            for (let i = 0, li = definition.markup.length; i < li; i++) {
              str.push(_markupDelegator["string"](definition.markup[i], codeEntry));
            }
          } else if (site.indexOf("constructor body") > 0
              || site.indexOf("create") > 0
              || site.indexOf("init") > 0
              || site.indexOf("postboot") > 0
              || site.indexOf("preboot") > 0
              || site.indexOf("preload") > 0
              || site.indexOf("update") > 0
              || site.indexOf("dictionary body") > 0
              || site.indexOf("inheritance") > 0
              || site.indexOf("public member") > 0
              || site.indexOf("public getter/setter property") > 0
              || site.indexOf("public getter property") > 0
              || site.indexOf("public setter property") > 0
              || site.indexOf("required import") > 0
              || site.indexOf("scene group") > 0
              || site.indexOf("start scene") > 0) {
            for (let i = 0, li = definition.markup.length; i < li; i++) {
              str.push(_markupDelegator["string"](definition.markup[i], codeEntry));
            }
          }
        }
      }
      return str.join("\r\n");
    },
    "class listing": function(definition, classData, appData) {
      let str = [];
      let list = appData.classes;
      if (definition.hasOwnProperty("filter")) {
        switch (definition.filter) {
          case "scene":
            list = appData.scenes;
            break;
        }
      }
      list.sort(function(a, b) {
        let c = 0, aWeight = typeof(a.weight) === "undefined" ? 1 : a.weight, bWeight = typeof(b.weight) === "undefined" ? 1 : b.weight;
        if (aWeight < bWeight) {
          c = 1;
          if (definition.filter === "scene") {
            c = -1;
          }
        } else if (aWeight > bWeight) {
          c = -1;
          if (definition.filter === "scene") {
            c = 1;
          }
        } else {
          if (a.classPath < b.classPath) {
            c = 1;
          } else if (a.classPath > b.classPath) {
            c = -1;
          } else {
            if (a.fileHandle < b.fileHandle) {
              c = 1;
            } else if (a.fileHandle > b.fileHandle) {
              c = -1;
            }
          }
        }
        return c;
      });
      for (let i = list.length - 1; i >= 0; i--) {
        for (let j = 0, lj = definition.markup.length; j < lj; j++) {
          let line = definition.markup[j];
          line = line.replace(/\[app-handle\]/gi, appData.appHandle);
          line = line.replace(/\[class-handle\]/gi, list[i].fileHandle);
          line = line.replace(/\[class-path\]/gi, list[i].classPath);
          line = line.replace(/\[class-name\]/gi, list[i].classHandle);
          line = line.replace(/\[namespace\]/gi, appData.fileHandle);
          str.push(line);
        }
      }
      return str.join("\r\n");
    },
  };
  /**
   * Generates the application's html file.
   * @param {Object} data the application data
   */
  _generateAppHtml = function(data) {
    // make path to file
    let template = _templates.phaser.html;
    let filePath = [__dirname, '..',  'public'].concat(template.path);
    filePath.push(template.filename.replace(/\[namespace\]/gi, data.fileHandle));
    filePath = path.join.apply(null, filePath);
    let logger = fs.createWriteStream(filePath, {
      flags: 'w' // create new file or truncate existing
    });
    // write the file
    for (let i = 0, li = template.template.length; i < li; i++) {
      let templateMember = template.template[i];
      if (typeof(templateMember) === "string" || templateMember instanceof String) {
        logger.write(_markupDelegator["string"](templateMember, data));
        logger.write("\r\n");
      } else {
        if (templateMember.hasOwnProperty("type")) {
          let s = _markupDelegator[templateMember.type](templateMember, null, data);
          if (s.length > 0) {
            logger.write(s);
            logger.write("\r\n");
          }
        }
      }
    }
  };
  /**
   * Generates the application's source classes.
   * @param {Object} data the application data
   */
  _generateSourceClasses = function(data) {
    for (let i = data.classes.length - 1; i >= 0; i--) {
      let classData = JSON.parse(JSON.stringify(data.classes[i])), template;
      classData.appHandle = data.appHandle;
      classData.appName = data.appName;
      classData.theme = data.theme;
      classData.dimensions = data.dimensions;
      if (classData.tags.includes("prototype")) {
        template = _templates.phaser.prototype;
      } else if (classData.tags.includes("game")) {
        template = _templates.phaser.game;
      } else if (classData.tags.includes("scene")) {
        template = _templates.phaser.scene;
      } else if (classData.tags.includes("scene-container")) {
        template = _templates.phaser["scene-container"];
      } else if (classData.tags.includes("scene-controller")) {
        template = _templates.phaser["scene-controller"];
      } else if (classData.tags.includes("singleton")) {
        template = _templates.phaser.singleton;
      } else if (classData.tags.includes("ui-scene")) {
        template = _templates.phaser["ui-scene"];
      } else if (classData.tags.includes("app-constants")) {
        template = _templates.phaser.constants;
      }
      let filePath = [__dirname, '..',  'public'].concat(template.path);
      if (classData.tags.includes("prototype")
          || (classData.tags.includes("scene-container") && classData.hasOwnProperty("filePath"))
          || classData.tags.includes("singleton")
          || classData.tags.includes("ui-scene")) {
        if (Array.isArray(classData.filePath)) {
          filePath = filePath.concat(classData.filePath);
        } else {
          filePath.push(classData.filePath);
        }
      }
      for (let j = filePath.length - 1; j >= 0; j--) {
        filePath[j] = filePath[j].replace(/\[namespace\]/gi, data.fileHandle)
      }
      // make path for file
      try {
        let dirPath = path.join.apply(null, filePath);
        fs.mkdirSync(dirPath);
      } catch (e) {
        // console.error(e);
      }
      filePath.push(template.filename.replace(/\[namespace\]/gi, data.fileHandle).replace(/\[file-handle\]/gi, classData.fileHandle));
      filePath = path.join.apply(null, filePath);
      let logger = fs.createWriteStream(filePath, {
        flags: 'w' // create new file or truncate existing
      });
      // write the file
      for (let i = 0, li = template.template.length; i < li; i++) {
        let templateMember = template.template[i];
        if (typeof(templateMember) === "string" || templateMember instanceof String) {
          logger.write(_markupDelegator["string"](templateMember, classData));
          logger.write("\r\n");
        } else {
          if (templateMember.hasOwnProperty("type")) {
            if (!_markupDelegator.hasOwnProperty(templateMember.type)) {
              console.trace("Missing markup tag",templateMember.type);
            }
            let s = _markupDelegator[templateMember.type](templateMember, classData, data);
            if (s.length > 0) {
              logger.write(s);
              logger.write("\r\n");
            }
          }
        }
      }
    }
  }
  _processData = function(data) {
    let structure = {
      "appHandle": data.appHandle,
      "appName": data.appName,
      "fileHandle": data.fileHandle,
      "theme": data.theme,
      "dimensions": data.dimensions,
      "classes": [],
      "scenes": [],
      "code": []
    };
    recursiveProcess(data["Design Notes"]);
    // console.log("structure before fixing code paths",structure)
    // fix all code paths
    for (let i = structure.code.length - 1; i >= 0; i--) {
      let codeEntry = structure.code[i];
      for (let j = structure.classes.length - 1; j >= 0; j--) {
        let classEntry = structure.classes[j];
        if (codeEntry.classUid === classEntry.uid) {
          codeEntry.classHandle = classEntry.classHandle;
          if (classEntry.tags.includes("scene")) {
            codeEntry.classPath = _templates.phaser.scene.path.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "scene";
          }
          if (classEntry.tags.includes("game")) {
            codeEntry.classPath = _templates.phaser.game.path.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "game";
          }
          if (classEntry.tags.includes("prototype")) {
            codeEntry.classPath = JSON.parse(JSON.stringify(_templates.phaser.prototype.path));
            if (Array.isArray(classEntry.filePath)) {
              codeEntry.classPath = codeEntry.classPath.concat(classEntry.filePath);
            } else {
              codeEntry.classPath.push(classEntry.filePath);
            }
            codeEntry.classPath = codeEntry.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "prototype";
          }
          if (classEntry.tags.includes("app-constants")) {
            codeEntry.classPath = _templates.phaser["constants"].path.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "constants";
          }
          if (classEntry.tags.includes("scene-container")) {
            codeEntry.classPath = JSON.parse(JSON.stringify(_templates.phaser["scene-container"].path));
            if (Array.isArray(classEntry.filePath)) {
              codeEntry.classPath = codeEntry.classPath.concat(classEntry.filePath);
            } else {
              codeEntry.classPath.push(classEntry.filePath);
            }
            codeEntry.classPath = codeEntry.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "scene-container";
          }
          if (classEntry.tags.includes("scene-controller")) {
            codeEntry.classPath = _templates.phaser["scene-controller"].path.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "scene-controller";
          }
          if (classEntry.tags.includes("singleton")) {
            codeEntry.classPath = JSON.parse(JSON.stringify(_templates.phaser.singleton.path));
            if (Array.isArray(classEntry.filePath)) {
              codeEntry.classPath = codeEntry.classPath.concat(classEntry.filePath);
            } else {
              codeEntry.classPath.push(classEntry.filePath);
            }
            codeEntry.classPath = codeEntry.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "singleton";
          }
          if (classEntry.tags.includes("ui-scene")) {
            codeEntry.classPath = JSON.parse(JSON.stringify(_templates.phaser["ui-scene"].path));
            if (Array.isArray(classEntry.filePath)) {
              codeEntry.classPath = codeEntry.classPath.concat(classEntry.filePath);
            } else {
              codeEntry.classPath.push(classEntry.filePath);
            }
            codeEntry.classPath = codeEntry.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            codeEntry.classTemplate = "ui-scene";
          }
          break;
        }
      }
    }
    // console.log("structure after",structure)
    function recursiveProcess(arr) {
      for (let i = arr.length - 1; i >= 0; i--) {
        let obj = arr[i];
        if (obj.hasOwnProperty("tags")) {
          // this is a design object
          // process the object
          if (obj.tags.includes("class")) {
            structure.classes.push(obj);
            obj.namespace = structure.fileHandle;
          }
          if (obj.tags.includes("scene")) {
            obj.classPath = _templates.phaser.scene.path.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            structure.scenes.push(obj);
          }
          if (obj.tags.includes("game")) {
            obj.classPath = _templates.phaser.game.path.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
          }
          if (obj.tags.includes("prototype")) {
            obj.classPath = JSON.parse(JSON.stringify(_templates.phaser.prototype.path));
            if (Array.isArray(obj.filePath)) {
              obj.classPath = obj.classPath.concat(obj.filePath);
            } else {
              obj.classPath.push(obj.filePath);
            }
            obj.classPath = obj.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
          }
          if (obj.tags.includes("app-constants")) {
            obj.classPath = JSON.parse(JSON.stringify(_templates.phaser.constants.path));
            obj.classPath = obj.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
          }
          if (obj.tags.includes("scene-container")) {
            obj.classPath = JSON.parse(JSON.stringify(_templates.phaser["scene-container"].path));
            if (Array.isArray(obj.filePath)) {
              obj.classPath = obj.classPath.concat(obj.filePath);
            } else {
              obj.classPath.push(obj.filePath);
            }
            obj.classPath = obj.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            structure.scenes.push(obj);
          }
          if (obj.tags.includes("scene-controller")) {
            obj.classPath = JSON.parse(JSON.stringify(_templates.phaser["scene-controller"].path));
            obj.classPath = obj.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
            structure.scenes.push(obj);
          }
          if (obj.tags.includes("singleton")) {
            obj.classPath = JSON.parse(JSON.stringify(_templates.phaser.singleton.path));
            if (Array.isArray(obj.filePath)) {
              obj.classPath = obj.classPath.concat(obj.filePath);
            } else {
              obj.classPath.push(obj.filePath);
            }
            obj.classPath = obj.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
          }
          if (obj.tags.includes("ui-scene")) {
            obj.classPath = JSON.parse(JSON.stringify(_templates.phaser["ui-scene"].path));
            if (Array.isArray(obj.filePath)) {
              obj.classPath = obj.classPath.concat(obj.filePath);
            } else {
              obj.classPath.push(obj.filePath);
            }
            obj.classPath = obj.classPath.join("/").replace(/\[namespace\]/gi, structure.fileHandle);
          }
          if (obj.tags.includes("code")) {
            structure.code.push(obj);
          }
        } else {
          // this is a design entry. look for children or designs
          if (obj.hasOwnProperty("children")) {
            recursiveProcess(obj.children);
          }
          if (obj.hasOwnProperty("design")) {
            recursiveProcess(obj.design);
          }
        }
      }
    }
    return structure;
  }
  return {
    /**
     * 
     * @param {*} data 
     */ 
    "createPhaserProject": function(data) {
      // process the data
      let structure = _processData(data);
      
      // generate the files
      _generateAppHtml(structure);
      _generateSourceClasses(structure);
    },
  }
} ());

module.exports = { PhaserCodeGenerator };