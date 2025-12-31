import { GatewayFacade } from "./cores/gateway/gateway-facade.js";
import type { GatewayConfig } from "./common/index.js";
import { CoreNames } from "./common/index.js";

// Simulated config
const config = {
  gateway: {
    port: 3001,
    host: "localhost",
    transport: "streamable-http",
  },
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
GatewayFacade.getInstance(CoreNames.GATEWAY).startup(config);
