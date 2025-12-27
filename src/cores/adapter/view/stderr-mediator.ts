import {
  type INotification,
  Mediator,
} from "@puremvc/puremvc-typescript-multicore-framework";
import {
  AdapterNotifications,
  type ILoggingFacade,
} from "../../../common/index.js";
import { Writable } from "stream";

/**
 * StderrMediator - a Mediator for the process's STDERR pipe
 * -
 */
export class StderrMediator extends Mediator {
  static NAME: string = "StderrMediator";

  constructor() {
    super(StderrMediator.NAME, process.stderr);
  }

  listNotificationInterests(): string[] {
    return [
      ...super.listNotificationInterests(),
      AdapterNotifications.PROCESS_JSON_RPC_MESSAGE,
    ];
  }

  handleNotification(notification: INotification) {
    super.handleNotification(notification);
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 StderrMediator - Registered`, 3);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 StderrMediator - Registered`, 3);
  }

  get stderr() {
    return this.viewComponent as Writable;
  }
}
