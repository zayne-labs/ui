# Form

A lightweight wrapper around react-hook-form that provides a compound component API.

## Overview

The Form component simplifies working with react-hook-form by providing a set of composable components. It handles the form context and validation while letting you focus on the UI.

## Key Features

- **Zero Styling By Default** - Complete freedom to style your forms
- **React Hook Form Integration** - Built on top of the powerful react-hook-form library
- **Compound Component Pattern** - Composable form elements with clear semantics
- **Robust Form Validation** - Built-in validation handling with customizable error messages
- **Accessible By Default** - Proper ARIA attributes and form relationships
- **Field Subscription** - Subscribe to field values and form state changes at the component level and avoid needless re-renders
- **Typescript Support** - Full type inference for form values and validation rules

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
- **Form.Label** - Label for form inputs
- **Form.Input** - Text input field. When `type="password"` is specified, it automatically renders a toggle-able eye icon. This can be customized using the `withEyeIcon` prop which accepts:
  - `boolean` - To show/hide the default eye icon
  - `{ open: ReactNode, closed: ReactNode }` - To provide custom icons for the visible/hidden states
  - `{ renderIcon: (props: { isPasswordVisible: boolean }) => ReactNode }` - To render the icon with access to password visibility state
- **Form.TextArea** - Multi-line text input (Wrapper over `<Form.Input type="textarea"/>`)
- **Form.Select** - Dropdown selection input (Wrapper over `<Form.Input type="select"/>`)
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
import { Form } from '@zayne-labs/ui-react'

function LoginForm() {
  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form.Root
      methods={methods}
      onSubmit={onSubmit}
    >
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

      <Form.Submit
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Log in
      </Form.Submit>
    </Form.Root>
  )
}
```

## Form Validation Example

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@zayne-labs/ui-react/ui';

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
      username: '',
      email: '',
      password: '',
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

      <Form.Field name="email" className="mt-4">
        <Form.Label>Email</Form.Label>
        <Form.Input type="email" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field name="password" className="mt-4">
        <Form.Label>Password</Form.Label>
        <Form.Input type="password" />
        <Form.Description>Must be at least 8 characters</Form.Description>
        <Form.ErrorMessage />
      </Form.Field>

      <Form.SubscribeToFormState>
        {({ isSubmitting, isValid }) => (
          <Form.Submit
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Submitting..." : "Sign up"}
          </Form.Submit>
        )}
      </Form.SubscribeToFormState>
    </Form.Root>
  );
}
```

## Complex Form With Multiple Field Types

```tsx
import { useForm } from 'react-hook-form';
import { Form } from '@zayne-labs/ui-react/ui';

function ProfileForm() {
  const methods = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      bio: '',
      role: '',
      newsletter: false,
      notifications: [],
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form.Root methods={methods} onSubmit={onSubmit} className="space-y-6">
      <Form.Field name="fullName">
        <Form.Label className="text-sm font-medium">Full Name</Form.Label>
        <Form.Input className="mt-1 border rounded p-2 w-full" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field name="email">
        <Form.Label className="text-sm font-medium">Email</Form.Label>

        <Form.InputGroup className="mt-1">
          <Form.InputLeftItem className="border-y border-l rounded-l bg-gray-50 px-3">
            @
          </Form.InputLeftItem>

          <Form.Input className="border rounded-r p-2 w-full" />
        </Form.InputGroup>

        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field name="bio">
        <Form.Label className="text-sm font-medium">Bio</Form.Label>

        {/* Wrapper over `<Form.Input type="textarea"/>` */}
        <Form.TextArea
          className="mt-1 border rounded p-2 w-full"
          rows={4}
        />

        <Form.Description className="mt-1 text-xs text-gray-500">
          Write a short bio about yourself
        </Form.Description>

        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field name="role">
        <Form.Label className="text-sm font-medium">Role</Form.Label>

         {/* Wrapper over `<Form.Input type="select"/>` */}
        <Form.Select className="mt-1 border rounded p-2 w-full">
          <option value="">Select a role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </Form.Select>

        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field name="newsletter">
        <div className="flex items-center gap-2">
          <Form.Input type="checkbox" className="h-4 w-4" />
          <Form.Label className="text-sm">Subscribe to newsletter</Form.Label>
        </div>

        <Form.ErrorMessage />
      </Form.Field>

      <div className="space-y-2">
        <span className="text-sm font-medium">Notification Preferences</span>

        {/* Nested fields */}
        <Form.Field name="notifications.0" className="flex items-center gap-2">
          <Form.Input type="checkbox" value="email" className="h-4 w-4" />
          <Form.Label className="text-sm">Email</Form.Label>
        </Form.Field>

        <Form.Field name="notifications.1" className="flex items-center gap-2">
          <Form.Input type="checkbox" value="sms" className="h-4 w-4" />
          <Form.Label className="text-sm">SMS</Form.Label>
        </Form.Field>

        <Form.Field name="notifications.2" className="flex items-center gap-2">
          <Form.Input type="checkbox" value="push" className="h-4 w-4" />
          <Form.Label className="text-sm">Push Notifications</Form.Label>
        </Form.Field>
      </div>

      <Form.Submit className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Save Profile
      </Form.Submit>
    </Form.Root>
  );
}
```

