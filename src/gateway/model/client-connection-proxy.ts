/**
 * ClientConnectionProxy - Manages active client connections
 */

import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { ClientInfo } from "../../common/value-objects.js";
import { MCPMessage } from "../../common/mcp-types.js";

export class ClientConnectionProxy extends Proxy {
  public static readonly NAME = "ClientConnectionProxy";

  constructor() {
    super(ClientConnectionProxy.NAME, new Map<string, ClientInfo>());
  }

  /**
   * Get the map of connected clients
   */
  public getClients(): Map<string, ClientInfo> {
    return this.data;
  }

  /**
   * Register a new client connection
   */
  public registerClient(
    sessionId: string,
    metadata?: Record<string, unknown>,
  ): ClientInfo {
    const clientInfo: ClientInfo = {
      id: sessionId,
      connectedAt: new Date(),
      metadata,
    };

    this.data.set(sessionId, clientInfo);
    return clientInfo;
  }

  /**
   * Unregister a client connection
   */
  public unregisterClient(sessionId: string): boolean {
    return this.data.delete(sessionId);
  }

  /**
   * Get info about a specific client
   */
  public getClient(sessionId: string): ClientInfo | undefined {
    return this.data.get(sessionId);
  }

  /**
   * Check if a client is connected
   */
  public hasClient(sessionId: string): boolean {
    return this.data.has(sessionId);
  }

  /**
   * Get the total number of connected clients
   */
  public getClientCount(): number {
    return this.data.size;
  }

  /**
   * Send a message to a specific client
   * This should be overridden to implement actual transport logic
   */
  public async sendToClient(
    sessionId: string,
    message: MCPMessage,
  ): Promise<void> {
    if (!this.hasClient(sessionId)) {
      throw new Error(`Client ${sessionId} not found`);
    }

    // TODO: Implement actual WebSocket/HTTP sending logic
    console.log(`Sending to client ${sessionId}:`, message);
  }

  /**
   * Broadcast a message to all connected clients
   */
  public async broadcastToClients(message: MCPMessage): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const sessionId of this.data.keys()) {
      promises.push(this.sendToClient(sessionId, message));
    }

    await Promise.all(promises);
  }
}
