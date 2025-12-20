/**
 * GatewayFacade - Main facade for the Gateway Core
 * Manages client connections and routes requests to appropriate server cores
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { LoggingFacade } from "../common/actors/logging-facade.js";
import { DashboardNotifications } from "../common/constants.js";
import { StartupDashboardCommand } from "./controller/startup-dashboard-command.js";
import { type DashboardConfig } from "../common/interfaces.js";

export class DashboardFacade extends LoggingFacade {
  /**
   * Get or create the singleton instance
   */
  public static getInstance(multitonKey: string): DashboardFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new DashboardFacade(k),
    ) as DashboardFacade;
  }

  /**
   * Initialize the Controller by registering Commands
   */
  protected initializeController(): void {
    super.initializeController();

    this.registerCommand(
      DashboardNotifications.STARTUP,
      () => new StartupDashboardCommand(),
    );
  }

  /**
   * Start the dashboard with the given configuration
   */
  public startup(config: DashboardConfig): void {
    this.log("🔱 Dashboard Facade - Preparing the Dashboard Core");
    this.sendNotification(DashboardNotifications.STARTUP, config);
  }
}
