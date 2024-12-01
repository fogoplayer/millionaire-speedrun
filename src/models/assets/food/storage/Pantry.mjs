import { Asset } from "../../Asset.mjs";
import { Resources } from "../../../Resources.mjs";

export class Pantry extends Asset {
  static prettyName = "Pantry";
  static stores = [Resources.FOOD];
}
