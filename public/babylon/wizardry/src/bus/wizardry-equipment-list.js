import { WizardryObject } from "./wizardry-object.js";

/**
 * @class The equipment list.
 * @param {object} parameterObject optional initialization parameters
 */
class WizardryEquipmentList {
  constructor(parameterObject) {
    /** @private the roster */
    this._list = {};
  }
  /** Gets a copy of the character roster. */
  get list() {
    let r = [];
    let keys = Object.keys(this._list);
    for (let i = 0, li = keys.length; i < li; i++) {
      r.push(this._list[keys[i]]);
    }
    return r;
  }
  /**
   * Gets the object instance associated with the refId.
   * @param {Number} refId the reference id
   * @returns {WizardryObject} the object, or undefined if no object was found
   */
  getEquipmentItem(refId) {
    return this._list[refId];
  }
  /**
   * Gets the full list of item ids.
   * @returns {Array} the full list of item ids
   */
  getIds() {
    let keys = Object.keys(this._list);
    keys.sort(function(a, b) {
      let c = 0;
      if (parseInt(a) < parseInt(b)) {
        c = -1;
      } else if (parseInt(a) > parseInt(b)) {
        c = 1;
      }
    });
    return keys;
  }
  /**
   * Initializes the equipment list.
   * @param {Array} list a list of WizardryObject in JSON format
   */
  init(list) {
    this._list = {};
    for (let i = list.length - 1; i >= 0; i--) {
      let object = WizardryObject.fromJson(list[i]);
      this._list[list[i]._id] = object;
    }
  }
};
export { WizardryEquipmentList };