import { Resources } from "../../../Resources.mjs";
import { Stat } from "../../../Stat.mjs";
import { Investment } from "./Investment.mjs";

export class CheckingAccount extends Investment {
  static prettyName = "Checking Account";
  static stores = [new Stat(Resources.MONEY, 100)];
  static interestRate = 0.01;
}
