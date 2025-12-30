import { GatewayFacade } from "./cores/gateway/gateway-facade.js";
import type { GatewayConfig } from "./common/index.js";
import { SingletonKeys } from "./common/index.js";

// Simulated config
const config = {
  gateway: {
    port: 3001,
    host: "localhost",
    transport: "sse",
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
GatewayFacade.getInstance(SingletonKeys.GATEWAY).startup(config);
