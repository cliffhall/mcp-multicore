// Keys for singleton-cores
export class SingletonKeys {
  static readonly GATEWAY = "gateway";
  static readonly DASHBOARD = "dashboard";
  static readonly ADAPTER = "adapter";
}

// Adapter Core notifications
export class AdapterNotifications {
  static readonly STARTUP = "adapter/startup";
  static readonly PROCESS_JSON_RPC_MESSAGE = "adapter/message/process";
}

// Gateway Core notifications
export class GatewayNotifications {
  static readonly STARTUP = "gateway/startup";
}

// Server Core notifications
export class ServerNotifications {
  static readonly STARTUP = "server/startup";
  static readonly SHUTDOWN = "server/shutdown";
}

// Dashboard Core notifications
export class DashboardNotifications {
  static readonly STARTUP = "dashboard/startup";
  static readonly ADD_MESSAGE_TO_STREAM = "dashboard/message/add";
}
