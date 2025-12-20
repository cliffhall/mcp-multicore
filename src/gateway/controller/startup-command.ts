/**
 * StartupCommand - Initializes the Gateway Core
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayConfig } from "../../common/value-objects.js";

export class StartupCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as GatewayConfig;

    console.log("Starting Gateway Core with config:", config);

    // Register Model proxies
    // this.facade.registerProxy(new ClientRegistryProxy());
    // this.facade.registerProxy(new ServerRegistryProxy());

    // Register View mediators
    // this.facade.registerMediator(new ClientMediator());
    // this.facade.registerMediator(new GatewayJunctionMediator());

    console.log("Gateway Core started successfully");
  }
}
