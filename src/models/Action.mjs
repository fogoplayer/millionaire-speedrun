/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./assets/Asset.mjs").Asset} Asset*/

export const ActionVerbs = /** @type {const} */ ({
  DEPOSIT: "produce",
  CONSUME: "consume",
  PLACE: "place",
});

/**
 * @typedef {ActionVerbs[keyof typeof ActionVerbs]} ActionVerb
 * @typedef {typeof ActionVerbs.DEPOSIT | typeof ActionVerbs.CONSUME} ActionVerbs.DEPOSIT_OR_CONSUME
 */

/**
 * @template DataType
 */
export class Action {
  /**
   * @param {ActionVerb} verb
   * @param {DataType} data
   *
   */
  constructor(verb, data, revertable = false) {
    this.verb = verb;
    this.data = data;
    this.revertable = revertable;
  }
}

/** @extends {Action<{amount: number, resource: Resource}>} */
export class ResourceAction extends Action {
  /**
   * @param {ActionVerbs["DEPOSIT"] | ActionVerbs["CONSUME"]} verb
   * @param {number} amount
   * @param {Resource} resource
   */
  constructor(verb, amount, resource) {
    super(verb, { amount, resource });
    /** @type {typeof verb} */
    this.verb;
  }
}
