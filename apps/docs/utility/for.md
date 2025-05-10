# For

A React component that makes working with lists simpler. It handles array iteration, empty states, and list containers without the usual boilerplate.

## Overview

Instead of writing `.map()` everywhere or checking for empty arrays, use the For component to write cleaner code. It handles the common patterns so you can focus on your data.

## Features

- **Handle Empty States** - Show fallback content for empty arrays, null, undefined, or zero
- **Array and Number Support** - Work with arrays or generate sequences from numbers
- **Flexible Rendering** - Use either children or render prop pattern
- **Container Elements** - Optional wrapper with polymorphic `as` prop
- **TypeScript Ready** - Full type inference and polymorphic components

## Install

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Basic Example

Here's how to render a list of items:

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
        {(user, index, array) => (
          <li key={user.id}>
            {user.name} ({index + 1} of {array.length})
          </li>
        )}
      </For>
    </ul>
  );
}
```

The render function receives the current item, index, and the full array, just like `map`

## Empty States

The For component handles null, undefined, empty arrays, and zero numbers gracefully:

```tsx
import { For } from '@zayne-labs/ui-react/common/for';

function TaskList({ tasks }) {
  return (
    <ul className="task-list">
      <For
        each={tasks}
        fallback={<li>No tasks available</li>}
      >
        {(task) => (
          <li key={task.id}>
            <span>{task.title}</span>
          </li>
        )}
      </For>
    </ul>
  );
}

// These all show the fallback:
TaskList({ tasks: [] });
TaskList({ tasks: null });
TaskList({ tasks: undefined });
```

## Number Sequences

Pass a number to generate a sequence of indices:

```tsx
import { For } from '@zayne-labs/ui-react/common/for';

function Pagination({ pageCount, currentPage, onPageChange }) {
  return (
    <nav>
      <ul>
        <For each={pageCount}>
          {(index, stillIndex, array) => (
            <li key={index}>
              <button
                disabled={index === currentPage}
                onClick={() => onPageChange(index)}
              >
                Page {index + 1} of {array.length}
              </button>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
}

// Creates sequence [0, 1, 2, 3, 4]
Pagination({ pageCount: 5 });

// Shows fallback if provided
Pagination({ pageCount: 0 });
```

## Container Components

The For component comes in two variants:

### Basic For

The basic For component lets you control the container element:

```tsx
import { For } from '@zayne-labs/ui-react/common/for';

function ItemList() {
  return (
    <ul>
      <For each={['item1', 'item2', 'item3']}>
        {(item, index, array) => (
          <li key={index}>{item}</li>
        )}
      </For>
    </ul>
  );
}
```

### ForWithWrapper

ForWithWrapper creates the container element for you:

```tsx
import { ForWithWrapper } from '@zayne-labs/ui-react/common/for';

function ItemList() {
  // Uses <ul> by default
  return (
    <ForWithWrapper
      each={['item1', 'item2', 'item3']}
      className="item-list"
    >
      {(item) => <li key={item}>{item}</li>}
    </ForWithWrapper>
  );
}

// Can use any element type
function NavMenu() {
  return (
    <ForWithWrapper
      as="nav"
      className="nav-menu"
      each={['Home', 'About', 'Contact']}
    >
      {(item) => (
        <a key={item} href={`/${item.toLowerCase()}`}>
          {item}
        </a>
      )}
    </ForWithWrapper>
  );
}
```

The ForWithWrapper component:

- Uses `<ul>` as the default container
- Accepts any element type via `as` prop
- Forwards the ref and other props to the container
- Supports all For component features (arrays, numbers, fallback)

### Types

```tsx
// Render function type
type RenderPropFn<T> = (
  item: T,
  index: number,
  array: T[]
) => React.ReactNode;

// Base For component props
type ForProps<T> = {
  each: T[];             // Array to iterate
  fallback?: ReactNode;  // Content for empty states
} & {
  children?: RenderPropFn<T>;  // Children render function
  render?: RenderPropFn<T>;    // Alternative render prop
};

// Number-based For props
type ForPropsWithNumber<T> = {
  each: number;          // Number for sequence generation
  fallback?: ReactNode;  // Content for empty states
} & {
  children?: RenderPropFn<T>;  // Children render function
  render?: RenderPropFn<T>;    // Alternative render prop
};

// ForWithWrapper props
type ForListProps<T> = {
  className?: string;    // Container class name
} & (ForProps<T> | ForPropsWithNumber<T>);

// Final ForWithWrapper props with polymorphic as prop
type ForWrapperProps<T, E extends ElementType = 'ul'> =
  PolymorphicProps<E, ForListProps<T>>;
```

## Behavior

The For component:

1. Shows fallback content when:
   - The input is null or undefined
   - A number input is 0
   - An array input is empty

2. For array inputs:
   - Maps over the array using either children or render function
   - Provides item, index, and array to the render function

3. For number inputs:
   - Creates a sequence [0, 1, ..., N-1] for input N
   - Treats the sequence elements as items in the render function

4. With ForWithWrapper:
   - Renders a `<ul>` by default
   - Accepts any element type via `as` prop
   - Forwards additional props to the container element
