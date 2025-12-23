import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import type { ILoggingFacade } from "../../common/interfaces.js";

export class ServerJunctionMediator extends JunctionMediator {
  public static NAME = "ServerJunctionMediator";

  constructor() {
    super(ServerJunctionMediator.NAME, new Junction());
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 ServerJunctionMediator - Registered`, 6);
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    if (message.type === PipeMessageType.NORMAL) {
      console.log(`Server core ${this.multitonKey} received:`, message);
    }
  }
}
