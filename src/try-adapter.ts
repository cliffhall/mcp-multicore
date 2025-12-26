import { AdapterFacade } from "./cores/adapter/adapter-facade.js";
import type { AdapterConfig } from "./common/index.js";
import { SingletonKeys } from "./common/index.js";

// Echo STDIN to STDERR only
const config: AdapterConfig = {
  output: "both",
  dashboard: {
    port: 8080,
    host: "localhost",
  },
};

// Start the Adapter
AdapterFacade.getInstance(SingletonKeys.ADAPTER).startup(config);
