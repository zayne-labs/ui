"use client";

import * as React from "react";

import { useCallbackRef } from "@zayne-labs/toolkit-react";
import { type InferProps, composeRefs } from "@zayne-labs/toolkit-react/utils";
import { useEffect, useRef, useState } from "react";
import {
	focusElement,
	focusFirst,
	focusScopesStack,
	getTabbableCandidates,
	getTabbableEdges,
	removeLinks,
} from "./utils";

/* -------------------------------------------------------------------------------------------------
 * FocusScope
 *  Copied and modified from @radix-ui/react-focus-scope
 * @see https://github.com/radix-ui/primitives/tree/main/packages/react/focus-scope
 * ----------------------------------------------------------------------------------------------- */

type FocusScopeElement = React.ComponentRef<"div">;

type FocusScopeProps = Omit<InferProps<"div">, "ref"> & {
	/**
	 * When `true`, tabbing from last item will focus first tabbable
	 * and shift+tab from first item will focus last tababble.
	 * @defaultValue false
	 */
	loop?: boolean;
	/**
	 * Event handler called when auto-focusing on mount.
	 * Can be prevented.
	 */
	onMountAutoFocus?: (event: Event) => void;
	/**
	 * Event handler called when auto-focusing on unmount.
	 * Can be prevented.
	 */
	onUnmountAutoFocus?: (event: Event) => void;

	ref?: React.Ref<FocusScopeElement>;

	/**
	 * When `true`, focus cannot escape the focus scope via keyboard,
	 * pointer, or a programmatic focus.
	 * @defaultValue false
	 */
	trapped?: boolean;
};

const AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
const AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

function FocusScope(props: FocusScopeProps) {
	const {
		loop = false,
		onMountAutoFocus,
		onUnmountAutoFocus,
		ref: forwardedRef,
		trapped = false,
		...scopeProps
	} = props;
	const [container, setContainer] = useState<HTMLElement | null>(null);

	const savedOnMountAutoFocus = useCallbackRef(onMountAutoFocus);

	const savedOnUnmountAutoFocus = useCallbackRef(onUnmountAutoFocus);

	const lastFocusedElementRef = useRef<HTMLElement | null>(null);
	const composedRefs = composeRefs([forwardedRef, (node) => setContainer(node)]);

	const focusScope = useRef({
		pause() {
			this.paused = true;
		},
		paused: false,
		resume() {
			this.paused = false;
		},
	}).current;

	useEffect(() => {
		if (!trapped) return;

		const handleFocusIn = function (event: FocusEvent) {
			if (focusScope.paused || !container) return;
			const target = event.target as HTMLElement;
			if (container.contains(target)) {
				lastFocusedElementRef.current = target;
			} else {
				focusElement(lastFocusedElementRef.current, { select: true });
			}
		};

		const handleFocusOut = function (event: FocusEvent) {
			if (focusScope.paused || !container) return;
			const relatedTarget = event.relatedTarget as HTMLElement | null;
			if (relatedTarget === null) return;
			if (!container.contains(relatedTarget)) {
				focusElement(lastFocusedElementRef.current, { select: true });
			}
		};

		const handleMutations = function (mutations: MutationRecord[]) {
			const focusedElement = document.activeElement;
			if (focusedElement !== document.body) return;
			for (const mutation of mutations) {
				if (mutation.removedNodes.length > 0) focusElement(container);
			}
		};

		document.addEventListener("focusin", handleFocusIn);
		document.addEventListener("focusout", handleFocusOut);
		const mutationObserver = new MutationObserver(handleMutations);

		if (container) {
			mutationObserver.observe(container, { childList: true, subtree: true });
		}

		return () => {
			document.removeEventListener("focusin", handleFocusIn);
			document.removeEventListener("focusout", handleFocusOut);
			mutationObserver.disconnect();
		};
	}, [trapped, container, focusScope.paused]);

	useEffect(() => {
		if (!container) return;

		focusScopesStack.add(focusScope);

		const previouslyFocusedElement = document.activeElement;
		const hasFocusedCandidate = container.contains(previouslyFocusedElement);

		if (!hasFocusedCandidate) {
			const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
			container.addEventListener(AUTOFOCUS_ON_MOUNT, savedOnMountAutoFocus);
			container.dispatchEvent(mountEvent);

			if (!mountEvent.defaultPrevented) {
				focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });
				document.activeElement === previouslyFocusedElement && focusElement(container);
			}
		}

		return () => {
			container.removeEventListener(AUTOFOCUS_ON_MOUNT, savedOnMountAutoFocus);

			// eslint-disable-next-line react-web-api/no-leaked-timeout -- Allow
			setTimeout(() => {
				const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
				// eslint-disable-next-line react-web-api/no-leaked-event-listener -- Allow
				container.addEventListener(AUTOFOCUS_ON_UNMOUNT, savedOnUnmountAutoFocus);
				container.dispatchEvent(unmountEvent);
				if (!unmountEvent.defaultPrevented) {
					focusElement(document.body, { select: true });
				}
				container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, savedOnUnmountAutoFocus);
				focusScopesStack.remove(focusScope);
			}, 0);
		};
	}, [container, savedOnMountAutoFocus, savedOnUnmountAutoFocus, focusScope]);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (!loop && !trapped) return;
		if (focusScope.paused) return;

		const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
		const focusedElement = document.activeElement;

		if (!(isTabKey && focusedElement)) return;

		const container2 = event.currentTarget;
		const [first, last] = getTabbableEdges(container2);
		const hasTabbableElementsInside = first && last;

		if (!hasTabbableElementsInside && focusedElement === container2) {
			event.preventDefault();
			return;
		}

		if (!event.shiftKey && focusedElement === last) {
			event.preventDefault();
			if (loop && first) {
				focusElement(first, { select: true });
			}
		}

		if (event.shiftKey && focusedElement === first) {
			event.preventDefault();
			if (loop && last) {
				focusElement(last, { select: true });
			}
		}
	};

	return <div tabIndex={-1} {...scopeProps} onKeyDown={handleKeyDown} ref={composedRefs} />;
}

export { FocusScope };
