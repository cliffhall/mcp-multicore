/**
 * StartupCommand - Initializes the Dashboard Core
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayConfig } from "../../common/interfaces.js";

export class StartupDashboardCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as GatewayConfig;

    console.log("Starting Dashboard Core with config:", config);

    // Register Model proxies
    // this.facade.registerProxy(new LoggingProxy());
    // this.facade.registerProxy(new MetricsProxy());

    // Register View mediators
    // this.facade.registerMediator(new DashboardClientMediator());
    // this.facade.registerMediator(new DashboardJunctionMediator());

    console.log("Dashboard Core started successfully");
  }
}
