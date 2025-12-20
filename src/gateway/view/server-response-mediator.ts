/**
 * ServerResponseMediator - Handles responses from server cores and sends them back to clients
 */

import {
  Mediator,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayNotifications } from "../../common/constants.js";
import { ServerResponse } from "../../common/value-objects.js";
import { ClientConnectionProxy } from "../model/client-connection-proxy.js";
import { RoutingProxy } from "../model/routing-proxy.js";

export class ServerResponseMediator extends Mediator {
  public static readonly NAME = "ServerResponseMediator";

  constructor() {
    super(ServerResponseMediator.NAME);
  }

  /**
   * List the notifications this mediator is interested in
   */
  public listNotificationInterests(): string[] {
    return [GatewayNotifications.SERVER_RESPONSE];
  }

  /**
   * Handle notifications
   */
  public handleNotification(notification: INotification): void {
    switch (notification.name) {
      case GatewayNotifications.SERVER_RESPONSE:
        this.handleServerResponse(notification);
        break;
    }
  }

  /**
   * Process a response from a server and send it back to the client
   */
  private async handleServerResponse(
    notification: INotification,
  ): Promise<void> {
    const response = notification.body as ServerResponse;

    console.log(
      `Received response from server ${response.serverId}:`,
      response.message,
    );

    // Get the routing proxy to find which client made this request
    const routingProxy = this.facade.retrieveProxy(
      RoutingProxy.NAME,
    ) as RoutingProxy;

    const clientProxy = this.facade.retrieveProxy(
      ClientConnectionProxy.NAME,
    ) as ClientConnectionProxy;

    if (!routingProxy || !clientProxy) {
      console.error("Required proxies not available");
      return;
    }

    // Find the client ID from the request tracking
    // In a real implementation, you'd track client-request mappings
    // For now, we'll need to enhance the routing proxy to track this

    // TODO: Implement client lookup from request ID
    // const sessionId = routingProxy.getClientForRequest(response.requestId);

    // For now, send to all clients (broadcast)
    try {
      await clientProxy.broadcastToClients(response.message);

      // Clean up the request tracking
      routingProxy.clearRequest(response.requestId);
    } catch (error) {
      console.error("Error sending response to client:", error);
    }
  }
}
