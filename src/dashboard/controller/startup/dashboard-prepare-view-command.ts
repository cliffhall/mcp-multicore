import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../common/interfaces.js";
import { DashboardJunctionMediator } from "../../view/dashboard-junction-mediator.js";

export class DashboardPrepareViewCommand extends SimpleCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ DashboardPrepareViewCommand - Preparing Dashboard View`, 5);

    // Register Mediators
    this.facade.registerMediator(new DashboardJunctionMediator());

    // Done
    f.log("✔︎ Dashboard View prepared", 6);
  }
}
