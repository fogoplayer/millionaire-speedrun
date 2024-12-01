import { Investment } from "./Investment.mjs";

export class CheckingAccount extends Investment {
  static prettyName = "Checking Account";
  static interestRate = 0.01;
}
