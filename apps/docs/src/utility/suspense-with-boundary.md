# SuspenseWithBoundary

A component that combines Suspense and ErrorBoundary components into a single component.

## Installation

```bash
pnpm add @zayne-labs/ui-react  # recommended
npm install @zayne-labs/ui-react
yarn add @zayne-labs/ui-react
```

## Usage

### Basic Example

```tsx
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common/suspense-with-boundary';
import { lazy } from 'react';

// Lazy-loaded component
const Chart = lazy(() => import('./Chart'));

function Dashboard() {
  return (
    <SuspenseWithBoundary
      fallback={<div>Loading chart...</div>}
      errorFallback={<div>Failed to load chart</div>}
    >
      <Chart data={data} />
    </SuspenseWithBoundary>
  );
}
```

### Data Fetching

```tsx
import { SuspenseWithBoundary } from '@zayne-labs/ui-react/common/suspense-with-boundary';
import { use } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const user = use(fetchUser(userId));

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

function App() {
  return (
    <SuspenseWithBoundary
      fallback={<div>Loading user...</div>}
      errorFallback={({ error, reset }) => (
        <div>
          <p>Error: {error.message}</p>
          <button onClick={reset}>Retry</button>
        </div>
      )}
    >
      <UserProfile userId="123" />
    </SuspenseWithBoundary>
  );
}
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Content that may suspend or throw errors |
| `fallback` | `React.ReactNode` | UI to show while loading |
| `errorFallback` | `React.ReactNode \| ((props: { error: Error; reset: () => void }) => React.ReactNode)` | UI to show on error |

## Best Practices

1. Use at appropriate levels - wrap specific components rather than entire pages
2. Provide meaningful loading and error states
3. Match loading indicator size/shape to content to prevent layout shifts
4. Include retry mechanisms in error states when appropriate
5. Keep fallback components lightweight
