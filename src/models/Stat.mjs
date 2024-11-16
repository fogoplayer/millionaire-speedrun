/** @typedef {import("./Resources.mjs").Resource} Resource */

/**
 * @template {Resource} StatResource
 */
export class Stat {
  /**
   * @param {StatResource} resource
   * @param {number} amount
   */
  constructor(resource, amount) {
    this.resource = resource;
    this.amount = amount;
  }
}
