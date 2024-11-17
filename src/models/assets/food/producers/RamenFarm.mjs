/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class RamenFarm extends Asset {
  constructor() {
    super({
      name: "Ramen Farm",
      produces: [{ resource: Resources.FOOD, amount: 10 }],
      consumes: [{ resource: Resources.MONEY, amount: 3 }],
    });
  }

  /** @param {number} tick */
  tick(tick) {
    super.tick(tick);
    this.consumes.set(Resources.MONEY, (this.consumes.get(Resources.MONEY) || 0) + 3);
  }
}

register(new RamenFarm());
