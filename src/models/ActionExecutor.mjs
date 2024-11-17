/** @typedef {import("./ScenarioAssetDirectory.mjs").ScenarioAssetDirectory} AssetDirectory */
import { Action } from "./Action.mjs";

export class ActionExecutor {
  /** @type {Action[][]} */
  transactionHistory = [];

  /** @type {Action[]} */
  transactionQueue = [];
  actionsInQueueExecuted = 0;

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

    for (
      this.actionsInQueueExecuted = 0;
      this.actionsInQueueExecuted < this.transactionQueue.length;
      this.actionsInQueueExecuted++
    ) {
      const result = this.executeAction(this.transactionQueue[this.actionsInQueueExecuted]);
      if (result instanceof Error) {
        this.undoTransaction();
        noError = false;
        break;
      }
    }

    if (noError) {
      this.transactionHistory.push(this.transactionQueue);
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
    let resourceStore = this.assetDirectory.stores.get(action.resource)?.[0];
    if (!resourceStore) {
      console.warn(`Storage for ${action.resource.description} not found`);
      return -1;
    }
    return resourceStore.handleAction(action);
  }

  undoTransaction() {
    for (let i = this.actionsInQueueExecuted - 1; i >= 0; i--) {
      this.undoAction(this.transactionQueue[i]);
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
