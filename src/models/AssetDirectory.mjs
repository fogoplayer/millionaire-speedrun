/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./Stat.mjs").Stat<R>} Stat @template {Resource} R*/
/** @typedef {import("./assets/Asset.mjs").Asset} Asset */

////////////////
// Game state //
////////////////
export class AssetDirectory {
  constructor() {
    /** @type {Map<Resource, Asset[]>} */
    this.producersPlaced = new Map();

    /** @type {Map<Resource, Asset[]>} */
    this.consumersPlaced = new Map();

    /** @type {Map<Resource, Asset[]>} */
    this.storesPlaced = new Map();

    /** @type {Set<Asset>} */
    this.assetsPlaced = new Set();
  }

  /** @param {Asset} asset  */
  place(asset) {
    this.assetsPlaced.add(asset);
    asset.produces.forEach((_, resource) => this.pushToMapEntry(this.producersPlaced, resource, asset));
    asset.consumes.forEach((_, resource) => this.pushToMapEntry(this.consumersPlaced, resource, asset));
    asset.storageUnits.forEach((_, key) => this.pushToMapEntry(this.storesPlaced, key, asset));
  }

  /**
   *
   * @param {Map<Resource, Asset[]>} map
   * @param {Resource} key
   * @param {Asset} asset
   */
  pushToMapEntry(map, key, asset) {
    if (!map.get(key)) {
      map.set(key, []);
    }
    map.get(key)?.push(asset);
  }
}

/////////////
// Options //
/////////////

/** @param {Asset} asset  */
export function register(asset) {}
