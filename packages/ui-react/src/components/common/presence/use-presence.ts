import { on } from "@zayne-labs/toolkit-core";
import { useCallbackRef } from "@zayne-labs/toolkit-react";
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";

type StateMachineConfig<TState extends string, TEvent extends string> = {
	initial: TState;
	states: Record<TState, Partial<Record<TEvent, TState>>>;
};

const useStateMachine = <TState extends string, TEvent extends string>(
	config: StateMachineConfig<TState, TEvent>
) => {
	const reducer = (prevState: TState, event: TEvent): TState => {
		const newState = config.states[prevState][event] ?? prevState;

		return newState;
	};

	return useReducer(reducer, config.initial);
};

const getAnimationName = (styles: CSSStyleDeclaration | null) => styles?.animationName ?? "none";

export type UsePresenceOptions = {
	onExitComplete?: () => void;
	present: boolean;
};

/**
 * React hook that provides the ability to animate the mount/unmount of a component.
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/presence/src/presence.tsx
 */

const usePresence = (options: UsePresenceOptions) => {
	const { onExitComplete, present } = options;

	const saveOnExitComplete = useCallbackRef(onExitComplete);

	const [node, setNode] = useState<HTMLElement | null>(null);

	const stylesRef = useRef<CSSStyleDeclaration | null>(null);

	const prevPresentRef = useRef(present);
	const prevAnimationNameRef = useRef<string>("none");

	const initialState = present ? "mounted" : "unmounted";

	const [state, send] = useStateMachine({
		initial: initialState,
		states: {
			mounted: {
				ANIMATION_OUT: "unmountSuspended",
				UNMOUNT: "unmounted",
			},
			unmounted: {
				MOUNT: "mounted",
			},
			unmountSuspended: {
				ANIMATION_END: "unmounted",
				MOUNT: "mounted",
			},
		},
	});

	useEffect(() => {
		const currentAnimationName = getAnimationName(stylesRef.current);
		prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
	}, [state]);

	useLayoutEffect(() => {
		const styles = stylesRef.current;
		const wasPresent = prevPresentRef.current;
		const hasPresentChanged = wasPresent !== present;

		if (!hasPresentChanged) return;

		const prevAnimationName = prevAnimationNameRef.current;
		const currentAnimationName = getAnimationName(styles);

		switch (true) {
			case present: {
				send("MOUNT");
				break;
			}

			case Boolean(node): {
				const hasAnimation =
					(currentAnimationName !== "none" && styles?.display !== "none")
					|| (styles?.transitionProperty !== "none" && Number(styles?.transitionDuration) > 0);

				/* If there is no exit animation or the element is hidden, animations won't run, so we unmount instantly */
				if (!hasAnimation) {
					send("UNMOUNT");
					break;
				}

				/**
				 * When `present` changes to `false`, we check changes to animation-name to
				 * determine whether an animation has started. We chose this approach (reading
				 * computed styles) because there is no `animationrun` event and `animationstart`
				 * fires after `animation-delay` has expired which would be too late.
				 */

				const isAnimating = prevAnimationName !== currentAnimationName;

				const isAnimatingOut = wasPresent && isAnimating;

				if (!isAnimatingOut) {
					send("UNMOUNT");
					break;
				}

				send("ANIMATION_OUT");
				break;
			}

			default: {
				send("UNMOUNT");
				break;
			}
		}

		prevPresentRef.current = present;
	}, [present, node, send]);

	useLayoutEffect(() => {
		if (!node) {
			// Transition to the unmounted state if the node is removed prematurely.
			// We avoid doing so during cleanup as the node may change but still exist.
			send("ANIMATION_END");
			return;
		}

		let timeoutId: number;

		const ownerWindow = node.ownerDocument.defaultView ?? globalThis;

		/**
		 * @description Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
		 * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
		 * make sure we only trigger ANIMATION_END for the currently active animation.
		 */
		const handleAnimationEnd = (event: AnimationEvent) => {
			const currentAnimationName = getAnimationName(stylesRef.current);

			// The event.animationName is unescaped for CSS syntax, so we need to escape it to compare with the animationName computed from the style.
			const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));

			const isTargetAnimatingNode = event.target === node && isCurrentAnimation;

			if (!isTargetAnimatingNode) return;

			// With React 18 concurrency this update is applied a frame after the
			// animation ends, creating a flash of visible content. By setting the
			// animation fill mode to "forwards", we force the node to keep the
			// styles of the last keyframe, removing the flash.

			// Previously we flushed the update via ReactDom.flushSync, but with
			// exit animations this resulted in the node being removed from the
			// DOM before the synthetic animationEnd event was dispatched, meaning
			// user-provided event handlers would not be called.
			// https://github.com/radix-ui/primitives/pull/1849
			send("ANIMATION_END");

			if (!prevPresentRef.current) {
				const currentFillMode = node.style.animationFillMode;
				node.style.animationFillMode = "forwards";

				// Reset the style after the node had time to unmount (for cases
				// where the component chooses not to unmount). Doing this any
				// sooner than `setTimeout` (e.g. with `requestAnimationFrame`)
				// still causes a flash.
				timeoutId = ownerWindow.setTimeout(() => {
					if (node.style.animationFillMode === "forwards") {
						node.style.animationFillMode = currentFillMode;
					}
				}) as never;
			}
		};

		const handleTransitionEnd = (event: TransitionEvent) => {
			const isTargetTransitioningNode = event.target === node && !prevPresentRef.current;

			if (!isTargetTransitioningNode) return;

			send("ANIMATION_END");
		};

		const handleAnimationStart = (event: AnimationEvent) => {
			const isTargetAnimatingNode = event.target === node;

			if (!isTargetAnimatingNode) return;

			prevAnimationNameRef.current = getAnimationName(stylesRef.current);
		};

		const onAnimationStartCleanup = on("animationstart", node, handleAnimationStart);
		const onAnimationEndCleanup = on("animationend", node, handleAnimationEnd);
		const onAnimationCancelCleanup = on("animationcancel", node, handleAnimationEnd);
		const onTransitionEndCleanup = on("transitionend", node, handleTransitionEnd);
		const onTransitionCancelCleanup = on("transitioncancel", node, handleTransitionEnd);

		return () => {
			ownerWindow.clearTimeout(timeoutId);
			onAnimationStartCleanup();
			onAnimationEndCleanup();
			onAnimationCancelCleanup();
			onTransitionEndCleanup();
			onTransitionCancelCleanup();
		};
	}, [node, send]);

	useEffect(() => {
		const isExitCompleted = state === "unmounted" && !present;

		if (!isExitCompleted) return;

		saveOnExitComplete();
	}, [state, present, saveOnExitComplete]);

	const isPresent = (["mounted", "unmountSuspended"] satisfies Array<typeof state>).includes(state);

	const ref = useCallbackRef((refNode: HTMLElement | null) => {
		refNode && (stylesRef.current = getComputedStyle(refNode));
		setNode(refNode);
	});

	return {
		isPresent,
		ref,
	};
};

export { usePresence };
