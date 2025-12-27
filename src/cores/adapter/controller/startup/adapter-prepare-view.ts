import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  type AdapterConfig,
  type ILoggingFacade,
} from "../../../../common/index.js";
import { DashboardTeeMediator } from "../../../../common/index.js";
import { AdapterJunctionMediator } from "../../view/adapter-junction-mediator.js";
import { StderrMediator } from "../../view/stderr-mediator.js";

export class AdapterPrepareViewCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(`⚙️ AdapterPrepareViewCommand - Preparing Adapter View`, 2);

    // Register Mediators
    this.facade.registerMediator(new AdapterJunctionMediator());

    // Prepare to mediate the Dashboard Tee if necessary
    const config = notification.body as AdapterConfig;
    if (config.output === "dashboard" || config.output === "both") {
      this.facade.registerMediator(new DashboardTeeMediator());
    }
    // Prepare to mediate Stderr if necessary
    if (config.output === "stderr" || config.output === "both") {
      this.facade.registerMediator(new StderrMediator());
    }

    f.log("✔︎ Adapter View prepared", 3);
  }
}
