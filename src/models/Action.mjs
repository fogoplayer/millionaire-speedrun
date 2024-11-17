/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./assets/Asset.mjs").Asset} Asset*/

export class Action {
  static DEPOSIT = Symbol("produce");
  static CONSUME = Symbol("consume");

  /**
   * @param {Asset} originator
   * @param {Action.DEPOSIT | Action.CONSUME} verb
   * @param {number} amount
   * @param {Resource} resource
   */
  constructor(originator, verb, amount, resource) {
    this.orginator = originator;
    this.verb = verb;
    this.amount = amount;
    this.resource = resource;
  }
}
