/**
 * ClientConnectionProxy - Manages active client connections
 */

import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerRegistryProxy } from "./server-registry-proxy";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";

interface DiscoverResult {
  serverId: string;
  toolsRegistered?: boolean;
  count: number;
}

export class ClientConnectionProxy extends Proxy {
  private clientServers: Map<string, McpServer> = new Map();
  private clientToolMappings: Map<string, Map<string, string>> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  async handleDiscoverTools(
    clientId: string,
    serverId: string,
    options?: { aliasPrefix?: string },
  ): Promise<DiscoverResult> {
    // No deduplication - each client request is independent
    // Just read from ServerRegistryProxy cache
    const registry = this.facade.retrieveProxy(
      "ServerRegistryProxy",
    ) as ServerRegistryProxy;
    const tools = registry.getServerTools(serverId);

    if (!tools || tools.length === 0) {
      throw new Error(`Server ${serverId} not found or has no tools`);
    }

    const clientServer = this.clientServers.get(clientId)!;
    const prefix = options?.aliasPrefix || serverId;
    const registered: string[] = [];

    // Register each tool on THIS client's McpServer instance
    for (const tool of tools) {
      const toolName = `${prefix}:${tool.name}`;

      clientServer.tool(toolName, tool.inputSchema, async (args: any) => {
        // Route to appropriate Server Core
        return await this.invokeRemoteTool(serverId, tool.name, args);
      });

      // Track mapping
      this.clientToolMappings.get(clientId)!.set(toolName, serverId);
      registered.push(toolName);
    }

    return {
      serverId,
      toolsRegistered: registered,
      count: tools.length,
    };
  }

  private async invokeRemoteTool(
    serverId: string,
    toolName: string,
    args: any,
  ): Promise<any> {
    // Send request through pipes to Server Core
    const requestId = `${serverId}-${Date.now()}-${Math.random()}`;

    return new Promise((resolve, reject) => {
      // Register response handler
      this.pendingRequests.set(requestId, { resolve, reject });

      // Send pipe message to Server Core
      this.sendNotification(INVOKE_TOOL_REQUEST, {
        requestId,
        serverId,
        toolName,
        arguments: args,
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error("Tool invocation timeout"));
        }
      }, 30000);
    });
  }

  handleToolResult(data: any) {
    const { requestId, result, error } = data;
    const pending = this.pendingRequests.get(requestId);

    if (pending) {
      this.pendingRequests.delete(requestId);
      if (error) {
        pending.reject(new Error(error));
      } else {
        pending.resolve(result);
      }
    }
  }
}
