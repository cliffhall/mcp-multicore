import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import type { ILoggingFacade } from "../../common/interfaces.js";

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
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 GatewayJunctionMediator - Registered`, 3);
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    if (message.type === PipeMessageType.NORMAL) {
      console.log(`Gateway core ${this.multitonKey} received:`, message);
    }
  }
}
