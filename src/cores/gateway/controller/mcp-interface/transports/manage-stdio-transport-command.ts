import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import {
  CoreNames,
  GatewayNotifications,
  type ILoggingFacade,
} from "../../../../../common/index.js";
import { createMCPInterface } from "../index.js";
import { PipeMessageType } from "@puremvc/puremvc-typescript-util-pipes";

export class ManageStdioTransportCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ ManageStdioTransportCommand - Manage MCP Interface STDIO Transport`,
      3,
    );

    const startTransportManager = async () => {
      // Create the server and transport
      const transport = new StdioServerTransport();
      const { mcpServer, cleanup } = createMCPInterface();

      // Connect transport to server
      await mcpServer.connect(transport);

      // Extract incoming request body and send to junction mediator
      const cb = transport.onmessage;
      transport.onmessage = (message) => {
        this.sendNotification(GatewayNotifications.CLIENT_REQUEST, {
          type: PipeMessageType.NORMAL,
          header: {
            core: CoreNames.GATEWAY,
            clientId: undefined,
          },
          body: {
            rpc: {
              body: message,
            },
          },
        });

        if (cb) cb(message);
      };

      // Cleanup on exit
      const cleanupAndExit = async () => {
        await mcpServer.close();
        cleanup();
        process.exit(0);
      };
      process.on("SIGINT", cleanupAndExit);
      process.on("SIGTERM", cleanupAndExit);
    };

    startTransportManager().then(() => {
      f.log("✔︎ Stdio Transport Manager started", 3);
      this.commandComplete();
    });
  }
}
