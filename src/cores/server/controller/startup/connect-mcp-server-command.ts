import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../../common/index.js";
import { ConnectStdioServerCommand } from "../mcp-server/connect-stdio-server-command.js";
import { ServerConfigProxy } from "../../model/server-config-proxy.js";

export class ConnectMcpServerCommand extends AsyncMacroCommand {
  /**
   * Choose the appropriate server startup command to execute
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(`📋 ConnectMcpServerCommand - Connecting MCP Server for ${this.multitonKey}`, 5);

    const serverConfigProxy = this.facade.retrieveProxy(
      ServerConfigProxy.NAME,
    ) as ServerConfigProxy;

    // Chose the right command to execute
    switch (serverConfigProxy.transport) {
      case "streamable-http":
        //this.addSubCommand(() => new ConnectStreamableHttpServerCommand());
        break;
      case "stdio":
        this.addSubCommand(() => new ConnectStdioServerCommand());
        break;
      case "sse":
        //this.addSubCommand(() => new ConnectSseServerCommand());
        break;
    }

    super.execute(note);
  }
}
