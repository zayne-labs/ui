# @zayne-labs/ui

A collection of multi-framework UI utilities and unstyled components. Currently focused on React implementation, with plans to support other frameworks like Vue, Svelte, and Solid in the future.

## Features

- 🚀 Framework agnostic design (React support available now, more coming soon!)
- 🎨 Zero-styling approach - full control over your UI design
- 🔧 Highly customizable hooks and components
- 📦 Tree-shakeable modules
- 🌐 Multi-framework support (coming soon)

## Components

### UI Components

@zayne-labs/ui provides a set of headless UI components and hooks:

- **Form** - Flexible form handling with field subscriptions and validation, convenience wrapper around react-hook-form
- **DropZone** - File upload zone with drag-and-drop support
- **Card** - Composable card layouts
- **Carousel** - Customizable slideshow for cycling through elements
- **DragScroll** - Add drag-to-scroll behavior to any container

### Utility Components

@zayne-labs/ui provides several utility components to handle common UI patterns:

- **Switch** - Conditional rendering with pattern matching
- **Show** - Simplified conditional rendering
- **For** - Iterative rendering with built-in empty states
- **ErrorBoundary** - Graceful error handling
- **Await** - Handle async states elegantly
- **Teleport** - Teleport content to a different part of the DOM via react portals
- **Slot** - Component composition with named slots
- **SuspenseWithBoundary** - Combined Suspense and ErrorBoundary

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Quick Start

```tsx
import { Switch } from '@zayne-labs/ui-react/common/switch'

function App() {
  const status = "loading"

  return (
    <Switch.Root value={status}>
      <Switch.Match when="loading">
        <div>Loading your content...</div>
      </Switch.Match>

      <Switch.Match when="error">
        <div>Oops! Something went wrong</div>
      </Switch.Match>

      <Switch.Default>
        <div>Content loaded successfully!</div>
      </Switch.Default>
    </Switch.Root>
  )
}
```

## Documentation

Visit our [documentation site](https://zayne-labs-ui.netlify.app) for detailed usage instructions, examples, and API references.

## Development

This project uses pnpm as the package manager. To get started with development:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development build
pnpm build:dev

# Run tests
pnpm build:test

# Lint code
pnpm lint:eslint

# Format code
pnpm lint:format
```

## Project Structure

```tree
ui/
├── packages/
│   └── ui-react/        # React UI components (More frameworks coming soon!)
├── apps/
│   ├── docs/           # Documentation site
│   └── dev/            # Development playground
├── .changeset/         # Changesets for versioning
└── package.json        # Root package.json
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](https://github.com/zayne-labs/contribute.git) for details.

## License

MIT © [Zayne Labs]

---
