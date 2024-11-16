/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";

export class BronzeTradingPost extends Asset {
  /** @param {ActionExecutor} actionExecutor */
  constructor(actionExecutor) {
    super({
      name: "Bronze Trading Post",
      produces: [{ resource: Resources.MONEY, amount: 10 }],
      actionExecutor,
    });
  }
}
