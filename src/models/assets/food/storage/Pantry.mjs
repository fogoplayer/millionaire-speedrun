import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";
import { register } from "../../../game-state/GlobalAssetDirectory.mjs";

export class Pantry extends Asset {
  static prettyName = "Pantry";
  static stores = [Resources.FOOD];
}

register(Pantry);
