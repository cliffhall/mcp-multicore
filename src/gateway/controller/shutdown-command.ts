/**
 * ShutdownCommand - Cleanly shuts down the Gateway Core
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { ClientConnectionProxy } from "../model/client-connection-proxy.js";
import { ServerRegistryProxy } from "../model/server-registry-proxy.js";
import { RoutingProxy } from "../model/routing-proxy.js";

export class ShutdownCommand extends SimpleCommand {
  public execute(_notification: INotification): void {
    console.log("Shutting down Gateway Core...");

    // Get proxies
    const clientProxy = this.facade.retrieveProxy(
      ClientConnectionProxy.NAME,
    ) as ClientConnectionProxy;

    const serverRegistry = this.facade.retrieveProxy(
      ServerRegistryProxy.NAME,
    ) as ServerRegistryProxy;

    // Disconnect all clients
    if (clientProxy) {
      const clients = clientProxy.getClients();
      for (const sessionId of clients.keys()) {
        clientProxy.unregisterClient(sessionId);
      }
    }

    // TODO: Shutdown all server cores
    if (serverRegistry) {
      const servers = serverRegistry.getAllServers();
      for (const server of servers) {
        // Send shutdown notification to each server core
        console.log(`Shutting down server core: ${server.coreName}`);
      }
    }

    // Remove proxies
    this.facade.removeProxy(ClientConnectionProxy.NAME);
    this.facade.removeProxy(ServerRegistryProxy.NAME);
    this.facade.removeProxy(RoutingProxy.NAME);

    console.log("Gateway Core shutdown complete");
  }
}
