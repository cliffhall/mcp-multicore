/**
 * GatewayFacade - Main facade for the Gateway Core
 * Manages client connections and routes requests to appropriate server cores
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayNotifications } from "../common/constants.js";
import { GatewayConfig } from "../common/value-objects.js";
import { StartupCommand } from "./controller/startup-command.js";
import { ShutdownCommand } from "./controller/shutdown-command.js";
import { RegisterServerCommand } from "./controller/register-server-command.js";
import { RouteRequestCommand } from "./controller/route-request-command.js";
import { HandleClientConnectionCommand } from "./controller/handle-client-connection-command.js";

export class GatewayFacade extends Facade {
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
      () => new StartupCommand(),
    );
    this.registerCommand(
      GatewayNotifications.SHUTDOWN,
      () => new ShutdownCommand(),
    );
    this.registerCommand(
      GatewayNotifications.SERVER_REGISTERED,
      () => new RegisterServerCommand(),
    );
    this.registerCommand(
      GatewayNotifications.ROUTE_REQUEST,
      () => new RouteRequestCommand(),
    );
    this.registerCommand(
      GatewayNotifications.CLIENT_CONNECTED,
      () => new HandleClientConnectionCommand(),
    );
  }

  /**
   * Start the gateway with the given configuration
   */
  public startup(config: GatewayConfig): void {
    this.sendNotification(GatewayNotifications.STARTUP, config);
  }

  /**
   * Shutdown the gateway
   */
  public shutdown(): void {
    this.sendNotification(GatewayNotifications.SHUTDOWN);
  }
}
