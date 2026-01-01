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
      serverName: "server-everything",
      transport: "stdio",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-everything"],
      autoConnect: true,
    },
    {
      serverName: "server-filesystem",
      transport: "stdio",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem"],
      autoConnect: true,
    },
  ],
} as GatewayConfig;

// Start the Gateway Core
GatewayFacade.getInstance(CoreNames.GATEWAY).startup(config);
