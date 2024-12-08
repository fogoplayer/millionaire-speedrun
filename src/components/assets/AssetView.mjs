import { css, html, LitElement } from "lit";
import { Asset } from "../../models/assets/Asset.mjs";
import globalCss from "../../global-styles/global.css.mjs";

export class AssetView extends LitElement {
  static properties = {
    asset: { type: Asset },
  };

  constructor() {
    super();
    /** @type {Asset} */
    this.asset;
  }

  render() {
    return html`<table>
      <tr>
        <th>Name</th>
        <td>${this.asset.prettyName}</td>
      </tr>
      <tr>
        <th>+/tick</th>
        <td>
          ${[...this.asset.produces.entries()].map(
            ([resource, amount]) => html`${resource}: ${amount.toFixed(2)}<br />`
          )}
        </td>
      </tr>
      <tr>
        <th>-/tick</th>
        <td>
          ${[...this.asset.consumes.entries()].map(
            ([resource, amount]) => html`${resource}: ${amount.toFixed(2)}<br />`
          )}
        </td>
      </tr>
      <tr>
        <th>stores</th>
        <td>
          ${[...this.asset.storageUnits.entries()].map(
            ([resource, amount]) => html`${resource}: ${amount.toFixed(2)}<br />`
          )}
        </td>
      </tr>
    </table> `;
  }

  static styles = [
    globalCss,
    css`
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
    `,
  ];
}

customElements.define("asset-view", AssetView);
