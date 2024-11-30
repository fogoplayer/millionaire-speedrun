/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../assets/Asset.mjs").Asset} Asset */

import { Stat } from "../Stat.mjs";

/** @type {Map<Resource, Set<Asset["constructor"]>>} */
export const assetsByResource = new Map();

/**
 * @param {Asset["constructor"]} asset
 */
export function register(asset) {
  // @ts-ignore
  asset.produces.forEach(
    /** @param {Stat<Resource>} stat */ (stat) => pushToMapEntry(assetsByResource, stat.resource, asset)
  );
  // @ts-ignore
  asset.stores.forEach(
    /** @param {Stat<Resource>} statOrResource */ (statOrResource) =>
      pushToMapEntry(assetsByResource, statOrResource instanceof Stat ? statOrResource.resource : statOrResource, asset)
  );
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
