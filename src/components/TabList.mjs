import { css, html, LitElement } from "lit";
import { Scenario } from "../models/scenario-state/Scenario.mjs";
import globalCss from "../global-styles/global.css.mjs";

export class TabList extends LitElement {
  static properties = {
    title: { type: String },
  };

  render() {
    return html`<slot></slot>`;
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
