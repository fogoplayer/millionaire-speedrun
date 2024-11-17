/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";
import { Action } from "../../../Action.mjs";

/** @abstract */
export class Investment extends Asset {
  /**
   * @param {string} name
   * @param {number} interestRate
   */
  constructor(name, interestRate) {
    super({
      name,
      produces: [{ resource: Resources.MONEY, amount: 0 }],
      stores: [Resources.MONEY],
    });

    this.interestRate = interestRate;
  }

  /** @param {number} tick  */
  tick(tick) {
    if (!this.shouldTick(tick)) {
      return;
    }
    this.produces.set(Resources.MONEY, (this.storageUnits.get(Resources.MONEY) ?? 0) * this.interestRate);
  }
}
