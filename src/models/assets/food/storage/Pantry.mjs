/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../AssetDirectory.mjs").AssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";

export class Pantry extends Asset {
  /**
   * @param {ActionExecutor} actionExecutor
   * @param {AssetDirectory} assetDirectory
   */
  constructor(actionExecutor, assetDirectory) {
    super({ name: "Pantry", stores: [Resources.FOOD], actionExecutor, assetDirectory });
  }
}
