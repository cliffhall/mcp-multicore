import dotenv from "dotenv";
import { MultitonKeys } from "./common/constants.js";
import { ServerFacade } from "./server/server-facade.js";
import { GatewayFacade } from "./gateway/gateway-facade.js";
import { DashboardFacade } from "./dashboard/dashboard-facade.js";

// Only load environment variables from .env file in development mode
dotenv.config({ path: `.env` });
console.log(
  "📝 Environment variables loaded from .env file (development mode)",
);

// Start the Gateway
GatewayFacade.getInstance(MultitonKeys.GATEWAY).startup({
  port: 8080,
  host: "localhost",
});

// Start the Dashboard
DashboardFacade.getInstance(MultitonKeys.DASHBOARD).startup({
  port: 3050,
  host: "localhost",
});

// Start a sServer
const key = ServerFacade.getNewMultitonKey();
ServerFacade.getInstance(key).startup({
  id: key,
  name: "server-everything",
  transport: "stdio",
  command: "npx @modelcontextprotocol/server-everything",
  autoConnect: true,
});
