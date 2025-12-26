import { AsyncMacroCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import type {AdapterConfig, ILoggingFacade} from "../../../../common/interfaces.js";
import { AdapterPrepareModelCommand } from "./adapter-prepare-model.js";
import { AdapterPrepareViewCommand } from "./adapter-prepare-view.js";
import { PlumbDashboardCommand } from "./plumb-dashboard-command.js";

export class AdapterStartupCommand extends AsyncMacroCommand {
  /**
   * Create the startup command pipeline for the App
   * @override
   */
  public override initializeAsyncMacroCommand(): void {
    this.addSubCommand(() => new AdapterPrepareModelCommand());
    this.addSubCommand(() => new AdapterPrepareViewCommand());
  }

  /**
   * Execute the startup command pipeline
   * @override
   * @param notification
   */
  public override execute(notification: INotification): void {

    // Get AdapterConfig object from the notification body
    const config = notification.body as AdapterConfig;

    // Plumb Dashboard if requested
    if (config.output === "dashboard" || config.output === "both") {
      this.addSubCommand(() => new PlumbDashboardCommand());
    }

    const f = this.facade as ILoggingFacade;
    f.log(
      "📋 AdapterStartupCommand - Executing Adapter startup subcommands",
      1,
    );
    super.execute(notification);
  }
}
