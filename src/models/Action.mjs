export class Action {
  static PRODUCE = Symbol("produce");
  static CONSUME = Symbol("consume");

  /**
   * @param {Action.PRODUCE | Action.CONSUME} verb
   * @param {number} amount
   */
  constructor(verb, amount) {
    this.verb = verb;
    this.amount = amount;
  }
}
