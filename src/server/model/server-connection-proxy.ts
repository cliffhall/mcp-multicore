import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerNotifications } from "../../common/constants.js";

export class ServerConnectionProxy extends Proxy {
  private client: Client;
  private serverId: string;

  async initialize(transport: Transport) {
    // Connect to MCP server
    await this.client.connect(transport);

    // Get capabilities
    const capabilities = await this.client.getServerCapabilities();

    // Fetch all lists immediately
    const [tools, resources, prompts] = await Promise.all([
      this.client.listTools(),
      this.client.listResources(),
      this.client.listPrompts(),
    ]);

    // Send to Gateway for caching & indexing
    this.sendNotification(ServerNotifications.CACHE_UPDATE, {
      serverId: this.serverId,
      capabilities,
      tools,
      resources,
      prompts,
    });

    // Subscribe to list_changed notifications if supported
    if (capabilities.experimental?.listChanged) {
      this.client.setNotificationHandler((notification) => {
        if (notification.method === "notifications/list_changed") {
          this.handleListChanged(notification.params);
        }
      });
    }
  }

  private async handleListChanged(params: any) {
    // Re-fetch the changed list type
    let updates = {
      tools: [],
      resources: [],
      prompts: [],
    };

    if (params.listType === "tools") {
      updates.tools = await this.client.listTools();
    } else if (params.listType === "resources") {
      updates.resources = await this.client.listResources();
    } else if (params.listType === "prompts") {
      updates.prompts = await this.client.listPrompts();
    }

    // Send incremental update to Gateway
    this.sendNotification(ServerNotifications.CACHE_UPDATE, {
      serverId: this.serverId,
      ...updates,
    });
  }
}
