/** @typedef {import("./scenario-state/ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Action, ActionVerbs, ResourceAction } from "./Action.mjs";

export class ActionExecutor {
  /** @type {Action<unknown>[][]} */
  transactionHistory = [];

  /** @type {Action<unknown>[]} */
  transactionQueue = [];

  /** @param {AssetDirectory} assetDirectory */
  constructor(assetDirectory) {
    this.assetDirectory = assetDirectory;
  }

  /**
   * adds multiple actions to the current transaction
   * @param {Action<unknown>[]} actions
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
   * @param {Action<unknown>} action
   * @returns {number | Error}
   */
  executeAction(action) {
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

  undoTransaction() {
    while (this.transactionQueue.length) {
      this.undoAction(/** @type {Action<unknown>} */ (this.transactionQueue.pop()));
    }
  }

  /**
   * @param {Action<unknown>} action
   */
  undoAction(action) {
    if (action.verb === ActionVerbs.DEPOSIT) {
      action.verb = ActionVerbs.CONSUME;
    } else if (action.verb === ActionVerbs.CONSUME) {
      action.verb = ActionVerbs.DEPOSIT;
    }

    this.executeAction(action);
  }
}
