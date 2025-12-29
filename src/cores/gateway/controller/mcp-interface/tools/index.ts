import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerEchoTool } from "./echo.js";

/**
 * Register the tools with the MCP factory.
 * @param server
 */
export const registerTools = (server: McpServer) => {
  registerEchoTool(server);
};
