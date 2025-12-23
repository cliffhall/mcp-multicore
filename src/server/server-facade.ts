/**
 * ServerFacade - Facade for an individual MCP server connection
 * Each MCP server gets its own ServerFacade instance running in its own core
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { LoggingFacade } from "../common/actors/logging-facade.js";
import { ServerNotifications } from "../common/constants.js";
import { ServerConfig } from "../common/interfaces.js";
import { ServerStartupCommand } from "./controller/server-startup-command.js";

export class ServerFacade extends LoggingFacade {
  /**
   * Get or create the singleton instance
   */
  public static getInstance(multitonKey: string): ServerFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new ServerFacade(k),
    ) as ServerFacade;
  }

  /**
   * Initialize the Controller by registering Commands
   */
  protected initializeController(): void {
    super.initializeController();
    this.registerCommand(
      ServerNotifications.STARTUP,
      () => new ServerStartupCommand(),
    );
  }

  /**
   * Start this server core with the given configuration
   */
  public async startup(config: ServerConfig): Promise<void> {
    this.log(`🔱 ServerFacade - Preparing Server Core ${this.multitonKey}`, 2);
    this.sendNotification(ServerNotifications.STARTUP, config);
  }
}
