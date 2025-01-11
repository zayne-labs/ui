# @zayne-labs/ui

A collection of multi-framework UI utilities and unstyled components. Currently focused on React implementation, with plans to support other frameworks like Vue, Svelte, and Solid in the future.

## Features

- 🚀 Framework agnostic design (React support available now, more coming soon!)
- 🎨 Base styles (not UI styles, that's up to you) with Tailwind CSS
- 🔧 Highly customizable
- 📦 Tree-shakeable
- 🌐 Multi-framework support (coming soon)

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
import { Switch } from '@zayne-labs/ui-react/common'

function App() {
  const status = 'loading'

  return (
    <Switch condition={status}>
      <Switch.Match when="loading">
        <div>Loading your content...</div>
      </Switch.Match>

      <Switch.Match when="error">
        <div>Oops! Something went wrong</div>
      </Switch.Match>

      <Switch.Default>
        <div>Content loaded successfully!</div>
      </Switch.Default>
    </Switch>
  )
}
```

## Documentation

Visit our documentation site for detailed usage instructions, examples, and API references. [Coming soon]

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

```
ui/
├── packages/
│   └── ui-react/        # React UI components (More frameworks coming soon!)
├── dev/                 # Development utilities
├── .changeset/         # Changesets for versioning
└── package.json        # Root package.json
```

## Contributing

We welcome contributions! Please see our [contributing guidelines](https://github.com/zayne-labs/contribute.git) for details.

## License

MIT © [Zayne Labs]

---
