import type { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import type { Implementation } from "@modelcontextprotocol/sdk/types.js";

// Names for singleton cores
export class CoreNames {
  static readonly GATEWAY = "gateway";
  static readonly DASHBOARD = "dashboard";
}

// Gateway Core notifications
export class GatewayNotifications {
  static readonly STARTUP = "gateway/startup";
  static readonly CLIENT_REQUEST = "gateway/request/client";
}

// Server Core notifications
export class ServerNotifications {
  static readonly STARTUP = "server/startup";
  static readonly SERVER_RESPONSE = "gateway/response/server";
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

// MCP Interface Configuration
export const MCPInterfaceConfig = { implementation, options };


export const ClientInfo = {
    protocolVersion: "2024-11-05",
    capabilities: {
      roots: {
        listChanged: true,
      },
      sampling: {},
      elicitation: {
        form: {},
        url: {},
      },
      tasks: {
        requests: {
          elicitation: {
            create: {},
          },
          sampling: {
            createMessage: {},
          },
        },
      },
    },
    clientInfo: {
      name: "MCP-MultiCore",
      title: "The PureMVC MultiCore MCP Gateway",
      version: "0.1.0",
      description: "An MCP gateway implemented with PureMVC MultiCore and Pipes",
      icons: [
        {
          src: "https://puremvc.org/images/puremvc-logo.png",
          mimeType: "image/png",
          sizes: ["60x60"],
        },
      ],
      websiteUrl: "https://github.com/cliffhall/mcp-multicore",
    },
  };
