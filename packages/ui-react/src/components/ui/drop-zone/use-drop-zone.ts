import { dataAttr } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useCompareValue, useStore, useUnmountEffect } from "@zayne-labs/toolkit-react";
import { composeRefs, composeTwoEventHandlers } from "@zayne-labs/toolkit-react/utils";
import { useCallback, useMemo, useRef } from "react";
import { cnMerge } from "@/lib/utils/cn";
import { createDropZoneStore } from "./drop-zone-store";
import type { DropZonePropGetters, UseDropZoneProps, UseDropZoneResult } from "./types";
import { getDropZoneScopeAttrs } from "./utils";

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
		unstyled: globalUnstyled = false,
		validator,
	} = props ?? {};

	const inputRef = useRef<HTMLInputElement>(null);

	const stableOnFilesChange = useCallbackRef(onFilesChange);
	const stableOnUpload = useCallbackRef(onUpload);
	const stableOnUploadError = useCallbackRef(onValidationError);
	const stableOnUploadSuccess = useCallbackRef(onValidationSuccess);
	const stableValidator = useCallbackRef(validator);

	const shallowComparedInitialFiles = useCompareValue(initialFiles);
	const shallowComparedMaxFileSize = useCompareValue(maxFileSize);
	const shallowComparedAllowedFileTypes = useCompareValue(allowedFileTypes);

	const storeApi = useMemo(() => {
		return createDropZoneStore({
			allowedFileTypes: shallowComparedAllowedFileTypes,
			disablePreviewGenForNonImageFiles,
			initialFiles: shallowComparedInitialFiles,
			maxFileCount,
			maxFileSize: shallowComparedMaxFileSize,
			multiple,
			onFilesChange: stableOnFilesChange,
			onUpload: stableOnUpload,
			onValidationError: stableOnUploadError,
			onValidationSuccess: stableOnUploadSuccess,
			rejectDuplicateFiles,
			validator: stableValidator,
		});
	}, [
		shallowComparedAllowedFileTypes,
		disablePreviewGenForNonImageFiles,
		shallowComparedInitialFiles,
		maxFileCount,
		shallowComparedMaxFileSize,
		multiple,
		stableOnFilesChange,
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

	/* eslint-disable react-hooks/hooks -- ignore */
	const useDropZoneStore: UseDropZoneResult["useDropZoneStore"] = (selector) => {
		return useStore(storeApi as never, selector);
	};

	const isDraggingOver = useDropZoneStore((state) =>
		!disableInternalStateSubscription ? state.isDraggingOver : null
	);

	const isInvalid = useDropZoneStore((state) =>
		!disableInternalStateSubscription ? state.isInvalid : null
	);
	/* eslint-enable react-hooks/hooks -- ignore */

	const getContainerProps: UseDropZoneResult["propGetters"]["getContainerProps"] = useCallback(
		(innerProps) => {
			const { unstyled = globalUnstyled, ...restOfInnerProps } = innerProps;

			const isDisabled = disabled;
			const onFileDrop = !isDisabled ? actions.handleDrop : undefined;
			const onFilePaste = !isDisabled ? actions.handlePaste : undefined;
			const tabIndex = !isDisabled ? 0 : undefined;
			const onAreaClick =
				!isDisabled && !disableFilePickerOpenOnAreaClick ? actions.openFilePicker : undefined;
			const onKeyDown =
				!isDisabled && !disableFilePickerOpenOnAreaClick ? actions.handleKeyDown : undefined;

			return {
				...getDropZoneScopeAttrs("container"),
				role: "region",
				...(!disableInternalStateSubscription && {
					"data-drag-over": dataAttr(isDraggingOver),
					"data-invalid": dataAttr(isInvalid),
				}),
				...restOfInnerProps,
				...(!unstyled && {
					className: cnMerge(
						`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors duration-250 ease-out outline-none select-none focus-visible:border-zu-ring/50`,
						`data-disabled:pointer-events-none data-drag-over:opacity-60 data-invalid:border-zu-destructive data-invalid:ring-zu-destructive/20`,
						innerProps.className
					),
				}),
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
			globalUnstyled,
			disabled,
			actions.handleDrop,
			actions.handlePaste,
			actions.openFilePicker,
			actions.handleKeyDown,
			actions.handleDragEnter,
			actions.handleDragLeave,
			actions.handleDragOver,
			disableFilePickerOpenOnAreaClick,
			disableInternalStateSubscription,
			isDraggingOver,
			isInvalid,
		]
	);

	const refCallback: React.RefCallback<HTMLInputElement> = useCallbackRef((node) => {
		inputRef.current = node;
		actions.setInputRef(node);
	});

	const getInputProps: UseDropZoneResult["propGetters"]["getInputProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps.disabled ?? disabled;

			const onFileChange = !isDisabled ? actions.handleChange : undefined;

			return {
				...getDropZoneScopeAttrs("input"),
				...(!disableInternalStateSubscription && { "data-drag-over": dataAttr(isDraggingOver) }),
				...innerProps,
				accept: allowedFileTypes ? allowedFileTypes.join(", ") : innerProps.accept,
				className: cnMerge("hidden", innerProps.className),
				"data-disabled": dataAttr(isDisabled),
				disabled: isDisabled,
				multiple: multiple ?? innerProps.multiple,
				onChange: composeTwoEventHandlers(onFileChange, innerProps.onChange),
				ref: composeRefs(refCallback, innerProps.ref),
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
			refCallback,
		]
	);

	const getTriggerProps: UseDropZoneResult["propGetters"]["getTriggerProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps.disabled ?? disabled;

			return {
				...getDropZoneScopeAttrs("trigger"),
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
			const { orientation = "vertical", unstyled = globalUnstyled, ...restOfInnerProps } = innerProps;

			return {
				...getDropZoneScopeAttrs("file-list"),
				"data-orientation": orientation,
				...restOfInnerProps,
				...(!unstyled && {
					className: cnMerge(
						"flex flex-col gap-2",
						orientation === "horizontal" && "flex-row overflow-x-auto p-1.5",
						innerProps.className
					),
				}),
			};
		},
		[globalUnstyled]
	);

	const getFileItemProps: UseDropZoneResult["propGetters"]["getFileItemProps"] = useCallback(
		(innerProps) => {
			const { unstyled = globalUnstyled, ...restOfInnerProps } = innerProps;

			return {
				...getDropZoneScopeAttrs("file-item"),
				...restOfInnerProps,
				...(!unstyled && {
					className: cnMerge(
						"relative flex animate-files-in items-center gap-2.5 rounded-md border p-2",
						innerProps.className
					),
				}),
			};
		},
		[globalUnstyled]
	);

	const getFileItemProgressProps: UseDropZoneResult["propGetters"]["getFileItemProgressProps"] =
		useCallback(
			(innerProps) => {
				const { unstyled = globalUnstyled, variant = "linear", ...restOfInnerProps } = innerProps;

				return {
					...getDropZoneScopeAttrs("file-item-progress"),
					role: "progressbar",
					...restOfInnerProps,
					...(!unstyled && {
						className: cnMerge(
							"inline-flex",
							variant === "circular"
								&& "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
							variant === "fill"
								&& `absolute inset-0 bg-zu-primary/50 transition-[clip-path] duration-300 ease-linear [clip-path:var(--clip-path)]`,
							variant === "linear"
								&& "relative h-1.5 w-full overflow-hidden rounded-full bg-zu-primary/20",
							restOfInnerProps.className
						),
					}),
				};
			},
			[globalUnstyled]
		);

	const getFileItemDeleteProps: UseDropZoneResult["propGetters"]["getFileItemDeleteProps"] = useCallback(
		(innerProps) => {
			const { fileStateOrID, ...restOfInnerProps } = innerProps;

			const isDisabled = innerProps.disabled ?? disabled;

			const onRemoveFile = () => fileStateOrID && actions.removeFile({ fileStateOrID });

			return {
				...getDropZoneScopeAttrs("file-item-delete"),
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
		useCallback(
			(innerProps) => {
				const { unstyled = globalUnstyled, ...restOfInnerProps } = innerProps;

				return {
					...getDropZoneScopeAttrs("file-item-preview"),
					...restOfInnerProps,
					...(!unstyled && {
						className: cnMerge(
							`relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-zu-accent/50 [&>svg]:size-10`,
							innerProps.className
						),
					}),
				};
			},
			[globalUnstyled]
		);

	const getFileItemMetadataProps: UseDropZoneResult["propGetters"]["getFileItemMetadataProps"] =
		useCallback(
			(innerProps) => {
				const { unstyled = globalUnstyled, ...restOfInnerProps } = innerProps;

				return {
					...getDropZoneScopeAttrs("file-item-metadata"),
					...restOfInnerProps,
					...(!unstyled && {
						className: cnMerge("flex min-w-0 grow flex-col", innerProps.className),
					}),
				};
			},
			[globalUnstyled]
		);

	const getFileItemClearProps: UseDropZoneResult["propGetters"]["getFileItemClearProps"] = useCallback(
		(innerProps) => {
			const isDisabled = innerProps.disabled ?? disabled;

			return {
				...getDropZoneScopeAttrs("file-item-clear"),
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

	const stableUseDropZoneStore = useCallbackRef(useDropZoneStore);

	const result = useMemo<UseDropZoneResult>(
		() =>
			({
				disabled,
				disableInternalStateSubscription,
				inputRef,
				propGetters,
				storeApi,
				useDropZoneStore: stableUseDropZoneStore,
			}) satisfies UseDropZoneResult,
		[disabled, disableInternalStateSubscription, propGetters, storeApi, stableUseDropZoneStore]
	);

	return result;
};
