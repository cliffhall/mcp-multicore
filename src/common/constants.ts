import type { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import type { Implementation } from "@modelcontextprotocol/sdk/types.js";

// Keys for singleton cores
export class SingletonKeys {
  static readonly GATEWAY = "gateway";
  static readonly DASHBOARD = "dashboard";
}

// Gateway Core notifications
export class GatewayNotifications {
  static readonly STARTUP = "gateway/startup";
}

// Server Core notifications
export class ServerNotifications {
  static readonly STARTUP = "server/startup";
  static readonly SHUTDOWN = "server/shutdown";
}

// Dashboard Core notifications
export class DashboardNotifications {
  static readonly STARTUP = "dashboard/startup";
  static readonly ADD_MESSAGE_TO_STREAM = "dashboard/message/add";
}

// MCP Interface Implementation
const implementation: Implementation = {
  version: "0.1.0",
  name: "mcp-multicore/gateway",
  title: "MultiCore MCP Gateway",
  websiteUrl: "https://github.com/cliffhall/mcp-multicore",
};

// MCP Interface Server options
const options: ServerOptions = {
  capabilities: {
    tools: {
      listChanged: true,
    },
    logging: {},
  },
  instructions: "MCP MultiCore Gateway - Instructions go here",
};

export const MCPInterfaceConfig = { implementation, options };
