import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEchoTool } from "./echo.js";
import { registerListServersTool } from "./list-servers.js";

/**
 * Register the tools with the MCP factory.
 * @param server
 */
export const registerTools = (server: McpServer) => {
  registerEchoTool(server);
  registerListServersTool(server);
};
