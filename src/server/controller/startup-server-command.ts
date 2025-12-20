import {
  SimpleCommand,
  INotification,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { ServerConfig } from "../../common/interfaces.js";
import { ServerJunctionMediator } from "../view/server-junction-mediator.js";

export class StartupServerCommand extends SimpleCommand {
  public execute(notification: INotification): void {
    const config = notification.body as ServerConfig;
    console.log(
      `Starting Server Core ${this.multitonKey} with config:`,
      config,
    );

    // Register Proxies
    // this.facade.registerProxy(new ConnectionProxy());

    // Register Mediators
    this.facade.registerMediator(new ServerJunctionMediator());

    console.log("Server Core started successfully");
  }
}
