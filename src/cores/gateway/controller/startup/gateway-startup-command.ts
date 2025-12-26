import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { GatewayPrepareModelCommand } from "./gateway-prepare-model.js";
import { GatewayPrepareViewCommand } from "./gateway-prepare-view.js";
import { PlumbDashboardCommand } from "./plumb-dashboard-command.js";
import type { ILoggingFacade } from "../../../../common/index.js";
import { PlumbServersCommand } from "./plumb-servers-command.js";

export class GatewayStartupCommand extends AsyncMacroCommand {
  /**
   * Create the startup command pipeline for the App
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new GatewayPrepareModelCommand());
    this.addSubCommand(() => new GatewayPrepareViewCommand());
    this.addSubCommand(() => new PlumbDashboardCommand());
    this.addSubCommand(() => new PlumbServersCommand());
  }

  /**
   * Execute the startup command pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(
      "📋 GatewayStartupCommand - Executing Gateway startup subcommands",
      1,
    );
    super.execute(note);
  }
}
