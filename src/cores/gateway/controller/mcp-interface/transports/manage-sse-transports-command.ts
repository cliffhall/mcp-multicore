import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { type ILoggingFacade } from "../../../../../common/index.js";
import { createMCPInterface } from "../index.js";
import express from "express";
import cors from "cors";
import { GatewayConfigProxy } from "../../../model/gateway-config-proxy.js";
import { McpTransportsProxy } from "../../../model/mcp-transports-proxy.js";

export class ManageSseTransportsCommand extends AsyncCommand {
  public async execute(_notification: INotification): Promise<void> {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ ManagerSseTransportsCommand - Manage MCP Interface SSE Transports`,
      3,
    );

    // Get the gateway configuration
    const gatewayConfigProxy = this.facade.retrieveProxy(
      GatewayConfigProxy.NAME,
    ) as GatewayConfigProxy;
    const gatewayConfig = gatewayConfigProxy.gateway;

    // Get the session id to streamable-http transport map
    const mcpTransportsProxy = this.facade.retrieveProxy(
      McpTransportsProxy.NAME,
    ) as McpTransportsProxy;

    // Proxy will already be registered, default is only to satisfy typescript
    const transports =
      mcpTransportsProxy.sse || new Map<string, SSEServerTransport>();

    // This transport expects GET to one endpoint for new connections and POST to another for messages
    const CONNECT_ENDPOINT = "/sse"
    const MESSAGE_ENDPOINT = "/message";

    const startTransportManager = async () => {
      // Express app with permissive CORS for testing with Inspector direct connect mode
      const app = express();
      app.use(
        cors({
          origin: "*", // use "*" with caution in production
          methods: "GET,POST",
          preflightContinue: false,
          optionsSuccessStatus: 204,
        }),
      );

      // Handle GET requests for new SSE streams
      app.get(CONNECT_ENDPOINT, async (req, res) => {
        f.log(`📥 Received GET request`, 4);
        let transport: SSEServerTransport;
        const { mcpServer, cleanup } = createMCPInterface();

        // Session Id should not exist for GET /sse requests
        if (req?.query?.sessionId) {
          const sessionId = req?.query?.sessionId as string;
          transport = transports.get(sessionId) as SSEServerTransport;
          f.log(
            `⚠️ Client ${transport?.sessionId} Reconnecting? This shouldn't happen; when client has a sessionId, GET /sse should not be called again.`,
            4,
          );
        } else {
          // Create and store transport for the new session
          transport = new SSEServerTransport(MESSAGE_ENDPOINT, res);
          transports.set(transport.sessionId, transport);

          // Connect server to transport
          await mcpServer.connect(transport);
          const sessionId = transport.sessionId;
          f.log(`🔌 Session initialized with ID ${sessionId}`, 5);

          // Handle close of connection
          mcpServer.server.onclose = async () => {
            const sessionId = transport.sessionId;
            f.log(`🛑 Client Disconnected ${sessionId}.`, 6);
            transports.delete(sessionId);
            cleanup(sessionId);
            mcpServer.server.onclose = undefined;
          };
        }
      });

      // Handle POST requests for client messages
      app.post(MESSAGE_ENDPOINT, async (req, res) => {
        f.log(`📥 Received POST request`, 4);
        // Session Id should exist for POST /message requests
        const sessionId = req?.query?.sessionId as string;

        // Get the transport for this session and use it to handle the request
        const transport = transports.get(sessionId);
        if (transport) {
          f.log(`📥 Handling MCP Message from ${sessionId}`, 5);
          await transport.handlePostMessage(req, res);
        } else {
          f.log(`⚠️ No transport found for sessionId ${sessionId}.`, 5);
        }
      });

      // Start the express server
      const port = gatewayConfig.port;
      app.listen(port, () => {
        f.log(`🎧 SSE MCP Server listening on port ${port}`, 4);
      });

      // Cleanup on exit
      const cleanupAndExit = async () => {
        f.log(` ❌  Shutting down server...`, 4);
        // Close all active transports to properly clean up resources
        for (const [sessionId] of transports) {
          try {
            f.log(`🔌 Closing transport for session ${sessionId}`, 6);
            await transports.get(sessionId)!.close();
            transports.delete(sessionId);
          } catch (error) {
            f.log(
              `⚠️ Error closing transport for session ${sessionId}: ${error}`,
              6,
            );
          }
        }

        f.log(`✔︎ Server shutdown complete`, 5);
        process.exit(0)
      };
      process.on("SIGINT", cleanupAndExit);
      process.on("SIGTERM", cleanupAndExit);

    };

    startTransportManager().then(() => {
      f.log("✔︎ SSE Transport Manager started", 3);
      this.commandComplete();
    });
  }
}
