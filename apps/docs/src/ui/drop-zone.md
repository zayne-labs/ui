# DropZone

A comprehensive file upload component with drag-and-drop support, validation, and progress tracking.

## Features

- 🎯 **Zero Default Styling** - Total control over your upload UI
- 📤 **Drag & Drop** - Native drag-and-drop file handling
- 🖼️ **File Previews** - Built-in preview generation for images and file icons
- ✅ **Validation** - File type, size, and count checks with custom validators
- 📊 **Progress Tracking** - Built-in upload progress indicators
- 🎛️ **Flexible API** - Use as components or hook
- 🔒 **Type-Safe** - Full TypeScript support

## Installation

```bash
pnpm add @zayne-labs/ui-react
```

## Basic Usage

```tsx
import { DropZone } from "@zayne-labs/ui-react/ui/drop-zone";

function FileUpload() {
	return (
		<DropZone.Root allowedFileTypes={[".jpg", ".png", ".pdf"]} maxFileSize={{ mb: 5 }} multiple={true}>
			<DropZone.Area className="rounded-lg border-2 border-dashed border-gray-300 p-8">
				<p className="text-center text-gray-600">Drop files here or click to browse</p>
			</DropZone.Area>

			<DropZone.FileList className="mt-4 space-y-2">
				{(ctx) => (
					<DropZone.FileItem
						key={ctx.fileState.id}
						fileState={ctx.fileState}
						className="flex items-center gap-4 rounded border p-3"
					>
						<DropZone.FileItemPreview className="h-12 w-12" />
						<DropZone.FileItemMetadata className="flex-1" />
						<DropZone.FileItemProgress className="w-20" />
						<DropZone.FileItemDelete className="text-red-500 hover:text-red-700">
							✕
						</DropZone.FileItemDelete>
					</DropZone.FileItem>
				)}
			</DropZone.FileList>
		</DropZone.Root>
	);
}
```

## Hook Usage

For more control, use the hook directly:

```tsx
import { useDropZone } from "@zayne-labs/ui-react/ui/drop-zone";

function CustomFileUpload() {
	const { propGetters, useDropZoneStore } = useDropZone({
		allowedFileTypes: [".jpg", ".png"],
		maxFileSize: { mb: 5 },
		multiple: true,
	});

	const fileStateArray = useDropZoneStore((store) => store.fileStateArray);
	const isDraggingOver = useDropZoneStore((store) => store.isDraggingOver);
	const storeActions = useDropZoneStore((store) => store.actions);

	return (
		<div {...propGetters.getContainerProps({ className: "border-2 border-dashed p-4" })}>
			<input {...propGetters.getInputProps()} />

			<div className="text-center">
				{isDraggingOver ?
					<p>Drop files here!</p>
				:	<p>Drop files or click to browse</p>}
			</div>

			<div className="mt-4 grid grid-cols-4 gap-4">
				{fileStateArray.map((fileState) => (
					<div key={fileState.id} className="relative">
						<img
							src={fileState.preview}
							alt={fileState.file.name}
							className="aspect-square w-full rounded object-cover"
						/>
						<button
							onClick={() => storeActions.removeFile({ fileStateOrID: fileState })}
							className="absolute right-2 top-2 h-6 w-6 rounded-full bg-red-500 text-white"
						>
							✕
						</button>
					</div>
				))}
			</div>
		</div>
	);
}
```

## File Upload with Progress

