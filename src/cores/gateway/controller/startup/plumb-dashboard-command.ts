import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../../common/index.js";
import { DashboardFacade } from "../../../dashboard/dashboard-facade.js";
import { CoreNames } from "../../../../common/index.js";
import {
  JunctionMediatorNotification,
  Pipe,
  TeeMerge,
} from "@puremvc/puremvc-typescript-util-pipes";
import { DashboardTeeMediator } from "../../../../common/index.js";
import { GatewayConfigProxy } from "../../model/gateway-config-proxy.js";

export class PlumbDashboardCommand extends SimpleCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ PlumbDashboardCommand - Create and Plumb Dashboard Core`, 2);

    const gatewayConfigProxy = this.facade.retrieveProxy(
      GatewayConfigProxy.NAME,
    ) as GatewayConfigProxy;
    const dashboardConfig = gatewayConfigProxy.dashboard;

    // Start the Dashboard Core
    const dashboardFacade = DashboardFacade.getInstance(CoreNames.DASHBOARD);
    dashboardFacade.startup(dashboardConfig);

    // Plumb the dashboard
    const gatewayToDashboard = new Pipe();
    const toDashboard = new TeeMerge(gatewayToDashboard);

    // Register Gateway Out Pipe with Dashboard
    dashboardFacade.sendNotification(
      JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
      toDashboard,
      `from-everywhere`,
    );

    // Register Gateway Out Pipe with Gateway
    this.sendNotification(
      JunctionMediatorNotification.ACCEPT_OUTPUT_PIPE,
      toDashboard,
      `to-dashboard`,
    );

    // Store the Dashboard Tee
    if (this.facade.hasProxy(DashboardTeeMediator.NAME)) {
      const dashboardTeeMediator = this.facade.retrieveMediator(
        DashboardTeeMediator.NAME,
      );
      dashboardTeeMediator!.viewComponent = toDashboard;
    }

    f.log("✔︎ Dashboard Core plumbed", 3);
  }
}
