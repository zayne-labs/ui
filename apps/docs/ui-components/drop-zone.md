# DropZone

A file upload solution with a low-level hook (`useDropZone`) and a component wrapper that supports drag and drop with no default styling.

## Overview

The DropZone module provides file uploads with drag and drop support, validation, and preview generation. Use the included component for quick implementation or the `useDropZone` hook for more control. Both approaches give you complete freedom over styling.

## Key Features

- **Drag and Drop Support** - Intuitive file uploads via drag and drop
- **File Validation** - Built-in validation for file types, sizes, and counts
- **Preview Generation** - Automatic preview URLs for images and other file types
- **Multiple File Support** - Handle single or multiple file uploads
- **Duplicate Detection** - Optional prevention of duplicate file uploads
- **Error Handling** - Comprehensive error reporting and management
- **Zero Styling by Default** - Complete freedom to design your upload UI
- **Fully Controlled API** - Extensive render props to build custom UIs
- **Accessibility Ready** - Built with a11y best practices in mind
- **Slot-Based Architecture** - Flexible composition through component slots
- **Type Safety** - Improved TypeScript support throughout the API

## Using the Hook Directly

For more control, use the `useDropZone` hook directly. This lets you build custom upload interfaces and integrate with other components.

### When to Use the Hook Directly

- **Custom UI**: When you need to build a completely custom upload interface
- **Form Integration**: When working with form libraries or complex multi-step forms
- **State Sharing**: When sharing upload state with other parts of your app
- **Multiple Upload Areas**: When coordinating several upload zones in one view
- **Advanced Validation**: When implementing complex custom validation logic

### Basic Hook Usage

```tsx
import { useDropZone } from "@zayne-labs/ui-react/drop-zone";

function BasicDropZoneWithHook() {
  const {
    dropZoneState,   // Contains files, errors, drag state
    dropZoneActions, // Methods to add/remove files
    getRootProps,    // Props for container element
    getInputProps    // Props for file input
  } = useDropZone({
    allowedFileTypes: [".jpg", ".png"],
    maxFileSize: 5, // 5MB
    disallowPreviewForNonImageFiles: true // Only generate previews for images
  });

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag files here or click to browse</p>
      </div>

      {/* Display file list */}
      {dropZoneState.filesWithPreview.map(file => (
        <div key={file.id}>
          {file.file.name}
          <button onClick={() => dropZoneActions.removeFile(file.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### Form Integration

Here's how to combine the hook with form libraries:

```tsx
import { useDropZone } from "@zayne-labs/ui-react/drop-zone";
import { useForm } from "some-form-library";

