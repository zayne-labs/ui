"use client";

import { cnMerge } from "@/lib/utils/cn";
import { type FileValidationOptions, handleFileValidation } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useToggle } from "@zayne-labs/toolkit-react";
import {
	type DiscriminatedRenderProps,
	type InferProps,
	composeRefs,
	mergeTwoProps,
} from "@zayne-labs/toolkit-react/utils";
import { type UnknownObject, isFunction } from "@zayne-labs/toolkit-type-helpers";
import { useRef, useState } from "react";

type RenderProps = {
	acceptedFiles: File[];
	inputRef: React.RefObject<HTMLInputElement | null>;
	isDragging: boolean;
	openFilePicker: () => void;
};

export type RootProps = InferProps<"div"> & {
	classNames?: {
		activeDrag?: string;
		base?: string;
	};
};

export type InputProps = InferProps<"input">;

type DropZoneRenderProps<TExtraRenderProps extends UnknownObject> = DiscriminatedRenderProps<
	React.ReactNode | ((props: RenderProps & TExtraRenderProps) => React.ReactNode)
>;

export type UseDropZoneProps<TExtraRenderProps extends UnknownObject = UnknownObject> =
	DropZoneRenderProps<TExtraRenderProps> & {
		/**
		 * Allowed file types to be uploaded.
		 */
		allowedFileTypes?: string[];

		classNames?: { activeDrag?: string; base?: string; input?: string };
		/**
		 * Whether to disallow duplicate files
		 * @default true
		 */
		disallowDuplicates?: boolean;

		/**
		 * Existing files to be uploaded
		 */
		existingFiles?: File[];

		/**
		 * Extra props to pass to the input element
		 */
		extraInputProps?: InputProps;

		/**
		 * Extra props to pass to the root element
		 */
		extraRootProps?: RootProps;

		/**
		 * Maximum number of files that can be uploaded.
		 */
		maxFileCount?: number;

		/**
		 * Maximum file size in MB
		 */
		maxFileSize?: number;

		/**
		 * Callback function to handle file upload
		 */
		onUpload?: (details: {
			acceptedFiles: File[];
			event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>;
		}) => void;

		/**
		 * Callback function to handle file upload errors
		 */
		onUploadError?: FileValidationOptions["onError"];

		/**
		 * Callback function to handle file upload success
		 */
		onUploadSuccess?: FileValidationOptions["onSuccess"];

		/**
		 * Custom validator function to handle file validation
		 */
		validator?: (context: { existingFileArray: File[] | undefined; newFileList: FileList }) => File[];
	};

export const useDropZone = <TExtraRenderProps extends UnknownObject>(
	props: UseDropZoneProps<TExtraRenderProps>
) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		allowedFileTypes,
		children,
		classNames,
		disallowDuplicates = true,
		existingFiles,
		extraInputProps,
		extraRootProps,
		maxFileCount,
		maxFileSize,
		onUpload,
		onUploadError,
		onUploadSuccess,
		render,
		validator,
		// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- Can be undefined
	} = props ?? {};

	const [isDragging, toggleIsDragging] = useToggle(false);

	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

	const handleFileUpload = useCallbackRef(
		(event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
			if (event.defaultPrevented) return;

			if (event.type === "drop") {
				event.preventDefault();
				toggleIsDragging(false);
			}

			const fileList =
				event.type === "drop"
					? (event as React.DragEvent).dataTransfer.files
					: (event as React.ChangeEvent<HTMLInputElement>).target.files;

			if (fileList === null) {
				console.warn("No file selected");

				return;
			}

			const validFilesArray = handleFileValidation({
				existingFileArray: existingFiles,
				newFileList: fileList,
				onError: onUploadError,
				onSuccess: onUploadSuccess,
				validationSettings: {
					allowedFileTypes,
					disallowDuplicates,
					maxFileCount,
					maxFileSize,
				},
				validator,
			});

			if (validFilesArray.length === 0) return;

			setAcceptedFiles(validFilesArray);

			onUpload?.({ acceptedFiles: validFilesArray, event });
		}
	);

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		toggleIsDragging(true);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		toggleIsDragging(false);
	};

	const getRenderProps = (extraRenderProps?: UnknownObject) =>
		({
			acceptedFiles,
			inputRef,
			isDragging,
			openFilePicker: () => inputRef.current?.click(),
			...extraRenderProps,
		}) satisfies RenderProps as RenderProps & TExtraRenderProps;

	const computedChildren = children ?? render;

	const getChildren = (extraRenderProps?: UnknownObject) =>
		isFunction(computedChildren) ? computedChildren(getRenderProps(extraRenderProps)) : computedChildren;

	const getRootProps = (rootProps?: RootProps) => {
		const mergedRootProps = mergeTwoProps(extraRootProps, rootProps);

		return {
			...mergedRootProps,
			className: cnMerge(
				"relative isolate flex flex-col",
				mergedRootProps.className,
				classNames?.base,
				isDragging && ["opacity-60", classNames?.activeDrag, rootProps?.classNames?.activeDrag]
			),
			"data-active-drag": isDragging,
			"data-part": "root",
			"data-scope": "dropzone",
			onDragEnter: handleDragOver,
			onDragLeave: handleDragLeave,
			onDragOver: handleDragOver,
			onDrop: handleFileUpload,
		};
	};

	const getInputProps = (inputProps?: InputProps) => {
		const mergedInputProps = mergeTwoProps(extraInputProps, inputProps);

		return {
			...mergedInputProps,
			accept: allowedFileTypes ? allowedFileTypes.join(", ") : mergedInputProps.accept,
			className: cnMerge(
				"absolute inset-0 z-[100] cursor-pointer opacity-0",
				classNames?.input,
				mergedInputProps.className
			),
			"data-active-drag": isDragging,
			"data-part": "input",
			"data-scope": "dropzone",
			onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
				mergedInputProps.onChange?.(event);
				handleFileUpload(event);
			},
			ref: composeRefs([inputRef, mergedInputProps.ref]),
			type: "file",
		};
	};

	return {
		acceptedFiles,
		computedChildren,
		getChildren,
		getInputProps,
		getRenderProps,
		getRootProps,
		handleDragLeave,
		handleDragOver,
		handleFileUpload,
		inputRef,
		isDragging,
	};
};

export type UseDropZoneResult = ReturnType<typeof useDropZone>;
