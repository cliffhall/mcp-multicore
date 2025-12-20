import { GatewayFacade } from "./gateway/gateway-facade.js";
import { MultitonKeys } from "./common/constants.js";
import dotenv from "dotenv";

// Only load environment variables from .env file in development mode
dotenv.config({ path: `.env` });
console.log(
  "📝 Environment variables loaded from .env file (development mode)",
);

// Set a short timeout to ensure any async imports are handled
setTimeout(() => {
  // Instantiate the application facade and call its startup method
  GatewayFacade.getInstance(MultitonKeys.GATEWAY).startup({
    port: 8080,
    host: "localhost",
  });
}, 100);
