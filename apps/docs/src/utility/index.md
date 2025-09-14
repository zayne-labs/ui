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
- `ClientGate` - Render components only after client-side hydration
- `Presence` - Manage component presence with animation support

## Installation

```bash
pnpm add @zayne-labs/ui-react
```

## Usage

Utilities can be imported from the main common module:

```tsx
import {
 Await,
 Show,
 For,
 Switch,
 Slot,
 ErrorBoundary,
 SuspenseWithBoundary,
 Teleport,
 ClientGate,
 Presence,
} from "@zayne-labs/ui-react";
```

Or import individual components:

```tsx
import { Await } from "@zayne-labs/ui-react";
import { Show } from "@zayne-labs/ui-react";
import { ClientGate } from "@zayne-labs/ui-react";
import { Presence } from "@zayne-labs/ui-react";
// etc.
```

## Documentation

Each utility has its own detailed documentation with examples, API reference, and best practices. Click through to the individual docs above to learn more.
