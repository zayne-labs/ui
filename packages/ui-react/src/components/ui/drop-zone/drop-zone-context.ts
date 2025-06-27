import { createCustomContext } from "@zayne-labs/toolkit-react";
import { createZustandContext } from "@zayne-labs/toolkit-react/zustand";
import type { DropZoneStore } from "./drop-zone-store";
import type { DropZonePropGetters } from "./types";

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

export {
	DropZoneStoreContextProvider,
	useDropZoneStoreContext,
	DropZonePropGettersContextProvider,
	usePropGettersContext,
};
