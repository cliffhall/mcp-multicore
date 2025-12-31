import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade, ServerConfig } from "../../../../common/index.js";
import { ServerConfigProxy } from "../../model/server-config-proxy.js";
import { ServerTransportProxy } from "../../model/server-transport-proxy.js";

export class PrepareServerModelCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as ServerConfig;
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ PrepareServerModelCommand - Preparing Server Model for ${config.serverName}`,
      5,
    );

    const serverConfig = notification.body as ServerConfig;

    // Register Proxies
    this.facade.registerProxy(new ServerConfigProxy(serverConfig));
    this.facade.registerProxy(new ServerTransportProxy());

    // Done
    f.log("✔︎ Server Model prepared", 6);
  }
}
