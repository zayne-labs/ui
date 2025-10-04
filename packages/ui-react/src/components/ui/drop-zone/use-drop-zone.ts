import { dataAttr } from "@zayne-labs/toolkit-core";
import {
	useCallbackRef,
	useConstant,
	useShallowCompValue,
	useStore,
	useUnmountEffect,
} from "@zayne-labs/toolkit-react";
import { composeRefs, composeTwoEventHandlers } from "@zayne-labs/toolkit-react/utils";
import { useCallback, useMemo, useRef } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { createDropZoneStore } from "./drop-zone-store";
import type { DropZonePropGetters, UseDropZoneProps, UseDropZoneResult } from "./types";
import { getScopeAttrs } from "./utils";

export const useDropZone = (props?: UseDropZoneProps): UseDropZoneResult => {
	const {
		allowedFileTypes,
		disabled = false,
		disableFilePickerOpenOnAreaClick = false,
		disableInternalStateSubscription = false,
		disablePreviewGenForNonImageFiles = true,
		initialFiles,
		maxFileCount,
		maxFileSize,
		multiple,
		onFilesChange,
		onUpload,
		onValidationError,
		onValidationSuccess,
		rejectDuplicateFiles = true,
		validator,
	} = props ?? {};

	const inputRef = useRef<HTMLInputElement>(null);

	const isOnUploadFnProvided = onUpload !== undefined;
	const stableOnFilesChange = useCallbackRef(onFilesChange);
	const stableOnUpload = useCallbackRef(onUpload);
	const stableOnUploadError = useCallbackRef(onValidationError);
	const stableOnUploadSuccess = useCallbackRef(onValidationSuccess);
	const stableValidator = useCallbackRef(validator);

	const constantInitialFiles = useConstant(() => initialFiles);
	const shallowComparedMaxFileSize = useShallowCompValue(maxFileSize);
	const shallowComparedAllowedFileTypes = useShallowCompValue(allowedFileTypes);

	const storeApi = useMemo(() => {
		return createDropZoneStore({
			allowedFileTypes: shallowComparedAllowedFileTypes,
			disablePreviewGenForNonImageFiles,
			initialFiles: constantInitialFiles,
			inputRef,
			maxFileCount,
			maxFileSize: shallowComparedMaxFileSize,
			multiple,
			onFilesChange: stableOnFilesChange,
			onUpload: isOnUploadFnProvided ? stableOnUpload : undefined,
			onValidationError: stableOnUploadError,
			onValidationSuccess: stableOnUploadSuccess,
			rejectDuplicateFiles,
			validator: stableValidator,
		});
	}, [
		shallowComparedAllowedFileTypes,
		disablePreviewGenForNonImageFiles,
		constantInitialFiles,
		maxFileCount,
		shallowComparedMaxFileSize,
		multiple,
		stableOnFilesChange,
		isOnUploadFnProvided,
		stableOnUpload,
		stableOnUploadError,
		stableOnUploadSuccess,
		rejectDuplicateFiles,
		stableValidator,
	]);

	const actions = storeApi.getState().actions;

	useUnmountEffect(() => {
		actions.clearObjectURLs();
	});

	const useDropZoneStore: UseDropZoneResult["useDropZoneStore"] = (selector) => {
		return useStore(storeApi, selector);
	};

	const isDraggingOver = useDropZoneStore((state) =>
		!disableInternalStateSubscription ? state.isDraggingOver : null
	);

	const hasFiles = useDropZoneStore((state) =>
		!disableInternalStateSubscription ? state.fileStateArray.length > 0 : null
	);

	const isInvalid = useDropZoneStore((state) =>
		!disableInternalStateSubscription ? state.isInvalid : null
	);

	const getContainerProps: UseDropZoneResult["propGetters"]["getContainerProps"] = useCallback(
		(innerProps) => {
			const isDisabled = disabled;
			const onFileDrop = !isDisabled ? actions.handleDrop : undefined;
			const onFilePaste = !isDisabled ? actions.handlePaste : undefined;
			const tabIndex = !isDisabled ? 0 : undefined;
			const onAreaClick =
				!isDisabled && !disableFilePickerOpenOnAreaClick ? actions.openFilePicker : undefined;
			const onKeyDown =
				!isDisabled && !disableFilePickerOpenOnAreaClick ? actions.handleKeyDown : undefined;

			return {
				...getScopeAttrs("container"),
				role: "region",
				...(!disableInternalStateSubscription && {
					"data-drag-over": dataAttr(isDraggingOver),
					"data-invalid": dataAttr(isInvalid),
				}),
				...innerProps,
				className: cnMerge(
					`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed
					p-6 transition-colors duration-250 ease-out outline-none select-none
					focus-visible:border-zu-ring/50`,
					`data-[disabled]:pointer-events-none data-[drag-over]:opacity-60
					data-[invalid]:border-zu-destructive data-[invalid]:ring-zu-destructive/20`,
					innerProps.className
				),
				"data-disabled": dataAttr(isDisabled),
				onClick: composeTwoEventHandlers(onAreaClick, innerProps.onClick),
				onDragEnter: composeTwoEventHandlers(actions.handleDragEnter, innerProps.onDragEnter),
				onDragLeave: composeTwoEventHandlers(actions.handleDragLeave, innerProps.onDragLeave),
				onDragOver: composeTwoEventHandlers(actions.handleDragOver, innerProps.onDragOver),
				onDrop: composeTwoEventHandlers(onFileDrop, innerProps.onDrop),
				onKeyDown: composeTwoEventHandlers(onKeyDown, innerProps.onKeyDown),
				onPaste: composeTwoEventHandlers(onFilePaste, innerProps.onPaste),
				tabIndex,
			};
		},
		[
			actions.handleDragEnter,
			actions.handleDragLeave,
			actions.handleDragOver,
			actions.handleDrop,
			actions.handleKeyDown,
			actions.handlePaste,
			actions.openFilePicker,
			disableInternalStateSubscription,
			disabled,
			isDraggingOver,
			isInvalid,
			disableFilePickerOpenOnAreaClick,
		]
	);

	const getInputProps: UseDropZoneResult["propGetters"]["getInputProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps.disabled ?? disabled;

			const onFileChange = !isDisabled ? actions.handleChange : undefined;

			return {
				...getScopeAttrs("input"),
				...(!disableInternalStateSubscription && { "data-drag-over": dataAttr(isDraggingOver) }),
				...innerProps,
				accept: allowedFileTypes ? allowedFileTypes.join(", ") : innerProps.accept,
				className: cnMerge("hidden", innerProps.className),
				"data-disabled": dataAttr(isDisabled),
				disabled: isDisabled,
				multiple: multiple ?? innerProps.multiple,
				onChange: composeTwoEventHandlers(onFileChange, innerProps.onChange),
				ref: composeRefs(inputRef, innerProps.ref),
				type: "file",
			};
		},
		[
			actions.handleChange,
			allowedFileTypes,
			disableInternalStateSubscription,
			disabled,
			isDraggingOver,
			multiple,
		]
	);

	const getTriggerProps: UseDropZoneResult["propGetters"]["getTriggerProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps.disabled ?? disabled;

			return {
				...getScopeAttrs("trigger"),
				type: "button",
				...innerProps,
				"data-disabled": dataAttr(isDisabled),
				disabled: isDisabled,
				onClick: composeTwoEventHandlers(actions.openFilePicker, innerProps.onClick),
			};
		},
		[actions.openFilePicker, disabled]
	);

	const getFileListProps: UseDropZoneResult["propGetters"]["getFileListProps"] = useCallback(
		(innerProps) => {
			const { orientation = "vertical", ...restOfInnerProps } = innerProps;

			return {
				...getScopeAttrs("file-list"),
				"data-orientation": orientation,
				...(!disableInternalStateSubscription && { "data-state": hasFiles ? "active" : "inactive" }),
				...restOfInnerProps,
				className: cnMerge(
					"flex flex-col gap-2 data-[state=active]:animate-files-in",
					orientation === "horizontal" && "flex-row overflow-x-auto p-1.5",
					innerProps.className
				),
			};
		},
		[disableInternalStateSubscription, hasFiles]
	);

	const getFileItemProps: UseDropZoneResult["propGetters"]["getFileItemProps"] = useCallbackRef(
		(innerProps) => {
			return {
				...getScopeAttrs("file-item"),
				...innerProps,
				className: cnMerge(
					"relative flex items-center gap-2.5 rounded-md border p-2",
					innerProps.className
				),
			};
		}
	);

	const getFileItemProgressProps: UseDropZoneResult["propGetters"]["getFileItemProgressProps"] =
		useCallbackRef((innerProps) => {
			const { variant = "linear", ...restOfInnerProps } = innerProps;

			return {
				...getScopeAttrs("file-item-progress"),
				role: "progressbar",
				...restOfInnerProps,
				className: cnMerge(
					"inline-flex",
					variant === "circular" && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
					variant === "fill"
						&& `absolute inset-0 bg-zu-primary/50 transition-[clip-path] duration-300 ease-linear
						[clip-path:var(--clip-path)]`,
					variant === "linear"
						&& "relative h-1.5 w-full overflow-hidden rounded-full bg-zu-primary/20",
					restOfInnerProps.className
				),
			};
		});

	const getFileItemDeleteProps: UseDropZoneResult["propGetters"]["getFileItemDeleteProps"] = useCallback(
		(innerProps) => {
			const { fileStateOrID, ...restOfInnerProps } = innerProps;

			const isDisabled = innerProps.disabled ?? disabled;

			const onRemoveFile = () => fileStateOrID && actions.removeFile({ fileStateOrID });

			return {
				...getScopeAttrs("file-item-delete"),
				type: "button",
				...restOfInnerProps,
				"data-disabled": dataAttr(isDisabled),
				disabled: isDisabled,
				onClick: composeTwoEventHandlers(onRemoveFile, restOfInnerProps.onClick),
			};
		},
		[actions, disabled]
	);

	const getFileItemPreviewProps: UseDropZoneResult["propGetters"]["getFileItemPreviewProps"] =
		useCallbackRef((innerProps) => {
			return {
				...getScopeAttrs("file-item-preview"),
				...innerProps,
				className: cnMerge(
					`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md
					bg-zu-accent/50 [&>svg]:size-10`,
					innerProps.className
				),
			};
		});

	const getFileItemMetadataProps: UseDropZoneResult["propGetters"]["getFileItemMetadataProps"] =
		useCallbackRef((innerProps) => {
			return {
				...getScopeAttrs("file-item-metadata"),
				...innerProps,
				className: cnMerge("flex min-w-0 grow flex-col", innerProps.className),
			};
		});

	const getFileItemClearProps: UseDropZoneResult["propGetters"]["getFileItemClearProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps.disabled ?? disabled;

			return {
				...getScopeAttrs("file-item-clear"),
				type: "button",
				...innerProps,
				"data-disabled": dataAttr(isDisabled),
				disabled: isDisabled,
				onClick: composeTwoEventHandlers(actions.clearFiles, innerProps.onClick),
			};
		},
		[actions.clearFiles, disabled]
	);

	const propGetters = useMemo<DropZonePropGetters>(
		() =>
			({
				getContainerProps,
				getFileItemClearProps,
				getFileItemDeleteProps,
				getFileItemMetadataProps,
				getFileItemPreviewProps,
				getFileItemProgressProps,
				getFileItemProps,
				getFileListProps,
				getInputProps,
				getTriggerProps,
			}) satisfies DropZonePropGetters,
		[
			getContainerProps,
			getFileListProps,
			getFileItemClearProps,
			getFileItemDeleteProps,
			getFileItemMetadataProps,
			getFileItemPreviewProps,
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
				disabled,
				disableInternalStateSubscription,
				inputRef,
				propGetters,
				storeApi,
				useDropZoneStore: savedUseDropZoneStore,
			}) satisfies UseDropZoneResult,
		[disabled, disableInternalStateSubscription, propGetters, storeApi, savedUseDropZoneStore]
	);

	return result;
};
