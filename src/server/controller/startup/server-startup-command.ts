import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type { ILoggingFacade } from "../../../common/interfaces.js";
import { ServerPrepareModelCommand } from "./server-prepare-model-command.js";
import { ServerPrepareViewCommand } from "./server-prepare-view-command.js";

export class ServerStartupCommand extends AsyncMacroCommand {
  /**
   * Create the startup command pipeline for the App
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new ServerPrepareModelCommand());
    this.addSubCommand(() => new ServerPrepareViewCommand());
  }

  /**
   * Execute the startup command pipeline
   * @override
   * @param {object} note the notification that triggered this command
   */
  public override execute(note: INotification): void {
    const f = this.facade as ILoggingFacade;
    f.log("📋 ServerStartupCommand - Executing Server startup subcommands", 4);
    super.execute(note);
  }
}
