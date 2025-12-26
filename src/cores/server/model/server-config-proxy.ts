import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type {
  ServerConfig,
  ILoggingFacade,
} from "../../../common/interfaces.js";

export class ServerConfigProxy extends Proxy {
  static NAME: string = "ServerConfigProxy";

  constructor(config: ServerConfig) {
    super(ServerConfigProxy.NAME, config);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(
      `💾 ServerConfigProxy - Registered ${this.config ? `with` : `without`} config`,
      6,
    );
  }

  get config() {
    return this.data as ServerConfig;
  }

  get id() {
    return this.config.id || "";
  }

  get name() {
    return this.config.name || "";
  }

  get transport() {
    return this.config.name || "stdio";
  }

  get command() {
    return this.config.command;
  }

  get args() {
    return this.config.args || [];
  }

  get env() {
    return this.config.env;
  }

  get url() {
    return this.config.url || "";
  }

  get autoConnect() {
    return this.config.autoConnect;
  }
}
