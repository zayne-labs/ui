# Show

A utility component for declarative conditional rendering with fallback support.

## Overview

The Show component provides a concise, readable way to handle conditional rendering in React. Inspired by the [Show](https://docs.solidjs.com/reference/components/show) component from SolidJS, it offers a more declarative API for managing UI states and provides built-in fallback handling as opposed ghastly nested ternary operators or complex logical AND patterns.

## Key Features

- **Declarative Conditionals** - Clean syntax for conditional rendering logic
- **Fallback Support** - Built-in handling of alternative content when conditions fail
- **Slot-Based Content** - Optional explicit Content and Fallback slots for complex scenarios
- **Render Props** - Support for function-as-children with access to condition value
- **TypeScript Integration** - Full type inference for condition values

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
import { Show } from '@zayne-labs/ui-react/common/show';

function UserProfile({ user }) {
  return (
    <div className="profile">
      <h1>User Profile</h1>

      <Show
        when={user}
        fallback={<p>Please sign in to view your profile</p>}
      >
        <div className="user-details">
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Member since: {user.joinDate}</p>
        </div>
      </Show>
    </div>
  );
}
```

## Using Content and Fallback Slots

For more complex conditionals with substantial content, you can use the slot-based approach:

```tsx
import { Show } from '@zayne-labs/ui-react/common';

function OrderDetails({ order }) {
  return (
    <div className="order-container">
      <h1>Order #{order?.id || 'Unknown'}</h1>

      <Show when={order?.status === 'shipped'}>
        <Show.Content>
          <div className="shipped-status">
            <div className="success-icon">✓</div>
            <h2>Your order has shipped!</h2>
            <p>Tracking number: {order.trackingNumber}</p>
            <p>Expected delivery: {order.estimatedDelivery}</p>
            <button>Track Package</button>
          </div>
        </Show.Content>

        <Show.Fallback>
          <div className="order-status">
            <h2>Order Status: {order?.status || 'Unknown'}</h2>
            {order?.status === 'processing' && (
              <p>Your order is being prepared for shipping</p>
            )}
            {order?.status === 'pending' && (
              <p>Your payment is being processed</p>
            )}
          </div>
        </Show.Fallback>
      </Show>
    </div>
  );
}
```

## Using Otherwise Instead of Fallback

For better readability, you can use `Otherwise` as an alias for `Fallback`:

```tsx
import { Show } from '@zayne-labs/ui-react/common';

function WeatherDisplay({ weather }) {
  return (
    <div className="weather-card">
      <Show when={weather}>
        <Show.Content>
          <h2>{weather.location}</h2>
          <p className="temperature">{weather.temperature}°F</p>
          <p>{weather.description}</p>
        </Show.Content>

        <Show.Otherwise>
          <div className="loading-weather">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        </Show.Otherwise>
      </Show>
    </div>
  );
}
```

## Using Render Props

You can access the value of the condition in your render function:

```tsx
import { Show } from '@zayne-labs/ui-react/common';

function UserStatus({ user }) {
  return (
    <div className="user-status">
      <Show when={user?.status}>
        {(status) => (
          <div className={`status-indicator ${status}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {status === 'online' ? 'Online' :
               status === 'away' ? 'Away' :
               status === 'busy' ? 'Do Not Disturb' :
               'Offline'}
            </span>
          </div>
        )}
      </Show>
    </div>
  );
}
```

## TypeScript Usage

The Show component provides full type inference for condition values:

```tsx
import { Show } from '@zayne-labs/ui-react/common';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

function AdminPanel({ user }: { user?: User }) {
  return (
    <div className="admin-panel">
      <Show<User>
        when={user?.role === 'admin' ? user : undefined}
        fallback={<p>You don't have permission to view this page</p>}
      >
        {(adminUser) => (
          // TypeScript knows adminUser is of type User
          <div>
            <h1>Admin Panel</h1>
            <p>Welcome, {adminUser.name}</p>
            <button>View All Users</button>
            <button>Manage Settings</button>
          </div>
        )}
      </Show>
    </div>
  );
}
```

## Common Patterns

### Authentication Check

```tsx
function AuthenticatedRoute({ user, children }) {
  return (
    <Show
      when={user}
      fallback={<Navigate to="/login" replace />}
    >
      {children}
    </Show>
  );
}
```

### Feature Flags

```tsx
function FeatureToggle({ featureName, children }) {
  const features = useFeatureFlags();

  return (
    <Show when={features[featureName]}>
      {children}
    </Show>
  );
}
```

### Loading States

```tsx
function DataDisplay({ data, isLoading, error }) {
  return (
    <Show
      when={!isLoading && !error}
      fallback={
        isLoading ? <LoadingSpinner /> : <ErrorMessage error={error} />
      }
    >
      <DataTable data={data} />
    </Show>
  );
}
```

## API Reference

### Show (Show.Root)

The main component for conditional rendering.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `when` | `false \| TWhen \| null \| undefined` | *Required* | The condition to check |
| `fallback` | `React.ReactNode` | `undefined` | Content to render when condition is falsy |
| `children` | `React.ReactNode \| ((value: TWhen) => React.ReactNode)` | *Required* | Content to render when condition is truthy or render function |

### Show.Content

Explicitly defines the content to show when the condition is truthy.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *Required* | Content to render when condition is truthy |

### Show.Fallback / Show.Otherwise

Explicitly defines the content to show when the condition is falsy. `Otherwise` is an alias for `Fallback`.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *Required* | Content to render when condition is falsy |

## Type Definitions

```tsx
// Main component props
type ShowProps<TWhen> = {
  children: React.ReactNode | ((value: TWhen) => React.ReactNode);
  fallback?: React.ReactNode;
  when: false | TWhen | null | undefined;
};

// Content and Fallback component props
type SlotComponentProps = {
  children: React.ReactNode;
};
```

## Implementation Details

The Show component works by:

1. Evaluating the `when` condition
2. Checking for explicit Content/Fallback slots in children
3. Rendering the appropriate content based on the condition
4. Supporting render props functions with the condition value

The component ensures only one Content and one Fallback component can be used at a time, and prevents using both the `fallback` prop and a `Fallback` component simultaneously.

## Best Practices

1. **Use Explicit Slots** - For complex conditional content, use the `Content`/`Fallback` slots for better readability
2. **Keep It Simple** - For simple conditionals, the basic `when`/`fallback` props are cleaner
3. **Provide Meaningful Fallbacks** - Always consider the empty/loading/error states of your UI
4. **Combine with Other Patterns** - Show works well with other patterns like error boundaries or suspense

## Comparison with Alternatives

| Method | Code Example | Pros | Cons |
|--------|--------------|------|------|
| Ternary | `{condition ? <A /> : <B />}` | Built-in JS, familiar | Can get messy with complex conditions |
| AND operator | `{condition && <A />}` | Simple, built-in JS | No fallback, risks rendering `0` or `false` |
| If-Else | `{(() => {if (x) return <A />; else return <B />})()}` | Flexible | Verbose, uses IIFE |
| Show | `<Show when={condition} fallback={<B />}><A /></Show>` | Declarative, supports slots | Adds a component to the tree |

## Summary

The Show component provides a more declarative and readable way to handle conditional rendering in React. By supporting both simple conditions and slot-based content organization, it adapts to both simple and complex conditional UI requirements while maintaining clean, readable code.
