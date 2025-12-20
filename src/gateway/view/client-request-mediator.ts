/**
 * ClientRequestMediator - Handles incoming requests from clients
 */

import {
  Mediator,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayNotifications } from "../../common/constants.js";
import { RoutableRequest } from "../../common/value-objects.js";
import { JSONRPCRequest, MCPMessage } from "../../common/mcp-types.js";

export class ClientRequestMediator extends Mediator {
  public static readonly NAME = "ClientRequestMediator";

  constructor() {
    super(ClientRequestMediator.NAME);
  }

  /**
   * List the notifications this mediator is interested in
   */
  public listNotificationInterests(): string[] {
    return [GatewayNotifications.CLIENT_REQUEST];
  }

  /**
   * Handle notifications
   */
  public handleNotification(notification: INotification): void {
    switch (notification.name) {
      case GatewayNotifications.CLIENT_REQUEST:
        this.handleClientRequest(notification);
        break;
    }
  }

  /**
   * Process an incoming client request
   */
  private handleClientRequest(notification: INotification): void {
    const { sessionId, message } = notification.body as {
      sessionId: string;
      message: MCPMessage;
    };

    // Create a routable request
    const request: RoutableRequest = {
      sessionId,
      requestId: (message as JSONRPCRequest)?.id || `req_${Date.now()}`,
      message,
      timestamp: new Date(),
    };

    console.log(`Received request from client ${sessionId}:`, message);

    // Send for routing
    this.sendNotification(GatewayNotifications.ROUTE_REQUEST, request);
  }
}
