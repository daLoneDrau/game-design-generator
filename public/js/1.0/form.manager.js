

/**
 * Builds 
 * @param {Object} parameterObject the DOM structure
 * @returns 
 */
const CONTENT_BUILDER = function(parameterObject) {
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
      $el.prepend(CONTENT_BUILDER(parameterObject.children[i]));
    }
  }
  return $el;
}
/**
 * @class Manager class for displaying different input forms via the modal.
 */
const FormManager = (function() {
  /** @private template for displaying the ADD SCENE form. */
  const _ADD_CODE_INJECTION = [
    {
      dom: "<div>",
      class: "modal-header",
      children: [
        {
          dom: "<h5>",
          class: "modal-title",
          content: "New Code Injection"
        }    
      ]
    },
    {
      dom: "<form>",
      callback: {
        "submit": {
          args: "",
          body: "FormManager.submitAddCodeInjectionForm(arguments);"
        }
      },
      children: [
        {
          dom: "<div>",
          class: "modal-body",
          children: [
            {
              comment: "CLASS LISTING",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classListing"
                  },
                  content: "Class"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "classListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ],
                  callback: {
                    "change": {
                      args: "",
                      body: "FormListener.selectCodeInjectionClass(arguments);"
                    }
                  }
                }
              ]
            },
            {
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "injectionListing"
                  },
                  content: "Code Type"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "injectionListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ],
                  callback: {
                    "change": {
                      args: "",
                      body: "FormListener.selectCodeInjectionType(arguments);"
                    }
                  }
                }
              ]
            },
            {
              dom: "div",
              attr: { id: "codeTypeContainer" }
            },
            {
              dom: "<div>",
              class: "modal-footer",
              children: [
                {
                  dom: "<button>",
                  class: "btn btn-secondary",
                  attr: {
                    type: "button"
                  },
                  content: "Cancel",
                  callback: {
                    args: "",
                    body: "$(\"#mainModal\").hide();"
                  }
                },
                {
                  dom: "<button>",
                  class: "btn btn-primary",
                  attr: {
                    type: "submit"
                  },
                  content: "Submit"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  /** @private template for displaying the ADD DESIGN form. */
  const _ADD_DESIGN = [
    {
      dom: "<div>",
      class: "modal-header",
      children: [
        {
          dom: "<h5>",
          class: "modal-title",
          content: "Add Design"
        }    
      ]
    },
    {
      dom: "<form>",
      callback: {
        "submit": {
          args: "",
          body: "FormManager.displayDesignSubForm(arguments);"
        }
      },
      children: [
        {
          dom: "<div>",
          class: "modal-body",
          children: [
            {
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "designType"
                  },
                  content: "Design"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "designSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "class"
                      },
                      content: "New Class"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "code-injection"
                      },
                      content: "Code Injection"
                    }
                  ]
                }
              ]
            },
            {
              dom: "<div>",
              class: "modal-footer",
              children: [
                {
                  dom: "<button>",
                  class: "btn btn-secondary",
                  attr: {
                    type: "button"
                  },
                  content: "Cancel",
                  callback: {
                    args: "",
                    body: "$(\"#mainModal\").hide();"
                  }
                },
                {
                  dom: "<button>",
                  class: "btn btn-primary",
                  attr: {
                    type: "submit"
                  },
                  content: "Submit"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  /** @private template for displaying the ADD PROJECT form. */
  const ADD_PROJECT = [
    {
      dom: "<div>",
      class: "modal-header",
      children: [
        {
          dom: "<h5>",
          class: "modal-title",
          content: "New Project"
        }    
      ]
    },
    {
      dom: "<form>",
      callback: {
        "submit": {
          args: "",
          body: "FormManager.submitAddProjectForm(arguments);"
        }
      },
      children: [
        {
          dom: "<div>",
          class: "modal-body",
          children: [
            {
              "comment": "PROJECT TITLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "gameTitleEntry"
                  },
                  content: "RPG Title"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "gameTitleEntry",
                    placeholder: "Enter Game Title"
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#namespaceEntry\").val($(\"#gameTitleEntry\").val().toLowerCase().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#appHandleEntry\").val($(\"#gameTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
                    }
                  }
                },
                {
                  dom: "<small>",
                  class: "form-text text-muted",
                  attr: {
                    id: "titleHelp"
                  },
                  content: "What are we playing?"
                }
              ]
            },
            {
              "comment": "PROJECT NAMESPACE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "namespaceEntry"
                  },
                  content: "Namespace"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "namespaceEntry",
                    placeholder: "Namespace",
                    "readonly": "readonly"
                  }
                }
              ]
            },
            {
              "comment": "PROJECT CLASS HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "appHandleEntry"
                  },
                  content: "Application Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "appHandleEntry",
                    placeholder: "App Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            },
            {
              "comment": "THEME OPTIONS",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "projectTheme"
                  },
                  content: "Theme"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "themeSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "amiga"
                      },
                      content: "Amiga Workbench"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "c64"
                      },
                      content: "Commodore 64"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "hypercard"
                      },
                      content: "Macintosh Hypercard"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "nes"
                      },
                      content: "Nintendo Entertainment System"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "rpgui"
                      },
                      content: "RPG-UI"
                    }
                  ]
                }
              ]
            },
            {
              "comment": "APPLICATION DIMENSIONS",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "projectDimensions"
                  },
                  content: "Size"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "dimensionSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "value": "[1024,768]",
                        "selected": true
                      },
                      content: "1024x768"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "[800,600]"
                      },
                      content: "800x600"
                    }
                  ]
                }
              ]
            },
            {
              "comment": "LIBRARY FILES",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  content: "Library Files"
                },
                {
                  dom: "div",
                  class: "container",
                  children: [
                    {
                      dom: "div",
                      class: "row",
                      children: [
                        {
                          dom: "div",
                          class: "col-6",
                          children: [
                            {
                              dom: "div",
                              class: "form-check",
                              children: [
                                {
                                  dom: "input",
                                  class: "form-check-input",
                                  attr: {
                                    type: "checkbox",
                                    value: "",
                                    id: "appConstantsCheckbox"
                                  }
                                },
                                {
                                  dom: "label",
                                  class: "form-check-label",
                                  attr: {
                                    for: "appConstantsCheckbox"
                                  },
                                  content: "Application Constants"
                                }
                              ]
                            },
                            {
                              dom: "div",
                              class: "form-check",
                              children: [
                                {
                                  dom: "input",
                                  class: "form-check-input",
                                  attr: {
                                    type: "checkbox",
                                    value: "",
                                    id: "appConfigCheckbox"
                                  }
                                },
                                {
                                  dom: "label",
                                  class: "form-check-label",
                                  attr: {
                                    for: "appConfigCheckbox"
                                  },
                                  content: "Application Configuration"
                                }
                              ]
                            }                    
                          ]
                        },
                        {
                          dom: "div",
                          class: "col-6",
                          children: [
                            {
                              dom: "div",
                              class: "form-check",
                              children: [
                                {
                                  dom: "input",
                                  class: "form-check-input",
                                  attr: {
                                    type: "checkbox",
                                    value: "",
                                    id: "gameCheckbox"
                                  }
                                },
                                {
                                  dom: "label",
                                  class: "form-check-label",
                                  attr: {
                                    for: "gameCheckbox"
                                  },
                                  content: "Game"
                                }
                              ]
                            },
                            {
                              dom: "div",
                              class: "form-check",
                              children: [
                                {
                                  dom: "input",
                                  class: "form-check-input",
                                  attr: {
                                    type: "checkbox",
                                    value: "",
                                    id: "sceneControllerCheckbox"
                                  }
                                },
                                {
                                  dom: "label",
                                  class: "form-check-label",
                                  attr: {
                                    for: "sceneControllerCheckbox"
                                  },
                                  content: "Scene Controller"
                                }
                              ]
                            }  
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              dom: "<div>",
              class: "modal-footer",
              children: [
                {
                  dom: "<button>",
                  class: "btn btn-secondary",
                  attr: {
                    type: "button"
                  },
                  content: "Cancel",
                  callback: {
                    args: "",
                    body: "$(\"#mainModal\").hide();"
                  }
                },
                {
                  dom: "<button>",
                  class: "btn btn-primary",
                  attr: {
                    type: "submit"
                  },
                  content: "Submit"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  /** @private template for displaying the ADD CLASS form. */
  const _ADD_CLASS = [
    {
      dom: "div",
      class: "modal-header",
      children: [
        {
          dom: "h5",
          class: "modal-title",
          content: "New Class"
        }    
      ]
    },
    {
      dom: "form",
      callback: {
        "submit": {
          args: "",
          body: "FormManager.submitAddClassForm(arguments);"
        }
      },
      children: [
        {
          dom: "div",
          class: "modal-body",
          children: [
            {
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "label",
                  attr: {
                    for: "templateSelect"
                  },
                  content: "Template"
                },
                {
                  dom: "select",
                  class: "form-select",
                  attr: { id: "templateSelect" },
                  children: [
                    {
                      dom: "option",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "singleton"
                      },
                      content: "Singleton"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "prototype"
                      },
                      content: "Prototype"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "scene-container"
                      },
                      content: "Scene Container"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "ui-scene"
                      },
                      content: "UI Scene Prototype"
                    }
                  ],
                  callback: {
                    change: {
                      args: "",
                      body: "FormListener.selectClassTemplate(arguments);"
                    }
                  }
                }
              ]
            },
            {
              comment: "PROTOTYPE NAMESPACE",
              dom: "div",
              class: "form-group",
              style: "display: none;",
              attr: { id: "prototypePathGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "prototypePathSelect"
                  },
                  content: "Path"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "prototypePathSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "bus"
                      },
                      content: "bus"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "graph"
                      },
                      content: "graph"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "ui"
                      },
                      content: "ui"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "custom"
                      },
                      content: "custom path"
                    }
                  ],
                  callback: {
                    change: {
                      args: "",
                      body: "FormListener.selectPrototypePath(arguments);"
                    }
                  }
                },
                {
                  dom: "input",
                  class: "form-control",
                  style: "display: none;",
                  attr: {
                    type: "text",
                    id: "prototypePathEntry",
                    placeholder: "Enter Class Path"
                  }
                }
              ]
            },
            {
              dom: "<div>",
              class: "form-group",
              style: "display: none;",
              attr: { id: "singletonPathGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "singletonPathSelect"
                  },
                  content: "Path"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "singletonPathSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "graph"
                      },
                      content: "graph"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "services"
                      },
                      content: "services"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "ui"
                      },
                      content: "ui"
                    }
                  ]
                }
              ]
            },
            {
              comment: "GRID WIDTH",
              dom: "div",
              class: "form-group",
              attr: { id: "gridWidthGroup" },
              style: "display: none;",
              children: [
                {
                  dom: "label",
                  attr: {
                    for: "gridWidthEntry"
                  },
                  content: "Alignment Grid Width"
                },
                {
                  dom: "input",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "gridWidthEntry",
                    placeholder: "1"
                  }
                }
              ]
            },
            {
              comment: "GRID HEIGHT",
              dom: "div",
              class: "form-group",
              attr: { id: "gridHeightGroup" },
              style: "display: none;",
              children: [
                {
                  dom: "label",
                  attr: {
                    for: "gridHeightEntry"
                  },
                  content: "Alignment Grid Height"
                },
                {
                  dom: "input",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "gridHeightEntry",
                    placeholder: "1"
                  }
                }
              ]
            },
            {
              comment: "SCENE CONTAINER LISTING",
              dom: "<div>",
              class: "form-group",
              attr: { id: "sceneContainerGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sceneContainerListing"
                  },
                  content: "Scene Container"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "sceneContainerListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ],
                  callback: {
                    change: {
                      args: "",
                      body: "FormListener.selectSceneContainer(arguments);"
                    }
                  }
                }
              ]
            },
            {
              comment: "CLASS TITLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionTitleEntry"
                  },
                  content: "Class Title"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionTitleEntry",
                    placeholder: "Enter Class Title"
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#classNameEntry\").val($(\"#sectionTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#sectionTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
                    }
                  }
                }
              ]
            },
            {
              comment: "CLASS HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classNameEntry"
                  },
                  content: "Class Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classNameEntry",
                    placeholder: "Class Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            },
            {
              comment: "FILE HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classFilenameEntry"
                  },
                  content: "File Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classFilenameEntry",
                    placeholder: "File Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            },
            {
              comment: "DESCRIPTION",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionContentEntry"
                  },
                  content: "Description"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 5,
                    id: "sectionContentEntry",
                    placeholder: "Enter Description Here"
                  }
                }
              ]
            },
            {
              comment: "WEIGHT",
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "weightEntry"
                  },
                  content: "Loading Weight (Default is 1)"
                },
                {
                  dom: "input",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "weightEntry",
                    placeholder: "1"
                  }
                }
              ]
            },
            {
              dom: "<div>",
              class: "modal-footer",
              children: [
                {
                  dom: "<button>",
                  class: "btn btn-secondary",
                  attr: {
                    type: "button"
                  },
                  content: "Cancel",
                  callback: {
                    args: "",
                    body: "$(\"#mainModal\").hide();"
                  }
                },
                {
                  dom: "<button>",
                  class: "btn btn-primary",
                  attr: {
                    type: "submit"
                  },
                  content: "Submit"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  /** @private template for displaying the ADD SECTION form. */
  const _ADD_SECTION = [
    {
      dom: "<div>",
      class: "modal-header",
      children: [
        {
          dom: "<h5>",
          class: "modal-title",
          content: "New Section"
        }    
      ]
    },
    {
      dom: "<form>",
      callback: {
        submit: {
          args: "",
          body: "FormManager.submitAddSectionForm(arguments);"
        }
      },
      children: [
        {
          dom: "div",
          class: "modal-body",
          children: [
            {
              comment: "SECTION TITLE",
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionTitleEntry"
                  },
                  content: "Title"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionTitleEntry",
                    placeholder: "Enter Section Title"
                  }
                }
              ]
            },
            {
              comment: "SECTION ORDER",
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionOrderEntry"
                  },
                  content: "Order"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionOrderEntry",
                    placeholder: "1, 2, 3. . ."
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
                    }
                  }
                }
              ]
            },
            {
              comment: "SECTION CONTENT",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionContentEntry"
                  },
                  content: "Content"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 5,
                    id: "sectionContentEntry",
                    placeholder: "Enter Content Here"
                  }
                }
              ]
            },
            {
              comment: "DESIGN SECTION TEMPLATE",
              dom: "div",
              class: "form-group",
              attr: { id: "designSectionTemplateGroup" },
              children: [
                {
                  dom: "label",
                  attr: {
                    for: "designSectionTemplateSelect"
                  },
                  content: "Design Section Template"
                },
                {
                  dom: "select",
                  class: "form-select",
                  attr: { id: "designSectionTemplateSelect" },
                  children: [
                    {
                      dom: "option",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "prototype"
                      },
                      content: "Prototype Class"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "singleton"
                      },
                      content: "Singleton Class"
                    },
                    {
                      dom: "option",
                      attr: {
                        "data-divider": true
                      },
                      content: ""
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "scene-container"
                      },
                      content: "Scene Container Design Template"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "ui-scene"
                      },
                      content: "UI Scene Design Template"
                    },
                    {
                      dom: "option",
                      attr: {
                        "data-divider": true
                      },
                      content: ""
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "private field"
                      },
                      content: "Private Field Design Template"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "public member"
                      },
                      content: "Public Member Design Template"
                    },
                    {
                      dom: "option",
                      attr: {
                        "data-divider": true
                      },
                      content: ""
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "key listener handler"
                      },
                      content: "UI Scene Key Listener Handler"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "view template"
                      },
                      content: "UI Scene View Template"
                    },
                    {
                      dom: "option",
                      attr: {
                        "data-divider": true
                      },
                      content: ""
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "prototype test"
                      },
                      content: "Prototype Test Class"
                    },
                    {
                      dom: "option",
                      attr: {
                        "value": "ui-scene test"
                      },
                      content: "UI Scene Test Class"
                    },
                    {
                      dom: "option",
                      attr: {
                        "data-divider": true
                      },
                      content: ""
                    },
                    {
                      dom: "option",
                      attr: {
                        value: "unit test"
                      },
                      content: "Unit Test"
                    },
                    {
                      dom: "option",
                      attr: {
                        value: "unit test each"
                      },
                      content: "Unit Test Each"
                    }
                  ]
                }
              ],
              callback: {
                change: {
                  args: "",
                  body: "FormListener.selectDesignTemplate(arguments);"
                }
              }
            },
            {
              comment: "DESIGN SECTION TEMPLATE FORM",
              dom: "div",
              attr: { id: "designSectionTemplateForm" },
              children: []
            },
            {
              dom: "<div>",
              class: "modal-footer",
              children: [
                {
                  dom: "<button>",
                  class: "btn btn-secondary",
                  attr: {
                    type: "button"
                  },
                  content: "Cancel",
                  callback: {
                    args: "",
                    body: "$(\"#mainModal\").hide();"
                  }
                },
                {
                  dom: "<button>",
                  class: "btn btn-primary",
                  attr: {
                    type: "submit"
                  },
                  content: "Submit"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  /** @private template for displaying the CHANGE THEME form. */
  const _CHANGE_THEME = [
    {
      dom: "<div>",
      class: "modal-header",
      children: [
        {
          dom: "<h5>",
          class: "modal-title",
          content: "Change Theme"
        }    
      ]
    },
    {
      dom: "<form>",
      callback: {
        "submit": {
          args: "",
          body: "FormManager.submitChangeThemeForm(arguments);"
        }
      },
      children: [
        {
          dom: "<div>",
          class: "modal-body",
          children: [
            {
              "comment": "THEME OPTIONS",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "projectTheme"
                  },
                  content: "Theme"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "themeSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "amiga"
                      },
                      content: "Amiga Workbench"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "c64"
                      },
                      content: "Commodore 64"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "hypercard"
                      },
                      content: "Macintosh Hypercard"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "nes"
                      },
                      content: "Nintendo Entertainment System"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "rpgui"
                      },
                      content: "RPG-UI"
                    }
                  ]
                }
              ]
            },
            {
              dom: "<div>",
              class: "modal-footer",
              children: [
                {
                  dom: "<button>",
                  class: "btn btn-secondary",
                  attr: {
                    type: "button"
                  },
                  content: "Cancel",
                  callback: {
                    args: "",
                    body: "$(\"#mainModal\").hide();"
                  }
                },
                {
                  dom: "<button>",
                  class: "btn btn-primary",
                  attr: {
                    type: "submit"
                  },
                  content: "Submit"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  /** @private template for displaying the EDIT DESIGN form. */
  const _EDIT_DESIGN = [
    {
      dom: "<div>",
      class: "modal-header",
      children: [
        {
          dom: "<h5>",
          class: "modal-title",
          content: "Edit Design"
        },
        {
          comment: "HIDDEN TAG",
          dom: "input",
          attr: {
            type: "hidden",
            id: "hiddenTag"
          }
        }
      ]
    },
    {
      dom: "<form>",
      callback: {
        "submit": {
          args: "",
          body: "FormManager.submitEditDesignForm(arguments);"
        }
      },
      children: [
        {
          dom: "<div>",
          class: "modal-body",
          children: [
            {
              dom: "div",
              attr: { id: "codeTypeContainer" }
            },
            {
              dom: "input",
              attr: {
                type: "hidden",
                id: "designUid"
              }
            }
          ]
        },
        {
          dom: "<div>",
          class: "modal-footer",
          children: [
            {
              dom: "<button>",
              class: "btn btn-secondary",
              attr: {
                type: "button"
              },
              content: "Cancel",
              callback: {
                args: "",
                body: "$(\"#mainModal\").hide();"
              }
            },
            {
              dom: "<button>",
              class: "btn btn-primary",
              attr: {
                type: "submit"
              },
              content: "Submit"
            }
          ]
        }
      ]
    }
  ];
  /** @private template for displaying the EDIT SECTION form. */
  const _EDIT_SECTION = [
    {
      dom: "<div>",
      class: "modal-header",
      children: [
        {
          dom: "<h5>",
          class: "modal-title",
          content: "Edit Section"
        }    
      ]
    },
    {
      dom: "<form>",
      callback: {
        "submit": {
          args: "",
          body: "FormManager.submitEditSectionForm(arguments);"
        }
      },
      children: [
        {
          dom: "<div>",
          class: "modal-body",
          children: [
            {
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionTitleEntry"
                  },
                  content: "Title"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionTitleEntry",
                    placeholder: "Enter Section Title"
                  }
                }
              ]
            },
            {
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionOrderEntry"
                  },
                  content: "Order"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionOrderEntry",
                    placeholder: "1, 2, 3. . ."
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
                    }
                  }
                }
              ]
            },
            {
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionContentEntry"
                  },
                  content: "Content"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 5,
                    id: "sectionContentEntry",
                    placeholder: "Enter Content Here"
                  }
                }
              ]
            },
            {
              dom: "<div>",
              class: "modal-footer",
              children: [
                {
                  dom: "<button>",
                  class: "btn btn-secondary",
                  attr: {
                    type: "button"
                  },
                  content: "Cancel",
                  callback: {
                    args: "",
                    body: "$(\"#mainModal\").hide();"
                  }
                },
                {
                  dom: "<button>",
                  class: "btn btn-primary",
                  attr: {
                    type: "submit"
                  },
                  content: "Submit"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
  const _EDIT_DESIGN_FORMS = {
    "constructor body": function(designEntry) {
      $("#hiddenTag").val("constructor body");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Constructor Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#sectionContentEntry").val(designEntry.code);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    inheritance: function(designEntry) {
      $("#hiddenTag").val("inheritance");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "classInheritanceNameEntry"
            },
            content: "Class Inherits From Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "classInheritanceNameEntry",
              placeholder: "Enter Class Name"
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#classInheritanceNameEntry").val(designEntry.classInheritance);
    },
    "key listener handler": function(designEntry) {
      $("#hiddenTag").val("key listener handler");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "LISTENER KEY",
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "keyEntry"
            },
            content: "Listener Key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "keyEntry",
              placeholder: "Enter Listener Key"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "KEY LISTENER HANDLER",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "keyListenerCodeEntry"
            },
            content: "Key Listener Handler"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "keyListenerCodeEntry",
              placeholder: "Enter Key Listener Handler"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "ORDER",
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#keyEntry").val(designEntry.entryKey);
      $("#keyListenerCodeEntry").val(designEntry.code);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "private field": function(designEntry) {
      $("#hiddenTag").val("private field");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "fieldNameEntry"
            },
            content: "Field Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "fieldNameEntry"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#fieldNameEntry\").val($(\"#fieldNameEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "fieldTypeEntry"
            },
            content: "Field Type"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "fieldTypeEntry"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "fieldValueEntry"
            },
            content: "Initial Field Value"
          },
          {
            dom: "textarea",
            class: "form-control",
            attr: {
              rows: "10",
              id: "fieldValueEntry"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Field Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#fieldNameEntry").val(designEntry.fieldName);
      $("#fieldTypeEntry").val(designEntry.fieldType);
      $("#fieldValueEntry").val(designEntry.fieldValue);
      $("#sectionContentEntry").val(designEntry.fieldDefinition);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "public member": function(designEntry) {
      $("#hiddenTag").val("public member");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "memberNameEntry"
            },
            content: "Member Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "memberNameEntry",
              placeholder: "Enter Member Name"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "memberDefinitionEntry"
            },
            content: "Member Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "memberDefinitionEntry",
              placeholder: "Enter Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "memberArgsEntry"
            },
            content: "Member Arguments"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              id: "memberArgsEntry",
              placeholder: "Enter Arguments Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Member Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#memberNameEntry").val(designEntry.memberName);
      $("#memberDefinitionEntry").val(designEntry.memberDefinition);
      $("#memberArgsEntry").val(designEntry.arguments);
      $("#sectionContentEntry").val(designEntry.code);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "public setter property": function(designEntry) {
      $("#hiddenTag").val("public setter property");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "propertyNameEntry"
            },
            content: "Property Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "propertyNameEntry",
              placeholder: "Enter Property Name"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "setterDefinitionEntry"
            },
            content: "Setter Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "setterDefinitionEntry",
              placeholder: "Enter Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Setter Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#propertyNameEntry").val(designEntry.propertyName);
      $("#setterDefinitionEntry").val(designEntry.setterDefinition);
      $("#sectionContentEntry").val(designEntry.setterBody);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    prototype: function(designEntry) {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PACKAGE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "prototypePathSelect"
            },
            content: "Package"
          },
          {
            dom: "select",
            class: "form-select",
            attr: {
              id: "prototypePathSelect"
            },
            children: [
              {
                dom: "option",
                attr: {
                  id: "bus"
                },
                content: "bus"
              },
              {
                dom: "option",
                attr: {
                  id: "graph"
                },
                content: "graph"
              },
              {
                dom: "option",
                attr: {
                  id: "ui"
                },
                content: "ui"
              }
            ]
          }
        ]
      }));
      $("#prototypePathSelect").val(designEntry.filePath);
      $("#hiddenTag").val("prototype");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS TITLE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "sectionTitleEntry"
            },
            content: "Class Title"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionTitleEntry",
              placeholder: designEntry.classTitle
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#classNameEntry\").val($(\"#sectionTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#sectionTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS HANDLE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "classNameEntry"
            },
            content: "Class Handle"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "classNameEntry",
              placeholder: designEntry.classHandle,
              readonly: "readonly"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS FILE NAME",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "classFilenameEntry"
            },
            content: "File Handle"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "classFilenameEntry",
              placeholder: designEntry.fileHandle,
              readonly: "readonly"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS DESCRIPTION",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Description"
          },
          {
            dom: "textarea",
            class: "form-control",
            attr: {
              rows: 5,
              id: "sectionContentEntry",
              placeholder: designEntry.classDefinition
            }
          }
        ]
      }));
      $("#sectionTitleEntry").val(designEntry.classTitle);
      $("#classNameEntry").val(designEntry.classHandle);
      $("#classFilenameEntry").val(designEntry.fileHandle);
      $("#sectionContentEntry").val(designEntry.classDefinition);
    },
    scene: function(designEntry) {
      $("#hiddenTag").val("scene");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS TITLE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "sectionTitleEntry"
            },
            content: "Class Title"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionTitleEntry",
              placeholder: designEntry.classTitle
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#classNameEntry\").val($(\"#sectionTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#sectionTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS HANDLE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "classNameEntry"
            },
            content: "Class Handle"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "classNameEntry",
              placeholder: designEntry.classHandle,
              readonly: "readonly"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS FILE NAME",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "classFilenameEntry"
            },
            content: "File Handle"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "classFilenameEntry",
              placeholder: designEntry.fileHandle,
              readonly: "readonly"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS DESCRIPTION",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Description"
          },
          {
            dom: "textarea",
            class: "form-control",
            attr: {
              rows: 5,
              id: "sectionContentEntry",
              placeholder: designEntry.classDefinition
            }
          }
        ]
      }));
      $("#sectionTitleEntry").val(designEntry.classTitle);
      $("#classNameEntry").val(designEntry.classHandle);
      $("#classFilenameEntry").val(designEntry.fileHandle);
      $("#sectionContentEntry").val(designEntry.classDefinition);
    },
    "required import": function(designEntry) {
      $("#hiddenTag").val("required import");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [          
          {
            dom: "<label>",
            attr: {
              for: "sceneKeyEntry"
            },
            content: "Scene key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sceneKeyEntry",
              value: designEntry.sceneKey
            }
          },
          {
            dom: "<label>",
            attr: {
              for: "sceneValueEntry"
            },
            content: "Scene Value"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sceneValueEntry",
              value: designEntry.sceneValue
            }
          },
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#sectionContentEntry").val(designEntry.setterBody);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "scene group": function(designEntry) {
      $("#hiddenTag").val("scene group");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [          
          {
            dom: "<label>",
            attr: {
              for: "sceneKeyEntry"
            },
            content: "Scene key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sceneKeyEntry",
              value: designEntry.sceneKey
            }
          },
          {
            dom: "<label>",
            attr: {
              for: "sceneValueEntry"
            },
            content: "Scene Value"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sceneValueEntry",
              value: designEntry.sceneValue
            }
          },
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#sectionContentEntry").val(designEntry.setterBody);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "method extensions": function(designEntry, tag) {
      $("#hiddenTag").val(tag);
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#sectionContentEntry").val(designEntry.code);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "scoped dictionary body": function(designEntry, tag) {
      $("#hiddenTag").val(tag);
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryKeyEntry"
            },
            content: "Dictionary Key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "dictionaryKeyEntry",
              placeholder: "Enter Dictionary Key"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryDefinitionEntry"
            },
            content: "Key Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "dictionaryDefinitionEntry",
              placeholder: "Enter Key Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Dictionary Value"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "sectionContentEntry",
              placeholder: "Enter Dictionary Value Here"
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#dictionaryKeyEntry").val(designEntry.dictionaryKey);
      $("#dictionaryDefinitionEntry").val(designEntry.dictionaryDefinition);
      $("#sectionContentEntry").val(designEntry.dictionaryValue);
    },
    singleton: function(designEntry) {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PACKAGE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "singletonPathSelect"
            },
            content: "Package"
          },
          {
            dom: "select",
            class: "form-select",
            attr: {
              id: "singletonPathSelect"
            },
            children: [
              {
                dom: "option",
                attr: {
                  id: "graph"
                },
                content: "graph"
              },
              {
                dom: "option",
                attr: {
                  id: "services"
                },
                content: "services"
              },
              {
                dom: "option",
                attr: {
                  id: "ui"
                },
                content: "ui"
              }
            ]
          }
        ]
      }));
      $("#singletonPathSelect").val(designEntry.filePath);
      $("#hiddenTag").val("singleton");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS TITLE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "sectionTitleEntry"
            },
            content: "Class Title"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionTitleEntry",
              placeholder: designEntry.classTitle
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#classNameEntry\").val($(\"#sectionTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#sectionTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS HANDLE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "classNameEntry"
            },
            content: "Class Handle"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "classNameEntry",
              placeholder: designEntry.classHandle,
              readonly: "readonly"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS FILE NAME",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "classFilenameEntry"
            },
            content: "File Handle"
          },
          {
            dom: "input",
            class: "form-control",
            attr: {
              type: "text",
              id: "classFilenameEntry",
              placeholder: designEntry.fileHandle,
              readonly: "readonly"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "CLASS DESCRIPTION",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "label",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Description"
          },
          {
            dom: "textarea",
            class: "form-control",
            attr: {
              rows: 5,
              id: "sectionContentEntry",
              placeholder: designEntry.classDefinition
            }
          }
        ]
      }));
      $("#sectionTitleEntry").val(designEntry.classTitle);
      $("#classNameEntry").val(designEntry.classHandle);
      $("#classFilenameEntry").val(designEntry.fileHandle);
      $("#sectionContentEntry").val(designEntry.classDefinition);
    },
    "start scene": function(designEntry) {
      $("#hiddenTag").val("start scene");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Start Scene Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#sectionContentEntry").val(designEntry.code);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "unit test": function(designEntry) {
      $("#hiddenTag").val("unit test");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "testHeaderEntry"
            },
            content: "Test Header"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "testHeaderEntry",
              placeholder: "Enter Test Header"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "testDefinitionEntry"
            },
            content: "Test Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "testDefinitionEntry",
              placeholder: "Enter Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "memberArgsEntry"
            },
            content: "Member Arguments"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              id: "memberArgsEntry",
              placeholder: "Enter Arguments Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Test Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#testHeaderEntry").val(designEntry.testHeader);
      $("#testDefinitionEntry").val(designEntry.testDefinition);
      $("#memberArgsEntry").val(designEntry.arguments);
      $("#sectionContentEntry").val(designEntry.code);
      $("#sectionOrderEntry").val(designEntry.order);
    },
    "view template": function(designEntry) {
      $("#hiddenTag").val("view template");
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "PARENT CLASS",
        dom: "input",
        attr: {
          type: "hidden",
          id: "classUid"
        }
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "VIEW KEY",
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "keyEntry"
            },
            content: "View Key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "keyEntry",
              placeholder: "MY_VIEW_STATE"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "TEMPLATE CODE",
        dom: "div",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "viewCodeEntry"
            },
            content: "View Template"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "viewCodeEntry",
              placeholder: "View Template"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        comment: "ORDER",
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
      $("#classUid").val(designEntry.classUid);
      $("#keyEntry").val(designEntry.entryKey);
      $("#viewCodeEntry").val(designEntry.code);
      $("#sectionOrderEntry").val(designEntry.order);
    }
  }
  const _VALIDATE_DESIGN_FORMS = {
    "constructor body": function(o) {
      let valid = true;
      o.classUid = $("#classUid").val();
      o.tags.push("code");
      o.code = $("#sectionContentEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.code.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    inheritance: function(o) {
      let valid = true;
      o.classInheritance = $("#classInheritanceNameEntry").val();
      o.tags.push("code");
      if (o.classInheritance.length === 0) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "key listener handler": function(o) {
      let valid = true;
      o.tags.push("code");
      o.classUid = $("#classUid").val();
      o.entryKey = $("#keyEntry").val();
      o.code = $("#keyListenerCodeEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.entryKey.length === 0 || o.code.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "private field": function(o) {
      let valid = true;
      o.classUid = $("#classUid").val();
      o.fieldName = $("#fieldNameEntry").val();
      o.fieldType = $("#fieldTypeEntry").val();
      o.fieldValue = $("#fieldValueEntry").val();
      o.tags.push("code");
      o.fieldDefinition = $("#sectionContentEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.fieldName.length === 0 || o.fieldDefinition.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    prototype: function(o) {
      let valid = true;
      o.classTitle = $("#sectionTitleEntry").val();
      o.classHandle = $("#classNameEntry").val();
      o.fileHandle = $("#classFilenameEntry").val();
      o.tags.push("class");
      o.classDefinition = $("#sectionContentEntry").val();
      o.filePath = $("#prototypePathSelect option:selected").val();
      if (o.classTitle.length === 0 || o.classDefinition.length === 0) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "public member": function(o) {
      let valid = true;
      o.tags.push("code");
      o.classUid = $("#classUid").val();
      o.memberName = $("#memberNameEntry").val();
      o.memberDefinition = $("#memberDefinitionEntry").val();
      o.arguments = $("#memberArgsEntry").val();
      o.code = $("#sectionContentEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.memberName.length === 0 || o.memberDefinition.length === 0 || o.code.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "public setter property": function(o) {
      let valid = true;
      o.tags.push("code");
      o.classUid = $("#classUid").val();
      o.propertyName = $("#propertyNameEntry").val();
      o.setterDefinition = $("#setterDefinitionEntry").val();
      o.setterBody = $("#sectionContentEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.propertyName.length === 0 || o.setterDefinition.length === 0 || o.setterBody.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    scene: function(o) {
      let valid = true;
      o.classTitle = $("#sectionTitleEntry").val();
      o.classHandle = $("#classNameEntry").val();
      o.fileHandle = $("#classFilenameEntry").val();
      o.tags.push("class");
      o.classDefinition = $("#sectionContentEntry").val();
      if (o.classTitle.length === 0 || o.classDefinition.length === 0) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "method extensions": function(o) {
      let valid = true;
      o.tags.push("code");
      o.classUid = $("#classUid").val();
      o.code = $("#sectionContentEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.code.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "scoped dictionary body": function(o) {
      let valid = true;
      o.tags.push("code");
      o.classUid = $("#classUid").val();
      o.dictionaryKey = $("#dictionaryKeyEntry").val();
      o.dictionaryDefinition = $("#dictionaryDefinitionEntry").val();
      o.dictionaryValue = $("#sectionContentEntry").val();
      if (o.dictionaryKey.length === 0 || o.dictionaryDefinition.length === 0 || o.dictionaryValue.length === 0) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    singleton: function(o) {
      let valid = true;
      o.classTitle = $("#sectionTitleEntry").val();
      o.classHandle = $("#classNameEntry").val();
      o.fileHandle = $("#classFilenameEntry").val();
      o.tags.push("class");
      o.classDefinition = $("#sectionContentEntry").val();
      o.filePath = $("#singletonPathSelect option:selected").val();
      if (o.classTitle.length === 0 || o.classDefinition.length === 0) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "start scene": function(o) {
      let valid = true;
      o.classUid = $("#classUid").val();
      o.tags.push("code");
      o.code = $("#sectionContentEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.code.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "unit test": function(o) {
      let valid = true;
      o.tags.push("code");
      o.classUid = $("#classUid").val();
      o.testHeader = $("#testHeaderEntry").val();
      o.testDefinition = $("#testDefinitionEntry").val();
      o.arguments = $("#memberArgsEntry").val();
      o.code = $("#sectionContentEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.testHeader.length === 0 || o.testDefinition.length === 0 || o.code.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    },
    "view template": function(o) {
      let valid = true;
      o.tags.push("code");
      o.classUid = $("#classUid").val();
      o.entryKey = $("#keyEntry").val();
      o.code = $("#viewCodeEntry").val();
      o.order = $("#sectionOrderEntry").val();
      if (o.entryKey.length === 0 || o.code.length === 0 || isNaN(parseInt(o.order))) {
        valid = false;
      }
      return { object: o, valid: valid };
    }
  }
  return {
    /** Displays the 'Add Project' form. */
    displayAddProjectForm: function() {
      $(".modal-content").html("");
      for (let i = ADD_PROJECT.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(ADD_PROJECT[i]));
      }
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    submitAddProjectForm: function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      if (LibraryManager.hasProject($("#gameTitleEntry").val())) {
        alert("Already entered");
      } else if ($("#themeSelect option:selected").val().length === 0) {
        $("#mainModal").show();
      } else {
        let lib = [];
        if ($("#appConstantsCheckbox").is(":checked")) {
          lib.push("app-constants");
        }
        if ($("#appConfigCheckbox").is(":checked")) {
          lib.push("app-config");
        }
        if ($("#sceneControllerCheckbox").is(":checked")) {
          lib.push("scene-controller");
        }
        if ($("#gameCheckbox").is(":checked")) {
          lib.push("game");
        }
        LibraryManager.createProject(
          {
            "title": $("#gameTitleEntry").val(),
            "namespace": $("#namespaceEntry").val(),
            "appHandle": $("#appHandleEntry").val(),
            "theme": $("#themeSelect option:selected").val(),
            "dimensions": JSON.parse($("#dimensionSelect option:selected").val()),
            "lib": lib
          }, function() { loadLibraries(); }
        );
      }
    },

    displayAddDesignForm: function() {
      $(".modal-content").html("");
      for (let i = _ADD_DESIGN.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(_ADD_DESIGN[i]));
      }
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    displayDesignSubForm: function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      switch ($("#designSelect option:selected").val()) {
        case "class":
          FormManager.displayAddClassForm();
          break;
        case "code-injection":
          FormManager.displayAddCodeInjectionForm();
          break;
      }
    },
    
    displayAddCodeInjectionForm: function() {
      $(".modal-content").html("");
      for (let i = _ADD_CODE_INJECTION.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(_ADD_CODE_INJECTION[i]));
      }
      let classes = ProjectManager.getClasses();
      classes.sort(function(a, b) {
        let aType, bType;
        for (let i = a.tags.length - 1; i >= 0; i--) {
          if (a.tags[i] === "class") {
            continue;
          }
          aType = a.tags[i];
        }
        for (let i = b.tags.length - 1; i >= 0; i--) {
          if (b.tags[i] === "class") {
            continue;
          }
          bType = b.tags[i];
        }
        let c = 0;
        if (aType < bType) {
          c = 1;
        } else if (aType > bType) {
          c = -1;
        } else {
          if (a.classHandle < b.classHandle) {
            c = 1;
          } else if (a.classHandle > b.classHandle) {
            c = -1;
          }
        }
        return c;
      });
      for (let i = classes.length - 1; i >= 0; i--) {
        $("#classListing").append(CONTENT_BUILDER({
          dom: "option",
          attr: {
            "value": classes[i].uid
          },
          content: classes[i].classHandle
        }));
      }
      for (let i = classes.length - 1; i >= 0; i--) {
        if (classes[i].tags.includes("scene-container")) {
          $("#sceneContainerListing").append(CONTENT_BUILDER({
            dom: "option",
            attr: {
              "value": classes[i].uid
            },
            content: classes[i].classHandle
          }));
        }
      }
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    submitAddCodeInjectionForm: function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      switch ($("#injectionListing option:selected").val()) {
        case "before all":
          {
            let o = {
              classUid: $("#classListing option:selected").val(),
              code: $("#sectionContentEntry").val(),
              tags: ["code", $("#injectionListing option:selected").val()],
              "order": $("#sectionOrderEntry").val(),
              uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.code.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "constructor body":
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", "constructor body"],
              "code": $("#sectionContentEntry").val(),
              "order": $("#sectionOrderEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.code.length === 0
              || o.order.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "inheritance":
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", "inheritance"],
              "classInheritance": $("#classInheritanceNameEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.classInheritance.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "private dictionary 0":
        case "private dictionary 1":
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", $("#injectionListing option:selected").val().indexOf("0") > 0 ? "scoped dictionary enclosure 0" : "scoped dictionary enclosure 1"],
              "dictionaryName": $("#dictionaryNameEntry").val(),
              "dictionaryType": $("#dictionaryConstantDeclaration").is(":checked") ? "constant": "",
              "dictionaryDefinition": $("#sectionContentEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.dictionaryName.length === 0
              || o.dictionaryDefinition.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "private dictionary key-value 0":
        case "private dictionary key-value 1":
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", $("#injectionListing option:selected").val().indexOf("0") > 0 ? "scoped dictionary body 0" : "scoped dictionary body 1"],
              "dictionaryKey": $("#dictionaryKeyEntry").val(),
              "dictionaryDefinition": $("#dictionaryDefinitionEntry").val(),
              "dictionaryValue": $("#sectionContentEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.dictionaryKey.length === 0
              || o.dictionaryDefinition.length === 0
              || o.dictionaryValue.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "private field":
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", "private field"],
              "fieldName": $("#fieldNameEntry").val(),
              "fieldType": $("#fieldTypeEntry").val(),
              "fieldValue": $("#fieldValueEntry").val(),
              "fieldDefinition": $("#sectionContentEntry").val(),
              "order": $("#sectionOrderEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.fieldName.length === 0
              || o.fieldType.length === 0
              || o.fieldValue.length === 0
              || o.fieldDefinition.length === 0
              || o.order.length === 0) {
              $("#mainModal").show();
            } else {
              if (o.fieldType === "int") {
                o.fieldValue = parseInt(o.fieldValue);
              }
              if (o.fieldType === "float") {
                o.fieldValue = parseFloat(o.fieldValue);
              }
              if (o.fieldType === "boolean") {
                o.fieldValue = o.fieldValue.toLowerCase() === "true";
              }
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "public member":
          console.log("must validate public member - need name, definition, arguments, code, order")
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", "public member"],
              "memberName": $("#memberNameEntry").val(),
              "memberDefinition": $("#memberDefinitionEntry").val(),
              "arguments": $("#memberArgsEntry").val(),
              "code": $("#sectionContentEntry").val(),
              "order": $("#sectionOrderEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.memberName.length === 0
              || o.memberDefinition.length === 0
              || o.code.length === 0
              || o.order.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "public property":
          {
            let o = {
              classUid: $("#classListing option:selected").val(),
              tags: ["code"],
              propertyName: $("#propertyNameEntry").val(),
              order: $("#sectionOrderEntry").val(),
              uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.propertyName.length === 0
              || o.order.length === 0) {
              $("#mainModal").show();
            } else {
              if ($("#getterDefinitionEntry").val().length > 0
                  && $("#getterBodyEntry").val().length > 0) {
                o.getterDefinition = $("#getterDefinitionEntry").val();
                o.getterBody = $("#getterBodyEntry").val();
              }
              if ($("#setterDefinitionEntry").val().length > 0
                  && $("#setterBodyEntry").val().length > 0) {
                o.setterDefinition = $("#setterDefinitionEntry").val();
                o.setterBody = $("#setterBodyEntry").val();
              }
              if (o.hasOwnProperty("getterBody") || o.hasOwnProperty("setterBody")) {
                if (o.hasOwnProperty("getterBody") && o.hasOwnProperty("setterBody")) {
                  o.tags.push("public getter/setter property");
                } else if (o.hasOwnProperty("getterBody")) {
                  o.tags.push("public getter property");
                } else if (o.hasOwnProperty("setterBody")) {
                  o.tags.push("public setter property");
                }
                ProjectManager.addDesign(o);
              } else {
                $("#mainModal").show();
              }
            }
          }
          break;
        case "prototype requires":
        case "singleton requires":
          {
            let o = {
              classUid: $("#classListing option:selected").val(),
              className: $("#classNameEntry").val(),
              requiredSymbol: $("#requiredSymbolEntry").val(),
              requiredClass: $("#requiredClassEntry").val(),
              tags: ["code", $("#injectionListing option:selected").val()],
              uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.className.length === 0 || o.requiredSymbol.length === 0 || o.requiredClass.length === 0 || o.classUid.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "create":
        case "init":
        case "postboot":
        case "preboot":
        case "preload":
        case "update":
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", $("#injectionListing option:selected").val()],
              "code": $("#sectionContentEntry").val(),
              "order": $("#sectionOrderEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.code.length === 0
              || o.order.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "group properties":
          {
            let o = {
              classUid: $("#classListing option:selected").val(),
              groupName: $("#groupNameEntry").val(),
              tags: ["code", $("#injectionListing option:selected").val()],
              elements: [
                {
                  elementName: $("#elementNameEntry").val(),
                  elementValue: $("#elementValueEntry").val(),
                  elementDefinition: $("#sectionContentEntry").val(),
                  order: 1
                }
              ],
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.groupName.length === 0
              || o.elements[0].elementName.length === 0
              || o.elements[0].elementValue.length === 0
              || o.elements[0].elementDefinition.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "required import":
          {
            let o = {
              classUid: $("#classListing option:selected").val(),
              importHandle: $("#importHandleEntry").val(),
              importPath: $("#importPathEntry").val(),
              tags: ["code", $("#injectionListing option:selected").val()],
              uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.importHandle.length === 0 || o.importPath.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "scene group":
          {
            let o = {
              classUid: $("#classListing option:selected").val(),
              tags: ["code", $("#injectionListing option:selected").val()],
              sceneKey: $("#sceneKeyEntry").val(),
              sceneValue: $("#sceneValueEntry").val(),
              order: $("#sectionOrderEntry").val(),
              uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.sceneKey.length === 0
                || o.order.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
        case "start scene":
          {
            let o = {
              "classUid": $("#classListing option:selected").val(),
              "tags": ["code", "start scene"],
              "code": $("#sectionContentEntry").val(),
              "order": $("#sectionOrderEntry").val(),
              "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
            };
            if (o.classUid.length === 0
              || o.code.length === 0
              || o.order.length === 0) {
              $("#mainModal").show();
            } else {
              ProjectManager.addDesign(o);
            }
          }
          break;
      }
    },

    displayAddClassForm: function() {
      $(".modal-content").html("");
      for (let i = _ADD_CLASS.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(_ADD_CLASS[i]));
      }
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    submitAddClassForm: function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      let o = {
        "classTitle": $("#sectionTitleEntry").val(),
        "classHandle": $("#classNameEntry").val(),
        "fileHandle": $("#classFilenameEntry").val(),
        "tags": ["class", $("#templateSelect option:selected").val()],
        "classDefinition": $("#sectionContentEntry").val(),
        weight: $("#weightEntry").val(),
        "uid": [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
      };
      if (o.classTitle.length === 0 || o.classDefinition.length === 0 ||  $("#templateSelect option:selected").val().length === 0) {
        $("#mainModal").show();
      } else if (($("#templateSelect option:selected").val() === "singleton" && $("#singletonPathSelect option:selected").val().length === 0)
          || ($("#templateSelect option:selected").val() === "prototype" && $("#prototypePathSelect option:selected").val().length === 0)) {
      } else {
        switch ($("#templateSelect option:selected").val()) {
          case "singleton":
            o.filePath = $("#singletonPathSelect option:selected").val();
            break;
          case "prototype":
            o.filePath = $("#prototypePathSelect option:selected").val();
            o.gridWidth = $("#gridWidthEntry").val();
            o.gridHeight = $("#gridHeightEntry").val();
            if (o.filePath === "custom") {
              o.filePath = $("#prototypePathEntry").val();
              if (o.filePath.indexOf(",") > 0) {
                o.filePath = o.filePath.split(",");
              }
              if (o.filePath.indexOf("/") > 0) {
                o.filePath = o.filePath.split("/");
              }
            }
            break;
          case "ui-scene":
            o.filePath = $("#prototypePathSelect option:selected").val();
            o.parentScene = $("#sceneContainerListing option:selected").val();
            o.gridWidth = $("#gridWidthEntry").val();
            o.gridHeight = $("#gridHeightEntry").val();
            if (o.filePath === "custom") {
              o.filePath = $("#prototypePathEntry").val();
              if (o.filePath.indexOf(",") > 0) {
                o.filePath = o.filePath.split(",");
              }
              if (o.filePath.indexOf("/") > 0) {
                o.filePath = o.filePath.split("/");
              }
            }
            break;
          default:
            break;
        }
        ProjectManager.addDesign(o);
      }
    },

    displayEditDesignForm: function(uid) {
      $(".modal-content").html("");
      for (let i = _EDIT_DESIGN.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(_EDIT_DESIGN[i]));
      }
      let designEntry = ProjectManager.getEntryByUid(uid);
      if (designEntry.tags.includes("constructor body")) {
        _EDIT_DESIGN_FORMS["constructor body"](designEntry);
      } else if (designEntry.tags.includes("create")) {
        _EDIT_DESIGN_FORMS["method extensions"](designEntry, "create");
      } else if (designEntry.tags.includes("init")) {
        _EDIT_DESIGN_FORMS["method extensions"](designEntry, "init");
      } else if (designEntry.tags.includes("key listener handler")) {
        _EDIT_DESIGN_FORMS["key listener handler"](designEntry);
      } else if (designEntry.tags.includes("postboot")) {
        _EDIT_DESIGN_FORMS["method extensions"](designEntry, "postboot");
      } else if (designEntry.tags.includes("preboot")) {
        _EDIT_DESIGN_FORMS["method extensions"](designEntry, "preboot");
      } else if (designEntry.tags.includes("preload")) {
        _EDIT_DESIGN_FORMS["method extensions"](designEntry, "preload");
      } else if (designEntry.tags.includes("update")) {
        _EDIT_DESIGN_FORMS["method extensions"](designEntry, "update");
      } else if (designEntry.tags.includes("inheritance")) {
        _EDIT_DESIGN_FORMS.inheritance(designEntry);
      } else if (designEntry.tags.includes("private field")) {
        _EDIT_DESIGN_FORMS["private field"](designEntry);
      } else if (designEntry.tags.includes("prototype")) {
        _EDIT_DESIGN_FORMS.prototype(designEntry);
      } else if (designEntry.tags.includes("public member")) {
        _EDIT_DESIGN_FORMS["public member"](designEntry);
      } else if (designEntry.tags.includes("public setter property")) {
        _EDIT_DESIGN_FORMS["public setter property"](designEntry);
      } else if (designEntry.tags.includes("scene")) {
        _EDIT_DESIGN_FORMS.scene(designEntry);
      } else if (designEntry.tags.includes("scene group")) {
        _EDIT_DESIGN_FORMS["scene group"](designEntry);
      } else if (designEntry.tags.includes("scoped dictionary body 0")) {
        _EDIT_DESIGN_FORMS["scoped dictionary body"](designEntry, "scoped dictionary body 0");
      } else if (designEntry.tags.includes("scoped dictionary body 1")) {
        _EDIT_DESIGN_FORMS["scoped dictionary body"](designEntry, "scoped dictionary body 1");
      } else if (designEntry.tags.includes("singleton")) {
        _EDIT_DESIGN_FORMS.singleton(designEntry);
      } else if (designEntry.tags.includes("start scene")) {
        _EDIT_DESIGN_FORMS["start scene"](designEntry);
      } else if (designEntry.tags.includes("unit test")) {
        _EDIT_DESIGN_FORMS["unit test"](designEntry);
      } else if (designEntry.tags.includes("view template")) {
        _EDIT_DESIGN_FORMS["view template"](designEntry);
      }
      $("#designUid").val(uid);
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    submitEditDesignForm: function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      let o = { tags: [$("#hiddenTag").val()], uid: $("#designUid").val() };
      let valid = true;
      let retObj;
      console.log(o.tags)
      if (o.tags.includes("constructor body")) {
        retObj = _VALIDATE_DESIGN_FORMS["constructor body"](o);
      } else if (o.tags.includes("create") || o.tags.includes("init") || o.tags.includes("postboot") || o.tags.includes("preboot") || o.tags.includes("preload") || o.tags.includes("update")) {
        retObj = _VALIDATE_DESIGN_FORMS["method extensions"](o);
      } else if (o.tags.includes("inheritance")) {
        retObj = _VALIDATE_DESIGN_FORMS.inheritance(o);
      } else if (o.tags.includes("key listener handler")) {
        retObj = _VALIDATE_DESIGN_FORMS["key listener handler"](o);
      } else if (o.tags.includes("prototype")) {
        retObj = _VALIDATE_DESIGN_FORMS.prototype(o);
      } else if (o.tags.includes("private field")) {
        retObj = _VALIDATE_DESIGN_FORMS["private field"](o);
      } else if (o.tags.includes("public member")) {
        retObj = _VALIDATE_DESIGN_FORMS["public member"](o);
      } else if (o.tags.includes("public setter property")) {
        retObj = _VALIDATE_DESIGN_FORMS["public setter property"](o);
      } else if (o.tags.includes("scene")) {
        retObj = _VALIDATE_DESIGN_FORMS.scene(o);
      } else if (o.tags.includes("scoped dictionary body 0") || o.tags.includes("scoped dictionary body 1")) {
        retObj = _VALIDATE_DESIGN_FORMS["scoped dictionary body"](o);
      } else if (o.tags.includes("singleton")) {
        retObj = _VALIDATE_DESIGN_FORMS.singleton(o);
      } else if (o.tags.includes("start scene")) {
        retObj = _VALIDATE_DESIGN_FORMS["start scene"](o);
      } else if (o.tags.includes("unit test")) {
        retObj = _VALIDATE_DESIGN_FORMS["unit test"](o);
      } else if (o.tags.includes("view template")) {
        retObj = _VALIDATE_DESIGN_FORMS["view template"](o);
      }
      o = retObj.object;
      valid = retObj.valid;
      if (!valid) {
        $("#mainModal").show();
      } else {
        ProjectManager.updateDesignEntry(o);
      }
    },

    displayAddSectionForm: function() {
      $(".modal-content").html("");
      for (let i = _ADD_SECTION.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(_ADD_SECTION[i]));
      }
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    submitAddSectionForm: function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      let o = {
        title: $("#sectionTitleEntry").val(),
        order: parseInt($("#sectionOrderEntry").val()),
        content: $("#sectionContentEntry").val(),
        children: [],
        design: [],
        uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
      };
      switch ($("#designSectionTemplateSelect option:selected").val()) {
        case "key listener handler":
          {
            o.design.push(
              {
                classUid: $("#uiSceneListing option:selected").val(),
                tags: ["code", "key listener handler"],
                entryKey: $("#keyEntry").val(),
                code: $("#keyListenerCodeEntry").val(),
                order: $("#sectionOrderEntry").val(),
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "private field":
          {
            let classUid = $("#classListing option:selected").val();
            let classObj = ProjectManager.getEntryByUid(classUid);
            let fieldName = $("#fieldNameEntry").val();
            let fieldType = $("#fieldTypeEntry").val();
            let order = $("#sectionOrderEntry").val();
            let returnType;
            if (fieldType === "int" || fieldType === "float") {
              returnType = "Number";
            } else if (fieldType === "string") {
              returnType = "String";
            } else {
              returnType = "Object";
            }
            o.design.push(
              {
                classUid: classUid,
                tags: ["code", "private field"],
                fieldName: fieldName,
                fieldType: fieldType,
                fieldValue: $("#fieldValueEntry").val(),
                fieldDefinition: $("#sectionContentEntry").val(),
                order: order,
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
            if ($("#getterEntry").is(":checked")
                && $("#setterEntry").is(":checked")) {
              let setterBody = [];
              switch (fieldType) {
                case "int":
                  setterBody.push("if (isNaN(parseInt(value))) {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
                case "float":
                  setterBody.push("if (isNaN(parseFloat(value))) {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
                case "string":
                  setterBody.push("if (typeof(value) !== \"string\" && !(value instanceof String)) {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
                case "boolean":
                  setterBody.push("if (typeof(value) !== \"boolean\") {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
              }
              if (classObj.tags.includes("scene-container")
                  || classObj.tags.includes("singleton")) {
                setterBody.push([fieldName, " = value;"].join(""));
              } else {
                setterBody.push(["this.", fieldName, " = value;"].join(""));
              }
              if ($("#watchedEntry").is(":checked")) {
                setterBody.push("this.notifyWatchers(this);");
              }
              let getterBody = ["return this.", fieldName, ";"].join("");              
              if (classObj.tags.includes("scene-container")
                  || classObj.tags.includes("singleton")) {
                getterBody = ["return ", fieldName, ";"].join(""); 
              }
              o.design.push(
                {
                  classUid: classUid,
                  tags: ["code", "public getter/setter property"],
                  propertyName: fieldName.substring(1),
                  getterDefinition: ["/**", [" * Getter for field ", fieldName, "."].join(""), [" * @returns {", returnType,  "}"].join(""), " */"].join("\n"),
                  getterBody: getterBody,
                  setterDefinition: ["/**", [" * Setter for field ", fieldName, "."].join(""), " * @param {PropertyKey} value the value", " */"].join("\n"),
                  setterBody: setterBody.join("\n"),
                  order: order,
                  uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                }
              );
            } else if ($("#getterEntry").is(":checked")) {
              o.design.push(
                {
                  classUid: classUid,
                  tags: ["code", "public getter property"],
                  propertyName: fieldName.substring(1),
                  getterDefinition: ["/**", [" * Getter for field ", fieldName, "."].join(""), [" * @returns {", returnType,  "}"].join(""), " */"].join("\n"),
                  getterBody: ["return this.", fieldName, ";"].join(""),
                  order: order,
                  uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                }
              );
            } else if ($("#setterEntry").is(":checked")) {
              let setterBody = [];
              switch (fieldType) {
                case "int":
                  setterBody.push("if (isNaN(parseInt(value))) {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
                case "float":
                  setterBody.push("if (isNaN(parseFloat(value))) {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
                case "string":
                  setterBody.push("if (typeof(value) !== \"string\" && !(value instanceof String)) {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
                case "boolean":
                  setterBody.push("if (typeof(value) !== \"boolean\") {");
                  setterBody.push("  throw [\"Invalid value\", value];");
                  setterBody.push("}");
                  break;
              }
              setterBody.push(["this.", fieldName, " = value;"].join(""));
              if ($("#watchedEntry").is(":checked")) {
                setterBody.push("this.notifyWatchers(this);");
              }
              o.design.push(
                {
                  classUid: classUid,
                  tags: ["code", "public setter property"],
                  propertyName: fieldName.substring(1),
                  setterDefinition: ["/**", [" * Setter for field ", fieldName, "."].join(""), " * @param {PropertyKey} value the value", " */"].join("\n"),
                  setterBody: setterBody.join("\n"),
                  order: order,
                  uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                }
              );
            }
          }
          break;
        case "prototype":
          {
            let filePath = $("#prototypePathSelect option:selected").val();
            if (filePath === "custom") {
              filePath = $("#prototypePathEntry").val();
              if (filePath.indexOf(",") > 0) {
                filePath = filePath.split(",");
              }
              if (filePath.indexOf("/") > 0) {
                filePath = filePath.split("/");
              }
            }
            let classUid = [Date.now().toString(36), Math.random().toString(36).substr(2)].join("");
            o.children.push(
              {
                title: ["The ", $("#classTitleEntry").val(), " Class"].join(""),
                order: 1,
                content: "A new class will be defined using the 'prototype' template.",
                children: [],
                design: [
                  // ADD PROTOTYPE CLASS DESIGN OBJECT
                  {
                    classTitle: $("#classTitleEntry").val(),
                    classHandle: $("#classNameEntry").val(),
                    fileHandle: $("#classFilenameEntry").val(),
                    tags: [
                      "class",
                      "prototype"
                    ],
                    classDefinition: $("#sectionContentEntry").val(),
                    weight: $("#weightEntry").val(),
                    uid: classUid,
                    filePath: filePath
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
            if ($("#watchableEntry").is(":checked")) {
              o.children[0].design.push(
                {
                  classUid: classUid,
                  tags: ["code", "constructor body"],
                  code: "Watchable.apply(this);",
                  order: 9999,
                  uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                },
                {
                  classUid: classUid,
                  tags: ["code", "inheritance"],
                  classInheritance: "Watchable",
                  order: 9999,
                  uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                }
              );
            }
            o.children.push(
              {
                title: "File Imports",
                order: 2,
                content: ["The ", $("#classTitleEntry").val(), " class will require the following imports:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Private Fields",
                order: 3,
                content: ["The ", $("#classTitleEntry").val(), " class will have the following private fields:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Public Members",
                order: 4,
                content: ["The ", $("#classTitleEntry").val(), " class will have the following public members:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "prototype test":
          {
            console.log($("#classListing option:selected").val())
            ProjectManager.currentSection.unitTestingPercentage = 0;
            let classObject = ProjectManager.getEntryByUid($("#classListing option:selected").val());
            let filePath = JSON.parse(JSON.stringify(classObject.filePath));
            let classUid = [Date.now().toString(36), Math.random().toString(36).substr(2)].join("");
            o.content = ["Unit testing for class ", classObject.classHandle, "."].join("");
            o.design.push(
              // ADD PROTOTYPE TEST CLASS DESIGN OBJECT
              {
                classTitle: [classObject.classTitle, " Test"].join(""),
                classHandle: [classObject.classHandle, "Test"].join(""),
                fileHandle:  [classObject.fileHandle, ".test"].join(""),
                tags: [
                  "class",
                  "prototype test"
                ],
                classDefinition: o.content,
                weight: 1,
                uid: classUid,
                filePath: filePath
              }
            );
            o.children.push(
              {
                title: "File Imports",
                order: 1,
                content: ["The ", [classObject.classTitle, " Test"].join(""), " class will require the following imports:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Before All",
                order: 2,
                content: ["The ", [classObject.classTitle, " Test"].join(""), " class will require the following setup before all testing begins:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Before Each",
                order: 3,
                content: ["The ", [classObject.classTitle, " Test"].join(""), " class will require the following setup before each individual test runs:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Unit Tests",
                order: 4,
                content: ["The following unit tests for class ", classObject.classHandle, " will exist:"].join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "public member":
          {
            o.design.push(
              {
                classUid: $("#classListing option:selected").val(),
                tags: ["code", "public member"],
                memberName: $("#memberNameEntry").val(),
                memberDefinition: $("#memberDefinitionEntry").val(),
                arguments: $("#memberArgsEntry").val(),
                code: $("#memberCodeEntry").val(),
                order: $("#sectionOrderEntry").val(),
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "scene-container":
          {
            let filePath = $("#prototypePathSelect option:selected").val();
            if (filePath === "custom") {
              filePath = $("#prototypePathEntry").val();
              if (filePath.indexOf(",") > 0) {
                filePath = filePath.split(",");
              }
              if (filePath.indexOf("/") > 0) {
                filePath = filePath.split("/");
              }
            }
            let classUid = [Date.now().toString(36), Math.random().toString(36).substr(2)].join("");
            let gameUid, sceneControllerUid, constantsUid;
            let classes = ProjectManager.getClasses();
            for (let i = classes.length - 1; i >= 0; i--) {
              if (classes[i].tags.includes("game")) {
                gameUid = classes[i].uid;
              }
              if (classes[i].tags.includes("scene-controller")) {
                sceneControllerUid = classes[i].uid;
              }
              if (classes[i].tags.includes("app-constants")) {
                constantsUid = classes[i].uid;
              }
            }
            o.children.push(
              {
                title: "The Scene Container Class",
                order: 1,
                content: "A Scene Container class will need to be defined.  The Scene Container template will be used.",
                children: [],
                design: [
                  // ADD SCENE CLASS DESIGN OBJECT
                  {
                    classTitle: $("#classTitleEntry").val(),
                    classHandle: $("#classNameEntry").val(),
                    fileHandle: $("#classFilenameEntry").val(),
                    tags: [
                      "class",
                      "scene-container"
                    ],
                    classDefinition: $("#sectionContentEntry").val(),
                    weight: $("#weightEntry").val(),
                    uid: classUid,
                    filePath: filePath
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "File Imports",
                order: 2,
                content: "The Game class will include the Scene Container as a required import.\nThe Scene Container class will require the following imports:",
                "requires design": true,
                children: [],
                design: [
                  // ADD SCENE FILE IMPORT TO GAME
                  {
                    classUid: gameUid,
                    importHandle: [ProjectManager.projectAppHandle, $("#classNameEntry").val()].join(""),
                    importPath: ["../", filePath.join("/"), "/", ProjectManager.projectFileHandle, "-", $("#classFilenameEntry").val()].join(""),
                    tags: [
                      "code",
                      "required import"
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Postboot Processing",
                order: 3,
                content: "The Scene Container class will need to be added to the Game class postboot processing.",
                "requires design": true,
                children: [],
                design: [
                  {
                    classUid: gameUid,
                    tags: [
                      "code",
                      "postboot"
                    ],
                    code: ["_game.scene.queueOp(\"start\", \"", $("#classNameEntry").val(), "\");"].join(""),
                    order: "1",
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Scene Key",
                order: 4,
                content: "The Scene Container class will need to be added to the scene groups in the Scene Controller class.",
                "requires design": true,
                children: [],
                design: [
                  {
                    classUid: sceneControllerUid,
                    tags: [
                      "code",
                      "scene group"
                    ],
                    sceneKey: $("#sceneKeyEntry").val(),
                    sceneValue: ["\"", $("#classNameEntry").val(), "\""].join(""),
                    order: "1",
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Scene states",
                order: 5,
                content: "A State Group will need to be added to the App Constants for this Scene Container",
                "requires design": true,
                children: [],
                design: [
                  {
                    classUid: constantsUid,
                    groupName: "GROUP_NAME_TBD",
                    tags: [
                      "code",
                      "group properties"
                    ],
                    elements: [
                      {
                        elementName: "GROUP_ELEMENT_NAME_TBD",
                        elementValue: "1",
                        elementDefinition: "The initial state.",
                        order: 1
                      }
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  },
                  {
                    tags: [
                      "scoped dictionary body 0",
                      "code"
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join(""),
                    classUid: classUid,
                    dictionaryKey: ["[", ProjectManager.projectAppHandle, "Constants.GROUP_ELEMENT_NAME_TBD]"].join(""),
                    dictionaryDefinition: "the scene instances displayed when this view is active",
                    dictionaryValue: "[_uiInstance0, _uiInstance1]"
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Scene Initial State",
                order: 6,
                content: "The Scene Container initial state is set in the 'create' method of the Scene Controller class. It will be set to the following state:",
                "requires design": true,
                children: [],
                design: [
                  {
                    tags: [
                      "create",
                      "code"
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join(""),
                    classUid: sceneControllerUid,
                    code: ["\n\n// set initial state for INSERT VIEW NAME\n", ProjectManager.projectAppHandle, $("#classNameEntry").val(), ".state = ", ProjectManager.projectAppHandle, "Constants.GROUP_ELEMENT_NAME_TBD;"].join(""),
                    order: "ORDER_TBD"
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Private Fields",
                order: 7,
                content: "The Scene Container may have a few private fields. If so, they will be added here.",
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Public Members",
                order: 8,
                content: "The Scene Container may have a few public members. If so, they will be added here.",
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Child Scenes",
                order: 9,
                content: "The Scene Container is just that: a container.  It will manage the following child scenes:",
                "requires design": true,
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "ui-scene":
          {
            let filePath = $("#prototypePathSelect option:selected").val();
            if (filePath === "custom") {
              filePath = $("#prototypePathEntry").val();
              if (filePath.indexOf(",") > 0) {
                filePath = filePath.split(",");
              }
              if (filePath.indexOf("/") > 0) {
                filePath = filePath.split("/");
              }
            }
            let classUid = [Date.now().toString(36), Math.random().toString(36).substr(2)].join("");
            let sceneuid = $("#sceneContainerListing option:selected").val();
            o.children.push(
              {
                title: "The UI Scene Class",
                order: 1,
                content: "A UI class will need to be defined.  The Ui Scene template will be used.",
                children: [],
                design: [
                  // ADD UI SCENE CLASS DESIGN OBJECT
                  {
                    classTitle: $("#classTitleEntry").val(),
                    classHandle: $("#classNameEntry").val(),
                    fileHandle: $("#classFilenameEntry").val(),
                    tags: [
                      "class",
                      "ui-scene"
                    ],
                    classDefinition: $("#sectionContentEntry").val(),
                    weight: $("#weightEntry").val(),
                    uid: classUid,
                    filePath: filePath,
                    initialState: $("#initialStateEntry").val(),
                    gridWidth: $("#gridWidthEntry").val(),
                    gridHeight: $("#gridHeightEntry").val(),
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "File Imports",
                order: 2,
                content: "The UI class will require the following imports:\n* Scene Contoller\n* Parent Scene",
                children: [],
                design: [
                  // ADD SCENE CONTROLLER FILE IMPORT TO UI SCENE
                  {
                    classUid: classUid,
                    importHandle: [ProjectManager.projectAppHandle, "SceneController"].join(""),
                    importPath: ["../scenes/", ProjectManager.projectFileHandle, "-scene-controller"].join(""),
                    tags: [
                      "code",
                      "required import"
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  },
                  // ADD PARENT SCENE FILE IMPORT TO UI SCENE
                  {
                    classUid: classUid,
                    importHandle: [ProjectManager.projectAppHandle, ProjectManager.getEntryByUid(sceneuid).classHandle].join(""),
                    importPath: ["../", ProjectManager.projectFileHandle, "-", ProjectManager.getEntryByUid(sceneuid).fileHandle].join(""),
                    tags: [
                      "code",
                      "required import"
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  },
                  // ADD UI SCENE FILE IMPORT TO PARENT SCENE
                  {
                    classUid: sceneuid,
                    importHandle: [ProjectManager.projectAppHandle, $("#classNameEntry").val()].join(""),
                    importPath: ["../", filePath.join("/"), "/", ProjectManager.projectFileHandle, "-", $("#classFilenameEntry").val()].join(""),
                    tags: [
                      "code",
                      "required import"
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  },
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Private Fields",
                order: 3,
                content: "The UI class will be added as a private member of its scene parent.\nThe Ui Scene will have the following private fields:",
                children: [],
                design: [
                  // ADD UI SCENE INSTANCE TO PARENT SCENE
                  {
                    classUid: sceneuid,
                    tags: [
                      "code",
                      "private field"
                    ],
                    fieldName: ["_", $("#classNameEntry").val().charAt(0).toLowerCase(), $("#classNameEntry").val().slice(1)].join(""),
                    fieldType: "UiScene",
                    fieldValue: ["new ", ProjectManager.projectAppHandle, $("#classNameEntry").val(), "({ scene: _scene, show: true })"].join(""),
                    fieldDefinition: [ProjectManager.projectAppHandle, $("#classNameEntry").val(), " instance"].join(""),
                    order: "10",
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "View Templates",
                order: 4,
                content: "The UI class will have defined templates for each view. These will be added to the Constructor Body. Templates have been defined for the following views:",
                "requires design": true,
                children: [
                  {
                    title: "Default View",
                    order: 1,
                    content: "This is the default view for the scene.",
                    children: [],
                    design: [
                      {
                        classUid: classUid,
                        tags: [
                          "code",
                          "view template"
                        ],
                        entryKey: "GROUP_ELEMENT_NAME_TBD",
                        code: "group: null,\nchildren: []",
                        order: "1",
                        uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                      }
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  }
                ],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Key Listeners",
                order: 5,
                content: "The UI class will have key listeners for the following views:",
                "requires design": true,
                children: [
                  {
                    title: "Inactive Key Listener",
                    order: 1,
                    content: "The default key listener is inactive.",
                    children: [],
                    design: [
                      {
                        classUid: classUid,
                        tags: [
                          "code",
                          "key listener handler"
                        ],
                        entryKey: "GROUP_ELEMENT_NAME_TBD",
                        code: "",
                        order: "1",
                        uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                      }
                    ],
                    uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
                  }
                ],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Updates to the 'create' methods",
                order: 6,
                content: "The UI class will have the following updates to the 'create' method:",
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Scene start/reset",
                order: 7,
                content: "When the UI scene is started/reset, the following changes are applied for each view:",
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Public Members",
                order: 8,
                content: "Occasionally, a UI Scene will need some further public members added.  This UI has added the following public members:",
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "ui-scene test":
          {
            console.log($("#classListing option:selected").val())
            ProjectManager.currentSection.unitTestingPercentage = 0;
            let classObject = ProjectManager.getEntryByUid($("#classListing option:selected").val());
            let filePath = JSON.parse(JSON.stringify(classObject.filePath));
            let classUid = [Date.now().toString(36), Math.random().toString(36).substr(2)].join("");
            o.content = ["Unit testing for class ", classObject.classHandle, "."].join("");
            o.design.push(
              // ADD UI-SCENE TEST CLASS DESIGN OBJECT
              {
                classTitle: [classObject.classTitle, " Test"].join(""),
                classHandle: [classObject.classHandle, "Test"].join(""),
                fileHandle:  [classObject.fileHandle, ".test"].join(""),
                tags: [
                  "class",
                  "ui-scene test"
                ],
                classDefinition: o.content,
                weight: 1,
                uid: classUid,
                filePath: filePath
              }
            );
            o.children.push(
              {
                title: "File Imports",
                order: 1,
                content: ["The ", [classObject.classTitle, " Test"].join(""), " class will require the following imports:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Before All",
                order: 2,
                content: ["The ", [classObject.classTitle, " Test"].join(""), " class will require the following setup before all testing begins:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Before Each",
                order: 3,
                content: ["The ", [classObject.classTitle, " Test"].join(""), " class will require the following setup before each individual test runs:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Unit Tests",
                order: 4,
                content: ["The following unit tests for class ", classObject.classHandle, " will exist:"].join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;          
        case "unit test":
          {
            o.design.push(
              {
                classUid: $("#classListing option:selected").val(),
                tags: ["code", "unit test"],
                testHeader: $("#memberHeaderEntry").val(),
                testDefinition: $("#memberDefinitionEntry").val(),
                arguments: $("#memberArgsEntry").val(),
                code: $("#memberCodeEntry").val(),
                order: $("#sectionOrderEntry").val(),
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "singleton":
          {
            let filePath = $("#singletonPathSelect option:selected").val();
            if (filePath === "custom") {
              filePath = $("#singletonPathEntry").val();
              if (filePath.indexOf(",") > 0) {
                filePath = filePath.split(",");
              }
              if (filePath.indexOf("/") > 0) {
                filePath = filePath.split("/");
              }
            }
            let classUid = [Date.now().toString(36), Math.random().toString(36).substr(2)].join("");
            o.children.push(
              {
                title: ["The ", $("#classTitleEntry").val(), " Class"].join(""),
                order: 1,
                content: "A new class will be defined using the 'singleton' template.",
                children: [],
                design: [
                  // ADD SINGLETON CLASS DESIGN OBJECT
                  {
                    classTitle: $("#classTitleEntry").val(),
                    classHandle: $("#classNameEntry").val(),
                    fileHandle: $("#classFilenameEntry").val(),
                    tags: [
                      "class",
                      "singleton"
                    ],
                    classDefinition: $("#sectionContentEntry").val(),
                    weight: $("#weightEntry").val(),
                    uid: classUid,
                    filePath: filePath
                  }
                ],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
            o.children.push(
              {
                title: "File Imports",
                order: 2,
                content: ["The ", $("#classTitleEntry").val(), " class will require the following imports:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Private Fields",
                order: 3,
                content: ["The ", $("#classTitleEntry").val(), " class will have the following private fields:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              },
              {
                title: "Public Members",
                order: 4,
                content: ["The ", $("#classTitleEntry").val(), " class will have the following public members:"]. join(""),
                children: [],
                design: [],
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
        case "view template":
          {
            o.design.push(
              {
                classUid: $("#uiSceneListing option:selected").val(),
                tags: ["code", "view template"],
                entryKey: $("#keyEntry").val(),
                code: $("#viewCodeEntry").val(),
                order: $("#sectionOrderEntry").val(),
                uid: [Date.now().toString(36), Math.random().toString(36).substr(2)].join("")
              }
            );
          }
          break;
      }
      if (o.title.length === 0 || isNaN(o.order)) {
        $("#mainModal").show();
      } else {
        ProjectManager.addSection(o);
      }
    },

    "displayEditSectionForm": function() {
      $(".modal-content").html("");
      for (let i = _EDIT_SECTION.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(_EDIT_SECTION[i]));
      }
      $("#sectionTitleEntry").val(ProjectManager.currentSection.title);
      $("#sectionOrderEntry").val(ProjectManager.currentSection.order);
      $("#sectionContentEntry").val(ProjectManager.currentSection.content);
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    "submitEditSectionForm": function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      let o = {
        "title": $("#sectionTitleEntry").val(),
        "order": parseInt($("#sectionOrderEntry").val()),
        content: $("#sectionContentEntry").val()
      };
      if (o.title.length === 0 || isNaN(o.order)) {
        $("#mainModal").show();
      } else {
        ProjectManager.editSection(o);
      }
    },

    "displayChangeThemeForm": function() {
      $(".modal-content").html("");
      for (let i = _CHANGE_THEME.length - 1; i >= 0; i--) {
        $(".modal-content").prepend(CONTENT_BUILDER(_CHANGE_THEME[i]));
      }
      if (ProjectManager.currentTheme.length > 0) {
        // remove selected
        $("#themeSelect option:selected").each(function() {
          $(this).removeAttr('selected'); 
        });
        // add selected
        $("#themeSelect option").each(function() {
          if ($(this).val() === ProjectManager.currentTheme) {
            $(this).prop('selected', true);
          } 
        });
      }
      $("#mainModal").show({ "backdrop": "static", "keyboard": false });
    },
    "submitChangeThemeForm": function() {
      $("#mainModal").hide();
      arguments[0][0].preventDefault();
      let val = $("#themeSelect option:selected").val();
      if (val.length === 0) {
        $("#mainModal").show();
      } else {
        ProjectManager.updateTheme(val);
      }
    },
  }
} ());

const FormListener = (function() {
  const _CODE_INJECTION_BUILDERS = {
    "before all": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    "constructor body": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Constructor Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    create: function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    init: function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    postboot: function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    preboot: function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    preload: function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    update: function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    "group properties": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "groupNameEntry"
            },
            content: "Group Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "groupNameEntry",
              placeholder: "Enter Group Name"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "1st Element Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter 1st Element Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "elementNameEntry"
            },
            content: "1st Element Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "elementNameEntry",
              placeholder: "Enter 1st Element Name"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#elementNameEntry\").val($(\"#elementNameEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "elementValueEntry"
            },
            content: "1st Element Value"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "elementValueEntry",
              placeholder: "Enter 1st Element Value"
            }
          }
        ]
      }));
    },
    inheritance: function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "classInheritanceNameEntry"
            },
            content: "Class Inherits From Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "classInheritanceNameEntry",
              placeholder: "Enter Class Name"
            }
          }
        ]
      }));
    },
    "private dictionary 0": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryNameEntry"
            },
            content: "Dictionary Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "dictionaryNameEntry",
              placeholder: "Enter Dictionary Name"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#dictionaryNameEntry\").val($(\"#dictionaryNameEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "div",
        class: "form-check",
        children: [
          {
            dom: "input",
            class: "form-check-input",
            attr: {
              type: "checkbox",
              value: "",
              id: "dictionaryConstantDeclaration"
            }
          },
          {
            dom: "label",
            class: "form-check-label",
            attr: {
              for: "dictionaryConstantDeclaration"
            },
            content: "Dictionary Is Constant"
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<input>",
        class: "form-control",
        attr: {
          type: "hidden",
          id: "dictionaryTypeEntry"
        },
        content: "constant"
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Dictionary Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Dictionary Definition Here"
            }
          }
        ]
      }));
    },
    "private dictionary 1": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryNameEntry"
            },
            content: "Dictionary Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "dictionaryNameEntry",
              placeholder: "Enter Dictionary Name"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#dictionaryNameEntry\").val($(\"#dictionaryNameEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "div",
        class: "form-check",
        children: [
          {
            dom: "input",
            class: "form-check-input",
            attr: {
              type: "checkbox",
              value: "",
              id: "dictionaryConstantDeclaration"
            }
          },
          {
            dom: "label",
            class: "form-check-label",
            attr: {
              for: "dictionaryConstantDeclaration"
            },
            content: "Dictionary Is Constant"
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<input>",
        class: "form-control",
        attr: {
          type: "hidden",
          id: "dictionaryTypeEntry"
        },
        content: "constant"
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Dictionary Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Dictionary Definition Here"
            }
          }
        ]
      }));
    },
    "private dictionary key-value 0": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryKeyEntry"
            },
            content: "Dictionary Key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "dictionaryKeyEntry",
              placeholder: "Enter Dictionary Key"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#dictionaryKeyEntry\").val($(\"#dictionaryKeyEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryDefinitionEntry"
            },
            content: "Key Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "dictionaryDefinitionEntry",
              placeholder: "Enter Key Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Dictionary Value"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Dictionary Value Here"
            }
          }
        ]
      }));
    },
    "private dictionary key-value 1": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryKeyEntry"
            },
            content: "Dictionary Key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "dictionaryKeyEntry",
              placeholder: "Enter Dictionary Key"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#dictionaryKeyEntry\").val($(\"#dictionaryKeyEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "dictionaryDefinitionEntry"
            },
            content: "Key Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "dictionaryDefinitionEntry",
              placeholder: "Enter Key Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Dictionary Value"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Dictionary Value Here"
            }
          }
        ]
      }));
    },
    "private field": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "fieldNameEntry"
            },
            content: "Field Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "fieldNameEntry",
              placeholder: "Enter Field Name"
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#fieldNameEntry\").val($(\"#fieldNameEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
              }
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "fieldTypeEntry"
            },
            content: "Field Type"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "fieldTypeEntry",
              placeholder: "Enter Field Type (int, float, string, class type, etc. . .)"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "fieldValueEntry"
            },
            content: "Initial Field Value"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "fieldValueEntry",
              placeholder: "Enter Initial Field Value"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Field Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Field Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    "prototype requires": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "classNameEntry"
            },
            content: "Parent Class Handle"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "classNameEntry",
              placeholder: "Enter Parent Class Handle"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "requiredSymbolEntry"
            },
            content: "Required Symbol"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "requiredSymbolEntry",
              placeholder: "Enter Required Symbol"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "requiredClassEntry"
            },
            content: "Required Class"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "requiredClassEntry",
              placeholder: "Enter Required Class"
            }
          }
        ]
      }));
    },
    "public member": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "memberNameEntry"
            },
            content: "Member Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "memberNameEntry",
              placeholder: "Enter Member Name"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "memberDefinitionEntry"
            },
            content: "Member Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "memberDefinitionEntry",
              placeholder: "Enter Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "memberArgsEntry"
            },
            content: "Member Arguments"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              id: "memberArgsEntry",
              placeholder: "Enter Arguments Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Member Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 10,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    "public property": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "propertyNameEntry"
            },
            content: "Property Name"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "propertyNameEntry",
              placeholder: "Enter Property Name"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "getterDefinitionEntry"
            },
            content: "Getter Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "getterDefinitionEntry",
              placeholder: "Enter Getter Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "getterBodyEntry"
            },
            content: "Getter Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "getterBodyEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "setterDefinitionEntry"
            },
            content: "Setter Definition"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "setterDefinitionEntry",
              placeholder: "Enter Setter Definition Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "setterBodyEntry"
            },
            content: "Setter Body Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "setterBodyEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    "required import": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "importHandleEntry"
            },
            content: "Import Handle"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "importHandleEntry",
              placeholder: "Enter Import Handle"
            }
          }
        ]
      }));   
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "importPathEntry"
            },
            content: "Import Path"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "importPathEntry",
              placeholder: "Enter Import Path"
            }
          }
        ]
      }));
    },
    "singleton requires": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "classNameEntry"
            },
            content: "Parent Class Handle"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "classNameEntry",
              placeholder: "Enter Parent Class Handle"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "requiredSymbolEntry"
            },
            content: "Required Symbol"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "requiredSymbolEntry",
              placeholder: "Enter Required Symbol"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "requiredClassEntry"
            },
            content: "Required Class"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "requiredClassEntry",
              placeholder: "Enter Required Class"
            }
          }
        ]
      }));
    },
    "scene group": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sceneKeyEntry"
            },
            content: "Scene key"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sceneKeyEntry",
              placeholder: "[MyAppConstants.SCENE_STATE]"
            }
          },
          {
            dom: "<label>",
            attr: {
              for: "sceneValueEntry"
            },
            content: "Scene Value"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sceneValueEntry",
              placeholder: "Enter Scene Value"
            }
          },
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
    "start scene": function() {
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionContentEntry"
            },
            content: "Start Scene Code"
          },
          {
            dom: "<textarea>",
            class: "form-control",
            attr: {
              "rows": 5,
              id: "sectionContentEntry",
              placeholder: "Enter Code Here"
            }
          }
        ]
      }));
      $("#codeTypeContainer").append(CONTENT_BUILDER({
        dom: "<div>",
        class: "form-group",
        children: [
          {
            dom: "<label>",
            attr: {
              for: "sectionOrderEntry"
            },
            content: "Order"
          },
          {
            dom: "<input>",
            class: "form-control",
            attr: {
              type: "text",
              id: "sectionOrderEntry",
              placeholder: "1, 2, 3. . ."
            },
            callback: {
              keyup: {
                args: "",
                body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
              }
            }
          }
        ]
      }));
    },
  }
  return {
    selectDesignTemplate: function() {
      $("#designSectionTemplateForm").html("");
      switch ($("#designSectionTemplateSelect option:selected").val()) {
        case "key listener handler":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "UI SCENE LISTING",
              dom: "<div>",
              class: "form-group",
              attr: { id: "uiSceneGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "uiSceneListing"
                  },
                  content: "UI Scene"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "uiSceneListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ]
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "LISTENER KEY",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "keyEntry"
                  },
                  content: "Listener Key"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "keyEntry",
                    placeholder: "Enter Listener Key"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "KEY LISTENER HANDLER",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "keyListenerCodeEntry"
                  },
                  content: "Key Listener Handler"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 10,
                    id: "keyListenerCodeEntry",
                    placeholder: "Enter Key Listener Handler"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "ORDER",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionOrderEntry"
                  },
                  content: "Order"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionOrderEntry",
                    placeholder: "1, 2, 3. . ."
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
                    }
                  }
                }
              ]
            }));
            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              if (classes[i].tags.includes("ui-scene")) {
                $("#uiSceneListing").append(CONTENT_BUILDER({
                  dom: "option",
                  attr: {
                    value: classes[i].uid
                  },
                  content: classes[i].classHandle
                }));
              }
            }
          }
          break;
        case "private field":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS LISTING",
              dom: "<div>",
              class: "form-group",
              attr: { id: "classGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classListing"
                  },
                  content: "Parent Class"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "classListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ]
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "FIELD NAME",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "fieldNameEntry"
                  },
                  content: "Field Name"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "fieldNameEntry",
                    placeholder: "Enter Field Name"
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#fieldNameEntry\").val($(\"#fieldNameEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\"));"
                    }
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "FIELD TYPE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "fieldTypeEntry"
                  },
                  content: "Field Type"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "fieldTypeEntry",
                    placeholder: "Enter Field Type (int, float, string, class type, etc. . .)"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "GETTER",
              dom: "<div>",
              class: "form-check form-switch form-check-inline",
              children: [
                {
                  dom: "<input>",
                  class: "form-check-input",
                  attr: {
                    type: "checkbox",
                    id: "getterEntry"
                  }
                },
                {
                  dom: "<label>",
                  class: "form-check-label",
                  attr: {
                    for: "getterEntry"
                  },
                  content: "Getter"
                },
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "SETTER",
              dom: "<div>",
              class: "form-check form-switch form-check-inline",
              children: [
                {
                  dom: "<input>",
                  class: "form-check-input",
                  attr: {
                    type: "checkbox",
                    id: "setterEntry"
                  }
                },
                {
                  dom: "<label>",
                  class: "form-check-label",
                  attr: {
                    for: "setterEntry"
                  },
                  content: "Setter"
                },
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "WATCHED",
              dom: "<div>",
              class: "form-check form-switch form-check-inline",
              children: [
                {
                  dom: "<input>",
                  class: "form-check-input",
                  attr: {
                    type: "checkbox",
                    id: "watchedEntry"
                  }
                },
                {
                  dom: "<label>",
                  class: "form-check-label",
                  attr: {
                    for: "watchedEntry"
                  },
                  content: "Watched"
                },
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "FIELD VALUE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "fieldValueEntry"
                  },
                  content: "Initial Field Value"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "fieldValueEntry",
                    placeholder: "Enter Initial Field Value"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "ORDER",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionOrderEntry"
                  },
                  content: "Order"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionOrderEntry",
                    placeholder: "1, 2, 3. . ."
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
                    }
                  }
                }
              ]
            }));
            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              $("#classListing").append(CONTENT_BUILDER({
                dom: "option",
                attr: {
                  value: classes[i].uid
                },
                content: classes[i].classHandle
              }));
            }
          }
          break;
        case "prototype":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "PROTOTYPE NAMESPACE",
              dom: "div",
              class: "form-group",
              attr: { id: "prototypePathGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "prototypePathSelect"
                  },
                  content: "Path"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "prototypePathSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "bus"
                      },
                      content: "bus"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "graph"
                      },
                      content: "graph"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "ui"
                      },
                      content: "ui"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "custom"
                      },
                      content: "custom path"
                    }
                  ],
                  callback: {
                    change: {
                      args: "",
                      body: "FormListener.selectPrototypePath(arguments);"
                    }
                  }
                },
                {
                  dom: "input",
                  class: "form-control",
                  style: "display: none;",
                  attr: {
                    type: "text",
                    id: "prototypePathEntry",
                    placeholder: "Enter Class Path"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS TITLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classTitleEntry"
                  },
                  content: "Class Title"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classTitleEntry",
                    placeholder: "Enter Class Title"
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#classNameEntry\").val($(\"#classTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#classTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
                    }
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classNameEntry"
                  },
                  content: "Class Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classNameEntry",
                    placeholder: "Class Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "FILE HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classFilenameEntry"
                  },
                  content: "File Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classFilenameEntry",
                    placeholder: "File Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "DESCRIPTION",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionContentEntry"
                  },
                  content: "Description"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 5,
                    id: "sectionContentEntry",
                    placeholder: "Enter Description Here"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "WATCHABLE",
              dom: "<div>",
              class: "form-check form-switch form-check-inline",
              children: [
                {
                  dom: "<input>",
                  class: "form-check-input",
                  attr: {
                    type: "checkbox",
                    id: "watchableEntry"
                  }
                },
                {
                  dom: "<label>",
                  class: "form-check-label",
                  attr: {
                    for: "watchableEntry"
                  },
                  content: "Watchable"
                },
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "WEIGHT",
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "weightEntry"
                  },
                  content: "Loading Weight (Default is 1)"
                },
                {
                  dom: "input",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "weightEntry",
                    value: 1
                  }
                }
              ]
            }));
          }
          break;
        case "prototype test":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS LISTING",
              dom: "<div>",
              class: "form-group",
              attr: { id: "classGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classListing"
                  },
                  content: "Parent Class"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "classListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ]
                }
              ]
            }));
            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              if (classes[i].tags.includes("prototype")) {
                $("#classListing").append(CONTENT_BUILDER({
                  dom: "option",
                  attr: {
                    value: classes[i].uid
                  },
                  content: classes[i].classHandle
                }));
              }
            }
          }
          break;
        case "public member":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS LISTING",
              dom: "<div>",
              class: "form-group",
              attr: { id: "classGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classListing"
                  },
                  content: "Parent Class"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "classListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ]
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "MEMBER NAME",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "memberNameEntry"
                  },
                  content: "Member Name"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "memberNameEntry",
                    placeholder: "Enter Member Name"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "MEMBER DEFINITION",
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "label",
                  attr: {
                    for: "memberDefinitionEntry"
                  },
                  content: "Member Definition"
                },
                {
                  dom: "textarea",
                  class: "form-control",
                  attr: {
                    "rows": 5,
                    id: "memberDefinitionEntry",
                    placeholder: "Enter Definition Here"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "MEMBER ARGUMENTS",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "memberArgsEntry"
                  },
                  content: "Member Arguments"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    id: "memberArgsEntry",
                    placeholder: "Enter Arguments Here"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "MEMBER CODE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "memberCodeEntry"
                  },
                  content: "Member Body Code"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 10,
                    id: "memberCodeEntry",
                    placeholder: "Enter Code Here"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "ORDER",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionOrderEntry"
                  },
                  content: "Order"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionOrderEntry",
                    placeholder: "1, 2, 3. . ."
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
                    }
                  }
                }
              ]
            }));
            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              $("#classListing").append(CONTENT_BUILDER({
                dom: "option",
                attr: {
                  value: classes[i].uid
                },
                content: classes[i].classHandle
              }));
            }
          }
          break;
        case "scene-container":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "PROTOTYPE NAMESPACE",
              dom: "div",
              class: "form-group",
              attr: { id: "prototypePathGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "prototypePathSelect"
                  },
                  content: "Path"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "prototypePathSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "bus"
                      },
                      content: "bus"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "graph"
                      },
                      content: "graph"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "ui"
                      },
                      content: "ui"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "custom"
                      },
                      content: "custom path"
                    }
                  ],
                  callback: {
                    change: {
                      args: "",
                      body: "FormListener.selectPrototypePath(arguments);"
                    }
                  }
                },
                {
                  dom: "input",
                  class: "form-control",
                  style: "display: none;",
                  attr: {
                    type: "text",
                    id: "prototypePathEntry",
                    placeholder: "Enter Class Path"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS TITLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classTitleEntry"
                  },
                  content: "Class Title"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classTitleEntry",
                    placeholder: "Enter Class Title"
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#classNameEntry\").val($(\"#classTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#classTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
                    }
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classNameEntry"
                  },
                  content: "Class Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classNameEntry",
                    placeholder: "Class Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "FILE HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classFilenameEntry"
                  },
                  content: "File Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classFilenameEntry",
                    placeholder: "File Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "DESCRIPTION",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionContentEntry"
                  },
                  content: "Description"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 5,
                    id: "sectionContentEntry",
                    placeholder: "Enter Description Here"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "SCENE KEY",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sceneKeyEntry"
                  },
                  content: "Scene Key"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sceneKeyEntry",
                    placeholder: "[MyAppConstants.SCENE_STATE]"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "WEIGHT",
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "weightEntry"
                  },
                  content: "Loading Weight (Default is 1)"
                },
                {
                  dom: "input",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "weightEntry",
                    value: 1
                  }
                }
              ]
            }));
          }
          break;
        case "singleton":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "SINGLETON NAMESPACE",
              dom: "div",
              class: "form-group",
              attr: { id: "singletonPathGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "singletonPathSelect"
                  },
                  content: "Path"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "singletonPathSelect" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "bus"
                      },
                      content: "bus"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "graph"
                      },
                      content: "graph"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "ui"
                      },
                      content: "ui"
                    },
                    {
                      dom: "<option>",
                      attr: {
                        "value": "custom"
                      },
                      content: "custom path"
                    }
                  ],
                  callback: {
                    change: {
                      args: "",
                      body: "FormListener.selectSingletonPath(arguments);"
                    }
                  }
                },
                {
                  dom: "input",
                  class: "form-control",
                  style: "display: none;",
                  attr: {
                    type: "text",
                    id: "singletonPathEntry",
                    placeholder: "Enter Class Path"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS TITLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classTitleEntry"
                  },
                  content: "Class Title"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classTitleEntry",
                    placeholder: "Enter Class Title"
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#classNameEntry\").val($(\"#classTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#classTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
                    }
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classNameEntry"
                  },
                  content: "Class Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classNameEntry",
                    placeholder: "Class Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "FILE HANDLE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classFilenameEntry"
                  },
                  content: "File Handle"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "classFilenameEntry",
                    placeholder: "File Handle",
                    "readonly": "readonly"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "DESCRIPTION",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionContentEntry"
                  },
                  content: "Description"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 5,
                    id: "sectionContentEntry",
                    placeholder: "Enter Description Here"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "WEIGHT",
              dom: "div",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "weightEntry"
                  },
                  content: "Loading Weight (Default is 1)"
                },
                {
                  dom: "input",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "weightEntry",
                    value: 1
                  }
                }
              ]
            }));
          }
          break;
        case "ui-scene":
          {
            { // FORM BUILDER
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "PROTOTYPE NAMESPACE",
                dom: "div",
                class: "form-group",
                attr: { id: "prototypePathGroup" },
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "prototypePathSelect"
                    },
                    content: "Path"
                  },
                  {
                    dom: "<select>",
                    class: "form-select",
                    attr: { id: "prototypePathSelect" },
                    children: [
                      {
                        dom: "<option>",
                        attr: {
                          "selected": true
                        },
                        content: ""
                      },
                      {
                        dom: "<option>",
                        attr: {
                          "value": "bus"
                        },
                        content: "bus"
                      },
                      {
                        dom: "<option>",
                        attr: {
                          "value": "graph"
                        },
                        content: "graph"
                      },
                      {
                        dom: "<option>",
                        attr: {
                          "value": "ui"
                        },
                        content: "ui"
                      },
                      {
                        dom: "<option>",
                        attr: {
                          "value": "custom"
                        },
                        content: "custom path"
                      }
                    ],
                    callback: {
                      change: {
                        args: "",
                        body: "FormListener.selectPrototypePath(arguments);"
                      }
                    }
                  },
                  {
                    dom: "input",
                    class: "form-control",
                    style: "display: none;",
                    attr: {
                      type: "text",
                      id: "prototypePathEntry",
                      placeholder: "Enter Class Path"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "INITIAL STATE",
                dom: "div",
                class: "form-group",
                attr: { id: "initialStateGroup" },
                children: [
                  {
                    dom: "label",
                    attr: {
                      for: "initialStateEntry"
                    },
                    content: "Initial State"
                  },
                  {
                    dom: "input",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "initialStateEntry",
                      placeholder: "MY_STATE_CONSTANT"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "GRID WIDTH",
                dom: "div",
                class: "form-group",
                attr: { id: "gridWidthGroup" },
                children: [
                  {
                    dom: "label",
                    attr: {
                      for: "gridWidthEntry"
                    },
                    content: "Alignment Grid Width"
                  },
                  {
                    dom: "input",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "gridWidthEntry",
                      placeholder: "1"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "GRID HEIGHT",
                dom: "div",
                class: "form-group",
                attr: { id: "gridHeightGroup" },
                children: [
                  {
                    dom: "label",
                    attr: {
                      for: "gridHeightEntry"
                    },
                    content: "Alignment Grid Height"
                  },
                  {
                    dom: "input",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "gridHeightEntry",
                      placeholder: "1"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "SCENE CONTAINER LISTING",
                dom: "<div>",
                class: "form-group",
                attr: { id: "sceneContainerGroup" },
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "sceneContainerListing"
                    },
                    content: "Scene Container"
                  },
                  {
                    dom: "<select>",
                    class: "form-select",
                    attr: { id: "sceneContainerListing" },
                    children: [
                      {
                        dom: "<option>",
                        attr: {
                          "selected": true
                        },
                        content: ""
                      }
                    ]
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "CLASS TITLE",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "classTitleEntry"
                    },
                    content: "Class Title"
                  },
                  {
                    dom: "<input>",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "classTitleEntry",
                      placeholder: "Enter Class Title"
                    },
                    callback: {
                      keyup: {
                        args: "",
                        body: "$(\"#classNameEntry\").val($(\"#classTitleEntry\").val().replace(/ /gi, \"\").replace(/-/gi, \"\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"_\")); $(\"#classFilenameEntry\").val($(\"#classTitleEntry\").val().toLowerCase().replace(/ /gi, \"-\").replace(/!/gi, \"\").replace(/\\?/gi, \"\").replace(/\\&/gi, \"-\"));"
                      }
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "CLASS HANDLE",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "classNameEntry"
                    },
                    content: "Class Handle"
                  },
                  {
                    dom: "<input>",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "classNameEntry",
                      placeholder: "Class Handle",
                      "readonly": "readonly"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "FILE HANDLE",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "classFilenameEntry"
                    },
                    content: "File Handle"
                  },
                  {
                    dom: "<input>",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "classFilenameEntry",
                      placeholder: "File Handle",
                      "readonly": "readonly"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "DESCRIPTION",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "sectionContentEntry"
                    },
                    content: "Description"
                  },
                  {
                    dom: "<textarea>",
                    class: "form-control",
                    attr: {
                      "rows": 5,
                      id: "sectionContentEntry",
                      placeholder: "Enter Description Here"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "WEIGHT",
                dom: "div",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "weightEntry"
                    },
                    content: "Loading Weight (Default is 1)"
                  },
                  {
                    dom: "input",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "weightEntry",
                      value: 0.5
                    }
                  }
                ]
              }));
            }
            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              if (classes[i].tags.includes("scene-container")) {
                $("#sceneContainerListing").append(CONTENT_BUILDER({
                  dom: "option",
                  attr: {
                    value: classes[i].uid
                  },
                  content: classes[i].classHandle
                }));
              }
            }
          }
          break;
        case "ui-scene test":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "CLASS LISTING",
              dom: "<div>",
              class: "form-group",
              attr: { id: "classGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "classListing"
                  },
                  content: "Parent Class"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "classListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ]
                }
              ]
            }));
            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              if (classes[i].tags.includes("ui-scene")) {
                $("#classListing").append(CONTENT_BUILDER({
                  dom: "option",
                  attr: {
                    value: classes[i].uid
                  },
                  content: classes[i].classHandle
                }));
              }
            }
          }
          break;
        case "unit test":
          {
            { // FORM BUILDER
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "CLASS LISTING",
                dom: "<div>",
                class: "form-group",
                attr: { id: "classGroup" },
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "classListing"
                    },
                    content: "Parent Class"
                  },
                  {
                    dom: "<select>",
                    class: "form-select",
                    attr: { id: "classListing" },
                    children: [
                      {
                        dom: "<option>",
                        attr: {
                          "selected": true
                        },
                        content: ""
                      }
                    ]
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "MEMBER HEADER",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "memberHeaderEntry"
                    },
                    content: "Test Header"
                  },
                  {
                    dom: "<input>",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "memberHeaderEntry",
                      placeholder: "Test Header"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "MEMBER DEFINITION",
                dom: "div",
                class: "form-group",
                children: [
                  {
                    dom: "label",
                    attr: {
                      for: "memberDefinitionEntry"
                    },
                    content: "Member Definition"
                  },
                  {
                    dom: "textarea",
                    class: "form-control",
                    attr: {
                      "rows": 5,
                      id: "memberDefinitionEntry",
                      placeholder: "Enter Definition Here"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "MEMBER ARGUMENTS",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "memberArgsEntry"
                    },
                    content: "Member Arguments"
                  },
                  {
                    dom: "<input>",
                    class: "form-control",
                    attr: {
                      id: "memberArgsEntry",
                      placeholder: "Enter Arguments Here"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "MEMBER CODE",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "memberCodeEntry"
                    },
                    content: "Member Body Code"
                  },
                  {
                    dom: "<textarea>",
                    class: "form-control",
                    attr: {
                      "rows": 10,
                      id: "memberCodeEntry",
                      placeholder: "Enter Code Here"
                    }
                  }
                ]
              }));
              $("#designSectionTemplateForm").append(CONTENT_BUILDER({
                comment: "ORDER",
                dom: "<div>",
                class: "form-group",
                children: [
                  {
                    dom: "<label>",
                    attr: {
                      for: "sectionOrderEntry"
                    },
                    content: "Order"
                  },
                  {
                    dom: "<input>",
                    class: "form-control",
                    attr: {
                      type: "text",
                      id: "sectionOrderEntry",
                      placeholder: "1, 2, 3. . ."
                    },
                    callback: {
                      keyup: {
                        args: "",
                        body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
                      }
                    }
                  }
                ]
              }));
            }            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              if (classes[i].tags.includes("prototype test") || classes[i].tags.includes("ui-scene test")) {
                $("#classListing").append(CONTENT_BUILDER({
                  dom: "option",
                  attr: {
                    value: classes[i].uid
                  },
                  content: classes[i].classHandle
                }));
              }
            }
          }
          break;
        case "view template":
          {
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "UI SCENE LISTING",
              dom: "<div>",
              class: "form-group",
              attr: { id: "uiSceneGroup" },
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "uiSceneListing"
                  },
                  content: "UI Scene"
                },
                {
                  dom: "<select>",
                  class: "form-select",
                  attr: { id: "uiSceneListing" },
                  children: [
                    {
                      dom: "<option>",
                      attr: {
                        "selected": true
                      },
                      content: ""
                    }
                  ]
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "VIEW KEY",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "keyEntry"
                  },
                  content: "View Key"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "keyEntry",
                    placeholder: "MY_VIEW_STATE"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "VIEW TEMPLATE",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "viewCodeEntry"
                  },
                  content: "View Template"
                },
                {
                  dom: "<textarea>",
                  class: "form-control",
                  attr: {
                    "rows": 10,
                    id: "viewCodeEntry",
                    placeholder: "View Template"
                  }
                }
              ]
            }));
            $("#designSectionTemplateForm").append(CONTENT_BUILDER({
              comment: "ORDER",
              dom: "<div>",
              class: "form-group",
              children: [
                {
                  dom: "<label>",
                  attr: {
                    for: "sectionOrderEntry"
                  },
                  content: "Order"
                },
                {
                  dom: "<input>",
                  class: "form-control",
                  attr: {
                    type: "text",
                    id: "sectionOrderEntry",
                    placeholder: "1, 2, 3. . ."
                  },
                  callback: {
                    keyup: {
                      args: "",
                      body: "$(\"#sectionOrderEntry\").val($(\"#sectionOrderEntry\").val().replace(/[^0-9\\.]/g, \"\"));"
                    }
                  }
                }
              ]
            }));
            
            let classes = ProjectManager.getClasses();
            classes.sort(function(a, b) {
              let aType, bType;
              for (let i = a.tags.length - 1; i >= 0; i--) {
                if (a.tags[i] === "class") {
                  continue;
                }
                aType = a.tags[i];
              }
              for (let i = b.tags.length - 1; i >= 0; i--) {
                if (b.tags[i] === "class") {
                  continue;
                }
                bType = b.tags[i];
              }
              let c = 0;
              if (aType < bType) {
                c = 1;
              } else if (aType > bType) {
                c = -1;
              } else {
                if (a.classHandle < b.classHandle) {
                  c = 1;
                } else if (a.classHandle > b.classHandle) {
                  c = -1;
                }
              }
              return c;
            });
            for (let i = classes.length - 1; i >= 0; i--) {
              if (classes[i].tags.includes("ui-scene")) {
                $("#uiSceneListing").append(CONTENT_BUILDER({
                  dom: "option",
                  attr: {
                    value: classes[i].uid
                  },
                  content: classes[i].classHandle
                }));
              }
            }
          }
          break;
      }
    },
    selectPrototypePath: function() {
      switch ($("#prototypePathSelect option:selected").val()) {
        case "custom": 
          $("#prototypePathEntry").show();
          break;
        default:
          $("#prototypePathEntry").hide();
          break;
      }
    },
    selectSingletonPath: function() {
      switch ($("#singletonPathSelect option:selected").val()) {
        case "custom": 
          $("#singletonPathEntry").show();
          break;
        default:
          $("#singletonPathEntry").hide();
          break;
      }
    },
    selectClassTemplate: function() {
      switch ($("#templateSelect option:selected").val()) {
        case "singleton":
          $("#sectionTitleEntry").removeAttr("readonly");
          $("#prototypePathGroup").hide();
          $("#singletonPathGroup").show();
          $("#gridWidthGroup").hide();
          $("#gridHeightGroup").hide();
          break;
        case "prototype":
          $("#sectionTitleEntry").removeAttr("readonly");
          $("#prototypePathGroup").show();
          $("#singletonPathGroup").hide();
          $("#gridWidthGroup").hide();
          $("#gridHeightGroup").hide();
          break;
        case "game":
          $("#sectionTitleEntry").val("Game");
          $("#classNameEntry").val("Game");
          $("#classFilenameEntry").val("game");
          $("#sectionTitleEntry").val("Game");
          $("#sectionTitleEntry").attr("readonly", "readonly");
          $("#prototypePathGroup").hide();
          $("#singletonPathGroup").hide();
          $("#gridWidthGroup").hide();
          $("#gridHeightGroup").hide();
          break;
        case "scene-container":
          $("#sectionTitleEntry").removeAttr("readonly");
          $("#prototypePathGroup").hide();
          $("#singletonPathGroup").hide();
          $("#gridWidthGroup").hide();
          $("#gridHeightGroup").hide();
          break;
        case "ui-scene":
          $("#sectionTitleEntry").removeAttr("readonly");
          $("#prototypePathGroup").show();
          $("#singletonPathGroup").hide();
          $("#gridWidthGroup").show();
          $("#gridHeightGroup").show();
          $("#sceneContainerGroup").hide();
          $("#weightEntry").val("0.5");
          break;
        default:
          $("#sectionTitleEntry").removeAttr("readonly");
          $("#prototypePathGroup").hide();
          $("#singletonPathGroup").hide();
          $("#gridWidthGroup").hide();
          $("#gridHeightGroup").hide();
          break;
      }
    },
    selectCodeInjectionClass: function() {
      // grab the selected class
      let entry = ProjectManager.getEntryByUid($("#classListing option:selected").val());
      // update form based on class type
      $("#injectionListing").html("");
      $("#injectionListing").append(CONTENT_BUILDER({
        dom: "<option>",
        attr: {
          "selected": true
        },
        content: ""
      }));
      if (typeof(entry) !== "undefined") {
        { // prototype, scene, or singleton
          if (entry.tags.includes("prototype")
              || entry.tags.includes("game")
              || entry.tags.includes("scene")
              || entry.tags.includes("scene-container")
              || entry.tags.includes("scene-controller")
              || entry.tags.includes("singleton")
              || entry.tags.includes("ui-scene")) {
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "required import"
              },
              content: "Required Imports"
            }));
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "private field"
              },
              content: "Private Field"
            }));
            if (!entry.tags.includes("scene-container")) {
              $("#injectionListing").append(CONTENT_BUILDER({
                dom: "<option>",
                attr: {
                  "value": "private dictionary 0"
                },
                content: "Private Dictionary Member (1st slot)"
              }));
            }
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "private dictionary key-value 0"
              },
              content: "Private Dictionary Key-Value Pair (1st slot)"
            }));
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "private dictionary 1"
              },
              content: "Private Dictionary Member (2nd slot)"
            }));
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "private dictionary key-value 1"
              },
              content: "Private Dictionary Key-Value Pair (2nd slot)"
            }));
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "public property"
              },
              content: "Public Property"
            }));
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "public member"
              },
              content: "Public Member"
            }));
            { // GAME
              if (entry.tags.includes("game")) {
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "preboot"
                  },
                  content: "PreBoot Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "postboot"
                  },
                  content: "PostBoot Method Body Code"
                }));
              }
            }
            { // PROTOTYPE
              if (entry.tags.includes("prototype")) {
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "constructor body"
                  },
                  content: "Constructor Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "inheritance"
                  },
                  content: "Prototype Class Inheritance"
                }));
              }
            }
            { // SCENE
              if (entry.tags.includes("scene")) {
              }
            }
            { // SCENE CONTAINER
              if (entry.tags.includes("scene-container")) {
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "init"
                  },
                  content: "Init Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "preload"
                  },
                  content: "Preload Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "create"
                  },
                  content: "Create Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "update"
                  },
                  content: "Update Method Body Code"
                }));
              }
            }
            { // SCENE CONTROLLER
              if (entry.tags.includes("scene-controller")) {
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "scene group"
                  },
                  content: "Scene Group"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "init"
                  },
                  content: "Init Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "preload"
                  },
                  content: "Preload Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "create"
                  },
                  content: "Create Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "update"
                  },
                  content: "Update Method Body Code"
                }));
              }
            }
            { // UI SCENE
              if (entry.tags.includes("ui-scene")) {
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "constructor body"
                  },
                  content: "Constructor Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "start scene"
                  },
                  content: "Start Scene Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "init"
                  },
                  content: "Init Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "preload"
                  },
                  content: "Preload Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "create"
                  },
                  content: "Create Method Body Code"
                }));
                $("#injectionListing").append(CONTENT_BUILDER({
                  dom: "<option>",
                  attr: {
                    "value": "update"
                  },
                  content: "Update Method Body Code"
                }));
              }
            }
          }
        }
        { // test
          if (entry.tags.includes("prototype test") || entry.tags.includes("ui-scene test")) {
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "required import"
              },
              content: "Required Imports"
            }));
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "before all"
              },
              content: "Before All"
            }));
          }
        }
        { // constants
          if (entry.tags.includes("app-constants")) {
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "group properties"
              },
              content: "Add Group Property"
            }));
          }
        }
        { // config
          if (entry.tags.includes("app-config")) {   
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "required import"
              },
              content: "Required Imports"
            }));     
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "prototype requires"
              },
              content: "Prototype Required Classes"
            }));
            $("#injectionListing").append(CONTENT_BUILDER({
              dom: "<option>",
              attr: {
                "value": "singleton requires"
              },
              content: "Singleton Required Classes"
            }));
          }
        }
      }
    },
    selectCodeInjectionType: function() {
      $("#codeTypeContainer").html("");
      if (!_CODE_INJECTION_BUILDERS.hasOwnProperty($("#injectionListing option:selected").val())) {
        console.error("Missing key", $("#injectionListing option:selected").val());
      }
      _CODE_INJECTION_BUILDERS[$("#injectionListing option:selected").val()]();
    },
  }
} ());