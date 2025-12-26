import type { DashboardConfig } from "./common/index.js";
import { DashboardFacade } from "./cores/dashboard/dashboard-facade.js";
import {
  type IPipeMessage,
  JunctionMediatorNotification,
  Pipe,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";

// Only one Dashboard Core expected at a time
const SINGLETON_KEY = "dashboard";

// Simulated config
const config = {
  port: 8080,
  host: "localhost",
} as DashboardConfig;

// Start the Dashboard Core
const dashboardFacade = DashboardFacade.getInstance(SINGLETON_KEY);
dashboardFacade.startup(config);

// Plumb the dashboard
const dashboardIn = new Pipe();

// Plumb a Dashboard In pipe
dashboardFacade.sendNotification(
  JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
  dashboardIn,
  "dashboard-in",
);

// Create a test message array
const messages: IPipeMessage[] = [
  {
    type: PipeMessageType.NORMAL,
    header: {
      core: "server-everything",
      clientId: "1",
      "mcp-session-id": "1234567890",
      "Mcp-Protocol-Version": "2025-11-25",
    },
    body: {
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
    priority: 1,
  },
  {
    type: PipeMessageType.NORMAL,
    header: {
      core: "gateway",
      clientId: "1",
      "mcp-session-id": "1234567890",
      "Mcp-Protocol-Version": "2025-11-25",
    },
    body: {
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
    priority: 1,
  },
  {
    type: PipeMessageType.NORMAL,
    header: {
      not: "mcp traffic",
    },
    body: {
      this: "that",
    },
  },
];

// Send the messages to the Dashboard Core
for (const message of messages) {
  dashboardIn.write(message);
}
