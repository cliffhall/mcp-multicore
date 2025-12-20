/**
 * ServerFacade - Facade for an individual MCP server connection
 * Each MCP server gets its own ServerFacade instance running in its own core
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerNotifications } from "../common/constants.js";
import { ServerConfig } from "../common/value-objects.js";
/*
import { StartupCommand } from './controller/StartupCommand.js';
import { ShutdownCommand } from './controller/ShutdownCommand.js';
import { ConnectCommand } from './controller/ConnectCommand.js';
import { DisconnectCommand } from './controller/DisconnectCommand.js';
import { SendMessageCommand } from './controller/SendMessageCommand.js';
import { InitializeCommand } from './controller/InitializeCommand.js';
*/

export class ServerFacade extends Facade {
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

    /*
        this.registerCommand(ServerNotifications.STARTUP, () => new StartupCommand());
        this.registerCommand(ServerNotifications.SHUTDOWN, () => new ShutdownCommand());
        this.registerCommand(ServerNotifications.CONNECT, () => new ConnectCommand());
        this.registerCommand(ServerNotifications.DISCONNECT, () => new DisconnectCommand());
        this.registerCommand(ServerNotifications.SEND_MESSAGE, () => new SendMessageCommand());
        this.registerCommand(ServerNotifications.INITIALIZE, () => new InitializeCommand());
*/
  }

  /**
   * Start this server core with the given configuration
   */
  public startup(config: ServerConfig): void {
    this.sendNotification(ServerNotifications.STARTUP, config);
  }

  /**
   * Connect to the MCP server
   */
  public connect(): void {
    this.sendNotification(ServerNotifications.CONNECT);
  }

  /**
   * Disconnect from the MCP server
   */
  public disconnect(): void {
    this.sendNotification(ServerNotifications.DISCONNECT);
  }

  /**
   * Shutdown this server core
   */
  public shutdown(): void {
    this.sendNotification(ServerNotifications.SHUTDOWN);
  }
}
