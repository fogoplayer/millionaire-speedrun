/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class CaviarFarm extends Asset {
  static prettyName = "Ramen Farm";
  static produces = [{ resource: Resources.FOOD, amount: 10 }];
  static consumes = [{ resource: Resources.MONEY, amount: 3 }];
}

register(new CaviarFarm());
