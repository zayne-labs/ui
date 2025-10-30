import { createCustomContext } from "@zayne-labs/toolkit-react";
import { createReactStoreContext } from "@zayne-labs/toolkit-react/zustand";
import type { DropZoneStore, FileState, UseDropZoneResult } from "./types";

const [DropZoneStoreContextProvider, useDropZoneStoreContext] = createReactStoreContext<DropZoneStore>({
	hookName: "useDropZoneStoreContext",
	name: "DropZoneStoreContext",
	providerName: "DropZoneRoot",
});

export type DropZoneRootContextType = Pick<
	UseDropZoneResult,
	"disabled" | "disableInternalStateSubscription" | "inputRef" | "propGetters"
>;

const [DropZoneRootContextProvider, useDropZoneRootContext] = createCustomContext<DropZoneRootContextType>(
	{
		hookName: "useDropZoneRootContext",
		name: "DropZoneRootContext",
		providerName: "DropZoneRoot",
	}
);

export type FileItemContextType = {
	fileState: FileState;
};

const [FileItemContextProvider, useFileItemContext] = createCustomContext({
	defaultValue: null as unknown as FileItemContextType,
	hookName: "useFileItemContext",
	name: "FileItemContext",
	providerName: "FileItem",
	strict: false,
});

export {
	DropZoneRootContextProvider,
	DropZoneStoreContextProvider,
	FileItemContextProvider,
	useDropZoneRootContext,
	useDropZoneStoreContext,
	useFileItemContext,
};
