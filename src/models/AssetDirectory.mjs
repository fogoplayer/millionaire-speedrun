/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./Stat.mjs").Stat<R>} Stat @template {Resource} R*/
/** @typedef {import("./assets/Asset.mjs").Asset} Asset */

/** @type {Map<Resource, Asset>} */
const producers = new Map();

/** @type {Map<Resource, Asset>} */
const consumers = new Map();

/** @type {Map<Resource, Asset>} */
export const stores = new Map();
