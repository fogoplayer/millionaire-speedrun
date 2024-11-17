/** @typedef {import("./assets/Asset.mjs").Asset} Asset */
/** @typedef {import("./Resources.mjs").Resource} Resource */
import { ActionExecutor } from "./ActionExecutor.mjs";
import { AssetDirectory } from "./AssetDirectory.mjs";
import { RamenFarmAsset } from "./assets/food/producers/RamenFarmAsset.mjs";
import { Pantry } from "./assets/food/storage/Pantry.mjs";
import { BronzeTradingPost } from "./assets/money/producers/BronzeTradingPost.mjs";
import { CheckingAccount } from "./assets/money/storage/CheckingAccount.mjs";

export class Game {
  assetDirectory = new AssetDirectory();
  actionExecutor = new ActionExecutor(this.assetDirectory);

  /** @type {ReturnType<setInterval> | undefined} */
  tickInterval;

  #ticks = 0;

  /** @type {Set<() => void>} */
  onTickListeners = new Set();

  tick() {
    this.assetDirectory.assetsPlaced.forEach((asset) => {
      asset.tick(this.#ticks);
    });
    const success = this.actionExecutor.executeTransaction();
    if (!success) {
      this.pause();
      return;
    }

    this.onTickListeners.forEach((listener) => listener());
    this.printGameState();
    this.#ticks++;
  }

  play() {
    this.tickInterval = setInterval(() => this.tick(), 1000);
  }

  pause() {
    clearInterval(this.tickInterval);
  }

  /** @param {Asset} asset */
  placeAsset(asset) {
    asset.place();
  }

  getGameState() {
    return {
      ticks: this.#ticks,
      assets: [...this.assetDirectory.assetsPlaced].map((asset) => asset.name).join(", "),
      productionTotals: this.getDirectoryEntryTotals(
        this.assetDirectory.producersPlaced,
        (asset, resource) => asset.produces.get(resource) || 0
      ),
      consumptionTotals: this.getDirectoryEntryTotals(
        this.assetDirectory.consumersPlaced,
        (asset, resource) => asset.consumes.get(resource) || 0
      ),
      storageTotals: this.getDirectoryEntryTotals(this.assetDirectory.storesPlaced, (asset, resource) =>
        asset.storageUnits.balance(resource)
      ),
      toString() {
        return `Ticks: ${this.ticks}
Assets: ${this.assets}
Production: ${JSON.stringify(this.productionTotals, null, 2)}
Consumption: ${JSON.stringify(this.consumptionTotals, null, 2)}
Storage: ${JSON.stringify(this.storageTotals, null, 2)}
          `;
      },
    };
  }

  /**
   * @param {Map<Resource, Asset[]>} directory
   * @param {(asset: Asset, resource: Resource) => number} extractor
   */
  getDirectoryEntryTotals(directory, extractor) {
    /** @type {Record<string, number>} */
    const resourceTotals = {};

    directory.forEach((assets, resource) => {
      resourceTotals[resource.description ?? ""] = assets.reduce(
        (total, asset) => total + extractor(asset, resource),
        0
      );
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
