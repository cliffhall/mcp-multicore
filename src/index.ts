import dotenv from "dotenv";
import { MultitonKeys } from "./common/constants.js";
import { ServerFacade } from "./server/server-facade.js";
import { GatewayFacade } from "./gateway/gateway-facade.js";

// Only load environment variables from .env file in development mode
dotenv.config({ path: `.env` });
console.log(
  "📝 Environment variables loaded from .env file (development mode)",
);

// Instantiate the Gateway facade and call its startup method
GatewayFacade.getInstance(MultitonKeys.GATEWAY).startup({
  port: 8080,
  host: "localhost",
});

// Instantiate the Gateway facade and call its startup method
const key = ServerFacade.getNewMultitonKey();
ServerFacade.getInstance(ServerFacade.getNewMultitonKey()).startup({
  id: key,
  name: "server-everything",
  transport: "stdio",
  command: "npx @modelcontextprotocol/server-everything",
  autoConnect: true,
});