```tsx
import { useDropZone, type UseDropZoneProps, DropZoneError } from "@zayne-labs/ui-react/ui/drop-zone";

function UploadWithProgress() {
	const handleUpload: UseDropZoneProps["onUpload"] = async (ctx) => {
		const { fileStateArray, onProgress, onSuccess, onError } = ctx;

		for (const fileState of fileStateArray) {
			try {
				// Simulate upload progress
				for (let progress = 0; progress <= 100; progress += 10) {
					await new Promise((resolve) => setTimeout(resolve, 100));
					onProgress({ fileStateOrID: fileState.id, progress });
				}

				onSuccess({ fileStateOrID: fileState.id });
			} catch (error) {
				onError({
					error: new DropZoneError(
						{
							file: fileState.file,
							message: `File: ${fileState.file.name} upload did not finish successfully`,
						},
						{ cause: error }
					),
					fileStateOrID: fileState,
				});
			}
		}
	};

	return (
		<DropZone.Root allowedFileTypes={[".jpg", ".png", ".pdf"]} maxFileSize={10} onUpload={handleUpload}>
			<DropZone.Area>
				<p>Drop files to upload</p>
			</DropZone.Area>

			<DropZone.FileList>
				{({ fileState }) => (
					<DropZone.FileItem key={fileState.id} fileState={fileState}>
						<DropZone.FileItemPreview />
						<DropZone.FileItemMetadata />
						<DropZone.FileItemProgress variant="linear" />
						<DropZone.FileItemDelete />
					</DropZone.FileItem>
				)}
			</DropZone.FileList>

			<DropZone.FileClear>Clear All Files</DropZone.FileClear>
		</DropZone.Root>
	);
}
```

## Custom File Previews

```tsx
function CustomPreviews() {
	return (
		<DropZone.Root allowedFileTypes={[".jpg", ".png", ".pdf"]}>
			<DropZone.Area>
				<p>Drop files here</p>
			</DropZone.Area>

			<DropZone.FileList>
				{({ fileState }) => (
					<div key={fileState.id} className="rounded-lg border p-4">
						<DropZone.FileItemPreview fileState={fileState} className="h-32 w-full">
							{({ fileType, fileExtension }) =>
								fileType.startsWith("image/") ?
									<img
										src={fileState.preview}
										alt={fileState.file.name}
										className="h-full w-full rounded object-cover"
									/>
								:	<div className="flex h-full w-full items-center justify-center rounded bg-gray-100">
										📄 {fileExtension.toUpperCase()}
									</div>
							}
						</DropZone.FileItemPreview>
						<DropZone.FileItemMetadata className="mt-2" />
					</div>
				)}
			</DropZone.FileList>
		</DropZone.Root>
	);
}
```

## Validation

### Built-in Validation

```tsx
<DropZone.Root
	// File types (extensions or MIME types)
	allowedFileTypes={[".jpg", ".png", "image/*"]}
	// Size in MB
	maxFileSize={5}
	// Max number of files
	maxFileCount={10}
	// Prevent duplicates (default: true)
	rejectDuplicateFiles={true}
	// Validation callbacks
	onValidationError={(error) => console.log("File error:", error)}
	onValidationSuccess={(ctx) => console.log("File success:", ctx.fileStateArray)}
>
	{/* Your UI */}
</DropZone.Root>
```

### Custom Validation

The custom validation can be either sync or async. The context object contains the file and the store actions.

Example: Custom validation file with server API

```tsx
function CustomValidation() {
	return (
		<DropZone.Root
			allowedFileTypes={[".jpg", ".png"]}
			validator={async ({ file }) => {
				const formData = new FormData();
				formData.append("file", file);
				try {
					const response = await fetch("/api/validate-file", {
						method: "POST",
						body: formData,
					});

					const result = await response.json();
					return result.isValid;
				} catch (error) {
					console.error("Validation failed:", error);
					return false;
				}
			}}
		>
			<DropZone.Area>
				<p>Drop images (min 800x600)</p>
			</DropZone.Area>
		</DropZone.Root>
	);
}
```

## Component API

### DropZone.Root

Main container that provides drop zone context.

**Props:**

- `allowedFileTypes?: string[]` - Allowed file extensions/MIME types
- `maxFileSize?: number` - Maximum file size in MB
- `maxFileCount?: number` - Maximum number of files
- `multiple?: boolean` - Allow multiple file selection
- `disabled?: boolean` - Disable the drop zone
- `validator?: (context: { file: File }) => boolean | Promise<boolean>` - Custom validation
- `onUpload?: (context) => Promise<void>` - Upload handler with progress callbacks
- `onFilesChange?: (context) => void` - Files change callback
- `children: React.ReactNode` - Drop zone content

### DropZone.Area

Combined container and input for easy usage.

**Props:**

- `className?: string` - CSS classes
- `children: React.ReactNode` - Area content
- `...props` - Passed to container element

### DropZone.Container

Drop target container that handles drag events.

**Props:**

- `asChild?: boolean` - Use child as container element
- `className?: string` - CSS classes
- `...props` - Passed to container element

