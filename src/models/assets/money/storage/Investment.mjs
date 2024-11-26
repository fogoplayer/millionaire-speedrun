/** @typedef {import("../../../scenario-state/Scenario.mjs").Scenario} Scenario */
import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";

/** @abstract */
export class Investment extends Asset {
  static produces = [{ resource: Resources.MONEY, amount: 0 }];
  /** @abstract */
  static interestRate = 0;
  static stores = [Resources.MONEY];

  /**
   * @param {{
   *    interestRate?: number,
   *    scenario: Scenario
   *  }} param0
   */
  constructor({ interestRate = undefined, scenario }) {
    super({ scenario });
    this.interestRate = interestRate ?? this.constructor.interestRate;
  }

  /** @param {number} tick  */
  tick(tick) {
    if (!this.shouldTick(tick)) {
      return;
    }
    this.produces.set(Resources.MONEY, (this.storageUnits.get(Resources.MONEY) ?? 0) * this.interestRate);
    super.tick(tick);
  }
}
