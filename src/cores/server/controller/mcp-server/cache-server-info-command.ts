import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ServerConnectionProxy } from "../../model/server-connection-proxy.js";
import { ServerInfoProxy } from "../../model/server-info-proxy.js";
import type { InitializeResult } from "@modelcontextprotocol/sdk/types.js";
import {
  ClientIdentity,
  type ILoggingFacade,
} from "../../../../common/index.js";

export class CacheServerInfoCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ CacheServerInfoCommand - Cache initialization result for ${this.multitonKey}`,
      6,
    );

    // Get the Server Transport Proxy
    const serverConnectionProxy = this.facade.retrieveProxy(
      ServerConnectionProxy.NAME,
    ) as ServerConnectionProxy;

    // Get the transport
    const transport = serverConnectionProxy.transport;
    if (!transport) {
      f.log(`❌  No transport stored ${this.multitonKey}`, 7);
      return;
    }

    const cacheCapabilities = async () => {
      return new Promise((resolve, reject): void => {
        // Store the old handlers
        const oldMessageHandler = transport.onmessage;
        const oldErrorHandler = transport.onerror;

        // Function to replace the old handlers when this promise resolves or rejects
        const replaceHandlers = () => {
          transport.onerror = oldErrorHandler;
          transport.onmessage = oldMessageHandler;
        };

        // Set the new error handler
        transport.onerror = (error) => {
          f.log(
            `❌  Server info cache failed for ${this.multitonKey}: ${error}`,
            7,
          );
          if (oldErrorHandler) oldErrorHandler(error);
          replaceHandlers();
          reject(error);
        };

        // Set the new onmessage handler
        transport.onmessage = (message: JSONRPCMessage) => {
          if (oldMessageHandler) oldMessageHandler(message);
          replaceHandlers();
          resolve(message["result"]);
        };

        const id = serverConnectionProxy.nextId;

        // Send the initialize request
        transport.send({
          jsonrpc: "2.0",
          id,
          method: "initialize",
          params: ClientIdentity,
        });
      });
    };

    // Cache the capabilities
    cacheCapabilities()
      .then((message) => {
        if (message instanceof Error) {
          f.log(
            `❌ Server info cache failed for ${this.multitonKey}: ${message}`,
            7,
          );
        } else {
          this.facade.registerProxy(
            new ServerInfoProxy(message as InitializeResult),
          );
          f.log(
            `✔︎ Server capabilities and info cached for ${this.multitonKey}`,
            6,
          );
        }
      })
      .finally(() => this.commandComplete());
  }
}
