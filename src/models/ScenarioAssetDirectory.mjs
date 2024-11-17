/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./Stat.mjs").Stat<R>} Stat @template {Resource} R*/
/** @typedef {import("./assets/Asset.mjs").Asset} Asset */

import { pushToMapEntry } from "./GlobalAssetDirectory.mjs";

export class ScenarioAssetDirectory {
  constructor() {
    /** @type {Map<Resource, Set<Asset>>} */
    this.producers = new Map();

    /** @type {Map<Resource, Set<Asset>>} */
    this.consumers = new Map();

    /** @type {Map<Resource, Set<Asset>>} */
    this.stores = new Map();

    /** @type {Set<Asset>} */
    this.assets = new Set();
  }

  /** @param {Asset} asset  */
  place(asset) {
    this.assets.add(asset);
    asset.produces.forEach((_, resource) => pushToMapEntry(this.producers, resource, asset));
    asset.consumes.forEach((_, resource) => pushToMapEntry(this.consumers, resource, asset));
    asset.storageUnits.forEach((_, resource) => pushToMapEntry(this.stores, resource, asset));
  }
}
