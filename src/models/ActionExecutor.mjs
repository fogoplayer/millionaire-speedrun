/** @typedef {import("./scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Action, ActionVerbs, BuildingAction, ResourceAction } from "./Action.mjs";
import { throwIfSwitchIsNotExhaustive } from "./assets/Asset.mjs";
import { currentScenario } from "./game-state/Game.mjs";

export class ActionExecutor {
  /** @type {Action[][]} */
  transactionHistory = [];

  /** @type {Action[]} */
  transactionQueue = [];

  /** @param {AssetDirectory} assetDirectory */
  constructor(assetDirectory) {
    this.assetDirectory = assetDirectory;
  }

  /**
   * adds multiple actions to the current transaction
   * @param {Action[]} actions
   */
  queueActions(...actions) {
    this.transactionQueue.push(...actions);
  }

  executeTransaction() {
    let error;

    let i = 0;
    while (i < this.transactionQueue.length) {
      const action = this.transactionQueue[i];
      const result = this.#executeAction(action);
      if (!error && result instanceof Error) error = result;
      i++;
    }

    const gameStateIsValid = this.#gameStateIsValid();
    if (!error && gameStateIsValid) {
      this.#addToTransactionHistory(...this.transactionQueue);
    } else {
      this.undoTransaction();
    }

    this.actionsInQueueExecuted = 0; // redundant
    this.transactionQueue = [];
    if (error) return error;
    if (!gameStateIsValid) return new Error("Game state is invalid");
    return undefined;
  }

  /**
   * @param {Action} action
   * @returns {number | Error}
   */
  #executeAction(action) {
    if (action instanceof ResourceAction) {
      let resourceStore = this.assetDirectory.stores.get(action.data.resource)?.keys().next().value;
      if (!resourceStore) {
        if (action.verb === ActionVerbs.CONSUME) {
          return new Error(`Resource ${action.data.resource} not found`);
        } else if (action.verb === ActionVerbs.DEPOSIT) {
          console.warn(`Storage for ${action.data.resource} not found`);
          return -1;
        } else {
          return throwIfSwitchIsNotExhaustive(action.verb);
        }
      }
      return resourceStore.handleAction(action);
    }
    if (action instanceof BuildingAction) {
      if (action.verb === ActionVerbs.PLACE) {
        return this.assetDirectory.place(action.data.asset) ?? 0;
      }
      if (action.verb === ActionVerbs.DESTROY) {
        this.assetDirectory.destroy(action.data.asset);
      }
    }
    return new Error("Not implemented");
  }

  undoTransaction() {
    while (this.transactionQueue.length) {
      this.undoAction(/** @type {Action} */ (this.transactionQueue.pop()));
    }
  }

  /** @param {Action} action */
  undoAction(action) {
    switch (action.verb) {
      case ActionVerbs.DEPOSIT:
        action.verb = ActionVerbs.CONSUME;
        break;
      case ActionVerbs.CONSUME:
        action.verb = ActionVerbs.DEPOSIT;
        break;
      case ActionVerbs.PLACE:
        this.assetDirectory.remove(action.data.asset);
        return;
      case ActionVerbs.DESTROY:
        // to undo, just go back to previous tick
        break;
      default:
        throwIfSwitchIsNotExhaustive(action.verb);
    }

    this.#executeAction(action);
  }

  /** @param {Action[] | [Action[]]} actions */
  #addToTransactionHistory = (...actions) => {
    const currentTick = currentScenario.currentTick;

    if (Array.isArray(actions[0])) {
      actions = /** @type {Action[]} */ (actions[0]);
    } else {
      actions = /** @type {Action[]} */ (actions);
    }

    // Add new ticks to the end of the array
    if (this.transactionHistory.length === currentTick) {
      this.transactionHistory.push(actions);
      return;
    } else if (this.transactionHistory.length < currentTick) {
      // edge case that should never happen
      this.transactionHistory.length = currentTick + 1;
      this.transactionHistory[currentTick] = actions;
      return;
    }

    // Add actions to an existing tick
    const currentTickActions = this.transactionHistory[currentTick];
    /* else */ if (Array.isArray(currentTickActions)) {
      currentTickActions.push(...actions);
      return;
    } else {
      this.transactionHistory[currentTick] = actions;
    }
    this.transactionHistory.push(actions);
  };

  #gameStateIsValid() {
    let noError = true;
    this.assetDirectory.stores.forEach((assetSet) =>
      assetSet.forEach((asset) =>
        asset.storageUnits.forEach((balance, resource) => {
          if (balance < 0) {
            console.error(`Balance for ${resource} in ${asset.prettyName} is ${balance}`);
          }
          noError = noError && balance >= 0;
        })
      )
    );
    return noError;
  }
}
