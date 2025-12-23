# mcp-multicore
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
   📋 GatewayStartupCommand - Executing Gateway startup subcommands
      ⚙️ GatewayPrepareModelCommand - Preparing Gateway Model
         💾 GatewayConfigProxy - Registered with config
         ✔︎ Gateway Model prepared
      ⚙️ GatewayPrepareViewCommand - Preparing Gateway View
         🧩 GatewayJunctionMediator - Registered
         🧩 DashboardTeeMediator - Registered
         ✔︎ Gateway View prepared
      ⚙️ PlumbDashboardCommand - Create and Plumb Dashboard Core
         🔱 Dashboard Facade - Preparing the Dashboard Core
            📋 DashboardStartupCommand - Executing Dashboard startup subcommands
               ⚙️ DashboardPrepareModelCommand - Preparing Dashboard Model
                  💾 DashboardConfigProxy - Registered with config
                  ✔︎ Dashboard Model Prepared
               ⚙️ DashboardPrepareViewCommand - Preparing Dashboard View
                  🧩 DashboardJunctionMediator - Registered
                  ✔︎ Dashboard View prepared
         ✔︎ Dashboard Core plumbed
      ⚙️ PlumbServersCommand - Create and Plumb Server Cores
         🔱 ServerFacade - Preparing Server Core server-everything
            📋 ServerStartupCommand - Executing Server startup subcommands
               ⚙️ ServerPrepareModelCommand - Preparing Server Model for server-everything
                  💾 ServerConfigProxy - Registered with config
                  ✔︎ Server Model prepared
               ⚙️ ServerPrepareViewCommand - Preparing Server View for server-everything
                  🧩 ServerJunctionMediator - Registered
                  ✔︎ Server View prepared
         ✔︎ Server Core server-everything plumbed
         🔱 ServerFacade - Preparing Server Core server-filesystem
            📋 ServerStartupCommand - Executing Server startup subcommands
               ⚙️ ServerPrepareModelCommand - Preparing Server Model for server-filesystem
                  💾 ServerConfigProxy - Registered with config
                  ✔︎ Server Model prepared
               ⚙️ ServerPrepareViewCommand - Preparing Server View for server-filesystem
                  🧩 ServerJunctionMediator - Registered
                  ✔︎ Server View prepared
         ✔︎ Server Core server-filesystem plumbed
         ✔︎ All Server Cores plumbed
```
