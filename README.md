<h1 align="center">Zayne UI</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/zayne-labs/ui/refs/heads/main/apps/docs/public/logo.png" alt="Zayne UI Logo" width="30%">
</p>

<p align="center">
  <!-- <a href="https://deno.bundlejs.com/badge?q=@zayne-labs/ui-react&treeshake=%5B*%5D&config=%7B%22compression%22:%7B%22type%22:%22brotli%22,%22quality%22:11%7D%7D"><img src="https://deno.bundlejs.com/badge?q=@zayne-labs/ui-react&treeshake=%5B*%5D&config=%7B%22compression%22:%7B%22type%22:%22brotli%22,%22quality%22:11%7D%7D" alt="bundle size"></a> -->
  <a href="https://www.npmjs.com/package/@zayne-labs/ui-react"><img src="https://img.shields.io/npm/v/@zayne-labs/ui-react?style=flat&color=EFBA5F" alt="npm version"></a>
  <a href="https://github.com/zayne-labs/ui/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/@zayne-labs/ui-react?style=flat&color=EFBA5F" alt="license"></a>
  <a href="https://www.npmjs.com/package/@zayne-labs/ui-react"><img src="https://img.shields.io/npm/dm/@zayne-labs/ui-react?style=flat&color=EFBA5F" alt="downloads per month"></a>
  <a href="https://github.com/zayne-labs/ui/graphs/commit-activity"><img src="https://img.shields.io/github/commit-activity/m/zayne-labs/ui?style=flat&color=EFBA5F" alt="commit activity"></a>
  <a href="https://deepwiki.com/zayne-labs/ui"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

<p align="center">
  <b>Composable, headless UI components and utilities built for flexibility and great developer experience.</b>
</p>

<p align="center">
  <a href="https://zayne-labs-ui.vercel.app"><b>Documentation</b></a> ·
  <a href="https://zayne-labs-ui.vercel.app/docs/getting-started"><b>Getting Started</b></a> ·
  <a href="https://github.com/zayne-labs/ui/tree/main/packages"><b>Packages</b></a>
</p>

---

## Why Zayne UI?

Building UI components from scratch is tedious. Pre-styled component libraries lock you into their design system. Zayne UI gives you the best of both worlds: **fully functional, accessible components that you style however you want.**

**Headless. Composable. TypeScript-first. Zero style opinions.**

```tsx
import { Switch } from "@zayne-labs/ui-react/common/switch";

export default function App() {
	const status = "loading";

	return (
		<Switch.Root value={status}>
			<Switch.Match when="loading">
				<div>Loading...</div>
			</Switch.Match>

			<Switch.Match when="error">
				<div>Something went wrong</div>
			</Switch.Match>

			<Switch.Default>
				<div>Content loaded!</div>
			</Switch.Default>
		</Switch.Root>
	);
}
```

## Features

### Headless Components

Bring your own styles. No CSS to override, no design tokens to fight with.

```tsx
import { Card } from "@zayne-labs/ui-react/ui/card";

<Card.Root className="flex flex-col gap-4">
	<Card.Header>
		<Card.Title>Your Title</Card.Title>
	</Card.Header>
	<Card.Content>Your content here</Card.Content>
</Card.Root>;
```

### Composable API

Build complex UIs from simple, reusable pieces.

```tsx
import { For } from "@zayne-labs/ui-react/common/for";
import { Show } from "@zayne-labs/ui-react/common/show";

<For each={users} fallback={<p>No users found</p>}>
	{(user) => (
		<div key={user.id}>
			<Show when={user.isActive} fallback={<span>Inactive</span>}>
				<span>Active</span>
			</Show>
			{user.name}
		</div>
	)}
</For>;
```

### TypeScript-First

Full type safety and inference everywhere.

```tsx
import { Await } from "@zayne-labs/ui-react/common/await";

// Fully typed data and error
<Await promise={fetchUser()}>
	{({ data, error }) => (
		<Show when={error} fallback={<div>{data.name}</div>}>
			<div>Error: {error.message}</div>
		</Show>
	)}
</Await>;
```

### Declarative Patterns

Write UI logic the way you think about it.

