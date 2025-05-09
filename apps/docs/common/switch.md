# Switch

A utility component for declarative pattern matching and conditional rendering.

## Overview

The Switch component provides a cleaner, more declarative way to handle complex conditional rendering in React. Inspired by traditional switch-case statements in programming languages and the [Switch](https://docs.solidjs.com/reference/components/switch-and-match) component from SolidJS, it allows you to match a condition against multiple possible values and render the appropriate UI for the matching case.

## Key Features

- **Pattern Matching** - Match values against conditions more cleanly than nested ternaries
- **Default Case Handling** - Fallback UI when no conditions match
- **Compound Component API** - Clear, declarative syntax with Match and Default components
- **Render Props Support** - Access matched values in the render function
- **TypeScript Integration** - Full type safety for condition values

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
import { Switch } from '@zayne-labs/ui-react/common/switch';

function StatusIndicator({ status }) {
  return (
    <div className="status-indicator">
      <Switch condition={status}>
        <Switch.Match when="loading">
          <div className="loading">Loading...</div>
        </Switch.Match>

        <Switch.Match when="error">
          <div className="error">Error occurred!</div>
        </Switch.Match>

        <Switch.Match when="success">
          <div className="success">Success!</div>
        </Switch.Match>

        <Switch.Default>
          <div className="idle">Idle</div>
        </Switch.Default>
      </Switch>
    </div>
  );
}
```

## With Multiple Conditions

```tsx
import { Switch } from '@zayne-labs/ui-react/common';

function UserRolePermissions({ role }) {
  return (
    <div className="permissions">
      <h2>Your Permissions</h2>

      <Switch condition={role}>
        <Switch.Match when="admin">
          <div className="admin-permissions">
            <p>You have full administrative access</p>
            <ul>
              <li>Manage users</li>
              <li>Configure system settings</li>
              <li>View all reports</li>
              <li>Delete content</li>
            </ul>
          </div>
        </Switch.Match>

        <Switch.Match when="moderator">
          <div className="moderator-permissions">
            <p>You have moderator access</p>
            <ul>
              <li>Review content</li>
              <li>Hide inappropriate content</li>
              <li>Message users</li>
            </ul>
          </div>
        </Switch.Match>

        <Switch.Match when="editor">
          <div className="editor-permissions">
            <p>You have editor access</p>
            <ul>
              <li>Create new content</li>
              <li>Edit existing content</li>
              <li>Publish content</li>
            </ul>
          </div>
        </Switch.Match>

        <Switch.Default>
          <div className="user-permissions">
            <p>You have basic user access</p>
            <ul>
              <li>View content</li>
              <li>Comment on posts</li>
              <li>Edit your profile</li>
            </ul>
          </div>
        </Switch.Default>
      </Switch>
    </div>
  );
}
```

## Using Render Props with Condition Values

```tsx
import { Switch } from '@zayne-labs/ui-react/common';

function NotificationBadge({ count }) {
  return (
    <Switch condition={count}>
      <Switch.Match when={0}>
        <span className="no-notifications">No new notifications</span>
      </Switch.Match>

      <Switch.Match when={1}>
        <span className="one-notification">You have 1 new notification</span>
      </Switch.Match>

      <Switch.Match when={(n) => n > 1 && n < 10}>
        {(value) => (
          <span className="few-notifications">
            You have {value} new notifications
          </span>
        )}
      </Switch.Match>

      <Switch.Match when={(n) => n >= 10}>
        {(value) => (
          <span className="many-notifications">
            You have {value} new notifications!
          </span>
        )}
      </Switch.Match>

      <Switch.Default>
        <span className="unknown">Notification status unknown</span>
      </Switch.Default>
    </Switch>
  );
}
```

## State Machines

The Switch component works great with finite state machines:

```tsx
import { Switch } from '@zayne-labs/ui-react/common';
import { useState } from 'react';

function OrderProcess() {
  const [orderState, setOrderState] = useState('cart');

  const proceedToNext = (nextState) => () => {
    setOrderState(nextState);
  };

  return (
    <div className="order-process">
      <div className="state-indicator">
        Current state: <strong>{orderState}</strong>
      </div>

      <Switch condition={orderState}>
        <Switch.Match when="cart">
          <div className="cart-state">
            <h2>Your Shopping Cart</h2>
            <div className="cart-items">
              {/* Cart items */}
            </div>
            <button onClick={proceedToNext('checkout')}>
              Proceed to Checkout
            </button>
          </div>
        </Switch.Match>

        <Switch.Match when="checkout">
          <div className="checkout-state">
            <h2>Checkout</h2>
            <form className="checkout-form">
              {/* Checkout form fields */}
            </form>
            <div className="actions">
              <button onClick={proceedToNext('cart')}>
                Back to Cart
              </button>
              <button onClick={proceedToNext('payment')}>
                Proceed to Payment
              </button>
            </div>
          </div>
        </Switch.Match>

        <Switch.Match when="payment">
          <div className="payment-state">
            <h2>Payment</h2>
            <div className="payment-methods">
              {/* Payment methods */}
            </div>
            <div className="actions">
              <button onClick={proceedToNext('checkout')}>
                Back to Checkout
              </button>
              <button onClick={proceedToNext('confirmation')}>
                Place Order
              </button>
            </div>
          </div>
        </Switch.Match>

        <Switch.Match when="confirmation">
          <div className="confirmation-state">
            <h2>Order Confirmation</h2>
            <p>Your order has been placed successfully!</p>
            <button onClick={proceedToNext('cart')}>
              Start New Order
            </button>
          </div>
        </Switch.Match>
      </Switch>
    </div>
  );
}
```

## TypeScript Support

The Switch component provides full type safety with generics:

```tsx
import { Switch } from '@zayne-labs/ui-react/common';

// Define union type for possible statuses
type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface RequestStatusProps {
  status: RequestStatus;
  data?: any;
  error?: Error;
}

function RequestStatusIndicator({ status, data, error }: RequestStatusProps) {
  return (
    <Switch<RequestStatus> condition={status}>
      <Switch.Match when="idle">
        <div>Ready to fetch data</div>
      </Switch.Match>

      <Switch.Match when="loading">
        <div className="loading-spinner">Loading...</div>
      </Switch.Match>

      <Switch.Match when="success">
        {/* TypeScript knows we're in success state */}
        <div className="success-message">
          <h3>Success!</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </Switch.Match>

      <Switch.Match when="error">
        {/* TypeScript knows we're in error state */}
        <div className="error-message">
          <h3>Error</h3>
          <p>{error?.message}</p>
        </div>
      </Switch.Match>
    </Switch>
  );
}
```

## Nested Switch Components

```tsx
import { Switch } from '@zayne-labs/ui-react/common';

function UserInterface({ user, view }) {
  return (
    <Switch condition={user ? 'authenticated' : 'unauthenticated'}>
      <Switch.Match when="authenticated">
        <div className="authenticated-ui">
          <h1>Welcome, {user.name}</h1>

          <Switch condition={view}>
            <Switch.Match when="dashboard">
              <DashboardView user={user} />
            </Switch.Match>

            <Switch.Match when="profile">
              <ProfileView user={user} />
            </Switch.Match>

            <Switch.Match when="settings">
              <SettingsView user={user} />
            </Switch.Match>

            <Switch.Default>
              <DashboardView user={user} />
            </Switch.Default>
          </Switch>
        </div>
      </Switch.Match>

      <Switch.Match when="unauthenticated">
        <div className="login-ui">
          <h1>Please log in</h1>
          <LoginForm />
        </div>
      </Switch.Match>
    </Switch>
  );
}
```

## API Reference

### Switch (Switch.Root)

The main component that evaluates conditions and renders the matching case.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `condition` | `any` | `undefined` | Value to match against case conditions |
| `children` | `React.ReactElement<SwitchMatchProps> \| React.ReactElement<SwitchMatchProps>[]` | *Required* | One or more Switch.Match components |

### Switch.Match

Component that defines a condition to match against.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `when` | `any` | *Required* | Value or predicate to match against the condition |
| `children` | `React.ReactNode \| ((value: any) => React.ReactNode)` | *Required* | Content to render when the condition matches, or render function |

### Switch.Default

Component that defines the default case when no matches are found.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | *Required* | Content to render when no Match conditions match |

## Type Definitions

```tsx
// Main Switch component props
type SwitchProps<TCondition> = {
  children: React.ReactElement<SwitchMatchProps> | React.ReactElement<SwitchMatchProps>[];
  condition?: TCondition;
};

// Match component props
type SwitchMatchProps<TWhen = unknown> = {
  children: React.ReactNode | ((value: TWhen) => React.ReactNode);
  when: TWhen | null | undefined | false;
};

// Default component props
type SwitchDefaultProps = {
  children: React.ReactNode;
};
```

## Implementation Details

The Switch component works by:

1. Evaluating the `condition` prop against each `Switch.Match` component's `when` prop
2. Rendering the first matching child component
3. If no matches are found, rendering the `Switch.Default` component (if provided)
4. Supporting render props to access the matched value

The implementation handles both direct value comparisons and predicate functions for more complex conditions.

## Best Practices

1. **Order Matters** - Place more specific matches before general ones
2. **Always Include Default** - Provide a Default case for better predictability
3. **Keep It Pure** - Avoid side effects in render functions
4. **Use TypeScript** - Add type constraints to ensure all cases are covered
5. **Separate UI Logic** - Extract complex conditions into separate functions or custom hooks

## Comparison with Alternatives

| Method | Code Example | Pros | Cons |
|--------|--------------|------|------|
| If-Else Chain | `if (x === 'a') return <A />; else if...` | Simple | Verbose, harder to read with many conditions |
| Ternary Nesting | `condition === 'a' ? <A /> : condition === 'b' ? <B /> : <C />` | No extra components | Gets messy quickly |
| Object Mapping | `const map = { a: <A />, b: <B /> }; return map[condition] ?? <Default />` | Concise | Limited to direct value matches |
| Switch | `<Switch condition={x}><Switch.Match when="a"><A /></Switch.Match>...</Switch>` | Declarative, flexible | Adds components to the tree |

## Summary

The Switch component provides a declarative, pattern-matching approach to conditional rendering in React. It simplifies complex conditional logic, improves readability, and offers a more elegant solution than nested ternaries or if-else chains. With its compound component pattern and render props support, it's a powerful tool for managing UI states in React applications.
