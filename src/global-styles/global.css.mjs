import { css } from "../libs/lit-all@2.7.6.js";
import resetsCss from "./resets.css.mjs";
import typographyCss from "./typography.css.mjs";
import variablesCss from "./variables.css.mjs";

export default css`
  ${resetsCss}${typographyCss}${variablesCss}

  main {
    padding: 1em;
  }

  button {
    padding: 1em;
    border: 1px solid black;
  }

  table {
    border-collapse: collapse;
  }

  th,
  button {
    font-weight: bold;
    background-color: #00000030;
  }

  th,
  td {
    border: 1px solid black;
  }
`;
