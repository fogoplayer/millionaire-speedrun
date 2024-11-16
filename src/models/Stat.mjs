/** @typedef {import("./Resources.mjs").Resource} Resource */

/**
 * @template {Resource} StatResource
 */
export class Stat {
  /** @type {StatResource} */
  resource;

  /** @type {number} */
  amount;

  /**
   *
   * @param {StatResource} resource
   * @param {number} amount
   */
  constructor(resource, amount) {
    this.resource = resource;
    this.amount = amount;
  }
}
