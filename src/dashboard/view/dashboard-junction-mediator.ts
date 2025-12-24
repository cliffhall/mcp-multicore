import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import type {
  ILoggingFacade,
  MCPTrafficMessage,
} from "../../common/interfaces.js";
import { DashboardNotifications } from "../../common/constants.js";

export class DashboardJunctionMediator extends JunctionMediator {
  public static NAME = "DashboardJunctionMediator";

  constructor() {
    super(DashboardJunctionMediator.NAME, new Junction());
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 DashboardJunctionMediator - Registered`, 6);
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    // If it is an MCPTrafficMessage, add it to the appropriate message stream
    if (
      message.type === PipeMessageType.NORMAL &&
      message.header?.core &&
      message.header?.clientId
    ) {
      (this.facade as ILoggingFacade).log(
        `🧩 DashboardJunctionMediator - Intercepted MCPTrafficMessage to "${message.header?.core}" with client "${message.header?.clientId}"`,
        4,
      );

      this.sendNotification(
        DashboardNotifications.ADD_MESSAGE_TO_STREAM,
        message as MCPTrafficMessage,
      );
    }
  }
}
