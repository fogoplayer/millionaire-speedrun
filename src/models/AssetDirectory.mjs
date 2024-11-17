/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./Stat.mjs").Stat<R>} Stat @template {Resource} R*/
/** @typedef {import("./assets/Asset.mjs").Asset} Asset */

////////////////
// Game state //
////////////////

/** @type {Map<Resource, Asset[]>} */
export const producersPlaced = new Map();

/** @type {Map<Resource, Asset[]>} */
export const consumersPlaced = new Map();

/** @type {Map<Resource, Asset[]>} */
export const storesPlaced = new Map();

/** @type {Set<Asset>} */
export const assetsPlaced = new Set();

/////////////
// Options //
/////////////

/** @param {Asset} asset  */
export function register(asset) {}

/** @param {Asset} asset  */
export function place(asset) {
  assetsPlaced.add(asset);
  asset.produces.forEach((_, resource) => pushToMapEntry(producersPlaced, resource, asset));
  asset.consumes.forEach((_, resource) => pushToMapEntry(consumersPlaced, resource, asset));
  asset.storageUnits.forEach((_, key) => pushToMapEntry(storesPlaced, key, asset));
}

/**
 *
 * @param {Map<Resource, Asset[]>} map
 * @param {Resource} key
 * @param {Asset} asset
 */
function pushToMapEntry(map, key, asset) {
  if (!map.get(key)) {
    map.set(key, []);
  }
  map.get(key)?.push(asset);
}
