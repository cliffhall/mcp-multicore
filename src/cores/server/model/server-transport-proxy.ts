import {Transport} from "@modelcontextprotocol/sdk/shared/transport.js";
import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../common/index.js";

export class ServerTransportProxy extends Proxy {
  static NAME: string = "ServerTransportProxy";

  constructor(transport?: Transport) {
    super(ServerTransportProxy.NAME, transport);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(
      `💾 ServerTransportProxy - Registered for Core: ${this.multitonKey}`,
      6,
    );
  }

  set transport(t:Transport) {
    this.data = t;
  }

  get transport() {
    return this.data as Transport;
  }
}
