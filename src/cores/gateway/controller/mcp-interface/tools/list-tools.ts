import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult, type Tool } from "@modelcontextprotocol/sdk/types.js";
import { GatewayFacade } from "../../../gateway-facade.js";
import { CoreNames } from "../../../../../common/index.js";
import { GatewayConfigProxy } from "../../../model/gateway-config-proxy.js";
import { ServerFacade } from "../../../../server/server-facade.js";

// Tool input schema
export const ListToolsInputSchema = z.object({
  serverName: z.string().describe("Server to list tools for"),
});

// Tool output schema
const ListToolsOutputSchema = z.object({
  tools: z.array(
    z.object({
      name: z.string().describe("The name of the tool"),
      title: z.string().optional().describe("Title of the tool"),
      description: z.string().optional().describe("Description of the tool"),
    }),
  ),
});

// Tool entry interface
interface ToolEntry {
  name: string;
  title?: string;
  description?: string;
}

// Tool configuration
const name = "list-tools";
const config = {
  title: "List Tools Tool",
  description: "Lists the tools on a connected server.",
  inputSchema: ListToolsInputSchema,
  outputSchema: ListToolsOutputSchema,
};

/**
 * Registers the 'list-tools' tool.
 *
 * The registered tool, when invoked, returns a list of tools for the connected server,
 * along with their titles and descriptions.
 *
 * @param {McpServer} server - The server instance to which the tool will be registered.
 */
export const registerListToolsTool = (server: McpServer): void => {
  server.registerTool(name, config, async (args): Promise<CallToolResult> => {
    const validatedArgs = ListToolsInputSchema.parse(args);
    const serverName = validatedArgs.serverName;

    // Get the gateway facade
    const gatewayFacade = GatewayFacade.getInstance(CoreNames.GATEWAY);

    // Get the config proxy
    const configProxy = gatewayFacade.retrieveProxy(
      GatewayConfigProxy.NAME,
    ) as GatewayConfigProxy;

    // Build entries for each connected server
    const list: ToolEntry[] = [];
    const serverConfig = configProxy.servers.find(
      (config) => config.serverName === serverName,
    );

    let response;
    if (serverConfig && serverConfig.autoConnect) {
      // Get the server facade
      const serverFacade = ServerFacade.getInstance(serverConfig.serverName);

      // Get the tool list
      const tools: Tool[] | void = serverFacade.getToolsList();

      // Create the list entries
      if (tools && tools.length > 0) {
        for (const tool of tools) {
          list.push({
            name: tool?.name,
            title: tool?.title,
            description: tool?.description,
          });
        }
      }

      // Compose the response
      const content = { tools: list };
      response = {
        structuredContent: content,
        content: [{ type: "text", text: JSON.stringify(content, null, 2) }],
      };
    } else {
      // Compose the error response
      response = {
        content: [
          {
            type: "text",
            text: `Server "${serverName}" not found or not connected.`,
          },
        ],
        isError: true,
      };
    }

    return response;
  });
};
