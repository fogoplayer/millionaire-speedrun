/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
/** @typedef {import("../../../Resources.mjs").Resource} Resource */
import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";
import { Stat } from "../../../Stat.mjs";

export class CaviarFarm extends Asset {
  static prettyName = "Ramen Farm";
  static produces = [{ resource: /** @type {Resource} */ (Resources.FOOD), amount: 10 }];
  static consumes = [{ resource: /** @type {Resource} */ (Resources.MONEY), amount: 3 }];
}

register(CaviarFarm);
