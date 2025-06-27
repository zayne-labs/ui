import type { FileMeta, FileValidationErrorContext } from "@zayne-labs/toolkit-core";
import type { Awaitable } from "@zayne-labs/toolkit-type-helpers";
import type { ExtraProps } from "./use-drop-zone";

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

export type DropZonePropGetters = {
	getContainerProps: (containerProps?: ExtraProps["container"]) => ExtraProps["container"];
	getInputProps: (inputProps?: ExtraProps["input"]) => ExtraProps["input"];
	getTriggerProps: (triggerProps?: ExtraProps["trigger"]) => ExtraProps["trigger"];
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
	removeFile: (fileToRemoveOrFileId: string | FileState) => void;
};