### DropZone.Input

File input element.

**Props:**

- `asChild?: boolean` - Use child as input element
- `...props` - Passed to input element

### DropZone.FileList

Container for displaying uploaded files.

**Props:**

- `renderMode?: "per-item" | "manual-list"` - Rendering mode (default: "per-item")
   - `"per-item"`: Render function called for each file individually with `(ctx) => { fileState, index, array, actions }`
   - `"manual-list"`: Render function called once with all files `(ctx) => { fileStateArray, actions }`
- `forceMount?: boolean` - Always render even when empty
- `children: React.ReactNode | ((context) => React.ReactNode)` - List content or render function

### DropZone.FileItem

Individual file item component.

**Props:**

- `fileState: FileState` - File state object
- `asChild?: boolean` - Use child as item element
- `...props` - Passed to item element

### DropZone.FileItemPreview

File preview component with automatic type detection.

**Props:**

- `fileState?: FileState` - File state (inherited from FileItem if not provided)
- `renderPreview?: boolean | RenderPreview` - Custom preview configuration
- `asChild?: boolean` - Use child as preview element
- `...props` - Passed to preview element

### DropZone.FileItemMetadata

Displays file name and size information.

**Props:**

- `fileState?: FileState` - File state (inherited from FileItem if not provided)
- `size?: "default" | "sm"` - Size variant
- `classNames?: { name?: string; size?: string }` - CSS classes for parts
- `children?: React.ReactNode | ((context) => React.ReactNode)` - Custom content
- `...props` - Passed to metadata element

### DropZone.FileItemProgress

Progress indicator for file uploads.

**Props:**

- `fileState?: FileState` - File state (inherited from FileItem if not provided)
- `variant?: "linear" | "circular" | "fill"` - Progress style
- `size?: number` - Size for circular variant
- `forceMount?: boolean` - Always show progress
- `...props` - Passed to progress element

### DropZone.FileItemDelete

Delete button for individual files.

**Props:**

- `fileStateOrID?: FileState | string` - File to delete (inherited from FileItem if not provided)
- `asChild?: boolean` - Use child as delete element
- `...props` - Passed to delete element

### DropZone.FileClear

Button to clear all files.

**Props:**

- `forceMount?: boolean` - Always show button
- `asChild?: boolean` - Use child as clear element
- `...props` - Passed to clear element

## Context Access

Use the context hook for advanced usage:

```tsx
import { useDropZoneStoreContext } from "@zayne-labs/ui-react/ui/drop-zone";

function CustomComponent() {
	const fileStateArray = useDropZoneStoreContext((state) => state.fileStateArray);
	const actions = useDropZoneStoreContext((state) => state.actions);
	const isDraggingOver = useDropZoneStoreContext((state) => state.isDraggingOver);

	return (
		<div>
			<p>Files: {fileStateArray.length}</p>
			<p>Dragging: {isDraggingOver ? "Yes" : "No"}</p>
			<button onClick={() => actions.clearFiles()}>Clear All</button>
		</div>
	);
}
```

## Styling

Components use data attributes for styling:

```css
/* Drop zone container */
[data-scope="drop-zone"][data-part="container"] {
	border: 2px dashed #d1d5db;
	border-radius: 0.5rem;
	padding: 2rem;
}

/* Dragging state */
[data-scope="drop-zone"][data-part="container"][data-drag-over="true"] {
	border-color: #3b82f6;
	background-color: #eff6ff;
}

/* File item */
[data-scope="drop-zone"][data-part="file-item"] {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 0.75rem;
	border: 1px solid #e5e7eb;
	border-radius: 0.375rem;
}
```

## Best Practices

1. **Provide Clear Instructions** - Tell users what file types and sizes are accepted
2. **Show Progress** - Use progress indicators for uploads
3. **Handle Errors Gracefully** - Display validation errors clearly
4. **Accessibility** - Ensure keyboard navigation and screen reader support
5. **Performance** - Use `disableInternalStateSubscription` for large file lists if needed

## File State Type

```typescript
type FileState = {
	file: File;
	id: string;
	preview: string | undefined;
	progress: number; // 0-100
	status: "idle" | "uploading" | "success" | "error";
	error?: { message: string };
};
```
