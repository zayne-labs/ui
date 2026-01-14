import { createCustomContext } from "@zayne-labs/toolkit-react";
import { createReactStoreContext } from "@zayne-labs/toolkit-react/zustand";
import type { DragScrollStore, UseDragScrollResult } from "./types";

const [DragScrollStoreContextProvider, useDragScrollStoreContext] = createReactStoreContext<
	DragScrollStore<HTMLElement>
>({
	hookName: "useDragScrollStoreContext",
	name: "DragScrollStoreContext",
	providerName: "DragScrollRoot",
});

export type DragScrollRootContextType = Pick<
	UseDragScrollResult<HTMLElement>,
	"containerRef" | "disableInternalStateSubscription" | "propGetters"
>;

const [DragScrollRootContextProvider, useDragScrollRootContext] =
	createCustomContext<DragScrollRootContextType>({
		hookName: "useDragScrollRootContext",
		name: "DragScrollRootContext",
		providerName: "DragScrollRoot",
	});

export {
	DragScrollRootContextProvider,
	DragScrollStoreContextProvider,
	useDragScrollRootContext,
	useDragScrollStoreContext,
};
