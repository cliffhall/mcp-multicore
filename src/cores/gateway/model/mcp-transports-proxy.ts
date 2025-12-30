import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type {
  GatewayTransports,
  ILoggingFacade,
} from "../../../common/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export class McpTransportsProxy extends Proxy {
  static NAME: string = "MCPTransportsProxy";

  constructor() {
    super(McpTransportsProxy.NAME, {
      sse: new Map<string, SSEServerTransport>(),
      streamableHttp: new Map<string, StreamableHTTPServerTransport>(),
    });
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`💾 McpTransportsProxy - Registered`, 3);
  }

  get transports() {
    return this.data as GatewayTransports;
  }

  get sse() {
    return this.transports.sse;
  }

  get streamableHttp() {
    return this.transports.streamableHttp;
  }
}
