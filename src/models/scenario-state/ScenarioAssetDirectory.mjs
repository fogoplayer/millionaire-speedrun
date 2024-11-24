/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../Stat.mjs").Stat<R>} Stat @template {Resource} R*/
/** @typedef {import("../assets/Asset.mjs").Asset} Asset */

import { pushToMapEntry } from "../game-state/GlobalAssetDirectory.mjs";

export class ScenarioAssetDirectory {
  constructor() {
    /** @type {Map<Resource, Set<Asset>>} */
    this.producers = new Map();

    /** @type {Map<Resource, Set<Asset>>} */
    this.consumers = new Map();

    /** @type {Map<Resource, Set<Asset>>} */
    this.stores = new Map();

    /** @type {Map<Resource, Asset>} */
    this.primaryStores = new Map();

    /** @type {Set<Asset>} */
    this.assets = new Set();
  }

  /**
   * @param {Resource} resource
   * @param {Asset} asset
   */
  setPrimaryStore(resource, asset) {
    this.primaryStores.set(resource, asset);
  }

  /** @param {Asset} asset  */
  place(asset) {
    this.assets.add(asset);
    asset.produces.forEach((_, resource) => pushToMapEntry(this.producers, resource, asset));
    asset.consumes.forEach((_, resource) => pushToMapEntry(this.consumers, resource, asset));
    asset.storageUnits.forEach((_, resource) => {
      pushToMapEntry(this.stores, resource, asset);
      if (!this.primaryStores.has(resource)) {
        this.setPrimaryStore(resource, asset);
      }
    });
  }

  /** @param {Asset} asset */
  destroy(asset) {
    this.assets.delete(asset);
    asset.produces.forEach((_, resource) => this.producers.get(resource)?.delete(asset));
    asset.consumes.forEach((_, resource) => this.consumers.get(resource)?.delete(asset));
    asset.storageUnits.forEach((_, resource) => {
      this.stores.get(resource)?.delete(asset);
      if (this.primaryStores.get(resource) === asset) {
        this.primaryStores.delete(resource);
        // set the oldest store as the primary
        this.stores.get(resource)?.forEach((store) => {
          if (!this.primaryStores.has(resource)) {
            this.setPrimaryStore(resource, store);
          }
        });
      }
    });
  }
}
