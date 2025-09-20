# Form

A comprehensive form component built on top of react-hook-form with a compound component API.

## Overview

The Form component provides a powerful, type-safe way to build forms in React. It's built on react-hook-form and offers a compound component pattern for maximum flexibility while maintaining excellent developer experience.

## Key Features

- **Zero Styling By Default** - Complete freedom to style your forms
- **React Hook Form Integration** - Built on top of the powerful react-hook-form library
- **Compound Component Pattern** - Composable form elements with clear semantics
- **Robust Form Validation** - Built-in validation handling with customizable error messages
- **Accessible By Default** - Proper ARIA attributes and form relationships
- **Field Subscription** - Subscribe to field values and form state changes
- **TypeScript Support** - Full type inference for form values and validation rules

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react react-hook-form

# Using npm
npm install @zayne-labs/ui-react react-hook-form

# Using yarn
yarn add @zayne-labs/ui-react react-hook-form
```

## Component Structure

The Form component consists of several composable parts:

- **Form.Root** - The container for the form, manages form state
- **Form.Field** - Container for individual form fields
- **Form.FieldController** - Render prop component for custom field rendering within Form.Field
- **Form.ControlledField** - Standalone controlled field component that creates its own context
- **Form.Label** - Label for form inputs
- **Form.Input** - Input field with automatic registration
- **Form.TextArea** - Multi-line text input
- **Form.Select** - Dropdown selection input
- **Form.Description** - Helpful text describing a form field
- **Form.ErrorMessage** - Displays validation errors
- **Form.InputGroup** - Container for input with prepend/append elements
- **Form.InputLeftItem** - Element to prepend to an input
- **Form.InputRightItem** - Element to append to an input
- **Form.Submit** - Submit button for the form
- **Form.SubscribeToFieldValue** - Component to subscribe to field value changes
- **Form.SubscribeToFormState** - Component to subscribe to form state changes

## Basic Usage

```tsx
import { useForm } from "react-hook-form";
import { Form } from "@zayne-labs/ui-react/ui/form";

function LoginForm() {
	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		console.log(data);
	});

	return (
		<Form.Root form={form} onSubmit={onSubmit}>
			<Form.Field name="email">
				<Form.Label>Email</Form.Label>
				<Form.Input type="email" />
				<Form.ErrorMessage />
			</Form.Field>

			<Form.Field name="password">
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" />
				<Form.ErrorMessage />
			</Form.Field>

			<Form.Submit>Log in</Form.Submit>
		</Form.Root>
	);
}
```

## Form Validation Example

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@zayne-labs/ui-react/ui/form";

// Define validation schema
const formSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters"),
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

function SignupForm() {
	const methods = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = methods.handleSubmit((data) => {
		console.log(data);
	});

	return (
		<Form.Root methods={methods} onSubmit={onSubmit}>
			<Form.Field name="username">
				<Form.Label>Username</Form.Label>
				<Form.Input />
				<Form.Description>Choose a unique username</Form.Description>
				<Form.ErrorMessage />
			</Form.Field>

			<Form.Field name="email">
				<Form.Label>Email</Form.Label>
				<Form.Input type="email" />
				<Form.ErrorMessage />
			</Form.Field>

			<Form.Field name="password">
				<Form.Label>Password</Form.Label>
				<Form.Input type="password" />
				<Form.Description>Must be at least 8 characters</Form.Description>
				<Form.ErrorMessage />
			</Form.Field>

			<Form.SubscribeToFormState>
				{({ isSubmitting, isValid }) => (
					<Form.Submit disabled={isSubmitting || !isValid}>
						{isSubmitting ? "Submitting..." : "Sign up"}
					</Form.Submit>
				)}
			</Form.SubscribeToFormState>
		</Form.Root>
	);
}
```

## Password Input with Eye Icon

Password inputs automatically include an eye icon for toggling visibility:

```tsx
function PasswordForm() {
	const methods = useForm();

	return (
		<Form.Root methods={methods}>
			<Form.Field name="password">
				<Form.Label>Password</Form.Label>
				{/* Eye icon is included by default */}
				<Form.Input type="password" />
				<Form.ErrorMessage />
			</Form.Field>

			{/* Disable eye icon globally */}
			<Form.Field name="confirmPassword">
				<Form.Label>Confirm Password</Form.Label>
				<Form.Input type="password" withEyeIcon={false} />
				<Form.ErrorMessage />
			</Form.Field>
		</Form.Root>
	);
}
```

## Input Groups

Use input groups to add elements before or after inputs:

```tsx
function ProfileForm() {
	const methods = useForm();

	return (
		<Form.Root methods={methods}>
			<Form.Field name="website">
				<Form.Label>Website</Form.Label>
				<Form.InputGroup>
					<Form.InputLeftItem>https://</Form.InputLeftItem>
					<Form.Input placeholder="example.com" />
				</Form.InputGroup>
				<Form.ErrorMessage />
			</Form.Field>

			<Form.Field name="price">
				<Form.Label>Price</Form.Label>
				<Form.InputGroup>
					<Form.InputLeftItem>$</Form.InputLeftItem>
					<Form.Input type="number" />
					<Form.InputRightItem>.00</Form.InputRightItem>
				</Form.InputGroup>
				<Form.ErrorMessage />
			</Form.Field>
		</Form.Root>
	);
}
```

## Field Controllers

For custom components or third-party integrations:

