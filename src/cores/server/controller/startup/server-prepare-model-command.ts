import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade, ServerConfig } from "../../../../common/index.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { ServerConfigProxy } from "../../model/server-config-proxy.js";

export class ServerPrepareModelCommand extends AsyncCommand {
  public execute(notification: INotification): void {
    const config = notification.body as ServerConfig;
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ ServerPrepareModelCommand - Preparing Server Model for ${config.name}`,
      5,
    );

    const serverConfig = notification.body as ServerConfig;

    // Register Proxies
    this.facade.registerProxy(new ServerConfigProxy(serverConfig));

    // Done
    f.log("✔︎ Server Model prepared", 6);
    this.commandComplete();
  }
}
