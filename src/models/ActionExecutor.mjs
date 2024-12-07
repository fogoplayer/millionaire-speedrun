/** @typedef {import("./scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Action, ActionVerbs, ResourceAction } from "./Action.mjs";
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
    this.transactionQueue.forEach((action) => {
      this.#executeAction(action);
    });

    const gameStateIsValid = this.#gameStateIsValid();
    if (gameStateIsValid) {
      this.#addToTransactionHistory(...this.transactionQueue);
    } else {
      this.undoTransaction();
    }

    this.actionsInQueueExecuted = 0; // redundant
    this.transactionQueue = [];
    return gameStateIsValid;
  }

  /**
   * @param {Action} action
   * @returns {number | Error}
   */
  #executeAction(action) {
    if (action instanceof ResourceAction) {
      let resourceStore = this.assetDirectory.stores.get(action.data.resource)?.keys().next().value;
      if (!resourceStore) {
        console.warn(`Storage for ${action.data.resource} not found`);
        return -1;
      }
      return resourceStore.handleAction(action);
    }
    return new Error("Not implemented");
  }

  /** @param {Action} action */
  executeActionImmediately(action) {
    this.#executeAction(action);
    this.#addToTransactionHistory(action);
  }

  undoTransaction() {
    while (this.transactionQueue.length) {
      this.undoAction(/** @type {Action} */ (this.transactionQueue.pop()));
    }
  }

  /** @param {Action} action */
  undoAction(action) {
    if (action.verb === ActionVerbs.DEPOSIT) {
      action.verb = ActionVerbs.CONSUME;
    } else if (action.verb === ActionVerbs.CONSUME) {
      action.verb = ActionVerbs.DEPOSIT;
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
        asset.storageUnits.forEach((balance) => {
          noError = noError && balance >= 0;
        })
      )
    );
    return noError;
  }
}
