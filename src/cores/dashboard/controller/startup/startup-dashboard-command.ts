import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../../common/index.js";
import { PrepareDashboardModelCommand } from "./prepare-dashboard-model-command.js";
import { PrepareDashboardViewCommand } from "./prepare-dashboard-view-command.js";
import { PrepareDashboardControllerCommand } from "./prepare-dashboard-controller-command.js";

export class StartupDashboardCommand extends AsyncMacroCommand {
  /**
   * Create the startup command pipeline for the Dashboard
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new PrepareDashboardModelCommand());
    this.addSubCommand(() => new PrepareDashboardViewCommand());
    this.addSubCommand(() => new PrepareDashboardControllerCommand());
  }

  /**
   * Execute the startup command pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(
      "📋 StartupDashboardCommand - Executing Dashboard startup subcommands",
      4,
    );
    super.execute(note);
  }
}
