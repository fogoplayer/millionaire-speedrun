/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class CheckingAccount extends Asset {
  /**
   * @param {ActionExecutor} actionExecutor
   * @param {AssetDirectory} assetDirectory
   */
  constructor(actionExecutor, assetDirectory) {
    super({
      name: "Checking Account",
      stores: [Resources.MONEY],
    });
  }
}
