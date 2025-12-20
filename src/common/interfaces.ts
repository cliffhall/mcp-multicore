/**
 * Value objects for passing data between components
 */

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
  env?: Record<string, string>; // For stdio transport
  url?: string; // For http transports
  autoConnect?: boolean;
}
