# @zayne-labs/ui

Welcome to the official documentation for @zayne-labs/ui - a collection of multi-framework UI utilities and unstyled components.

## Introduction

@zayne-labs/ui provides a comprehensive suite of framework-agnostic UI utilities and unstyled components. Our library is designed with flexibility and developer experience in mind, giving you complete control over your UI design while providing powerful functionality out of the box.

Currently, we offer a robust React implementation, with plans to support other frameworks like Vue, Svelte, and Solid in the future.

## Key Features

- 🚀 **Framework-agnostic design** - Core concepts work across different UI frameworks (React support available now, more coming soon!)
- 🎨 **Zero-styling approach** - Full control over your UI design with no pre-defined styles to override
- 🔧 **Highly customizable** - Flexible hooks and components that adapt to your specific needs
- 📦 **Tree-shakeable modules** - Only import what you need, keeping your bundle size minimal
- 🌐 **Multi-framework vision** - Use the same concepts across different frameworks (React now, Vue/Svelte/Solid coming soon)

## Component Library

Our library is organized into two main categories of components, each designed to solve specific UI challenges:

### UI Components

UI Components provide interactive elements and complex UI patterns with zero styling:

- [Card](/ui-components/card) - Composable card layouts with flexible content areas
- [Carousel](/ui-components/carousel) - Fully accessible carousel/slider component
- [DragScroll](/ui-components/drag-scroll) - Add drag-to-scroll behavior to any scrollable container
- [DropZone](/ui-components/drop-zone) - File upload zone with drag-and-drop support
- [Form](/ui-components/form) - Flexible form handling with field subscriptions and validation

### Utility Components

Utility Components simplify common UI patterns and make your code more declarative:

- [Await](/utility-components/await) - Handle async states elegantly with built-in loading and error states
- [ErrorBoundary](/utility-components/error-boundary) - Catch and handle errors gracefully
- [For](/utility-components/for) - Iterative rendering with built-in empty states
- [Show](/utility-components/show) - Simplified conditional rendering
- [Slot](/utility-components/slot) - Flexible component composition pattern
- [SuspenseWithBoundary](/utility-components/suspense-with-boundary) - Combines React Suspense with error boundary capabilities
- [Switch](/utility-components/switch) - Conditional rendering with pattern matching
- [Teleport](/utility-components/teleport) - Render content to a different part of the DOM

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

Here's a simple example using the `Switch` utility component:

```tsx
import { Switch } from '@zayne-labs/ui-react/common'

function App() {
  const status = "loading"

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

## Documentation Structure

Our documentation is organized into several sections to help you find what you need:

- **Getting Started** - Installation, basic concepts, and first steps
- **UI Components** - Documentation for each UI component
- **Utility Components** - Documentation for each utility component
- **Advanced Usage** - Deep dives into complex use cases
- **API Reference** - Detailed API documentation
- **Migration Guide** - Help with upgrading from previous versions

## Philosophy

@zayne-labs/ui is built on a few core principles:

1. **Zero styling by default** - We believe styling decisions should be yours, not ours. Our components provide functionality without enforcing design opinions.

2. **Framework agnostic concepts** - While our implementation is currently React-focused, our core concepts are designed to work across frameworks.

3. **Developer experience first** - We strive for intuitive APIs that make complex UI patterns simple to implement.

4. **Flexibility without complexity** - Components should be easy to use by default, but flexible enough for advanced customization.

## Contributing

We welcome contributions! Please see our [contributing guidelines](https://github.com/zayne-labs/contribute.git) for details.

## License

MIT © [Zayne Labs]
