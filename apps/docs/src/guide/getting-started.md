# Getting Started

Get up and running with @zayne-labs/ui in minutes.

## Installation

```bash
pnpm add @zayne-labs/ui-react
# or
npm install @zayne-labs/ui-react
# or
yarn add @zayne-labs/ui-react
```

## Quick Start

Import and use components directly:

```tsx
import { Card } from "@zayne-labs/ui-react/ui/card";
import { Switch } from "@zayne-labs/ui-react/common/switch";

function App() {
	const status = "success";

	return (
		<Card.Root className="mx-auto max-w-md rounded-lg border p-6">
			<Card.Header>
				<Card.Title>Welcome to Zayne UI</Card.Title>
				<Card.Description>Headless components with minimal styling</Card.Description>
			</Card.Header>

			<Card.Content>
				<Switch.Root value={status}>
					<Switch.Match when="loading">
						<div className="text-blue-600">⏳ Loading...</div>
					</Switch.Match>

					<Switch.Match when="success">
						<div className="text-green-600">✅ Ready to go!</div>
					</Switch.Match>

					<Switch.Match when="error">
						<div className="text-red-600">❌ Something went wrong</div>
					</Switch.Match>

					<Switch.Default>
						<div className="text-gray-600">Unknown status</div>
					</Switch.Default>
				</Switch.Root>
			</Card.Content>
		</Card.Root>
	);
}
```

## Styling

### With Tailwind CSS

Components work great with Tailwind classes (as shown above). Import the base styles:

```css
/* styles/globals.css */
@import "tailwindcss";
@import "@zayne-labs/ui-react/style.css";
```

### Without Tailwind CSS

Use data attributes to target specific parts:

```css
/* styles/globals.css */
@import "@zayne-labs/ui-react/style.css";

[data-scope="card"][data-part="root"] {
	border: 1px solid #e2e8f0;
	border-radius: 0.5rem;
	padding: 1.5rem;
}

[data-scope="form"][data-part="input"] {
	padding: 0.5rem 0.75rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
}
```

## Key Concepts

### Component Structure

Most components follow a compound pattern:

```tsx
// UI Components (complex, interactive)
<Form.Root>
  <Form.Field>
    <Form.Label>Email</Form.Label>
    <Form.Input type="email" />
    <Form.ErrorMessage />
  </Form.Field>
</Form.Root>

// Utility Components (simple, declarative)
<Show.Root when={user}>
  <UserProfile user={user} />
  <Show.Fallback>
    <LoginForm />
  </Show.Fallback>
</Show.Root>
```

### Data Attributes

All components provide consistent data attributes for styling:

- `data-scope` - Component family (card, form, switch)
- `data-part` - Element within component (root, header, input)
- `data-*` - State attributes (invalid, disabled, loading)

## Next Steps

- **[UI Components](/ui)** - Interactive components like forms, file uploads, carousels
- **[Utility Components](/utility)** - Declarative helpers like Switch, Show, For
- **[Form Guide](/ui/form)** - Complete form handling with validation
- **[Card Styling](/ui/card#styling)** - Advanced styling patterns and examples

## TypeScript

Full TypeScript support is included out of the box. Components provide excellent type inference:

```tsx
import { useForm } from "react-hook-form";
import { Form } from "@zayne-labs/ui-react/ui/form";

type LoginData = {
	email: string;
	password: string;
};

function LoginForm() {
	const form = useForm<LoginData>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		// data is fully typed as LoginData
		console.log(data.email, data.password);
	});

	return (
		<Form.Root methods={form} onSubmit={onSubmit}>
			{/* ✅ Type-safe field names */}
			<Form.Field control={form.control} name="email">
				<Form.Label>Email</Form.Label>
				<Form.Input type="email" />
				<Form.ErrorMessage />
			</Form.Field>

			<Form.Field control={form.control} name="password">
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" />
				<Form.ErrorMessage />
			</Form.Field>

			<Form.Submit>Sign In</Form.Submit>
		</Form.Root>
	);
}
```
