import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../../common/index.js";
import { GatewayJunctionMediator } from "../../view/gateway-junction-mediator.js";
import { DashboardTeeMediator } from "../../../../common/index.js";
export class PrepareGatewayViewCommand extends SimpleCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(`⚙️ PrepareGatewayViewCommand - Preparing Gateway View`, 2);

    // Register Mediators
    this.facade.registerMediator(new GatewayJunctionMediator());
    this.facade.registerMediator(new DashboardTeeMediator());
    f.log("✔︎ Gateway View prepared", 3);
  }
}
