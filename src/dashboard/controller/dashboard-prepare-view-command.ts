import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../common/interfaces.js";
import { DashboardJunctionMediator } from "../view/dashboard-junction-mediator.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";

export class DashboardPrepareViewCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ DashboardPrepareViewCommand - Preparing Dashboard View`, 4);

    // Register Mediators
    this.facade.registerMediator(new DashboardJunctionMediator());

    // Done
    f.log("✔︎ Dashboard View prepared", 5);
    this.commandComplete();
  }
}
