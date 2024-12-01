import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";

export class BronzeTradingPost extends Asset {
  static prettyName = "Bronze Trading Post";
  static produces = [{ resource: Resources.MONEY, amount: 10 }];
}
