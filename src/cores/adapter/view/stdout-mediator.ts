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
 * StdoutMediator - a Mediator for the process's STDOUT pipe
 * -
 */
export class StdoutMediator extends Mediator {
  static NAME: string = "StdoutMediator";

  constructor() {
    super(StdoutMediator.NAME, process.stdout);
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
    f.log(`🧩 StdoutMediator - Registered`, 3);
    notification.body._meta = {this: "that"};
    this.stdout.write(JSON.stringify(notification.body));
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 StdoutMediator - Registered`, 3);
  }

  get stdout() {
    return this.viewComponent as Writable;
  }
}
