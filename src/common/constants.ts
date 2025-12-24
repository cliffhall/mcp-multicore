// Core multiton keys
export class MultitonKeys {
  static readonly GATEWAY = "gateway";
  static readonly DASHBOARD = "dashboard";
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
