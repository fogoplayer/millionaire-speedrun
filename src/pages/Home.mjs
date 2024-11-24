/** @typedef {import("../models/assets/Asset.mjs").Asset} Asset */
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
        ${this.scenario
          .getGameState()
          .toString()
          .split("\n")
          .reduce((acc, curr) => {
            acc.push(curr, html`<br />`);
            return acc;
          }, /** @type {any[]} */ ([]))}
      </main>
      <form action="#" @submit=${(e) => e.preventDefault()}>
        <button @click=${() => this.scenario.play()}>Play</button>
        <button @click=${() => this.scenario.pause()}>Pause</button>
        <button @click=${() => this.startGame()}>Restart</button>

        ${[...GlobalAssetDirectory.assetsByResource.entries()].map(
          ([resource, assets]) =>
            html` <h2>${resource.description}</h2>
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
                      <td>${asset.prettyName}</td>
                      <td>${[...asset.produces].map(({ resource, amount }) => html`<p>${resource.description}: ${amount}</p>`)}</td>
                      <td>${[...asset.consumes].map(({ resource, amount }) => html`<p>${resource.description}: ${amount}</p>`)}</td>
                      <td>${[...asset.stores].map(
                        (statOrResource) =>
                          html`<p>
                            ${statOrResource instanceof Stat
                              ? statOrResource.resource.description
                              : statOrResource.description}
                          </p>`
                      )}</td>
                      <td><button @click=${() => {
                        const Class = /** @type {new()=>Asset} */ (asset.constructor);
                        const newAsset = this.scenario.spawnAsset(Class);
                        this.scenario.placeAsset(newAsset);
                        this.requestUpdate();
                      }}>Add</button></button></td>
                    </tr>
                  </table>`
                )}
              </table>`
        )}
      </form>`;
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

      td {
        border: 1px solid black;
      }
    `,
  ];
}

customElements.define("home-", Home);
