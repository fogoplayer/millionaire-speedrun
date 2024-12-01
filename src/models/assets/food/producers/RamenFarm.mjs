import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";

export class RamenFarm extends Asset {
  static prettyName = "Ramen Farm";
  static produces = [{ resource: Resources.FOOD, amount: 10 }];
  static consumes = [
    { resource: Resources.MONEY, amount: 3 },
    { resource: Resources.HAPPINESS, amount: 1 },
  ];
}
