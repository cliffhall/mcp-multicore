// Core multiton keys
export class MultitonKeys {
  static readonly GATEWAY = "gateway";
  static readonly DASHBOARD = "dashboard";
}

// Gateway Core notifications
export class GatewayNotifications {
  static readonly STARTUP = "gateway/startup";
  static readonly SHUTDOWN = "gateway/shutdown";
}

// Server Core notifications
export class ServerNotifications {
  static readonly STARTUP = "server/startup";
  static readonly SHUTDOWN = "server/shutdown";
}

// Dashboard Core notifications
export class DashboardNotifications {
  static readonly STARTUP = "dashboard/startup";
  static readonly SHUTDOWN = "dashboard/shutdown";
}

// Pipe messages (inter-core communication)
export class PipeMessages {
  static readonly REQUEST_TO_SERVER = "pipe/request/to_server";
  static readonly RESPONSE_TO_GATEWAY = "pipe/response/to_gateway";
}
