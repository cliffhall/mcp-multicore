import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import {
  AdapterNotifications,
  type ILoggingFacade,
} from "../../common/index.js";
import { AdapterStartupCommand } from "./controller/startup/adapter-startup-command.js";
import type { AdapterConfig } from "../../common/index.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

/**
 * AdapterFacade
 * Facade Multiton for the Adapter Core
 * - Accepts JSON RPC on STDIN
 * - Optionally plumbs and tees to a Dashboard Core
 * -
 */
export class AdapterFacade extends Facade implements ILoggingFacade {
  /**
   * Get or create the multiton instance
   */
  public static getInstance(multitonKey: string): AdapterFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new AdapterFacade(k),
    ) as AdapterFacade;
  }

  /**
   * Minimally initialize the Controller by registering the startup command
   */
  protected initializeController(): void {
    super.initializeController();
    this.registerCommand(
      AdapterNotifications.STARTUP,
      () => new AdapterStartupCommand(),
    );
  }

  /**
   * Start the Adapter with the given configuration
   */
  public startup(config: AdapterConfig): void {
    this.log("🔱 AdapterFacade - Preparing the Adapter Core");
    this.sendNotification(AdapterNotifications.STARTUP, config);
  }

  /**
   * Hierarchical logging method for all PureMVC actors
   * @param _message
   * @param _indent
   */
  public log(_message: string, _indent?: number): void {
    // Swallow log messages in the adapter.
    // It cannot log to STDIO or STDERR because it takes
    // input from STDIN and echos it to STDERR.
  }

  /**
   * Send a JSON RPC message into the Adapter
   * @param message
   */
  public sendJSONRPCMessage(message: JSONRPCMessage): void {
    this.sendNotification(
      AdapterNotifications.PROCESS_JSON_RPC_MESSAGE,
      message,
    );
  }
}
