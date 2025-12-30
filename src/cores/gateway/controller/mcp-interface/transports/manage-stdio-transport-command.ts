import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { type ILoggingFacade } from "../../../../../common/index.js";
import { createMCPInterface } from "../index.js";

export class ManageStdioTransportCommand extends AsyncCommand {
  public async execute(_notification: INotification): Promise<void> {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ ManageStdioClientsCommand -Manage MCP Interface STDIO Transport`,
      3,
    );

    const startTransportManager = async () => {
      // Create the server and transport
      const transport = new StdioServerTransport();
      const { mcpServer, cleanup } = createMCPInterface();

      // Connect transport to server
      await mcpServer.connect(transport);

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
