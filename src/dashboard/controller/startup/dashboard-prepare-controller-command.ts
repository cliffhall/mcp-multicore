import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../common/interfaces.js";
import { DashboardNotifications } from "../../../common/constants.js";
import { AddMessageToStreamCommand } from "../operation/add-message-to-stream-command.js";

export class DashboardPrepareControllerCommand extends SimpleCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ DashboardPrepareControllerCommand - Preparing Dashboard Controller`,
      5,
    );

    // Register Commands
    this.facade.registerCommand(
      DashboardNotifications.ADD_MESSAGE_TO_STREAM,
      () => new AddMessageToStreamCommand(),
    );

    // Done
    f.log("✔︎ Dashboard Controller Prepared", 6);
  }
}
