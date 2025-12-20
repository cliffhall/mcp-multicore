/**
 * RoutingProxy - Determines which server should handle a given request
 */

import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { JSONRPCRequest } from "../../common/mcp-types.js";
import {
  RoutableRequest,
  RoutingDecision,
} from "../../common/value-objects.js";
import { ServerRegistryProxy } from "./server-registry-proxy.js";

export class RoutingProxy extends Proxy {
  public static readonly NAME = "RoutingProxy";

  // Maps request IDs to server IDs for tracking in-flight requests
  constructor() {
    super(RoutingProxy.NAME, new Map<string, string>());
  }

  /**
   * Determine which server should handle this request
   */
  public routeRequest(request: RoutableRequest): RoutingDecision | null {
    const serverRegistry = this.facade.retrieveProxy(
      ServerRegistryProxy.NAME,
    ) as ServerRegistryProxy;

    if (!serverRegistry) {
      console.error("ServerRegistryProxy not found");
      return null;
    }

    const message = request.message as JSONRPCRequest;
    const method = message.method;

    // Route based on the method being called
    let decision: RoutingDecision | null = null;

    if (method === "tools/call") {
      decision = this.routeToolCall(message, serverRegistry);
    } else if (method === "prompts/get") {
      decision = this.routePromptRequest(message, serverRegistry);
    } else if (method === "resources/read") {
      decision = this.routeResourceRequest(message, serverRegistry);
    } else if (method.startsWith("tools/")) {
      decision = this.routeToolsMethod(serverRegistry);
    } else if (method.startsWith("prompts/")) {
      decision = this.routePromptsMethod(serverRegistry);
    } else if (method.startsWith("resources/")) {
      decision = this.routeResourcesMethod(serverRegistry);
    } else {
      // For other methods, route to first available server
      decision = this.routeToFirstAvailable(serverRegistry);
    }

    // Track the routing decision
    if (decision && decision.canHandle && message.id) {
      this.data.set(String(message.id), decision.serverId);
    }

    return decision;
  }

  /**
   * Route a tool call to a server that provides that tool
   */
  private routeToolCall(
    message: JSONRPCRequest,
    registry: ServerRegistryProxy,
  ): RoutingDecision | null {
    const params = message.params as { name: string };
    const toolName = params?.name;

    if (!toolName) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No tool name specified",
      };
    }

    const servers = registry.findServersWithTool(toolName);

    if (servers.length === 0) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: `No server provides tool: ${toolName}`,
      };
    }

    // Use first available connected server
    const server = servers.find((s) => s.status === "connected");

    if (!server) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No connected server available for tool",
      };
    }

    return {
      serverId: server.id,
      serverCoreName: server.coreName,
      canHandle: true,
    };
  }

  /**
   * Route a prompt request to a server that provides that prompt
   */
  private routePromptRequest(
    message: JSONRPCRequest,
    registry: ServerRegistryProxy,
  ): RoutingDecision | null {
    const params = message.params as { name: string };
    const promptName = params?.name;

    if (!promptName) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No prompt name specified",
      };
    }

    const servers = registry.findServersWithPrompt(promptName);
    const server = servers.find((s) => s.status === "connected");

    if (!server) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: `No server provides prompt: ${promptName}`,
      };
    }

    return {
      serverId: server.id,
      serverCoreName: server.coreName,
      canHandle: true,
    };
  }

  /**
   * Route a resource request to a server that provides that resource
   */
  private routeResourceRequest(
    message: JSONRPCRequest,
    registry: ServerRegistryProxy,
  ): RoutingDecision | null {
    const params = message.params as { uri: string };
    const uri = params?.uri;

    if (!uri) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No resource URI specified",
      };
    }

    const servers = registry.findServersWithResource(uri);
    const server = servers.find((s) => s.status === "connected");

    if (!server) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: `No server provides resource: ${uri}`,
      };
    }

    return {
      serverId: server.id,
      serverCoreName: server.coreName,
      canHandle: true,
    };
  }

  /**
   * Route tools list/metadata methods to first server with tools
   */
  private routeToolsMethod(
    registry: ServerRegistryProxy,
  ): RoutingDecision | null {
    const servers = registry.getServersByCapability("tools");
    const server = servers.find((s) => s.status === "connected");

    if (!server) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No server with tools capability",
      };
    }

    return {
      serverId: server.id,
      serverCoreName: server.coreName,
      canHandle: true,
    };
  }

  /**
   * Route prompts list/metadata methods to first server with prompts
   */
  private routePromptsMethod(
    registry: ServerRegistryProxy,
  ): RoutingDecision | null {
    const servers = registry.getServersByCapability("prompts");
    const server = servers.find((s) => s.status === "connected");

    if (!server) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No server with prompts capability",
      };
    }

    return {
      serverId: server.id,
      serverCoreName: server.coreName,
      canHandle: true,
    };
  }

  /**
   * Route resources list/metadata methods to first server with resources
   */
  private routeResourcesMethod(
    registry: ServerRegistryProxy,
  ): RoutingDecision | null {
    const servers = registry.getServersByCapability("resources");
    const server = servers.find((s) => s.status === "connected");

    if (!server) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No server with resources capability",
      };
    }

    return {
      serverId: server.id,
      serverCoreName: server.coreName,
      canHandle: true,
    };
  }

  /**
   * Route to first available connected server
   */
  private routeToFirstAvailable(
    registry: ServerRegistryProxy,
  ): RoutingDecision | null {
    const servers = registry.getServersByStatus("connected");

    if (servers.length === 0) {
      return {
        serverId: "",
        serverCoreName: "",
        canHandle: false,
        reason: "No connected servers available",
      };
    }

    const server = servers[0];
    return {
      serverId: server.id,
      serverCoreName: server.coreName,
      canHandle: true,
    };
  }

  /**
   * Get the server ID for a tracked request
   */
  public getServerForRequest(requestId: string | number): string | undefined {
    return this.data.get(String(requestId));
  }

  /**
   * Remove tracking for a completed request
   */
  public clearRequest(requestId: string | number): void {
    this.data.delete(String(requestId));
  }
}
