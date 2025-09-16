import { createStore, handleFileValidationAsync, toArray } from "@zayne-labs/toolkit-core";
import { isString } from "@zayne-labs/toolkit-type-helpers";
import type { DropZoneActions, DropZoneState, UseDropZoneProps } from "./types";
import { clearObjectURL, createObjectURL, generateFileID, getErrorContext, isMatchingFile } from "./utils";

export type DropZoneStore = DropZoneActions & DropZoneState;

type RequiredUseDropZoneProps = {
	[Key in keyof Required<UseDropZoneProps>]: UseDropZoneProps[Key] | undefined;
};

type InitStoreValues = Omit<
	RequiredUseDropZoneProps,
	"disabled" | "disableFilePickerOpenOnAreaClick" | "disableInternalStateSubscription" | "extraProps"
> & { inputRef: React.RefObject<HTMLInputElement | null> };

export const createDropZoneStore = (initStoreValues: InitStoreValues) => {
	const {
		allowedFileTypes,
		disablePreviewGenForNonImageFiles,
		initialFiles,
		inputRef,
		maxFileCount,
		maxFileSize,
		multiple,
		onFilesChange,
		onUpload,
		onValidationError,
		onValidationSuccess,
		rejectDuplicateFiles,
		validator,
	} = initStoreValues;

	const initialFileArray = toArray(initialFiles).filter(Boolean);

	const clearInputValue = () => {
		if (!inputRef.current) return;

		inputRef.current.value = "";
	};

	const initFileStateArray: DropZoneState["fileStateArray"] = initialFileArray.map((fileMeta) => ({
		file: fileMeta,
		id: fileMeta.id,
		preview: isString(fileMeta.url) ? fileMeta.url : undefined,
		progress: 0,
		status: "idle",
	}));

	const store = createStore<DropZoneStore>((set, get) => ({
		disabled: false,
		errors: [],
		fileStateArray: initFileStateArray,
		isDraggingOver: false,
		isInvalid: false,

		// eslint-disable-next-line perfectionist/sort-objects -- ignore
		actions: {
			addFiles: async (files) => {
				if (!files || files.length === 0) {
					console.warn("No file selected!");
					return;
				}

				const { actions, fileStateArray } = get();

				// == In single file mode, only use the first file
				const resolvedNewFiles = !multiple ? [files[0]] : files;

				const { errors, validFiles } = await handleFileValidationAsync({
					existingFiles: fileStateArray.map((fileWithPreview) => fileWithPreview.file),
					hooks: {
						onErrorEach: onValidationError,
						onSuccessBatch: onValidationSuccess,
					},
					newFiles: resolvedNewFiles,
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

				const newFileStateArray: DropZoneState["fileStateArray"] = validFiles.map((file) => ({
					file,
					id: generateFileID(file),
					preview: createObjectURL(file, disablePreviewGenForNonImageFiles),
					progress: 0,
					status: "idle",
				}));

				set({
					errors,
					fileStateArray: !multiple ? newFileStateArray : [...fileStateArray, ...newFileStateArray],
					isDraggingOver: false,
				});

				await actions.handleFileUpload({ newFileStateArray });
			},

			clearErrors: () => {
				set({ errors: [], isInvalid: false });
			},

			clearFiles: () => {
				const { actions } = get();

				actions.clearObjectURLs();

				set({ errors: [], fileStateArray: [], isInvalid: false });
			},

			clearObjectURLs: () => {
				const { fileStateArray } = get();

				for (const fileState of fileStateArray) {
					clearObjectURL(fileState, disablePreviewGenForNonImageFiles);
				}
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

				const { actions } = get();

				const fileList = event.dataTransfer.files;

				await actions.addFiles(fileList);
			},

			handleFileUpload: async (context) => {
				const { newFileStateArray } = context;

				const { actions } = get();

				if (!onUpload) {
					for (const fileState of newFileStateArray) {
						actions.updateFileState({ fileStateOrID: fileState, progress: 100, status: "success" });
					}
					return;
				}

				try {
					await onUpload({
						fileStateArray: newFileStateArray,
						onError: (ctx) => {
							const { error, fileStateOrID } = ctx;

							const errorContext = getErrorContext(error);

							actions.updateFileState({ error: errorContext, fileStateOrID, status: "error" });
						},
						onProgress: (ctx) => {
							const { fileStateOrID, progress } = ctx;

							actions.updateFileState({ fileStateOrID, progress });
						},
						onSuccess: (ctx) => {
							const { fileStateOrID } = ctx;

							actions.updateFileState({ fileStateOrID, progress: 100, status: "success" });
						},
					});

					// Handle Errors
				} catch (error) {
					const errorContext = getErrorContext(error as Error);

					for (const fileState of newFileStateArray) {
						actions.updateFileState({
							error: errorContext,
							fileStateOrID: fileState,
							status: "error",
						});
					}

					// set((prevState) => ({ errors: [...prevState.errors, errorContext] }));
				}
			},

			handleKeyDown: (event) => {
				const isEnterKey = event.key === "Enter";
				const isSpaceKey = event.key === " ";

				const isAllowedKey = isEnterKey || isSpaceKey;

				if (!isAllowedKey) return;

				event.preventDefault();

				const { actions } = get();

				actions.openFilePicker();
			},

			handlePaste: async (event) => {
				event.preventDefault();
				event.stopPropagation();

				const { actions } = get();

				const fileList = event.clipboardData.files;

				await actions.addFiles(fileList);
			},

			openFilePicker: () => {
				inputRef.current?.click();
			},

			removeFile: (ctx) => {
				const { fileStateOrID } = ctx;

				const { fileStateArray } = get();

				const updatedFileStateArray = fileStateArray.flatMap((fileState) => {
					if (isMatchingFile({ fileState, fileStateOrID })) {
						clearObjectURL(fileState, disablePreviewGenForNonImageFiles);

						return [];
					}

					return fileState;
				});

				set({ errors: [], fileStateArray: updatedFileStateArray });
			},

			updateFileState: (ctx) => {
				const { fileStateOrID, ...updatedFileState } = ctx;

				const { fileStateArray } = get();

				const updatedFileStateArray: DropZoneState["fileStateArray"] = fileStateArray.map(
					(fileState) => {
						if (isMatchingFile({ fileState, fileStateOrID })) {
							return {
								...fileState,
								...updatedFileState,
							};
						}

						return fileState;
					}
				);

				// const updatedErrorsState =
				// 	updatedFileState.error ?
				// 		{ errors: [...errors, updatedFileState.error] satisfies DropZoneState["errors"] }
				// 	:	null;

				set({ fileStateArray: updatedFileStateArray });
			},
		},
	}));

	// == File change subscription
	store.subscribe.withSelector(
		(state) => state.fileStateArray,
		(fileStateArray) => onFilesChange?.({ fileStateArray })
	);

	// == Set `isInvalid` to true if there are errors
	store.subscribe.withSelector(
		(state) => state.errors,
		(errors) => {
			if (errors.length === 0) return;

			store.setState({ isInvalid: true });
		}
	);

	// == Update `isInvalid` to false after 1.5 seconds
	store.subscribe.withSelector(
		(state) => state.isInvalid,
		(isInvalid) => {
			if (!isInvalid) return;

			setTimeout(() => store.setState({ isInvalid: !isInvalid }), 1500);
		}
	);

	return store;
};
