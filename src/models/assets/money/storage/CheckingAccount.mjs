/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../AssetDirectory.mjs").AssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";
import { register } from "../../../AssetDirectory.mjs";

export class CheckingAccount extends Asset {
  /**
   * @param {ActionExecutor} actionExecutor
   * @param {AssetDirectory} assetDirectory
   */
  constructor(actionExecutor, assetDirectory) {
    super({
      name: "Checking Account",
      stores: [Resources.MONEY],
      actionExecutor,
      assetDirectory,
    });
  }
}
