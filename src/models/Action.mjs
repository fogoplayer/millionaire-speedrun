/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./assets/Asset.mjs").Asset} Asset*/

export const ActionVerbs = /** @type {const} */ ({
  DEPOSIT: "produce",
  CONSUME: "consume",
  PLACE: "place",
  DESTROY: "destroy",
});

/**
 * @typedef {ActionVerbs[keyof typeof ActionVerbs]} ActionVerb
 * @typedef {typeof ActionVerbs.DEPOSIT | typeof ActionVerbs.CONSUME} ResourceVerbs
 * @typedef {typeof ActionVerbs.PLACE | typeof ActionVerbs.DESTROY} BuildingVerbs
 */

/**
 * @template {ActionVerb} [ActionSupportedVerb=ActionVerb]
 * @template [DataType=any]
 */
export class Action {
  /**
   * @param {ActionSupportedVerb} verb
   * @param {DataType} data
   */
  constructor(verb, data, revertable = false) {
    this.verb = verb;
    this.data = data;
    this.revertable = revertable;
  }
}

/** @extends {Action<ResourceVerbs, {amount: number, resource: Resource}>} */
export class ResourceAction extends Action {
  /**
   * @param {ActionVerbs["DEPOSIT"] | ActionVerbs["CONSUME"]} verb
   * @param {number} amount
   * @param {Resource} resource
   */
  constructor(verb, amount, resource) {
    super(verb, { amount, resource });
  }
}

/** @extends {Action<BuildingVerbs, {asset: Asset}>} */
export class BuildingAction extends Action {
  /**
   * @param {ActionVerbs["PLACE"] | ActionVerbs["DESTROY"]} verb
   * @param {Asset} asset
   */
  constructor(verb, asset) {
    super(verb, { asset });
  }
}
