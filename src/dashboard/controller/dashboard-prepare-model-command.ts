import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import {
  type DashboardConfig,
  type ILoggingFacade,
} from "../../common/interfaces.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { DashboardConfigProxy } from "../model/dashboard-config-proxy.js";

export class DashboardPrepareModelCommand extends AsyncCommand {
  public execute(notification: INotification): void {
    const config = notification.body as DashboardConfig;
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ DashboardPrepareModelCommand - Preparing Dashboard Model`, 4);

    // Register Proxies
    this.facade.registerProxy(new DashboardConfigProxy(config));

    // Done
    f.log("✔︎ Dashboard Model Prepared", 5);
    this.commandComplete();
  }
}
