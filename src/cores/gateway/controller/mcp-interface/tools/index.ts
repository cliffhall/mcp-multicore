import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListServersTool } from "./list-servers.js";
import { registerListToolsTool } from "./list-tools.js";
import { registerDescribeToolTool } from "./describe-tool.js";

/**
 * Register the tools with the MCP Interface server.
 * @param server
 */
export const registerTools = (server: McpServer) => {
  registerListServersTool(server);
  registerListToolsTool(server);
  registerDescribeToolTool(server);
};
