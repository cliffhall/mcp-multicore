import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../../common/index.js";
import { PrepareServerModelCommand } from "./prepare-server-model-command.js";
import { PrepareServerViewCommand } from "./prepare-server-view-command.js";

export class StartupServerCommand extends AsyncMacroCommand {
  /**
   * Create the startup command pipeline for the App
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new PrepareServerModelCommand());
    this.addSubCommand(() => new PrepareServerViewCommand());
  }

  /**
   * Execute the startup command pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log("📋 StartupServerCommand - Executing Server startup subcommands", 4);
    super.execute(note);
  }
}
