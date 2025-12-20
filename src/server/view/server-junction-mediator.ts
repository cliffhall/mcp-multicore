import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";

export class ServerJunctionMediator extends JunctionMediator {
  public static NAME = "ServerJunctionMediator";

  constructor() {
    super(ServerJunctionMediator.NAME, new Junction());
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    if (message.type === PipeMessageType.NORMAL) {
      console.log(`Server core ${this.multitonKey} received:`, message);
    }
  }
}
