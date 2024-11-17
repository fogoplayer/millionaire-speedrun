/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../assets/Asset.mjs").Asset} Asset */

import { Stat } from "../Stat.mjs";

/** @extends {Map<Resource, number>} */
export class StorageUnits extends Map {
  /**
   * @param {Asset} parent
   * @param {(Resource | Stat<Resource>)[]} initial
   */
  constructor(parent, initial) {
    super();
    this.parent = parent;
    this.validKeys = new Set(initial.map((key) => (key instanceof Stat ? key.resource : key)));
    initial.forEach((key) => {
      if (key instanceof Stat) {
        this.set(key.resource, key.amount);
      } else this.set(key, 0);
    });
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

    this.set(resource, (this.get(resource) || 0) + amount);
    return this.get(resource) || 0;
  }

  /**
   * @param {Resource} resource
   * @param {number} amount
   * @returns {number | Error} the new balance, or the error that occurred
   */
  withdraw(resource, amount) {
    const balance = this.get(resource) || 0;
    if (!this.#isValidKey(resource)) {
      return new InvalidResourceError(resource, this.parent);
    }

    if (balance < amount) {
      return new InsufficientResourceError(resource, this.parent);
    }

    this.set(resource, -amount);
    return this.get(resource) || 0;
  }

  /** @param {Resource} resource */
  balance(resource) {
    return this.get(resource) || 0;
  }

  // copy() {
  //   const copy = new StorageUnits(this.parent, [...this.validKeys]);
  //   this.#storageUnits.forEach((value, key) => copy.deposit(key, value));
  // }
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

export class InsufficientResourceError extends Error {
  /**
   * @param {Resource} resource
   * @param {Asset} asset
   */
  constructor(resource, asset) {
    super(`Insufficient ${resource.description} in ${asset.name}`);
  }
}
