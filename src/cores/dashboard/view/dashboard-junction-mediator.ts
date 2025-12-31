import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  JunctionMediatorNotification,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import {
  type ILoggingFacade,
  type MCPTrafficMessage,
} from "../../../common/index.js";
import { DashboardNotifications } from "../../../common/index.js";
import type { INotification } from "@puremvc/puremvc-typescript-multicore-framework";

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

  handleNotification(note: INotification) {
    super.handleNotification(note);
    const f = this.facade as ILoggingFacade;
    switch (note.name) {
      case JunctionMediatorNotification.ACCEPT_OUTPUT_PIPE:
        f.log(
          `🧩 DashboardJunctionMediator - Accepting output pipe  [${note.type}]`,
          5,
        );
        break;
      case JunctionMediatorNotification.ACCEPT_INPUT_PIPE:
        f.log(
          `🧩 DashboardJunctionMediator - Accepting input pipe [${note.type}]`,
          5,
        );
        break;
    }
  }
  /**
   * Handle incoming pipe messages
   * @param message
   */
  public override handlePipeMessage(message: IPipeMessage): void {
    // If it is an MCPTrafficMessage, add it to the appropriate message stream
    if (
      message.type === PipeMessageType.NORMAL &&
      typeof message.header?.core === "string"
    ) {
      this.sendNotification(
        DashboardNotifications.ADD_MESSAGE_TO_STREAM,
        message as MCPTrafficMessage,
      );
      (this.facade as ILoggingFacade).log(
        `🧩 DashboardJunctionMediator - ${this.multitonKey} core received: \n${"-".repeat(80)}\n${JSON.stringify(message, null, 2)}`,
        4,
      );
    }
  }
}
