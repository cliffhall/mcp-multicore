import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ClientInfo, type ILoggingFacade } from "../../../../common/index.js";
import { ServerTransportProxy } from "../../model/server-transport-proxy.js";
import { CapabilitiesAndInfoProxy } from "../../model/capabilities-and-info-proxy.js";
import type { InitializeResult } from "@modelcontextprotocol/sdk/types.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

export class CacheServerInfoCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ CacheServerInfoCommand - Cache initialization result for ${this.multitonKey}`,
      6,
    );

    // Get the Server Transport Proxy
    const serverTransportProxy = this.facade.retrieveProxy(
      ServerTransportProxy.NAME,
    ) as ServerTransportProxy;

    // Get the transport
    const transport = serverTransportProxy.transport;
    if (!transport) {
      f.log(`❌ No transport stored ${this.multitonKey}`, 7);
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
            `❌ Server info cache failed for ${this.multitonKey}: ${error}`,
            7,
          );
          replaceHandlers();
          reject(error);
        };

        // Set the new onmessage handler
        transport.onmessage = (message: JSONRPCMessage) => {
          replaceHandlers();
          resolve(message["result"]);
        };

        // Send the initialize request
        transport.send({
          jsonrpc: "2.0",
          id: 1,
          method: "initialize",
          params: ClientInfo,
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
            new CapabilitiesAndInfoProxy(message as InitializeResult),
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
