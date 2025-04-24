import { cnMerge } from "@/lib/utils/cn";
import { dataAttr } from "@/lib/utils/common";
import { toArray } from "@zayne-labs/toolkit-core";
import {
	type FileMeta,
	type FileValidationErrorContext,
	type FileValidationOptions,
	createImagePreview,
	handleFileValidation,
} from "@zayne-labs/toolkit-core";
import { useCallbackRef } from "@zayne-labs/toolkit-react";
import {
	type DiscriminatedRenderProps,
	type InferProps,
	composeRefs,
	mergeTwoProps,
} from "@zayne-labs/toolkit-react/utils";
import { type Prettify, isFunction } from "@zayne-labs/toolkit-type-helpers";
import { useCallback, useRef, useState } from "react";
import { clearObjectURL, generateUniqueId } from "./utils";

export type RootProps = InferProps<HTMLElement> & {
	classNames?: {
		base?: string;
		isDragging?: string;
	};
};

export type InputProps = InferProps<"input">;

export type FileWithPreview = {
	file: File | FileMeta;
	id: string;
	preview?: string;
};

export type FileUploadState = {
	errors: FileValidationErrorContext[];
	filesWithPreview: FileWithPreview[];
	isDragging: boolean;
};

type ChangeOrDragEvent = React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>;

type UseDropZoneResult = {
	addFiles: (fileList: File[] | FileList | null, event?: ChangeOrDragEvent) => void;
	clearErrors: () => void;
	clearFiles: () => void;
	dropZoneState: FileUploadState;
	getInputProps: (inputProps?: InputProps) => InputProps;
	getResolvedChildren: () => React.ReactNode;
	getRootProps: (rootProps?: RootProps) => RootProps;
	handleDragEnter: (event: React.DragEvent<HTMLElement>) => void;
	handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
	handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
	handleFileUpload: (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>) => void;
	inputRef: React.RefObject<HTMLInputElement | null>;
	openFilePicker: () => void;
	removeFile: (id: string) => void;
};

type RenderProps = Omit<UseDropZoneResult, "getResolvedChildren">;

type DropZoneRenderProps = DiscriminatedRenderProps<
	React.ReactNode | ((props: RenderProps) => React.ReactNode)
>;

export type UseDropZoneProps = DropZoneRenderProps & {
	/**
	 * Allowed file types to be uploaded.
	 */
	allowedFileTypes?: string[];

	/**
	 * CSS classes to apply to the various parts of the drop zone
	 */
	classNames?: Prettify<RootProps["classNames"] & { input?: string }>;

	/**
	 * Whether to disallow duplicate files
	 * @default true
	 */
	disallowDuplicates?: boolean;

	/**
	 * Extra props to pass to the input element
	 */
	extraInputProps?: InputProps;

	/**
	 * Extra props to pass to the root element
	 */
	extraRootProps?: RootProps;

	/**
	 * Initial files to populate the drop zone
	 */
	initialFiles?: FileMeta | FileMeta[] | null;

	/**
	 * Maximum number of files that can be uploaded.
	 */
	maxFileCount?: number;

	/**
	 * Maximum file size in MB
	 */
	maxFileSize?: number;

	/**
	 * Whether to allow multiple files to be uploaded
	 */
	multiple?: boolean;

	/**
	 * Callback function to be called when internal files state changes
	 */
	onFilesChange?: (context: { filesWithPreview: FileWithPreview[] }) => void;

	/**
	 * Callback function to be called when new files are uploaded
	 */
	onUpload?: (context: { event: ChangeOrDragEvent; filesWithPreview: FileWithPreview[] }) => void;

	/**
	 * Callback function to be called on each file upload as they occur
	 */
	onUploadError?: FileValidationOptions["onError"];

	/**
	 * Callback function to be called once after all file upload errors have occurred
	 */
	onUploadErrors?: FileValidationOptions["onErrors"];

	/**
	 * Callback function to be called on file upload success
	 */
	onUploadSuccess?: FileValidationOptions["onSuccess"];

	/**
	 * Custom validator function to handle file validation
	 */
	validator?: FileValidationOptions["validator"];
};

