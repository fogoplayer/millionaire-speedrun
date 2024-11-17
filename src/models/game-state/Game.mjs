import { Scenario } from "../scenario-state/Scenario.mjs";

const scenarios = new Set();
export let currentScenario = new Scenario(); // thrown away

export function setCurrentScenario(scenario = new Scenario()) {
  scenarios.add(currentScenario);
  currentScenario = scenario;
}