function FormWithFileUpload() {
  const { register, handleSubmit } = useForm();
  const { dropZoneState, getRootProps, getInputProps } = useDropZone({
    allowedFileTypes: [".pdf", ".docx"]
  });

  const onSubmit = (formData) => {
    // Combine form data with files
    const payload = {
      ...formData,
      files: dropZoneState.filesWithPreview.map(f => f.file)
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Attach documents • {dropZoneState.filesWithPreview.length} files</p>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}
```

The hook returns state, actions, and helper functions that you can use in your component. Check the API Reference for complete details.

## Installation

```bash
# Using pnpm (recommended)
pnpm add @zayne-labs/ui-react

# Using npm
npm install @zayne-labs/ui-react

# Using yarn
yarn add @zayne-labs/ui-react
```

## Basic Usage

The DropZone components use a slot-based architecture for flexible composition:

```tsx
import {
  DropZoneRoot,
  DropZoneImagePreview,
  DropZoneErrors
} from "@zayne-labs/ui-react/drop-zone";

function BasicFileUpload() {
  return (
    <DropZoneRoot
      allowedFileTypes={[".jpg", ".png"]}
      maxFileSize={5}
      multiple
    >
      {({ dropZoneState, dropZoneActions }) => (
        <div className="border-2 border-dashed p-4">
          <p>Click to upload or drag files here</p>

          {/* File list */}
          {dropZoneState.filesWithPreview.map(file => (
            <div key={file.id}>
              {file.file.name}
              <button onClick={() => dropZoneActions.removeFile(file.id)}>
                Remove
              </button>
            </div>
          ))}

          {/* Image previews in a dedicated slot */}
          <DropZoneImagePreview>
            {dropZoneState.filesWithPreview.filter(file =>
              file.file.type.startsWith('image/')
            ).map(file => (
              <img
                key={file.id}
                src={file.preview}
                alt={file.file.name}
                className="w-32 h-32 object-cover m-2"
              />
            ))}
          </DropZoneImagePreview>

          {/* Error messages in a dedicated slot */}
          <DropZoneErrors>
            {dropZoneState.errors.map((error, i) => (
              <p key={i} className="text-red-500">{error.message}</p>
            ))}
          </DropZoneErrors>
        </div>
      )}
    </DropZoneRoot>
  );
}
```

The component handles input creation, event binding, and file processing automatically.

## Error Handling and Display

Effective error handling is essential for a good file upload experience. DropZone provides comprehensive error handling to help users understand what went wrong during file upload attempts.

### Validation Flow and Error Types

When files are added to DropZone, they go through a validation sequence in this order:

1. **Max File Count Check**: Ensures the total number of files doesn't exceed `maxFileCount`
2. **File Type Validation**: Verifies files match the `allowedFileTypes` (supports both MIME types and extensions)
3. **File Size Check**: Confirms files don't exceed the `maxFileSize` limit
4. **Duplicate Detection**: Prevents files with the same name and size when `disallowDuplicates` is enabled
5. **Custom Validation**: Runs any custom validator function provided

> **Note**: Duplicate detection matches files by both name and size (when available). For File objects and FileMeta objects with size information, both name and size must match. If size information isn't available, only the name is used for comparison.

For each validation failure, an error is added to the `dropZoneState.errors` array and the `onUploadError` callback fires immediately. After all validations complete, the `onUploadErrors` callback fires with the complete errors collection.

### Error Structure

Each error is a `FileValidationErrorContext` object with this structure:

```ts
type FileValidationErrorContext = {
  cause: 'maxFileCount' | 'allowedFileTypes' | 'maxFileSize' | 'disallowDuplicates' | 'validator';
  code: 'too-many-files' | 'file-invalid-type' | 'file-too-large' | 'duplicate-file' | 'custom-validation-failed';
  file: File;            // The file that failed validation
  message: string;       // Human-readable error explanation
};
```

This structure gives you multiple ways to handle errors:

- `code` - Identify the type of validation failure
- `cause` - Identify which validation rule triggered the error
- `file` - Access the problematic file
- `message` - Display a user-friendly explanation

### File Type Validation Details

The `allowedFileTypes` prop supports two formats:

- MIME types (e.g., 'image/jpeg', 'application/pdf')
- File extensions (e.g., '.jpg', 'png') - extension matching is case-insensitive and dots are optional

The validation will:

1. For MIME types (containing '/'), perform exact matching against the file's type
2. For extensions, compare against the file's extension case-insensitively

### Basic Error Display

This example shows a simple error list with file names:

```tsx
<DropZone allowedFileTypes={[".jpg", ".png"]} maxFileSize={2}>
  {({ dropZoneState }) => (
    <div className="border-2 border-dashed p-4">
      <p>Drop images here (JPG/PNG only, max 2MB)</p>

      {/* File list display */}

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
    </div>
  )}
</DropZone>
```

### Categorizing Errors by Type

Group errors by their `code` property for more contextual handling:

```tsx
function ErrorsByType({ dropZoneState }) {
  // Group errors by their code property
  const sizeErrors = dropZoneState.errors.filter(e => e.code === 'file-too-large');
  const typeErrors = dropZoneState.errors.filter(e => e.code === 'file-invalid-type');
  const countErrors = dropZoneState.errors.filter(e => e.code === 'too-many-files');
  const duplicateErrors = dropZoneState.errors.filter(e => e.code === 'duplicate-file');
  const customErrors = dropZoneState.errors.filter(e => e.code === 'custom-validation-failed');

  return (
    <div className="error-container mt-3">
      {sizeErrors.length > 0 && (
        <div className="error-group mb-4">
          <h5 className="font-bold text-red-700">Size limit exceeded</h5>
          <p>These files exceed the size limit:</p>
          <ul className="list-disc pl-5">
            {sizeErrors.map((error, i) => (
              <li key={i}>{error.file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {typeErrors.length > 0 && (
        <div className="error-group mb-4">
          <h5 className="font-bold text-red-700">Invalid file types</h5>
          <p>Only JPG and PNG files are accepted:</p>
          <ul className="list-disc pl-5">
            {typeErrors.map((error, i) => (
              <li key={i}>{error.file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {duplicateErrors.length > 0 && (
        <div className="error-group mb-4">
          <h5 className="font-bold text-red-700">Duplicate files</h5>
          <p>These files have already been selected:</p>
          <ul className="list-disc pl-5">
            {duplicateErrors.map((error, i) => (
              <li key={i}>{error.file.name}</li>
            ))}
          </ul>
        </div>
      )}

      {countErrors.length > 0 && (
        <div className="error-group mb-4">
          <h5 className="font-bold text-red-700">Too many files</h5>
          <p>{countErrors[0].message}</p>
        </div>
      )}

      {customErrors.length > 0 && (
        <div className="error-group mb-4">
          <h5 className="font-bold text-red-700">Custom validation failed</h5>
          <ul className="list-disc pl-5">
            {customErrors.map((error, i) => (
              <li key={i}>
                {error.file.name}: {error.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Contextual Error Messages

Create user-friendly messages based on error type:

```tsx
function ErrorMessage({ error }) {
  // Generate helpful error messages based on error properties
  switch (error.code) {
    case 'file-too-large':
      return (
        <div className="flex items-center text-red-600">
          <span className="mr-2">
            <FileTooLargeIcon />
          </span>
          <span>
            <strong>{error.file.name}</strong> is too large.
            Maximum size is 2MB.
          </span>
        </div>
      );

    case 'file-invalid-type':
      return (
        <div className="flex items-center text-red-600">
          <span className="mr-2">
            <FileTypeIcon />
          </span>
          <span>
            <strong>{error.file.name}</strong> has an invalid file type.
            Only JPG and PNG files are allowed.
          </span>
        </div>
      );

    case 'duplicate-file':
      return (
        <div className="flex items-center text-red-600">
          <span className="mr-2">
            <DuplicateIcon />
          </span>
          <span>
            <strong>{error.file.name}</strong> has already been selected.
          </span>
        </div>
      );

    case 'too-many-files':
      return (
        <div className="flex items-center text-red-600">
          <span className="mr-2">
            <TooManyIcon />
          </span>
          <span>
            Maximum number of files exceeded.
          </span>
        </div>
      );

    case 'custom-validation-failed':
    default:
      return (
        <div className="flex items-center text-red-600">
          <span className="mr-2">
            <ErrorIcon />
          </span>
          <span>{error.message}</span>
        </div>
      );
  }
}

function ErrorMessageExample() {
  const handleUploadError = (error) => {
    console.log('File validation failed:', error);
  };

  const handleUploadErrors = (errors) => {
    console.log('All validation errors:', errors);
  };

  return (
    <DropZone
      allowedFileTypes={['.jpg', '.png']}
      maxFileSize={2}
      onUploadError={handleUploadError}
      onUploadErrors={handleUploadErrors}
    >
      {({ dropZoneState }) => (
        <div className="border-2 border-dashed p-4">
          <p>Drop images here (JPG/PNG only, max 2MB)</p>

          {/* File list here */}

          {/* Error messages with custom formatting */}
          {dropZoneState.errors.map((error, i) => (
            <ErrorMessage key={i} error={error} />
          ))}
        </div>
      )}
    </DropZone>
  );
}
```

### Managing Error State

`dropZoneActions.clearErrors()` allows you to reset the error state. This is useful for implementing dismissible error messages:

```tsx
function DismissibleErrorsExample() {
  return (
    <DropZone allowedFileTypes={[".jpg", ".png"]} maxFileSize={5}>
      {({ dropZoneState, dropZoneActions }) => (
        <div className="upload-container border-2 border-dashed p-4">
          <div className="upload-area">
            <p>Drop images here or click to browse</p>

            {/* File list display */}
            <div className="file-list">
              {dropZoneState.filesWithPreview.map(file => (
                <div key={file.id} className="file-item">
                  {file.file.name}
                  <button
                    onClick={() => dropZoneActions.removeFile(file.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Error display with dismiss option */}
          {dropZoneState.errors.length > 0 && (
            <div className="error-container mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <div className="error-header flex justify-between items-center mb-2">
                <h4 className="font-semibold text-red-700">
                  Upload failed ({dropZoneState.errors.length} {dropZoneState.errors.length === 1 ? 'error' : 'errors'})
                </h4>
                <button
                  onClick={() => dropZoneActions.clearErrors()}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Dismiss
                </button>
              </div>

              <ul className="error-list space-y-1 text-sm text-red-600 list-disc pl-5">
                {dropZoneState.errors.map((error, i) => (
                  <li key={i}>
                    <strong>{error.file.name}:</strong> {error.message}
                  </li>
                ))}
              </ul>

              <div className="error-actions mt-3 flex gap-2">
                <button
                  onClick={() => {
                    dropZoneActions.clearErrors();
                    dropZoneActions.openFilePicker();
                  }}
                  className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </DropZone>
  );
}
```

### Complete Error Handling Example

This example shows how to implement comprehensive error handling with different validation rules:

```tsx
function ComprehensiveFileUpload() {
  return (
    <DropZone
      allowedFileTypes={[".jpg", ".png", ".pdf"]}
      maxFileSize={10}
      maxFileCount={5}
      multiple
      disallowDuplicates
      validator={({ file }) => {
        // Custom validation example for images
        if (file.type.startsWith('image/')) {
          // For true async validation, you would use onUploadError
          // to provide a better error message after returning false

          // This is simplified for the example - in real code you would
          // need to handle async validation differently
          if (file.size < 100000) {
            // Proxy for image dimensions check
            return false; // Reject small images
          }
        }

        // For PDFs, limit page count (hypothetical example)
        if (file.type === 'application/pdf') {
          if (file.size > 5 * 1024 * 1024) {
            // Reject PDFs larger than 5MB (as they might have too many pages)
            return false;
          }
        }

        // Accept all other files that passed the built-in validations
        return true;
      }}
      onUploadError={(error) => {
        // Handle each error as it occurs
        console.error(`Error with ${error.file.name}: ${error.message} (${error.code})`);
      }}
      onUploadErrors={(errors) => {
        // Handle batch errors after all validation
        if (errors.length > 0) {
          // Group errors by type for reporting
          const errorsByType = {
            'file-too-large': errors.filter(e => e.code === 'file-too-large'),
            'file-invalid-type': errors.filter(e => e.code === 'file-invalid-type'),
            'custom-validation-failed': errors.filter(e => e.code === 'custom-validation-failed'),
            'duplicate-file': errors.filter(e => e.code === 'duplicate-file'),
            'too-many-files': errors.filter(e => e.code === 'too-many-files'),
          };

          // Generate summary report
          console.log('Upload validation issues:', errorsByType);
        }
      }}
    >
      {({ dropZoneState, dropZoneActions }) => (
        <div className="upload-container p-4 border-2 border-dashed rounded">
          <div className="upload-area">
            <h3 className="text-lg font-medium mb-2">Document Upload</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload up to 5 JPG, PNG or PDF files (max 10MB each)
            </p>

            <button
              onClick={() => dropZoneActions.openFilePicker()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Choose Files
            </button>

            {/* File list with previews */}
            {dropZoneState.filesWithPreview.length > 0 && (
              <div className="file-list mt-4 space-y-2">
                <h4 className="font-medium">Selected Files ({dropZoneState.filesWithPreview.length})</h4>
                <div className="grid grid-cols-2 gap-3">
                  {dropZoneState.filesWithPreview.map(file => (
                    <div key={file.id} className="file-item p-2 border rounded flex">
                      {file.preview ? (
                        <img src={file.preview} alt="" className="w-12 h-12 object-cover mr-2" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center mr-2">
                          <DocumentIcon />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="truncate text-sm">{file.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          onClick={() => dropZoneActions.removeFile(file.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error display by error type */}
            {dropZoneState.errors.length > 0 && (
              <div className="error-section mt-4 p-3 bg-red-50 border border-red-100 rounded">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-red-700">
                    Upload Failed ({dropZoneState.errors.length} {dropZoneState.errors.length === 1 ? 'error' : 'errors'})
                  </h4>
                  <button
                    onClick={() => dropZoneActions.clearErrors()}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="error-content divide-y divide-red-100">
                  {/* Size errors */}
                  {errorsByType['file-too-large'].length > 0 && (
                    <div className="py-2">
                      <h5 className="font-medium text-red-800 mb-1">Size limit exceeded</h5>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {errorsByType['file-too-large'].map((error, i) => (
                          <li key={i}>{error.file.name} ({(error.file.size / 1024 / 1024).toFixed(1)}MB)</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Type errors */}
                  {errorsByType['file-invalid-type'].length > 0 && (
                    <div className="py-2">
                      <h5 className="font-medium text-red-800 mb-1">Invalid file types</h5>
                      <p className="text-sm mb-1">Only JPG, PNG and PDF files are allowed.</p>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {errorsByType['file-invalid-type'].map((error, i) => (
                          <li key={i}>{error.file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Duplicate errors */}
                  {errorsByType['duplicate-file'].length > 0 && (
                    <div className="py-2">
                      <h5 className="font-medium text-red-800 mb-1">Duplicate files</h5>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {errorsByType['duplicate-file'].map((error, i) => (
                          <li key={i}>{error.file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Count errors */}
                  {errorsByType['too-many-files'].length > 0 && (
                    <div className="py-2">
                      <p className="text-sm font-medium text-red-800">
                        {errorsByType['too-many-files'][0].message}
                      </p>
                    </div>
                  )}

                  {/* Custom validation errors */}
                  {errorsByType['custom-validation-failed'].length > 0 && (
                    <div className="py-2">
                      <h5 className="font-medium text-red-800 mb-1">Custom validation failed</h5>
                      <ul className="text-sm space-y-1 list-disc pl-5">
                        {errorsByType['custom-validation-failed'].map((error, i) => (
                          <li key={i}>{error.file.name}: {error.message}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

## Component Structure

The DropZone module consists of several components that can be used together or independently:

- **DropZoneRoot** - The main container that handles file interactions and provides context
- **DropZoneImagePreview** - A slot component for displaying image previews separately
- **DropZoneErrors** - A slot component for displaying validation errors

## Advanced Usage

### Custom Elements

To control the DOM structure of your drop zone, set `withInternalElements={false}` and provide your own input element and container:

```tsx
import { DropZoneRoot } from "@zayne-labs/ui-react/drop-zone";

function CustomElementsExample() {
  return (
    <DropZoneRoot
      allowedFileTypes={[".jpg", ".png"]}
      maxFileSize={2}
      withInternalElements={false}
    >
      {({ dropZoneState, dropZoneActions, getRootProps, getInputProps }) => {
        const { isDragging, filesWithPreview, errors } = dropZoneState;

        return (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 rounded ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            {/* Custom input element with spread props */}
            <input
              {...getInputProps()}
              className="hidden"
            />

            <div className="text-center">
              <p className="mb-4">
                {isDragging
                  ? "Drop files here..."
                  : "Drag and drop files or click to browse"
                }
              </p>

              <button
                type="button"
                onClick={() => dropZoneActions.openFilePicker()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Select Files
              </button>
            </div>

            {/* File list */}
            {filesWithPreview.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-2">Selected Files</h4>
                <ul className="space-y-2">
                  {filesWithPreview.map(file => (
                    <li key={file.id} className="flex items-center">
                      {file.preview && (
                        <img
                          src={file.preview}
                          alt=""
                          className="w-10 h-10 object-cover mr-3 rounded"
                        />
                      )}
                      <span className="flex-1">{file.file.name}</span>
                      <button
                        type="button"
                        onClick={() => dropZoneActions.removeFile(file.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error messages */}
            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
                <h4 className="font-medium mb-1">Upload Failed:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {errors.map((error, i) => (
                    <li key={i}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      }}
    </DropZoneRoot>
  );
}
```

### Custom Validation

```tsx
import { DropZone } from '@zayne-labs/ui-react/ui';

function CustomValidationExample() {
  return (
    <DropZone
      allowedFileTypes={['.jpg', '.png']}
      validator={({ file }) => {
        // Custom validation: check image dimensions
        // Note: For async validation, return false immediately
        // and use onError callback to provide custom message
        if (file.type.startsWith('image/')) {
          // Check dimensions synchronously for this example
          // In real code, you might need to handle this differently
          const img = new Image();
          img.src = URL.createObjectURL(file);

          // For demo purposes - normally you'd need async handling
          if (file.size < 30000) { // Using size as proxy for dimensions
            return false; // Reject small images
          }
        }
        return true; // Accept all other files
      }}
    >
      {({ dropZoneState }) => (
        <div>
          <p>Upload images (min. 800x600px)</p>

          {dropZoneState.errors.map((error, i) => (
            <p key={i}>{error.message}</p>
          ))}
        </div>
      )}
    </DropZone>
  );
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

### Error Handling

Look at the Error Handling and Display section for detailed implementation.

### Batch File Validation with validatorForAllFiles

While the `validator` prop validates files individually, `validatorForAllFiles` allows you to validate all files as a complete set. This is useful for validations that need to consider the entire collection of files together.

#### How It Works

1. Individual files are first validated using built-in validations and the optional `validator` function
2. If all files pass individual validation, the `validatorForAllFiles` function runs once with all files
3. If the batch validation fails, all files are rejected with a single error message

#### Function Signature

```ts
type ValidatorForAllFilesFunction = (context: {
  files: File[]
}) => boolean | Promise<boolean>;
```

The function receives an array of all files that passed individual validation and should return:

- `true` to accept all files
- `false` to reject all files

It can also return a Promise for asynchronous validation.

#### When to Use

Use `validatorForAllFiles` when you need to:

- Validate relationships between multiple files
- Check that a required set of file types are included
- Ensure file names follow a pattern across the entire set
- Validate that the total size of all files is within limits
- Verify that uploaded files form a complete set (like all parts of a multi-part document)

#### Example: Validating Total Size

```tsx
<DropZone
  allowedFileTypes={[".jpg", ".png", ".pdf"]}
  maxFileSize={10} // Individual file size limit: 10MB
  multiple
  validator={({ file }) => {
    // Individual file validation
    return true;
  }}
  validatorForAllFiles={({ files }) => {
    // Calculate total size of all files
    const totalSizeInMB = files.reduce((sum, file) => sum + file.size / (1024 * 1024), 0);

    // Reject if total size exceeds 50MB
    if (totalSizeInMB > 50) {
      return false;
    }

    return true;
  }}
  onUploadError={(error) => {
    // Handle error with custom message if needed
    if (error.cause === 'validatorForAllFiles') {
      console.error("Total file size exceeds 50MB limit");
    }
  }}
>
  {({ dropZoneState }) => (
    <div className="border-2 border-dashed p-4">
      <p>Upload images and documents (max 50MB total)</p>

      {/* File list */}
      {dropZoneState.filesWithPreview.map(file => (
        <div key={file.id}>{file.file.name}</div>
      ))}

      {/* Error display */}
      {dropZoneState.errors.map((error, i) => (
        <p key={i} className="text-red-500">{error.message}</p>
      ))}
    </div>
  )}
</DropZone>
```

#### Example: Requiring Different File Types

```tsx
<DropZone
  allowedFileTypes={[".jpg", ".png", ".pdf", ".csv"]}
  multiple
  validatorForAllFiles={({ files }) => {
    // Check that there's at least one image and one CSV file
    const hasImage = files.some(file => file.type.startsWith("image/"));
    const hasCsv = files.some(file => file.name.endsWith(".csv"));

    return hasImage && hasCsv;
  }}
  onUploadError={(error) => {
    if (error.cause === 'validatorForAllFiles') {
      // Provide a helpful error message
      console.error("You must include at least one image and one CSV file");
    }
  }}
>
  {({ dropZoneState }) => (
    <div className="border-2 border-dashed p-4">
      <p>Upload at least one image and one CSV file</p>

      {/* Rest of your UI */}
    </div>
  )}
</DropZone>
```

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
