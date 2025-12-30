# MCP-MultiCore
An MCP Gateway Implemented with PureMVC MultiCore and Pipes

## Docs
* [Project Brief](docs/brief.md) 
* [Technical Specification](docs/spec.md)

## Status
* Config-driven Gateway, Dashboard, and (multiple) Server Cores initialized and plumbed.

## Next
* Send messages down all the pipes and get confirmation that intra-core plumbing works

## Current Startup Log
```shell
🔱 GatewayFacade - Preparing the Gateway Core
   📋 StartupGatewayCommand - Executing Gateway startup subcommands
      ⚙️ PrepareGatewayModelCommand - Preparing Gateway Model
         💾 GatewayConfigProxy - Registered with config
         ✔︎ Gateway Model prepared
      ⚙️ PrepareGatewayViewCommand - Preparing Gateway View
         🧩 GatewayJunctionMediator - Registered
         🧩 DashboardTeeMediator - Registered
         ✔︎ Gateway View prepared
      ⚙️ PlumbDashboardCommand - Create and Plumb Dashboard Core
         🔱 Dashboard Facade - Preparing the Dashboard Core
            📋 StartupDashboardCommand - Executing Dashboard startup subcommands
               ⚙️ PrepareDashboardModelCommand - Preparing Dashboard Model
                  💾 DashboardConfigProxy - Registered with config
                  💾 DashboardStreamsProxy - registered
                  ✔︎ Dashboard Model Prepared
               ⚙️ PrepareDashboardViewCommand - Preparing Dashboard View
                  🧩 DashboardJunctionMediator - Registered
                  ✔︎ Dashboard View prepared
               ⚙️ PrepareDashboardControllerCommand - Preparing Dashboard Controller
                  ✔︎ Dashboard Controller Prepared
         ✔︎ Dashboard Core plumbed
      ⚙️ PlumbServersCommand - Create and Plumb Server Cores
         🔱 ServerFacade - Preparing Server Core server-everything
            📋 StartupServerCommand - Executing Server startup subcommands
               ⚙️ PrepareServerModelCommand - Preparing Server Model for server-everything
                  💾 ServerConfigProxy - Registered with config
                  ✔︎ Server Model prepared
               ⚙️ PrepareServerViewCommand - Preparing Server View for server-everything
                  🧩 ServerJunctionMediator - Registered
                  ✔︎ Server View prepared
         ✔︎ Server Core server-everything plumbed
         🔱 ServerFacade - Preparing Server Core server-filesystem
            📋 StartupServerCommand - Executing Server startup subcommands
               ⚙️ PrepareServerModelCommand - Preparing Server Model for server-filesystem
                  💾 ServerConfigProxy - Registered with config
                  ✔︎ Server Model prepared
               ⚙️ PrepareServerViewCommand - Preparing Server View for server-filesystem
                  🧩 ServerJunctionMediator - Registered
                  ✔︎ Server View prepared
         ✔︎ Server Core server-filesystem plumbed
         ✔︎ All Server Cores plumbed
      📋 StartMCPInterfaceCommand - Executing MCP Interface startup subcommands
         ⚙️ StreamableHttpTransportManagerCommand - Manage MCP Interface Streamable HTTP Transports
         ✔︎ Streamable HTTP Transport Manager started
            🎧 Streamable HTTP MCP Server listening on port 3001
            📥 Received POST request
               📤 Handling MCP Initialization request
               🔌 Session initialized with ID 07c79340-3c00-4808-8f03-ce66b8b67f0f
            📥 Received POST request
               📤 Handling MCP Message from 07c79340-3c00-4808-8f03-ce66b8b67f0f
            📥 Received GET request
               🏁 Establishing new SSE stream for session 07c79340-3c00-4808-8f03-ce66b8b67f0f
               📤 Handling SSE handshake for session 07c79340-3c00-4808-8f03-ce66b8b67f0f
            📥 Received POST request
               📤 Handling MCP Message from 07c79340-3c00-4808-8f03-ce66b8b67f0f

```
