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
                  <td>${asset.produces}</td>
                </tr>
                <tr>
                  <th>-/tick</th>
                  <td>${asset.consumes}</td>
                </tr>
                <tr>
                  <th>stores</th>
                  <td>${asset.storageUnits}</td>
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
                  <td><output>${this.scenario.getGameState().productionTotals[resourceKey] ?? 0}</output></td>
                  <td><output>${this.scenario.getGameState().consumptionTotals[resourceKey] ?? 0}</output></td>
                  <td><output>${this.scenario.getGameState().storageTotals[resourceKey] ?? 0}</output></td>
                </tr>`
            )}
          </table>
        </aside>
        <form class="controls" @submit=${(/** @type {MouseEvent} */ e) => e.preventDefault()}>
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
                <table>
                  <tr>
                    <th>Asset</th>
                    <th>Produces</th>
                    <th>Consumes</th>
                    <th>Stores</th>
                    <th>Action</th>
                  </tr>
                  ${[...assets].map(
                    (asset) => html`
                      <tr>
                        <td>${
                          // @ts-ignore
                          asset.prettyName
                        }</td>
                        <td>${
                          // @ts-ignore
                          asset.produces.map(
                            /** @param {{resource: Resource, amount: number}} args */
                            ({ resource, amount }) => html`<p>${resource}: ${amount}</p>`
                          )
                        }</td>
                        <td>${
                          // @ts-ignore
                          asset.consumes.map(
                            /** @param {{resource: Resource, amount: number}} args */
                            ({ resource, amount }) => html`<p>${resource}: ${amount}</p>`
                          )
                        }</td>
                        <td>${
                          // @ts-ignore
                          asset.stores.map(
                            /** @param {Stat<Resource> | Resource} statOrResource */ (statOrResource) =>
                              html`<p>${statOrResource instanceof Stat ? statOrResource.resource : statOrResource}</p>`
                          )
                        }</td>
                        <td><button @click=${() => {
                          const Class = /** @type {new()=>Asset} */ (asset);
                          const newAsset = this.scenario.spawnAsset(Class);
                          this.scenario.placeAsset(newAsset);
                          this.requestUpdate();
                        }}>Add</button></button></td>
                      </tr>
                    </table>`
                  )}
                </table>
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
      button {
        padding: 1em;
        border: 1px solid black;
      }

      table {
        border-collapse: collapse;
      }

      th {
        font-weight: bold;
        background-color: #00000044;
      }

      th,
      td {
        border: 1px solid black;
      }

      main {
        display: grid;
        grid-template-areas:
          "asset-display totals"
          "controls totals"
          "asset-directory asset-directory";
        grid-template-columns: 1fr auto;

        padding: 0;
      }

      .asset-display {
        grid-area: asset-display;

        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(10em, auto));
        background-color: lightgoldenrodyellow;
      }

      .totals {
        grid-area: totals;
        background-color: lightgreen;
      }

      .controls {
        grid-area: controls;
        background-color: lightblue;
      }

      .asset-directory {
        grid-area: asset-directory;
        display: flex;
        background-color: lightpink;
      }

      summary h2 {
        display: inline-block;
        font: inherit;
      }
    `,
  ];
}

customElements.define("home-", Home);
