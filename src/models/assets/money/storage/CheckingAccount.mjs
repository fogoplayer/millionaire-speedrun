/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";

export class CheckingAccount extends Asset {
  /** @param {ActionExecutor} actionExecutor */
  constructor(actionExecutor) {
    super({
      name: "Checking Account",
      stores: [Resources.MONEY],
      actionExecutor,
    });
  }
}
