import { cnMerge } from "@/lib/utils/cn";
import { dataAttr } from "@zayne-labs/toolkit-core";
import {
	type FileMeta,
	type FileValidationErrorContext,
	type FileValidationOptions,
	handleFileValidation,
	toArray,
} from "@zayne-labs/toolkit-core";
import { useCallbackRef } from "@zayne-labs/toolkit-react";
import {
	type InferProps,
	composeRefs,
	composeTwoEventHandlers,
	mergeTwoProps,
} from "@zayne-labs/toolkit-react/utils";
import { type Prettify, isString } from "@zayne-labs/toolkit-type-helpers";
import { useCallback, useMemo, useRef, useState } from "react";
import { clearObjectURL, createObjectURL, generateUniqueId } from "./utils";

export type ContainerProps = InferProps<HTMLElement> & {
	classNames?: {
		base?: string;
		isDragging?: string;
	};
};

export type InputProps = InferProps<"input">;

export type FileWithPreview = {
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

export type DropZoneState = {
	/**
	 *  List of validation errors
	 */
	errors: FileValidationErrorContext[];
	/**
	 *  List of files with their preview URLs and unique IDs
	 */
	filesWithPreview: FileWithPreview[];
	/**
	 *  Whether or not a file is currently being dragged over the drop zone
	 */
	isDragging: boolean;
};

type ChangeOrDragEvent = React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>;

export type DropZoneActions = {
	addFiles: (fileList: File[] | FileList | null, event?: ChangeOrDragEvent) => void;
	clearErrors: () => void;
	clearFiles: () => void;
	handleDragEnter: (event: React.DragEvent<HTMLElement>) => void;
	handleDragLeave: (event: React.DragEvent<HTMLElement>) => void;
	handleDragOver: (event: React.DragEvent<HTMLElement>) => void;
	handleFileUpload: (event: ChangeOrDragEvent) => void;
	openFilePicker: () => void;
	removeFile: (fileToRemoveOrId: string | FileWithPreview) => void;
};

export type UseDropZoneResult = {
	dropZoneActions: DropZoneActions;
	dropZoneState: DropZoneState;
	getContainerProps: (containerProps?: ContainerProps) => ContainerProps;
	getInputProps: (inputProps?: InputProps) => InputProps;
	inputRef: React.RefObject<HTMLInputElement | null>;
};

export type UseDropZoneProps = {
	/**
	 * Allowed file types to be uploaded.
	 */
	allowedFileTypes?: string[];

	/**
	 * CSS classes to apply to the various parts of the drop zone
	 */
	classNames?: Prettify<ContainerProps["classNames"] & { input?: string }>;

	/**
	 * Whether to disallow duplicate files
	 * @default true
	 */
	disallowDuplicates?: boolean;

	/**
	 * Whether to disallow preview for non-image files
	 * @default true
	 */
	disallowPreviewForNonImageFiles?: boolean;

	/**
	 * Extra props to pass to the container element
	 */
	extraContainerProps?: ContainerProps;

	/**
	 * Extra props to pass to the input element
	 */
	extraInputProps?: InputProps;

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
	 * Callback function to be called when the render props change
	 */
	onRenderPropsChange?: (props: UseDropZoneResult) => void;

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
	 * Custom validation function.
	 *
	 * If the function returns false, the file will be rejected
	 */
	validator?: NonNullable<FileValidationOptions["validationSettings"]>["validator"];

	/**
	 * Custom validation function that runs after all file validation has occurred
	 */
	validatorForAllFiles?: FileValidationOptions["validatorForAllFiles"];

	/**
	 * Whether to allow the default file picker via the file input element
	 * @default true
	 */
	withDefaultFilePicker?: boolean;
};

export const useDropZone = (props?: UseDropZoneProps): UseDropZoneResult => {
	const {
		allowedFileTypes,
		classNames,
		disallowDuplicates = true,
		disallowPreviewForNonImageFiles = true,
		extraContainerProps,
		extraInputProps,
		initialFiles,
		maxFileCount,
		maxFileSize,
		multiple,
		onFilesChange,
		onRenderPropsChange,
		onUpload,
		onUploadError,
		onUploadErrors,
		onUploadSuccess,
		validator,
		validatorForAllFiles,
		withDefaultFilePicker = true,
	} = props ?? {};

	const inputRef = useRef<HTMLInputElement>(null);

	const initialFileArray = toArray(initialFiles).filter(Boolean);

	const [dropZoneState, setDropZoneState] = useState<DropZoneState>({
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

	const addFiles: DropZoneActions["addFiles"] = useCallbackRef((fileList, event) => {
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
			validationSettings: {
				allowedFileTypes,
				disallowDuplicates,
				maxFileCount,
				maxFileSize,
				validator,
			},
			validatorForAllFiles,
		});

		if (validFiles.length === 0) {
			setDropZoneState((prevState) => ({ ...prevState, errors }));
			return;
		}

		const filesWithPreview: FileWithPreview[] = validFiles.map((file) => ({
			file,
			id: generateUniqueId(file),
			preview: createObjectURL(file, disallowPreviewForNonImageFiles),
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
		} satisfies DropZoneState;

		onFilesChange?.({ filesWithPreview: newFileUploadState.filesWithPreview });

		setDropZoneState(newFileUploadState);

		// == Reset input value after adding files
		inputRef.current && (inputRef.current.value = "");
	});

	const clearFiles: DropZoneActions["clearFiles"] = useCallbackRef(() => {
		// == Clean up object URLs if any
		dropZoneState.filesWithPreview.forEach((fileWithPreview) =>
			clearObjectURL(fileWithPreview, disallowPreviewForNonImageFiles)
		);

		const newFileUploadState = {
			...dropZoneState,
			errors: [],
			filesWithPreview: [],
		} satisfies DropZoneState;

		onFilesChange?.({ filesWithPreview: newFileUploadState.filesWithPreview });

		setDropZoneState(newFileUploadState);

		// == Reset input value after clearing files
		inputRef.current && (inputRef.current.value = "");
	});

	const removeFile: DropZoneActions["removeFile"] = useCallbackRef((fileToRemoveOrId) => {
		const actualFileToRemove = isString(fileToRemoveOrId)
			? dropZoneState.filesWithPreview.find((file) => file.id === fileToRemoveOrId)
			: fileToRemoveOrId;

		if (!actualFileToRemove) return;

		clearObjectURL(actualFileToRemove, disallowPreviewForNonImageFiles);

		const newFilesWithPreview = dropZoneState.filesWithPreview.filter(
			(file) => file.id !== actualFileToRemove.id
		);

		onFilesChange?.({ filesWithPreview: newFilesWithPreview });

		setDropZoneState({
			...dropZoneState,
			errors: [],
			filesWithPreview: newFilesWithPreview,
		});
	});

	const clearErrors: DropZoneActions["clearErrors"] = useCallbackRef(() => {
		setDropZoneState((prevState) => ({ ...prevState, errors: [] }));
	});

	const handleFileUpload: DropZoneActions["handleFileUpload"] = useCallbackRef((event) => {
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

	const handleDragEnter: DropZoneActions["handleDragEnter"] = useCallbackRef((event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleIsDragging(true);
	});

	const handleDragOver: DropZoneActions["handleDragOver"] = useCallbackRef((event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleIsDragging(true);
	});

	const handleDragLeave: DropZoneActions["handleDragLeave"] = useCallbackRef((event) => {
		event.preventDefault();
		event.stopPropagation();
		toggleIsDragging(false);
	});

	const openFilePicker: DropZoneActions["openFilePicker"] = useCallbackRef(() => {
		inputRef.current?.click();
	});

	const getContainerProps: UseDropZoneResult["getContainerProps"] = useCallback(
		(containerProps) => {
			const mergedContainerProps = mergeTwoProps(extraContainerProps, containerProps);

			return {
				...mergedContainerProps,
				className: cnMerge(
					"relative isolate flex flex-col",
					mergedContainerProps.className,
					classNames?.base,
					dropZoneState.isDragging && [
						"opacity-60",
						classNames?.isDragging,
						containerProps?.classNames?.isDragging,
					]
				),
				"data-dragging": dataAttr(dropZoneState.isDragging),
				"data-scope": "dropzone",
				// eslint-disable-next-line perfectionist/sort-objects -- I need data-scope to be first
				"data-part": "container",
				"data-slot": "dropzone-container",
				onDragEnter: composeTwoEventHandlers(handleDragEnter, mergedContainerProps.onDragEnter),
				onDragLeave: composeTwoEventHandlers(handleDragLeave, mergedContainerProps.onDragLeave),
				onDragOver: composeTwoEventHandlers(handleDragOver, mergedContainerProps.onDragOver),
				onDrop: composeTwoEventHandlers(handleFileUpload, mergedContainerProps.onDrop),
			};
		},
		[
			classNames?.base,
			classNames?.isDragging,
			extraContainerProps,
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
					withDefaultFilePicker ? "absolute inset-0 z-[100] cursor-pointer opacity-0" : "hidden",
					classNames?.input,
					mergedInputProps.className
				),
				"data-dragging": dataAttr(dropZoneState.isDragging),
				"data-scope": "dropzone",
				// eslint-disable-next-line perfectionist/sort-objects -- I need data-scope to be first
				"data-part": "input",
				"data-slot": "dropzone-input",
				multiple: multiple ?? mergedInputProps.multiple,
				onChange: composeTwoEventHandlers(handleFileUpload, mergedInputProps.onChange),
				ref: composeRefs(inputRef, mergedInputProps.ref),
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
			withDefaultFilePicker,
		]
	);

	const savedOnRenderPropsChange = useCallbackRef(onRenderPropsChange);

	const dropZoneResult = useMemo(() => {
		const propsForRenderFn = {
			dropZoneActions: {
				addFiles,
				clearErrors,
				clearFiles,
				handleDragEnter,
				handleDragLeave,
				handleDragOver,
				handleFileUpload,
				openFilePicker,
				removeFile,
			},
			dropZoneState,
			getContainerProps,
			getInputProps,
			inputRef,
		} satisfies UseDropZoneResult;

		savedOnRenderPropsChange(propsForRenderFn);

		return propsForRenderFn;
	}, [
		savedOnRenderPropsChange,
		addFiles,
		clearErrors,
		clearFiles,
		dropZoneState,
		getInputProps,
		getContainerProps,
		handleDragEnter,
		handleDragLeave,
		handleDragOver,
		handleFileUpload,
		openFilePicker,
		removeFile,
	]);

	return dropZoneResult;
};
