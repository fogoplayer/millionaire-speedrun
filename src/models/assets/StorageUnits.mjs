/** @typedef {import("../Resources.mjs").Resource} Resource */
import { Asset } from "./Asset.mjs";

export class StorageUnits {
  /** @type {Map<Resource, number>} */
  #storageUnits = new Map();

  /**
   * @param {Asset} parent
   * @param {Resource[]} validKeys
   */
  constructor(parent, validKeys) {
    this.parent = parent;
    this.validKeys = new Set(validKeys);
  }

  /**
   * @param {Resource} key
   * @returns {boolean}
   */
  #isValidKey(key) {
    return this.validKeys.has(key);
  }

  /**
   * @param {Resource} resource
   * @param {number} amount
   * @returns {number | Error} the new balance, or the error that occurred
   */
  deposit(resource, amount) {
    if (!this.#isValidKey(resource)) {
      return new InvalidResourceError(resource, this.parent);
    }

    this.#storageUnits.set(resource, (this.#storageUnits.get(resource) || 0) + amount);
    return this.#storageUnits.get(resource) || 0;
  }

  /**
   * @param {Resource} resource
   * @param {number} amount
   * @returns {number | Error} the new balance, or the error that occurred
   */
  withdraw(resource, amount) {
    const balance = this.#storageUnits.get(resource) || 0;
    if (!this.#isValidKey(resource)) {
      return new InvalidResourceError(resource, this.parent);
    }

    if (balance < amount) {
      return new Error(`Insufficient resource balance for ${resource.description} in ${this.parent.name}`);
    }

    this.#storageUnits.set(resource, -amount);
    return this.#storageUnits.get(resource) || 0;
  }

  /**
   * @param {Resource} resource
   * @returns {number | Error} the balance, or the error that occurred
   */
  balance(resource) {
    if (!this.#isValidKey(resource)) {
      return new InvalidResourceError(resource, this.parent);
    }
    return this.#storageUnits.get(resource) || 0;
  }
}

export class InvalidResourceError extends Error {
  /**
   * @param {Resource} resource
   * @param {Asset} asset
   */
  constructor(resource, asset) {
    super(`${resource.description} is not stored in ${asset.name}`);
  }
}
