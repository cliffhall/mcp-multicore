/**
 * MCP Protocol Type Definitions
 * Based on Model Context Protocol specification
 */

// JSON-RPC 2.0 base types
export interface JSONRPCRequest {
  jsonrpc: "2.0";
  id?: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface JSONRPCResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: JSONRPCError;
}

export interface JSONRPCError {
  code: number;
  message: string;
  data?: unknown;
}

export interface JSONRPCNotification {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
}

// MCP-specific message types
export type MCPMessage = JSONRPCRequest | JSONRPCResponse | JSONRPCNotification;

// Initialize request/response
export interface InitializeParams {
  protocolVersion: string;
  capabilities: ClientCapabilities;
  clientInfo: Implementation;
}

export interface InitializeResult {
  protocolVersion: string;
  capabilities: ServerCapabilities;
  serverInfo: Implementation;
}

export interface Implementation {
  name: string;
  version: string;
}

export interface ClientCapabilities {
  roots?: {
    listChanged?: boolean;
  };
  sampling?: Record<string, unknown>;
}

export interface ServerCapabilities {
  prompts?: {
    listChanged?: boolean;
  };
  resources?: {
    subscribe?: boolean;
    listChanged?: boolean;
  };
  tools?: {
    listChanged?: boolean;
  };
}

// Tools
export interface Tool {
  name: string;
  description?: string;
  inputSchema: {
    type: "object";
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export interface CallToolParams {
  name: string;
  arguments?: Record<string, unknown>;
}

export interface CallToolResult {
  content: Array<TextContent | ImageContent | EmbeddedResource>;
  isError?: boolean;
}

// Resources
export interface Resource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ReadResourceParams {
  uri: string;
}

export interface ReadResourceResult {
  contents: Array<TextResourceContents | BlobResourceContents>;
}

// Prompts
export interface Prompt {
  name: string;
  description?: string;
  arguments?: Array<PromptArgument>;
}

export interface PromptArgument {
  name: string;
  description?: string;
  required?: boolean;
}

export interface GetPromptParams {
  name: string;
  arguments?: Record<string, string>;
}

export interface GetPromptResult {
  description?: string;
  messages: Array<PromptMessage>;
}

export interface PromptMessage {
  role: "user" | "assistant";
  content: TextContent | ImageContent;
}

// Content types
export interface TextContent {
  type: "text";
  text: string;
}

export interface ImageContent {
  type: "image";
  data: string;
  mimeType: string;
}

export interface EmbeddedResource {
  type: "resource";
  resource: TextResourceContents | BlobResourceContents;
}

export interface TextResourceContents {
  uri: string;
  mimeType?: string;
  text: string;
}

export interface BlobResourceContents {
  uri: string;
  mimeType?: string;
  blob: string;
}

// Notification types
export type MCPNotification =
  | "notifications/initialized"
  | "notifications/progress"
  | "notifications/message"
  | "notifications/resources/list_changed"
  | "notifications/tools/list_changed"
  | "notifications/prompts/list_changed";

// Progress notification
export interface ProgressNotification {
  progressToken: string | number;
  progress: number;
  total?: number;
}

// Logging
export type LogLevel = "debug" | "info" | "warning" | "error";

export interface LogMessage {
  level: LogLevel;
  logger?: string;
  data: unknown;
}
