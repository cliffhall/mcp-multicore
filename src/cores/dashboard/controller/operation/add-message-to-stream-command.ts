import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  type ILoggingFacade,
  type MCPTrafficMessage,
} from "../../../../common/index.js";
import { DashboardStreamsProxy } from "../../model/dashboard-streams-proxy.js";

export class AddMessageToStreamCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const message = notification.body as MCPTrafficMessage;
    const f = this.facade as ILoggingFacade;

    // Get the streams proxy
    const streamsProxy = this.facade.retrieveProxy(
      DashboardStreamsProxy.NAME,
    ) as DashboardStreamsProxy;
    const success = streamsProxy.addMessage(message);

    if (success) {
      // `addMessage` succeeded, so we know header, core, and clientId are valid.
      const core = message.header!.core;
      const clientId = message.header!.clientId;

      // Read the stream back by core and client id
      const streamLength = streamsProxy.getStreamLength(core, clientId);
      f.log(
        `⚙️ AddMessageToStreamCommand - Added to message stream in DashboardStreamsProxy.`,
        5,
      );
      f.log(`🔍 Current stream length: ${streamLength}`, 6);
    }
  }
}
