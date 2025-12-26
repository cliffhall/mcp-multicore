import {
  INotification,
  SimpleCommand,
} from "@puremvc/puremvc-typescript-multicore-framework";
import { type ILoggingFacade } from "../../../../common/interfaces.js";
import { DashboardFacade } from "../../../dashboard/dashboard-facade.js";
import {
  JunctionMediatorNotification,
  Pipe,
  TeeMerge,
} from "@puremvc/puremvc-typescript-util-pipes";
import { DashboardTeeMediator } from "../../../../common/actors/index.js";
import { AdapterConfigProxy } from "../../model/adapter-config-proxy.js";
import { SingletonKeys } from "../../../../common/constants.js";

export class PlumbDashboardCommand extends SimpleCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(`⚙️ PlumbDashboardCommand - Create and Plumb Dashboard Core`, 2);

    const adapterConfigProxy = this.facade.retrieveProxy(
      AdapterConfigProxy.NAME,
    ) as AdapterConfigProxy;
    const dashboardConfig = adapterConfigProxy.dashboard;

    // Start the Dashboard Core
    const dashboardFacade = DashboardFacade.getInstance(
      SingletonKeys.DASHBOARD,
    );
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

    f.log("✔︎ Dashboard Core plumbed", 3);
  }
}
