import { createCustomContext } from "@zayne-labs/toolkit-react";
import type { DropZoneResult } from "./use-drop-zone";

type DropZoneContext = DropZoneResult;

export const [DropZoneContextProvider, useDropZoneContext] = createCustomContext<DropZoneContext>({
	hookName: "useDropZoneContext",
	name: "DropZoneContext",
	providerName: "DropZoneRoot",
});
