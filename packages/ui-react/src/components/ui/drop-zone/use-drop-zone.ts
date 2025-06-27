import type {
	FileMeta,
	FileValidationHooksAsync,
	FileValidationSettingsAsync,
} from "@zayne-labs/toolkit-core";
import { dataAttr } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useConstant, useShallowComparedValue, useStore } from "@zayne-labs/toolkit-react";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { composeRefs, composeTwoEventHandlers, mergeTwoProps } from "@zayne-labs/toolkit-react/utils";
import type { Awaitable } from "@zayne-labs/toolkit-type-helpers";
import { useCallback, useMemo, useRef } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { createDropZoneStore } from "./drop-zone-store";
import type { DropZoneActions, DropZonePropGetters, DropZoneState } from "./types";

export type ExtraProps = {
	container?: InferProps<HTMLElement>;
	input?: InferProps<"input">;
	trigger?: InferProps<"button">;
};

export type ClassNames = {
	[key in keyof ExtraProps]: string;
};

export type UseDropZoneResult = DropZoneState & {
	actions: DropZoneActions;
	inputRef: React.RefObject<HTMLInputElement | null>;
	propGetters: DropZonePropGetters;
	storeApi: ReturnType<typeof createDropZoneStore>;
};

export type UseDropZoneProps = FileValidationSettingsAsync & {
	/**
	 * CSS classes to apply to the various parts of the drop zone
	 */
	classNames?: ClassNames;

	/**
	 * Whether to disallow preview for non-image files
	 * @default true
	 */
	disablePreviewForNonImageFiles?: boolean;

	/**
	 * Extra props to pass to various parts of the dropzone
	 */
	extraProps?: ExtraProps;

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

export const useDropZone = (props?: UseDropZoneProps): UseDropZoneResult => {
	const {
		allowedFileTypes,
		classNames,
		disablePreviewForNonImageFiles = true,
		extraProps,
		initialFiles,
		maxFileCount,
		maxFileSize,
		multiple,
		onFilesChange,
		onUpload,
		onUploadError,
		onUploadErrorCollection,
		onUploadSuccess,
		rejectDuplicateFiles = true,
		shouldOpenFilePickerOnAreaClick = true,
		validator,
	} = props ?? {};

	const inputRef = useRef<HTMLInputElement>(null);

	const savedOnFilesChange = useCallbackRef(onFilesChange);
	const savedOnUpload = useCallbackRef(onUpload);
	const savedOnUploadError = useCallbackRef(onUploadError);
	const savedOnUploadErrorCollection = useCallbackRef(onUploadErrorCollection);
	const savedOnUploadSuccess = useCallbackRef(onUploadSuccess);
	const savedValidator = useCallbackRef(validator);

	const constantInitialFiles = useConstant(() => initialFiles);
	const shallowComparedMaxFileSize = useShallowComparedValue(maxFileSize);
	const shallowComparedAllowedFileTypes = useShallowComparedValue(allowedFileTypes);

	const storeApi = useMemo(() => {
		return createDropZoneStore({
			allowedFileTypes: shallowComparedAllowedFileTypes,
			disablePreviewForNonImageFiles,
			initialFiles: constantInitialFiles,
			inputRef,
			maxFileCount,
			maxFileSize: shallowComparedMaxFileSize,
			multiple,
			onFilesChange: savedOnFilesChange,
			onUpload: savedOnUpload,
			onUploadError: savedOnUploadError,
			onUploadErrorCollection: savedOnUploadErrorCollection,
			onUploadSuccess: savedOnUploadSuccess,
			rejectDuplicateFiles,
			validator: savedValidator,
		});
	}, [
		shallowComparedAllowedFileTypes,
		disablePreviewForNonImageFiles,
		constantInitialFiles,
		maxFileCount,
		shallowComparedMaxFileSize,
		multiple,
		savedOnFilesChange,
		savedOnUpload,
		savedOnUploadError,
		savedOnUploadErrorCollection,
		savedOnUploadSuccess,
		rejectDuplicateFiles,
		savedValidator,
	]);

	const store = useStore(storeApi);

	const getContainerProps: UseDropZoneResult["propGetters"]["getContainerProps"] = useCallback(
		(containerProps) => {
			const mergedContainerProps = mergeTwoProps(extraProps?.container, containerProps);

			return {
				...mergedContainerProps,
				className: cnMerge(
					"relative isolate flex flex-col",
					store.isDraggingOver && "opacity-60",
					classNames?.container,
					mergedContainerProps.className
				),
				"data-drag-over": dataAttr(store.isDraggingOver),
				"data-scope": "dropzone",
				// eslint-disable-next-line perfectionist/sort-objects -- I need data-scope to be first
				"data-part": "container",
				"data-slot": "dropzone-container",
				onDragEnter: composeTwoEventHandlers(
					store.actions.handleDragEnter,
					mergedContainerProps.onDragEnter
				),
				onDragLeave: composeTwoEventHandlers(
					store.actions.handleDragLeave,
					mergedContainerProps.onDragLeave
				),
				onDragOver: composeTwoEventHandlers(
					store.actions.handleDragOver,
					mergedContainerProps.onDragOver
				),
				onDrop: composeTwoEventHandlers(store.actions.handleDrop, mergedContainerProps.onDrop),
			};
		},
		[
			store.actions.handleDragEnter,
			store.actions.handleDragLeave,
			store.actions.handleDragOver,
			store.actions.handleDrop,
			classNames?.container,
			extraProps?.container,
			store.isDraggingOver,
		]
	);

	const getInputProps: UseDropZoneResult["propGetters"]["getInputProps"] = useCallback(
		(inputProps) => {
			const mergedInputProps = mergeTwoProps(extraProps?.input, inputProps);

			return {
				...mergedInputProps,
				accept: allowedFileTypes ? allowedFileTypes.join(", ") : mergedInputProps.accept,
				className: cnMerge(
					shouldOpenFilePickerOnAreaClick ?
						"absolute inset-0 z-[100] cursor-pointer opacity-0"
					:	"hidden",
					classNames?.input,
					mergedInputProps.className
				),
				"data-drag-over": dataAttr(store.isDraggingOver),
				"data-scope": "dropzone",
				// eslint-disable-next-line perfectionist/sort-objects -- I need data-scope to be first
				"data-part": "input",
				"data-slot": "dropzone-input",
				multiple: multiple ?? mergedInputProps.multiple,
				onChange: composeTwoEventHandlers(store.actions.handleChange, mergedInputProps.onChange),
				ref: composeRefs(inputRef, mergedInputProps.ref),
				type: "file",
			};
		},
		[
			store.actions.handleChange,
			allowedFileTypes,
			classNames?.input,
			extraProps?.input,
			store.isDraggingOver,
			multiple,
			shouldOpenFilePickerOnAreaClick,
		]
	);

	const getTriggerProps: UseDropZoneResult["propGetters"]["getTriggerProps"] = useCallback(
		(triggerProps) => {
			const mergedTriggerProps = mergeTwoProps(extraProps?.trigger, triggerProps);

			return {
				...mergedTriggerProps,
				className: cnMerge(classNames?.trigger, mergedTriggerProps.className),
				"data-scope": "dropzone",
				// eslint-disable-next-line perfectionist/sort-objects -- I need data-scope to be first
				"data-part": "trigger",
				"data-slot": "dropzone-trigger",
				onClick: composeTwoEventHandlers(store.actions.openFilePicker, mergedTriggerProps.onClick),
			};
		},
		[store.actions.openFilePicker, classNames?.trigger, extraProps?.trigger]
	);

	const propGetters = useMemo(
		() => ({
			getContainerProps,
			getInputProps,
			getTriggerProps,
		}),
		[getContainerProps, getInputProps, getTriggerProps]
	);

	const result = useMemo<UseDropZoneResult>(
		() => ({
			actions: store.actions,
			errors: store.errors,
			fileStateArray: store.fileStateArray,
			inputRef,
			isDraggingOver: store.isDraggingOver,
			propGetters,
			storeApi,
		}),
		[store.actions, store.errors, store.fileStateArray, store.isDraggingOver, propGetters, storeApi]
	);

	return result;
};
