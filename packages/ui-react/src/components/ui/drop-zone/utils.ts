import type { FileMeta } from "@zayne-labs/toolkit-core";
import { isFile } from "@zayne-labs/toolkit-type-helpers";
import type { FileWithPreview } from "./use-drop-zone";

export const generateUniqueId = (file: File | FileMeta): string => {
	if (!isFile(file)) {
		return file.id;
	}

	return `${file.name}-(${Math.round(performance.now())})-${crypto.randomUUID().slice(0, 8)}`;
};

export const clearObjectURL = (fileObject: FileWithPreview | undefined) => {
	const shouldClearObjectURL = isFile(fileObject?.file) && fileObject.file.type.startsWith("image/");

	if (fileObject?.preview && shouldClearObjectURL) {
		URL.revokeObjectURL(fileObject.preview);
	}
};
