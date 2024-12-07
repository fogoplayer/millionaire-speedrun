/** @typedef {import("./Tab.mjs").Tab} Tab */
import { css, html, LitElement } from "lit";
import { Scenario } from "../models/scenario-state/Scenario.mjs";
import globalCss from "../global-styles/global.css.mjs";

export class TabList extends LitElement {
  static properties = {
    title: { type: String },
  };

  render() {
    /** @type {NodeListOf<Tab>} */
    const slottedElements = this.querySelectorAll("tab-");
    return html`<slot
      @toggle="${(/** @type {ToggleEvent} */ e) => {
        if (e.target.open) {
          slottedElements.forEach((el) => {
            if (el !== e.target) {
              el.open = false;
            }
          });
        }
      }}"
    ></slot>`;
  }

  static styles = [
    globalCss,
    css`
      :host {
        display: flex;
        flex-wrap: wrap;
      }
    `,
  ];
}

customElements.define("tab-list", TabList);
