import { type ServerConfig, wait } from "./common/index.js";
import { ServerFacade } from "./cores/server/server-facade.js";

// Simulated config
const config = {
  serverName: "server-everything",
  transport: "stdio",
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-everything"],
  autoConnect: true,
} as ServerConfig;

// Start the Server Core
const serverFacade = ServerFacade.getInstance(config.serverName);
serverFacade.startup(config);

// Wait for core to be ready (MCP server startup is async)
const timeout = 10000; // 10 seconds
const pollInterval = 500;
let waited = 0;
while (!serverFacade.isReady() && waited < timeout) {
  await wait(pollInterval);
  waited += pollInterval;
}

// Get and log the cached capabilities
const info = serverFacade.getServerInitializationResult();
const divider = "-".repeat(80);
console.log(`${divider}\n${JSON.stringify(info, null, 2)}\n${divider}`);
