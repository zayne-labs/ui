# @zayne-labs/ui

Composable, headless UI components and utilities built for flexibility and great developer experience. Currently supports React, with more frameworks coming soon.

## Features

- Headless components - bring your own styles
- Composable API design
- Tree-shakeable ESM modules
- TypeScript-first with full type safety
- Built on top of [@zayne-labs/toolkit](https://github.com/zayne-labs/toolkit)

## Packages

### @zayne-labs/ui-react

React implementation of the UI library. More framework adapters coming in the future.

## Components

### UI Components

Headless UI components for common interface patterns:

- **Card** - Composable card layouts
- **Carousel** - Customizable slideshow component
- **DragScroll** - Add drag-to-scroll behavior to containers
- **DropZone** - File upload with drag-and-drop support
- **Form** - Form handling with validation (wrapper around react-hook-form)

### Common Components

Utility components for declarative UI patterns:

- **Await** - Handle async states declaratively
- **ClientGate** - Client-side only rendering guard
- **ErrorBoundary** - Graceful error handling
- **For** - List rendering with empty states
- **Presence** - Animation presence detection
- **Show** - Conditional rendering
- **Slot** - Component composition with slots
- **SuspenseWithBoundary** - Combined Suspense and ErrorBoundary
- **Switch** - Pattern matching for conditional rendering
- **Teleport** - Portal-based content teleportation

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Usage

```tsx
import { Switch } from '@zayne-labs/ui-react/common/switch'

function App() {
  const status = "loading"

  return (
    <Switch.Root value={status}>
      <Switch.Match when="loading">
        <div>Loading...</div>
      </Switch.Match>

      <Switch.Match when="error">
        <div>Something went wrong</div>
      </Switch.Match>

      <Switch.Default>
        <div>Content loaded!</div>
      </Switch.Default>
    </Switch.Root>
  )
}
```

```tsx
import { For } from '@zayne-labs/ui-react/common/for'

function UserList({ users }) {
  return (
    <For each={users} fallback={<p>No users found</p>}>
      {(user) => <div key={user.id}>{user.name}</div>}
    </For>
  )
}
```

## Documentation

Visit our [documentation site](https://zayne-labs-ui.netlify.app) for detailed usage instructions, examples, and API references.

## Development

This is a monorepo managed with pnpm and Turborepo.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev:react

# Run docs site
pnpm dev:docs

# Run dev playground
pnpm dev:dev

# Lint
pnpm lint:eslint

# Type check
pnpm lint:type-check

# Format code
pnpm lint:format
```


## Contributing

Contributions are welcome! Check out the [contributing guidelines](https://github.com/zayne-labs/contribute.git) to get started.

## License

MIT © Ryan Zayne
