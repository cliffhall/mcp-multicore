# MCP-MultiCore Agent Guidelines

These guidelines are for adding functionality to the MCP-MultiCore project, following its existing PureMVC MultiCore architecture and TypeScript patterns.

## Architecture Overview

The system is built using the **PureMVC MultiCore** framework. Each major component runs in its own self-contained "Core".

- **Gateway Core**: Coordinates traffic between clients and MCP servers.
- **Server Core**: Manages a connection to a specific MCP server (one core per server).
- **Dashboard Core**: Monitors and logs traffic across the system.

### Inter-Core Communication

Cores communicate in two ways:
1. **Asynchronous (Pipes)**: Used for most data traffic (e.g., MCP messages). Managed by `JunctionMediator`.
2. **Synchronous (Facade)**: Used for direct coordination where necessary.

## General Principles

- **Follow the Pattern**: Match the existing directory structure and naming conventions within each core (`controller`, `model`, `view`).
- **Strong Typing**: 
  - Define interfaces for all MCP protocol messages in `src/common/interfaces.ts`.
  - Avoid the `any` type at all costs.
  - Use Union types for message discrimination.
- **Logging**: Use the `LoggingFacade`'s `log` method. Avoid `console.log` directly in actors.
- **Async Operations**: Use `AsyncMacroCommand` or `AsyncSimpleCommand` for any logic involving promises (network calls, timeouts, etc.).

## Adding Functionality

### 1. Adding a New Notification
- Add the notification name to the appropriate Notifications class in `src/common/constants.ts` (e.g., `GatewayNotifications`).

### 2. Creating a Proxy (Model)
- Proxies should extend the PureMVC `Proxy` class.
- Use generic Proxies for type-safe data handling.
- Register Proxies during the core's `PrepareModelCommand`.
- Example: `src/cores/server/model/tools-proxy.ts`.

### 3. Creating a Mediator (View)
- Mediators should extend the PureMVC `Mediator` class.
- For inter-core communication, use `JunctionMediator` or subclasses.
- Register Mediators during the core's `PrepareViewCommand`.
- Example: `src/cores/gateway/view/gateway-junction-mediator.ts`.
- Being a server process, the View is any component that needs to be sent a notification, such as pipes junctions and the console.

### 4. Creating a Command (Controller)
- Commands handle the business logic of the application.
- Use `AsyncMacroCommand` for sequences of operations.
- Register Commands in the Core's Facade `initializeController` method.
- Example: `src/cores/gateway/controller/startup/startup-gateway-command.ts`.

## MCP Protocol Handling

- Use the `@modelcontextprotocol/sdk` types where applicable.
- Route all MCP traffic through the pipes so it can be tee'd to the Dashboard.
- If MCP traffic needs to go through a Facade, such as a ToolCallRequest, make sure the messag
- Define `MCPTrafficMessage` implementations for any new message types being routed via pipes.

## Directory Structure

```text
src/
├── common/             # Shared interfaces, constants, and base actors
├── cores/
│   ├── gateway/        # Gateway Core implementation
│   ├── server/         # Server Core implementation
│   └── dashboard/      # Dashboard Core implementation
```

## Summary Checklist
- [ ] Is the logic in the correct Core?
- [ ] Are all types explicitly defined?
- [ ] Did you use `LoggingFacade.log`?
- [ ] Are async operations handled via `AsyncCommand`?
- [ ] If inter-core, is it using Pipes or Facade methods correctly?
