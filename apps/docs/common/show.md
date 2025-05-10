# Show

A utility component for conditional rendering with fallback support.

## Overview

The Show component provides a concise, readable way to handle conditional rendering in React. Inspired by the [Show](https://docs.solidjs.com/reference/components/show) component from SolidJS, it offers a more declarative API for managing UI states and provides built-in fallback handling as opposed ghastly nested ternary operators or complex logical AND patterns.

## Key Features

- **Declarative Syntax** - Clean, readable way to handle conditional rendering
- **Fallback Support** - Optional fallback content when condition is false
- **Simple API** - Just `when` and optional `fallback` props
- **Type Safety** - Full TypeScript support for props and children
- **Zero Dependencies** - Lightweight implementation with no external dependencies

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

## Using Fallback Slot

The Show component supports a Fallback slot for explicit fallback content:

```tsx
import { Show } from '@zayne-labs/ui-react/common';

function OrderDetails({ order }) {
  return (
    <div className="order-container">
      <h1>Order Status</h1>

      <Show when={order?.status === 'shipped'}>
        <div className="shipped-status">
          <h2>Your order has shipped!</h2>
          <p>Tracking number: {order.trackingNumber}</p>
        </div>

        <Show.Fallback>
          <p>Order has not shipped yet</p>
        </Show.Fallback>
      </Show>
    </div>
  );
}
```

## Using Props

Alternatively, you can use the `fallback` prop for simpler cases:

```tsx
import { Show } from '@zayne-labs/ui-react/common';

function UserStatus({ user }) {
  return (
    <div className="user-status">
      <Show
        when={user?.isOnline}
        fallback={<p>User is offline</p>}
      >
        <p>User is online</p>
      </Show>
    </div>
  );
}
```

## Using Otherwise

For more natural reading in some cases, you can use `Show.Otherwise` as an alias for `Show.Fallback`:

```tsx
import { Show } from '@zayne-labs/ui-react/common';

function LoadingState({ isLoading, data }) {
  return (
    <Show when={isLoading}>
      <div className="spinner">Loading...</div>
      
      <Show.Otherwise>
        <div className="data">{data}</div>
      </Show.Otherwise>
    </Show>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `when` | `false \| TWhen \| null \| undefined` | *Required* | The condition that determines whether to show the children |
| `fallback` | `React.ReactNode` | `undefined` | Content to show when the condition is false |
| `children` | `React.ReactNode \| ((value: TWhen) => React.ReactNode)` | *Required* | Content to show when the condition is true |

### Show.Fallback Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `React.ReactNode` | Content to show when the condition is false |

> **Note:** `Show.Otherwise` is provided as an alias for `Show.Fallback` for more natural reading in some cases.

## Implementation Details

The Show component can provide fallback content in two ways:

1. Using the `fallback` prop:

```tsx
function Show({ when, fallback, children }) {
  const resolvedChildren = isFunction(children) ? children(when) : children;
  return when ? resolvedChildren : fallback;
}
```

1. Using the Show.Fallback slot:

```tsx
function Show({ when, children }) {
  const { regularChildren, slots: [_, fallbackSlot] } = getMultipleSlots(
    children,
    [null, ShowFallback]
  );
  return when ? regularChildren : fallbackSlot;
}
```

## Best Practices

1. **Keep It Simple** - Use the basic `when`/`fallback` props for clear conditional rendering
2. **Provide Meaningful Fallbacks** - Always consider the empty/loading/error states of your UI
3. **Type Safety** - Take advantage of TypeScript's type inference for better DX

## Comparison with Alternatives

| Method | Code Example | Pros | Cons |
|--------|--------------|------|------|
| Ternary | `{condition ? <A /> : <B />}` | Built-in JS, familiar | Can get messy with complex conditions |
| AND operator | `{condition && <A />}` | Simple, built-in JS | No fallback, risks rendering `0` or `false` |
| Show | `<Show when={condition} fallback={<B />}><A /></Show>` | Declarative, supports fallbacks | Adds a component to the tree |

## Summary

The Show component provides a simple, declarative way to handle conditional rendering in React. Its clean API with `when` and `fallback` props makes it easy to create maintainable conditional UI logic.
