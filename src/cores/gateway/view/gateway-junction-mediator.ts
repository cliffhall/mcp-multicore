import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import type { ILoggingFacade } from "../../../common/interfaces.js";

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

  public override handlePipeMessage(message: IPipeMessage): void {
    if (message.type === PipeMessageType.NORMAL) {
      (this.facade as ILoggingFacade).log(
        `🧩 GatewayJunctionMediator - ${this.multitonKey} core received: \n${"-".repeat(80)}\n${JSON.stringify(message)}`,
        1,
      );
    }
  }
}
