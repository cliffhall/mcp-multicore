import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { type ILoggingFacade } from "../../../../../common/index.js";
import { createMCPInterface } from "../index.js";
import express from "express";
import cors from "cors";

// Map sessionId to transport for each client
// TODO proxy this
const transports: Map<string, SSEServerTransport> = new Map<
  string,
  SSEServerTransport
>();

export class ManageSseTransportsCommand extends AsyncCommand {
  public async execute(_notification: INotification): Promise<void> {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ ManagerSseTransportsCommand - Manage MCP Interface SSE Transports`,
      3,
    );

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
      app.get("/sse", async (req, res) => {
        let transport: SSEServerTransport;
        const { mcpServer, cleanup } = createMCPInterface();

        // Session Id should not exist for GET /sse requests
        if (req?.query?.sessionId) {
          const sessionId = req?.query?.sessionId as string;
          transport = transports.get(sessionId) as SSEServerTransport;
          console.error(
            "Client Reconnecting? This shouldn't happen; when client has a sessionId, GET /sse should not be called again.",
            transport.sessionId,
          );
        } else {
          // Create and store transport for the new session
          transport = new SSEServerTransport("/message", res);
          transports.set(transport.sessionId, transport);

          // Connect server to transport
          await mcpServer.connect(transport);
          const sessionId = transport.sessionId;
          console.error("Client Connected: ", sessionId);

          // Handle close of connection
          mcpServer.server.onclose = async () => {
            const sessionId = transport.sessionId;
            console.error("Client Disconnected: ", sessionId);
            transports.delete(sessionId);
            cleanup(sessionId);
          };
        }
      });

      // Handle POST requests for client messages
      app.post("/message", async (req, res) => {
        // Session Id should exist for POST /message requests
        const sessionId = req?.query?.sessionId as string;

        // Get the transport for this session and use it to handle the request
        const transport = transports.get(sessionId);
        if (transport) {
          console.error("Client Message from", sessionId);
          await transport.handlePostMessage(req, res);
        } else {
          console.error(`No transport found for sessionId ${sessionId}`);
        }
      });

      // Start the express server
      const PORT = process.env.PORT || 3001;
      app.listen(PORT, () => {
        console.error(`Server is running on port ${PORT}`);
      });
    };

    startTransportManager().then(() => {
      f.log("✔︎ SSE Transport Manager started", 3);
      this.commandComplete();
    });
  }
}
