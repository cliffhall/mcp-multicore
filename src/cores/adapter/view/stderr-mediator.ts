import { Mediator } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../common/index.js";
import { Writable } from "stream";

/**
 * StderrMediator - a Mediator for the Dashboard Tee plumbing component
 * - Dashboard Tee is a TeeMerge that is an input pipe on the Dashboard Core
 * - Dynamically created and plumbed servers need to TeeSplit into this pipe
 */
export class StderrMediator extends Mediator {
  static NAME: string = "StderrMediator";

  constructor() {
    super(StderrMediator.NAME, process.stderr);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 StderrMediator - Registered`, 3);
  }

  get tee() {
    return this.viewComponent as Writable;
  }
}
