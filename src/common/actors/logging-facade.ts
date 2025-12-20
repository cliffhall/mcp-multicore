/**
 * GatewayFacade - Main facade for the Gateway Core
 * Manages client connections and routes requests to appropriate server cores
 */

import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { ConsoleMediator } from "./console-mediator.js";
import type { ILoggingFacade } from "../interfaces.js";

export class LoggingFacade extends Facade implements ILoggingFacade {
  /**
   * Initialize the `View`
   * @override
   */
  protected override initializeView(): void {
    super.initializeView();
    this.registerMediator(new ConsoleMediator(console));
  }

  /**
   * Hierarchical logging method for all PureMVC actors
   * @param message
   * @param indent
   */
  public log(message: string, indent?: number): void {
    this.sendNotification(
      ConsoleMediator.CONSOLE_MESSAGE,
      message,
      indent?.toString(),
    );
  }
}
