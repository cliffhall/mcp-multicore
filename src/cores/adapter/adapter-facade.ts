import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { AdapterNotifications } from "../../common/constants.js";
import { AdapterStartupCommand } from "./controller/startup/adapter-startup-command.js";
import { LoggingFacade } from "../../common/actors/logging-facade.js";
import type { AdapterConfig } from "../../common/interfaces.js";

/**
 * AdapterFacade
 * Facade Multiton for the Adapter Core
 * - Accepts JSON RPC on STDIN
 * - Optionally plumbs and tees to a Dashboard Core
 * -
 */
export class AdapterFacade extends LoggingFacade {
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
}