```tsx
import { Switch } from "@zayne-labs/ui-react/common/switch";

<Switch.Root value={userRole}>
	<Switch.Match when="admin">
		<AdminDashboard />
	</Switch.Match>

	<Switch.Match when="user">
		<UserDashboard />
	</Switch.Match>

	<Switch.Default>
		<GuestView />
	</Switch.Default>
</Switch.Root>;
```

### Error Boundaries

Graceful error handling built-in.

```tsx
import { ErrorBoundary } from "@zayne-labs/ui-react/common/error-boundary";

<ErrorBoundary fallback={(error) => <div>Something went wrong: {error.message}</div>}>
	<YourComponent />
</ErrorBoundary>;
```

### Portal Support

Render content anywhere in the DOM tree.

```tsx
import { Teleport } from "@zayne-labs/ui-react/common/teleport";

<Teleport to="body">
	<Modal />
</Teleport>;
```

And so much more

See the [full documentation](https://zayne-labs-ui.vercel.app/docs) for the complete list of components and features.

## Components

### UI Components

Headless UI components for common interface patterns:

- **Card** - Composable card layouts with header, content, and footer sections
- **Carousel** - Customizable slideshow component with navigation controls
- **DragScroll** - Add drag-to-scroll behavior to any container
- **DropZone** - File upload with drag-and-drop support and validation
- **Form** - Powerful form handling with validation (wrapper around react-hook-form)

### Common Components

Utility components for declarative UI patterns:

- **Await** - Handle async states declaratively with loading, error, and success states
- **ClientGate** - Client-side only rendering guard for SSR apps
- **ErrorBoundary** - Graceful error handling with fallback UI
- **For** - List rendering with empty states and keyed items
- **Presence** - Animation presence detection for enter/exit transitions
- **Show** - Conditional rendering with fallback support
- **Slot** - Component composition with slots for flexible layouts
- **SuspenseWithBoundary** - Combined Suspense and ErrorBoundary for async components
- **Switch** - Pattern matching for conditional rendering with multiple cases
- **Teleport** - Portal-based content teleportation to any DOM node

## Installation

```bash
npm install @zayne-labs/ui-react
```

```tsx
import { For } from "@zayne-labs/ui-react/common/for";
import { Switch } from "@zayne-labs/ui-react/common/switch";
import { Card } from "@zayne-labs/ui-react/ui/card";

// Declarative conditional rendering
<Switch.Root value={status}>
	<Switch.Match when="loading">Loading...</Switch.Match>
	<Switch.Match when="error">Error occurred</Switch.Match>
	<Switch.Default>Content loaded!</Switch.Default>
</Switch.Root>;

// List rendering with fallback
<For each={users} fallback={<p>No users found</p>}>
	{(user) => <div key={user.id}>{user.name}</div>}
</For>;

// Composable card component
<Card.Root>
	<Card.Header>
		<Card.Title>Card Title</Card.Title>
	</Card.Header>
	<Card.Content>Your content here</Card.Content>
</Card.Root>;
```

### CDN

```html
<script type="module">
	import { Switch } from "https://esm.run/@zayne-labs/ui-react@latest/common/switch";
</script>
```

## What makes it worth considering?

- **Headless** - Complete styling freedom, no CSS to override
- **TypeScript-first** - Full type inference and safety everywhere
- **Composable** - Build complex UIs from simple, reusable pieces
- **Tree-shakeable** - Only bundle what you use
- **Framework-ready** - React now, more frameworks coming soon
- **Zero dependencies** - Built on top of [@zayne-labs/toolkit](https://github.com/zayne-labs/toolkit)

## Packages

### @zayne-labs/ui-react

React implementation of the UI library. More framework adapters coming in the future.

## Development

This is a monorepo managed with pnpm and Turborepo.

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev:react

# Run docs site
pnpm dev:docs

# Run dev playground
pnpm dev:dev

# Lint
pnpm lint:eslint

# Type check
pnpm lint:type-check

# Format code
pnpm lint:format
```

## Contributing

Contributions are welcome! Check out the [contributing guidelines](https://github.com/zayne-labs/contribute.git) to get started.

## License

MIT © [Ryan Zayne](https://github.com/ryan-zayne)
