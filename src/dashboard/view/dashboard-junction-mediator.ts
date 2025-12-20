import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";

export class DashboardJunctionMediator extends JunctionMediator {
  public static NAME = "DashboardJunctionMediator";

  constructor() {
    super(DashboardJunctionMediator.NAME, new Junction());
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    if (message.type === PipeMessageType.NORMAL) {
      console.log(`Dashboard core received:`, message);
    }
  }
}
