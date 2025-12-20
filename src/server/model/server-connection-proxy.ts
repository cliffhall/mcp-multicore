/**
 * ServerConnectionProxy - Manages the connection to a specific MCP server
 */

import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerConfig } from "../../common/value-objects.js";
import { MCPMessage, JSONRPCRequest } from "../../common/mcp-types.js";
import { ServerNotifications } from "../../common/constants.js";
import { ChildProcess } from "node:child_process";

export interface ConnectionState {
  status: "disconnected" | "connecting" | "connected" | "error";
  error?: string;
  transport?: "stdio" | "sse" | "websocket";
  lastConnected?: Date;
}

export class ServerConnectionProxy extends Proxy {
  public static readonly NAME = "ServerConnectionProxy";

  private config?: ServerConfig;
  private messageIdCounter = 0;

  // Transport-specific connection objects
  private process?: ChildProcess; // For stdio transport
  private eventSource?: EventSource; // For SSE transport
  private webSocket?: WebSocket; // For WebSocket transport

  constructor() {
    super(ServerConnectionProxy.NAME, {
      status: "disconnected",
    });
  }

  /**
   * Set the server configuration
   */
  public setConfig(config: ServerConfig): void {
    this.config = config;
    this.data.transport = config.transport;
  }

  /**
   * Get the current connection state
   */
  public getState(): ConnectionState {
    return this.data;
  }

  /**
   * Connect to the MCP server based on transport type
   */
  public async connect(): Promise<void> {
    if (!this.config) {
      throw new Error("Server configuration not set");
    }

    this.data.status = "connecting";

    try {
      switch (this.config.transport) {
        case "stdio":
          await this.connectStdio();
          break;
        case "sse":
          await this.connectSSE();
          break;
        case "websocket":
          await this.connectWebSocket();
          break;
        default:
          throw new Error(`Unsupported transport: ${this.config.transport}`);
      }

      this.data.status = "connected";
      this.data.lastConnected = new Date();
      this.sendNotification(ServerNotifications.CONNECTED);
    } catch (error) {
      this.data.status = "error";
      this.data.error = (error as Error).message;
      this.sendNotification(ServerNotifications.ERROR, error);
      throw error;
    }
  }

  /**
   * Connect via stdio (spawn a child process)
   */
  private async connectStdio(): Promise<void> {
    if (!this.config?.command) {
      throw new Error("No command specified for stdio transport");
    }

    // TODO: Implement actual stdio spawning using child_process
    console.log(`Would spawn stdio process: ${this.config.command}`);
    console.log("Args:", this.config.args);
    console.log("Env:", this.config.env);

    // Example implementation would use:
    // const { spawn } = require('child_process');
    // this.process = spawn(this.config.command, this.config.args, {
    //     env: { ...process.env, ...this.config.env },
    //     stdio: ['pipe', 'pipe', 'pipe']
    // });
    //
    // this.process.stdout.on('data', (data) => this.handleMessage(data));
    // this.process.stderr.on('data', (data) => console.error('Server error:', data));
  }

  /**
   * Connect via Server-Sent Events
   */
  private async connectSSE(): Promise<void> {
    if (!this.config?.url) {
      throw new Error("No URL specified for SSE transport");
    }

    console.log(`Connecting to SSE endpoint: ${this.config.url}`);

    // TODO: Implement actual SSE connection
    // this.eventSource = new EventSource(this.config.url);
    // this.eventSource.onmessage = (event) => this.handleMessage(event.data);
    // this.eventSource.onerror = (error) => this.handleError(error);
  }

  /**
   * Connect via WebSocket
   */
  private async connectWebSocket(): Promise<void> {
    if (!this.config?.url) {
      throw new Error("No URL specified for WebSocket transport");
    }

    console.log(`Connecting to WebSocket: ${this.config.url}`);

    return new Promise((resolve) => {
      // TODO: Implement actual WebSocket connection
      // this.webSocket = new WebSocket(this.config.url);
      //
      // this.webSocket.onopen = () => resolve();
      // this.webSocket.onmessage = (event) => this.handleMessage(event.data);
      // this.webSocket.onerror = (error) => reject(error);
      // this.webSocket.onclose = () => this.handleDisconnect();

      // For now, just resolve immediately
      resolve();
    });
  }

  /**
   * Disconnect from the server
   */
  public disconnect(): void {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = undefined;
    }

    if (this.webSocket) {
      this.webSocket.close();
      this.webSocket = undefined;
    }

    this.data.status = "disconnected";
    this.sendNotification(ServerNotifications.DISCONNECTED);
  }

  /**
   * Send a message to the server
   */
  public async sendMessage(message: MCPMessage): Promise<void> {
    if (this.data.status !== "connected") {
      throw new Error("Not connected to server");
    }

    const jsonMessage = JSON.stringify(message);

    switch (this.config?.transport) {
      case "stdio":
        if (this.process?.stdin) {
          this.process.stdin.write(jsonMessage + "\n");
        }
        break;

      case "websocket":
        if (this.webSocket) {
          this.webSocket.send(jsonMessage);
        }
        break;

      case "sse":
        // SSE is typically one-way, would need separate POST endpoint
        console.warn("Sending via SSE not implemented");
        break;
    }

    console.log("Sent to server:", message);
  }

  /**
   * Handle incoming message from server
   */
  private handleMessage(data: string | Buffer): void {
    try {
      const message = JSON.parse(data.toString()) as MCPMessage;
      this.sendNotification(ServerNotifications.MESSAGE_RECEIVED, message);
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  }

  /**
   * Generate a unique message ID
   */
  public generateMessageId(): number {
    return ++this.messageIdCounter;
  }

  /**
   * Create a JSON-RPC request
   */
  public createRequest(
    method: string,
    params?: Record<string, unknown>,
  ): JSONRPCRequest {
    return {
      jsonrpc: "2.0",
      id: this.generateMessageId(),
      method,
      params,
    };
  }
}
