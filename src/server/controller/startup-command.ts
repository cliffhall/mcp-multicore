/**
 * StartupCommand - Initializes the Gateway Core
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerConfig } from "../../common/value-objects.js";

export class StartupCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as ServerConfig;
    console.log(
      `Starting Server Core ${this.multitonKey} with config:`,
      config,
    );

    // Register Proxies
    // this.facade.registerProxy(new ConnectionProxy());

    // Register Mediators
    // this.facade.registerMediator(new ServerJunctionMediator());
    // this.facade.registerMediator(new ServerResponseMediator());

    console.log("Server Core started successfully");
  }
}
