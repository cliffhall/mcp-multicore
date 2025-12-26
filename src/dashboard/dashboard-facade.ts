/**
 * DashboardFacade - Facade for Dashboard Core
 * - Inspect JSONRPC traffic between Gateway and Server Cores
 * - Provides Dashboard web interface
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { LoggingFacade } from "../common/actors/logging-facade.js";
import { DashboardNotifications } from "../common/constants.js";
import {
  type DashboardConfig,
  type ILoggingFacade,
} from "../common/interfaces.js";
import { DashboardStartupCommand } from "./controller/startup/dashboard-startup-command.js";

export class DashboardFacade extends LoggingFacade implements ILoggingFacade {
  /**
   * Get or create the multiton instance
   */
  public static getInstance(multitonKey: string): DashboardFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new DashboardFacade(k),
    ) as DashboardFacade;
  }

  /**
   * Minimally initialize the Controller by registering the startup command
   */
  protected initializeController(): void {
    super.initializeController();
    this.registerCommand(
      DashboardNotifications.STARTUP,
      () => new DashboardStartupCommand(),
    );
  }

  /**
   * Start the dashboard with the given configuration
   */
  public startup(config: DashboardConfig): void {
    this.log("🔱 Dashboard Facade - Preparing the Dashboard Core", 3);
    this.sendNotification(DashboardNotifications.STARTUP, config);
  }
}
