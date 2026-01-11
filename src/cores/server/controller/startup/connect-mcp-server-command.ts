import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../../common/index.js";
import { ConnectStdioServerCommand } from "../mcp-server/connect-stdio-server-command.js";
import { ServerConfigProxy } from "../../model/server-config-proxy.js";
import { CacheServerInfoCommand } from "../mcp-server/cache-server-info-command.js";
import { CacheServerToolsCommand } from "../mcp-server/cache-server-tools-command.js";

export class ConnectMcpServerCommand extends AsyncMacroCommand {
  /**
   * Choose the appropriate server startup command to execute
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    const serverConfigProxy = this.facade.retrieveProxy(
      ServerConfigProxy.NAME,
    ) as ServerConfigProxy;

    // If the server is so configured, connect, initialize, and cache its capabilities
    if (serverConfigProxy.autoConnect) {
      f.log(
        `📋 ConnectMcpServerCommand - Auto-connecting MCP Server for ${this.multitonKey}`,
        5,
      );

      // Chose the right command to start this server
      switch (serverConfigProxy.transport) {
        case "stdio":
          this.addSubCommand(() => new ConnectStdioServerCommand());
          break;
        case "streamable-http":
          //this.addSubCommand(() => new ConnectStreamableHttpServerCommand());
          break;
        case "sse":
          //this.addSubCommand(() => new ConnectSseServerCommand());
          break;
      }

      // Run the cache capabilities subcommand after connecting
      this.addSubCommand(() => new CacheServerInfoCommand());

      // Nex, run the cache server tools subcommand
      this.addSubCommand(() => new CacheServerToolsCommand());
    }

    super.execute(note);
  }
}