## Password Input Eye Icons

Password inputs in the Form component come with built-in eye icons for toggling password visibility. This feature can be controlled both globally and locally, and supports custom styling and icons.

### Control Options

1. **Global Control** - Set default behavior for all password inputs:

```tsx
<Form.Root methods={methods} withEyeIcon={false}>
  {/* All password inputs will have no eye icon by default */}
</Form.Root>
```

1. **Local Control** - Override for individual inputs:

```tsx
<Form.Field name="password">
  <Form.Label>Password</Form.Label>
  <Form.Input
    type="password"
    withEyeIcon={true} // Override global setting
  />
</Form.Field>
```

### Customizing Icons

The `withEyeIcon` prop accepts several formats for customization:

```tsx
<Form.Field name="password">
  <Form.Label>Password</Form.Label>

  {/* 1. Default eye icon */}
  <Form.Input type="password" />

  {/* 2. Custom icon components */}
  <Form.Input
    type="password"
    withEyeIcon={{
      open: <CustomVisibleIcon />,
      closed: <CustomHiddenIcon />
    }}
  />

  {/* 3. Dynamic icon with visibility state */}
  <Form.Input
    type="password"
    withEyeIcon={{
      renderIcon: ({ isPasswordVisible }) => (
        <CustomIcon state={isPasswordVisible ? "visible" : "hidden"} />
      )
    }}
  />
</Form.Field>
```

### Styling

Password inputs with eye icons use `Form.InputGroup` internally, providing two style targets:

> **Note:** For simpler styling, you can disable the eye icon with `withEyeIcon={false}` to use a plain password input instead.

```tsx
<Form.Input
  type="password"
  classNames={{
    // 1. Style the eye icon itself
    eyeIcon: "text-gray-400 hover:text-gray-600 transition-colors",
    // 2. Style the input container
    inputGroup: "border-2 border-gray-300 rounded-lg focus-within:border-blue-500"
  }}
/>
```

## Field Components Guide

The Form package provides three field components with different levels of control:

### 1. Form.Field

The standard field component. Use this for most form fields.

- Provides field context for child components
- Handles field registration automatically
- Works with Form.Input, Form.Label, etc. out of the box
- Includes optional wrapper div for styling

```tsx
<Form.Field name="email">
  <Form.Label>Email</Form.Label>
  <Form.Input type="email" />
  <Form.ErrorMessage />
</Form.Field>
```

### 2. Form.FieldController

A lightweight render-prop component for custom field rendering within Form.Field. Use this when you need:

- Custom rendering while keeping Form.Field context
- Access to field state and methods
- Simple third-party component integration

```tsx
<Form.Field name="rating">
  <Form.Label>Rating</Form.Label>

  <Form.FieldController
    render={({ field, fieldState }) => (
      <StarRating
        value={field.value}
        onChange={field.onChange}
        error={fieldState.error}
      />
    )}
  />
  <Form.ErrorMessage />
</Form.Field>
```

### 3. Form.ControlledField

A standalone field component that creates its own context. Use this when you need:

- Independent field management outside Form.Field
- Full control over field context and registration
- Complex form layouts with custom field groups

