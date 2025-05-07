# SuspenseWithBoundary

A utility component that combines React's Suspense and ErrorBoundary for elegant handling of both loading and error states.

## Overview

The SuspenseWithBoundary component provides a convenient wrapper that combines the functionality of React's built-in Suspense component with an ErrorBoundary. This simplifies the common pattern of handling both loading states (with Suspense) and error states (with ErrorBoundary) when working with asynchronous operations or code-splitting.

## Key Features

- **Combined Functionality** - Merges Suspense and ErrorBoundary in a single component
- **Simplified API** - Provides a cleaner syntax for a common pattern
- **Loading State Handling** - Shows fallback UI while content is loading
- **Error Handling** - Catches and displays errors that occur during rendering
- **TypeScript Support** - Full type safety for props and fallbacks

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
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common/suspense-with-boundary';
import { lazy } from 'react';

// Lazy-loaded component
const LazyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <SuspenseWithBoundary
      fallback={<div>Loading...</div>}
      errorFallback={<div>Something went wrong!</div>}
    >
      <LazyComponent />
    </SuspenseWithBoundary>
  );
}
```

## Data Fetching Example

```tsx
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common';
import { use } from 'react';

// Component that uses React's `use` hook with a promise
function UserProfile({ userId }) {
  const userPromise = fetchUser(userId);
  const user = use(userPromise); // This will suspend until the promise resolves

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}

// Data fetching function
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    });
}

// Usage
function App() {
  return (
    <SuspenseWithBoundary
      fallback={<div className="loading">Loading user data...</div>}
      errorFallback={({ error }) => (
        <div className="error">
          <h2>Error loading user</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
    >
      <UserProfile userId="123" />
    </SuspenseWithBoundary>
  );
}
```

## Custom Loading State

```tsx
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading your content...</p>
      <div className="progress-bar">
        <div className="progress-fill animate-pulse"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <SuspenseWithBoundary
      fallback={<LoadingSpinner />}
      errorFallback={<div>Error loading content</div>}
    >
      <AsyncContent />
    </SuspenseWithBoundary>
  );
}
```

## Custom Error State

```tsx
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common';

function ErrorDisplay({ error, reset }) {
  return (
    <div className="error-container">
      <div className="error-icon">❌</div>
      <h2>Something went wrong</h2>
      <p className="error-message">{error.message}</p>
      <div className="error-actions">
        <button onClick={reset} className="retry-button">
          Try Again
        </button>
        <button onClick={() => window.location.reload()} className="reload-button">
          Reload Page
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <SuspenseWithBoundary
      fallback={<div>Loading...</div>}
      errorFallback={ErrorDisplay}
    >
      <AsyncContent />
    </SuspenseWithBoundary>
  );
}
```

## Multiple Nested Components

```tsx
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common';

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        {/* Each widget has its own loading and error states */}
        <div className="widget">
          <h2>User Stats</h2>
          <SuspenseWithBoundary
            fallback={<div className="widget-loading">Loading stats...</div>}
            errorFallback={<div className="widget-error">Failed to load stats</div>}
          >
            <UserStatsWidget />
          </SuspenseWithBoundary>
        </div>

        <div className="widget">
          <h2>Recent Activity</h2>
          <SuspenseWithBoundary
            fallback={<div className="widget-loading">Loading activity...</div>}
            errorFallback={<div className="widget-error">Failed to load activity</div>}
          >
            <ActivityWidget />
          </SuspenseWithBoundary>
        </div>

        <div className="widget">
          <h2>Notifications</h2>
          <SuspenseWithBoundary
            fallback={<div className="widget-loading">Loading notifications...</div>}
            errorFallback={<div className="widget-error">Failed to load notifications</div>}
          >
            <NotificationsWidget />
          </SuspenseWithBoundary>
        </div>
      </div>
    </div>
  );
}
```

## TypeScript Integration

```tsx
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common';
import { use } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: 'admin' | 'user';
}

interface ApiError extends Error {
  statusCode: number;
  endpoint: string;
}

function UserProfile({ userId }: { userId: string }) {
  const userPromise: Promise<User> = fetchUser(userId);
  const user = use(userPromise);

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>Role: {user.role}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

function App() {
  return (
    <SuspenseWithBoundary
      fallback={<div>Loading user...</div>}
      errorFallback={({ error, reset }: { error: ApiError; reset: () => void }) => (
        <div className="error-container">
          <h2>Error: {error.statusCode}</h2>
          <p>Failed to load from: {error.endpoint}</p>
          <p>{error.message}</p>
          <button onClick={reset}>Try Again</button>
        </div>
      )}
    >
      <UserProfile userId="123" />
    </SuspenseWithBoundary>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *Required* | Content that may suspend or throw errors |
| `fallback` | `React.ReactNode` | `undefined` | UI to show while content is loading |
| `errorFallback` | `React.ReactNode \| ((props: { error: Error; reset: () => void }) => React.ReactNode)` | `undefined` | UI to show when an error occurs |

### Integration with Suspense

SuspenseWithBoundary wraps React's built-in Suspense component, which handles showing a fallback UI while waiting for some code to load or data to be fetched. The `fallback` prop is passed directly to Suspense.

```tsx
// Internal implementation (simplified)
<Suspense fallback={fallback}>
  {children}
</Suspense>
```

### Integration with ErrorBoundary

SuspenseWithBoundary also wraps the ErrorBoundary component, which catches JavaScript errors in its child component tree and displays a fallback UI instead of crashing. The `errorFallback` prop is passed to ErrorBoundary's `fallback` prop.

```tsx
// Internal implementation (simplified)
<ErrorBoundary fallback={errorFallback}>
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
</ErrorBoundary>
```

## Implementation Details

The SuspenseWithBoundary component is a thin wrapper that combines two React patterns:

1. `<ErrorBoundary>` - For catching and handling errors
2. `<Suspense>` - For handling loading states

It's particularly useful with React's `use` hook, lazy loading via `React.lazy()`, or any other code that might suspend rendering.

## Best Practices

1. **Component Granularity** - Use SuspenseWithBoundary at appropriate levels of granularity to avoid entire UI suspending
2. **Meaningful Fallbacks** - Provide informative loading and error states
3. **Loading Indicators** - Match the size/shape of loading indicators to the content they replace to prevent layout shifts
4. **Error Recovery** - Include retry mechanisms in error states when appropriate
5. **Accessibility** - Ensure loading and error states are accessible to all users

## Comparison with Direct Usage

### Using SuspenseWithBoundary

```tsx
<SuspenseWithBoundary
  fallback={<div>Loading...</div>}
  errorFallback={<div>Error!</div>}
>
  <AsyncComponent />
</SuspenseWithBoundary>
```

### Direct Usage of Suspense and ErrorBoundary

```tsx
<ErrorBoundary fallback={<div>Error!</div>}>
  <Suspense fallback={<div>Loading...</div>}>
    <AsyncComponent />
  </Suspense>
</ErrorBoundary>
```

The SuspenseWithBoundary component simply combines these patterns into a single, more convenient component.

## Summary

The SuspenseWithBoundary component offers a concise way to handle both loading and error states when working with asynchronous content in React. By combining Suspense and ErrorBoundary into a single component, it reduces boilerplate code and makes your components cleaner and more maintainable.
