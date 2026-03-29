import { createCustomContext } from "@zayne-labs/toolkit-react";
import { createReactStoreContext } from "@zayne-labs/toolkit-react/zustand";
import type { DragScrollStore, UseDragScrollResult } from "./types";

const [DragScrollStoreContextProvider, useDragScrollStoreContext] =
	createReactStoreContext<DragScrollStore>({
		hookName: "useDragScrollStoreContext",
		name: "DragScrollStoreContext",
		providerName: "DragScrollRoot",
	});

export type DragScrollRootContextType<TElement extends HTMLElement = HTMLElement> = Pick<
	UseDragScrollResult<TElement>,
	"disableInternalStateSubscription" | "listRef" | "propGetters"
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
