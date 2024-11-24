import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";

/** @abstract */
export class Investment extends Asset {
  static produces = [{ resource: Resources.MONEY, amount: 0 }];
  /** @abstract */
  static interestRate = 0;
  static stores = [Resources.MONEY];

  /** @param {number} [interestRate] */
  constructor(interestRate = undefined) {
    super();
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
