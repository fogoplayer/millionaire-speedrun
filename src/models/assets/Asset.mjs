/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../scenario-state/Scenario.mjs").Scenario} Scenario */
import { Action, ActionVerbs, ResourceAction } from "../Action.mjs";
import { Stat } from "../Stat.mjs";
import { StorageUnits } from "./StorageUnits.mjs";

/**
 * @abstract
 * @template {Resource} [Produces=Resource]
 * @template {Resource} [Consumes=Resource]
 * @template {Resource} [Stores=Resource]
 */
export class Asset {
  /** @type {string} @abstract */
  static prettyName = "";

  /** @type {Stat<Resource>[]} @abstract */
  static produces = [];
  /** @type {Stat<Resource>[]} @abstract */
  static consumes = [];
  /** @type {Resource[] | Stat<Resource>[]} @abstract */
  static stores = [];

  /** @type {Stat<Resource>[]} @abstract */
  static costs = [];

  #isPlaced = false;

  /**
   *
   * @param {{
   *    prettyName?: string,
   *    produces?: Stat<Produces>[],
   *    consumes?: Stat<Consumes>[],
   *    stores?: (Stores | Stat<Stores>)[],
   *    scenario: Scenario
   *  }} param0
   */
  constructor({
    // @ts-ignore Typescript has bad support for this.constructor
    prettyName = this.constructor.prettyName,
    // @ts-ignore Typescript has bad support for this.constructor
    produces = this.constructor.produces,
    // @ts-ignore Typescript has bad support for this.constructor
    consumes = this.constructor.consumes,
    // @ts-ignore Typescript has bad support for this.constructor
    stores = this.constructor.stores,
    // @ts-ignore Typescript has bad support for this.constructor
    costs = this.constructor.costs,
    scenario,
  }) {
    this.prettyName = prettyName;
    this.produces = new Map(produces.map((stat) => [stat.resource, stat.amount]));
    this.consumes = new Map(consumes.map((stat) => [stat.resource, stat.amount]));
    this.storageUnits = new StorageUnits(this, stores);
    this.costs = new Map(consumes.map((stat) => [stat.resource, stat.amount]));
    // this.preTransactionStorageUnits = this.storageUnits.copy();
    this.actionExecutor = scenario.actionExecutor;
    this.assetDirectory = scenario.assetDirectory;
  }

  ///////////////////////
  // Lifecycle methods //
  ///////////////////////

  /**
   * Initializes the asset on the map
   */
  place() {
    this.#isPlaced = true;
    this.assetDirectory.place(this);
    this.costs.forEach((amount, resource) => {
      this.emitAction(new ResourceAction(ActionVerbs.CONSUME, amount, resource));
    });
  }

  /**
   * Takes in the current tick number and returns true if this asset should tick and false otherwise.
   *
   * @abstract
   * @param {number} tick
   * @returns {boolean}
   */
  shouldTick(tick) {
    return this.#isPlaced && true; // tick % 30 === 0;
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

    this.produces.forEach((amount, resource) => {
      this.emitAction(new ResourceAction(ActionVerbs.DEPOSIT, amount, resource));
    });
    this.consumes.forEach((amount, resource) => {
      this.emitAction(new ResourceAction(ActionVerbs.CONSUME, amount, resource));
    });
  }

  /**
   * Destroys the asset
   * @param {number} tick
   */
  destroy(tick) {
    this.assetDirectory.destroy(this);
  }

  ////////////////////
  // Action methods //
  ////////////////////

  /**
   * @param {Action<unknown>}action
   */
  emitAction(action) {
    this.actionExecutor.queueActions(action);
  }

  /**
   * @param {Action<unknown>} action
   */
  handleAction(action) {
    if (action instanceof ResourceAction) {
      switch (action.verb) {
        case ActionVerbs.DEPOSIT:
          return this.storageUnits.deposit(action.data.resource, action.data.amount);
        case ActionVerbs.CONSUME:
          return this.storageUnits.withdraw(action.data.resource, action.data.amount);
        default:
          return throwIfSwitchIsNotExhaustive(action.verb);
      }
    }
    return throwIfSwitchIsNotExhaustive(action.verb);
  }
}

/**
 * @typedef {{
 *  prettyName: string;
 *  produces: Stat<Resource>[];
 *  consumes: Stat<Resource>[];
 *  stores: Resource[] | Stat<Resource>[];
 * }} Asset.constructor
 */

/** @param {unknown} args */
function abstractMethodShouldBeImplemented(args = undefined) {
  throw new Error("Not implemented");
}

/** @param {never} condition */
function throwIfSwitchIsNotExhaustive(condition) {
  return new Error("Unknown action verb");
}
