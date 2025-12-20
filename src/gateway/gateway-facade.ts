/**
 * GatewayFacade - Main facade for the Gateway Core
 * Manages client connections and routes requests to appropriate server cores
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayNotifications } from "../common/constants.js";
import { StartupGatewayCommand } from "./controller/startup/startup-gateway-command.js";
import { GatewayConfig } from "../common/interfaces.js";
import { LoggingFacade } from "../common/actors/logging-facade.js";

export class GatewayFacade extends LoggingFacade {
  /**
   * Get or create the singleton instance
   */
  public static getInstance(multitonKey: string): GatewayFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new GatewayFacade(k),
    ) as GatewayFacade;
  }

  /**
   * Initialize the Controller by registering Commands
   */
  protected initializeController(): void {
    super.initializeController();

    this.registerCommand(
      GatewayNotifications.STARTUP,
      () => new StartupGatewayCommand(),
    );
  }

  /**
   * Start the gateway with the given configuration
   */
  public startup(config: GatewayConfig): void {
    this.log("🔱 GatewayFacade - Preparing the Gateway Core");
    this.sendNotification(GatewayNotifications.STARTUP, config);
  }
}
