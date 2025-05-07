# Slot

A utility component for flexible component composition through prop merging.

## Overview

The Slot component enables powerful component composition patterns by merging props from a parent component onto its child element. This approach, sometimes called the "as child" pattern, allows components to accept another component as a child and enhance it with additional props while preserving refs and existing behavior.

## Credits

This was inspired entirely by the [Slot](https://www.radix-ui.com/primitives/docs/utilities/slot) component from Radix UI, but has been optimized in certain areas.

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Basic Usage

```tsx
import { Slot } from '@zayne-labs/ui-react/common/slot';

function Button({ asChild, className, ...props }) {
  const Component = asChild ? Slot : 'button';

  return (
    <Component
      className={`rounded bg-blue-500 px-4 py-2 text-white ${className}`}
      {...props}
    />
  );
}

// Usage with default button rendering
function App() {
  return (
    <Button onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}

// Usage with custom element via Slot
function AppWithCustomElement() {
  return (
    <Button asChild>
      <a href="/about">Go to About</a>
    </Button>
  );
}
```
