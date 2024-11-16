/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../ActionExecutor.mjs").ActionExecutor} ActionExecutor */

import { Action } from "../Action.mjs";
import { Stat } from "../Stat.mjs";

/**
 * @abstract
 * @template {Resource} [Produces=Resource]
 * @template {Resource} [Consumes=Resource]
 * @template {Resource} [Stores=Resource]
 */
export class Asset {
  /**
   * @param {string} name
   * @param {Produces[]} produces
   * @param {Consumes[]} consumes
   * @param {Stores[]} stores
   * @param {ActionExecutor} actionExecutor
   */
  constructor(name, produces, consumes, stores, actionExecutor) {
    this.name = name;
    this.produces = new Map(produces.map((resource) => [resource, new Stat(resource, 0)]));
    this.consumes = new Map(consumes.map((resource) => [resource, new Stat(resource, 0)]));
    this.storageUnits = new StorageUnits(this, stores);
    this.actionExecutor = actionExecutor;
  }

  ///////////////////////
  // Lifecycle methods //
  ///////////////////////

  /**
   * Initializes the asset on the map
   */
  place = abstractMethodShouldBeImplemented;

  /**
   * Takes in the current tick number and returns true if this asset should tick and false otherwise.
   *
   * @abstract
   * @param {number} tick
   * @returns {boolean}
   */
  shouldTick(tick) {
    return tick % 30 === 0;
  }

  /**
   * Performs actions each tick
   *
   * @abstract
   * @param {number} tick
   * @returns {void}
   */
  tick(tick) {
    if (!this.shouldTick(tick)) {
      return;
    }

    this.produces.forEach((stat) => {
      this.emitAction(Action.DEPOSIT, stat.amount, stat.resource);
    });
    this.consumes.forEach((stat) => {
      this.emitAction(Action.CONSUME, stat.amount, stat.resource);
    });
  }

  /**
   * Destroys the asset
   * @param {number} tick
   */
  destroy = abstractMethodShouldBeImplemented;

  ////////////////////
  // Action methods //
  ////////////////////

  /**
   * @param {Action.DEPOSIT | Action.CONSUME} verb
   * @param {number} amount
   * @param {Resource} resource
   */
  emitAction(verb, amount, resource) {
    this.actionExecutor.queueAction(new Action(this, verb, amount, resource));
  }

  /**
   * @param {Action} action
   */
  handleAction(action) {
    switch (action.verb) {
      case Action.DEPOSIT:
        this.storageUnits.deposit(action.resource, action.amount);
        break;
      case Action.CONSUME:
        this.storageUnits.withdraw(action.resource, action.amount);
        break;
      default:
        throwIfSwitchIsNotExhaustive(action.verb);
    }
  }
}

class StorageUnits {
  /** @type {Map<Resource, number>} */
  #storageUnits = new Map();

  /**
   * @param {Asset} parent
   * @param {Resource[]} validKeys
   */
  constructor(parent, validKeys) {
    this.parent = parent;
    this.validKeys = new Set(validKeys);
  }

  /**
   * @param {Resource} key
   * @returns {boolean}
   */
  #isValidKey(key) {
    return this.validKeys.has(key);
  }

  /**
   * @param {Resource} resource
   * @param {number} amount
   * @returns {number | Error} the new balance, or the error that occurred
   */
  deposit(resource, amount) {
    if (!this.#isValidKey(resource)) {
      return new Error(`${resource.description} is not stored in ${this.parent.name}`);
    }

    this.#storageUnits.set(resource, (this.#storageUnits.get(resource) || 0) + amount);
    return this.#storageUnits.get(resource) || 0;
  }

  /**
   * @param {Resource} resource
   * @param {number} amount
   * @returns {number | Error} the new balance, or the error that occurred
   */
  withdraw(resource, amount) {
    const balance = this.#storageUnits.get(resource) || 0;
    if (!this.#isValidKey(resource)) {
      return new Error(`${resource.description} is not stored in ${this.parent.name}`);
    }

    if (balance < amount) {
      return new Error(`Insufficient resource balance for ${resource.description} in ${this.parent.name}`);
    }

    this.#storageUnits.set(resource, -amount);
    return this.#storageUnits.get(resource) || 0;
  }

  /**
   * @param {Resource} resource
   * @returns {number | Error} the balance, or the error that occurred
   */
  balance(resource) {
    if (!this.#isValidKey(resource)) {
      return new Error(`${resource.description} is not stored in ${this.parent.name}`);
    }
    return this.#storageUnits.get(resource) || 0;
  }
}

/** @param {unknown} args */
function abstractMethodShouldBeImplemented(args) {
  throw new Error("Not implemented");
}

/** @param {never} condition */
function throwIfSwitchIsNotExhaustive(condition) {
  throw new Error("Unknown action verb");
}
