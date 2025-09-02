import { createStore, handleFileValidationAsync, toArray } from "@zayne-labs/toolkit-core";
import { isFile, isString } from "@zayne-labs/toolkit-type-helpers";
import type { DropZoneActions, DropZoneState, UseDropZoneProps } from "./types";
import { clearObjectURL, createObjectURL, generateUniqueId } from "./utils";

export type DropZoneStore = DropZoneState & { actions: DropZoneActions };

export const createDropZoneStore = (
	initStoreValues: Pick<
		UseDropZoneProps,
		| "allowedFileTypes"
		| "disablePreviewForNonImageFiles"
		| "initialFiles"
		| "maxFileCount"
		| "maxFileSize"
		| "multiple"
		| "onFilesChange"
		| "onUpload"
		| "onUploadError"
		| "onUploadErrorCollection"
		| "onUploadSuccess"
		| "rejectDuplicateFiles"
		| "validator"
	> & {
		inputRef: React.RefObject<HTMLInputElement | null>;
	}
) => {
	const {
		allowedFileTypes,
		disablePreviewForNonImageFiles,
		initialFiles,
		inputRef,
		maxFileCount,
		maxFileSize,
		multiple,
		onFilesChange,
		onUpload,
		onUploadError,
		onUploadErrorCollection,
		onUploadSuccess,
		rejectDuplicateFiles,
		validator,
	} = initStoreValues;

	const initialFileArray = toArray(initialFiles).filter(Boolean);

	const clearInputValue = () => {
		if (!inputRef.current) return;

		inputRef.current.value = "";
	};

	const store = createStore<DropZoneStore>((set, get) => ({
		errors: [],
		fileStateArray: initialFileArray.map((fileMeta) => ({
			file: fileMeta,
			id: fileMeta.id,
			preview: isString(fileMeta.url) ? fileMeta.url : undefined,
		})),
		isDraggingOver: false,

		// eslint-disable-next-line perfectionist/sort-objects -- Ignore
		actions: {
			// registerEventListeners: () => {
			// 	const containerElement = {}
			// 	const inputElement = {}

			// 	inputRef.current.addEventListener("change", get().actions.handleChange);
			// 	inputRef.current.addEventListener("dragenter", get().actions.handleDragEnter);
			// 	inputRef.current.addEventListener("dragleave", get().actions.handleDragLeave);
			// 	inputRef.current.addEventListener("dragover", get().actions.handleDragOver);
			// 	inputRef.current.addEventListener("drop", get().actions.handleDrop);
			// },

			addFiles: async (files) => {
				if (!files || files.length === 0) {
					console.warn("No file selected!");
					return;
				}

				const { fileStateArray } = get();

				// == In single file mode, only use the first file
				const newFiles = !multiple ? [files[0]] : files;

				const { errors, validFiles } = await handleFileValidationAsync({
					existingFiles: fileStateArray.map((fileWithPreview) => fileWithPreview.file),
					hooks: {
						onError: onUploadError,
						onErrorCollection: onUploadErrorCollection,
						onSuccess: onUploadSuccess,
					},
					newFiles,
					settings: {
						allowedFileTypes,
						maxFileCount,
						maxFileSize,
						rejectDuplicateFiles,
						validator,
					},
				});

				if (validFiles.length === 0) {
					set({ errors, isDraggingOver: false });
					return;
				}

				const newFileStateArray = validFiles.map((file) => ({
					file,
					id: generateUniqueId(file),
					preview: createObjectURL(file, disablePreviewForNonImageFiles),
				}));

				set({
					errors,
					fileStateArray: multiple ? [...fileStateArray, ...newFileStateArray] : newFileStateArray,
					isDraggingOver: false,
				});

				await onUpload?.({ fileStateArray: newFileStateArray });
			},
			clearErrors: () => {
				set({ errors: [] });
			},
			clearFiles: () => {
				const { fileStateArray } = get();

				for (const fileState of fileStateArray) {
					clearObjectURL(fileState, disablePreviewForNonImageFiles);
				}

				set({ fileStateArray: [] });
			},
			handleChange: async (event) => {
				const fileList = event.target.files;

				const { actions } = get();

				await actions.addFiles(fileList);

				clearInputValue();
			},
			handleDragEnter: (event) => {
				event.preventDefault();
				event.stopPropagation();

				set({ isDraggingOver: true });
			},
			handleDragLeave: (event) => {
				event.preventDefault();
				event.stopPropagation();

				set({ isDraggingOver: false });
			},
			handleDragOver: (event) => {
				event.preventDefault();
				event.stopPropagation();
			},
			handleDrop: async (event) => {
				event.preventDefault();
				event.stopPropagation();

				if (inputRef.current?.disabled) {
					return;
				}

				const fileList = event.dataTransfer.files;

				const { actions } = get();

				await actions.addFiles(fileList);
			},
			openFilePicker: () => {
				inputRef.current?.click();
			},
			removeFile: (fileItemOrID) => {
				const { fileStateArray } = get();

				const actualFileToRemove = fileStateArray.find((fileState) => {
					if (isString(fileItemOrID)) {
						return fileState.id === fileItemOrID;
					}

					if (isFile(fileItemOrID)) {
						return fileState.file === fileItemOrID;
					}

					return fileState.id === fileItemOrID?.id;
				});

				if (!actualFileToRemove) return;

				clearObjectURL(actualFileToRemove, disablePreviewForNonImageFiles);

				const updatedFileStateArray = fileStateArray.filter(
					(file) => file.id !== actualFileToRemove.id
				);

				set({ errors: [], fileStateArray: updatedFileStateArray });
			},
		},
	}));

	// == File change subscription
	store.subscribe.withSelector(
		(state) => state.fileStateArray,
		(fileStateArray) => onFilesChange?.({ fileStateArray })
	);

	return store;
};
