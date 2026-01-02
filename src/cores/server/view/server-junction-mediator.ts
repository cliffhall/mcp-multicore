import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  JunctionMediatorNotification,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import { type ILoggingFacade } from "../../../common/index.js";
import type { INotification } from "@puremvc/puremvc-typescript-multicore-framework";

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

  handleNotification(note: INotification) {
    super.handleNotification(note);
    const f = this.facade as ILoggingFacade;
    switch (note.name) {
      case JunctionMediatorNotification.ACCEPT_OUTPUT_PIPE:
        f.log(
          `🧩 ServerJunctionMediator - Accepting output pipe [${note.type}]`,
          5,
        );
        break;
      case JunctionMediatorNotification.ACCEPT_INPUT_PIPE:
        f.log(
          `🧩 ServerJunctionMediator - Accepting input pipe [${note.type}]`,
          5,
        );
        break;
    }
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    if (message.type === PipeMessageType.NORMAL) {
      (this.facade as ILoggingFacade).log(
        `🧩 ServerJunctionMediator - ${this.multitonKey} core received: \n${"-".repeat(80)}\n${JSON.stringify(message)}\n${"-".repeat(80)}\n`,
        1,
      );
    }
  }
}