export const useDropZone = (props?: UseDropZoneProps): UseDropZoneResult => {
	const {
		allowedFileTypes,
		children,
		classNames,
		disallowDuplicates = true,
		extraInputProps,
		extraRootProps,
		initialFiles,
		maxFileCount,
		maxFileSize,
		multiple,
		onFilesChange,
		onUpload,
		onUploadError,
		onUploadErrors,
		onUploadSuccess,
		render,
		validator,
	} = props ?? {};

	const inputRef = useRef<HTMLInputElement>(null);

	const initialFileArray = toArray(initialFiles).filter(Boolean);

	const [dropZoneState, setDropZoneState] = useState<FileUploadState>({
		errors: [],
		filesWithPreview: initialFileArray.map((fileMeta) => ({
			file: fileMeta,
			id: fileMeta.id,
			preview: fileMeta.url,
		})),
		isDragging: false,
	});

	const toggleIsDragging = (value: boolean) => {
		setDropZoneState((prevState) => ({ ...prevState, isDragging: value }));
	};

	const addFiles: UseDropZoneResult["addFiles"] = useCallbackRef((fileList, event) => {
		if (!fileList || fileList.length === 0) {
			console.warn("No file selected!");
			return;
		}

		// Clear existing errors when new files are uploaded
		clearErrors();

		// In single file mode, clear existing files first
		if (!multiple) {
			clearFiles();
		}

		const { errors, validFiles } = handleFileValidation({
			existingFiles: dropZoneState.filesWithPreview.map((fileWithPreview) => fileWithPreview.file),
			newFiles: fileList,
			onError: onUploadError,
			onErrors: onUploadErrors,
			onSuccess: onUploadSuccess,
			validationSettings: { allowedFileTypes, disallowDuplicates, maxFileCount, maxFileSize },
			validator,
		});

		if (validFiles.length === 0) {
			setDropZoneState((prevState) => ({ ...prevState, errors }));
			return;
		}

		const filesWithPreview: FileWithPreview[] = validFiles.map((file) => ({
			file,
			id: generateUniqueId(file),
			preview: createImagePreview({ file }),
		}));

		// == Only call onUpload callback if event is provided, which indicates that new files were uploaded from an event handler

		if (event) {
			onUpload?.({ event, filesWithPreview });
		}

		const newFileUploadState = {
			...dropZoneState,
			errors,
			...(event?.type === "drop" && { isDragging: false }),
			filesWithPreview: multiple
				? [...dropZoneState.filesWithPreview, ...filesWithPreview]
				: filesWithPreview,
		} satisfies FileUploadState;

		onFilesChange?.({ filesWithPreview: newFileUploadState.filesWithPreview });

		setDropZoneState(newFileUploadState);

		// == Reset input value after adding files
		inputRef.current && (inputRef.current.value = "");
	});

	const clearFiles: UseDropZoneResult["clearFiles"] = useCallbackRef(() => {
		// == Clean up object URLs if any
		dropZoneState.filesWithPreview.forEach((fileObject) => clearObjectURL(fileObject));

		const newFileUploadState = {
			...dropZoneState,
			errors: [],
			filesWithPreview: [],
		} satisfies FileUploadState;

		onFilesChange?.({ filesWithPreview: newFileUploadState.filesWithPreview });

		setDropZoneState(newFileUploadState);

		// == Reset input value after clearing files
		inputRef.current && (inputRef.current.value = "");
	});

	const removeFile: UseDropZoneResult["removeFile"] = useCallbackRef((id) => {
		const fileToRemove = dropZoneState.filesWithPreview.find((fileObject) => fileObject.id === id);

		clearObjectURL(fileToRemove);

		const newFilesWithPreview = dropZoneState.filesWithPreview.filter((file) => file.id !== id);

		onFilesChange?.({ filesWithPreview: newFilesWithPreview });

		setDropZoneState({
			...dropZoneState,
			errors: [],
			filesWithPreview: newFilesWithPreview,
		});
	});

	const clearErrors: UseDropZoneResult["clearErrors"] = useCallbackRef(() => {
		setDropZoneState((prevState) => ({ ...prevState, errors: [] }));
	});

	const handleFileUpload: UseDropZoneResult["handleFileUpload"] = useCallbackRef((event) => {
		if (event.defaultPrevented) return;

		if (inputRef.current?.disabled) return;

		if (event.type === "drop") {
			event.preventDefault();
			event.stopPropagation();
		}

		const fileList =
			event.type === "drop"
				? (event as React.DragEvent).dataTransfer.files
				: (event as React.ChangeEvent<HTMLInputElement>).target.files;

		// == In single file mode, only use the first file
		if (!multiple) {
			const firstFile = fileList?.[0];

			firstFile && addFiles([firstFile], event);

			return;
		}

		addFiles(fileList, event);
	});

	const handleDragEnter: UseDropZoneResult["handleDragEnter"] = useCallbackRef((event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleIsDragging(true);
	});

	const handleDragOver: UseDropZoneResult["handleDragOver"] = useCallbackRef((event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleIsDragging(true);
	});

	const handleDragLeave: UseDropZoneResult["handleDragLeave"] = useCallbackRef((event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleIsDragging(false);
	});

	const openFilePicker: UseDropZoneResult["openFilePicker"] = useCallbackRef(() => {
		inputRef.current?.click();
	});

	const getRootProps: UseDropZoneResult["getRootProps"] = useCallback(
		(rootProps) => {
			const mergedRootProps = mergeTwoProps(extraRootProps, rootProps);

			return {
				...mergedRootProps,
				className: cnMerge(
					"relative isolate flex flex-col",
					mergedRootProps.className,
					classNames?.base,
					dropZoneState.isDragging && [
						"opacity-60",
						classNames?.isDragging,
						rootProps?.classNames?.isDragging,
					]
				),
				"data-dragging": dataAttr(dropZoneState.isDragging),
				"data-scope": "dropzone",
				// eslint-disable-next-line perfectionist/sort-objects -- I need data-scope to be first
				"data-part": "root",
				"data-slot": "dropzone-root",
				onDragEnter: handleDragEnter,
				onDragLeave: handleDragLeave,
				onDragOver: handleDragOver,
				onDrop: handleFileUpload,
			};
		},
		[
			classNames?.base,
			classNames?.isDragging,
			extraRootProps,
			dropZoneState.isDragging,
			handleDragEnter,
			handleDragLeave,
			handleDragOver,
			handleFileUpload,
		]
	);

	const getInputProps: UseDropZoneResult["getInputProps"] = useCallback(
		(inputProps) => {
			const mergedInputProps = mergeTwoProps(extraInputProps, inputProps);

			return {
				...mergedInputProps,
				accept: allowedFileTypes ? allowedFileTypes.join(", ") : mergedInputProps.accept,
				className: cnMerge(
					"absolute inset-0 z-[100] cursor-pointer opacity-0",
					classNames?.input,
					mergedInputProps.className
				),
				"data-dragging": dataAttr(dropZoneState.isDragging),
				"data-scope": "dropzone",
				// eslint-disable-next-line perfectionist/sort-objects -- I need data-scope to be first
				"data-part": "input",
				"data-slot": "dropzone-input",
				multiple: multiple ?? mergedInputProps.multiple,
				onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
					mergedInputProps.onChange?.(event);
					handleFileUpload(event);
				},
				ref: composeRefs([inputRef, mergedInputProps.ref]),
				type: "file",
			};
		},
		[
			allowedFileTypes,
			classNames?.input,
			extraInputProps,
			dropZoneState.isDragging,
			handleFileUpload,
			multiple,
		]
	);

	const renderProps = {
		addFiles,
		clearErrors,
		clearFiles,
		dropZoneState,
		getInputProps,
		getRootProps,
		handleDragEnter,
		handleDragLeave,
		handleDragOver,
		handleFileUpload,
		inputRef,
		openFilePicker,
		removeFile,
	} satisfies RenderProps;

	const selectedChildren = children ?? render;

	const getResolvedChildren = () => {
		return isFunction(selectedChildren) ? selectedChildren(renderProps) : selectedChildren;
	};

	return {
		...renderProps,
		getResolvedChildren,
	};
};
