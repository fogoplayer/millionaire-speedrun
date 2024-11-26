import { Resources } from "../Resources.mjs";
import { Asset } from "./Asset.mjs";

export class BasicHumanNeeds extends Asset {
  static prettyName = "Basic Human Needs";

  static consumes = [
    { resource: Resources.FOOD, amount: 1 },
    { resource: Resources.SHELTER, amount: 1 },
  ];

  static stores = [
    { resource: Resources.HAPPINESS, amount: 0 },
    { resource: Resources.HEALTH, amount: 0 },
    { resource: Resources.CLOTHING, amount: 0 },
  ];
}
