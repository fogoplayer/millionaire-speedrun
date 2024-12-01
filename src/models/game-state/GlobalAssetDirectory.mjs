/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../assets/Asset.mjs").Asset} Asset */

import { CaviarFarm } from "../assets/food/producers/CaviarFarm.mjs";
import { FrozenDinnerFarm } from "../assets/food/producers/FrozenDinnerFarm.mjs";
import { RamenFarm } from "../assets/food/producers/RamenFarm.mjs";
import { SteakFarm } from "../assets/food/producers/SteakFarm.mjs";
import { Pantry } from "../assets/food/storage/Pantry.mjs";
import { Decoration } from "../assets/happiness/producers/Decoration.mjs";
import { BronzeTradingPost } from "../assets/money/producers/BronzeTradingPost.mjs";
import { SilverTradingPost } from "../assets/money/producers/SilverTradingPost.mjs";
import { CheckingAccount } from "../assets/money/storage/CheckingAccount.mjs";
import { Stat } from "../Stat.mjs";

/** @type {Map<Resource, Set<Asset["constructor"]>>} */
export const assetsByResource = new Map();

register(
  // Trading posts
  BronzeTradingPost,
  SilverTradingPost,
  // Farms
  RamenFarm,
  FrozenDinnerFarm,
  SteakFarm,
  CaviarFarm,
  // Happiness Producers
  Decoration,
  // Basic Storage
  CheckingAccount,
  Pantry
);

/**
 * @param {Asset["constructor"][]} assets
 */
export function register(...assets) {
  assets.forEach((asset) => {
    // @ts-ignore
    asset.produces.forEach(
      /** @param {Stat<Resource>} stat */ (stat) => pushToMapEntry(assetsByResource, stat.resource, asset)
    );
    // @ts-ignore
    asset.stores.forEach(
      /** @param {Stat<Resource>} statOrResource */ (statOrResource) =>
        pushToMapEntry(
          assetsByResource,
          statOrResource instanceof Stat ? statOrResource.resource : statOrResource,
          asset
        )
    );
  });
}
/**
 * @template Key, Value
 * @param {Map<Key, Set<Value>>} map
 * @param {Key} key
 * @param {Value} asset
 */
export function pushToMapEntry(map, key, asset) {
  if (!map.get(key)) {
    map.set(key, new Set());
  }
  map.get(key)?.add(asset);
}
