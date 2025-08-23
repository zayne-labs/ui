# DropZone

A file upload hook with drag-and-drop support. Use the hook directly or the component wrapper.

## Features

- 🎯 **Zero Default Styling** - Total control over your upload UI
- 📤 **Drag & Drop** - Native drag-and-drop file handling
- 🖼️ **Image Previews** - Built-in preview generation for images
- ✅ **Validation** - File type, size, and count checks
- 🎛️ **Flexible API** - Use as a component or hook
- 🔒 **Type-Safe** - Full TypeScript support

## Quick Start

```bash
pnpm add @zayne-labs/ui-react
```

## Hook Usage

```tsx
import { useDropZone } from '@zayne-labs/ui-react/ui/drop-zone'

function FileUpload() {
  const {
    dropZoneState,   // Files, errors, drag state
    dropZoneActions, // add/remove files
    getRootProps,    // Container props
    getInputProps    // Input props
  } = useDropZone({
    allowedFileTypes: ['.jpg', '.png'],
    maxFileSize: 5,  // MB
    multiple: true
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />

      <div className="p-4 border-2 border-dashed">
        {dropZoneState.isDraggingOver ? (
          <p>Drop here...</p>
        ) : (
          <p>Drop files or click to browse</p>
        )}

        {/* Files */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {dropZoneState.fileStateArray.map(fileState => (
            <div key={fileState.id} className="relative group">
              <img
                src={fileState.preview}
                alt={fileState.file.name}
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => dropZoneActions.removeFile(fileState.id)}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white
                  rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Errors */}
        {dropZoneState.errors.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded">
            {dropZoneState.errors.map((error, i) => (
              <div key={i}>
                {error.file.name}: {error.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

## Component Usage

### Primitive Components

The Drop Zone component can be used in two ways:

1. **Automatic Mode** (default)

```tsx
<DropZone.Root>
  {/* Container and Input are automatically rendered */}
  <p>Drop files here</p>
</DropZone.Root>
```

2. **Manual Mode** (for full control)

```tsx
<DropZone.Root withInternalElements={false}>
  <DropZone.Container className="p-4 border-2 border-dashed">
    <DropZone.Input />

    <p>Drop files here</p>
  </DropZone.Container>
