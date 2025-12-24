import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  type DashboardConfig,
  type ILoggingFacade,
} from "../../common/interfaces.js";
import { DashboardConfigProxy } from "../model/dashboard-config-proxy.js";
import { DashboardStreamsProxy } from "../model/dashboard-streams-proxy.js";

export class DashboardPrepareModelCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as DashboardConfig;
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ DashboardPrepareModelCommand - Preparing Dashboard Model`, 5);

    // Register Proxies
    this.facade.registerProxy(new DashboardConfigProxy(config));
    this.facade.registerProxy(new DashboardStreamsProxy());

    // Done
    f.log("✔︎ Dashboard Model Prepared", 6);
  }
}
