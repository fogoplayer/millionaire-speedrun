/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";

export class Pantry extends Asset {
  /** @param {ActionExecutor} actionExecutor */
  constructor(actionExecutor) {
    super({ name: "Pantry", stores: [Resources.FOOD], actionExecutor });
  }
}
