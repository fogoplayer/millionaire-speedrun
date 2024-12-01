/** @typedef {import("../models/Resources.mjs").Resource} Resource */
import { css, html, LitElement } from "lit";
import { Stat } from "../models/Stat.mjs";
import { Scenario } from "../models/scenario-state/Scenario.mjs";
import { Asset } from "../models/assets/Asset.mjs";
import globalCss from "../global-styles/global.css.mjs";

export class DirectoryEntry extends LitElement {
  static properties = {
    scenario: { type: Scenario },
    asset: { type: Asset.constructor },
  };

  constructor() {
    super();
    /** @type {Scenario} */
    this.scenario;
    /** @type {Asset["constructor"]} */
    this.asset;
  }

  render() {
    return html`<table>
      <tr>
        <th>Asset</th>
        <td>
          ${
            // @ts-ignore
            this.asset.prettyName
          }
        </td>
      </tr>
      <tr>
        <th>Produces</th>
        <td>
          ${
            // @ts-ignore
            this.asset.produces.map(
              /** @param {{resource: Resource, amount: number}} args */
              ({ resource, amount }) => html`<p>${resource}: ${amount}</p>`
            )
          }
        </td>
      </tr>
      <tr>
        <th>Consumes</th>
        <td>
          ${
            // @ts-ignore
            this.asset.consumes.map(
              /** @param {{resource: Resource, amount: number}} args */
              ({ resource, amount }) => html`<p>${resource}: ${amount}</p>`
            )
          }
        </td>
      </tr>
      <tr>
        <th>Stores</th>
        <td>
          ${
            // @ts-ignore
            this.asset.stores.map(
              /** @param {Stat<Resource> | Resource} statOrResource */ (statOrResource) =>
                html`<p>${statOrResource instanceof Stat ? statOrResource.resource : statOrResource}</p>`
            )
          }
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <button
            style="display:block; margin: 0.5em auto;"
            @click=${() => {
              const Class = /** @type {new()=>Asset} */ (this.asset);
              const newAsset = this.scenario.spawnAsset(Class);
              this.scenario.placeAsset(newAsset);
              this.requestUpdate();
            }}
          >
            Add to scenario
          </button>
        </td>
      </tr>
    </table>`;
  }

  static styles = globalCss;
}

customElements.define("directory-entry", DirectoryEntry);
