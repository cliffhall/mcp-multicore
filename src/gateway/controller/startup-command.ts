/**
 * StartupCommand - Initializes the Gateway Core
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayConfig } from "../../common/value-objects.js";
import { ClientConnectionProxy } from "../model/client-connection-proxy.js";
import { ServerRegistryProxy } from "../model/server-registry-proxy.js";
import { RoutingProxy } from "../model/routing-proxy.js";
import { ClientRequestMediator } from "../view/client-request-mediator.js";
import { ServerResponseMediator } from "../view/server-response-mediator.js";

export class StartupCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as GatewayConfig;

    console.log("Starting Gateway Core with config:", config);

    // Register Model proxies
    this.facade.registerProxy(new ClientConnectionProxy());
    this.facade.registerProxy(new ServerRegistryProxy());
    this.facade.registerProxy(new RoutingProxy());

    // Register View mediators
    this.facade.registerMediator(new ClientRequestMediator());
    this.facade.registerMediator(new ServerResponseMediator());

    // TODO: Initialize server transport (WebSocket/HTTP server)
    // TODO: Initialize server cores based on config.servers

    console.log("Gateway Core started successfully");
  }
}
