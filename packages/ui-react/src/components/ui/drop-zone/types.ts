/* eslint-disable ts-eslint/consistent-type-definitions -- It's allowed */
import type {
	FileMeta,
	FileOrFileMeta,
	FileValidationErrorContextEach,
	FileValidationHooksAsync,
	FileValidationSettingsAsync,
} from "@zayne-labs/toolkit-core";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import type { Awaitable } from "@zayne-labs/toolkit-type-helpers";
import type { useDropZoneStoreContext } from "./drop-zone-context";
import type { createDropZoneStore } from "./drop-zone-store";
import type { DropZoneError } from "./utils";

type FileErrorContext = Omit<FileValidationErrorContextEach, "code"> & {
	code: "upload-error" | FileValidationErrorContextEach["code"];
};

export interface FileState {
	/**
	 *  Validation errors for the file
	 *
	 */
	error?: FileErrorContext;
	/**
	 *  File object or file metadata
	 */
	file: FileOrFileMeta;
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
	/**
	 *  Progress of the file upload
	 */
	progress: number;
	/**
	 *  Status of the file upload
	 */
	status: "error" | "idle" | "success" | "uploading";
}

export type FileStateOrIDProp = {
	fileStateOrID: FileOrFileMeta | FileState | FileState["id"];
};

type RecordForDataAttr = Record<`data-${string}`, unknown>;

export interface PartProps {
	container: {
		input: PartProps["container"]["output"];
		output: InferProps<HTMLElement> & RecordForDataAttr;
	};
	fileItem: {
		input: PartProps["fileItem"]["output"];
		output: InferProps<"li"> & RecordForDataAttr;
	};
	fileItemClear: {
		input: PartProps["fileItemClear"]["output"];
		output: InferProps<"button"> & RecordForDataAttr;
	};
	fileItemDelete: {
		input: Partial<FileStateOrIDProp> & PartProps["fileItemDelete"]["output"];
		output: InferProps<"button"> & RecordForDataAttr;
	};
	fileItemMetadata: {
		input: PartProps["fileItemMetadata"]["output"];
		output: InferProps<"div"> & RecordForDataAttr;
	};
	fileItemPreview: {
		input: PartProps["fileItemPreview"]["output"];
		output: InferProps<"span"> & RecordForDataAttr;
	};
	fileItemProgress: {
		input: PartProps["fileItemProgress"]["output"] & { variant?: "circular" | "fill" | "linear" };
		output: InferProps<"span"> & RecordForDataAttr;
	};
	fileList: {
		input: PartProps["fileList"]["output"] & { orientation?: "horizontal" | "vertical" };
		output: InferProps<"ul"> & RecordForDataAttr;
	};
	input: {
		input: PartProps["input"]["output"];
		output: InferProps<"input"> & RecordForDataAttr;
	};
	trigger: {
		input: PartProps["trigger"]["output"];
		output: InferProps<"button"> & RecordForDataAttr;
	};
}

export type DropZonePropGetters = {
	[Key in keyof PartProps as `get${Capitalize<Key>}Props`]: (
		props: PartProps[Key]["input"]
	) => PartProps[Key]["output"];
};

export type PartInputProps = {
	[Key in keyof PartProps]: PartProps[Key]["input"];
};

export type DropZoneState = {
	/**
	 *  List of validation errors
	 */
	errors: FileErrorContext[];
	/**
	 *  List of files with their preview URLs and unique IDs
	 */
	fileStateArray: FileState[];
	/**
	 *  Whether or not a file is currently being dragged over the drop zone
	 */
	isDraggingOver: boolean;
	/**
	 *  Whether or not any of the files are invalid
	 */
	isInvalid: boolean;
};

export type DropZoneActions = {
	actions: {
		addFiles: (files: FileList | FileOrFileMeta[] | null) => Awaitable<void>;
		clearErrors: () => void;
		clearFiles: () => void;
		clearObjectURLs: () => void;
		handleChange: (event: React.ChangeEvent<HTMLInputElement>) => Awaitable<void>;
		handleDragEnter: (event: React.DragEvent<HTMLElement>) => void;
		handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
		handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
		handleDrop: (event: React.DragEvent<HTMLElement>) => Awaitable<void>;
		handleFileUpload: (ctx: { newFileStateArray: DropZoneState["fileStateArray"] }) => Awaitable<void>;
		handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
		handlePaste: (event: React.ClipboardEvent<HTMLElement>) => Awaitable<void>;
		openFilePicker: () => void;
		removeFile: (ctx: FileStateOrIDProp) => void;
		updateFileState: (
			ctx: FileStateOrIDProp & Partial<Omit<FileState, "file" | "id" | "preview">>
		) => void;
	};
};

export interface UseDropZoneResult
	extends Pick<Required<UseDropZoneProps>, "disabled" | "disableInternalStateSubscription"> {
	inputRef: React.RefObject<HTMLInputElement | null>;
	propGetters: DropZonePropGetters;
	storeApi: ReturnType<typeof createDropZoneStore>;
	useDropZoneStore: typeof useDropZoneStoreContext;
}

export interface UseDropZoneProps extends FileValidationSettingsAsync {
	/**
	 * Whether or not the drop zone is disabled
	 */
	disabled?: boolean;

	/**
	 * Whether clicking the drop zone area will open the default file picker or not
	 *
	 * @default false
	 */
	disableFilePickerOpenOnAreaClick?: boolean;

	/**
	 *  Whether to disable the internal state subscription such as drag over state etc for setting things like data attributes
	 *  - This is useful if you want to subscribe to the state yourself
	 *  @default false
	 */
	disableInternalStateSubscription?: boolean;

	/**
	 * Whether to disallow preview generation for non-image files
	 * @default true
	 */
	disablePreviewGenForNonImageFiles?: boolean;

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
	onUpload?: (
		context: Pick<DropZoneState, "fileStateArray"> & {
			onError: (ctx: FileStateOrIDProp & { error: DropZoneError }) => void;
			onProgress: (ctx: FileStateOrIDProp & { progress: number }) => void;
			onSuccess: (ctx: FileStateOrIDProp) => void;
		}
	) => Awaitable<void>;

	/**
	 * Callback function to be called on each file validation error as they occur
	 */
	onValidationError?: FileValidationHooksAsync["onErrorEach"];

	/**
	 * Callback function to be called once after all files have been successfully validated
	 */
	onValidationSuccess?: FileValidationHooksAsync["onSuccessBatch"];

	/**
	 * Custom validation function.
	 *
	 * If the function returns false, the file will be rejected
	 *
	 */
	validator?: FileValidationSettingsAsync["validator"];
}
