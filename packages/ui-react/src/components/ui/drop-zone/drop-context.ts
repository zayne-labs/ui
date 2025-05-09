import { createCustomContext } from "@zayne-labs/toolkit-react";
import type { UseDropZoneResult } from "./use-drop-zone";

type DropZoneContext = UseDropZoneResult;

export const [DropZoneContextProvider, useDropZoneContext] = createCustomContext<DropZoneContext>({
	hookName: "useDropZoneContext",
	name: "DropZoneContext",
	providerName: "DropZoneRoot",
});
