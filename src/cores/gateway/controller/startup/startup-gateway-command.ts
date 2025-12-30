import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { PrepareGatewayModelCommand } from "./prepare-gateway-model.js";
import { PrepareGatewayViewCommand } from "./prepare-gateway-view.js";
import { PlumbDashboardCommand } from "./plumb-dashboard-command.js";
import type { ILoggingFacade } from "../../../../common/index.js";
import { PlumbServersCommand } from "./plumb-servers-command.js";
import { StartMcpInterfaceCommand } from "./start-mcp-interface-command.js";

export class StartupGatewayCommand extends AsyncMacroCommand {
  /**
   * Create the startup command pipeline for the App
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new PrepareGatewayModelCommand());
    this.addSubCommand(() => new PrepareGatewayViewCommand());
    this.addSubCommand(() => new PlumbDashboardCommand());
    this.addSubCommand(() => new PlumbServersCommand());
    this.addSubCommand(() => new StartMcpInterfaceCommand());
  }

  /**
   * Execute the startup command pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(
      "📋 StartupGatewayCommand - Executing Gateway startup subcommands",
      1,
    );
    super.execute(note);
  }
}
