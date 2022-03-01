/*
if (typeof(module) !== "undefined") {
  var { WizardrySpecialsceneActionDispatcher } = require("../scenes/specials-scene/wizardry-specials-scene-action-dispatcher");
  var { WizardrySpecialsSceneEventHandler } = require("../scenes/specials-scene/wizardry-specials-scene-event-handler");
  var { WizardrySpecialsSceneInterface } = require("../scenes/specials-scene/wizardry-specials-scene-interface");
}
*/

import { WizardryAlignment } from "./wizardry-constants.js";
import { WizardryAttribute } from "./wizardry-constants.js";
import { WizardryAttributeDescriptors } from "./wizardry-constants.js";
import { WizardryCharacterClass } from "./wizardry-constants.js";
import { WizardryCharacterStatus } from "./wizardry-constants.js";
import { WizardryConstants } from "./wizardry-constants.js";
import { WizardryObjectType } from "./wizardry-constants.js";
import { WizardryRace } from "./wizardry-constants.js";
import { WizardrySpel012 } from "./wizardry-constants.js";
import { WizardrySpell } from "./wizardry-constants.js";
import { WizardrySquare } from "./wizardry-constants.js";
import { WizardryWall } from "./wizardry-constants.js";
import { WizardryXgoto } from "./wizardry-constants.js";
import { WizardryZscn } from "./wizardry-constants.js";
/**
 * @class Utility class to circumvent cyclical dependencies in the architecture.
 */
