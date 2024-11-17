/** @typedef {import("./assets/Asset.mjs").Asset} Asset */
/** @typedef {import("./Resources.mjs").Resource} Resource */
import { ActionExecutor } from "./ActionExecutor.mjs";
import { assetsPlaced, consumersPlaced, producersPlaced, storesPlaced } from "./AssetDirectory.mjs";
import { RamenFarmAsset } from "./assets/food/producers/RamenFarmAsset.mjs";
import { Pantry } from "./assets/food/storage/Pantry.mjs";
import { BronzeTradingPost } from "./assets/money/producers/BronzeTradingPost.mjs";
import { CheckingAccount } from "./assets/money/storage/CheckingAccount.mjs";

export class Game {
  actionExecutor = new ActionExecutor();

  /** @type {ReturnType<setInterval> | undefined} */
  tickInterval;

  #ticks = 0;

  tick() {
    assetsPlaced.forEach((asset) => {
      asset.tick(this.#ticks);
    });
    this.actionExecutor.executeTransaction();
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
      assets: [...assetsPlaced].map((asset) => asset.name).join(", "),
      productionTotals: this.getDirectoryEntryTotals(producersPlaced),
      consumptionTotals: this.getDirectoryEntryTotals(consumersPlaced),
      storageTotals: this.getDirectoryEntryTotals(storesPlaced),
    };
  }

  /** @param {Map<Resource, Asset[]>} directory */
  getDirectoryEntryTotals(directory) {
    /** @type {Record<string, number>} */
    const resourceTotals = {};

    directory.forEach((assets, resource) => {
      resourceTotals[resource.description ?? ""] = assets.reduce(
        (total, asset) => total + asset.storageUnits.balance(resource),
        0
      );
    });
    return resourceTotals;
  }

  printGameState() {
    const state = this.getGameState();
    console.log(`Ticks: ${state.ticks}
Assets: ${state.assets}
Production: ${JSON.stringify(state.productionTotals)}
Consumption: ${JSON.stringify(state.consumptionTotals)}
Storage: ${JSON.stringify(state.storageTotals)}
`);
  }
}

const game = new Game();
game.placeAsset(new BronzeTradingPost(game.actionExecutor));
game.placeAsset(new CheckingAccount(game.actionExecutor));
game.placeAsset(new RamenFarmAsset(game.actionExecutor));
game.placeAsset(new Pantry(game.actionExecutor));
game.play();
