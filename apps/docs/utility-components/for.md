# For

A utility component for declarative array iteration with built-in empty state handling.

## Overview

The For component provides a declarative and concise way to render lists in React. It abstracts the common pattern of mapping over arrays, handling empty states, and rendering lists with wrappers. This results in cleaner, more readable JSX when working with collections.

## Key Features

- **Declarative Iteration** - Map over arrays using render props or child functions
- **Empty State Handling** - Built-in fallback rendering for empty arrays
- **Number-Based Iteration** - Create lists of a specific length using numbers
- **List Wrappers** - Optional container elements (ul, ol, div, etc.)
- **TypeScript Support** - Full type inference for array items

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
import { For } from '@zayne-labs/ui-react/common/for';

function UserList() {
  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  return (
    <ul className="user-list">
      <For each={users}>
        {(user, index) => (
          <li key={user.id} className="user-item">
            <span>{index + 1}. {user.name}</span>
          </li>
        )}
      </For>
    </ul>
  );
}
```

## With Empty State Fallback

```tsx
import { For } from '@zayne-labs/ui-react/common';

function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      <For
        each={tasks}
        fallback={<li className="empty-state">No tasks available</li>}
      >
        {(task) => (
          <li key={task.id} className="task-item">
            <input type="checkbox" checked={task.completed} />
            <span>{task.title}</span>
          </li>
        )}
      </For>
    </ul>
  );
}
```

## Number-Based Iteration

```tsx
import { For } from '@zayne-labs/ui-react/common';

function Pagination({ pageCount, currentPage, onPageChange }) {
  return (
    <nav aria-label="Pagination">
      <ul className="pagination">
        <For each={pageCount}>
          {(_, index) => {
            const pageNumber = index + 1;
            return (
              <li key={index} className="page-item">
                <button
                  className={pageNumber === currentPage ? 'active' : ''}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            );
          }}
        </For>
      </ul>
    </nav>
  );
}
```

## With List Container (ForList)

The `For` component can automatically create a container element for your list:

```tsx
import { For } from '@zayne-labs/ui-react/common';

function ProductGrid({ products }) {
  return (
    <For
      as="div"
      className="grid grid-cols-3 gap-4"
      each={products}
      fallback={<p>No products found</p>}
    >
      {(product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      )}
    </For>
  );
}
```

## Custom Container Elements

```tsx
import { For } from '@zayne-labs/ui-react/common';

function NavigationMenu({ items }) {
  return (
    <For
      as="nav"
      className="main-navigation"
      each={items}
      fallback={<div>No menu items</div>}
    >
      {(item) => (
        <a key={item.id} href={item.url} className="nav-link">
          {item.icon && <span className="icon">{item.icon}</span>}
          <span>{item.label}</span>
        </a>
      )}
    </For>
  );
}
```

## Alternative Render Prop

```tsx
import { For } from '@zayne-labs/ui-react/common';

function CommentList({ comments }) {
  return (
    <For
      as="ul"
      className="comment-list"
      each={comments}
      fallback={<p>No comments yet</p>}
      render={(comment, index) => (
        <li key={comment.id} className="comment">
          <h4>{comment.author}</h4>
          <p>{comment.text}</p>
          <span className="comment-number">Comment #{index + 1}</span>
        </li>
      )}
    />
  );
}
```

## TypeScript Usage

```tsx
import { For } from '@zayne-labs/ui-react/common';

interface User {
  id: number;
  name: string;
  email: string;
}

function UserDirectory({ users }: { users: User[] }) {
  return (
    <For<User>
      as="ul"
      className="user-directory"
      each={users}
      fallback={<div>No users found</div>}
    >
      {(user) => (
        // TypeScript knows user is of type User
        <li key={user.id}>
          <strong>{user.name}</strong>
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </li>
      )}
    </For>
  );
}
```

## Using Internal getElementList Helper

The component provides a helper function to get different variants of the For component:

```tsx
import { getElementList } from '@zayne-labs/ui-react/common/for';

function CustomList() {
  // Get the base variant (no wrapper)
  const [ForBaseComponent] = getElementList('base');

  // Get the list variant (with wrapper, default)
  const [ForListComponent] = getElementList('withWrapper');

  return (
    <div>
      <h2>With Base Component:</h2>
      <ul>
        <ForBaseComponent each={['apple', 'banana', 'cherry']}>
          {(fruit) => <li key={fruit}>{fruit}</li>}
        </ForBaseComponent>
      </ul>

      <h2>With List Component:</h2>
      <ForListComponent
        as="ol"
        each={['first', 'second', 'third']}
      >
        {(item) => <li key={item}>{item}</li>}
      </ForListComponent>
    </div>
  );
}
```

## API Reference

### For Component

The `For` component is a convenience export that defaults to the `ForList` variant, providing a container element.

### Props

#### Common Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `each` | `TArrayItem[] \| number` | *Required* | Array to iterate over or number of items to create |
| `fallback` | `React.ReactNode` | `undefined` | Content to render when the array is empty |
| `children` | `(item: TArrayItem, index: number, array: TArrayItem[]) => React.ReactNode` | - | Render function for each item |
| `render` | `(item: TArrayItem, index: number, array: TArrayItem[]) => React.ReactNode` | - | Alternative render function |

#### ForList Props (default export)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `'ul'` | The element type to render as the container |
| `className` | `string` | `undefined` | CSS class for the container element |
| `...props` | `any` | - | Additional props passed to the container element |

### ForBase vs ForList

The component has two main variants:

1. **ForBase** - Returns just the mapped items without a container

   ```tsx
   <ForBase each={items}>
     {(item) => <li>{item}</li>}
   </ForBase>
   ```

2. **ForList** - Wraps the mapped items in a container element

   ```tsx
   <ForList as="ul" each={items}>
     {(item) => <li>{item}</li>}
   </ForList>
   ```

The default export is `ForList`, which is more commonly used.

### Type Definitions

```tsx
// Render function type
type RenderPropFn<TArrayItem> = (
  item: TArrayItem,
  index: number,
  array: TArrayItem[]
) => React.ReactNode;

// Base props for both variants
type ForBaseProps<TArrayItem> = {
  each: TArrayItem[] | number;
  fallback?: React.ReactNode;
  children?: RenderPropFn<TArrayItem>;
  render?: RenderPropFn<TArrayItem>;
};

// Additional props for ForList
type ForListProps<TArrayItem> = ForBaseProps<TArrayItem> & {
  as?: React.ElementType;
  className?: string;
  // Plus any props valid for the specified element type
};
```

## Edge Cases and Behavior

1. **Empty Arrays**: When `each` is an empty array, the `fallback` content is rendered.
2. **Null or Undefined**: When `each` is null or undefined, the `fallback` content is rendered.
3. **Zero Number**: When `each` is the number 0, the `fallback` content is rendered.
4. **Number Iteration**: When `each` is a number > 0, it creates an array of indices from 0 to (n-1).

## Implementation Details

The For component works by:

1. Checking if the array/number is empty/zero/null/undefined and rendering fallback if needed
2. Converting numbers to arrays of indices when appropriate
3. Mapping over the array using either the children or render function
4. Optionally wrapping the result in a container element (ForList)

## Accessibility Considerations

When using the For component, keep these accessibility practices in mind:

1. Always include appropriate ARIA attributes on list containers
2. Ensure list items have proper roles if not using semantic HTML
3. Use appropriate heading and text hierarchies within lists
4. Provide clear empty states that communicate the situation to all users

## Summary

The For component provides a more declarative and concise way to handle list rendering in React. By abstracting away common patterns and providing built-in empty state handling, it improves code readability and maintainability when working with collections.
