#!/usr/bin/env node

import { createInterface } from "node:readline";
import { AdapterFacade } from "./adapter-facade.js";
import { SingletonKeys } from "../../common/index.js";
import type { AdapterConfig } from "../../common/index.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

// Echo STDIN to STDERR only
const config: AdapterConfig = {
  output: "stderr",
};

// Start the Adapter
const adapterFacade = AdapterFacade.getInstance(SingletonKeys.ADAPTER);
adapterFacade.startup(config);

// Create an interface that uses process.stdin as the input source
const rl = createInterface({
  input: process.stdin,
});

// Process each JSONRPCMessage as it comes in
// Messages are delimited by newlines, and MUST NOT contain embedded newlines.
rl.on("line", (line) => {
  const message: JSONRPCMessage = JSON.parse(line);
  adapterFacade.sendJSONRPCMessage(message);
});

// At end of input, exit
rl.on("close", () => {
  process.exit();
});
