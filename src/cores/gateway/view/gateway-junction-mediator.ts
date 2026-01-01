import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  JunctionMediatorNotification,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import {
  GatewayNotifications,
  type ILoggingFacade,
} from "../../../common/index.js";
import type { INotification } from "@puremvc/puremvc-typescript-multicore-framework";

/**
 * GatewayJunctionMediator - a Mediator for the Gateway's Junction plumbing component
 * - Gateway's Junction handles inbound and outbound pipe messages to and from other cores
 */
export class GatewayJunctionMediator extends JunctionMediator {
  public static NAME = "GatewayJunctionMediator";

  constructor() {
    super(GatewayJunctionMediator.NAME, new Junction());
  }

  onRegister() {
    super.onRegister();
    (this.facade as ILoggingFacade).log(
      `🧩 GatewayJunctionMediator - Registered`,
      3,
    );
  }

  listNotificationInterests(): string[] {
    return [
      ...super.listNotificationInterests(),
      GatewayNotifications.CLIENT_REQUEST,
    ];
  }

  handleNotification(note: INotification) {
    super.handleNotification(note);
    const f = this.facade as ILoggingFacade;
    switch (note.name) {
      case JunctionMediatorNotification.ACCEPT_OUTPUT_PIPE:
        f.log(
          `🧩 GatewayJunctionMediator - Accepting output pipe [${note.type}]`,
          5,
        );
        break;

      case JunctionMediatorNotification.ACCEPT_INPUT_PIPE:
        f.log(
          `🧩 GatewayJunctionMediator - Accepting input pipe [${note.type}]`,
          5,
        );
        break;

      case GatewayNotifications.CLIENT_REQUEST:
        f.log(
          `📥 GatewayJunctionMediator - Sending client request to dashboard`,
          5,
        );
        const toDashboard = this.junction.retrievePipe("to-dashboard");
        if (toDashboard) {
          toDashboard.write(note.body);
        } else {
          f.log(
            `🔥 GatewayJunctionMediator: 'to-dashboard' pipe not found.`,
            5,
          );
        }
        break;
    }
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    if (message.type === PipeMessageType.NORMAL) {
      (this.facade as ILoggingFacade).log(
        `🧩 GatewayJunctionMediator - ${this.multitonKey} core received: \n${"-".repeat(80)}\n${JSON.stringify(message)}`,
        1,
      );
    }
  }
}
