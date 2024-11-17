/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../assets/Asset.mjs").Asset} Asset */

/** @type {Map<Resource, Set<Asset>>} */
export const assetsByResource = new Map();

/** @param {Asset} asset  */
export function register(asset) {
  asset.produces.forEach((_, resource) => pushToMapEntry(assetsByResource, resource, asset));
  asset.storageUnits.forEach((_, resource) => pushToMapEntry(assetsByResource, resource, asset));
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
