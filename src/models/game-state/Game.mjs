import { Scenario } from "../scenario-state/Scenario.mjs";

/** @type {Set<Scenario>} */
const scenarios = new Set([new Scenario()]); // May want to convert this to a list if only ever used in the UI

const currentScenario = scenarios.values().next().value;
