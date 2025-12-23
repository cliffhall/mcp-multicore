import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import type { ILoggingFacade } from "../../common/interfaces.js";

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
    if (message.type === PipeMessageType.NORMAL) {
      console.log(`Dashboard Core received:`, message);
    }
  }
}
