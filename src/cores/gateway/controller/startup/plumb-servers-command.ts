import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade, wait } from "../../../../common/index.js";
import {
  JunctionMediatorNotification,
  TeeSplit,
} from "@puremvc/puremvc-typescript-util-pipes";
import { ServerFacade } from "../../../server/server-facade.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import type { GatewayFacade } from "../../gateway-facade.js";
import { GatewayConfigProxy } from "../../model/gateway-config-proxy.js";
import { DashboardTeeMediator } from "../../view/dashboard-tee-mediator.js";

export class PlumbServersCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
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
        // Start the Server Core
        const serverFacade = ServerFacade.getInstance(config.serverName);
        serverFacade.startup(config);

        // Wait for core to be ready (MCP server startup is async)
        const timeout = 10000; // 10 seconds
        const pollInterval = 500;
        let waited = 0;
        while (!serverFacade.isReady() && waited < timeout) {
          await wait(pollInterval);
          waited += pollInterval;
        }
        if (!serverFacade.isReady()) {
          f.log(`🔥 Server Core ${config.serverName} failed to start within ${timeout / 1000} seconds.`, 3);
          continue;
        }

        // Plumb the server
        const gatewayToServer = new TeeSplit(dashboardIn);
        const serverToGateway = new TeeSplit(dashboardIn);

        // Register Server Out Pipe with Gateway
        gatewayFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_OUTPUT_PIPE,
          gatewayToServer,
          `to-${config.serverName}`,
        );

        // Register Gateway In Pipe with Server
        serverFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
          gatewayToServer,
          `from-gateway`,
        );

        // Register Server In Pipe with Gateway
        gatewayFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
          serverToGateway,
          `from-${config.serverName}`,
        );

        // Register Server Out Pipe with Server
        serverFacade.sendNotification(
          JunctionMediatorNotification.ACCEPT_OUTPUT_PIPE,
          serverToGateway,
          "to-gateway",
        );

        f.log(`✔︎ Server Core ${config.serverName} plumbed`, 3);
      }
    };
    createAndPlumbServers().then(() => {
      f.log("✔︎ All Server Cores plumbed", 3);
      this.commandComplete();
    });
  }
}
