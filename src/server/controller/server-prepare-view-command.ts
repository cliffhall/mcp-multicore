import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade, ServerConfig } from "../../common/interfaces.js";
import { ServerJunctionMediator } from "../view/server-junction-mediator.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";

export class ServerPrepareViewCommand extends AsyncCommand {
  public execute(notification: INotification): void {
    const config = notification.body as ServerConfig;
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ ServerPrepareViewCommand - Preparing Server View for ${config.name}`,
      4,
    );

    // Register Mediators
    this.facade.registerMediator(new ServerJunctionMediator());

    // Done
    f.log("✔︎ Server View prepared", 4);
    this.commandComplete();
  }
}
