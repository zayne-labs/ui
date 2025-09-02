import { dataAttr } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useConstant, useShallowComparedValue, useStore } from "@zayne-labs/toolkit-react";
import { composeRefs, composeTwoEventHandlers } from "@zayne-labs/toolkit-react/utils";
import { useCallback, useMemo, useRef } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { createDropZoneStore } from "./drop-zone-store";
import type { DropZonePropGetters, UseDropZoneProps, UseDropZoneResult } from "./types";
import { getScopeAttrs } from "./utils";

export const useDropZone = (props?: UseDropZoneProps): UseDropZoneResult => {
	const {
		allowedFileTypes,
		disableInternalStateSubscription = false,
		disablePreviewForNonImageFiles = true,
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

	const useDropZoneStore: UseDropZoneResult["useDropZoneStore"] = (selector) => {
		return useStore(storeApi, selector);
	};

	const actions = storeApi.getState().actions;

	const isDraggingOver = useDropZoneStore((state) =>
		!disableInternalStateSubscription ? state.isDraggingOver : null
	);

	const hasFiles = useDropZoneStore((state) =>
		!disableInternalStateSubscription ? state.fileStateArray.length > 0 : null
	);

	const getContainerProps: UseDropZoneResult["propGetters"]["getContainerProps"] = useCallback(
		(innerProps) => {
			return {
				...getScopeAttrs("container"),
				...innerProps,
				...(isDraggingOver !== null && { "data-drag-over": dataAttr(isDraggingOver) }),
				className: cnMerge(
					"relative isolate flex flex-col data-[drag-over]:opacity-60",
					innerProps.className
				),
				onDragEnter: composeTwoEventHandlers(actions.handleDragEnter, innerProps.onDragEnter),
				onDragLeave: composeTwoEventHandlers(actions.handleDragLeave, innerProps.onDragLeave),
				onDragOver: composeTwoEventHandlers(actions.handleDragOver, innerProps.onDragOver),
				onDrop: composeTwoEventHandlers(actions.handleDrop, innerProps.onDrop),
			};
		},
		[
			actions.handleDragEnter,
			actions.handleDragLeave,
			actions.handleDragOver,
			actions.handleDrop,
			isDraggingOver,
		]
	);

	const getInputProps: UseDropZoneResult["propGetters"]["getInputProps"] = useCallback(
		(innerProps) => {
			return {
				...getScopeAttrs("input"),
				...innerProps,
				...(isDraggingOver !== null && { "data-drag-over": dataAttr(isDraggingOver) }),
				accept: allowedFileTypes ? allowedFileTypes.join(", ") : innerProps.accept,
				className: cnMerge(
					shouldOpenFilePickerOnAreaClick ?
						"absolute inset-0 z-[100] cursor-pointer opacity-0"
					:	"hidden",
					innerProps.className
				),
				multiple: multiple ?? innerProps.multiple,
				onChange: composeTwoEventHandlers(actions.handleChange, innerProps.onChange),
				ref: composeRefs(inputRef, innerProps.ref),
				type: "file",
			};
		},
		[actions.handleChange, allowedFileTypes, isDraggingOver, multiple, shouldOpenFilePickerOnAreaClick]
	);

	const getTriggerProps: UseDropZoneResult["propGetters"]["getTriggerProps"] = useCallback(
		(innerProps) => {
			return {
				...getScopeAttrs("trigger"),
				type: "button",
				...innerProps,
				onClick: composeTwoEventHandlers(actions.openFilePicker, innerProps.onClick),
			};
		},
		[actions.openFilePicker]
	);

	const getFileGroupProps: UseDropZoneResult["propGetters"]["getFileGroupProps"] = useCallbackRef(
		(innerProps) => {
			const { orientation = "vertical", ...restOfProps } = innerProps;

			return {
				...getScopeAttrs("file-group"),
				"data-orientation": orientation,
				...restOfProps,
				...(hasFiles !== null && { "data-state": hasFiles ? "active" : "inactive" }),
				className: cnMerge(
					`data-[state=inactive]:fade-out-0 data-[state=active]:fade-in-0
					data-[state=inactive]:slide-out-to-top-2 data-[state=active]:slide-in-from-top-2
					data-[state=active]:animate-in data-[state=inactive]:animate-out flex flex-col gap-2`,
					orientation === "horizontal" && "flex-row overflow-x-auto p-1.5",
					innerProps.className
				),
			};
		}
	);

	const getFileItemProps: UseDropZoneResult["propGetters"]["getFileItemProps"] = useCallbackRef(
		(innerProps) => {
			return {
				...getScopeAttrs("file-item"),
				...innerProps,
				className: cnMerge(
					"relative flex items-center gap-2.5 rounded-md border p-3",
					innerProps.className
				),
			};
		}
	);

	const getFileItemProgressProps: UseDropZoneResult["propGetters"]["getFileItemProgressProps"] =
		useCallbackRef((innerProps) => {
			return {
				...getScopeAttrs("file-item-progress"),
				...innerProps,
			};
		});

	const getFileItemDeleteProps: UseDropZoneResult["propGetters"]["getFileItemDeleteProps"] =
		useCallbackRef((innerProps) => {
			const { fileItemOrID, ...restOfInnerProps } = innerProps;

			return {
				...getScopeAttrs("file-item-delete"),
				type: "button",
				...restOfInnerProps,
				onClick: composeTwoEventHandlers(
					() => fileItemOrID && actions.removeFile(fileItemOrID),
					restOfInnerProps.onClick
				),
			};
		});

	const propGetters = useMemo<DropZonePropGetters>(
		() =>
			({
				getContainerProps,
				getFileGroupProps,
				getFileItemDeleteProps,
				getFileItemProgressProps,
				getFileItemProps,
				getInputProps,
				getTriggerProps,
			}) satisfies DropZonePropGetters,
		[
			getContainerProps,
			getFileGroupProps,
			getFileItemDeleteProps,
			getFileItemProgressProps,
			getFileItemProps,
			getInputProps,
			getTriggerProps,
		]
	);

	const savedUseDropZoneStore = useCallbackRef(useDropZoneStore);

	const result = useMemo<UseDropZoneResult>(
		() =>
			({
				inputRef,
				propGetters,
				storeApi,
				useDropZoneStore: savedUseDropZoneStore,
			}) satisfies UseDropZoneResult,
		[propGetters, storeApi, savedUseDropZoneStore]
	);

	return result;
};