```tsx
function CustomFieldForm() {
	const methods = useForm();

	return (
		<Form.Root methods={methods}>
			<Form.Field name="rating">
				<Form.Label>Rating</Form.Label>

				<Form.FieldController
					render={({ field, fieldState }) => (
						<StarRating
							value={field.value}
							onChange={field.onChange}
							onBlur={field.onBlur}
							error={fieldState.error}
						/>
					)}
				/>
				<Form.ErrorMessage />
			</Form.Field>
		</Form.Root>
	);
}
```

## Field Subscriptions

Subscribe to field values and form state:

```tsx
function SubscriptionExample() {
	const methods = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
		},
	});

	return (
		<Form.Root methods={methods}>
			<Form.Field name="firstName">
				<Form.Label>First Name</Form.Label>
				<Form.Input />
				<Form.SubscribeToFieldValue>
					{({ value }) => value && <p>Hello, {value}!</p>}
				</Form.SubscribeToFieldValue>
			</Form.Field>

			<Form.Field name="lastName">
				<Form.Label>Last Name</Form.Label>
				<Form.Input />
			</Form.Field>

			<Form.SubscribeToFormState>
				{({ isDirty, isValid }) => <Form.Submit disabled={!isDirty || !isValid}>Submit</Form.Submit>}
			</Form.SubscribeToFormState>
		</Form.Root>
	);
}
```

## API Reference

### Form.Root

The main container for the form.

**Props:**

- `methods: UseFormReturn<TFieldValues>` - Form methods from react-hook-form's `useForm`
- `withEyeIcon?: boolean` - Control eye icon visibility globally (default: true)
- `children: React.ReactNode` - Form content
- `...props` - All other properties are passed to the underlying `<form>` element

### Form.Field

Container for form field components.

**Props:**

- `name: string` - Field name (from form schema)
- `withWrapper?: boolean` - Whether to wrap the field in a div (default: true)
- `className?: string` - Optional CSS class for the wrapper
- `children: React.ReactNode` - Field content

### Form.FieldController

Render prop component for custom field rendering within Form.Field context.

**Props:**

- `render: ({ field, fieldState }) => React.ReactElement` - Render function that receives field props and state
- `rules?: RegisterOptions` - Validation rules from react-hook-form

**Usage:**

```tsx
<Form.Field name="rating">
	<Form.Label>Rating</Form.Label>
	<Form.FieldController
		render={({ field, fieldState }) => (
			<StarRating
				value={field.value}
				onChange={field.onChange}
				onBlur={field.onBlur}
				error={fieldState.error}
			/>
		)}
	/>
	<Form.ErrorMessage />
</Form.Field>
```

### Form.ControlledField

Standalone controlled field component that creates its own field context.

**Props:**

- `name: string` - Field name
- `control?: Control` - Form control (uses context if not provided)
- `render: ({ field, fieldState, formState }) => React.ReactElement` - Render function
- `rules?: RegisterOptions` - Validation rules
- `defaultValue?: any` - Default field value

**Usage:**

```tsx
<Form.ControlledField
	name="customField"
	render={({ field, fieldState }) => (
		<div>
			<label htmlFor={field.name}>Custom Field</label>
			<CustomInput
				id={field.name}
				value={field.value}
				onChange={field.onChange}
				error={fieldState.error?.message}
			/>
		</div>
	)}
/>
```

### Form.Input

Input element with automatic registration.

**Props:**

- `type?: string` - Input type (text, password, email, etc.)
- `withEyeIcon?: boolean` - Whether to show eye icon for password fields
- `classNames?: object` - CSS classes for different parts
- `rules?: RegisterOptions` - Validation rules from react-hook-form
- `...props` - All other properties are passed to the underlying `<input>` element

### Form.Label

Label for form inputs.

**Props:**

- `children: React.ReactNode` - Label content
- `...props` - All other properties are passed to the underlying `<label>` element

### Form.ErrorMessage

Displays validation errors.

**Props:**

- `className?: string` - Optional CSS class
- `type?: "regular" | "root"` - Error type (default: "regular")
- `errorField?: string` - Field name to display errors for

### Form.SubscribeToFieldValue

Subscribe to field value changes.

**Props:**

- `name?: string` - Field name to subscribe to
- `children: ({ value }) => React.ReactNode` - Render function

### Form.SubscribeToFormState

Subscribe to form state changes.

**Props:**

- `children: (formState) => React.ReactNode` - Render function receiving form state

## Styling

The Form components are completely unstyled by default. Use data attributes for styling:

```css
/* Form root */
[data-scope="form"][data-part="root"] {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* Form field */
[data-scope="form"][data-part="field"] {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

/* Form input */
[data-scope="form"][data-part="input"] {
	padding: 0.5rem;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
}

/* Invalid state */
[data-scope="form"][data-part="input"][data-invalid="true"] {
	border-color: #ef4444;
}
```

## Best Practices

1. **Use TypeScript** - Define your form schema with Zod or similar for type safety
2. **Provide Validation** - Always include validation rules and error messages
3. **Handle Loading States** - Use form state subscriptions to show loading indicators
4. **Accessibility** - The components handle ARIA attributes automatically
5. **Performance** - Use field subscriptions instead of watching entire form state

## Accessibility

The Form components include built-in accessibility features:

- Automatic `id` and `htmlFor` attribute linking
- `aria-describedby` for error messages and descriptions
- `aria-invalid` for validation states
- Proper focus management
- Screen reader announcements for errors
