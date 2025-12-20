/**
 * RouteRequestCommand - Routes a client request to the appropriate server
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { RoutableRequest } from "../../common/value-objects.js";
import { RoutingProxy } from "../model/routing-proxy.js";
import { GatewayNotifications } from "../../common/constants.js";
import { JSONRPCResponse } from "../../common/mcp-types.js";

export class RouteRequestCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const request = notification.body as RoutableRequest;

    const routingProxy = this.facade.retrieveProxy(
      RoutingProxy.NAME,
    ) as RoutingProxy;

    if (!routingProxy) {
      console.error("RoutingProxy not found");
      this.sendErrorResponse(request, "Gateway routing not available");
      return;
    }

    // Determine which server should handle this request
    const decision = routingProxy.routeRequest(request);

    if (!decision || !decision.canHandle) {
      const reason = decision?.reason || "Unable to route request";
      console.error("Routing failed:", reason);
      this.sendErrorResponse(request, reason);
      return;
    }

    console.log(
      `Routing request ${request.requestId} to server: ${decision.serverId}`,
    );

    // TODO: Send request through pipe to the appropriate server core
    // This would use PureMVC's Pipe utility to send inter-core messages
    // For now, we'll just log the routing decision

    // In a full implementation, you would:
    // 1. Get the pipe junction for the target server core
    // 2. Create a pipe message containing the request
    // 3. Send the message through the pipe

    // Example:
    // const junction = JunctionMediator.retrieveJunction(decision.serverCoreName);
    // const message = new Message(PipeMessages.REQUEST_TO_SERVER, null, request);
    // junction.sendMessage(message);
  }

  /**
   * Send an error response back to the client
   */
  private sendErrorResponse(
    request: RoutableRequest,
    errorMessage: string,
  ): void {
    const errorResponse: JSONRPCResponse = {
      jsonrpc: "2.0",
      id: request.requestId,
      error: {
        code: -32000,
        message: errorMessage,
      },
    };

    // Send the error back through the gateway
    this.sendNotification(GatewayNotifications.SERVER_RESPONSE, {
      serverId: "gateway",
      requestId: request.requestId,
      message: errorResponse,
      timestamp: new Date(),
    });
  }
}
