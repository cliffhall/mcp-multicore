import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type {
  DashboardConfig,
  ILoggingFacade,
} from "../../common/interfaces.js";

export class DashboardConfigProxy extends Proxy {
  static NAME: string = "DashboardConfigProxy";

  constructor(config: DashboardConfig) {
    super(DashboardConfigProxy.NAME, config);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(
      `💾 DashboardConfigProxy - Registered ${this.config ? `with` : `without`} config`,
      6,
    );
  }

  get config() {
    return this.data as DashboardConfig;
  }

  get host() {
    return this.config.host || "localhost";
  }

  get port() {
    return this.config.port || 3001;
  }
}
