/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./Stat.mjs").Stat<R>} Stat @template {Resource} R*/
/** @typedef {import("./assets/Asset.mjs").Asset} Asset */

////////////////
// Game state //
////////////////
export class AssetDirectory {
  constructor() {
    /** @type {Map<Resource, Set<Asset>>} */
    this.producersPlaced = new Map();

    /** @type {Map<Resource, Set<Asset>>} */
    this.consumersPlaced = new Map();

    /** @type {Map<Resource, Set<Asset>>} */
    this.storesPlaced = new Map();

    /** @type {Set<Asset>} */
    this.assetsPlaced = new Set();
  }

  /** @param {Asset} asset  */
  place(asset) {
    this.assetsPlaced.add(asset);
    asset.produces.forEach((_, resource) => pushToMapEntry(this.producersPlaced, resource, asset));
    asset.consumes.forEach((_, resource) => pushToMapEntry(this.consumersPlaced, resource, asset));
    asset.storageUnits.forEach((_, resource) => pushToMapEntry(this.storesPlaced, resource, asset));
  }
}

//////////////////////
// Available Assets //
//////////////////////

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
function pushToMapEntry(map, key, asset) {
  if (!map.get(key)) {
    map.set(key, new Set());
  }
  map.get(key)?.add(asset);
}
