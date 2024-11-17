/** @typedef {import("../../../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../../../scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Asset } from "../../Asset.mjs";
import * as Resources from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";
import { Action } from "../../../Action.mjs";
import { Investment } from "./Investment.mjs";

export class CheckingAccount extends Investment {
  constructor() {
    super("Checking Account", 0.01);
  }
}

register(new CheckingAccount());
