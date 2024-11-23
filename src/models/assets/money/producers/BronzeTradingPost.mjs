/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class BronzeTradingPost extends Asset {
  constructor() {
    super({
      prettyName: "Bronze Trading Post",
      produces: [{ resource: Resources.MONEY, amount: 10 }],
    });
  }
}

register(new BronzeTradingPost());
