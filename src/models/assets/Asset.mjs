/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @template {Resource} StatResource @typedef {import("../Stat.mjs").Stat<StatResource>} Stat */

/**
 * @abstract
 * @template {Resource} Produces
 * @template {Resource} Consumes
 * @template {Resource} Stores
 */
export class Asset {
  /** @abstract @type {string} */
  name;

  /**
   *
   * @param {string} name
   * @param {Stat<Produces>[]} produces
   * @param {Stat<Consumes>[]} consumes
   * @param {Stat<Stores>[]} stores
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
  tick(tick) {
    if (!this.shouldTick(tick)) {
      return;
    }
  }

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
