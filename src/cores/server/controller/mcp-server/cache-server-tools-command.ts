import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { type ILoggingFacade } from "../../../../common/index.js";
import { ServerTransportProxy } from "../../model/server-transport-proxy.js";
import type {
  JSONRPCErrorResponse,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { ToolsProxy } from "../../model/tools-proxy.js";

export class CacheServerToolsCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ CacheServerToolsCommand - Cache tools for ${this.multitonKey}`,
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

    // Tool list
    let tools: Tool[] = [];

    const cacheTools = async () => {
      return new Promise((resolve, reject): void => {
        // Pagination cursor
        let cursor;

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
            `❌ Server tool list failed for ${this.multitonKey}: ${error}`,
            7,
          );
          if (oldErrorHandler) oldErrorHandler(error);
          replaceHandlers();
          reject(error);
        };

        // Set the new onmessage handler
        transport.onmessage = (
          message: JSONRPCMessage | JSONRPCErrorResponse,
        ) => {
          if (oldMessageHandler) oldMessageHandler(message);

          // Add the tools to the list
          const result = message?.["result"];
          if (result?.tools) tools = [...tools, ...result.tools];

          // If there are more tools, fetch them, otherwise resolve with the list
          if (result?.nextCursor) {
            cursor = result.nextCursor;
            sendToolListRequest(cursor);
          } else {
            replaceHandlers();
            resolve(tools);
          }
        };

        // Function to request tools list starting at cursor, if provided
        const sendToolListRequest = (cursor?: string) => {
          const id = serverTransportProxy.nextId;

          // Create the tool list request
          let request: JSONRPCMessage = {
            jsonrpc: "2.0",
            id,
            method: "tools/list",
          };

          // Add cursor if present
          if (cursor) request.params = { cursor };

          // Send the request
          transport.send(request);
        };

        // Request the list
        sendToolListRequest();
      });
    };

    // Cache the tools
    cacheTools()
      .then((result) => {
        if (result instanceof Error) {
          f.log(
            `❌ Server tools cache failed for ${this.multitonKey}: ${result}`,
            7,
          );
        } else {
          const tools = result as Tool[];
          if (this.facade.hasProxy(ToolsProxy.NAME)) {
            const toolsProxy = this.facade.retrieveProxy(
              ToolsProxy.NAME,
            ) as ToolsProxy;
            toolsProxy.tools = toolsProxy.tools = tools;
          } else {
            this.facade.registerProxy(new ToolsProxy(tools));
          }
          f.log(
            `✔︎ ${tools.length} Server tool${tools.length > 1 ? "s" : ""} cached for ${this.multitonKey}`,
            6,
          );
        }
      })
      .finally(() => this.commandComplete());
  }
}
