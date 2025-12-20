import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade, ServerConfig } from "../../common/interfaces.js";
import { ServerJunctionMediator } from "../view/server-junction-mediator.js";

export class StartupServerCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as ServerConfig;
    const f = this.facade as ILoggingFacade;

    f.log(
      `👉 StartupServerCommand - Starting Server Core ${this.multitonKey} with config: ${JSON.stringify(config)}`,
      1,
    );

    // Register Proxies
    // this.facade.registerProxy(new ConnectionProxy());

    // Register Mediators
    this.facade.registerMediator(new ServerJunctionMediator());

    f.log("✅ Server Core Started successfully", 2);
  }
}
