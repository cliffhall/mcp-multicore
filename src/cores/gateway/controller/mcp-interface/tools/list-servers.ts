import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { GatewayFacade } from "../../../gateway-facade.js";
import { CoreNames } from "../../../../../common/index.js";
import { GatewayConfigProxy } from "../../../model/gateway-config-proxy.js";
import { ServerFacade } from "../../../../server/server-facade.js";

// Tool output schema
const ListServersOutputSchema = z.object({
  servers: z.array(
    z.object({
      name: z.string().describe("The name of the server"),
      title: z.string().optional().describe("Title of the server"),
      description: z.string().optional().describe("Description of the server"),
    }),
  ),
});

// Server entry interface
interface ServerEntry {
  name: string;
  title?: string;
  description?: string;
}

// Tool configuration
const name = "list-servers";
const config = {
  title: "List Servers Tool",
  description: "Lists the servers connected to the gateway.",
  outputSchema: ListServersOutputSchema,
};

/**
 *
 * Registers the 'list-servers' tool.
 *
 * The registered tool, when invoked, returns a list of servers along with their titles and descriptions.
 *
 * @param {McpServer} server - The server instance to which the tool will be registered.
 */
export const registerListServersTool = (server: McpServer): void => {
  server.registerTool(name, config, async (): Promise<CallToolResult> => {
    // Get the gateway facade
    const gatewayFacade = GatewayFacade.getInstance(
      CoreNames.GATEWAY,
    );

    // Get the config proxy
    const configProxy = gatewayFacade.retrieveProxy(
      GatewayConfigProxy.NAME,
    ) as GatewayConfigProxy;

    // Build entries for each connected server
    const info: ServerEntry[] = [];
    for (const serverConfig of configProxy.servers) {
      if (serverConfig.autoConnect) {
        // Get the server facade
        const serverFacade = ServerFacade.getInstance(
          serverConfig.serverName,
        ) as ServerFacade;

        // Get the server initialization result
        const result = serverFacade.getServerInitializationResult();

        // Create list entry
        if (result) {
          info.push({
            name: serverConfig.serverName,
            title: result?.serverInfo?.title,
            description: result?.serverInfo?.description,
          });
        }
      }
    }

    // Compose and send the response
    const response = { servers: info };
    return {
      structuredContent: response,
      content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
    };
  });
};
