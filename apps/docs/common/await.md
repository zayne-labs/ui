# Await

A utility component for declaratively handling async operations with built-in Suspense and error boundary support.

## Overview

The Await component provides a straightforward approach to handling asynchronous operations in React applications. It wraps React's `use` hook along with Suspense and ErrorBoundary functionality in a declarative API, making it easy to handle loading states and errors while waiting for promises to resolve.

## Key Features

- **Built-in Suspense** - Automatic loading states while promises resolve
- **Optional Error Boundary** - Configurable error handling with `withErrorBoundary` prop
- **Declarative API** - Simple prop-based approach to async operations
- **Render Props Pattern** - Flexible rendering of resolved promise values
- **Slot Component Support** - Pass resolved values to child components via `asChild`
- **TypeScript Support** - Full type inference for promise values

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
import { Await } from '@zayne-labs/ui-react/common/await';

function UserProfile({ userId }) {
  const userPromise = fetchUser(userId);

  return (
    <Await
      promise={userPromise}
      fallback={<div>Loading user data...</div>}
    >
      {(user) => (
        <div>
          <h1>{user.name}</h1>
          <p>Email: {user.email}</p>
        </div>
      )}
    </Await>
  );
}

// Fetch function that returns a promise
function fetchUser(id) {
  return fetch(`/api/users/${id}`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    });
}
```

## Error Handling

```tsx
import { Await } from '@zayne-labs/ui-react/common/await';

function ProductDetails({ productId }) {
  const productPromise = fetchProduct(productId);

  return (
    <Await
      promise={productPromise}
      fallback={<div>Loading product...</div>}
      errorFallback={({ error }) => (
        <div className="error-container">
          <h2>Error Loading Product</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      )}
    >
      {(product) => (
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="price">${product.price}</p>
          <div className="description">{product.description}</div>
        </div>
      )}
    </Await>
  );
}
```

## Server Component Support

When using Await in a Server Component, you can't use render props since they're not supported in RSC. Instead, use the `asChild` prop to pass the resolved value to a the child component:

```tsx
import { Await } from '@zayne-labs/ui-react/common/await';
import { UserCard } from './components/UserCard';

function UserDisplay({ userId }) {
  const userPromise = fetchUser(userId);

  return (
    <Await
      promise={userPromise}
      fallback={<div>Loading...</div>}
      asChild
    >
      <UserCard />
    </Await>
  );
}

// In UserCard.jsx
function UserCard({ result }) {
  // result contains the resolved promise value
  const user = result;

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

## TypeScript Support

The Await component provides full type inference for promise values:

```tsx
import { Await } from '@zayne-labs/ui-react/common';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

function UserProfile({ userId }: { userId: string }) {
  const userPromise: Promise<User> = fetchUser(userId);

  return (
    <Await<User>
      promise={userPromise}
      fallback={<div>Loading...</div>}
    >
      {(user) => {
        // user is typed as User
        return (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        );
      }}
    </Await>
  );
}
```

## Disabling Error Boundary

In some cases, you might want to handle errors at a higher level or differently:

```tsx
import { Await } from '@zayne-labs/ui-react/common';

function DataComponent() {
  const dataPromise = fetchData();

  return (
    <Await
      promise={dataPromise}
      fallback={<div>Loading...</div>}
      withErrorBoundary={false} // Disable built-in error boundary
    >
      {(data) => (
        <div>{data.content}</div>
      )}
    </Await>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `promise` | `Promise<TValue>` | *Required* | The promise to resolve |
| `fallback` | `React.ReactNode` | `undefined` | Content to show while the promise is pending |
| `errorFallback` | `React.ReactNode \| ((props: { error: Error; reset: () => void }) => React.ReactNode)` | `undefined` | UI to show when an error occurs |
| `withErrorBoundary` | `boolean` | `true` | Whether to wrap the component in an error boundary |
| `asChild` | `boolean` | `false` | Whether to merge props onto the child element |
| `children` | `React.ReactNode \| ((result: TValue) => React.ReactNode)` | `undefined` | Child elements or render function |
| `render` | `(result: TValue) => React.ReactNode` | `undefined` | Alternative render function |

### Render Props Function

When using the render props pattern, your function will receive the resolved value of the promise:

```tsx
<Await promise={myPromise}>
  {(result) => {
    // result is the resolved value of myPromise
    return <div>{result}</div>;
  }}
</Await>
```

### Type Generics

The Await component accepts a type parameter that describes the resolved value of the promise:

```tsx
<Await<User> promise={fetchUser(1)}>
  {(user) => {
    // user is typed as User
    return <div>{user.name}</div>;
  }}
</Await>
```

## Accessibility Considerations

When using the Await component, consider these accessibility enhancements:

1. **Focus Management**: After content loads, consider where focus should be set for screen reader users
2. **Loading Announcements**: Add `aria-live` regions to announce loading state changes
3. **Error Clarity**: Ensure error messages are clear and provide actionable resolution steps

## Best Practices

1. **Preload Data**: When possible, start data fetching before rendering the component
2. **Descriptive Loading States**: Provide informative loading states rather than generic spinners
3. **Error Recovery**: Always include retry mechanisms in your error fallback components
4. **Realistic Fallbacks**: Match the size and layout of fallbacks to the expected content to prevent layout shifts

## Under the Hood

The Await component works by:

1. Combining React's built-in `Suspense` and `ErrorBoundary` components
2. Using React's `use` hook to unwrap the promise value
3. Providing a simple, declarative API over these foundations
4. Supporting both render props and slot patterns for flexibility

This approach leverages React's Concurrent Features while maintaining a simple developer experience.
