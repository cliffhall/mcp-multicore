import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";
import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { PipeMessageType } from "@puremvc/puremvc-typescript-util-pipes";
import { ServerConfigProxy } from "../../model/server-config-proxy.js";
import { ServerConnectionProxy } from "../../model/server-connection-proxy.js";
import {
  ClientIdentity,
  type ILoggingFacade,
  ServerNotifications,
} from "../../../../common/index.js";

export class ConnectStdioServerCommand extends AsyncCommand {
  public execute(_notification: INotification): void {
    const f = this.facade as ILoggingFacade;

    f.log(
      `⚙️ ConnectStdioServerCommand - Start STDIO server for ${this.multitonKey}`,
      6,
    );

    // Get the Server Config Proxy
    const serverConfigProxy = this.facade.retrieveProxy(
      ServerConfigProxy.NAME,
    ) as ServerConfigProxy;
    const { serverName, command, args, env } = serverConfigProxy.config;

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

      // Extract the outgoing message body and send to the junction mediator
      const cb = transport.onmessage;
      transport.onmessage = (message) => {
        this.sendNotification(ServerNotifications.SERVER_MESSAGE, {
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

      // Create the client, connect to the transport
      const client = new Client(ClientIdentity.clientInfo);
      await client.connect(transport);

      // Store the client and the transport
      this.facade.registerProxy(new ServerConnectionProxy(client, transport));

    };

    startStdioServer().then(() => {
      f.log(`✔︎ STDIO server connected for ${serverName}`, 6);
      this.commandComplete();
    });
  }
}
