/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";

export class RamenFarm extends Asset {
  /**
   * @param {ActionExecutor} actionExecutor
   * @param {AssetDirectory} assetDirectory
   */
  constructor(actionExecutor, assetDirectory) {
    super({
      name: "Ramen Farm",
      produces: [{ resource: Resources.FOOD, amount: 10 }],
      consumes: [{ resource: Resources.MONEY, amount: 3 }],
      actionExecutor,
      assetDirectory,
    });
  }

  /** @param {number} tick */
  tick(tick) {
    super.tick(tick);
    this.consumes.set(Resources.MONEY, (this.consumes.get(Resources.MONEY) || 0) + 3);
  }
}
