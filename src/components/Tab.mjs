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
      :host,
      details {
        display: contents;
      }

      ::slotted(:not([slot])) {
        order: 1;
        width: 100%;
      }
    `,
  ];
}

customElements.define("tab-", Tab);
