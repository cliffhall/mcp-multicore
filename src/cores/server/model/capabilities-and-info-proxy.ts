import type { InitializeResult } from "@modelcontextprotocol/sdk/types.js";
import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../common/index.js";

export class CapabilitiesAndInfoProxy extends Proxy {
  static NAME: string = "CapabilitiesAndInfoProxy";

  constructor(result?: InitializeResult) {
    super(CapabilitiesAndInfoProxy.NAME, result);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(
      `💾 CapabilitiesAndInfoProxy - Registered for Core: ${this.multitonKey}`,
      6,
    );
  }

  get result(): InitializeResult {
    return this.data as InitializeResult;
  }

  get protocolVersion() {
    return this.result.protocolVersion;
  }

  get capabilities() {
    return this.result.capabilities;
  }

  get serverInfo() {
    return this.result.serverInfo;
  }

  get instructions() {
    return this.result.instructions;
  }

  get _meta() {
    return this.result._meta;
  }

}
