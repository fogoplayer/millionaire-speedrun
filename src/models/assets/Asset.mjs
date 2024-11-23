/** @typedef {import("../Resources.mjs").Resource} Resource */
/** @typedef {import("../ActionExecutor.mjs").ActionExecutor} ActionExecutor */
/** @typedef {import("../scenario-state/Scenario.mjs").Scenario} Scenario */
import { Action } from "../Action.mjs";
import { currentScenario } from "../game-state/Game.mjs";
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

  #isPlaced = false;

  /**
   * @param {{
   *  prettyName: string,
   *  produces?: Stat<Produces>[],
   *  consumes?: Stat<Consumes>[],
   *  stores?: (Stores | Stat<Stores>)[],
   *  scenario?: Scenario
   * }} params
   *
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
    scenario = currentScenario,
  }) {
    this.prettyName = prettyName;
    this.produces = new Map(produces.map((stat) => [stat.resource, stat.amount]));
    this.consumes = new Map(consumes.map((stat) => [stat.resource, stat.amount]));
    this.storageUnits = new StorageUnits(this, stores);
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
      this.emitAction(Action.DEPOSIT, amount, resource);
    });
    this.consumes.forEach((amount, resource) => {
      this.emitAction(Action.CONSUME, amount, resource);
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
    this.actionExecutor.queueActions(new Action(this, verb, amount, resource));
  }

  /**
   * @param {Action} action
   */
  handleAction(action) {
    switch (action.verb) {
      case Action.DEPOSIT:
        return this.storageUnits.deposit(action.resource, action.amount);
      case Action.CONSUME:
        return this.storageUnits.withdraw(action.resource, action.amount);
      default:
        return throwIfSwitchIsNotExhaustive(action.verb);
    }
  }
}

/** @param {unknown} args */
function abstractMethodShouldBeImplemented(args) {
  throw new Error("Not implemented");
}

/** @param {never} condition */
function throwIfSwitchIsNotExhaustive(condition) {
  return new Error("Unknown action verb");
}
