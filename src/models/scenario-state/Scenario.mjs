/** @typedef {import("../assets/Asset.mjs").Asset} Asset */
/** @typedef {import("../Resources.mjs").Resource} Resource */
import { ActionExecutor } from "../ActionExecutor.mjs";
import { BasicHumanNeeds } from "../assets/BasicHumanNeeds.mjs";
import { Resources } from "../Resources.mjs";
import { ScenarioAssetDirectory } from "./ScenarioAssetDirectory.mjs";

export class Scenario {
  assetDirectory = new ScenarioAssetDirectory();
  actionExecutor = new ActionExecutor(this.assetDirectory);

  /** @type {ReturnType<setInterval> | undefined} */
  tickInterval;

  currentTick = 0;

  /** @type {Set<() => void>} */
  onTickListeners = new Set();

  constructor() {
    this.assetDirectory.place(new BasicHumanNeeds({ scenario: this }));
  }

  tick() {
    this.assetDirectory.assets.forEach((asset) => {
      asset.tick(this.currentTick);
    });
    const success = this.actionExecutor.executeTransaction();
    if (!success) {
      this.pause();
      return;
    }

    this.onTickListeners.forEach((listener) => listener());
    this.printGameState();
    this.currentTick++;
  }

  play() {
    if (this.tickInterval) return;
    this.tickInterval = setInterval(() => this.tick(), 1000);
  }

  pause() {
    clearInterval(this.tickInterval);
    this.tickInterval = undefined;
  }

  /** @param {new({scenario}: {scenario: Scenario}) => Asset} assetClass */
  spawnAsset(assetClass) {
    const asset = new assetClass({ scenario: this });
    return asset;
  }

  /** @param {Asset} asset */
  placeAsset(asset) {
    asset.place();
  }

  getGameState() {
    return {
      ticks: this.currentTick,
      assets: this.assetDirectory.assets,
      productionTotals: this.getDirectoryEntryTotals(
        this.assetDirectory.producers,
        (asset, resource) => asset.produces.get(resource) || 0
      ),
      consumptionTotals: this.getDirectoryEntryTotals(
        this.assetDirectory.consumers,
        (asset, resource) => asset.consumes.get(resource) || 0
      ),
      storageTotals: this.getDirectoryEntryTotals(this.assetDirectory.stores, (asset, resource) =>
        asset.storageUnits.balance(resource)
      ),
      toString() {
        return `Ticks: ${this.ticks}
Assets: ${[...this.assets].map((asset) => asset.prettyName).join(", ")}
Production: ${JSON.stringify(this.productionTotals, null, 2)}
Consumption: ${JSON.stringify(this.consumptionTotals, null, 2)}
Storage: ${JSON.stringify(this.storageTotals, null, 2)}
          `;
      },
    };
  }

  /**
   * @param {Map<Resource, Set<Asset>>} directory
   * @param {(asset: Asset, resource: Resource) => number} extractor
   */
  getDirectoryEntryTotals(directory, extractor) {
    /** @type {Record<string, number>} */
    const resourceTotals = {};

    directory.forEach((assets, resource) => {
      resourceTotals[resource ?? ""] = [...assets].reduce((total, asset) => total + extractor(asset, resource), 0);
    });
    return resourceTotals;
  }

  printGameState() {
    console.log(this.getGameState().toString());
  }
}

// const game = new Game();
// game.placeAsset(new BronzeTradingPost(game.actionExecutor));
// game.placeAsset(new CheckingAccount(game.actionExecutor));
// game.placeAsset(new RamenFarmAsset(game.actionExecutor));
// game.placeAsset(new Pantry(game.actionExecutor));
// game.play();
