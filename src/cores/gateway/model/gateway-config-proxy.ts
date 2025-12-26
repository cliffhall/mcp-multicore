import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type { GatewayConfig, ILoggingFacade } from "../../../common/index.js";

export class GatewayConfigProxy extends Proxy {
  static NAME: string = "GatewayConfigProxy";

  constructor(config: GatewayConfig) {
    super(GatewayConfigProxy.NAME, config);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(
      `💾 GatewayConfigProxy - Registered ${this.config ? `with` : `without`} config`,
      3,
    );
  }

  get config() {
    return this.data as GatewayConfig;
  }

  get dashboard() {
    return this.config?.dashboard || {};
  }

  get servers() {
    return this.config.servers || [];
  }

  get host() {
    return this.config.host || "localhost";
  }

  get port() {
    return this.config.port || 3001;
  }
  get maxClients() {
    return this.config.maxClients || 10;
  }
}
