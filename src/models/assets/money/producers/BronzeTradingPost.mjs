import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class BronzeTradingPost extends Asset {
  static prettyName = "Bronze Trading Post";
  static produces = [{ resource: Resources.MONEY, amount: 10 }];
}

register(BronzeTradingPost);
