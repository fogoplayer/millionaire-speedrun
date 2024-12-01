import { css, html, LitElement } from "lit";
import { Scenario } from "../models/scenario-state/Scenario.mjs";
import globalCss from "../global-styles/global.css.mjs";

export class Tab extends LitElement {
  static properties = {
    title: { type: String },
  };

  render() {
    return html`<details open>
      <summary>
        <slot name="title"></slot>
      </summary>
      <slot></slot>
    </details>`;
  }

  static styles = [
    globalCss,
    css`
      :host {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: 1/-1;
      }

      details {
        display: contents;
      }
    `,
  ];
}

customElements.define("tab-", Tab);
