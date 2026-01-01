import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade, ServerConfig } from "../../../../common/index.js";
import { ServerJunctionMediator } from "../../view/server-junction-mediator.js";

export class PrepareServerViewCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as ServerConfig;
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ PrepareServerViewCommand - Preparing Server View for ${config.serverName}`,
      5,
    );

    // Register Mediators
    this.facade.registerMediator(new ServerJunctionMediator());

    // Done
    f.log("✔︎ Server View prepared", 6);
  }
}
