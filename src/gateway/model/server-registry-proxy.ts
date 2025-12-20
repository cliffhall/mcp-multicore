/**
 * ServerRegistryProxy - Maintains registry of available MCP servers and their capabilities
 */

import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerInfo } from "../../common/value-objects.js";

export class ServerRegistryProxy extends Proxy {
  public static readonly NAME = "ServerRegistryProxy";

  constructor() {
    super(ServerRegistryProxy.NAME, new Map<string, ServerInfo>());
  }

  /**
   * Register a new MCP server
   */
  public registerServer(serverInfo: ServerInfo): void {
    this.data.set(serverInfo.id, serverInfo);
  }

  /**
   * Unregister an MCP server
   */
  public unregisterServer(serverId: string): boolean {
    return this.data.delete(serverId);
  }

  /**
   * Get info about a specific server
   */
  public getServer(serverId: string): ServerInfo | undefined {
    return this.data.get(serverId);
  }

  /**
   * Get all registered servers
   */
  public getAllServers(): ServerInfo[] {
    return Array.from(this.data.values());
  }

  /**
   * Get servers that have a specific capability
   */
  public getServersByCapability(
    capabilityType: "tools" | "prompts" | "resources",
  ): ServerInfo[] {
    return this.getAllServers().filter((server) => {
      const capabilities = server.capabilities[capabilityType];
      return capabilities && capabilities.length > 0;
    });
  }

  /**
   * Find servers that provide a specific tool
   */
  public findServersWithTool(toolName: string): ServerInfo[] {
    return this.getAllServers().filter((server) => {
      const tools = server.capabilities.tools;
      return tools && tools.includes(toolName);
    });
  }

  /**
   * Find servers that provide a specific prompt
   */
  public findServersWithPrompt(promptName: string): ServerInfo[] {
    return this.getAllServers().filter((server) => {
      const prompts = server.capabilities.prompts;
      return prompts && prompts.includes(promptName);
    });
  }

  /**
   * Find servers that provide a specific resource pattern
   */
  public findServersWithResource(resourcePattern: string): ServerInfo[] {
    return this.getAllServers().filter((server) => {
      const resources = server.capabilities.resources;
      if (!resources) return false;

      // Simple pattern matching - could be enhanced with glob patterns
      return resources.some(
        (pattern) =>
          resourcePattern.startsWith(pattern) || pattern.includes("*"),
      );
    });
  }

  /**
   * Update server status
   */
  public updateServerStatus(
    serverId: string,
    status: ServerInfo["status"],
  ): void {
    const server = this.data.get(serverId);
    if (server) {
      server.status = status;
    }
  }

  /**
   * Update server capabilities after initialization
   */
  public updateServerCapabilities(
    serverId: string,
    capabilities: ServerInfo["capabilities"],
  ): void {
    const server = this.data.get(serverId);
    if (server) {
      server.capabilities = capabilities;
    }
  }

  /**
   * Get count of registered servers
   */
  public getServerCount(): number {
    return this.data.size;
  }

  /**
   * Get servers by status
   */
  public getServersByStatus(status: ServerInfo["status"]): ServerInfo[] {
    return this.getAllServers().filter((server) => server.status === status);
  }
}
