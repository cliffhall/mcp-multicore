/**
 * Value objects for passing data between components
 */
import type { IFacade } from "@puremvc/puremvc-typescript-multicore-framework";
import { type IPipeMessage } from "@puremvc/puremvc-typescript-util-pipes";

export interface ILoggingFacade extends IFacade {
  log: (message: string, indent?: number) => void;
}

/**
 * Configuration for the Gateway Core
 */
export interface GatewayConfig {
  gateway: {
    transport: "stdio" | "sse" | "streamable-http";
    port?: number;
    host?: string;
    maxClients?: number;
  };
  dashboard?: DashboardConfig;
  servers?: ServerConfig[];
}

/**
 * Configuration for the Dashboard Core
 */
export interface DashboardConfig {
  port?: number;
  host?: string;
}

/**
 * Configuration for the Server Core
 */
export interface ServerConfig {
  id?: string;
  name: string;
  transport: "stdio" | "sse" | "streamable-http";
  command?: string; // For stdio transport
  args?: string[]; // For stdio transport
  env?: Record<string, string>; // For stdio transport
  url?: string; // For http transports
  autoConnect?: boolean;
}

/**
 * MCP Traffic Message
 */
export interface MCPTrafficMessage extends IPipeMessage {
  header:
    | {
        core: string;
        clientId: string;
        [key: string]: unknown;
      }
    | undefined;
}
