import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { SpawnOptions } from "child_process";
import { spawn, type SpawnRxExtras } from "spawn-rx";
import { Subject } from "rxjs";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const path = resolve(__dirname, "cores", "adapter");
const stdioAdapter = resolve(path, "stdio-adapter.js");
const command = process.platform === "win32" ? "node.exe" : "node";

const abort = new AbortController();
process.on("SIGINT", () => {
  abort.abort();
  process.exit();
});

const env = {
  ...process.env,
};

// Create an RxJS Subject to use as stdin for the spawned process
const stdinSubject = new Subject<string>();

const spawnOptions: SpawnOptions & SpawnRxExtras & { split: true } = {
  cwd: path,
  env,
  signal: abort.signal,
  echoOutput: true,
  split: true,
  stdin: stdinSubject, // Pass the Subject as the stdin Observable
};

// Spawn a process running stdio-adapter.js
const adapter = spawn(command, [stdioAdapter], spawnOptions);

// Subscribe to the adapter output (required for spawn-rx to actually start the process)
adapter.subscribe({
  next: (_output) => {
    //console.log(`[${output.source}]: ${output.text}`);
  },
  error: (_err) => {
    //console.error("Process error:", err);
  },
  complete: () => {
    //console.log("Process completed");
  },
});

// Create a test message array
const messages: JSONRPCMessage[] = [
  {
    jsonrpc: "2.0",
    id: 2,
    method: "tools/call",
    params: {
      name: "get_weather",
      arguments: {
        location: "New York",
      },
    },
  },
  {
    jsonrpc: "2.0",
    id: 2,
    result: {
      content: [
        {
          type: "text",
          text: "Current weather in New York:\nTemperature: 72°F\nConditions: Partly cloudy",
        },
      ],
      isError: false,
    },
  },
];

// Send the messages to the stdio-adapter via the stdin Subject
// Messages must be newline-delimited JSON (as expected by stdio-adapter)
for (const message of messages) {
  stdinSubject.next(JSON.stringify(message) + "\n");
}

// Signal that we're done sending input (closes stdin)
stdinSubject.complete();
