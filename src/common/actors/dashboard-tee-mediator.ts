import { Mediator } from "@puremvc/puremvc-typescript-multicore-framework";
import { TeeMerge } from "@puremvc/puremvc-typescript-util-pipes";
import type { ILoggingFacade } from "../interfaces.js";

/**
 * DashboardTeeMediator - a Mediator for the Dashboard Tee plumbing component
 * - Dashboard Tee is a TeeMerge that is an input pipe on the Dashboard Core
 * - Dynamically created and plumbed servers need to TeeSplit into this pipe
 */
export class DashboardTeeMediator extends Mediator {
  static NAME: string = "DashboardTeeMediator";

  constructor(tee?: TeeMerge) {
    super(DashboardTeeMediator.NAME, tee);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 DashboardTeeMediator - Registered`, 3);
  }

  get tee() {
    return this.viewComponent as TeeMerge;
  }
}
