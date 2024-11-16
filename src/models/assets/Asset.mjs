/** @typedef {import("../Stat.mjs").Stat} Stat */

/**
 * @abstract
 * @template {Stat} Produces
 * @template {Stat} Consumes
 * @template {Stat} Stores
 */
export class Asset {
  /** @abstract @type {string} */
  name;

  /** @type {Set<Produces>} */
  produces;
  consumes;
  stores;

  /**
   *
   * @param {string} name
   * @param {Produces[]} produces
   * @param {Consumes[]} consumes
   * @param {Stores[]} stores
   */
  constructor(name, produces, consumes, stores) {
    this.name = name;
    this.produces = new Set(produces);
    this.consumes = new Set(consumes);
    this.stores = new Set(stores);
  }

  /**
   * Initializes the asset on the map
   */
  place = abstractMethodShouldBeImplemented;

  /**
   * Takes in the current tick number and returns true if this asset should tick and false otherwise.
   *
   * @abstract
   * @param {number} tick
   * @returns {boolean}
   */
  shouldTick(tick) {
    return tick % 30 === 0;
  }

  /**
   * Performs actions each tick
   *
   * @abstract
   * @param {number} tick
   * @returns {void}
   */
  tick = abstractMethodShouldBeImplemented;

  /**
   * Destroys the asset
   * @param {number} tick
   */
  destroy = abstractMethodShouldBeImplemented;
}

/** @param {unknown} args */
function abstractMethodShouldBeImplemented(args) {
  throw new Error("Not implemented");
}
