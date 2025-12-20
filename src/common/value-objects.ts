/**
 * Value objects for passing data between components
 */

import { MCPMessage } from "./mcp-types";

/**
 * Information about a connected client
 */
export interface ClientInfo {
  id: string;
  connectedAt: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Information about a registered MCP server
 */
export interface ServerInfo {
  id: string;
  name: string;
  coreName: string; // The multicore name for this server's core
  capabilities: {
    tools?: string[];
    prompts?: string[];
    resources?: string[];
    tasks?: string[];
  };
  status: "connecting" | "connected" | "disconnected" | "error";
  endpoint?: string;
  registeredAt: Date;
}

/**
 * A request from a client that needs routing
 */
export interface RoutableRequest {
  sessionId: string;
  requestId: string | number;
  message: MCPMessage;
  timestamp: Date;
}

/**
 * A response from a server to return to a client
 */
export interface ServerResponse {
  serverId: string;
  requestId: string | number;
  message: MCPMessage;
  timestamp: Date;
}

/**
 * Configuration for the gateway
 */
export interface GatewayConfig {
  port: number;
  host: string;
  maxClients?: number;
  servers?: ServerConfig[];
}

/**
 * Configuration for an MCP server connection
 */
export interface ServerConfig {
  id: string;
  name: string;
  transport: "stdio" | "sse" | "streamable-http" | "websocket";
  command?: string; // For stdio transport
  args?: string[]; // For stdio transport
  url?: string; // For http transports
  env?: Record<string, string>;
  autoConnect?: boolean;
}

/**
 * Routing decision result
 */
export interface RoutingDecision {
  serverId: string;
  serverCoreName: string;
  canHandle: boolean;
  reason?: string;
}
