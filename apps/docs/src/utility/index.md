# Utility Components

A collection of utility components that provide elegant solutions for common React patterns and challenges.

## Overview

This directory contains utility components that enhance React development with declarative APIs for common patterns:

- `Await` - Declarative handling of async operations with built-in Suspense and error boundary support
- `Show` - Clean conditional rendering with fallback support, inspired by SolidJS
- `For` - Declarative iteration patterns for collections and arrays
- `Switch` - Declarative switch/case pattern for conditional rendering
- `Slot` - Component composition through slot-based content distribution
- `ErrorBoundary` - Graceful error handling for component trees
- `SuspenseWithBoundary` - Combined Suspense and error boundary wrapper
- `Teleport` - Render components at different DOM locations

## Installation

```bash
pnpm add @zayne-labs/ui-react
```

## Usage

Utilities can be imported from their respective modules:

```tsx
import { Await } from '@zayne-labs/ui-react/common/await'
import { Show } from '@zayne-labs/ui-react/common/show'
// etc.
```

## Documentation

Each utility has its own detailed documentation with examples, API reference, and best practices. Click through to the individual docs above to learn more.
