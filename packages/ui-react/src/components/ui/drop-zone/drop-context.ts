import { createCustomContext } from "@zayne-labs/toolkit-react";
import type { UseDropZoneResult } from "./use-drop-zone";

const [DropZoneContextProvider, useDropZoneContext] = createCustomContext<UseDropZoneResult>({
	hookName: "useDropZoneContext",
	name: "DropZoneContext",
	providerName: "DropZoneRoot",
});

export { DropZoneContextProvider, useDropZoneContext };
