/**
 * HandleClientConnectionCommand - Handles new client connections
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { ClientConnectionProxy } from "../model/client-connection-proxy.js";

export class HandleClientConnectionCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const { sessionId, metadata } = notification.body as {
      sessionId: string;
      metadata?: Record<string, unknown>;
    };

    const clientProxy = this.facade.retrieveProxy(
      ClientConnectionProxy.NAME,
    ) as ClientConnectionProxy;

    if (clientProxy) {
      const clientInfo = clientProxy.registerClient(sessionId, metadata);
      console.log(`Client connected: ${sessionId}`, clientInfo);
    }
  }
}
