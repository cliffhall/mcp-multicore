/**
 * StartupCommand - Initializes the Dashboard Core
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayConfig, type ILoggingFacade } from "../../common/interfaces.js";
import { DashboardJunctionMediator } from "../view/dashboard-junction-mediator.js";

export class StartupDashboardCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as GatewayConfig;
    const f = this.facade as ILoggingFacade;

    f.log(
      `👉 StartupDashboardCommand - Starting Dashboard Core with config: ${JSON.stringify(config)}`,
      1,
    );

    // Register Proxies
    // this.facade.registerProxy(new LoggingProxy());
    // this.facade.registerProxy(new MetricsProxy());

    // Register Mediators
    // this.facade.registerMediator(new DashboardClientMediator());
    this.facade.registerMediator(new DashboardJunctionMediator());

    f.log("✅ Dashboard Core started successfully", 2);
  }
}
