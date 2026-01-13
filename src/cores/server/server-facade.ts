import { Facade } from "@puremvc/puremvc-typescript-multicore-framework";
import { LoggingFacade } from "../../common/index.js";
import { ServerNotifications } from "../../common/index.js";
import { ServerConfig } from "../../common/index.js";
import { StartupServerCommand } from "./controller/startup/startup-server-command.js";
import type {
  InitializeResult,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { CapabilitiesAndInfoProxy } from "./model/capabilities-and-info-proxy.js";
import { ToolsProxy } from "./model/tools-proxy.js";

/**
 * ServerFacade
 * Facade Multiton for an individual MCP server connection
 * - Manages an MCP server instance
 * - Routes client traffic to and from its server and visa-versa
 * - Server output is tee-d into the Dashboard Core along with other traffic
 * - Each MCP server has its own ServerFacade instance running in its own Core
 */
export class ServerFacade extends LoggingFacade {
  /**
   * Get or create the multiton instance
   */
  public static getInstance(multitonKey: string): ServerFacade {
    return Facade.getInstance(
      multitonKey,
      (k) => new ServerFacade(k),
    ) as ServerFacade;
  }

  /**
   * Minimally initialize the Controller by registering the startup command
   */
  protected initializeController(): void {
    super.initializeController();
    this.registerCommand(
      ServerNotifications.STARTUP,
      () => new StartupServerCommand(),
    );
  }

  /**
   * Start this server core with the given configuration
   */
  public startup(config: ServerConfig): void {
    this.log(`🔱 ServerFacade - Preparing Server Core ${this.multitonKey}`, 3);
    this.sendNotification(ServerNotifications.STARTUP, config);
  }

  /**
   * Checks if the current instance is in a ready state.
   *
   * @return {boolean} True if the instance is ready, otherwise false.
   */
  public isReady(): boolean {
    return this.ready;
  }

  /**
   * Sets the ready state to true.
   * @return {void} This method does not return any value.
   */
  public setReady(): void {
    this.ready = true;
  }

  /**
   * Retrieves server information if the CapabilitiesAndInfoProxy exists.
   *
   * @return {InitializeResult | void} The server information encapsulated in an InitializeResult object if available, otherwise undefined.
   */
  public getServerInitializationResult(): InitializeResult | void {
    if (this.hasProxy(CapabilitiesAndInfoProxy.NAME)) {
      const p = this.retrieveProxy(
        CapabilitiesAndInfoProxy.NAME,
      ) as CapabilitiesAndInfoProxy;
      return p.result;
    }
  }

  /**
   * Retrieves the list of tools from the ToolsProxy if the proxy exists.
   *
   * @return {Tool[] | void} The list of tools if the proxy is available, otherwise undefined.
   */
  public getToolsList(): Tool[] | void {
    if (this.hasProxy(ToolsProxy.NAME)) {
      const p = this.retrieveProxy(ToolsProxy.NAME) as ToolsProxy;
      return p.tools;
    }
  }

  /**
   * Provides a description or details of a specific tool by its name.
   *
   * @param {string} name - The name of the tool to describe.
   * @return {Tool | void} The tool's full description if found, or void if no description is available.
   */
  public describeTool(name: string): Tool | void {
    if (this.hasProxy(ToolsProxy.NAME)) {
      const p = this.retrieveProxy(ToolsProxy.NAME) as ToolsProxy;
      return p.describeTool(name);
    }
  }

  protected ready: boolean = false;
}
