import { Resources } from "../Resources.mjs";
import { Stat } from "../Stat.mjs";
import { Asset } from "./Asset.mjs";

export class BasicHumanNeeds extends Asset {
  static prettyName = "Basic Human Needs";

  static consumes = [
    { resource: Resources.FOOD, amount: 1 },
    { resource: Resources.SHELTER, amount: 1 },
  ];

  static stores = [new Stat(Resources.HAPPINESS, 1), new Stat(Resources.HEALTH, 0), new Stat(Resources.CLOTHING, 0)];
}
