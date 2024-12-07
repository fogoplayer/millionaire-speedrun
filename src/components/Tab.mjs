import { css, html, LitElement } from "lit";
import { Scenario } from "../models/scenario-state/Scenario.mjs";
import globalCss from "../global-styles/global.css.mjs";

export class Tab extends LitElement {
  static properties = {
    title: { type: String },
    open: { type: Boolean, reflect: true },
  };

  constructor() {
    super();
    this.open = false;
  }

  render() {
    return html`<details
      ?open="${this.open}"
      @click="${
        /** @param {ToggleEvent} e */ (e) => {
          e.preventDefault();
          this.open = !this.open;
          this.dispatchEvent(new Event("toggle", { ...e, bubbles: true }));
        }
      }"
    >
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
