import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../../common/index.js";
import { DashboardTeeMediator } from "../../../../common/index.js";
import { AdapterJunctionMediator } from "../../view/adapter-junction-mediator.js";

export class AdapterPrepareViewCommand extends SimpleCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(`⚙️ AdapterPrepareViewCommand - Preparing Adapter View`, 2);

    // Register Mediators
    this.facade.registerMediator(new AdapterJunctionMediator());
    this.facade.registerMediator(new DashboardTeeMediator());

    f.log("✔︎ Adapter View prepared", 3);
  }
}
