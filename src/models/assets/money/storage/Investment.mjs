/** @typedef {import("../../../scenario-state/Scenario.mjs").Scenario} Scenario */
/** @typedef {import("../../../Resources.mjs").Resource} Resource */
/** @template {Resource} T @typedef {import("../../../Stat.mjs").Stat<T>} Stat */
import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";

/** @abstract */
export class Investment extends Asset {
  static produces = [{ resource: Resources.MONEY, amount: 0 }];
  /** @abstract */
  static interestRate = 0;
  /** @type {Stat<Resource>[] | Resource[]} */
  static stores = [Resources.MONEY];

  /**
   * @param {{
   *    interestRate?: number,
   *    scenario: Scenario
   *  }} param0
   */
  constructor({ interestRate = undefined, scenario }) {
    super({ scenario });
    // @ts-ignore
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
