import {
  type IPipeMessage,
  Junction,
  JunctionMediator,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";
import type { ILoggingFacade } from "../../../common/interfaces.js";
import { AdapterConfigProxy } from "../model/adapter-config-proxy.js";

/**
 * AdapterJunctionMediator - a Mediator for the Adapter's Junction plumbing component
 * - Adapter's Junction handles inbound and outbound pipe messages to and from other cores
 */
export class AdapterJunctionMediator extends JunctionMediator {
  public static NAME = "AdapterJunctionMediator";

  constructor() {
    super(AdapterJunctionMediator.NAME, new Junction());
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`🧩 GatewayJunctionMediator - Registered`, 3);
  }

  public override handlePipeMessage(message: IPipeMessage): void {
    const configProxy = this.facade.retrieveProxy(
      AdapterConfigProxy.NAME,
    ) as AdapterConfigProxy;
    if (message.type === PipeMessageType.NORMAL) {
      (this.facade as ILoggingFacade).log(
        `🧩 AdapterJunctionMediator - ${this.multitonKey} core received: \n${"-".repeat(80)}\n${JSON.stringify(message)}`,
        1,
      );

      switch (configProxy.output) {
        case "stderr":
          process.stderr.write(JSON.stringify(message) + "\n");
          break;

        case "dashboard":
        // send to dashboard
      }
    }
  }
}