</DropZone.Root>
```

### Basic Usage

```tsx
function BasicUpload() {
  return (
    <DropZone.Root
      allowedFileTypes={['.jpg', '.png']}
      maxFileSize={5}
    >
      {({ dropZoneState }) => (
        <div className="p-4 border-2 border-dashed">
          {/* Upload area */}
          <p>
            {dropZoneState.isDraggingOver ? 'Drop here!' : 'Drop files or click'}
          </p>

          {/* Files */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            {dropZoneState.fileStateArray.map(fileState => (
              <img
                key={fileState.id}
                src={fileState.preview}
                alt={fileState.file.name}
                className="w-full aspect-square object-cover"
              />
            ))}
          </div>

          {/* Errors */}
          {dropZoneState.errors.length > 0 && (
            <div className="mt-4 text-red-600 text-sm">
              {dropZoneState.errors.map((error, i) => (
                <div key={i}>{error.message}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </DropZone.Root>
  )
}
```

### File Preview Components

The DropZone provides dedicated components for rendering file previews and errors:

```tsx
function UploadWithPreview() {
  return (
    <DropZone.Root allowedFileTypes={[".jpg", ".png"]}>
      <DropZone.Area>
        <p className="text-sm text-gray-500">
          Drop images or click to upload
        </p>
      </DropZone.Area>

      <DropZone.FilePreview>
        {(ctx) => (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {ctx.fileStateArray.map((fileState) => (
              <div key={fileState.id} className="relative group">
                <img
                  src={fileState.preview}
                  alt={fileState.file.name}
                  className="w-full aspect-square object-cover rounded"
                />
                <button
                  onClick={() => ctx.actions.removeFile(fileState)}
                  className="absolute top-2 right-2 bg-black/50 text-white
                    rounded-full p-1 opacity-0 group-hover:opacity-100"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </DropZone.FilePreview>

      <DropZone.ErrorPreview>
        {(ctx) => (
          <div className="mt-4 space-y-2">
            {ctx.errors.map((error) => (
              <div key={error.file.name} className="text-red-600 text-sm">
                {error.file.name}: {error.message}
              </div>
            ))}
          </div>
        )}
      </DropZone.ErrorPreview>
    </DropZone.Root>
  )
}
```

### Components

- **DropZone.Root** - The main wrapper component that provides drop zone context
- **DropZone.Area** - Combines Container and Input with Context for easy usage
- **DropZone.Container** - The drop target container that handles drag and drop events
- **DropZone.Input** - The file input element
- **DropZone.Context** - Provides access to drop zone state and actions
- **DropZone.Trigger** - Trigger button for opening file dialog
- **DropZone.FilePreview** - Component for rendering file previews
- **DropZone.ErrorPreview** - Component for rendering validation errors

Both `Container` and `Input` components support the `asChild` prop for custom rendering.

### Using Context

You can access the drop zone state and actions using the `DropZone.Context` component or `useDropZoneStoreContext` hook:

```tsx
function CustomDropZone() {
  const {
    dropZoneState,
    dropZoneActions,
    getContainerProps,
    getInputProps
  } = useDropZoneStoreContext();

  return (
    <div {...getContainerProps({ className: "border-2 border-dashed p-4" })}>
      <input {...getInputProps()} />
      <p>Drop files here</p>
      {dropZoneState.isDraggingOver && <p>Drop it!</p>}
    </div>
  );
}
```

### File Preview Example

```tsx
function FilePreview() {
  const { dropZoneState, dropZoneActions } = useDropZoneStoreContext();

  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {dropZoneState.fileStateArray.map((fileState) => (
        <div key={fileState.id} className="relative group">
          <img
            src={fileState.preview}
            alt={fileState.file.name}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => dropZoneActions.removeFile(fileState)}
            className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
```

## Validation

### Built-in Validation

```tsx
<DropZone.Root
  // File types (extensions or MIME types)
  allowedFileTypes={['.jpg', '.png', 'image/*']}

  // Size in MB
  maxFileSize={5}

  // Max number of files
  maxFileCount={10}

  // Prevent duplicates by name and size (default: true)
  disallowDuplicates={true}
/>
```

### File Type Validation

The `allowedFileTypes` prop supports:

- MIME types: `'image/jpeg'`, `'application/pdf'`
- Extensions (with or without leading dot): `'.jpg'`, `'.png'` (case-insensitive)

```tsx
function FileTypeExample() {
  return (
    <DropZone.Root
      allowedFileTypes={[
        // Images
        '.jpg', '.jpeg', '.png', '.gif',
        // Documents
        'application/pdf',
        // Archives
        '.zip', '.rar'
      ]}
    >
      {/* Your UI here */}
    </DropZone.Root>
  )
}
```

```tsx
<DropZone.Root
 allowedFileTypes={[".jpg", ".png"]}
 maxFileSize={2}
>
  {({ dropZoneState, dropZoneActions }) => (
    <>
          <p className="text-sm font-medium text-gray-600">
           Drop files here or click to upload
          </p>
          <p className="mt-1 text-xs text-gray-500">Supported files: PDF, DOC, DOCX</p>

      <button type="button" className="mt-3" onClick={dropZoneActions.openFilePicker}>Open file picker</button>

      {/* Error display */}
      {dropZoneState.errors.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 text-red-700 rounded">
          <h4 className="font-bold">Upload failed:</h4>
          <ul className="list-disc pl-5">
            {dropZoneState.errors.map((error, i) => (
              <li key={i}>
                {error.file.name}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* File preview display */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {dropZoneState.fileStateArray.map((fileState) => (
          <img
            key={fileState.id}
            src={fileState.preview}
            alt={fileState.file.name}
            className="w-full aspect-square object-cover"
          />
        ))}
      </div>


  )}
</DropZone.Root>
```

### Custom Validator

Add your own validation with the `validator` prop. The validator function supports both synchronous and asynchronous validation:

```tsx
function ImageSizeValidation() {
  return (
    <DropZone.Root
      allowedFileTypes={['.jpg', '.png']}
      validator={({ file }) => {
        // Only allow images > 800x600
        if (file.type.startsWith('image/')) {
          const img = new Image()
          img.src = URL.createObjectURL(file)
          const isValid = img.width >= 800 && img.height >= 600
          URL.revokeObjectURL(img.src)
          return isValid
        }

        return false
      }}
    />
  )
}
```

### Async Custom Validator

You can also use async functions for custom validation, such as checking file content or making API calls:

```tsx
function AsyncValidation() {
  return (
    <DropZone.Root
      allowedFileTypes={['.pdf', '.doc', '.docx']}
      validator={async ({ file }) => {
        // Check file content with an API
        const formData = new FormData()
        formData.append('file', file)

        try {
          const response = await fetch('/api/validate-file', {
            method: 'POST',
            body: formData
          })

          const result = await response.json()
          return result.isValid
        } catch (error) {
          console.error('Validation failed:', error)
          return false
        }
      }}
    />
  )
}
```

## API Reference

For full details on these properties, see the Render Props section in the API Reference.

### DropZone Props

| Prop                              | Type                                                                                   | Default     | Description                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `allowedFileTypes`                | `string[]`                                                                             | `-` | Allowed file extensions/MIME types (e.g., ['.jpg', '.png']) |
| `classNames`                      | `{ base?: string; isDraggingOver?: string; input?: string }`                           | `-` | CSS classes for styling different parts                     |
| `disallowDuplicates`              | `boolean`                                                                              | `true`      | Whether to prevent duplicate file uploads                   |
| `disallowPreviewForNonImageFiles` | `boolean`                                                                              | `true`      | Whether to generate previews only for image files           |
| `extraInputProps`                 | `InputProps`                                                                           | `-` | Additional props for the internal input element             |
| `extraRootProps`                  | `RootProps`                                                                            | `-` | Additional props for the root element                       |
| `initialFiles`                    | `FileMeta \| FileMeta[] \| null`                                                       | `-` | Pre-populated files to show                                 |
| `maxFileCount`                    | `number`                                                                               | `-` | Maximum number of files allowed                             |
| `maxFileSize`                     | `number`                                                                               | `-` | Maximum file size in MB                                     |
| `multiple`                        | `boolean`                                                                              | `-` | Allow multiple file selection                               |
| `onFilesChange`                   | `(context: { fileStateArray: FileState[] }) => void`                                   | `-` | Callback when files state changes                           |
| `onUpload`                        | `(context: { fileStateArray: FileState[] }) => void`                                   | `-` | Callback when files are uploaded                            |
| `onUploadError`                   | `(error: FileValidationErrorContext) => void`                                          | `-` | Callback for individual file validation errors              |
| `onUploadErrors`                  | `(errors: FileValidationErrorContext[]) => void`                                       | `-` | Callback after all validation errors                        |
| `onUploadSuccess`                 | `(context: { message: string }) => void`                                               | `-` | Callback when a file passes validation                      |
| `validator`                       | `(context: { file: File }) => boolean \| Promise<boolean>`                              | `-` | Custom file validation function (supports async)           |
| `children`                        | `React.ReactNode \| ((props: RenderProps) => React.ReactNode)`                         | `-` | Content or render function                                  |
| `render`                          | `(props: RenderProps) => React.ReactNode`                                              | `-` | Alternative render function                                 |
| `withInternalElements`            | `boolean`                                                                              | `true`      | Whether to include internal root and input elements         |

### File Preview Components

The DropZone provides two dedicated components for handling file previews and errors:

- **DropZone.FilePreview** - Renders file previews when files are present
- **DropZone.ErrorPreview** - Renders validation errors when they occur

Both components accept render functions that receive the relevant context data.

### Render Props

The render function receives the following props:

#### State

```ts
dropZoneState: {
  errors: FileValidationErrorContext[];
  fileStateArray: FileState[];
  isDraggingOver: boolean;
}
```

#### Actions

```ts
dropZoneActions: {
  addFiles: (files: File[] | FileList | null) => Awaitable<void>;
  clearErrors: () => void;
  clearFiles: () => void;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => Awaitable<void>;
  handleDragEnter: (event: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLElement>) => Awaitable<void>;
  openFilePicker: () => void;
  removeFile: (fileToRemoveOrFileId: string | FileState) => void;
}
```

#### Helper Functions

The following functions are only needed when `withInternalElements={false}`:

```ts
getRootProps: (rootProps?: RootProps) => RootProps; // Only used when withInternalElements={false}
getInputProps: (inputProps?: InputProps) => InputProps; // Only used when withInternalElements={false}
inputRef: React.RefObject<HTMLInputElement | null>;
```

#### FileState Type

```ts
type FileState = {
 file: File | FileMeta; // File object or file metadata
 id: string; // Unique ID for the file
 preview: string | undefined; // Preview URL for the file
};
```

## Best Practices

### Accessibility

- Add appropriate ARIA attributes to the drop zone area
- Ensure keyboard navigation by providing focusable elements
- Add text instructions for screen reader users
- Add appropriate error announcements for validation failures

## Implementation Notes

### Preview URL Management

The component creates preview URLs using `URL.createObjectURL` and cleans them up when files are removed or when the component unmounts.

### File Validation Flow

1. Files are checked against `allowedFileTypes`, `maxFileSize`, etc.
2. If provided, custom validator function runs (supports both sync and async)
3. For async validators, the component waits for the Promise to resolve
4. Errors are collected and made available in state
5. Callbacks fire for successes and errors

### Implementation Modes

Choose between two implementation approaches:

1. **Standard Mode** (`withInternalElements={true}`):

   ```tsx
   <DropZone.Root>
     {({ dropZoneState }) => (
       // Just handle the UI inside - the container and input are created for you
       <div>Your upload UI here</div>
     )}
   </DropZone.Root>
   ```

2. **Custom DOM Mode** (`withInternalElements={false}`):

   ```tsx
   <DropZone.Root withInternalElements={false}>
     {({ getRootProps, getInputProps }) => (
       // Create your own container and input elements
       <div {...getRootProps()}>
         <input {...getInputProps()} />
         <div>Your upload UI here</div>
       </div>
     )}
   </DropZone.Root>
   ```
