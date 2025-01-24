"use client";

import { cnMerge } from "@/lib/utils/cn";
import { type FileValidationOptions, handleFileValidation } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useToggle } from "@zayne-labs/toolkit-react";
import { type InferProps, composeRefs, mergeTwoProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction, isObject } from "@zayne-labs/toolkit-type-helpers";
import { useRef, useState } from "react";

type RenderProps = {
	acceptedFiles: File[];
	inputRef: React.RefObject<HTMLInputElement | null>;
	isDragging: boolean;
};

export type RootProps = InferProps<"div"> & { classNames?: { activeDrag?: string; base?: string } };

export type InputProps = InferProps<"input">;

export type UseDropZoneProps = {
	allowedFileTypes?: string[];

	children?: React.ReactNode | ((props: RenderProps) => React.ReactNode);

	classNames?: { activeDrag?: string; base?: string; input?: string };

	existingFiles?: File[];

	extraInputProps?: InputProps;

	extraRootProps?: RootProps;

	onUpload?: (details: {
		acceptedFiles: File[];
		event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>;
	}) => void;

	onUploadError?: FileValidationOptions["onError"];

	onUploadSuccess?: FileValidationOptions["onSuccess"];

	validationSettings?: {
		disallowDuplicates?: boolean;
		fileLimit?: number;
		maxFileSize?: number;
	};
	validator?: (context: { existingFileArray: File[] | undefined; newFileList: FileList }) => File[];
};

export const useDropZone = (props: UseDropZoneProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		allowedFileTypes,
		children,
		classNames,
		existingFiles,
		extraInputProps,
		extraRootProps,
		onUpload,
		onUploadError,
		onUploadSuccess,
		validationSettings,
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

			const resolvedValidationSettings = isObject(validationSettings)
				? { ...validationSettings, allowedFileTypes }
				: {};

			const inbuiltValidatedFilesArray = handleFileValidation({
				existingFileArray: existingFiles,
				newFileList: fileList,
				onError: onUploadError,
				onSuccess: onUploadSuccess,
				validationSettings: resolvedValidationSettings,
			});

			const validatorFnResult = validator
				? validator({ existingFileArray: existingFiles, newFileList: fileList })
				: [];

			const validFilesArray = [...inbuiltValidatedFilesArray, ...validatorFnResult];

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

	const getRenderProps = () => ({ acceptedFiles, inputRef, isDragging }) satisfies RenderProps;

	const getChildren = () => (isFunction(children) ? children(getRenderProps()) : children);

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
