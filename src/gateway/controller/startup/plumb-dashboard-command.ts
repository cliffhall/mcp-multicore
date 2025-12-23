import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../common/interfaces.js";
import { DashboardFacade } from "../../../dashboard/dashboard-facade.js";
import { MultitonKeys } from "../../../common/constants.js";
import {
  JunctionMediatorNotification,
  Pipe,
  TeeMerge,
} from "@puremvc/puremvc-typescript-util-pipes";
import { DashboardTeeMediator } from "../../view/dashboard-tee-mediator.js";
import { GatewayConfigProxy } from "../../model/gateway-config-proxy.js";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";

export class PlumbDashboardCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ PlumbDashboardCommand - Create and Plumb Dashboard Core`, 1);

    const gatewayConfigProxy = this.facade.retrieveProxy(
      GatewayConfigProxy.NAME,
    ) as GatewayConfigProxy;
    const dashboardConfig = gatewayConfigProxy.dashboard;

    // Start the Dashboard Core
    const dashboardFacade = DashboardFacade.getInstance(MultitonKeys.DASHBOARD);
    dashboardFacade.startup(dashboardConfig);

    // Plumb the dashboard
    const gatewayToDashboard = new Pipe();
    const dashboardIn = new TeeMerge(gatewayToDashboard);

    // Dashboard In
    // - Has a merging tee on the dashboard end.
    // - This allows us to tee in servers later.
    dashboardFacade.sendNotification(
      JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
      dashboardIn,
      "dashboard-in",
    );

    // Store the Dashboard Tee
    if (this.facade.hasProxy(DashboardTeeMediator.NAME)) {
      const dashboardTeeMediator = this.facade.retrieveMediator(
        DashboardTeeMediator.NAME,
      );
      dashboardTeeMediator!.viewComponent = dashboardIn;
    }

    f.log("✔︎ Dashboard Core plumbed", 2);

    this.commandComplete();
  }
}
