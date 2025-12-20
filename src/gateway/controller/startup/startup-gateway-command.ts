import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  GatewayConfig,
  type ILoggingFacade,
} from "../../../common/interfaces.js";
import { GatewayJunctionMediator } from "../../view/gateway-junction-mediator.js";

export class StartupGatewayCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as GatewayConfig;
    const f = this.facade as ILoggingFacade;

    f.log(
      `👉 StartupGatewayCommand - Starting Gateway Core with config: ${JSON.stringify(config)}`,
      1,
    );

    // Register Proxies
    // this.facade.registerProxy(new ClientRegistryProxy());
    // this.facade.registerProxy(new ServerRegistryProxy());

    // Register Mediators
    this.facade.registerMediator(new GatewayJunctionMediator());

    f.log("✅ Gateway Core Started successfully", 2);
  }
}
