/**
 * GatewayFacade - Facade for the Gateway Core and primary entry point for the whole application
 * - Creates and plumbs Dashboard and Server cores
 * - Manages client connections and routes requests to appropriate server cores
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayNotifications } from "../common/constants.js";
import { GatewayStartupCommand } from "./controller/startup/gateway-startup-command.js";
import { LoggingFacade } from "../common/actors/logging-facade.js";
import type { GatewayConfig } from "../common/interfaces.js";

export class GatewayFacade extends LoggingFacade {
  /**
   * Get or create the multiton instance
   */
  public static getInstance(multitonKey: string): GatewayFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new GatewayFacade(k),
    ) as GatewayFacade;
  }

  /**
   * Minimally initialize the Controller by registering the startup command
   */
  protected initializeController(): void {
    super.initializeController();
    this.registerCommand(
      GatewayNotifications.STARTUP,
      () => new GatewayStartupCommand(),
    );
  }

  /**
   * Start the Gateway with the given configuration
   */
  public startup(config: GatewayConfig): void {
    this.log("🔱 GatewayFacade - Preparing the Gateway Core");
    this.sendNotification(GatewayNotifications.STARTUP, config);
  }
}
