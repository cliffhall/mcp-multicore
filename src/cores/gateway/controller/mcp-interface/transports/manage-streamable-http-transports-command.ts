import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { type ILoggingFacade } from "../../../../../common/index.js";
import express, { Request, Response } from "express";
import { createMCPInterface } from "../index.js";
import { randomUUID } from "node:crypto";
import cors from "cors";

// Map sessionId to server transport for each client
const transports: Map<string, StreamableHTTPServerTransport> = new Map<
  string,
  StreamableHTTPServerTransport
>();

export class ManageStreamableHttpTransportsCommand extends AsyncCommand {
  public async execute(_notification: INotification): Promise<void> {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ StreamableHttpTransportManagerCommand - Manage MCP Interface Streamable HTTP Transports`,
      3,
    );

    const startTransportManager = async () => {
      // Express app with permissive CORS for testing with Inspector direct connect mode
      const app = express();
      app.use(
        cors({
          origin: "localhost",
          methods: "GET,POST,DELETE",
          preflightContinue: false,
          optionsSuccessStatus: 204,
          exposedHeaders: [
            "mcp-session-id",
            "last-event-id",
            "mcp-protocol-version",
          ],
        }),
      );

      // Handle POST requests for client messages
      app.post("/mcp", async (req: Request, res: Response) => {
        f.log(
          `📥 Received MCP POST request`,
          4,
        );
        try {
          // Check for existing session ID
          const sessionId = req.headers["mcp-session-id"] as string | undefined;

          let transport: StreamableHTTPServerTransport;

          if (sessionId && transports.has(sessionId)) {
            // Reuse existing transport
            transport = transports.get(sessionId)!;
          } else if (!sessionId) {
            const { mcpServer, cleanup } = createMCPInterface();

            // New initialization request
            const eventStore = new InMemoryEventStore();
            transport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => randomUUID(),
              eventStore, // Enable resumability
              onsessioninitialized: (sessionId: string) => {
                f.log(
                  `🔌 Session initialized with ID ${sessionId}`,
                  4,
                );
                // Store the transport by session ID when a session is initialized
                // This avoids race conditions where requests might come in before the session is stored
                transports.set(sessionId, transport);
              },
            });

            // Set up onclose handler to clean up transport when closed
            mcpServer.server.onclose = async () => {
              const sid = transport.sessionId;
              if (sid && transports.has(sid)) {
                f.log(
                  `🛑 Transport closed for session ${sid}, removing from transports map`,
                  4,
                );
                transports.delete(sid);
                cleanup(sid);
              }
            };

            // Connect the transport to the MCP server BEFORE handling the request
            // so responses can flow back through the same transport
            await mcpServer.connect(transport);
            await transport.handleRequest(req, res);
            return;
          } else {
            // Invalid request - no session ID or not initialization request
            res.status(400).json({
              jsonrpc: "2.0",
              error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided",
              },
              id: req?.body?.id,
            });
            return;
          }

          // Handle the request with existing transport - no need to reconnect
          // The existing transport is already connected to the server
          await transport.handleRequest(req, res);
        } catch (error) {
          f.log(
            `⚠️ Error handling MCP request ${error}`,
            4,
          );
          console.log("Error handling MCP request:", error);
          if (!res.headersSent) {
            res.status(500).json({
              jsonrpc: "2.0",
              error: {
                code: -32603,
                message: "Internal server error",
              },
              id: req?.body?.id,
            });
            return;
          }
        }
      });

      // Handle GET requests for SSE streams
      app.get("/mcp", async (req: Request, res: Response) => {
        console.log("Received MCP GET request");
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (!sessionId || !transports.has(sessionId)) {
          res.status(400).json({
            jsonrpc: "2.0",
            error: {
              code: -32000,
              message: "Bad Request: No valid session ID provided",
            },
            id: req?.body?.id,
          });
          return;
        }

        // Check for Last-Event-ID header for resumability
        const lastEventId = req.headers["last-event-id"] as string | undefined;
        if (lastEventId) {
          f.log(
            `🔌 Client reconnecting with Last-Event-ID: ${lastEventId}`,
            4,
          );
          console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`);
        } else {
          f.log(
            `🏁 Establishing new SSE stream for session ${sessionId}`,
            4,
          );
        }

        const transport = transports.get(sessionId);
        await transport!.handleRequest(req, res);
      });

      // Handle DELETE requests for session termination
      app.delete("/mcp", async (req: Request, res: Response) => {
        const sessionId = req.headers["mcp-session-id"] as string | undefined;
        if (!sessionId || !transports.has(sessionId)) {
          res.status(400).json({
            jsonrpc: "2.0",
            error: {
              code: -32000,
              message: "Bad Request: No valid session ID provided",
            },
            id: req?.body?.id,
          });
          return;
        }
        f.log(
          `🛑 Received session termination request for session ${sessionId}`,
          4,
        );

        try {
          const transport = transports.get(sessionId);
          await transport!.handleRequest(req, res);
        } catch (error) {
          f.log(
            `⚠️ Error handling session termination - ${error}`,
            4,
          );
          if (!res.headersSent) {
            res.status(500).json({
              jsonrpc: "2.0",
              error: {
                code: -32603,
                message: "Error handling session termination",
              },
              id: req?.body?.id,
            });
            return;
          }
        }
      });

      // Start the server
      const PORT = process.env.PORT || 3001;
      const server = app.listen(PORT, () => {
        f.log(
          `🎧 Streamable HTTP MCP Server listening on port ${PORT}`,
          4,
        );
      });

      // Handle server errors
      server.on("error", (err: unknown) => {
        const code =
          typeof err === "object" && err !== null && "code" in err
            ? (err as { code?: unknown }).code
            : undefined;
        if (code === "EADDRINUSE") {
          f.log(
            `⚠️ Failed to start: Port ${PORT} is already in use. `,
            4,
          );
        } else {
          f.log(
            `⚠️ Failed to start: Unexpected error: ${err}`,
            4,
          );
        }
        // Ensure a non-zero exit so npm reports the failure instead of silently exiting
        process.exit(1);
      });

      // Handle server shutdown
      process.on("SIGINT", async () => {
        console.log("Shutting down server...");
        f.log(
          `❌ Shutting down server...`,
          4,
        );
        // Close all active transports to properly clean up resources
        for (const [sessionId] of transports) {
          try {
            f.log(
              `🛑 Closing transport for session ${sessionId}`,
              4,
            );
            await transports.get(sessionId)!.close();
            transports.delete(sessionId);
          } catch (error) {
            f.log(
              `⚠️ Error closing transport for session ${sessionId}: ${error}`,
              4,
            );
          }
        }

        f.log(
          `🛑 Server shutdown complete`,
          4,
        );
        process.exit(0);
      });
    };

    startTransportManager().then(() => {
      f.log("✔︎ Streamable HTTP Transport Manager started", 3);
      this.commandComplete();
    });
  }
}
