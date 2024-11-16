/** @typedef {import("./Resources.mjs").Resource} Resource */
import { Asset } from "./assets/Asset.mjs";

export class Action {
  static DEPOSIT = Symbol("produce");
  static CONSUME = Symbol("consume");

  /**
   * @param {Asset<Resource, Resource, Resource>} originator
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
