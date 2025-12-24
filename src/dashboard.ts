import { MultitonKeys } from "./common/constants.js";
import type { DashboardConfig } from "./common/interfaces.js";
import { DashboardFacade } from "./dashboard/dashboard-facade.js";
import {
  type IPipeMessage,
  JunctionMediatorNotification,
  Pipe,
  PipeMessageType,
} from "@puremvc/puremvc-typescript-util-pipes";

// Simulated config
const config = {
  port: 8080,
  host: "localhost",
} as DashboardConfig;

// Start the Dashboard Core
const dashboardFacade = DashboardFacade.getInstance(MultitonKeys.DASHBOARD);
dashboardFacade.startup(config);

// Plumb the dashboard
const dashboardIn = new Pipe();

// Dashboard In pipe
dashboardFacade.sendNotification(
  JunctionMediatorNotification.ACCEPT_INPUT_PIPE,
  dashboardIn,
  "dashboard-in",
);

// Create a test message
const messages: IPipeMessage[] = [
  {
    type: PipeMessageType.NORMAL,
    header: {
      core: "server-everything",
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
  },
];

// Send the message to the dashboard
dashboardIn.write(messages[0]);
dashboardIn.write(messages[1]);
