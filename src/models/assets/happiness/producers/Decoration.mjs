import { Action, ActionVerbs, ResourceAction } from "../../../Action.mjs";
import { Resources } from "../../../Resources.mjs";
import { Stat } from "../../../Stat.mjs";
import { Asset } from "../../Asset.mjs";

export class Decoration extends Asset {
  static prettyName = "Decoration";
  static produces = [new Stat(Resources.HAPPINESS, 10)];
  static costs = [new Stat(Resources.MONEY, 5)];
}
