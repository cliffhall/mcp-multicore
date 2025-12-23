import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../common/interfaces.js";
import { DashboardPrepareModelCommand } from "./dashboard-prepare-model-command.js";
import { DashboardPrepareViewCommand } from "./dashboard-prepare-view-command.js";

export class DashboardStartupCommand extends AsyncMacroCommand {
  /**
   * Create the startup command pipeline for the App
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new DashboardPrepareModelCommand());
    this.addSubCommand(() => new DashboardPrepareViewCommand());
  }

  /**
   * Execute the startup command pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log(
      "📋 DashboardStartupCommand - Executing Dashboard startup subcommands",
      3,
    );
    super.execute(note);
  }
}
