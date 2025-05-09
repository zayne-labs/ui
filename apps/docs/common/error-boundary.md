# ErrorBoundary

A utility component for gracefully handling errors in React component trees.

## Overview

The ErrorBoundary component provides a way to catch JavaScript errors anywhere in a child component tree, log those errors, and display a fallback UI instead of crashing the entire application. It builds upon React's error boundary pattern with additional features like error resetting and context integration.

## Key Features

- **Error Isolation** - Contains errors within a boundary to prevent full application crashes
- **Fallback UI** - Displays alternative content when errors occur
- **Reset Capability** - Allows recovery from errors without full page reloads
- **Context Integration** - Exposes error state and reset functions to child components
- **Hook-Based API** - Provides imperative control over errors with `useErrorBoundary`
- **TypeScript Support** - Full type safety for errors and fallback props

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
import { ErrorBoundary } from '@zayne-labs/ui-react/common/error-boundary';

function App() {
  return (
    <ErrorBoundary
      fallback={<div>Something went wrong. Please try again.</div>}
      onError={(error) => console.error('Caught an error:', error)}
    >
      <ComponentThatMightThrow />
    </ErrorBoundary>
  );
}
```

## Custom Error Fallback

You can provide a function component that receives error details and a reset function:

```tsx
import { ErrorBoundary } from '@zayne-labs/ui-react/common';

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }) => (
        <div className="error-container">
          <h2>An error occurred</h2>
          <p>{error.message}</p>
          <button onClick={resetErrorBoundary}>
            Try again
          </button>
        </div>
      )}
    >
      <ComponentThatMightThrow />
    </ErrorBoundary>
  );
}
```

## Reset Keys

The `resetKeys` prop allows you to automatically reset the error boundary when certain values change:

```tsx
import { ErrorBoundary } from '@zayne-labs/ui-react/common';
import { useState } from 'react';

function App() {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <button onClick={() => setCounter(c => c + 1)}>
        Increment Counter: {counter}
      </button>

      <ErrorBoundary
        fallback={<div>Error occurred! Increment the counter to try again.</div>}
        resetKeys={[counter]}
        onReset={({ reason }) => console.log(`Error boundary reset due to: ${reason}`)}
      >
        <ComponentThatThrowsWhenCounterIsEven counter={counter} />
      </ErrorBoundary>
    </div>
  );
}

function ComponentThatThrowsWhenCounterIsEven({ counter }) {
  if (counter % 2 === 0 && counter !== 0) {
    throw new Error(`Counter is even: ${counter}`);
  }

  return <div>Counter is {counter}</div>;
}
```

## Using the Hook API

The `useErrorBoundary` hook allows you to programmatically trigger and handle errors:

```tsx
import { ErrorBoundary, useErrorBoundary } from '@zayne-labs/ui-react/common';

function App() {
  return (
    <ErrorBoundary
      fallback={({ resetErrorBoundary }) => (
        <div>
          <p>Failed to fetch data</p>
          <button onClick={resetErrorBoundary}>Retry</button>
        </div>
      )}
    >
      <DataFetcher />
    </ErrorBoundary>
  );
}

function DataFetcher() {
  const { showBoundary } = useErrorBoundary();

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return await response.json();
    } catch (error) {
      showBoundary(error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return <div>Loading data...</div>;
}
```

## Nested Error Boundaries

You can nest error boundaries to provide different fallback UIs for different parts of your app:

```tsx
import { ErrorBoundary } from '@zayne-labs/ui-react/common';

function App() {
  return (
    <ErrorBoundary fallback={<div>Application error</div>}>
      <Header />

      <main>
        <ErrorBoundary fallback={<div>Content error. Other parts still work.</div>}>
          <MainContent />
        </ErrorBoundary>
      </main>

      <ErrorBoundary fallback={<div>Footer error. Other parts still work.</div>}>
        <Footer />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

## TypeScript Support

The ErrorBoundary component provides full type safety:

```tsx
import { ErrorBoundary } from '@zayne-labs/ui-react/common';

interface ApiError extends Error {
  statusCode: number;
  endpoint: string;
}

function App() {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary }: { error: ApiError; resetErrorBoundary: () => void }) => (
        <div>
          <h2>API Error</h2>
          <p>Status: {error.statusCode}</p>
          <p>Endpoint: {error.endpoint}</p>
          <p>Message: {error.message}</p>
          <button onClick={resetErrorBoundary}>Retry</button>
        </div>
      )}
    >
      <ApiComponent />
    </ErrorBoundary>
  );
}
```

## API Reference

### ErrorBoundary Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *Required* | The components that might throw errors |
| `fallback` | `React.ReactNode \| ((props: FallbackProps) => React.ReactNode)` | `undefined` | The UI to display when an error occurs |
| `onError` | `(error: Error, info: React.ErrorInfo) => void` | `undefined` | Called when an error is caught |
| `onReset` | `(details: { reason: string; parameters?: unknown[]; prev?: unknown[]; next?: unknown[] }) => void` | `undefined` | Called when the error boundary is reset |
| `resetKeys` | `unknown[]` | `[]` | Array of values that will trigger boundary reset when changed |

### FallbackProps

Props passed to the fallback function:

| Prop | Type | Description |
|------|------|-------------|
| `error` | `Error` | The error that was caught |
| `resetErrorBoundary` | `(...args: unknown[]) => void` | Function to reset the error boundary |

### useErrorBoundary Hook

```tsx
const { resetBoundary, showBoundary } = useErrorBoundary<CustomError>();
```

| Return Value | Type | Description |
|--------------|------|-------------|
| `resetBoundary` | `() => void` | Function to reset the error boundary |
| `showBoundary` | `(error: TError) => void` | Function to manually trigger the error boundary with a specific error |

### ErrorBoundaryContext

Values available through the ErrorBoundaryContext:

| Value | Type | Description |
|-------|------|-------------|
| `error` | `unknown` | Current error (if any) |
| `hasError` | `boolean` | Whether an error is currently active |
| `resetErrorBoundary` | `(...args: unknown[]) => void` | Function to reset the error boundary |

## Implementation Details

The ErrorBoundary component is built as a class component because React's error boundary feature requires the use of lifecycle methods like `getDerivedStateFromError` and `componentDidCatch`, which are only available in class components.

```tsx
// Internal implementation (simplified)
class ErrorBoundary extends Component {
  static getDerivedStateFromError(error) {
    return { error, hasError: true };
  }

  componentDidCatch(error, info) {
    this.props.onError?.(error, info);
  }

  resetErrorBoundary = () => {
    this.setState({ error: null, hasError: false });
  };

  // ...render logic
}
```

## Best Practices

1. **Strategic Placement** - Place error boundaries strategically around critical UI sections
2. **Multiple Boundaries** - Use multiple, nested boundaries for better isolation
3. **Telemetry Integration** - Connect the `onError` handler to your error monitoring service
4. **Clear Error Messages** - Provide clear, user-friendly error messages and recovery options
5. **Testing** - Explicitly test error scenarios with your error boundaries

## Accessibility Considerations

When implementing error states:

1. **Focus Management** - Set focus to the error message or primary action button
2. **Descriptive Errors** - Make error messages descriptive and actionable
3. **ARIA Attributes** - Use `role="alert"` or `aria-live` for dynamic error messages
4. **Color Contrast** - Ensure error states have sufficient color contrast

## Summary

The ErrorBoundary component provides a comprehensive solution for error handling in React applications. By isolating errors, providing fallback UIs, and offering reset capabilities, it enables you to build more resilient applications with better user experiences during failure scenarios.
