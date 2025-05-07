# Form

A flexible and powerful form component with zero styling, built on top of react-hook-form.

## Overview

The Form component provides a comprehensive solution for building forms with validation, field management, and accessibility features. It uses a compound component pattern to create a clean, declarative API while leveraging the power of react-hook-form under the hood.

## Key Features

- **Zero Styling By Default** - Complete freedom to style your forms
- **React Hook Form Integration** - Built on top of the powerful react-hook-form library
- **Compound Component Pattern** - Composable form elements with clear semantics
- **Robust Form Validation** - Built-in validation handling with customizable error messages
- **Accessible By Default** - Proper ARIA attributes and form relationships
- **Field Subscription** - Subscribe to field values and form state changes
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
- **Form.Input** - Text input field
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
import { useForm } from 'react-hook-form';
import { Form } from '@zayne-labs/ui-react/form';

function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values) => {
    console.log(values);
  };

  return (
    <Form.Root methods={form} onSubmit={form.handleSubmit(onSubmit)}>
      <Form.Field name="email">
        <Form.Label>Email</Form.Label>
        <Form.Input />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Field name="password">
        <Form.Label>Password</Form.Label>
        <Form.Input type="password" />
        <Form.ErrorMessage />
      </Form.Field>

      <Form.Submit className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Log in
      </Form.Submit>
    </Form.Root>
  );
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

type FormValues = z.infer<typeof formSchema>;

function SignupForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <Form.Root methods={form} onSubmit={form.handleSubmit(onSubmit)}>
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

      <Form.Submit className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Sign up
      </Form.Submit>
    </Form.Root>
  );
}
```

## Complex Form With Multiple Field Types

```tsx
import { useForm } from 'react-hook-form';
import { Form } from '@zayne-labs/ui-react/ui';

function ProfileForm() {
  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      bio: '',
      role: '',
      newsletter: false,
      notifications: [],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form.Root methods={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <Form.Field name="notifications" className="flex items-center gap-2">
          <Form.Input type="checkbox" value="email" className="h-4 w-4" />
          <Form.Label className="text-sm">Email</Form.Label>
        </Form.Field>
        <Form.Field name="notifications" className="flex items-center gap-2">
          <Form.Input type="checkbox" value="sms" className="h-4 w-4" />
          <Form.Label className="text-sm">SMS</Form.Label>
        </Form.Field>
        <Form.Field name="notifications" className="flex items-center gap-2">
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

## Custom Input Styling

```tsx
import { useForm } from 'react-hook-form';
import { Form } from '@zayne-labs/ui-react/ui';

function StyledForm() {
  const form = useForm();

  return (
    <Form.Root methods={form} className="max-w-md mx-auto">
      <Form.Field name="email">
        <Form.Label className="text-sm font-medium text-gray-700">
          Email
        </Form.Label>
        <Form.Input
          placeholder="Enter your email"
          classNames={{
            input: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            error: "border-red-500 focus:ring-red-500 focus:border-red-500"
          }}
          rules={{ required: "Email is required" }}
        />
        <Form.ErrorMessage className="text-red-500 text-xs mt-1" />
      </Form.Field>

      <Form.Field name="password" className="mt-4">
        <Form.Label className="text-sm font-medium text-gray-700">
          Password
        </Form.Label>
        <Form.Input
          type="password"
          placeholder="Enter your password"
          classNames={{
            input: "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            error: "border-red-500 focus:ring-red-500 focus:border-red-500",
            eyeIcon: "text-gray-500 hover:text-gray-700"
          }}
          rules={{ required: "Password is required" }}
        />
        <Form.ErrorMessage className="text-red-500 text-xs mt-1" />
      </Form.Field>
    </Form.Root>
  );
}
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
```

## API Reference

### Form.Root

The main container for the form that sets up the form context.

**Props:**

- `methods: UseFormReturn<TFieldValues>` - Form methods from react-hook-form's `useForm`
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
