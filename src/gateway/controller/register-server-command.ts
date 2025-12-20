/**
 * RegisterServerCommand - Registers a new MCP server in the registry
 */

import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerInfo } from "../../common/value-objects.js";
import { ServerRegistryProxy } from "../model/server-registry-proxy.js";

export class RegisterServerCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const serverInfo = notification.body as ServerInfo;

    const serverRegistry = this.facade.retrieveProxy(
      ServerRegistryProxy.NAME,
    ) as ServerRegistryProxy;

    if (serverRegistry) {
      serverRegistry.registerServer(serverInfo);
      console.log(`Server registered: ${serverInfo.name} (${serverInfo.id})`);
      console.log("Capabilities:", serverInfo.capabilities);
    }
  }
}
