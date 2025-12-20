import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayConfig } from "../../../common/interfaces.js";
import { GatewayJunctionMediator } from "../../view/gateway-junction-mediator.js";

export class StartupGatewayCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as GatewayConfig;

    console.log("Starting Gateway Core with config:", config);

    // Register Proxies
    // this.facade.registerProxy(new ClientRegistryProxy());
    // this.facade.registerProxy(new ServerRegistryProxy());

    // Register Mediators
    this.facade.registerMediator(new GatewayJunctionMediator());

    console.log("Gateway Core started successfully");
  }
}
