# Introduction

@zayne-labs/ui is a collection of unstyled UI and utility components, inspired by the composable patterns of Radix UI and Shadcn.

Originally built to fill gaps in existing implementations, it's grown into a flexible toolkit that might help solve problems in your projects too.

## Current Status

We currently offer a production-ready React implementation, built on modern patterns and best practices. Our components are:

- Fully typed with TypeScript
- Tree-shakeable for small bundles
- Well-documented with examples
- Actively maintained

## Framework Support

- **React** - Available now
- **Vue** - Coming soon
- **Svelte** - Coming soon
- **Solid** - Coming soon

## What's Inside

- 🎨 **Zero Styles** - Style however you want
- 📦 **Small Bundle** - Import only what you need
- 🔧 **Easy to Use** - Simple APIs, great TypeScript support

## Available Components

### UI Components

- **Card** - Flexible container component for grouping related content
- **Carousel** - Customizable slideshow for cycling through elements
- **DragScroll** - Add drag-to-scroll behavior to any container
- **DropZone** - File upload component with drag-and-drop support
- **Form** - Composable form components with validation and state management

### Utility Components

- **Await** - Handle async states declaratively
- **For** - Iterate over arrays and objects with built-in keying
- **Show** - Conditional rendering with fallback support
- **Switch** - Pattern matching for rendering different states
- **Slot** - Component composition with named slots
- **ErrorBoundary** - Catch and handle React component errors
- **SuspenseWithBoundary** - Combined Suspense and ErrorBoundary
- **Teleport** - Render components anywhere in the DOM tree

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Quick Start

### File Upload with a ui component

Here's a drag-and-drop file uploader:

```tsx
import { DropZone } from '@zayne-labs/ui-react/ui/drop-zone'
import { toast } from 'sonner'

function ImageUploader() {
  return (
    <DropZone.Root
      allowedFileTypes={['image/*']}
      maxFileCount={4}
      onUploadSuccess={(ctx) => toast.success("Success", { description: ctx.message })}
      maxFileSize={5}
    >
      <div className="p-6 border rounded-lg bg-gray-50">
        <p className="text-center text-gray-600">
          Drop images or click to upload
        </p>
      </div>

      <DropZone.ImagePreview>
        {({ dropZoneState }) => (
          dropZoneState.filesWithPreview.map((file) => (
            <img
              key={file.id}
              src={file.preview}
              alt={file.name}
              className="rounded-lg aspect-square object-cover"
            />
          ))
        )}
      </DropZone.ImagePreview>
    </DropZone.Root>
  )
}
```

### Control Flow with a utility component

Handle different states with `Switch`:

```tsx
import { Switch } from '@zayne-labs/ui-react/common/switch'

function StatusBadge({ status }: { status: 'active' | 'inactive' | 'pending' }) {
  return (
    <Switch condition={status}>
      <Switch.Match when="active">
        <span className="text-green-500">●</span>
        <span>Active</span>
      </Switch.Match>

      <Switch.Match when="inactive">
        <span className="text-gray-500">○</span>
        <span>Inactive</span>
      </Switch.Match>

      <Switch.Default>
        <span className="text-yellow-500">◐</span>
        <span>Pending</span>
      </Switch.Default>
    </Switch>
  )
}
```

## Documentation Structure

Our documentation is organized into several sections to help you find what you need:

- **Getting Started** - Installation, basic concepts, and first steps
- **UI Components** - Documentation for each UI component
- **Utility Components** - Documentation for each utility component
- **Advanced Usage** - Deep dives into complex use cases
- **API Reference** - Detailed API documentation

## Need Help?

- 📖 Check component docs in the [ui](../ui) and [common](../common) folders
- 🐛 Found a bug? [Open an issue](https://github.com/zayne-labs/ui/issues)
- 💡 Have an idea? [Start a discussion](https://github.com/zayne-labs/ui/discussions)

## Contributing

We welcome contributions! See our [contributing guide](https://github.com/zayne-labs/contribute.git).

## License

MIT © [Zayne Labs]
