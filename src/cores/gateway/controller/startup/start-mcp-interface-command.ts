import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../../common/index.js";
import { GatewayConfigProxy } from "../../model/gateway-config-proxy.js";
import { ManageStdioTransportCommand } from "../mcp-interface/transports/manage-stdio-transport-command.js";
import { ManageSseTransportsCommand } from "../mcp-interface/transports/manage-sse-transports-command.js";
import { ManageStreamableHttpTransportsCommand } from "../mcp-interface/transports/manage-streamable-http-transports-command.js";

export class StartMcpInterfaceCommand extends AsyncMacroCommand {
  /**
   * Choose the appropriate server startup command to execute
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(
      "📋 StartMCPInterfaceCommand - Executing MCP Interface startup subcommands",
      2,
    );

    // Get the Gateway config
    const gatewayConfigProxy = this.facade.retrieveProxy(
      GatewayConfigProxy.NAME,
    ) as GatewayConfigProxy;
    const gatewayConfig = gatewayConfigProxy.gateway;

    // Chose the right command to execute
    switch (gatewayConfig.transport) {
      case "streamable-http":
        this.addSubCommand(() => new ManageStreamableHttpTransportsCommand());
        break;
      case "stdio":
        this.addSubCommand(() => new ManageStdioTransportCommand());
        break;
      case "sse":
        this.addSubCommand(() => new ManageSseTransportsCommand());
        break;
    }

    super.execute(note);
  }
}
