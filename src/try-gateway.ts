import { GatewayFacade } from "./cores/gateway/gateway-facade.js";
import type { GatewayConfig } from "./common/interfaces.js";
import { SingletonKeys } from "./common/constants.js";

// Simulated config
const config = {
  dashboard: {
    port: 8080,
    host: "localhost",
  },
  servers: [
    {
      name: "server-everything",
      transport: "stdio",
      command: "npx @modelcontextprotocol/server-everything",
      autoConnect: true,
    },
    {
      name: "server-filesystem",
      transport: "stdio",
      command: "npx @modelcontextprotocol/server-filesystem",
      autoConnect: true,
    },
  ],
} as GatewayConfig;

// Start the Gateway Core
GatewayFacade.getInstance(SingletonKeys.GATEWAY).startup(config);
