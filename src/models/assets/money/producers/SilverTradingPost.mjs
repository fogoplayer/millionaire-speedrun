import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class SilverTradingPost extends Asset {
  static prettyName = "Silver Trading Post";
  static produces = [{ resource: Resources.MONEY, amount: 100 }];
}

register(SilverTradingPost);
