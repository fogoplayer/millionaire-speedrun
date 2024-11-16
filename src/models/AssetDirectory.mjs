/** @typedef {import("./Resources.mjs").Resource} Resource */
/** @typedef {import("./Stat.mjs").Stat<R>} Stat @template {Resource} R*/
/**
 * @template {Resource} P
 * @template {Resource} C
 * @template {Resource} S
 * @typedef {import("./assets/Asset.mjs").Asset<P, C, S>} Asset
 */

import { MONEY } from "./Resources.mjs";

/** @type {Map<Resource, Asset<Resource, Resource, Resource>>} */
const producers = new Map();

/** @type {Map<Resource, Asset<Resource, Resource, Resource>>} */
const consumers = new Map();

/** @type {Map<Resource, Asset<Resource, Resource, Resource>>} */
export const stores = new Map();
