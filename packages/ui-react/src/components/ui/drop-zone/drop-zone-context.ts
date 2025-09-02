import { createCustomContext } from "@zayne-labs/toolkit-react";
import { createZustandContext } from "@zayne-labs/toolkit-react/zustand";
import type { DropZoneStore } from "./drop-zone-store";
import type { DropZonePropGetters, FileState } from "./types";

const [DropZoneStoreContextProvider, useDropZoneStoreContext] = createZustandContext<DropZoneStore>({
	hookName: "useDropZoneStoreContext",
	name: "DropZoneStoreContext",
	providerName: "DropZoneRoot",
});

const [DropZonePropGettersContextProvider, usePropGettersContext] =
	createCustomContext<DropZonePropGetters>({
		hookName: "usePropGettersContext",
		name: "PropGettersContext",
		providerName: "DropZoneRoot",
	});

export type FileItemContextType = {
	fileItemOrID: FileState["file"] | FileState["id"] | undefined;
};

const [FileItemContextProvider, useFileItemContext] = createCustomContext<FileItemContextType, false>({
	hookName: "useFileItemContext",
	name: "FileItemContext",
	providerName: "FileItem",
	strict: false,
});

export {
	DropZoneStoreContextProvider,
	FileItemContextProvider,
	useFileItemContext,
	useDropZoneStoreContext,
	DropZonePropGettersContextProvider,
	usePropGettersContext,
};
