import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type {
  AdapterConfig,
  ILoggingFacade,
} from "../../../common/interfaces.js";

export class AdapterConfigProxy extends Proxy {
  static NAME: string = "AdapterConfigProxy";

  constructor(config: AdapterConfig) {
    super(AdapterConfigProxy.NAME, config);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(
      `💾 AdapterConfigProxy - Registered ${this.config ? `with` : `without`} config`,
      3,
    );
  }

  get config() {
    return this.data as AdapterConfig;
  }

  get dashboard() {
    return this.config?.dashboard || {};
  }

  get output() {
    return this.config?.output || "stderr";
  }
}
