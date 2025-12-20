/**
 * ServerFacade - Facade for an individual MCP server connection
 * Each MCP server gets its own ServerFacade instance running in its own core
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerNotifications } from "../common/constants.js";
import { ServerConfig } from "../common/interfaces.js";
import { StartupServerCommand } from "./controller/startup-server-command.js";

export class ServerFacade extends Facade {
  protected static nextId: number = 0;

  /**
   * Generates and returns a new unique multiton key.
   *
   * The key is generated using a predefined format that includes a unique incrementing identifier.
   *
   * @return {string} A newly generated multiton key in the format "server-{id}".
   */
  public static getNewMultitonKey(): string {
    return `server-${ServerFacade.nextId++}`;
  }

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
      () => new StartupServerCommand(),
    );
  }

  /**
   * Start this server core with the given configuration
   */
  public startup(config: ServerConfig): void {
    this.sendNotification(ServerNotifications.STARTUP, config);
  }

  /**
   * Shutdown this server core
   */
  public shutdown(): void {
    this.sendNotification(ServerNotifications.SHUTDOWN);
  }
}
