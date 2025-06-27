import { createImagePreview, type FileMeta } from "@zayne-labs/toolkit-core";
import { isFile } from "@zayne-labs/toolkit-type-helpers";
import type { FileState } from "./types";

export const generateUniqueId = (file: File | FileMeta): string => {
	if (!isFile(file)) {
		return file.id;
	}

	return `${file.name}-(${Math.round(performance.now())})-${crypto.randomUUID().slice(0, 8)}`;
};

export const createObjectURL = (file: File, disallowPreviewForNonImageFiles: boolean | undefined) => {
	if (disallowPreviewForNonImageFiles && !file.type.startsWith("image/")) return;

	return createImagePreview(file);
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
