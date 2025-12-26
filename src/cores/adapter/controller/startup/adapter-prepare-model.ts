import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  AdapterConfig,
  type ILoggingFacade,
} from "../../../../common/interfaces.js";
import { AdapterConfigProxy } from "../../model/adapter-config-proxy.js";

export class AdapterPrepareModelCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(`⚙️ AdapterPrepareModelCommand - Preparing Adapter Model`, 2);

    // Get AdapterConfig object from the notification body
    const config = notification.body as AdapterConfig;

    // Register Proxies
    this.facade.registerProxy(new AdapterConfigProxy(config));

    f.log("✔︎ Adapter Model prepared", 3);
  }
}
