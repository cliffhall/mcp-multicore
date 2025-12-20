// Core multiton keys
export class MultitonKeys {
  static readonly GATEWAY = "gateway";
  static readonly SERVER = "server";
}

// Gateway Core notifications
export class GatewayNotifications {
  static readonly STARTUP = "gateway/startup";
  static readonly SHUTDOWN = "gateway/shutdown";
  static readonly CLIENT_CONNECTED = "gateway/client/connected";
  static readonly CLIENT_DISCONNECTED = "gateway/client/disconnected";
  static readonly CLIENT_REQUEST = "gateway/client/request";
  static readonly SERVER_REGISTERED = "gateway/server/registered";
  static readonly SERVER_UNREGISTERED = "gateway/server/unregistered";
  static readonly SERVER_RESPONSE = "gateway/server/response";
  static readonly ROUTE_REQUEST = "gateway/route/request";
}

// Server Core notifications
export class ServerNotifications {
  static readonly STARTUP = "server/startup";
  static readonly SHUTDOWN = "server/shutdown";
  static readonly CONNECT = "server/connect";
  static readonly CONNECTED = "server/connected";
  static readonly DISCONNECT = "server/disconnect";
  static readonly DISCONNECTED = "server/disconnected";
  static readonly SEND_MESSAGE = "server/send/message";
  static readonly MESSAGE_RECEIVED = "server/message/received";
  static readonly INITIALIZE = "server/initialize";
  static readonly INITIALIZED = "server/initialized";
  static readonly ERROR = "server/error";
  static readonly CACHE_UPDATE = "server/cache/update";
}

// Pipe messages (inter-core communication)
export class PipeMessages {
  static readonly REQUEST_TO_SERVER = "pipe/request/to_server";
  static readonly RESPONSE_TO_GATEWAY = "pipe/response/to_gateway";
}
