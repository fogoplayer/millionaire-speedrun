import { ActionExecutor } from "./ActionExecutor.mjs";
import { assetsPlaced } from "./AssetDirectory.mjs";

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
    this.#ticks++;
  }

  play() {
    this.tickInterval = setInterval(() => this.tick(), 1000);
  }

  pause() {
    clearInterval(this.tickInterval);
  }
}
