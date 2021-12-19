/**
 * @class Manager class for handling the project data.
 */
const ProjectManager = (function() {
  /** @private the current project. */
  let _project;
  /** the section currently being worked on. */
  let _currentSectionWorkingOn;
  /** the DOM structure of the top-level menu. */
  const _APPLICATION_MENU = [
    {
      "dom": "<li>",
      "class": "nav-item dropdown",
      "children": [
        {
          "dom": "<a>",
          "class": "nav-link dropdown-toggle",
          "attr": {
            "href": "#",
            "role": "button",
            "data-bs-toggle": "dropdown"
          },
          "content": "File"
        },        
        {
          "comment": "FILE MENU",
          "dom": "<ul>",
          "class": "dropdown-menu",
          "children": [
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item",
                  "attr": {
                    "href": "#"
                  },
                  "content": "Generate Phaser Code",
                  "callback": {
                    "args": "",
                    "body": "ProjectManager.generatePhaserCode();"
                  }
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item disabled",
                  "attr": {
                    "href": "#"
                  },
                  "content": "Generate Unity Code"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "dom": "<li>",
      "class": "nav-item dropdown",
      "children": [
        {
          "dom": "<a>",
          "class": "nav-link dropdown-toggle",
          "attr": {
            "href": "#",
            "role": "button",
            "data-bs-toggle": "dropdown"
          },
          "content": "Edit"
        },
        {
          "comment": "EDIT MENU",
          "dom": "<ul>",
          "class": "dropdown-menu",
          "children": [
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item",
                  "attr": {
                    "href": "#"
                  },
                  "content": "Add Section",
                  "callback": {
                    "args": "",
                    "body": "FormManager.displayAddSectionForm();"
                  }
                }
              ]
            },
            {
              "comment": "ADD DESIGN LINK",
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item disabled",
                  "attr": {
                    "href": "#",
                    "id": "addDesignLink"
                  },
                  "content": "Add Design",
                  "callback": {
                    "args": "",
                    "body": "FormManager.displayAddDesignForm();"
                  }
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<hr>",
                  "class": "dropdown-divider",
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item disabled",
                  "attr": {
                    "href": "#",
                    "id": "editSectionLink"
                  },
                  "content": "Edit Section",
                  "callback": {
                    "args": "",
                    "body": "FormManager.displayEditSectionForm();"
                  }
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item disabled",
                  "attr": {
                    "href": "#",
                    "id": "deleteSectionLink"
                  },
                  "content": "Delete Section",
                  "callback": {
                    "args": "",
                    "body": "ProjectManager.deleteSection();"
                  }
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<hr>",
                  "class": "dropdown-divider",
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item disabled",
                  "attr": {
                    "href": "#",
                    "id": "addDesignNotesLink"
                  },
                  "content": "Add Design Notes",
                  "callback": {
                    "args": "",
                    "body": "FormManager.displayAddDesignNotesForm();"
                  }
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item disabled",
                  "attr": {
                    "href": "#",
                    "id": "addTestingNotesLink"
                  },
                  "content": "Add Testing Notes",
                  "callback": {
                    "args": "",
                    "body": "FormManager.displayAddTestNotesForm();"
                  }
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item disabled",
                  "attr": {
                    "href": "#",
                    "id": "addNextStepsNotesLink"
                  },
                  "content": "Add Next Steps Notes",
                  "callback": {
                    "args": "",
                    "body": "FormManager.displayAddNextStepsNotesForm();"
                  }
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<hr>",
                  "class": "dropdown-divider",
                }
              ]
            },
            {
              "dom": "<li>",
              "children": [
                {
                  "dom": "<a>",
                  "class": "dropdown-item",
                  "attr": {
                    "href": "#"
                  },
                  "content": "Theme",
                  "callback": {
                    "args": "",
                    "body": "FormManager.displayChangeThemeForm();"
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "dom": "<li>",
      "class": "nav-item dropdown",
      "attr": { "id": "loadMenu" },
      "children": [
        {
          "dom": "<a>",
          "class": "nav-link dropdown-toggle",
          "attr": {
            "href": "#",
            "role": "button",
            "data-bs-toggle": "dropdown"
          },
          "content": "Load"
        }
      ]
    }
  ];
  /** the DOM structure of the navigation root. */
  const _NAV_ROOT = {
    dom: "nav",
    class: "nav flex-column",
    attr: { "id": "projectNav" },
    style: "height: 485px; overflow-y: scroll;"
  };
  /** the DOM structure of a navigation branch. */
  const _NAV_BRANCH = {
    dom: "a",
    class: "nav-link side-nav",
    attr: { "href": "#" }
  };
  /** the dictionary of titles assigned to each theme. */
  const _THEME_TITLES = {
    "amiga": "Amiga Workbench",
    "c64": "Commodore 64",
    "hypercard": "Macintosh Hypercard",
    "nes": "Nintendo Entertainment System",
    "rpgui": "RPG UI"
  }
  const ANNOTATIONS_WEIGHT = {
    "class": 0,
    "prototype": 0,
    "scene": 0,
    "code": 1,
    "private field": 1,
    "constructor body": 2,
    "inheritance": 3,

    "scoped dictionary enclosure 0": 4,
    "scoped dictionary body 0": 5,
    "scoped dictionary enclosure 1": 6,
    "scoped dictionary body 1": 7,

    "public getter/setter property": 8,
    "public getter property": 9,
    "public setter property": 10,

    "public member": 11,

    "create": 12,
    "init": 13,
    "preload": 14,
    "update": 14,
    "preboot": 15,
    "postboot": 16,

  }
  const ANNOTATIONS_BUILDER = {
    "app-constants": function($div, entry) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Library Class Registered - ", _project.appHandle, entry.classHandle].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Remove Library Class",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    game: function($div, entry) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": "Application Entry Point Created"
      }));
      $div.append(_contentBuilder({
        "dom": "em",
        "class": "small",
        "content": [_project.fileHandle, "/src/singletons/", _project.fileHandle, "-", entry.fileHandle, ".js"].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ",entry.classDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "class"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["&nbsp;", _project.appHandle, entry.classHandle].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Game",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Scene",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "group properties": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Group Properties '", entry.groupName, "' Created In Class ", className].join("")
      }));
      let o = {
        "dom": "pre",
        "class": "language-javascript",
        "children": []
      };
      for (let i = 0, li = entry.elements.length; i < li; i++) {
        if (o.children.length > 0) {
          o.children.push({ dom: "br" });
        }
        let element = entry.elements[i];
        let c = [
          {
            "dom": "span",
            "class": "token comment",
            "style": "white-space: normal;",
            "content": ["/** ", element.elementDefinition, "*/"].join("")
          },
          {
            "dom": "br"
          },
          {
            "dom": "span",
            "class": "token keyword",
            "content": element.elementName
          },
          {
            "dom": "span",
            "class": "token class-name",
            "content": ["&nbsp;=&nbsp;", element.elementValue, ";"].join("")
          }
        ];
        o.children = o.children.concat(c);
      }
      $div.append(_contentBuilder(o));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Group Properties",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    inheritance: function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Class Inheritance for ", className, " Defined"].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token keyword",
                  "style": "white-space: normal;",
                  "content": [className, ".prototype = Object.create(", entry.classInheritance, ".prototype);"].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Inheritance",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Inheritance",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "key listener handler": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Key Listener Handler for '", entry.entryKey, "' Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token class-name",
                  "style": "white-space: normal;",
                  "content": entry.code.replace(/\n/g, "<br>")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Code",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Code",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "private field": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Private Field '", entry.fieldName, "' Created In Class ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ", entry.fieldDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": entry.fieldName
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["&nbsp;=&nbsp;", entry.fieldValue, ";"].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Private Field",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Private Field",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    prototype: function($div, entry) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Prototype Created - ", _project.appHandle, entry.classHandle].join("")
      }));
      $div.append(_contentBuilder({
        "dom": "em",
        "class": "small",
        "content": [_project.fileHandle, "/src/", entry.filePath.join("/"), "/", _project.fileHandle, "-", entry.fileHandle, ".js"].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ",entry.classDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "class"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["&nbsp;", _project.appHandle, entry.classHandle].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Prototype",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Prototype",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "prototype requires": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Required Import Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": [entry.className, ".prototype.", entry.requiredSymbol, " = ", entry.requiredClass, ";"].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Import",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "public member": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Public Member '", entry.memberName, "' Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": entry.memberDefinition.replace(/\n/g, "<br>")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": [entry.memberName, ": function(", entry.arguments, ") {"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": entry.code.replace(/\n/g, "<br>")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": "}"
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Code",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Code",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "public setter property": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Public Setter '", entry.propertyName, "' Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": entry.setterDefinition.replace(/\n/g, "<br>")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": "set: function(value) {"
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": entry.setterBody.replace(/\n/g, "<br>")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": "}"
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Code",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Code",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "required import": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Required Import Added To ", className].join("")
      }));
      if (entry.hasOwnProperty("imports")) {
        let o = {
          dom: "pre",
          class: "language-javascript",
          children: []
        }
        for (let i = 0, li = entry.imports.length; i < li; i++) {
          let imp = entry.imports[i];
          o.children.push(
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "var"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": [" { ", imp.importHandle, " } = "].join("")
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "require"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["(\"", imp.importPath, "\");"].join("")
                }
              ]
            }
          );
          if (i + 1 < li) {
            o.children.push({ dom: "br" })
          }
        }        
        $div.append(_contentBuilder(o));
      } else {
        $div.append(_contentBuilder(
          {
            "dom": "pre",
            "class": "language-javascript",
            "children": [
              {
                "dom": "code",
                "class": "language-javascript",
                "children": [
                  {
                    "dom": "span",
                    "class": "token keyword",
                    "content": "var"
                  },
                  {
                    "dom": "span",
                    "class": "token class-name",
                    "content": [" { ", entry.importHandle, " } = "].join("")
                  },
                  {
                    "dom": "span",
                    "class": "token keyword",
                    "content": "require"
                  },
                  {
                    "dom": "span",
                    "class": "token class-name",
                    "content": ["(\"", entry.importPath, "\");"].join("")
                  }
                ]
              }
            ]
          }
        ));
      }
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Import",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Import",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "required import no bracket": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Required Import Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "var"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": [" ", entry.importHandle, " = "].join("")
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "require"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["(\"", entry.importPath, "\");"].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Import",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Import",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    scene: function($div, entry) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": "Scene Created"
      }));
      $div.append(_contentBuilder({
        "dom": "em",
        "class": "small",
        "content": [_project.fileHandle, "/src/scenes/", _project.fileHandle, "-", entry.fileHandle, ".js"].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ",entry.classDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "class"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["&nbsp;", _project.appHandle, entry.classHandle].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Scene",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Scene",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "scene-container": function($div, entry) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": "Scene Container Created"
      }));
      $div.append(_contentBuilder({
        "dom": "em",
        "class": "small",
        "content": [_project.fileHandle, "/src/scenes/", _project.fileHandle, "-", entry.fileHandle, ".js"].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ",entry.classDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "class"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["&nbsp;", _project.appHandle, entry.classHandle].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Scene Container",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Scene Container",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "scene group": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Scene Group Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["_sceneGroups[", entry.sceneKey, "] = [", entry.sceneValue, "];"].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Scene Group",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Scene Group",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "scoped dictionary body": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Dictionary Entry '", entry.dictionaryKey, "' Added In Class ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ", entry.dictionaryDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": entry.dictionaryKey
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": [":&nbsp;", entry.dictionaryValue.replace(/\n/g, "<br>")].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Dictionary Entry",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Dictionary Entry",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "scoped dictionary enclosure": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Dictionary '", entry.dictionaryName, "' Declared In Class ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ", entry.dictionaryDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": entry.dictionaryName
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": "&nbsp;=&nbsp;{};"
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Dictionary",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "scoped method body": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": [entry.tags.includes("create") ? "'Create'" : entry.tags.includes("init") ? "'Init'" : entry.tags.includes("postboot") ? "'PostBoot'" : entry.tags.includes("preboot") ? "'PreBoot'" : entry.tags.includes("preload") ? "'Preload'" : entry.tags.includes("update") ? "'Update'" : "Constructor", " Code Entry in ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": entry.code.replace(/\n/g, "<br>")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Code",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Code",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    singleton: function($div, entry) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Singleton Created - ", _project.appHandle, entry.classHandle].join("")
      }));
      $div.append(_contentBuilder({
        "dom": "em",
        "class": "small",
        "content": [_project.fileHandle, "/src/", entry.filePath.join("/"), "/", _project.fileHandle, "-", entry.fileHandle, ".js"].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ",entry.classDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "class"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["&nbsp;", _project.appHandle, entry.classHandle].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Singleton",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "singleton requires": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Required Import Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": [entry.className, ".", entry.requiredSymbol, " = ", entry.requiredClass, ";"].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Import",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "ui-scene": function($div, entry) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": "UI Scene Prototype Created"
      }));
      $div.append(_contentBuilder({
        "dom": "em",
        "class": "small",
        "content": [_project.fileHandle, "/src/", entry.filePath.join("/"), "/", _project.fileHandle, "-", entry.fileHandle, ".js"].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": ["/** ",entry.classDefinition, "*/"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token keyword",
                  "content": "class"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": ["&nbsp;", _project.appHandle, entry.classHandle].join("")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit UI Prototype",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete UI Prototype",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "unit test": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["Unit Test '", entry.testHeader, "' Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token comment",
                  "style": "white-space: normal;",
                  "content": entry.testDefinition.replace(/\n/g, "<br>")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": [" test(\"", entry.testDefinition, "\", (", entry.arguments, ") => {"].join("")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": entry.code.replace(/\n/g, "<br>")
                },
                {
                  "dom": "br"
                },
                {
                  "dom": "span",
                  "class": "token class-name",
                  "content": "}"
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Code",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Code",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
    "view template": function($div, entry, className) {
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h6",
        "content": ["View Template for '", entry.entryKey, "' Added To ", className].join("")
      }));
      $div.append(_contentBuilder(
        {
          "dom": "pre",
          "class": "language-javascript",
          "children": [
            {
              "dom": "code",
              "class": "language-javascript",
              "children": [
                {
                  "dom": "span",
                  "class": "token class-name",
                  "style": "white-space: normal;",
                  "content": entry.code.replace(/\n/g, "<br>")
                }
              ]
            }
          ]
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Edit Code",
          "callback": {
            "args": "",
            "body": ["FormManager.displayEditDesignForm(\"", entry.uid, "\");"].join("")
          }
        }
      ));
      $div.append(_contentBuilder(
        {
          "dom": "<a>",
          "class": "btn",
          "attr": {
            "href": "#",
            "role": "button",
            "data-uid": entry.uid
          },
          "content": "Delete Code",
          "callback": {
            "args": "",
            "body": ["ProjectManager.deleteDesignEntry(\"", entry.uid, "\");"].join("")
          }
        }
      ));
    },
  }
  let _buildAnnotations = function(data) {
    $("#annotations").html("");
    if (data.design.length > 0) {
      let $div = _contentBuilder({
        "dom": "div",
        "class": "annotation",
        "style": "display: none;"
      });
      $div.append(_contentBuilder({
        "dom": "p",
        "class": "h4",
        "content": data.title
      }));
      let entries = JSON.parse(JSON.stringify(data.design));
      // BUCKET ANNOTATIONS BY CLASS
      let classDict = {};
      for (let i = entries.length - 1; i >= 0; i--) {
        let entry = entries[i];
        if (entry.tags.includes("class")) {
          if (!classDict.hasOwnProperty(entry.classHandle)) {
            classDict[entry.classHandle] = [];
          }
          classDict[entry.classHandle].push(entry);
        } else if (entry.tags.includes("code")) {
          // get parent class
          let parent = ProjectManager.getEntryByUid(entry.classUid);
          if (!classDict.hasOwnProperty(parent.classHandle)) {
            classDict[parent.classHandle] = [];
          }
          classDict[parent.classHandle].push(entry);
        }
      }
      let keys = Object.keys(classDict);
      keys.sort();
      for (let j = keys.length - 1; j >= 0; j--) {
        // SORT BUCKETS BY DESIGN TYPES
        classDict[keys[j]].sort(function (a, b) {
          let c = 0, aWeight = 0, bWeight = 0;
          for (let i = a.tags.length - 1; i >= 0; i--) {
            aWeight += ANNOTATIONS_WEIGHT[a.tags[i]];
            if (!ANNOTATIONS_WEIGHT.hasOwnProperty(a.tags[i])) {
              console.log("missing weight for", a.tags[i]);
            }
          }
          for (let i = b.tags.length - 1; i >= 0; i--) {
            bWeight += ANNOTATIONS_WEIGHT[b.tags[i]];
            if (!ANNOTATIONS_WEIGHT.hasOwnProperty(b.tags[i])) {
              console.log("missing weight for", b.tags[i]);
            }
          }
          a.weight = aWeight;
          b.weight = bWeight;
          if (aWeight < bWeight) {
            c = -1;
          } else if (aWeight > bWeight) {
            c = 1;
          } else {
            if (a.hasOwnProperty("order") && b.hasOwnProperty("order")) {
              if (a.order < b.order) {
                c = -1;
              } else if (a.order > b.order) {
                c = 1;
              }
            }
          }
          return c;
        });
        console.log("classDict",classDict)
        // DISPLAY ANNOTATIONS
        for (let i = 0, li = classDict[keys[j]].length; i < li; i++) {
          let entry = classDict[keys[j]][i];
          if (entry.tags.includes("app-constants")) {
            ANNOTATIONS_BUILDER["app-constants"]($div, entry, keys[j]);
          } else if (entry.tags.includes("inheritance")) {
            ANNOTATIONS_BUILDER.inheritance($div, entry, keys[j]);
          } else if (entry.tags.includes("prototype")) {
            ANNOTATIONS_BUILDER.prototype($div, entry, keys[j]);
          } else if (entry.tags.includes("game")) {
            ANNOTATIONS_BUILDER.game($div, entry, keys[j]);
          } else if (entry.tags.includes("group properties")) {
            ANNOTATIONS_BUILDER["group properties"]($div, entry, keys[j]);
          } else if (entry.tags.includes("key listener handler")) {
            ANNOTATIONS_BUILDER["key listener handler"]($div, entry, keys[j]);
          } else if (entry.tags.includes("scene")) {
            ANNOTATIONS_BUILDER.scene($div, entry, keys[j]);
          } else if (entry.tags.includes("scene-container")) {
            ANNOTATIONS_BUILDER["scene-container"]($div, entry, keys[j]);
          } else if (entry.tags.includes("scene group")) {
            ANNOTATIONS_BUILDER["scene group"]($div, entry, keys[j]);
          } else if (entry.tags.includes("private field")) {
            ANNOTATIONS_BUILDER["private field"]($div, entry, keys[j]);
          } else if (entry.tags.includes("scoped dictionary enclosure 0") || entry.tags.includes("scoped dictionary enclosure 1")) {
            ANNOTATIONS_BUILDER["scoped dictionary enclosure"]($div, entry, keys[j]);
          } else if (entry.tags.includes("scoped dictionary body 0") || entry.tags.includes("scoped dictionary body 1")) {
            ANNOTATIONS_BUILDER["scoped dictionary body"]($div, entry, keys[j]);
          } else if (entry.tags.includes("create") || entry.tags.includes("init") || entry.tags.includes("postboot") || entry.tags.includes("preboot") || entry.tags.includes("preload") || entry.tags.includes("update") || entry.tags.includes("constructor body")) {
            ANNOTATIONS_BUILDER["scoped method body"]($div, entry, keys[j]);
          } else if (entry.tags.includes("prototype requires")) {
            ANNOTATIONS_BUILDER["prototype requires"]($div, entry, keys[j]);
          } else if (entry.tags.includes("public member")) {
            ANNOTATIONS_BUILDER["public member"]($div, entry, keys[j]);
          } else if (entry.tags.includes("public setter property")) {
            ANNOTATIONS_BUILDER["public setter property"]($div, entry, keys[j]);
          } else if (entry.tags.includes("required import")) {
            ANNOTATIONS_BUILDER["required import"]($div, entry, keys[j]);
          } else if (entry.tags.includes("required import no bracket")) {
            ANNOTATIONS_BUILDER["required import no bracket"]($div, entry, keys[j]);
          } else if (entry.tags.includes("singleton")) {
            ANNOTATIONS_BUILDER.singleton($div, entry, keys[j]);
          } else if (entry.tags.includes("singleton requires")) {
            ANNOTATIONS_BUILDER["singleton requires"]($div, entry, keys[j]);
          } else if (entry.tags.includes("ui-scene")) {
            ANNOTATIONS_BUILDER["ui-scene"]($div, entry, keys[j]);
          } else if (entry.tags.includes("unit test")) {
            ANNOTATIONS_BUILDER["unit test"]($div, entry, keys[j]);
          } else if (entry.tags.includes("view template")) {
            ANNOTATIONS_BUILDER["view template"]($div, entry, keys[j]);
          } else {
            console.log("missing annotations for",entry.tags)
          }
        }
      }
      $("#annotations").append($div);
      $div.fadeIn("slow");
    }
  };
  let _buildBreadcrumbs = function() {
    let sectionTitle = "root";
    if (typeof(_currentSectionWorkingOn) !== "undefined") {
      sectionTitle = _getSectionBreadcrumbsByUid(_currentSectionWorkingOn.uid).join("->");
    }
    $("#breadcrumbs").html("");
    $("#breadcrumbs").append(_contentBuilder(
      {
        "dom": "p",
        "children": [
          {
            "dom": "small",
            "style": "line-height: 2rem;",
            "content": ["Working on: ", sectionTitle].join("")
          },
          {
            "dom": "br"
          },
          {
            "dom": "<a>",
            "attr": { "href": "#" },
            "content": "Clear breadcrumbs",
            "callback": {
              "args": "",
              "body": "ProjectManager.clearBreadcrumbs();"
            }
          }
        ]
      }
    ));
  }
  /**
   * Builds the design content displayed in the middle section.
   */
  let _buildContent = function() {
    $("#projectContent").html("");
    $("#projectContent").append(_contentBuilder({
      "dom": "div",
      "style": "height: 4.5rem;"
    }));
    function recursiveBuild(obj, level) {
      $("#projectContent").append(_contentBuilder({
        "dom": ["h", level].join(""),
        "content": obj.title,
        "attr": { "id": obj.uid }
      }));
      if (obj.hasOwnProperty("content") && obj.content.length > 0) {
        let content = obj.content;
        // does it match rules?
        let matches = content.match(/<p>/);
        if (matches !== null) {
          // console.log("html",obj.content);
          $("#projectContent").append(obj.content);
        } else {
          let split = content.split("\n");
          for (let j = 0, lj = split.length; j < lj; j++) {
            $("#projectContent").append(_contentBuilder({
              "dom": "p",
              "content": split[j]
            }));
          }
          // console.log("nohtml",split);
        }
      }
      for (let j = 0, lj = obj.children.length; j < lj; j++) {
        recursiveBuild(obj.children[j], level + 1);
      }
    }
    for (let i = 0, li = _project["Design Notes"].length; i < li; i++) {
      recursiveBuild(_project["Design Notes"][i], 1);
    }
  };
  let _buildPage = function() {
    $("#annotations").html("");
    _buildSidebar();
    _buildContent();
    if (_project["Design Notes"].length > 0) {
      // enable scrollspy
      $('#projectContent').scrollspy({ target: "#projectNav", method: "position" });
      // refresh scrollspy
      bootstrap.ScrollSpy.getInstance(document.getElementById('projectContent')).refresh();
      // remove listener
      $('#projectContent').off('activate.bs.scrollspy', _scrollSpyListener);
      // add listener
      $('#projectContent').on('activate.bs.scrollspy', _scrollSpyListener);
    }
  }
  /**
   * Builds the sidebar which include the assigned theme, current working section, and the navigation.
   */
  let _buildSidebar = function() {
    $("#projectNavContainer").html("");
    $("#theme").html("");
    $("#theme").append(_contentBuilder(
      {
        "dom": "<h6>",
        "content": ["Theme: ", _THEME_TITLES[_project.theme]].join("")
      }
    ));
    _buildBreadcrumbs();
    function recursiveBuild(arr, level, $container) {
      for (let i = 0, li = arr.length; i < li; i++) {
        let o = JSON.parse(JSON.stringify(_NAV_BRANCH));
        o.content = [];
        for (let j = level; j > 0; j--) {
          o.content.push("&nbsp;&nbsp;");
        }
        o.content.push(arr[i].title);
        o.content = o.content.join("");
        o.attr["data-uid"] = arr[i].uid;
        o.attr["href"] = ["#", arr[i].uid].join("");
        o.callback = { "args": "", "body": "ProjectManager.clickNavLink(arguments);" };
        if (typeof(_currentSectionWorkingOn) !== "undefined" && _currentSectionWorkingOn.uid === arr[i].uid) {
          o.class = [o.class, " active"].join("");
        }
        if (arr[i].hasOwnProperty("unitTestingPercentage")) {
          o.class = [o.class, " unit-testing"].join("");
          if (arr[i].unitTestingPercentage < 50) {
            o.class = [o.class, " low"].join("");
          } else if (arr[i].unitTestingPercentage < 80) {
            o.class = [o.class, " medium"].join("");
          } else {
            o.class = [o.class, " high"].join("");
          }
        }
        if (arr[i].hasOwnProperty("children") && arr[i].children.length > 0) {
          o.class = [o.class, " collapsed has-subs"].join("");
          o.attr["data-bs-toggle"] = "collapse";
          o.attr["data-bs-target"] = ["#", arr[i].uid, "-collapse"].join("");
        }
        $container.append(_contentBuilder(o));
        if (arr[i].hasOwnProperty("children") && arr[i].children.length > 0) {
          // section has children.
          let $div = _contentBuilder({
            dom: "div",
            attr: {
              id: [arr[i].uid, "-collapse"].join("")
            },
            class: "collapse"
          });
          $container.append($div);
          recursiveBuild(arr[i].children, level + 1, $div);
        }
      }
    }
    $("#projectNav").html("");
    //let $root = _contentBuilder(_NAV_ROOT);
    _recursiveSort(_project["Design Notes"]);
    recursiveBuild(_project["Design Notes"], 0, $("#projectNav"));
    //$("#projectNav").append($root);
  };
  /**
   * Utility to build html content from an object containing the DOM structure
   * @param {Object} parameterObject the DOM structure
   * @returns {jQuery}
   */
  let _contentBuilder = function(parameterObject) {
    if (!parameterObject.hasOwnProperty("dom")) {
      throw ["Missing DOM", parameterObject];
    }
    if (parameterObject.dom[0] !== "<") {
      parameterObject.dom = ["<", parameterObject.dom].join("");
    }
    if (parameterObject.dom[parameterObject.dom.length - 1] !== ">") {
      parameterObject.dom = [parameterObject.dom, ">"].join("");
    }
    let $el = $(parameterObject.dom);
    if (parameterObject.hasOwnProperty("class")) {
      $el.addClass(parameterObject.class);
    }
    if (parameterObject.hasOwnProperty("style")) {
      $el.attr("style", parameterObject.style);
    }
    if (parameterObject.hasOwnProperty("attr")) {
      for (let prop in parameterObject.attr) {
        $el.attr(prop, parameterObject.attr[prop]);
      }
    }
    if (parameterObject.hasOwnProperty("properties")) {
      for (let key in parameterObject.properties) {
        $el.prop(key, parameterObject.properties[key]);
      }
    }
    if (parameterObject.hasOwnProperty("content")) {
        $el.html(parameterObject.content);
    }
    if (parameterObject.hasOwnProperty("callback")) {
      let callback = JSON.parse(JSON.stringify(parameterObject.callback));
      if (Object.keys(callback).length > 0) {
        if (callback.hasOwnProperty("args") && callback.hasOwnProperty("body")) {
          callback = new Function(callback.args, callback.body);
          $el.on("click", callback);
        } else {
          for (let prop in callback) {
            callback = new Function(callback[prop].args, callback[prop].body);
            $el.on(prop, callback);
          }
        }
      } else {
        $el.on("click", callback);
      }
    }
    if (parameterObject.hasOwnProperty("children")) {
      for (let i = parameterObject.children.length - 1; i >= 0; i--) {
        $el.prepend(_contentBuilder(parameterObject.children[i]));
      }
    }
    return $el;
  };
  let _getSectionParent = function(uid) {
    function recursiveSearch(arr, uid) {
      let found;
      for (let i = arr.length - 1; i >= 0; i--) {
        let entry = arr[i];
        if (arr[i].hasOwnProperty("children")) {
          for (let j = entry.children.length - 1; j >= 0; j--) {
            if (entry.children[j].uid === uid) {
              found = entry;
              break;
            }
          }
          if (typeof(found) === "undefined") {
            // check among the entry's children's children
            found = recursiveSearch(entry.children, uid);
          }
        }
        if (typeof(found) !== "undefined") {
          // uid was found among the children
          break;
        }
        if (arr[i].hasOwnProperty("design")) {
          for (let j = entry.design.length - 1; j >= 0; j--) {
            if (entry.design[j].uid === uid) {
              found = entry;
              break;
            }
          }
          if (typeof(found) === "undefined") {
            // check among the entry's design's children
            found = recursiveSearch(entry.design, uid);
          }
        }
        if (typeof(found) !== "undefined") {
          // uid was found among the children
          break;
        }
      }
      return found;
    }
    return recursiveSearch(_project["Design Notes"], uid);
  }
  let _getSectionBreadcrumbsByUid = function(uid) {
    function recursiveSearch(arr, uid) {
      let breadcrumbs = [];
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].uid === uid) {
          breadcrumbs.push(arr[i].title);
          break;
        }
        if (arr[i].hasOwnProperty("children")) {
          let found = recursiveSearch(arr[i].children, uid);
          if (typeof(found) !== "undefined" && found.length > 0) {
            breadcrumbs.push(arr[i].title);
            breadcrumbs = breadcrumbs.concat(found);
            break;
          }
        }
        if (arr[i].hasOwnProperty("design")) {
          let found = recursiveSearch(arr[i].design, uid);
          if (typeof(found) !== "undefined" && found.length > 0) {
            breadcrumbs.push(arr[i].title);
            breadcrumbs = breadcrumbs.concat(found);
            break;
          }
        }
      }
      return breadcrumbs;
    }
    return recursiveSearch(_project["Design Notes"], uid);
  }
  let _recursiveSort = function(arr) {
    arr.sort(function(a, b) {
      let c = 0;
      if (a.order < b.order) {
        c = -1;
      } else if (a.order > b.order) {
        c = 1;
      }
      return c;
    });
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i].hasOwnProperty("children")) {
        _recursiveSort(arr[i].children)
      }
      if (arr[i].hasOwnProperty("design")) {
        _recursiveSort(arr[i].design)
      }
    }
  }
  let _saveProject = function() {
    _recursiveSort(_project["Design Notes"]);
    LibraryManager.updateProject(_project, function() {
      _buildPage();
    });
  };
  let _scrollSpyListener = function(e) {
    let section = ProjectManager.getEntryByUid(e.relatedTarget.substring(1));
    _buildAnnotations(section);
  }
  return {
    /** Gets the current section. */
    get currentSection() { return _currentSectionWorkingOn; },
    /** Gets the current project's theme. */
    get currentTheme() { return _project.theme; },
    get projectAppHandle() { return _project.appHandle; },
    get projectFileHandle() { return _project.fileHandle; },
    "addSection": function(data) {
      if (typeof(_currentSectionWorkingOn) !== "undefined") {
        _currentSectionWorkingOn.children.push(data);
      } else {
        _project["Design Notes"].push(data);
      }
      _saveProject();
    },
    "addDesign": function(data) {
      if (typeof(_currentSectionWorkingOn) !== "undefined") {
        _currentSectionWorkingOn.design.push(data);
      } else {
        throw "Cannot add a design entry to the root";
      }
      _saveProject();
    },
    "buildProject": function(promises, startAjax) {
      let endAjax = Date.now();
      let time = endAjax - startAjax;
      console.log("**buildProject** took " + time + "ms for initial promise to resolve", promises.length);
      for (let i = 0, l = promises.length; i < l; i++) {
        if (typeof promises[i] === "string" || promises[i] instanceof String) {
          // console.log("string")
        } else {
          _project = promises[i];
          console.log("project loaded",_project)
          // update nav brand
          $("#navBrand").html(_project.appName);
          $("#navBrand").removeClass("dropdown-toggle");
          
          // detach nav menu
          let $loadNav = $("#gameListMenu").detach();

          // remove everything after the brand
          $('#navBrandContainer').nextAll('li').remove();

          // update nav
          for (let i = _APPLICATION_MENU.length - 1; i >= 0; i--) {
            $("#navBrandContainer").after(_contentBuilder(_APPLICATION_MENU[i]));
          }
          $("#loadMenu").append($loadNav);

          // require theme
          if (_project.theme.length === 0) {
            FormManager.displayChangeThemeForm();
          } else {
            _buildPage();
          }
        }
      }
    },
    "clearBreadcrumbs": function() {
      _currentSectionWorkingOn = undefined;
      // de-activate Edit links
      $("#editSectionLink").addClass("disabled");
      $("#deleteSectionLink").addClass("disabled");
      $("#addDesignLink").addClass("disabled");
      $("#addDesignNotesLink").addClass("disabled");
      $("#addTestingNotesLink").addClass("disabled");
      $("#addNextStepsNotesLink").addClass("disabled");
      _buildBreadcrumbs();
    },
    "clickNavLink": function() {
      let $a = $(arguments[0][0].target);
      $(".nav-link").each(function() {
        $(this).removeClass('active'); 
      });
      $a.addClass("active");
      _currentSectionWorkingOn = ProjectManager.getEntryByUid($a.attr("data-uid"));
      _buildBreadcrumbs();
      // activate Edit links
      $("#editSectionLink").removeClass("disabled");
      $("#deleteSectionLink").removeClass("disabled");
      $("#addDesignLink").removeClass("disabled");
      $("#addDesignNotesLink").removeClass("disabled");
      $("#addTestingNotesLink").removeClass("disabled");
      $("#addNextStepsNotesLink").removeClass("disabled");
    },
    "deleteDesignEntry": function(uid) {
      let designParent = _getSectionParent(uid);
      for (let i = designParent.design.length - 1; i >= 0; i--) {
        if (designParent.design[i].uid === uid) {
          designParent.design.splice(i, 1);
          break;
        }
      }
      _saveProject();
    },
    "updateDesignEntry": function(data) {
      let designParent = _getSectionParent(data.uid);
      for (let i = designParent.design.length - 1; i >= 0; i--) {
        if (designParent.design[i].uid === data.uid) {
          designParent.design.splice(i, 1, data);
          break;
        }
      }
      _saveProject();
    },
    "deleteSection": function(data) {
      if (typeof(_currentSectionWorkingOn) !== "undefined") {
        // find parent
        let parent = _getSectionParent(_currentSectionWorkingOn.uid);
        let parentChildren;
        if (typeof(parent) === "undefined") {
          // parent is root.
          parentChildren = _project["Design Notes"];
          parent = _project["Design Notes"];
        } else {
          parentChildren = parent.children;
        }
        for (let i = parentChildren.length - 1; i >= 0; i--) {
          if (parentChildren[i].uid === _currentSectionWorkingOn.uid) {
            parentChildren.splice(i, 1);
          }
        }
      } else {
        throw ("Cannot delete when no section is being worked on");
      }
      _currentSectionWorkingOn = undefined;
      _saveProject();
    },
    "editSection": function(data) {
      if (typeof(_currentSectionWorkingOn) !== "undefined") {
        _currentSectionWorkingOn.title = data.title;
        _currentSectionWorkingOn.order = data.order;
        _currentSectionWorkingOn.content = data.content;
      } else {
        throw ("Cannot edit when no section is being worked on");
      }
      _saveProject();
    },
    "generatePhaserCode": function() {
      LibraryManager.generatePhaserProject(_project);
    },
    "getClasses": function() {
      let classes = [];
      function recursiveSearch(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
          let entry = arr[i];
          if (entry.hasOwnProperty("tags") && entry.tags.includes("class")) {
            classes.push(entry);
          }
          if (entry.hasOwnProperty("children")) {
            recursiveSearch(entry.children);
          }
          if (entry.hasOwnProperty("design")) {
            recursiveSearch(entry.design);
          }
        }
      }
      recursiveSearch(_project["Design Notes"]);
      return classes;
    },
    "getEntryByUid": function(uid) {
      function recursiveSearch(arr, uid) {
        let found;
        for (let i = arr.length - 1; i >= 0; i--) {
          if (arr[i].uid === uid) {
            found = arr[i];
            break;
          }
          if (arr[i].hasOwnProperty("children")) {
            found = recursiveSearch(arr[i].children, uid);
            if (typeof(found) !== "undefined") {
              break;
            }
          }
          if (arr[i].hasOwnProperty("design")) {
            found = recursiveSearch(arr[i].design, uid);
            if (typeof(found) !== "undefined") {
              break;
            }
          }
        }
        return found;
      }
      return recursiveSearch(_project["Design Notes"], uid);
    },
    "updateTheme": function(val) {
      if (_project.theme !== val) {
        _project.theme = val;
        _saveProject();
      }
    }
  }
} ());