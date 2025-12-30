import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  GatewayConfig,
  type ILoggingFacade,
} from "../../../../common/index.js";
import { GatewayConfigProxy } from "../../model/gateway-config-proxy.js";
import {McpTransportsProxy} from "../../model/mcp-transports-proxy.js";

export class PrepareGatewayModelCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(`⚙️ PrepareGatewayModelCommand - Preparing Gateway Model`, 2);

    // Get GatewayConfig object from the notification body
    const config = notification.body as GatewayConfig;

    // Register Proxies
    this.facade.registerProxy(new GatewayConfigProxy(config));
    this.facade.registerProxy(new McpTransportsProxy());

    f.log("✔︎ Gateway Model prepared", 3);
  }
}
