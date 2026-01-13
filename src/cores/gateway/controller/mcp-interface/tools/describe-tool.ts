import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  CallToolResult,
  type Tool,
  //  ToolSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GatewayFacade } from "../../../gateway-facade.js";
import { CoreNames } from "../../../../../common/index.js";
import { GatewayConfigProxy } from "../../../model/gateway-config-proxy.js";
import { ServerFacade } from "../../../../server/server-facade.js";

// Tool input schema
export const DescribeToolInputSchema = z.object({
  serverName: z.string().describe("Server to list tools for"),
  toolName: z.string().describe("Tool to describe"),
});

// Tool output schema
//const DescribeToolOutputSchema =  z.object(ToolSchema);

// Tool configuration
const name = "describe-tool";
const config = {
  title: "Describe Tool Tool",
  description: "Describe a tool on a connected server.",
  inputSchema: DescribeToolInputSchema,
};

console.error(config);
/**
 * Registers the 'describe-tool' tool.
 *
 * The registered tool, when invoked, returns the full tool description including
 * names, titles, descriptions, input and output schemas, _meta, annotations, icons, etc
 *
 * @param {McpServer} server - The server instance to which the tool will be registered.
 */
export const registerDescribeToolTool = (server: McpServer): void => {
  server.registerTool(name, config, async (args): Promise<CallToolResult> => {
    const validatedArgs = DescribeToolInputSchema.parse(args);
    const serverName = validatedArgs.serverName;
    const toolName = validatedArgs.toolName;
    let tool: Tool | void = undefined;
    let response: CallToolResult;

    // Get the gateway facade
    const gatewayFacade = GatewayFacade.getInstance(CoreNames.GATEWAY);

    // Get the config proxy
    const configProxy = gatewayFacade.retrieveProxy(
      GatewayConfigProxy.NAME,
    ) as GatewayConfigProxy;

    // Get the server configuration
    const serverConfig = configProxy.servers.find(
      (config) => config.serverName === serverName,
    );

    if (serverConfig && serverConfig.autoConnect) {
      // Get the server facade
      const serverFacade = ServerFacade.getInstance(serverConfig.serverName);

      // Get the tool list
      tool = serverFacade.describeTool(toolName);
    }

    if (tool) {
      // Compose the response
      response = {
        structuredContent: tool,
        content: [{ type: "text", text: JSON.stringify(tool, null, 2) }],
      };
    } else {
      let message: string;
      if (serverConfig && serverConfig.autoConnect) {
        message = `Tool ${toolName} not found on server "${serverName}".`;
      } else {
        message = `Server "${serverName}" ${serverConfig ? "not connected" : "not found"}.`;
      }
      // Compose the error response
      response = {
        content: [
          {
            type: "text",
            text: message,
          },
        ],
        isError: true,
      };
    }

    return response;
  });
};
