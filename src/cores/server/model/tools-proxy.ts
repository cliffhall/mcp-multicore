import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { Proxy } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../common/index.js";

export class ToolsProxy extends Proxy {
  static NAME: string = "ToolsProxy";

  constructor(tools?: Tool[]) {
    super(ToolsProxy.NAME, tools);
  }

  onRegister() {
    super.onRegister();
    const f = this.facade as ILoggingFacade;
    f.log(`💾 ToolsProxy - Registered for Core: ${this.multitonKey}`, 7);
  }

  describeTool(name: string): Tool | undefined {
    return this.tools.find((tool) => tool.name === name) ?? undefined;
  }

  set tools(tools: Tool[]) {
    this.data = tools;
  }

  get tools(): Tool[] {
    return (this.data as Tool[]) ?? [];
  }
}
