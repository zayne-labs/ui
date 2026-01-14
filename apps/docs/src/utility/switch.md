# Switch

A utility component for pattern matching and conditional rendering.

## Overview

The Switch component provides a more declarative way to handle complex conditional rendering in React. Inspired by traditional switch-case statements and the [Switch](https://docs.solidjs.com/reference/components/switch-and-match) component from SolidJS.

## Usage

Switch can be used in two ways:

### Value Matching

Like `switch(value)` in JavaScript - match a specific value against cases:

```tsx
import { Switch } from "@zayne-labs/ui-react/common/switch";

export function UserRole({ role }) {
	return (
		<Switch.Root value={role}>
			<Switch.Match when="admin">
				<p>Admin Panel</p>
			</Switch.Match>

			<Switch.Match when="moderator">
				<p>Mod Tools</p>
			</Switch.Match>

			<Switch.Default>
				<p>Welcome User</p>
			</Switch.Default>
		</Switch.Root>
	);
}
```

### Conditional Matching

When no `value` prop is provided, Switch evaluates each `when` condition in order, similar to `switch(true)` in JavaScript:

```tsx
import { Switch } from "@zayne-labs/ui-react/common/switch";

export function Counter({ count }) {
	return (
		<Switch.Root>
			<Switch.Match when={count > 100}>
				<p>Too many!</p>
			</Switch.Match>

			<Switch.Match when={count > 0}>
				<p>{count} items</p>
			</Switch.Match>

			<Switch.Default>
				<p>No items</p>
			</Switch.Default>
		</Switch.Root>
	);
}
```

In this mode, the first `when` condition that evaluates to `true` will be rendered (internally equivalent to using `value={true}`). This is useful for handling multiple conditions in a declarative way, similar to if-else chains but more readable.

## Component API

### Switch.Root

- `value`: Value to match against cases (optional)
- `children`: One or more Switch.Match components

### Switch.Match

- `when`: Value to match against condition, or a boolean expression if no condition is provided
- `children`: Content to render, or a function for type narrowing

### Switch.Default

- `children`: Content to render when no cases matches found

## Type Definitions

```tsx
// Main Switch component props
type SwitchProps = {
	children: React.ReactElement<SwitchMatchProps> | React.ReactElement<SwitchMatchProps>[];
	value?: unknown;
};

// Match component props
type SwitchMatchProps<TWhen = unknown> = {
	children: React.ReactNode | ((value: TWhen) => React.ReactNode);
	when: false | TWhen | null | undefined;
};

// Default component props
type SwitchDefaultProps = {
	children: React.ReactNode;
};
```

## Implementation

The Switch component:

1. Matches `value` against each `when` prop
2. Renders the first matching case
3. Falls back to `Default` if no matches
4. Supports render props for accessing matched values

## Best Practices

1. Put specific matches before general ones
2. Always provide a Default case
3. Keep render functions pure
4. Use TypeScript for type safety

## Alternatives

| Method  | Example                     | When to Use         |
| ------- | --------------------------- | ------------------- |
| If/Else | `if (x) return <A/>`        | Simple conditions   |
| Ternary | `x ? <A/> : <B/>`           | Single condition    |
| Switch  | `<Switch><Match when={x}/>` | Multiple conditions |
