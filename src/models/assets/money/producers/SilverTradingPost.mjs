/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class SilverTradingPost extends Asset {
  constructor() {
    super({
      prettyName: "Silver Trading Post",
      produces: [{ resource: Resources.MONEY, amount: 100 }],
    });
  }
}

register(new SilverTradingPost());
