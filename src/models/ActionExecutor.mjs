/** @typedef {import("./scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Action } from "./Action.mjs";

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
    let noError = true;

    this.transactionQueue.forEach((action) => {
      this.executeAction(action);
    });

    this.assetDirectory.stores.forEach((assetSet) =>
      assetSet.forEach((asset) =>
        asset.storageUnits.forEach((balance) => {
          noError = noError && balance >= 0;
        })
      )
    );

    if (noError) {
      this.transactionHistory.push(this.transactionQueue);
    } else {
      this.undoTransaction();
    }

    this.actionsInQueueExecuted = 0; // redundant
    this.transactionQueue = [];
    return noError;
  }

  /**
   * @param {Action} action
   * @returns {number | Error}
   */
  executeAction(action) {
    let resourceStore = this.assetDirectory.stores.get(action.resource)?.keys().next().value;
    if (!resourceStore) {
      console.warn(`Storage for ${action.resource.description} not found`);
      return -1;
    }
    return resourceStore.handleAction(action);
  }

  undoTransaction() {
    while (this.transactionQueue.length) {
      this.undoAction(/** @type {Action} */ (this.transactionQueue.pop()));
    }
  }

  /**
   * @param {Action} action
   */
  undoAction(action) {
    if (action.verb === Action.DEPOSIT) {
      action.verb = Action.CONSUME;
    } else if (action.verb === Action.CONSUME) {
      action.verb = Action.DEPOSIT;
    }

    this.executeAction(action);
  }
}
