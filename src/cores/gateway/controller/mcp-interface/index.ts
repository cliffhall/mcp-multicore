import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerTools } from "./tools/index.js";

// MCP Interface factory response
export type MCPInterfaceFactoryResponse = {
  mcpServer: McpServer;
  cleanup: (sessionId?: string) => void;
};

/**
 * Gateway MCP Interface factory function
 *
 * @returns {MCPInterfaceFactoryResponse} An object containing the gatwway server instance, and a `cleanup`
 * function for handling server-side cleanup when a session ends.
 *
 * Properties of the returned object:
 * - `mcpServer` {Object}: The initialized McpServer instance.
 * - `cleanup` {Function}: Function to perform cleanup operations for a closing session.
 */
export const createMCPInterface: () => MCPInterfaceFactoryResponse = () => {
  const server = new McpServer(
    {
      name: "mcp-multicore/gateway",
      title: "MCP MultiCore Gateway",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {
          listChanged: true,
        },
        logging: {},
      },
      instructions: "MCP MultiCore Gateway - Instructions go here",
    },
  );

  // Register the tools
  registerTools(server);

  // Return the ServerFactoryResponse
  return {
    mcpServer: server,
    cleanup: () => {},
  } satisfies MCPInterfaceFactoryResponse;
};
