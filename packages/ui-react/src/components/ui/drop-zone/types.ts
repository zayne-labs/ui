import type {
	FileMeta,
	FileValidationErrorContext,
	FileValidationHooksAsync,
	FileValidationSettingsAsync,
} from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { Awaitable } from "@zayne-labs/toolkit-type-helpers";
import type { FileItemContextType, useDropZoneStoreContext } from "./drop-zone-context";
import type { createDropZoneStore } from "./drop-zone-store";

export type FileState = {
	/**
	 *  File object or file metadata
	 */
	file: File | FileMeta;
	/**
	 *  Unique ID for the file
	 */
	id: string;
	/**
	 *  Preview URL for the file
	 *  - Will be undefined if `disallowPreviewForNonImageFiles` is set to `true` and the file is not an image
	 *  - Can also be undefined if `URL.createObjectURL` fails
	 */
	preview: string | undefined;
};

type RecordForDataAttr = Record<`data-${string}`, unknown>;

export type PartProps = {
	container: {
		input: InferProps<HTMLElement>;
		output: InferProps<HTMLElement>;
	};
	fileGroup: {
		input: InferProps<"ul"> & RecordForDataAttr & { orientation?: "horizontal" | "vertical" };
		output: InferProps<"ul"> & RecordForDataAttr;
	};
	fileItem: {
		input: InferProps<"li"> & RecordForDataAttr;
		output: InferProps<"li"> & RecordForDataAttr;
	};
	fileItemDelete: {
		input: InferProps<"button"> & Partial<Pick<FileItemContextType, "fileItemOrID">> & RecordForDataAttr;
		output: InferProps<"button"> & RecordForDataAttr;
	};
	fileItemProgress: {
		input: InferProps<"div"> & RecordForDataAttr;
		output: InferProps<"div"> & RecordForDataAttr;
	};
	input: {
		input: InferProps<"input"> & RecordForDataAttr;
		output: InferProps<"input"> & RecordForDataAttr;
	};
	trigger: {
		input: InferProps<"button"> & RecordForDataAttr;
		output: InferProps<"button"> & RecordForDataAttr;
	};
};

export type PartInputProps = {
	[Key in keyof PartProps]: PartProps[Key]["input"];
};

export type DropZonePropGetters = {
	[Key in keyof PartProps as `get${Capitalize<Key>}Props`]: (
		props: PartProps[Key]["input"]
	) => PartProps[Key]["output"];
};

export type DropZoneState = {
	/**
	 *  List of validation errors
	 */
	errors: FileValidationErrorContext[];
	/**
	 *  List of files with their preview URLs and unique IDs
	 */
	fileStateArray: FileState[];
	/**
	 *  Whether or not a file is currently being dragged over the drop zone
	 */
	isDraggingOver: boolean;
};

export type DropZoneActions = {
	addFiles: (files: File[] | FileList | null) => Awaitable<void>;
	clearErrors: () => void;
	clearFiles: () => void;
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => Awaitable<void>;
	handleDragEnter: (event: React.DragEvent<HTMLElement>) => void;
	handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
	handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
	handleDrop: (event: React.DragEvent<HTMLElement>) => Awaitable<void>;
	openFilePicker: () => void;
	removeFile: (fileItemOrID: FileItemContextType["fileItemOrID"]) => void;
};

export type UseDropZoneResult = {
	inputRef: React.RefObject<HTMLInputElement | null>;
	propGetters: DropZonePropGetters;
	storeApi: ReturnType<typeof createDropZoneStore>;
	useDropZoneStore: typeof useDropZoneStoreContext;
};

export type UseDropZoneProps = FileValidationSettingsAsync & {
	/**
	 *  Whether to disable the internal state subscription such as drag over state etc for setting things like data attributes
	 *  - This is useful if you want to subscribe to the state yourself
	 *  @default false
	 */
	disableInternalStateSubscription?: boolean;

	/**
	 * Whether to disallow preview for non-image files
	 * @default true
	 */
	disablePreviewForNonImageFiles?: boolean;

	/**
	 * Extra props to pass to various parts of the dropzone
	 */
	extraProps?: PartProps;

	/**
	 * Initial files to populate the drop zone
	 */
	initialFiles?: FileMeta | FileMeta[] | null;

	/**
	 * Whether to allow multiple files to be uploaded
	 */
	multiple?: boolean;

	/**
	 * Callback function to be called when internal files state changes
	 */
	onFilesChange?: (context: Pick<DropZoneState, "fileStateArray">) => void;

	/**
	 * Callback function to be called when new files are uploaded
	 */
	onUpload?: (context: Pick<DropZoneState, "fileStateArray">) => Awaitable<void>;

	/**
	 * Callback function to be called on each file upload as they occur
	 */
	onUploadError?: FileValidationHooksAsync["onError"];

	/**
	 * Callback function to be called once after all file upload errors have occurred
	 */
	onUploadErrorCollection?: FileValidationHooksAsync["onErrorCollection"];

	/**
	 * Callback function to be called on file upload success
	 */
	onUploadSuccess?: FileValidationHooksAsync["onSuccess"];

	/**
	 * Whether clicking the drop zone area will open the default file picker or not
	 *
	 * @default true
	 */
	shouldOpenFilePickerOnAreaClick?: boolean;

	/**
	 * Custom validation function.
	 *
	 * If the function returns false, the file will be rejected
	 *
	 */
	validator?: FileValidationSettingsAsync["validator"];
};
