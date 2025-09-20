import {
	createFileURL,
	type FileOrFileMeta,
	type FileValidationErrorContextEach,
	generateFileID as generateFileIDPrimitive,
} from "@zayne-labs/toolkit-core";
import { isFile, isObject, isString } from "@zayne-labs/toolkit-type-helpers";
import type { FileState, FileStateOrIDProp, PartProps } from "./types";

export const generateFileID = generateFileIDPrimitive;

export const createObjectURL = (
	file: FileOrFileMeta,
	disallowPreviewForNonImageFiles: boolean | undefined
) => {
	if (disallowPreviewForNonImageFiles && !file.type?.startsWith("image/")) return;

	return createFileURL(file);
};

export const clearObjectURL = (
	fileState: FileState | undefined,
	disallowPreviewForNonImageFiles: boolean | undefined
) => {
	if (!isFile(fileState?.file)) return;

	if (disallowPreviewForNonImageFiles && !fileState.file.type.startsWith("image/")) return;

	if (!fileState.preview) return;

	URL.revokeObjectURL(fileState.preview);
};

export const isMatchingFile = (
	options: FileStateOrIDProp & {
		fileState: FileOrFileMeta | FileState;
	}
) => {
	const { fileState, fileStateOrID } = options;

	const fileID = isFile(fileState) ? generateFileID(fileState) : fileState.id;

	if (isString(fileStateOrID)) {
		return fileID === fileStateOrID;
	}

	if (isFile(fileStateOrID)) {
		const generatedFileID = generateFileID(fileStateOrID);
		return fileID === generatedFileID;
	}

	return fileID === fileStateOrID.id;
};

type FromCamelToKebabCase<TString extends string> =
	TString extends `${infer First}${infer Rest}` ?
		First extends Uppercase<First> ?
			`-${Lowercase<First>}${FromCamelToKebabCase<Rest>}`
		:	`${First}${FromCamelToKebabCase<Rest>}`
	:	"";

export const getScopeAttrs = (part: FromCamelToKebabCase<keyof PartProps>) => {
	return {
		/* eslint-disable perfectionist/sort-objects -- I need this order to be maintained */
		"data-slot": `dropzone-${part}`,
		"data-scope": "dropzone",
		"data-part": part,
		/* eslint-enable perfectionist/sort-objects -- I need this order to be maintained */
	} as const;
};

const dropZoneErrorSymbol = Symbol("DropZoneError");

export class DropZoneError extends Error {
	readonly dropZoneErrorSymbol = dropZoneErrorSymbol;
	file?: FileValidationErrorContextEach["file"];
	override name = "DropZoneError" as const;

	constructor(
		ctx: Pick<FileValidationErrorContextEach, "message"> & {
			file?: FileValidationErrorContextEach["file"];
		},
		errorOptions?: ErrorOptions
	) {
		const { file, message } = ctx;

		super(message, errorOptions);

		this.file = file;
	}

	static override isError(error: unknown): error is DropZoneError {
		if (!isObject<DropZoneError>(error)) {
			return false;
		}

		if (error instanceof DropZoneError) {
			return true;
		}

		const actualError = error as DropZoneError;

		return (
			actualError.dropZoneErrorSymbol === dropZoneErrorSymbol
			// eslint-disable-next-line ts-eslint/no-unnecessary-condition -- Allow
			&& actualError.name === "DropZoneError"
		);
	}
}

export const getErrorContext = (error: DropZoneError | Error): NonNullable<FileState["error"]> => {
	if (DropZoneError.isError(error)) {
		return {
			cause: "custom-error",
			code: "upload-error",
			file: error.file ?? ({} as never),
			message: error.message,
			originalError: error.cause ?? error,
		};
	}

	const actualError = Error.isError(error) ? error : new Error("File upload failed", { cause: error });

	return {
		cause: "custom-error",
		code: "upload-error",
		file: isFile(actualError.cause) ? actualError.cause : ({} as never),
		message: Error.isError(error) ? actualError.message : String(actualError),
		originalError: actualError,
	};
};
