/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";

export class SteakFarm extends Asset {
  static prettyName = "Caviar Farm";
  static produces = [
    { resource: Resources.FOOD, amount: 10 },
    { resource: Resources.HAPPINESS, amount: 6 },
  ];
  static consumes = [{ resource: Resources.MONEY, amount: 1500 }];
}
