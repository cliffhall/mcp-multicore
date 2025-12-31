import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { PipeMessageType } from "@puremvc/puremvc-typescript-util-pipes";
import { ServerConfigProxy } from "../../model/server-config-proxy.js";
import {
  type ILoggingFacade,
  ServerNotifications,
} from "../../../../common/index.js";
import { ServerTransportProxy } from "../../model/server-transport-proxy.js";

export class ConnectStdioServerCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ StartStdioServerCommand - Start STDIO server for ${this.multitonKey}`,
      6,
    );

    // Get server configuration

    // Get the Server Config Proxy
    const serverConfigProxy = this.facade.retrieveProxy(
      ServerConfigProxy.NAME,
    ) as ServerConfigProxy;
    const { serverName, command, args, env } = serverConfigProxy.config;

    // Get the Server Transport Proxy
    const serverTransportProxy = this.facade.retrieveProxy(
      ServerTransportProxy.NAME,
    ) as ServerTransportProxy;

    if (!command) {
      f.log(`❌ No command to start STDIO server for ${serverName}`, 7);
      return;
    }

    const startStdioServer = async () => {
      // Create the server and client transport
      const transport = new StdioClientTransport({
        command,
        args,
        env,
        stderr: "pipe",
      });

      await transport.start();

      // Extract outgoing message body and send to junction mediator
      const cb = transport.onmessage;
      transport.onmessage = (message) => {
        this.sendNotification(ServerNotifications.SERVER_RESPONSE, {
          type: PipeMessageType.NORMAL,
          header: {
            core: this.multitonKey,
            clientId: undefined,
          },
          body: {
            rpc: {
              body: message,
            },
          },
        });

        if (cb) cb(message);
      };

      // Store the transport
      serverTransportProxy.transport = transport;
    };

    startStdioServer().then(() => {
      f.log(`✔︎ STDIO server connected for ${serverName}`, 6);
      this.commandComplete();
    });
  }
}
