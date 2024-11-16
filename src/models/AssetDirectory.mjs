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