```tsx
{/* No Form.Field wrapper needed */}
<Form.ControlledField
  name="customGroup.rating"
  render={({ field, fieldState }) => (
    <div>
      <Form.Label>{field.name}</Form.Label>

      <StarRating
        ref={field.ref}
        value={field.value}
        onChange={field.onChange}
        error={fieldState.error}
      />

      <span className="error">{fieldState.error?.message}</span>
    </div>
  )}
/>
```

### When to Use Each

1. **Use Form.Field when:**
   - Building standard form layouts
   - Using Form.* components (Input, Label, etc.)
   - Need the default field wrapper and context

2. **Use Form.FieldController when:**
   - Need custom rendering but want Form.Field context
   - Want to keep using Form.Label and Form.ErrorMessage
   - Integrating simple third-party components

3. **Use Form.ControlledField when:**
   - Need fields outside the Form.Field structure
   - Building custom field groups or complex layouts
   - Want complete control over the field context
   - Implementing advanced validation patterns

## Form.ErrorMessage

Displays validation errors in two ways:

1. **Field Errors**: Shows validation errors for a specific field
2. **Form Errors**: Shows form-wide errors (like API errors or cross-field validation)

```tsx
// 1. Field-specific error
<Form.Field name="email">
  <Form.Input rules={{ required: "Email required" }} />
  <Form.ErrorMessage /> {/* Shows "Email required" */}
</Form.Field>

// 2. Form-wide error
<Form.Root onError={(error) => setError("root.serverError", error)}>
  <Form.ErrorMessage
    type="root"
    errorField="serverError"
  />
  {/* Form fields... */}
</Form.Root>
```

## Form State Subscription

```tsx
import { useForm } from 'react-hook-form';
import { Form } from '@zayne-labs/ui-react/ui';

function FormWithStateSubscription() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  return (
    <Form.Root methods={form} className="space-y-4">
      <Form.Field name="firstName">
        <Form.Label>First Name</Form.Label>
        <Form.Input />
        <Form.SubscribeToFieldValue>
          {({ value }) => (
            value ? <p className="text-xs text-green-500 mt-1">Hello, {value}!</p> : null
          )}
        </Form.SubscribeToFieldValue>
      </Form.Field>

      <Form.Field name="lastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Input />
      </Form.Field>

      <Form.SubscribeToFormState>
        {({ dirtyFields, isValid }) => (
          <div className="text-sm mt-2">
            <p>Form Status:</p>
            <ul className="list-disc pl-5">
              <li>First name dirty: {dirtyFields.firstName ? 'Yes' : 'No'}</li>
              <li>Last name dirty: {dirtyFields.lastName ? 'Yes' : 'No'}</li>
              <li>Form valid: {isValid ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        )}
      </Form.SubscribeToFormState>

      <Form.Submit className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </Form.Submit>
    </Form.Root>
  );
}

## Form.ErrorMessage

Component to display validation errors for a field.

**Props:**

- `className?: string` - Optional CSS class
- `type?: "regular" | "root"` - Error type (default: "regular")
  - `regular`: Shows field-level errors from the parent `Form.Field`
  - `root`: Shows form-wide errors, requires `errorField` prop
- `errorField?: string` - Field to show errors for when `type="root"`
- `...props` - All other properties are passed to the underlying `<p>` element

**Examples:**

```tsx
// 1. Field-level error
<Form.Field name="email">
  <Form.Input />
  <Form.ErrorMessage /> {/* Shows email field errors */}
</Form.Field>

// 2. Root-level error
<Form.Root>
  <Form.ErrorMessage
    type="root"
    errorField="root"
  /> {/* Shows form-wide errors */}
  {/* Form fields... */}
</Form.Root>
```

## Form.SubscribeToFieldValue

Component that subscribes to one or more field values and re-renders when they change.

**Props:**

- `name?: string | string[]` - Field(s) to subscribe to (inherits from Form.Field if not provided)
- `render/children: (props: { value: any }) => ReactNode` - Render function receiving current value(s)

```tsx
// 1. Single field subscription
<Form.Field name="email">
  <Form.SubscribeToFieldValue>
    {({ value }) => <div>Current email: {value}</div>}
  </Form.SubscribeToFieldValue>
