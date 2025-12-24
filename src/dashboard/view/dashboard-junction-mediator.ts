import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import type { ILoggingFacade } from "../../common/interfaces.js";
import { DashboardStreamsProxy } from "../model/dashboard-streams-proxy.js";

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
    // Read the stream back by core and session id
    const core = message?.header?.core as string;
    const sessionId = message?.header?.["mcp-session-id"] as string;

    const f = this.facade as ILoggingFacade;
    f.log(
      `🧩 DashboardJunctionMediator - Intercepted message to "${core}" with session "${sessionId}"`,
      4,
    );

    // Store all normal pipe messages by core and sessionId
    if (message.type === PipeMessageType.NORMAL) {
      const streamsProxy = this.facade.retrieveProxy(
        DashboardStreamsProxy.NAME,
      ) as DashboardStreamsProxy;
      streamsProxy.addMessage(message);

      // Read the stream back by core and session id
      const streamLength = streamsProxy.getStreamLength(core, sessionId);
      f.log(`💾 Added to stream in DashboardStreamsProxy.`, 5);
      f.log(`🔍 Current stream length: ${streamLength}`, 5);
    }
  }
}
