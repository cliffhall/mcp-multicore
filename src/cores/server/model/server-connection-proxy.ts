import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../common/index.js";
import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

export class ServerConnectionProxy extends Proxy {
  static NAME: string = "ServerConnectionProxy";

  constructor(client: Client, transport: Transport) {
    super(ServerConnectionProxy.NAME, { nextId: 1, client, transport });
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(
      `💾 ServerConnectionProxy - Registered for Core: ${this.multitonKey}`,
      6,
    );
  }

  set transport(t: Transport) {
    this.data.transport = t;
  }

  get transport() {
    return this.data.transport as Transport;
  }

  get client() {
    return this.data.client as Client;
  }

  get nextId() {
    const id = this.data.nextId;
    this.data.nextId++;
    return id as number;
  }
}
