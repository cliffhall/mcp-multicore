import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  type ILoggingFacade,
  type MCPTrafficMessage,
} from "../../../common/interfaces.js";
import { DashboardStreamsProxy } from "../../model/dashboard-streams-proxy.js";

export class AddMessageToStreamCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const message = notification.body as MCPTrafficMessage;
    const f = this.facade as ILoggingFacade;

    const core = message?.header?.core as string;
    const clientId = message?.header?.clientId as string;

    // Get the streams proxy
    const streamsProxy = this.facade.retrieveProxy(
      DashboardStreamsProxy.NAME,
    ) as DashboardStreamsProxy;
    const success = streamsProxy.addMessage(message);

    if (success) {
      // Read the stream back by core and client id
      const streamLength = streamsProxy.getStreamLength(core, clientId);
      f.log(`⚙️ AddMessageToStreamCommand - Added to stream in DashboardStreamsProxy.`, 5);
      f.log(`🔍 Current stream length: ${streamLength}`, 5);
    }
  }
}
