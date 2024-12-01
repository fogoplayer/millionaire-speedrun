/** @typedef {import("../models/assets/Asset.mjs").Asset} Asset */
/** @typedef {import("../models/Resources.mjs").Resource} Resource */
import { LitElement, html, css } from "../libs/lit-all@2.7.6.js";
import globalCss from "../global-styles/global.css.mjs";
import { BronzeTradingPost } from "../models/assets/money/producers/BronzeTradingPost.mjs";
import "../models/assets/money/producers/SilverTradingPost.mjs";
import { CheckingAccount } from "../models/assets/money/storage/CheckingAccount.mjs";
import { RamenFarm } from "../models/assets/food/producers/RamenFarm.mjs";
import { Pantry } from "../models/assets/food/storage/Pantry.mjs";
import { currentScenario, setCurrentScenario } from "../models/game-state/Game.mjs";
import * as GlobalAssetDirectory from "../models/game-state/GlobalAssetDirectory.mjs";
import { Stat } from "../models/Stat.mjs";
import { Resources } from "../models/Resources.mjs";
// component imports
import "../components/DirectoryEntry.mjs";

export default class Home extends LitElement {
  static get properties() {
    return { gameState: { type: Object, state: true } };
  }

  constructor() {
    super();
    this.startGame();
    this.scenario.placeAsset(this.scenario.spawnAsset(BronzeTradingPost));
    this.scenario.placeAsset(this.scenario.spawnAsset(CheckingAccount));
    this.scenario.placeAsset(this.scenario.spawnAsset(RamenFarm));
    this.scenario.placeAsset(this.scenario.spawnAsset(Pantry));
  }

  scenario = currentScenario;

  render() {
    return html`<header><h1>Millionaire Speedrun</h1></header>
      <main>
        <section class="asset-display">
          ${[...this.scenario.getGameState().assets].map(
            (asset) =>
              html`<table>
                <tr>
                  <th>Name</th>
                  <td>${asset.prettyName}</td>
                </tr>
                <tr>
                  <th>+/tick</th>
                  <td>
                    ${[...asset.produces.entries()].map(
                      ([resource, amount]) => html`${resource}: ${amount.toFixed(2)}<br />`
                    )}
                  </td>
                </tr>
                <tr>
                  <th>-/tick</th>
                  <td>
                    ${[...asset.consumes.entries()].map(
                      ([resource, amount]) => html`${resource}: ${amount.toFixed(2)}<br />`
                    )}
                  </td>
                </tr>
                <tr>
                  <th>stores</th>
                  <td>
                    ${[...asset.storageUnits.entries()].map(
                      ([resource, amount]) => html`${resource}: ${amount.toFixed(2)}<br />`
                    )}
                  </td>
                </tr>
              </table>`
          )}
        </section>
        <aside class="totals">
          <table>
            <tr>
              <th>Resource</th>
              <th>+/tick</th>
              <th>-/tick</th>
              <th>Total stored</th>
            </tr>
            ${Object.values(Resources).map(
              (resourceKey) =>
                html`<tr>
                  <th>${resourceKey}</th>
                  <td>
                    <output>${this.scenario.getGameState().productionTotals[resourceKey]?.toFixed(2) ?? 0}</output>
                  </td>
                  <td>
                    <output>${this.scenario.getGameState().consumptionTotals[resourceKey]?.toFixed(2) ?? 0}</output>
                  </td>
                  <td><output>${this.scenario.getGameState().storageTotals[resourceKey]?.toFixed(2) ?? 0}</output></td>
                </tr>`
            )}
          </table>
        </aside>
        <form class="controls" @submit=${(/** @type {MouseEvent} */ e) => e.preventDefault()}>
          <div>Tick: ${this.scenario.currentTick}</div>
          <button @click=${() => this.scenario.play()}>Play</button>
          <button @click=${() => this.scenario.pause()}>Pause</button>
          <button @click=${() => this.startGame()}>Restart</button>
        </form>
        <form class="asset-directory" @submit=${(/** @type {MouseEvent} */ e) => e.preventDefault()}>
          ${[...GlobalAssetDirectory.assetsByResource.entries()].map(
            ([resource, assets]) =>
              html` <details open>
                <summary>
                  <h2>${resource}</h2>
                </summary>
                <div class="directory-list">
                  ${[...assets].map(
                    (asset) => html`<directory-entry .scenario=${this.scenario} .asset=${asset}></directory-entry>`
                  )}
                </div>
              </details>`
          )}
        </form>
      </main>`;
  }

  startGame() {
    setCurrentScenario();
    this.scenario = currentScenario;
    this.scenario.onTickListeners.add(() => {
      this.requestUpdate();
    });
    this.requestUpdate();
  }

  static styles = [
    globalCss,
    css`
      main {
        display: grid;
        grid-template-areas:
          "asset-display totals"
          "controls totals"
          "asset-directory asset-directory";
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr auto auto;

        padding: 0;
        min-height: calc(100dvh - 2em);

        > * {
          padding: 0.5em;
          gap: 0.5em;
        }
      }

      .asset-display {
        grid-area: asset-display;

        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(10em, auto));
        grid-auto-rows: min-content;
        gap: 0.5em;

        background-color: lightgoldenrodyellow;
        padding: 0.5em;

        table {
          display: grid;
          grid-template-columns: auto 1fr;

          tbody,
          tr {
            display: grid;
            grid-column: 1/-1;
            grid-template-columns: subgrid;
          }
        }
      }

      .totals {
        grid-area: totals;
        background-color: lightgreen;
      }

      .controls {
        grid-area: controls;

        display: flex;
        justify-content: center;

        background-color: lightblue;
      }

      .asset-directory {
        grid-area: asset-directory;

        display: flex;

        background-color: lightpink;

        overflow-x: auto;

        .directory-list {
          display: flex;
          gap: 0.5em;
        }
      }

      summary h2 {
        display: inline-block;
        font: inherit;
      }
    `,
  ];
}

customElements.define("home-", Home);
