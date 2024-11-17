import { Scenario } from "../scenario-state/Scenario.mjs";

export let currentScenario = new Scenario();

const scenarios = [currentScenario]; // May want to convert this to a list if only ever used in the UI
