---
"@zayne-labs/ui-react": patch
---

feat: add granular subscriptions for formstate and values

refactor: restructure project to use workspace-based monorepo

- Reorganized project structure to use pnpm workspace monorepo setup
- Moved development app to apps/dev directory
- Updated workspace configuration and dependencies
- Set up Vite + React + TypeScript development environment
- Added form example using @zayne-labs/ui-react components
- Configured TailwindCSS with custom theme variables
- Added proper TypeScript and tooling configuration
- Removed root-level tailwind config in favor of app-specific config

Key changes:

- Added pnpm-workspace.yaml for monorepo setup
- Created apps/dev directory with complete Vite app setup
- Configured build tooling (Vite, TypeScript, TailwindCSS)
- Added example React form implementation
- Updated all relevant config files and dependencies
