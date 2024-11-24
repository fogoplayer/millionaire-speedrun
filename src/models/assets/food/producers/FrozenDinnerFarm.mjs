import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class FrozenDinnerFarm extends Asset {
  static prettyName = "Frozen Dinner Farm";
  static produces = [{ resource: Resources.FOOD, amount: 10 }];
  static consumes = [{ resource: Resources.MONEY, amount: 150 }];
}

register(FrozenDinnerFarm);
