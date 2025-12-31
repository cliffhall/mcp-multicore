# MCP-MultiCore
An MCP Gateway Implemented with PureMVC MultiCore and Pipes

## Docs
* [Project Brief](docs/brief.md) 
* [Technical Specification (draft)](docs/spec-draft.md)

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
         💾 McpTransportsProxy - Registered
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
               🧩 DashboardJunctionMediator - Accepting input pipe [from-everywhere]
               🧩 GatewayJunctionMediator - Accepting output pipe [to-dashboard]
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
               🧩 GatewayJunctionMediator - Accepting output pipe [to-server-everything]
               🧩 ServerJunctionMediator - Accepting input pipe [from-gateway]
               🧩 GatewayJunctionMediator - Accepting input pipe [from-server-everything]
               🧩 ServerJunctionMediator - Accepting output pipe [to-gateway]
         ✔︎ Server Core server-everything plumbed
         🔱 ServerFacade - Preparing Server Core server-filesystem
            📋 StartupServerCommand - Executing Server startup subcommands
               ⚙️ PrepareServerModelCommand - Preparing Server Model for server-filesystem
                  💾 ServerConfigProxy - Registered with config
                  ✔︎ Server Model prepared
               ⚙️ PrepareServerViewCommand - Preparing Server View for server-filesystem
                  🧩 ServerJunctionMediator - Registered
                  ✔︎ Server View prepared
               🧩 GatewayJunctionMediator - Accepting output pipe [to-server-filesystem]
               🧩 ServerJunctionMediator - Accepting input pipe [from-gateway]
               🧩 GatewayJunctionMediator - Accepting input pipe [from-server-filesystem]
               🧩 ServerJunctionMediator - Accepting output pipe [to-gateway]
         ✔︎ Server Core server-filesystem plumbed
         ✔︎ All Server Cores plumbed
      📋 StartMCPInterfaceCommand - Executing MCP Interface startup subcommands
         ⚙️ StreamableHttpTransportManagerCommand - Manage MCP Interface Streamable HTTP Transports
         ✔︎ Streamable HTTP Transport Manager started
            🎧 Streamable HTTP MCP Server listening on port 3001
```
