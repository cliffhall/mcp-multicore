/**
 * Value objects for passing data between components
 */
import type { IFacade } from "@puremvc/puremvc-typescript-multicore-framework";

export interface ILoggingFacade extends IFacade {
  log: (message: string, indent?: number) => void;
}

/**
 * Configuration for the gateway core
 */
export interface GatewayConfig {
  port?: number;
  host?: number;
  maxClients?: number;
  dashboard?: DashboardConfig;
  servers?: ServerConfig[];
}

/**
 * Configuration for the dasbhoard core
 */
export interface DashboardConfig {
  port?: number;
  host?: string;
}

/**
 * Configuration for the server core
 */
export interface ServerConfig {
  id?: string;
  name: string;
  transport: "stdio" | "sse" | "streamable-http" | "websocket";
  command?: string; // For stdio transport
  args?: string[]; // For stdio transport
  env?: Record<string, string>; // For stdio transport
  url?: string; // For http transports
  autoConnect?: boolean;
}
