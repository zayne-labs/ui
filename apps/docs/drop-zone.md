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
import { useDropZone } from '@zayne-labs/ui-react/drop-zone'

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
        {dropZoneState.isDragging ? (
          <p>Drop here...</p>
        ) : (
          <p>Drop files or click to browse</p>
        )}

        {/* Files */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          {dropZoneState.filesWithPreview.map(file => (
            <div key={file.id} className="relative group">
              <img
                src={file.preview}
                alt={file.file.name}
                className="w-full aspect-square object-cover"
              />
              <button
                onClick={() => dropZoneActions.removeFile(file.id)}
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

1. **Manual Mode** (for full control)

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
            {dropZoneState.isDragging ? 'Drop here!' : 'Drop files or click'}
          </p>

          {/* Files */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            {dropZoneState.filesWithPreview.map(file => (
              <img
                key={file.id}
                src={file.preview}
                alt={file.file.name}
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

### ImagePreview Slot

Since `DropZone.Root` renders the root element and input internally by default, you might want to render your preview outside of that container. That's where `DropZone.ImagePreview` comes in.

```tsx
function UploadWithSeparatePreview() {
  return (
    <DropZone.Root allowedFileTypes={[".jpg", ".png"]}>
      {({ dropZoneState, dropZoneActions }) => (
        <>
          {/* This renders inside the internal root div */}
          <p className="text-sm text-gray-500">
            Drop images or click • {dropZoneState.filesWithPreview.length} selected
          </p>

          {/* ImagePreview renders outside the root div and also accepts the same render props as the root if you need it */}
          <DropZone.ImagePreview>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {dropZoneState.filesWithPreview.map((file) => (
                  <div key={file.id} className="relative group">
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-full aspect-square object-cover rounded"
                    />
                    <button
                      onClick={() => dropZoneActions.removeFile(file)}
                      className="absolute top-2 right-2 bg-black/50 text-white
                        rounded-full p-1 opacity-0 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
          </DropZone.ImagePreview>
        </>
      )}
    </DropZone.Root>
  )
}
```

### Components

- **DropZone.Root** - The main wrapper component that provides drop zone context
- **DropZone.Container** - The drop target container that handles drag and drop events
- **DropZone.Input** - The file input element
- **DropZone.ImagePreview** - Image preview slot

Both `Container` and `Input` components support the `asChild` prop for custom rendering.

### Using Context

You can access the drop zone state and actions using the `useDropZoneContext` hook:

```tsx
function CustomDropZone() {
  const {
    dropZoneState,
    dropZoneActions,
    getContainerProps,
    getInputProps
  } = useDropZoneContext();

  return (
    <div {...getContainerProps({ className: "border-2 border-dashed p-4" })}>
      <input {...getInputProps()} />
      <p>Drop files here</p>
      {dropZoneState.isDragging && <p>Drop it!</p>}
    </div>
  );
}
```

### File Preview Example

```tsx
function FilePreview() {
  const { dropZoneState, dropZoneActions } = useDropZoneContext();

  return (
    <div className="mt-4 grid grid-cols-4 gap-2">
      {dropZoneState.filesWithPreview.map((file) => (
        <div key={file.id} className="relative group">
          <img
            src={file.preview}
            alt={file.name}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={() => dropZoneActions.removeFile(file)}
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
      <DropZone.ImagePreview>
        {dropZoneState.filesWithPreview.map((file) => (
          <img
            key={file.id}
            src={file.preview}
            alt={file.file.name}
            className="w-full aspect-square object-cover"
          />
        ))}
      </DropZone.ImagePreview>


  )}
</DropZone.Root>
```

### Custom Validator

Add your own validation with the `validator` prop:

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

## API Reference

For full details on these properties, see the Render Props section in the API Reference.

### DropZone Props

| Prop                              | Type                                                                                   | Default     | Description                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| `allowedFileTypes`                | `string[]`                                                                             | `-` | Allowed file extensions/MIME types (e.g., ['.jpg', '.png']) |
| `classNames`                      | `{ base?: string; isDragging?: string; input?: string }`                               | `-` | CSS classes for styling different parts                     |
| `disallowDuplicates`              | `boolean`                                                                              | `true`      | Whether to prevent duplicate file uploads                   |
| `disallowPreviewForNonImageFiles` | `boolean`                                                                              | `true`      | Whether to generate previews only for image files           |
| `extraInputProps`                 | `InputProps`                                                                           | `-` | Additional props for the internal input element             |
| `extraRootProps`                  | `RootProps`                                                                            | `-` | Additional props for the root element                       |
| `initialFiles`                    | `FileMeta \| FileMeta[] \| null`                                                       | `-` | Pre-populated files to show                                 |
| `maxFileCount`                    | `number`                                                                               | `-` | Maximum number of files allowed                             |
| `maxFileSize`                     | `number`                                                                               | `-` | Maximum file size in MB                                     |
| `multiple`                        | `boolean`                                                                              | `-` | Allow multiple file selection                               |
| `onFilesChange`                   | `(context: { filesWithPreview: FileWithPreview[] }) => void`                           | `-` | Callback when files state changes                           |
| `onRenderPropsChange`             | `(props: RenderProps) => void`                                                         | `-` | Callback when render props change                           |
| `onUpload`                        | `(context: { event: ChangeOrDragEvent; filesWithPreview: FileWithPreview[] }) => void` | `-` | Callback when files are uploaded                            |
| `onUploadError`                   | `(error: FileValidationErrorContext) => void`                                          | `-` | Callback for individual file validation errors              |
| `onUploadErrors`                  | `(errors: FileValidationErrorContext[]) => void`                                       | `-` | Callback after all validation errors                        |
| `onUploadSuccess`                 | `(file: File) => void`                                                                 | `-` | Callback when a file passes validation                      |
| `validator`                       | `(context: { file: File }) => boolean`                                                 | `-` | Custom file validation function                             |
| `children`                        | `React.ReactNode \| ((props: RenderProps) => React.ReactNode)`                         | `-` | Content or render function                                  |
| `render`                          | `(props: RenderProps) => React.ReactNode`                                              | `-` | Alternative render function                                 |
| `withInternalElements`            | `boolean`                                                                              | `true`      | Whether to include internal root and input elements         |

### DropZone.ImagePreview

A slot component for displaying image previews separately from the main drop zone UI.

**Props:**

Standard React props with a special slot behavior that positions it in the component tree.

### Render Props

The render function receives the following props:

#### State

```ts
dropZoneState: {
  errors: FileValidationErrorContext[];
  filesWithPreview: FileWithPreview[];
  isDragging: boolean;
}
```

#### Actions

```ts
dropZoneActions: {
  addFiles: (fileList: File[] | FileList | null, event?: ChangeOrDragEvent) => void;
  clearErrors: () => void;
  clearFiles: () => void;
  handleDragEnter: (event: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
  handleFileUpload: (event: ChangeOrDragEvent) => void;
  openFilePicker: () => void;
  removeFile: (fileToRemoveOrId: string | FileWithPreview) => void;
}
```

#### Helper Functions

The following functions are only needed when `withInternalElements={false}`:

```ts
getRootProps: (rootProps?: RootProps) => RootProps; // Only used when withInternalElements={false}
getInputProps: (inputProps?: InputProps) => InputProps; // Only used when withInternalElements={false}
inputRef: React.RefObject<HTMLInputElement | null>;
```

#### FileWithPreview Type

```ts
type FileWithPreview = {
 file: File | FileMeta; // File object or file metadata
 id: string; // Unique ID for the file
 preview: string | -; // Preview URL for the file
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
2. If provided, custom validator function runs
3. Errors are collected and made available in state
4. Callbacks fire for successes and errors

### Implementation Modes

Choose between two implementation approaches:

1. **Standard Mode** (`withInternalElements={true}`):

   ```tsx
   <DropZone>
     {({ dropZoneState }) => (
       // Just handle the UI inside - the container and input are created for you
       <div>Your upload UI here</div>
     )}
   </DropZone>
   ```

2. **Custom DOM Mode** (`withInternalElements={false}`):

   ```tsx
   <DropZone withInternalElements={false}>
     {({ getRootProps, getInputProps }) => (
       // Create your own container and input elements
       <div {...getRootProps()}>
         <input {...getInputProps()} />
         <div>Your upload UI here</div>
       </div>
     )}
   </DropZone>
   ```
