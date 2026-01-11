import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListServersTool } from "./list-servers.js";
import { registerListToolsTool } from "./list-tools.js";

/**
 * Register the tools with the MCP factory.
 * @param server
 */
export const registerTools = (server: McpServer) => {
  registerListServersTool(server);
  registerListToolsTool(server);
};
