import { type FileMeta, createImagePreview } from "@zayne-labs/toolkit-core";
import { isFile } from "@zayne-labs/toolkit-type-helpers";
import type { FileWithPreview } from "./use-drop-zone";

export const generateUniqueId = (file: File | FileMeta): string => {
	if (!isFile(file)) {
		return file.id;
	}

	return `${file.name}-(${Math.round(performance.now())})-${crypto.randomUUID().slice(0, 8)}`;
};

export const createObjectURL = (file: File, disallowPreviewForNonImageFiles: boolean) => {
	if (disallowPreviewForNonImageFiles && !file.type.startsWith("image/")) return;

	return createImagePreview(file);
};

export const clearObjectURL = (
	fileWithPreview: FileWithPreview | undefined,
	disallowPreviewForNonImageFiles: boolean
) => {
	if (!isFile(fileWithPreview?.file)) return;

	if (disallowPreviewForNonImageFiles && !fileWithPreview.file.type.startsWith("image/")) return;

	if (!fileWithPreview.preview) return;

	URL.revokeObjectURL(fileWithPreview.preview);
};
