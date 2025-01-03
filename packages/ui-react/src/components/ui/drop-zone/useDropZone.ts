"use client";

import { cnMerge } from "@/lib/utils/cn";
import { type FileValidationOptions, handleFileValidation } from "@zayne-labs/toolkit-core";
import { useCallbackRef, useToggle } from "@zayne-labs/toolkit-react";
import type { InferProps } from "@zayne-labs/toolkit-react/utils";
import { isFunction, isObject } from "@zayne-labs/toolkit-type-helpers";
import { type RefCallback, useRef, useState } from "react";

type RenderProps = {
	acceptedFiles: File[];
	inputRef: React.RefObject<HTMLInputElement | null>;
	isDragging: boolean;
};

export type UseDropZoneProps = {
	allowedFileTypes?: string[];

	children?: React.ReactNode | ((props: RenderProps) => React.ReactNode);

	classNames?: { activeDrag?: string; base?: string; input?: string };

	disableInbuiltValidation?: boolean;

	existingFiles?: File[];

	extraInputProps?: Omit<InferProps<"input">, "ref">;

	extraRootProps?: InferProps<"div">;

	onUpload?: (details: {
		acceptedFiles: File[];
		event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>;
	}) => void;

	onUploadError?: FileValidationOptions["onError"];

	onUploadSuccess?: FileValidationOptions["onSuccess"];

	ref?: React.Ref<HTMLInputElement>;

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
		disableInbuiltValidation,
		existingFiles,
		extraInputProps,
		extraRootProps,
		onUpload,
		onUploadError,
		onUploadSuccess,
		ref,
		validationSettings,
		validator,
		// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- Can be undefined
	} = props ?? {};

	const [isDragging, toggleIsDragging] = useToggle(false);

	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

	const handleFileUpload = useCallbackRef(
		(event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
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

			const inbuiltValidatedFilesArray = !disableInbuiltValidation
				? handleFileValidation({
						existingFileArray: existingFiles,
						newFileList: fileList,
						onError: onUploadError,
						onSuccess: onUploadSuccess,
						validationSettings: isObject(validationSettings)
							? { ...validationSettings, allowedFileTypes }
							: {},
					})
				: [];

			const validatorFnFileArray = validator
				? validator({ existingFileArray: existingFiles, newFileList: fileList })
				: [];

			const validFilesArray = [...inbuiltValidatedFilesArray, ...validatorFnFileArray];

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

	const getRootProps = () => ({
		...extraRootProps,
		className: cnMerge(
			"relative isolate flex flex-col",
			extraRootProps?.className,
			classNames?.base,
			isDragging && ["opacity-60", classNames?.activeDrag]
		),
		"data-active-drag": isDragging,
		"data-part": "root",
		"data-scope": "dropzone",
		onDragEnter: handleDragOver,
		onDragLeave: handleDragLeave,
		onDragOver: handleDragOver,
		onDrop: handleFileUpload,
	});

	const refCallback: RefCallback<HTMLInputElement> = useCallbackRef((node) => {
		inputRef.current = node;

		if (!ref) return;

		if (isFunction(ref)) {
			return ref(node);
		}

		ref.current = node;
	});

	const getInputProps = () => ({
		...extraInputProps,
		accept: allowedFileTypes ? allowedFileTypes.join(", ") : extraInputProps?.accept,
		className: cnMerge(
			"absolute inset-0 z-[100] cursor-pointer opacity-0",
			extraInputProps?.className,
			classNames?.input
		),
		"data-part": "input",
		"data-scope": "dropzone",
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			handleFileUpload(event);
			extraInputProps?.onChange?.(event);
		},
		ref: refCallback,
		type: "file",
	});

	return {
		getChildren,
		getInputProps,
		getRenderProps,
		getRootProps,
		handleDragLeave,
		handleDragOver,
		handleFileUpload,
		isDragging,
		ref,
	};
};
