/** flag for a GET call to load characters. */
const TYPE_LOAD_CHARACTERS = 0;
/** flag for a POST call to add to the libraries. */
const TYPE_CREATE_PROJECT = 1;
/** flag for a GET call to load a project. */
const TYPE_LOAD_PROJECT = 2;
/** flag for a PUT call to update the character roster. */
const TYPE_UPDATE_ROSTER = 3;
/** flag for a POST call to generate the phaser project. */
const TYPE_CREATE_PHASER = 4;
/** flag for a GET call to load equipment. */
const TYPE_LOAD_EQUIPMENT = 5;
/** flag for a GET call to load wizardry maps. */
const TYPE_LOAD_WIZARDRY_MAPS = 6;
/**
 * @class Manager class for handling the library data.
 */
const WizardryDataManager = (function() {
  /** @private the list of game entries */
  let _list = [];
  /**
   * Creates an aysnchronous call to express to perform an operation that matches the object parameters.
   * @param {string} obj the search object parameters; can contain a specific document id, a list of tags, a place id
   * @returns {jqXHR}
   */
  let ajaxCall = function (obj) {
    let type = TYPE_LOAD_CHARACTERS;
    let callObj = { type: "GET", cache: false, async: obj.async };
    if (obj.hasOwnProperty("type")) {
      type = obj.type;
    }
    switch (type) {
      case TYPE_LOAD_CHARACTERS:
        callObj.url = "/wizardry/characters";
        callObj.dataType = "json";
        callObj.contentType = "application/json";
        console.log("~~~~~~~~get character data", callObj);
        break;
      case TYPE_LOAD_EQUIPMENT:
        callObj.url = "/wizardry/equipment";
        callObj.dataType = "json";
        callObj.contentType = "application/json";
        console.log("~~~~~~~~get equipment data", callObj);
        break;
      case TYPE_LOAD_WIZARDRY_MAPS:
        callObj.url = "/wizardry/maps";
        callObj.dataType = "json";
        callObj.contentType = "application/json";
        console.log("~~~~~~~~get map data", callObj);
        break;
      case TYPE_CREATE_PROJECT:
        callObj.url = "/library/data";
        callObj.data = JSON.stringify(obj.data);
        callObj.type = "POST";
        callObj.dataType = "json";
        callObj.contentType = "application/json";
        console.log("~~~~~~~~add library data",callObj);
        break;
      case TYPE_LOAD_PROJECT:
        callObj.url = ["/library/data/", obj.namespace].join("");
        callObj.dataType = "json";
        callObj.contentType = "application/json";
        console.log("~~~~~~~~get project data",callObj);
        break;
      case TYPE_UPDATE_ROSTER:
        callObj.url = "/wizardry/roster";
        callObj.data = JSON.stringify(obj.data);
        callObj.type = "PUT";
        callObj.dataType = "json";
        callObj.contentType = "application/json";
        console.log("~~~~~~~~update roster data",callObj);
        break;
    }
    // debug - ajax service call
    return $.ajax(callObj);
  };
  /**
   * Builds the game libraries.
   * @param {Array} promises a list of promises
   * @param {Date} startAjax the time the ajax calls began
   */
  let buildLibraries = function(promises, startAjax) {
    let endAjax = Date.now();
    let time = endAjax - startAjax;
    console.log("**buildLibraries** took " + time + "ms for initial promise to resolve", promises.length);
    for (let i = 0, l = promises.length; i < l; i++) {
      if (typeof promises[i] === "string" || promises[i] instanceof String) {
        console.log("string")
      } else {
        if (promises[i].hasOwnProperty("apps")) {
          console.log("library loaded",promises[i])
          // app library loaded
          if (promises[i].apps.length > 0) {
            _list = promises[i].apps;
            // clear dropdown menu of games
            $("#gameListMenu").html("");
            for (let i = 0, li = _list.length; i < li; i++) {
              let $a = $("<a>", {
                "class": "dropdown-item",
                "val": _list[i].title,
                "href": "#"
              });
              $a.html(_list[i].title);
              $a.on("click", { "namespace": _list[i].namespace }, LibraryManager.loadProject);
              $("#gameListMenu").append($("<li>").append($a));
            }
          } else {
            $("#addFormModal").show({ "backdrop": "static" });
          }
        }
      }
    }
  }
  /**
   * 
   * @param {Array} promises a list of promises
   * @param {Function} callback a callback function. can be undefined or null
   * @returns 
   */
  let some = function(promises, callback) {
    let deferred = $.Deferred(), r = [], numPromises = promises.length;
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(function (resolved) {
        r.push(resolved);
      }, function (rejected) {
        r.push(rejected);
      }).always(function (res) {
        numPromises--;
        if (!numPromises) {
          if (typeof callback !== "undefined") {
            deferred.resolve(r, callback);
          } else {
            deferred.resolve(r);
          }
        }
      });
    }
    return deferred.promise();
  }
  return {
    /**
     * Loads all characters that were created.
     * @param {Object} callback the callback function
     * @returns true if a project of the same name was already created; false otherwise
     */
    loadCharacters: function(callback) {
      let loadItems = [
        { "type": TYPE_LOAD_CHARACTERS, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(callback);
    },
    /**
     * Loads all equipment that were created.
     * @param {Object} callback the callback function
     * @returns true if a project of the same name was already created; false otherwise
     */
    loadEquipment: function(callback) {
      let loadItems = [
        { "type": TYPE_LOAD_EQUIPMENT, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(callback);
    },
    /**
     * Loads all maps that were created.
     * @param {Object} callback the callback function
     * @returns true if a project of the same name was already created; false otherwise
     */
    loadMaps: function(callback) {
      let loadItems = [
        { "type": TYPE_LOAD_WIZARDRY_MAPS, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(callback);
    },
    /**
     * Updates a project.
     * @param {Object} data the project data
     * @param {Function} callback the callback function
     */
    updateRoster: function(data, callback) {
      let loadItems = [
        { "type": TYPE_UPDATE_ROSTER, "data": data, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(callback);
    },
    /**
     * Updates a project.
     * @param {Object} data the project data
     * @param {Function} callback the callback function
     */
    updateRoster: function(data, callback) {
      let loadItems = [
        { "type": TYPE_UPDATE_ROSTER, "data": data, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(callback);
    },



    /**
     * Creates a project.
     * @param {Object} data the project data
     */
    "createProject": function(data) {
      let loadItems = [
        { "type": TYPE_CREATE_PROJECT, "data": data, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(this.loadLibraries);
    },
    /**
     * Updates a project.
     * @param {Object} data the project data
     * @param {Function} callback the callback function
     */
    "generatePhaserProject": function(data) {
      let loadItems = [
        { "type": TYPE_CREATE_PHASER, "data": data, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(function() {});
    },
    /**
     * Determines if a project of the same name was already created.
     * @param {String} project the project's name
     * @returns true if a project of the same name was already created; false otherwise
     */
    "hasProject": function(project) {
      let has = false;
      for (let i = _list.length - 1; i >= 0; i--) {
        if (_list[i].title === project) {
          has = true;
          break;
        }
      }
      return has;
    },
    "loadLibraries": function() {
      let loadItems = [
        { "type": TYPE_LOAD_LIBRARIES, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(buildLibraries);
    },
    /**
     * Updates a project.
     * @param {Object} data the project data
     * @param {Function} callback the callback function
     */
    "updateProject": function(data, callback) {
      let loadItems = [
        { "type": TYPE_UPDATE_PROJECT, "data": data, "async": true }
      ];
      let mappedAjaxCalls = loadItems.map(ajaxCall);
      some(mappedAjaxCalls, Date.now()).then(callback);
    },
  }
} ());

export { WizardryDataManager };