</Form.Field>

// 2. Multiple field subscription
<Form.SubscribeToFieldValue name={['email', 'password']}>
  {({ value: [email, password] }) => (
    <div>Form filled: {Boolean(email && password)}</div>
  )}
</Form.SubscribeToFieldValue>
```

## Form.SubscribeToFormState

Component that subscribes to form state changes like validation, submission status, etc.

**Props:**

- `name?: string | string[]` - Optional field(s) to limit state subscription
- `render/children: (formState: FormState) => ReactNode` - Render function receiving form state

**FormState properties:**

- `isDirty` - Form has been modified
- `isSubmitting` - Form is being submitted
- `isValid` - All fields are valid
- `errors` - Validation errors
- And [more from react-hook-form](https://react-hook-form.com/docs/useformstate)

```tsx
import { useForm } from 'react-hook-form';
import { Form } from '@zayne-labs/ui-react/ui';

function SubscriptionExample() {
  const form = useForm();

  return (
    <Form.Root methods={form}>
      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Input />

        {/* 1. Watch value changes */}
        <Form.SubscribeToFieldValue>
          {({ value }) => (
            <div>Current value: {value}</div>
          )}
        </Form.SubscribeToFieldValue>
      </Form.Field>

      {/* 2. Watch form state */}
      <Form.SubscribeToFormState>
        {({ isDirty, isSubmitting, isValid }) => (
          <Form.Submit
            disabled={!isDirty || isSubmitting || !isValid}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Form.Submit>
        )}
      </Form.SubscribeToFormState>
    </Form.Root>
  );
}

## API Reference

### Form.Root

The main container for the form that sets up the form context.

**Props:**

- `methods: UseFormReturn<TFieldValues>` - Form methods from react-hook-form's `useForm`
- `withEyeIcon?: boolean | EyeIconObject` - Control eye icon visibility globally
- `children: React.ReactNode` - Form content
- `className?: string` - Optional CSS class
- `...props` - All other properties are passed to the underlying `<form>` element

### Form.Field

Container for form field components.

**Props:**

- `name: string` - Field name (from form schema)
- `withWrapper?: boolean` - Whether to wrap the field in a div (default: true)
- `className?: string` - Optional CSS class for the wrapper (only when `withWrapper` is true)
- `children: React.ReactNode` - Field content

### Form.Label

Label for form inputs.

**Props:**

- `children: React.ReactNode` - Label content
- `className?: string` - Optional CSS class
- `...props` - All other properties are passed to the underlying `<label>` element

### Form.Input

Input element for the form.

**Props:**

- `type?: string` - Input type (text, password, email, etc.)
- `classNames?: { input?: string; error?: string; eyeIcon?: string; inputGroup?: string }` - CSS classes for different parts
- `withEyeIcon?: boolean` - Whether to show the eye icon for password fields (default: true)
- `rules?: RegisterOptions` - Validation rules from react-hook-form
- `...props` - All other properties are passed to the underlying `<input>` element

### Form.TextArea

Multi-line text input.

**Props:**

- `classNames?: { base?: string; error?: string }` - CSS classes for different parts
- `rules?: RegisterOptions` - Validation rules from react-hook-form
- `...props` - All other properties are passed to the underlying `<textarea>` element

### Form.Select

Dropdown selection input.

**Props:**

- `classNames?: { base?: string; error?: string }` - CSS classes for different parts
- `rules?: RegisterOptions` - Validation rules from react-hook-form
- `...props` - All other properties are passed to the underlying `<select>` element

### Form.InputGroup

Container for input with left/right items.

**Props:**

- `className?: string` - Optional CSS class
- `children: React.ReactNode` - Input content and left/right items
- `...props` - All other properties are passed to the underlying `<div>` element

### Form.InputLeftItem / Form.InputRightItem

Elements that can be added before or after inputs in an InputGroup.

**Props:**

- `as?: React.ElementType` - Element to render as (default: 'span')
- `children: React.ReactNode` - Content
- `className?: string` - Optional CSS class
- `...props` - All other properties are passed to the underlying element

### Form.Description

Descriptive text for a form field.

**Props:**