const WizardryConfig = (function() {
  /** @private debugging flag */
  let _debug = false;
  return {
    /**
     * Initializes the class configurations.
     */
    init: function() {

      /*
      WizardrySpecialsSceneInterface.prototype.SpecialsSceneEventHandler = WizardrySpecialsSceneEventHandler;
      WizardrySpecialsSceneInterface.prototype.SpecialsSceneEventHandler = WizardrySpecialsSceneEventHandler;
      */
      { // ENUM - Object Type
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryObjectTypeInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryObjectTypeInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryObjectTypeInner, Object.getPrototypeOf(WizardryObjectType));
        // iterate through the enum
        for (let prop in globalJson.enums["Object Type"]) {
          let jsonObject = globalJson.enums["Object Type"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryObjectType,
            prop,
            {
              value: Object.freeze(new WizardryObjectTypeInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryObjectType,
            jsonObject.title,
            {
              value: WizardryObjectType[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryObjectType,
            [jsonObject.index],
            {
              value: WizardryObjectType[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryObjectType, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryObjectType"].join("");
            },
          },
        });
        Object.freeze(WizardryObjectType);
      }
      { // ENUM - Square
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardrySquareInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardrySquareInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardrySquareInner, Object.getPrototypeOf(WizardrySquare));
        // iterate through the enum
        for (let prop in globalJson.enums["Square"]) {
          let jsonObject = globalJson.enums["Square"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardrySquare,
            prop,
            {
              value: Object.freeze(new WizardrySquareInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardrySquare,
            jsonObject.title,
            {
              value: WizardrySquare[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardrySquare,
            [jsonObject.index],
            {
              value: WizardrySquare[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardrySquare, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardrySquare"].join("");
            },
          },
        });
        Object.freeze(WizardrySquare);
      }
      { // ENUM - Wall
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryWallInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryWallInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryWallInner, Object.getPrototypeOf(WizardryWall));
        // iterate through the enum
        for (let prop in globalJson.enums["Wall"]) {
          let jsonObject = globalJson.enums["Wall"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryWall,
            prop,
            {
              value: Object.freeze(new WizardryWallInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryWall,
            jsonObject.title,
            {
              value: WizardryWall[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryWall,
            [jsonObject.index],
            {
              value: WizardryWall[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryWall, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryWall"].join("");
            },
          },
        });
        Object.freeze(WizardryWall);
      }
      { // ENUM - Xgoto
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryXgotoInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryXgotoInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryXgotoInner, Object.getPrototypeOf(WizardryXgoto));
        // iterate through the enum
        for (let prop in globalJson.enums["Xgoto"]) {
          let jsonObject = globalJson.enums["Xgoto"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryXgoto,
            prop,
            {
              value: Object.freeze(new WizardryXgotoInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryXgoto,
            jsonObject.title,
            {
              value: WizardryXgoto[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryXgoto,
            [jsonObject.index],
            {
              value: WizardryXgoto[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryXgoto, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryXgoto"].join("");
            },
          },
        });
        Object.freeze(WizardryXgoto);
      }
      { // ENUM - Alignment
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryAlignmentInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["description"] = parameterObject["description"];
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryAlignmentInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryAlignmentInner, Object.getPrototypeOf(WizardryAlignment));
        // iterate through the enum
        for (let prop in globalJson.enums["Alignment"]) {
          let jsonObject = globalJson.enums["Alignment"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryAlignment,
            prop,
            {
              value: Object.freeze(new WizardryAlignmentInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryAlignment,
            jsonObject.title,
            {
              value: WizardryAlignment[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryAlignment,
            [jsonObject.index],
            {
              value: WizardryAlignment[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryAlignment, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryAlignment"].join("");
            },
          },
        });
        Object.freeze(WizardryAlignment);
      }
      { // ENUM - Attribute
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryAttributeInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["description"] = parameterObject["description"];
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryAttributeInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryAttributeInner, Object.getPrototypeOf(WizardryAttribute));
        // iterate through the enum
        for (let prop in globalJson.enums["Attribute"]) {
          let jsonObject = globalJson.enums["Attribute"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryAttribute,
            prop,
            {
              value: Object.freeze(new WizardryAttributeInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryAttribute,
            jsonObject.title,
            {
              value: WizardryAttribute[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryAttribute,
            [jsonObject.index],
            {
              value: WizardryAttribute[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryAttribute, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryAttribute"].join("");
            },
          },
        });
        Object.freeze(WizardryAttribute);
      }
      { // ENUM - Character Class
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryCharacterClassInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["description"] = parameterObject["description"];
          this["name"] = parameterObject["name"];
          this["nextLevel"] = parameterObject["nextLevel"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryCharacterClassInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryCharacterClassInner, Object.getPrototypeOf(WizardryCharacterClass));
        // iterate through the enum
        for (let prop in globalJson.enums["Character Class"]) {
          let jsonObject = globalJson.enums["Character Class"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryCharacterClass,
            prop,
            {
              value: Object.freeze(new WizardryCharacterClassInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryCharacterClass,
            jsonObject.title,
            {
              value: WizardryCharacterClass[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryCharacterClass,
            [jsonObject.index],
            {
              value: WizardryCharacterClass[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryCharacterClass, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryCharacterClass"].join("");
            },
          },
        });
        Object.freeze(WizardryCharacterClass);
      }
      { // ENUM - Character Status
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryCharacterStatusInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["description"] = parameterObject["description"];
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryCharacterStatusInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryCharacterStatusInner, Object.getPrototypeOf(WizardryCharacterStatus));
        // iterate through the enum
        for (let prop in globalJson.enums["Character Status"]) {
          let jsonObject = globalJson.enums["Character Status"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryCharacterStatus,
            prop,
            {
              value: Object.freeze(new WizardryCharacterStatusInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryCharacterStatus,
            jsonObject.title,
            {
              value: WizardryCharacterStatus[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryCharacterStatus,
            [jsonObject.index],
            {
              value: WizardryCharacterStatus[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryCharacterStatus, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryCharacterStatus"].join("");
            },
          },
        });
        Object.freeze(WizardryCharacterStatus);
      }
      { // ENUM - Race
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryRaceInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this["description"] = parameterObject["description"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryRaceInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryRaceInner, Object.getPrototypeOf(WizardryRace));
        // iterate through the enum
        for (let prop in globalJson.enums["Race"]) {
          let jsonObject = globalJson.enums["Race"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryRace,
            prop,
            {
              value: Object.freeze(new WizardryRaceInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryRace,
            jsonObject.title,
            {
              value: WizardryRace[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryRace,
            [jsonObject.index],
            {
              value: WizardryRace[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryRace, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryRace"].join("");
            },
          },
        });
        Object.freeze(WizardryRace);
      }
      { // ENUM - Spel012
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardrySpel012Inner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardrySpel012Inner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardrySpel012Inner, Object.getPrototypeOf(WizardrySpel012));
        // iterate through the enum
        for (let prop in globalJson.enums["Spel012"]) {
          let jsonObject = globalJson.enums["Spel012"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardrySpel012,
            prop,
            {
              value: Object.freeze(new WizardrySpel012Inner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardrySpel012,
            jsonObject.title,
            {
              value: WizardrySpel012[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardrySpel012,
            [jsonObject.index],
            {
              value: WizardrySpel012[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardrySpel012, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardrySpel012"].join("");
            },
          },
        });
        Object.freeze(WizardrySpel012);
      }
      { // ENUM - Zscn
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardryZscnInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardryZscnInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardryZscnInner, Object.getPrototypeOf(WizardryZscn));
        // iterate through the enum
        for (let prop in globalJson.enums["Zscn"]) {
          let jsonObject = globalJson.enums["Zscn"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardryZscn,
            prop,
            {
              value: Object.freeze(new WizardryZscnInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryZscn,
            jsonObject.title,
            {
              value: WizardryZscn[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardryZscn,
            [jsonObject.index],
            {
              value: WizardryZscn[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardryZscn, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardryZscn"].join("");
            },
          },
        });
        Object.freeze(WizardryZscn);
      }
      { // ENUM - Spell
        let index = 0;
        /**
         * The private, actual constructor
         * @param {Object} parameterObject 
         */
        function WizardrySpellInner(parameterObject) {
          this.title = parameterObject.title;
          this.index = parameterObject.index;
          this["name"] = parameterObject["name"];
          this["translation"] = parameterObject["translation"];
          this["clazz"] = parameterObject["clazz"];
          this["level"] = parameterObject["level"];
          this["type"] = parameterObject["type"];
          this["spel012"] = WizardrySpel012.fromString(parameterObject["Spel012"]);
          this["aoe"] = parameterObject["aoe"];
          this["description"] = parameterObject["description"];
          this.toString = function() {
            return parameterObject.title;
          };
        }
        { // enclosure for WizardrySpellInner        
        }
        // Setting the inner class to be a subclass of the outer class
        Object.setPrototypeOf(WizardrySpellInner, Object.getPrototypeOf(WizardrySpell));
        // iterate through the enum
        for (let prop in globalJson.enums["Spell"]) {
          let jsonObject = globalJson.enums["Spell"][prop];
          if (typeof(jsonObject.title) === "undefined") {
            jsonObject.title = prop.toUpperCase().replace(/ /gi, "_").replace(/\(/gi, "").replace(/\)/gi, "").replace(/&/gi, "").replace(/-/gi, "_");
          }
          jsonObject.index = index++;
          Object.defineProperty(
            WizardrySpell,
            prop,
            {
              value: Object.freeze(new WizardrySpellInner(jsonObject)),
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardrySpell,
            jsonObject.title,
            {
              value: WizardrySpell[prop],
              enumerable: true
            }
          );
          Object.defineProperty(
            WizardrySpell,
            [jsonObject.index],
            {
              value: WizardrySpell[prop],
              enumerable: true
            }
          );
        }
        // Static methods & properties
        Object.defineProperties(WizardrySpell, {
          values: {
            get: function () {
              let arr = [], ids = {};
              for (let prop in this) {
                if (!ids.hasOwnProperty(this[prop].index)) {
                  if (isNaN(parseInt(prop))) {
                    arr.push(this[prop]);
                    ids[this[prop].index] = 0;
                  }
                }
              }
              return arr;
            },
          },
          fromString: {
            value: function (name) {
              // Works assuming the name property of the enum is identical to the variable's name.
              // Alternatively, you can search the .values array
              const value = this[name];
              if (value) {
                return value;
              }
              if (_debug) {
                console.trace(name);
              }
              throw ["Illegal argument passed to fromString(): '", name, "' does not correspond to any instance of the enum WizardrySpell"].join("");
            },
          },
        });
        Object.freeze(WizardrySpell);
      }
    },
  };
} ());

export { WizardryConfig };