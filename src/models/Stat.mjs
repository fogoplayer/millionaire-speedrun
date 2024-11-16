/** @typedef {import("./Resources.mjs").Resource} Resource */

import { MONEY } from "./Resources.mjs";

export class Stat {
  /** @type {Resource} */
  resource;

  /** @type {number} */
  amount;

  /**
   *
   * @param {Resource} resource
   * @param {number} amount
   */
  constructor(resource, amount) {
    this.resource = resource;
    this.amount = amount;
  }
}
