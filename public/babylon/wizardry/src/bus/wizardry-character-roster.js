import { WizardryCharacter }   from "../bus/wizardry-character.js";
import { WizardryDataManager } from "../services/wizardry-data-manager.js";
import { Watchable }           from "../../../assets/js/base.js";

/**
 * @class The character roster.
 */
class WizardryCharacterRoster extends Watchable {
  /**
   * @class Creates a new WizardryCharacterRoster instance.
   * @param {object} parameterObject optional initialization parameters
   */
  constructor(parameterObject) {
    super();
    /** @private the roster */
    this._roster = {};
  }
  /** Gets a copy of the character roster. */
  get roster() {
    /**
     * the list opf characters
     * @type {WizardryCharacter[]}
     */
    const r = [];
    let keys = Object.keys(this._roster);
    for (let i = 0, li = keys.length; i < li; i++) {
      r.push(this._roster[keys[i]]);
    }
    r.sort(function(a, b) {
      let c = 0;
      if (a.timeCreated < b.timeCreated) {
        c = -1;
      } else if (a.timeCreated > b.timeCreated) {
        c = 1;
      }
      return c;
    });
    return r;
  }
  /**
   * Adds a character to the roster. The roster is immediately saved afterwards.
   * @param {WizardryCharacter} character the character being added
   */
  addToRoster(character) {
    this._roster[character.refId] = character;
    let arr = [];
    for (let prop in this._roster) {
      arr.push(this._roster[prop]);
    }
    if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
      WizardryDataManager.updateRoster(arr, () => { });
    }
  }
  /**
   * Gets the character instance associated with the refId.
   * @param {string} refId the reference id
   * @returns {WizardryCharacter} the character, or undefined if no character was found
   */
  getCharacterRecord(refId) {
    return this._roster[refId];
  }
  init(roster) {
    for (let i = roster.length - 1; i >= 0; i--) {
      let character = WizardryCharacter.fromJson(roster[i]);
      this._roster[character.refId] = character;
    }
  }
  /**
   * Removes a character from the roster. The roster is immediately saved afterwards.
   * @param {string} refId the reference id of the character being removed
   */
  removeFromRoster(refId) {
    if (this._roster.hasOwnProperty(refId)) {
      delete this._roster[refId];
    }
    let arr = [];
    for (let prop in this._roster) {
      arr.push(this._roster[prop]);
    }    
    if (typeof(isTestEnvironment) === "undefined" || !isTestEnvironment) {
      WizardryDataManager.updateRoster(arr, () => { });
    }
  }
  /**
   * Updates the character roster, saving it to disk.
   */
  updateRoster() {
    let arr = [];
    for (let prop in this._roster) {
      arr.push(this._roster[prop]);
    }
    WizardryDataManager.updateRoster(arr, () => { });
  }
};
export { WizardryCharacterRoster };