- `children: React.ReactNode` - Description content
- `className?: string` - Optional CSS class
- `...props` - All other properties are passed to the underlying `<p>` element

### Form.ErrorMessage

Component to display validation errors for a field.

**Props:**

- `className?: string` - Optional CSS class
- `errorField?: string` - Field name to display errors for (defaults to the containing Form.Field name)
- `type?: "regular" | "root"` - Type of error message (default: "regular")
- `control?: Control` - Form control from react-hook-form

### Form.Submit

Submit button for the form.

**Props:**

- `as?: React.ElementType` - Element to render as (default: 'button')
- `asChild?: boolean` - Whether to merge props onto the child element
- `children: React.ReactNode` - Button content
- `className?: string` - Optional CSS class
- `type?: "submit" | "button" | "reset"` - Button type (default: "submit")
- `...props` - All other properties are passed to the underlying button element

### Form.SubscribeToFieldValue

Component that subscribes to a field value and re-renders when it changes.

**Props:**

- `name?: string` - Field name to subscribe to (defaults to the containing Form.Field name)
- `control?: Control` - Form control from react-hook-form
- `children: ({ value }) => React.ReactNode` - Render function that receives the field value

### Form.SubscribeToFormState

Component that subscribes to the form state and re-renders when it changes.

**Props:**

- `name?: string | string[]` - Field name(s) to watch (defaults to the containing Form.Field name)
- `control?: Control` - Form control from react-hook-form
- `children: (formState) => React.ReactNode` - Render function that receives the form state

## Accessibility Considerations

The Form component is built with accessibility in mind, following these principles:

### ARIA Attributes

- Form inputs are automatically associated with their labels via `id` and `htmlFor` attributes
- Error messages are linked to inputs using `aria-describedby`
- Validation states are indicated with `aria-invalid` attributes
- Proper focus handling for error states

### Keyboard Navigation

- All interactive elements are focusable with keyboard
- Default tab order follows visual layout
- Submit buttons are properly focusable

### Screen Reader Support

- Labels are properly associated with form controls
- Error messages are announced when they appear
- Descriptions provide additional context

### Example with Enhanced Accessibility

```tsx
<Form.Root methods={form}>
  <Form.Field name="email">
    <Form.Label>Email Address</Form.Label>
    <Form.Description>We'll never share your email with anyone else.</Form.Description>
    <Form.Input
      type="email"
      placeholder="name@example.com"
      aria-required="true"
    />
    <Form.ErrorMessage />
  </Form.Field>
</Form.Root>
```

## Best Practices

### Form Organization

1. **Group Related Fields**: Use fieldsets or sections to group related inputs
2. **Consistent Layout**: Maintain consistent spacing and alignment for all form elements
3. **Progressive Disclosure**: Show only relevant fields based on previous selections
4. **Clear Labels**: Use concise, descriptive labels that clearly indicate required fields

### Validation

1. **Immediate Feedback**: Validate fields on blur or change for immediate feedback
2. **Clear Error Messages**: Provide specific error messages that explain how to fix issues
3. **Prevent Premature Validation**: Avoid showing errors before the user has interacted with a field
4. **Schema Validation**: Use Zod, Yup, or other schema validation libraries

### Performance

1. **Use Field-Level Subscriptions**: Subscribe only to specific field values when needed
2. **Control Re-renders**: Use `SubscribeToFieldValue` instead of watching all form values
3. **Memoize Callbacks**: Memoize submission and validation handlers

## Advanced Usage Patterns

### Controlled Fields

For complex custom inputs that need more control:

```tsx
<Form.Field name="rating">
  <Form.Label>Rating</Form.Label>
  <Form.FieldController
    render={({ field }) => (
      <StarRating
        value={field.value}
        onChange={field.onChange}
        onBlur={field.onBlur}
      />
    )}
  />
</Form.Field>
```

### Dynamic Form Fields

For fields that are added or removed dynamically:

```tsx
function DynamicForm() {
  const form = useForm({
    defaultValues: {
      items: [{ name: '', quantity: 1 }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });

  return (
    <Form.Root methods={form}>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4">
          <Form.Field name={`items.${index}.name`}>
            <Form.Label>Item Name</Form.Label>
            <Form.Input />
          </Form.Field>

          <Form.Field name={`items.${index}.quantity`}>
            <Form.Label>Quantity</Form.Label>
            <Form.Input type="number" min={1} />
          </Form.Field>

          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => append({ name: '', quantity: 1 })}>
        Add Item
      </button>
    </Form.Root>
  );
}
```

### Dependent Fields

For fields that depend on other field values:

```tsx
function DependentFields() {
  const form = useForm({
    defaultValues: {
      country: '',
      state: ''
    }
  });

  return (
    <Form.Root methods={form}>
      <Form.Field name="country">
        <Form.Label>Country</Form.Label>
        <Form.Select>
          <option value="">Select country</option>
          <option value="us">United States</option>
          <option value="ca">Canada</option>
        </Form.Select>
      </Form.Field>

      <Form.SubscribeToFieldValue name="country">
        {({ value }) => (
          value && (
            <Form.Field name="state">
              <Form.Label>State/Province</Form.Label>
              <Form.Select>
                {value === 'us' ? (
                  <>
                    <option value="ny">New York</option>
                    <option value="ca">California</option>
                  </>
                ) : (
                  <>
                    <option value="on">Ontario</option>
                    <option value="bc">British Columbia</option>
                  </>
                )}
              </Form.Select>
            </Form.Field>
          )
        )}
      </Form.SubscribeToFieldValue>
    </Form.Root>
  );
}
```

## Error Handling Strategies

### Field-Level Validation

Immediate feedback for individual fields:

```tsx
<Form.Field name="password">
  <Form.Label>Password</Form.Label>
  <Form.Input
    type="password"
    rules={{
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        message: "Password must include uppercase, lowercase, and numbers"
      }
    }}
  />
  <Form.ErrorMessage />
</Form.Field>
```

### Form-Level Validation

Validation that involves multiple fields:

```tsx
<Form.Root
  methods={useForm({
    resolver: (values, context, options) => {
      // Base validation with Zod or other schema validators
      const result = zodResolver(schema)(values, context, options);

      // Additional cross-field validation
      if (values.password !== values.confirmPassword) {
        result.errors.confirmPassword = {
          type: 'validate',
          message: 'Passwords do not match'
        };
      }

      return result;
    }
  })}
>
  {/* Form fields */}
</Form.Root>
```

### Custom Error Handling

Handling server-side validation errors:

```tsx
function FormWithServerValidation() {
  const form = useForm();
  const [serverErrors, setServerErrors] = useState({});

  const onSubmit = async (data) => {
    try {
      await submitToApi(data);
    } catch (error) {
      if (error.fieldErrors) {
        // Set errors from server
        Object.entries(error.fieldErrors).forEach(([field, message]) => {
          form.setError(field, { type: 'server', message });
        });
      } else {
        // Set root form error
        setServerErrors({ root: error.message });
      }
    }
  };

  return (
    <Form.Root methods={form} onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}

      {serverErrors.root && (
        <div className="text-red-500 mt-4">
          {serverErrors.root}
        </div>
      )}
    </Form.Root>
  );
}
```

### Animated Error Messages

Using custom animations for error messages:

```tsx
<Form.Field name="email">
  <Form.Label>Email</Form.Label>
  <Form.Input />
  <Form.ErrorMessagePrimitive
    classNames={{
      errorMessage: "text-red-500 text-sm",
      errorMessageAnimation: "animate-shake"
    }}
    render={({ props, state }) => (
      <div {...props} className={`${props.className} mt-1 flex items-center`}>
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          {/* Warning icon */}
        </svg>
        {state.errorMessage}
      </div>
    )}
  />
</Form.Field>
```

## Summary

The Form component provides a flexible, accessible, and type-safe way to build forms in React. By leveraging the power of react-hook-form and providing a compound component API, it allows for complex form interactions while giving you complete control over styling and behavior.

Key advantages:

1. **Zero styling by default** - Complete freedom to design your forms
2. **TypeScript integration** - Full type inference for form values and validation
3. **Accessibility built-in** - Proper ARIA attributes and keyboard navigation
4. **Performance optimized** - Fine-grained control over re-renders
5. **Composable architecture** - Build complex forms from simple building blocks
