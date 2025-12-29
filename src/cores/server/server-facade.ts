import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { LoggingFacade } from "../../common/index.js";
import { ServerNotifications } from "../../common/index.js";
import { ServerConfig } from "../../common/index.js";
import { StartupServerCommand } from "./controller/startup/startup-server-command.js";

/**
 * ServerFacade
 * Facade Multiton for an individual MCP server connection
 * - Manages an MCP server instance
 * - Routes client traffic to and from its server and visa-versa
 * - Server output is tee-d into the Dashboard Core along with other traffic
 * - Each MCP server has its own ServerFacade instance running in its own Core
 */
export class ServerFacade extends LoggingFacade {
  /**
   * Get or create the multiton instance
   */
  public static getInstance(multitonKey: string): ServerFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new ServerFacade(k),
    ) as ServerFacade;
  }

  /**
   * Minimally initialize the Controller by registering the startup command
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
  public async startup(config: ServerConfig): Promise<void> {
    this.log(`🔱 ServerFacade - Preparing Server Core ${this.multitonKey}`, 3);
    this.sendNotification(ServerNotifications.STARTUP, config);
  }
}
