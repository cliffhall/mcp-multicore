import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../../common/interfaces.js";
import {
  JunctionMediatorNotification,
  TeeSplit,
} from "@puremvc/puremvc-typescript-util-pipes";
import { DashboardTeeMediator } from "../../../../common/actors/dashboard-tee-mediator.js";
import { ServerFacade } from "../../../server/server-facade.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import type { GatewayFacade } from "../../gateway-facade.js";
import { GatewayConfigProxy } from "../../model/gateway-config-proxy.js";

export class PlumbServersCommand extends AsyncCommand {
  public async execute(_notification: INotification): Promise<void> {
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ PlumbServersCommand - Create and Plumb Server Cores`, 2);

    const createAndPlumbServers = async () => {
      // Get the Gateway Facade
      const gatewayFacade = this.facade as GatewayFacade;

      // Get the Server Configs
      const gatewayConfigProxy = this.facade.retrieveProxy(
        GatewayConfigProxy.NAME,
      ) as GatewayConfigProxy;
      const serverConfigs = gatewayConfigProxy.servers;

      // Get the Dashboard Tee
      const dashboardTeeMediator = this.facade.retrieveMediator(
        DashboardTeeMediator.NAME,
      ) as DashboardTeeMediator;
      const dashboardIn = dashboardTeeMediator.tee;

      // Start the Server Cores
      for (const config of serverConfigs) {
        const serverFacade = ServerFacade.getInstance(config.name);
        await serverFacade.startup(config);

        // Plumb the server
        const gatewayToServer = new TeeSplit(dashboardIn);
        const serverToGateway = new TeeSplit(dashboardIn);

        // Register Server Out Pipe with Gateway
        gatewayFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
          gatewayToServer,
          `gateway-to-${config.name}`,
        );

        // Register Server In Pipe with Gateway
        gatewayFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
          serverToGateway,
          `${config.name}-to-gateway`,
        );

        // Register Gateway In Pipe with Server
        serverFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
          gatewayToServer,
          "gateway-in",
        );

        // Register Server Out Pipe with Server
        serverFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_OUTPUT_PIPE,
          serverToGateway,
          "server-out",
        );

        f.log(`✔︎ Server Core ${config.name} plumbed`, 3);
      }
    };
    createAndPlumbServers().then(() => {
      f.log("✔︎ All Server Cores plumbed", 3);
      this.commandComplete();
    });
  }
}
