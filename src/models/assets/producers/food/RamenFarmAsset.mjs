/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";

export class RamenFarmAsset extends Asset {
  /** @param {ActionExecutor} actionExecutor */
  constructor(actionExecutor) {
    super({ name: "Ramen Farm", produces: [{ resource: Resources.FOOD, amount: 1 }], actionExecutor });
  }
}
